import { ensureSchema } from '../lib/schema.js'
import { runWorker } from '../lib/email/worker.js'
import { enqueueAutomatedReminders } from '../lib/email/autoReminders.js'
import { isAuthenticated } from '../lib/auth.js'
import { ok, fail, getQueryParam } from '../lib/http.js'

/**
 * Drains the email queue and automatically dispatches due 24h & 1h workshop reminders.
 * Triggered by:
 *   - Vercel cron (sends `Authorization: Bearer $CRON_SECRET` automatically)
 *   - GitHub Actions every 6 hours (Hobby crons are daily-only)
 *   - The admin panel, using an authenticated session instead of the secret
 *
 * Always returns 200 with a summary, even on internal failure. Returning 5xx just makes
 * schedulers retry-storm a broken endpoint, and cron platforms alert on it uselessly.
 */
export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET
  const bearer = (req.headers?.authorization || '').replace(/^Bearer\s+/i, '')
  const supplied = bearer || getQueryParam(req, 'token') || ''

  const authorised =
    (secret && supplied && supplied === secret) || isAuthenticated(req)

  if (!authorised) {
    return fail(res, 'UNAUTHORIZED', 'Missing or invalid cron credentials.', 401)
  }

  try {
    await ensureSchema()
    const reminderStats = await enqueueAutomatedReminders().catch((err) => {
      console.error('Reminder enqueue error:', err)
      return null
    })
    const summary = await runWorker()
    return ok(res, { summary, reminderStats, ranAt: new Date().toISOString() })
  } catch (error) {
    console.error('cron/process-emails error:', error)
    return ok(res, { summary: { ok: false, error: error.message } })
  }
}

// Give the batch room to drain. Hobby allows up to 60s.
export const config = { maxDuration: 60 }
