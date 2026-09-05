import { getPool } from '../db.js'
import { ensureSchema } from '../schema.js'
import { applyCors, ok, fail, methodNotAllowed } from '../http.js'
import { requireAdmin } from '../auth.js'
import { readUsage, nextResetAt, configuredProviders } from '../email/quota.js'
import { senderDomain, isPlaceholderSender } from '../email/providers.js'
import { STUCK_AFTER_MINUTES } from '../email/worker.js'

export default async function handler(req, res) {
  if (applyCors(req, res, 'GET,OPTIONS')) return
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])
  if (requireAdmin(req, res)) return

  try {
    await ensureSchema()
    const pool = getPool()

    const [totals, statuses, usage, recent, stuckRows] = await Promise.all([
      pool.query(`
        SELECT
          (SELECT count(*)::int FROM registrations) AS registrations,
          (SELECT count(*)::int FROM workshops)     AS workshops,
          (SELECT count(*)::int FROM registrations
            WHERE created_at > now() - interval '7 days') AS registrations_7d
      `),
      pool.query(`SELECT status, count(*)::int AS count FROM email_jobs GROUP BY status`),
      readUsage(pool),
      pool.query(`
        SELECT count(*)::int AS count
          FROM email_jobs
         WHERE status = 'sent'
           AND delivered_at IS NULL
           AND sent_at < now() - interval '24 hours'
      `),
      // Jobs a worker claimed and never finished — the invocation died mid-send. They are
      // not retrying and not failed; they are simply abandoned, and stay that way until
      // something calls the worker again. Counting them is what makes them recoverable
      // from the panel instead of waiting for the nightly cron.
      pool.query(
        `SELECT count(*)::int AS count,
                min(locked_at) AS oldest_lock
           FROM email_jobs
          WHERE status = 'processing'
            AND locked_at < now() - ($1 || ' minutes')::interval`,
        [String(STUCK_AFTER_MINUTES)]
      ),
    ])

    const byStatus = Object.fromEntries(statuses.rows.map((r) => [r.status, r.count]))
    const get = (key) => byStatus[key] ?? 0

    const stuck = stuckRows.rows[0].count

    // "Not received" is what the dashboard actually acts on: anything queued, deferred,
    // failed or bounced. A job marked 'sent' is only *accepted* by the provider — real
    // receipt is confirmed separately by the delivery webhook.
    //
    // Abandoned 'processing' jobs count too. Leaving them out was a trap: they are
    // outstanding by every definition that matters, but the bulk Send button is disabled
    // when this number is zero — so a queue containing nothing but stranded jobs offered
    // no way to release them, even though running the worker is exactly what does.
    const notReceived =
      get('pending') + get('deferred') + get('failed') + get('bounced') + stuck

    return ok(res, {
      totals: {
        registrations: totals.rows[0].registrations,
        registrations_7d: totals.rows[0].registrations_7d,
        workshops: totals.rows[0].workshops,
      },
      email: {
        pending: get('pending'),
        processing: get('processing'),
        deferred: get('deferred'),
        sent: get('sent'),
        delivered: get('delivered'),
        bounced: get('bounced'),
        failed: get('failed'),
        notReceived,
        unconfirmed: recent.rows[0].count,
        stuck,
        oldest_lock: stuckRows.rows[0].oldest_lock,
        stuck_after_minutes: STUCK_AFTER_MINUTES,
      },
      quota: {
        usage,
        resets_at: nextResetAt().toISOString(),
        configured: configuredProviders(),
      },
      // What the app is actually sending as. A provider rejecting the From domain reports
      // it per-message, buried in a row's error text; surfacing it once at the top is the
      // difference between "our domain is broken" and "one env var is wrong".
      sender: {
        resend: {
          domain: senderDomain(process.env.RESEND_FROM),
          set: Boolean(process.env.RESEND_FROM),
          placeholder: isPlaceholderSender(process.env.RESEND_FROM),
        },
        brevo: {
          domain: senderDomain(process.env.BREVO_FROM),
          set: Boolean(process.env.BREVO_FROM),
          placeholder: isPlaceholderSender(process.env.BREVO_FROM),
        },
      },
    })
  } catch (error) {
    console.error('admin/stats error:', error)
    return fail(res, 'SERVER_ERROR', error.message || 'Could not load stats.', 500)
  }
}
