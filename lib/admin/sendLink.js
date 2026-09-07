import { getPool } from '../db.js'
import { ensureSchema } from '../schema.js'
import { applyCors, ok, fail, methodNotAllowed } from '../http.js'
import { requireAdmin } from '../auth.js'
import { runWorker, sendTestReminder } from '../email/worker.js'
import { readUsage, nextResetAt, configuredProviders } from '../email/quota.js'

/**
 * POST { workshopId }  → queue the meeting link to every registrant, then drain a batch.
 * GET  ?workshopId=…   → how many would receive it / have already received it.
 *
 * Uses template key `reminder:<workshopId>`, so UNIQUE (registration_id, template)
 * guarantees one reminder per person per workshop no matter how often this is clicked.
 * Re-clicking picks up anyone who registered since, and nobody gets a duplicate.
 */
export default async function handler(req, res) {
  if (applyCors(req, res, 'GET,POST,OPTIONS')) return
  if (requireAdmin(req, res)) return

  try {
    await ensureSchema()
    const pool = getPool()

    const workshopId =
      req.method === 'POST' ? req.body?.workshopId : new URL(req.url, 'http://x').searchParams.get('workshopId')

    if (!workshopId) return fail(res, 'MISSING_ID', 'A workshopId is required.')

    const { rows: wRows } = await pool.query(
      `SELECT id, title, description, speaker, speaker_role, meeting_link,
              starts_at, duration_mins, location
         FROM workshops WHERE id = $1`,
      [workshopId]
    )
    const workshop = wRows[0]
    if (!workshop) return fail(res, 'NOT_FOUND', 'Workshop not found.', 404)

    const template = `reminder:${workshopId}`

    if (req.method === 'GET') {
      const { rows } = await pool.query(
        `SELECT
           (SELECT count(*)::int FROM registrations WHERE unsubscribed_at IS NULL) AS total,
           (SELECT count(*)::int FROM email_jobs WHERE template = $1) AS queued,
           (SELECT count(*)::int FROM email_jobs
             WHERE template = $1 AND status IN ('sent','delivered')) AS sent`,
        [template]
      )
      return ok(res, { ...rows[0], hasLink: Boolean(workshop.meeting_link) })
    }

    if (req.method !== 'POST') return methodNotAllowed(res, ['GET', 'POST'])

    // Refuse rather than send a useless email with no link in it.
    if (!workshop.meeting_link) {
      return ok(res, {
        ok: false,
        code: 'NO_LINK',
        message: 'Add a meeting link to this workshop first, then send.',
      })
    }

    // ── Test send ─────────────────────────────────────────────────────────
    // Renders the real template and sends it to one address, touching neither the queue
    // nor the registrations table. The point is to see the email exactly as an attendee
    // will before committing it to everyone.
    if (req.body?.testEmail) {
      const to = String(req.body.testEmail).trim().toLowerCase()
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(to)) {
        return fail(res, 'INVALID_EMAIL', 'Enter a valid email address to test with.')
      }

      const result = await sendTestReminder({ workshop, to })
      if (result.outcome !== 'sent') {
        return ok(res, {
          ok: false,
          code: result.outcome === 'quota' ? 'QUOTA_EXHAUSTED' : 'SEND_FAILED',
          message: result.error || 'Could not send the test email.',
          usage: await readUsage(pool),
        })
      }
      return ok(res, { test: true, to, provider: result.provider, subject: result.subject })
    }

    // Queue one reminder per registration. ON CONFLICT DO NOTHING means an ordinary send
    // only ever adds people who registered since the last click. People who opted out are
    // skipped here rather than queued and then failed by the worker — otherwise every
    // unsubscribe would inflate the dashboard's "failed" count on each send.
    const queued = await pool.query(
      `INSERT INTO email_jobs (registration_id, template)
       SELECT r.id, $1 FROM registrations r
        WHERE r.unsubscribed_at IS NULL
       ON CONFLICT (registration_id, template) DO NOTHING
       RETURNING id`,
      [template]
    )

    // ── Resend to everyone ────────────────────────────────────────────────
    // The idempotency that protects an ordinary send is exactly what makes a deliberate
    // resend do nothing: everyone already has a job, so ON CONFLICT skips them all and
    // only new registrants receive anything. `resendAll` clears the delivery state on
    // existing jobs so the worker picks them up again and the whole list is mailed.
    let requeued = 0
    if (req.body?.resendAll === true) {
      const reset = await pool.query(
        `UPDATE email_jobs j
            SET status = 'pending', attempts = 0, next_attempt_at = now(),
                sent_at = NULL, delivered_at = NULL, last_error = NULL,
                provider = NULL, provider_message_id = NULL,
                locked_at = NULL, locked_by = NULL, updated_at = now()
          FROM registrations r
         WHERE j.registration_id = r.id
           AND j.template = $1
           AND r.unsubscribed_at IS NULL
         RETURNING j.id`,
        [template]
      )
      requeued = reset.rowCount
    }

    await pool.query(
      'UPDATE workshops SET link_sent_at = now(), updated_at = now() WHERE id = $1',
      [workshopId]
    )

    const summary = await runWorker({ limit: 50 })
    const usage = await readUsage(pool)

    if (summary.sent === 0 && summary.deferred > 0) {
      return ok(res, {
        ok: false,
        code: configuredProviders().length ? 'QUOTA_EXHAUSTED' : 'NO_PROVIDER',
        message: 'Daily sending limit reached. The links stay queued and go out after reset.',
        resets_at: nextResetAt().toISOString(),
        newlyQueued: queued.rowCount,
        requeued,
        usage,
        summary,
      })
    }

    return ok(res, {
      newlyQueued: queued.rowCount,
      requeued,
      title: workshop.title,
      summary,
      usage,
    })
  } catch (error) {
    console.error('admin/send-link error:', error)
    return fail(res, 'SERVER_ERROR', error.message || 'Could not send the meeting link.', 500)
  }
}

export const config = { maxDuration: 60 }
