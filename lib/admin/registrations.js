import { getPool } from '../db.js'
import { ensureSchema } from '../schema.js'
import { applyCors, ok, fail, methodNotAllowed, getQueryParam } from '../http.js'
import { requireAdmin } from '../auth.js'
import { STUCK_AFTER_MINUTES } from '../email/worker.js'

/**
 * Shared query builder for the table view and the CSV export, so the export always
 * reflects exactly what the operator is looking at on screen.
 */
export const WELCOME_TEMPLATE = 'welcome_schedule'

/** Meeting-link jobs are keyed per workshop; see lib/admin/sendLink.js. */
export const reminderTemplate = (workshopId) => `reminder:${workshopId}`

export function buildQuery({ search, status, limit, offset, template = WELCOME_TEMPLATE }) {
  const where = []

  // The template is always $1 so the JOIN can be shared verbatim between the page query
  // and the count query. Hard-coding 'welcome_schedule' here was why the table could only
  // ever describe the registration email — a workshop's meeting-link jobs live under
  // `reminder:<id>` and had no way of reaching this view at all.
  const params = [template]
  const join = `LEFT JOIN email_jobs j
      ON j.registration_id = r.id AND j.template = $1`

  // A registration always has a welcome job, so a missing row there means 'pending'.
  // A reminder is only queued when someone presses Send link, so a missing row means it
  // was never queued for this person — a different fact, and the one worth showing.
  const missing = template === WELCOME_TEMPLATE ? 'pending' : 'not_queued'
  const jobStatus = `COALESCE(j.status, '${missing}')`

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
        `(${jobStatus} IN ('pending','not_queued','deferred','failed','bounced')
          OR (j.status = 'processing' AND ${staleLock}))`
      )
    } else if (status === 'stuck') {
      where.push(`j.status = 'processing' AND ${staleLock}`)
    } else {
      params.push(status)
      where.push(`${jobStatus} = $${params.length}`)
    }
  }

  const clause = where.length ? `WHERE ${where.join(' AND ')}` : ''

  let sql = `
    SELECT
      r.id, r.full_name, r.email, r.phone, r.university, r.year_of_study,
      r.skill_level, r.interests, r.created_at,
      j.id AS job_id,
      ${jobStatus} AS email_status,
      j.provider, j.attempts, j.last_error, j.sent_at, j.delivered_at,
      -- locked_at is how the panel tells "sending right now" from "abandoned an hour ago".
      -- Without it every claimed job looks identical, which is exactly the case where the
      -- operator most needs to know which one it is.
      j.locked_at, j.locked_by,
      (j.status = 'processing' AND ${staleLock}) AS is_stuck
    FROM registrations r
    ${join}
    ${clause}
    ORDER BY r.created_at DESC
  `

  if (limit != null) {
    params.push(limit)
    sql += ` LIMIT $${params.length}`
    params.push(offset || 0)
    sql += ` OFFSET $${params.length}`
  }

  return { sql, params, clause, join, whereParams: params }
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
    const template = getQueryParam(req, 'template') || WELCOME_TEMPLATE
    const limit = Math.min(Number(getQueryParam(req, 'limit') || 50), 200)
    const page = Math.max(Number(getQueryParam(req, 'page') || 1), 1)
    const offset = (page - 1) * limit

    const { sql, params } = buildQuery({ search, status, limit, offset, template })
    const { rows } = await pool.query(sql, params)

    // Total for pagination, using the same filters minus limit/offset. The join comes
    // from buildQuery so the two queries can never disagree about which email they count.
    const counted = buildQuery({ search, status, template })
    const countSql = `
      SELECT count(*)::int AS total
        FROM registrations r
        ${counted.join}
        ${counted.clause}`
    const total = await pool.query(countSql, counted.params)

    return ok(res, {
      registrations: rows,
      page,
      limit,
      template,
      total: total.rows[0].total,
    })
  } catch (error) {
    console.error('admin/registrations error:', error)
    return fail(res, 'SERVER_ERROR', error.message || 'Could not load registrations.', 500)
  }
}
