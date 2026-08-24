import { getPool } from '../db.js'
import { ensureSchema } from '../schema.js'
import { applyCors, ok, fail, methodNotAllowed } from '../http.js'
import { requireAdmin } from '../auth.js'
import { readUsage, nextResetAt, configuredProviders } from '../email/quota.js'

export default async function handler(req, res) {
  if (applyCors(req, res, 'GET,OPTIONS')) return
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])
  if (requireAdmin(req, res)) return

  try {
    await ensureSchema()
    const pool = getPool()

    const [totals, statuses, usage, recent] = await Promise.all([
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
    ])

    const byStatus = Object.fromEntries(statuses.rows.map((r) => [r.status, r.count]))
    const get = (key) => byStatus[key] ?? 0

    // "Not received" is what the dashboard actually acts on: anything queued, deferred,
    // failed or bounced. A job marked 'sent' is only *accepted* by the provider — real
    // receipt is confirmed separately by the delivery webhook.
    const notReceived = get('pending') + get('deferred') + get('failed') + get('bounced')

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
      },
      quota: {
        usage,
        resets_at: nextResetAt().toISOString(),
        configured: configuredProviders(),
      },
    })
  } catch (error) {
    console.error('admin/stats error:', error)
    return fail(res, 'SERVER_ERROR', error.message || 'Could not load stats.', 500)
  }
}
