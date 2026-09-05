import { getPool } from '../db.js'
import { ensureSchema } from '../schema.js'
import { applyCors, ok, fail, methodNotAllowed, getQueryParam } from '../http.js'
import { requireAdmin } from '../auth.js'
import { STUCK_AFTER_MINUTES } from '../email/worker.js'

/**
 * Shared query builder for the table view and the CSV export, so the export always
 * reflects exactly what the operator is looking at on screen.
 */
export function buildQuery({ search, status, limit, offset }) {
  const where = []
  const params = []

  if (search) {
    params.push(`%${search.toLowerCase()}%`)
    const p = `$${params.length}`
    where.push(`(lower(r.full_name) LIKE ${p} OR lower(r.email) LIKE ${p} OR lower(r.university) LIKE ${p})`)
  }

  const staleLock = `j.locked_at < now() - interval '${STUCK_AFTER_MINUTES} minutes'`

  if (status && status !== 'all') {
    if (status === 'not_received') {
      // Mirrors stats.notReceived, abandoned 'processing' rows included.
      where.push(
        `(COALESCE(j.status, 'pending') IN ('pending','deferred','failed','bounced')
          OR (j.status = 'processing' AND ${staleLock}))`
      )
    } else if (status === 'stuck') {
      where.push(`j.status = 'processing' AND ${staleLock}`)
    } else {
      params.push(status)
      where.push(`COALESCE(j.status, 'pending') = $${params.length}`)
    }
  }

  const clause = where.length ? `WHERE ${where.join(' AND ')}` : ''

  let sql = `
    SELECT
      r.id, r.full_name, r.email, r.phone, r.university, r.year_of_study,
      r.skill_level, r.interests, r.created_at,
      j.id AS job_id,
      COALESCE(j.status, 'pending') AS email_status,
      j.provider, j.attempts, j.last_error, j.sent_at, j.delivered_at,
      -- locked_at is how the panel tells "sending right now" from "abandoned an hour ago".
      -- Without it every claimed job looks identical, which is exactly the case where the
      -- operator most needs to know which one it is.
      j.locked_at, j.locked_by,
      (j.status = 'processing' AND ${staleLock}) AS is_stuck
    FROM registrations r
    LEFT JOIN email_jobs j
      ON j.registration_id = r.id AND j.template = 'welcome_schedule'
    ${clause}
    ORDER BY r.created_at DESC
  `

  if (limit != null) {
    params.push(limit)
    sql += ` LIMIT $${params.length}`
    params.push(offset || 0)
    sql += ` OFFSET $${params.length}`
  }

  return { sql, params, clause, whereParams: params }
}

export default async function handler(req, res) {
  if (applyCors(req, res, 'GET,OPTIONS')) return
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])
  if (requireAdmin(req, res)) return

  try {
    await ensureSchema()
    const pool = getPool()

    const search = (getQueryParam(req, 'search') || '').trim()
    const status = getQueryParam(req, 'status') || 'all'
    const limit = Math.min(Number(getQueryParam(req, 'limit') || 50), 200)
    const page = Math.max(Number(getQueryParam(req, 'page') || 1), 1)
    const offset = (page - 1) * limit

    const { sql, params } = buildQuery({ search, status, limit, offset })
    const { rows } = await pool.query(sql, params)

    // Total for pagination, using the same filters minus limit/offset.
    const counted = buildQuery({ search, status })
    const countSql = `
      SELECT count(*)::int AS total
        FROM registrations r
        LEFT JOIN email_jobs j
          ON j.registration_id = r.id AND j.template = 'welcome_schedule'
        ${counted.clause}`
    const total = await pool.query(countSql, counted.params)

    return ok(res, {
      registrations: rows,
      page,
      limit,
      total: total.rows[0].total,
    })
  } catch (error) {
    console.error('admin/registrations error:', error)
    return fail(res, 'SERVER_ERROR', error.message || 'Could not load registrations.', 500)
  }
}
