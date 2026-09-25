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
    const { id, query: searchToken, workshop_id: rawWorkshopId, workshopId, attended = true } = body
    const targetWorkshopId = rawWorkshopId || workshopId

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

    // Resolve target workshop (either provided or closest live/upcoming workshop)
    let targetWorkshop
    if (targetWorkshopId) {
      const { rows: wRows } = await query(
        'SELECT id, title, speaker, status FROM workshops WHERE id = $1',
        [targetWorkshopId]
      )
      targetWorkshop = wRows[0]
      if (!targetWorkshop) {
        return fail(res, 'WORKSHOP_NOT_FOUND', 'Target workshop could not be found.', 404)
      }
    } else {
      // Find active live workshop or earliest upcoming
      const { rows: liveRows } = await query(
        `SELECT id, title, speaker, status FROM workshops
          ORDER BY (CASE WHEN status = 'live' THEN 0 WHEN status = 'upcoming' THEN 1 ELSE 2 END),
                   starts_at ASC
          LIMIT 1`
      )
      targetWorkshop = liveRows[0]
      if (!targetWorkshop) {
        return fail(res, 'NO_WORKSHOPS', 'No workshops found to check in against.', 400)
      }
    }

    const newAttended = Boolean(attended)

    if (newAttended) {
      await query(
        `INSERT INTO workshop_checkins (registration_id, workshop_id, checked_in_at)
         VALUES ($1, $2, now())
         ON CONFLICT (registration_id, workshop_id)
         DO UPDATE SET checked_in_at = now()`,
        [targetRegistration.id, targetWorkshop.id]
      )
    } else {
      await query(
        `DELETE FROM workshop_checkins
          WHERE registration_id = $1 AND workshop_id = $2`,
        [targetRegistration.id, targetWorkshop.id]
      )
    }

    // Maintain registrations.attended and checked_in_at for backwards compatibility
    await query(
      `UPDATE registrations
          SET attended = EXISTS (SELECT 1 FROM workshop_checkins WHERE registration_id = $1),
              checked_in_at = (SELECT max(checked_in_at) FROM workshop_checkins WHERE registration_id = $1)
        WHERE id = $1`,
      [targetRegistration.id]
    )

    // Fetch all workshop checkins for this registration
    const { rows: attendeeCheckins } = await query(
      `SELECT wc.workshop_id, wc.checked_in_at, w.title AS workshop_title
         FROM workshop_checkins wc
         JOIN workshops w ON w.id = wc.workshop_id
        WHERE wc.registration_id = $1
        ORDER BY wc.checked_in_at ASC`,
      [targetRegistration.id]
    )

    // Calculate workshop-specific and overall stats
    const [workshopStatsRes, overallStatsRes] = await Promise.all([
      query(
        `SELECT count(*)::int AS attended_count
           FROM workshop_checkins
          WHERE workshop_id = $1`,
        [targetWorkshop.id]
      ),
      query(
        `SELECT count(*)::int AS total,
                count(DISTINCT registration_id)::int AS unique_attended
           FROM workshop_checkins`
      ),
    ])

    const { rows: totalRegRows } = await query('SELECT count(*)::int AS total FROM registrations')

    const stats = {
      total: Number(totalRegRows[0]?.total || 0),
      attended: Number(workshopStatsRes.rows[0]?.attended_count || 0),
      unique_attended: Number(overallStatsRes.rows[0]?.unique_attended || 0),
    }

    return ok(res, {
      registration: {
        ...targetRegistration,
        attended: attendeeCheckins.some((c) => c.workshop_id === targetWorkshop.id),
        checked_in_at: attendeeCheckins.find((c) => c.workshop_id === targetWorkshop.id)?.checked_in_at || null,
        checkins: attendeeCheckins,
      },
      workshop: {
        id: targetWorkshop.id,
        title: targetWorkshop.title,
      },
      stats,
      message: newAttended
        ? `Checked in ${targetRegistration.full_name} for "${targetWorkshop.title}"`
        : `Check-in removed for ${targetRegistration.full_name} from "${targetWorkshop.title}"`,
    })
  } catch (error) {
    console.error('lib/admin/checkIn error:', error)
    return fail(res, 'DB_ERROR', error.message || 'Database error occurred', 500)
  }
}
