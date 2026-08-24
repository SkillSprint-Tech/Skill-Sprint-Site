import { getPool } from '../db.js'
import { ensureSchema } from '../schema.js'
import { applyCors, ok, fail, methodNotAllowed } from '../http.js'
import { requireAdmin } from '../auth.js'
import { sendOneJob, runWorker } from '../email/worker.js'
import { readUsage, nextResetAt } from '../email/quota.js'

/**
 * POST { jobId }            → send that one email now
 * POST { registrationId }   → same, resolved via the registration
 * POST { all: true }        → drain a batch of everything outstanding
 *
 * Running out of daily quota is NOT an error here. It returns 200 with
 * code QUOTA_EXHAUSTED so the panel can show an amber toast, and the job stays queued
 * for the next automatic run rather than being marked failed.
 */
export default async function handler(req, res) {
  if (applyCors(req, res, 'POST,OPTIONS')) return
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])
  if (requireAdmin(req, res)) return

  try {
    await ensureSchema()
    const pool = getPool()
    const body = req.body || {}

    // ── Bulk ──────────────────────────────────────────────────────────────
    if (body.all === true) {
      const summary = await runWorker({ limit: 50 })
      const usage = await readUsage(pool)

      if (summary.sent === 0 && summary.deferred > 0) {
        return ok(res, {
          ok: false,
          code: 'QUOTA_EXHAUSTED',
          message: 'Daily sending limit reached. Queued emails will send automatically after reset.',
          resets_at: nextResetAt().toISOString(),
          usage,
          summary,
        })
      }
      return ok(res, { summary, usage })
    }

    // ── Single ────────────────────────────────────────────────────────────
    let jobId = body.jobId

    if (!jobId && body.registrationId) {
      const { rows } = await pool.query(
        `SELECT id FROM email_jobs
          WHERE registration_id = $1 AND template = 'welcome_schedule'`,
        [body.registrationId]
      )
      if (!rows.length) {
        // A registration with no job (e.g. created before the queue existed) — enqueue it
        // rather than reporting a confusing "not found".
        const created = await pool.query(
          `INSERT INTO email_jobs (registration_id, template)
           VALUES ($1, 'welcome_schedule')
           ON CONFLICT (registration_id, template) DO NOTHING
           RETURNING id`,
          [body.registrationId]
        )
        jobId = created.rows[0]?.id
      } else {
        jobId = rows[0].id
      }
    }

    if (!jobId) return fail(res, 'MISSING_ID', 'A jobId or registrationId is required.')

    const result = await sendOneJob(jobId)

    // Deliberately 200 even when ok:false — this is a normal operational state, and a
    // non-2xx would make the frontend treat a full quota as a broken request.
    return ok(res, result)
  } catch (error) {
    console.error('admin/send-email error:', error)
    return fail(res, 'SERVER_ERROR', error.message || 'Could not send.', 500)
  }
}

export const config = { maxDuration: 60 }
