import { getPool } from '../db.js'
import { ensureSchema } from '../schema.js'
import { applyCors, ok, fail, methodNotAllowed } from '../http.js'
import { requireAdmin } from '../auth.js'
import { runWorker } from '../email/worker.js'
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
      'SELECT id, title, meeting_link, starts_at FROM workshops WHERE id = $1',
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

    // Queue one reminder per registration. ON CONFLICT DO NOTHING means clicking twice
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
        usage,
        summary,
      })
    }

    return ok(res, {
      newlyQueued: queued.rowCount,
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
