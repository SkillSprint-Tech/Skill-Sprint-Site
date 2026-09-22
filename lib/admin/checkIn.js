import { query } from '../db.js'
import { ensureSchema } from '../schema.js'
import { applyCors, ok, fail, methodNotAllowed } from '../http.js'
import { requireAdmin } from '../auth.js'

const ALLOWED = ['POST']

export default async function handler(req, res) {
  if (applyCors(req, res, 'POST,OPTIONS')) return

  if (req.method !== 'POST') {
    return methodNotAllowed(res, ALLOWED)
  }

  try {
    await ensureSchema()

    if (requireAdmin(req, res)) return

    const body = req.body || {}
    const { id, query: searchToken, attended = true } = body

    if (!id && !searchToken) {
      return fail(res, 'MISSING_TARGET', 'Registration id or QR token is required.', 400)
    }

    let targetRegistration
    if (id) {
      const { rows } = await query('SELECT * FROM registrations WHERE id = $1', [id])
      targetRegistration = rows[0]
    } else if (searchToken) {
      const clean = String(searchToken).trim().toLowerCase()
      const { rows } = await query(
        `SELECT * FROM registrations
          WHERE LOWER(email) = $1
             OR id::text = $1
             OR LOWER(full_name) ILIKE $2
          LIMIT 1`,
        [clean, `%${clean}%`]
      )
      targetRegistration = rows[0]
    }

    if (!targetRegistration) {
      return fail(res, 'NOT_FOUND', 'Attendee registration could not be found.', 404)
    }

    const newAttended = Boolean(attended)
    const { rows: updatedRows } = await query(
      `UPDATE registrations
          SET attended = $1,
              checked_in_at = CASE WHEN $1 THEN now() ELSE NULL END
        WHERE id = $2
        RETURNING *`,
      [newAttended, targetRegistration.id]
    )

    const { rows: statsRows } = await query(
      `SELECT COUNT(*) AS total,
              COUNT(*) FILTER (WHERE attended = true) AS attended_count
         FROM registrations`
    )

    const stats = {
      total: Number(statsRows[0]?.total || 0),
      attended: Number(statsRows[0]?.attended_count || 0),
    }

    return ok(res, {
      registration: updatedRows[0],
      stats,
      message: newAttended
        ? `Checked in ${updatedRows[0].full_name}`
        : `Check-in removed for ${updatedRows[0].full_name}`,
    })
  } catch (error) {
    console.error('lib/admin/checkIn error:', error)
    return fail(res, 'DB_ERROR', error.message || 'Database error occurred', 500)
  }
}
