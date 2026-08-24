import { query } from './_db.js'
import { ensureSchema } from './_schema.js'
import { applyCors, ok, fail, methodNotAllowed, getQueryParam } from './_http.js'
import { requireAdmin, isAuthenticated } from './_auth.js'

const VALID_STATUS = ['upcoming', 'live', 'completed', 'cancelled']

const SELECT_COLUMNS = `
  id, title, description, speaker, speaker_role, starts_at, duration_mins,
  location, seats, status, sort_order, is_published, meeting_link, link_sent_at,
  created_at, updated_at
`

/**
 * Strip anything that must not reach an unauthenticated caller.
 * The meeting link is the whole reason it exists as a separate column — it goes out by
 * email to registrants only, never on a public URL anyone can scrape.
 */
function publicView(row) {
  const { meeting_link, link_sent_at, ...rest } = row
  return { ...rest, has_meeting_link: Boolean(meeting_link) }
}

/** Normalise and validate an incoming workshop payload. Returns { values } or { error }. */
function readPayload(body, { partial = false } = {}) {
  const out = {}

  const title = body.title != null ? String(body.title).trim() : undefined
  if (title !== undefined) {
    if (!title) return { error: 'Title cannot be empty.' }
    out.title = title
  } else if (!partial) {
    return { error: 'Title is required.' }
  }

  if (body.starts_at != null) {
    const date = new Date(body.starts_at)
    if (Number.isNaN(date.getTime())) return { error: 'Start date is not a valid date.' }
    out.starts_at = date.toISOString()
  } else if (!partial) {
    return { error: 'Start date is required.' }
  }

  if (body.status != null) {
    const status = String(body.status)
    if (!VALID_STATUS.includes(status)) {
      return { error: `Status must be one of: ${VALID_STATUS.join(', ')}.` }
    }
    out.status = status
  }

  if (body.seats != null && body.seats !== '') {
    const seats = Number(body.seats)
    if (!Number.isInteger(seats) || seats < 0) return { error: 'Seats must be a whole number.' }
    out.seats = seats
  } else if (body.seats === null || body.seats === '') {
    out.seats = null // explicit "unlimited"
  }

  if (body.duration_mins != null) {
    const mins = Number(body.duration_mins)
    if (!Number.isInteger(mins) || mins <= 0) return { error: 'Duration must be a positive number.' }
    out.duration_mins = mins
  }

  for (const field of ['description', 'speaker', 'speaker_role', 'location', 'meeting_link']) {
    if (body[field] != null) out[field] = String(body[field]).trim()
  }

  if (out.meeting_link && !/^https?:\/\//i.test(out.meeting_link)) {
    return { error: 'Meeting link must start with http:// or https://' }
  }

  if (body.sort_order != null) {
    const order = Number(body.sort_order)
    if (!Number.isInteger(order)) return { error: 'Sort order must be a whole number.' }
    out.sort_order = order
  }

  if (body.is_published != null) out.is_published = Boolean(body.is_published)

  return { values: out }
}

export default async function handler(req, res) {
  if (applyCors(req, res, 'GET,POST,PATCH,DELETE,OPTIONS')) return

  try {
    await ensureSchema()

    // ── Read ────────────────────────────────────────────────────────────────
    if (req.method === 'GET') {
      // Admins can request everything including unpublished drafts; the public
      // endpoint only ever exposes published rows.
      const admin = isAuthenticated(req)
      const includeUnpublished = getQueryParam(req, 'all') === '1' && admin

      const { rows } = await query(
        `SELECT ${SELECT_COLUMNS}
           FROM workshops
          ${includeUnpublished ? '' : 'WHERE is_published = true'}
          ORDER BY sort_order ASC, starts_at ASC`
      )

      // Only an authenticated admin ever sees meeting_link.
      const visible = admin ? rows : rows.map(publicView)

      const now = Date.now()
      const isPast = (w) =>
        w.status === 'completed' ||
        w.status === 'cancelled' ||
        new Date(w.starts_at).getTime() + w.duration_mins * 60_000 < now

      return ok(res, {
        workshops: visible,
        upcoming: visible.filter((w) => !isPast(w)),
        past: visible.filter(isPast).reverse(),
      })
    }

    // ── Everything below mutates, so it is admin-only ───────────────────────
    if (requireAdmin(req, res)) return

    if (req.method === 'POST') {
      const { values, error } = readPayload(req.body || {})
      if (error) return fail(res, 'INVALID_PAYLOAD', error)

      const columns = Object.keys(values)
      const placeholders = columns.map((_, i) => `$${i + 1}`)
      const { rows } = await query(
        `INSERT INTO workshops (${columns.join(', ')})
         VALUES (${placeholders.join(', ')})
         RETURNING ${SELECT_COLUMNS}`,
        Object.values(values)
      )
      return ok(res, { workshop: rows[0] }, 201)
    }

    if (req.method === 'PATCH') {
      const id = getQueryParam(req, 'id') || req.body?.id
      if (!id) return fail(res, 'MISSING_ID', 'Workshop id is required.')

      const { values, error } = readPayload(req.body || {}, { partial: true })
      if (error) return fail(res, 'INVALID_PAYLOAD', error)
      if (!Object.keys(values).length) {
        return fail(res, 'NOTHING_TO_UPDATE', 'No fields to update.')
      }

      const assignments = Object.keys(values).map((col, i) => `${col} = $${i + 2}`)
      const { rows } = await query(
        `UPDATE workshops
            SET ${assignments.join(', ')}, updated_at = now()
          WHERE id = $1
          RETURNING ${SELECT_COLUMNS}`,
        [id, ...Object.values(values)]
      )
      if (!rows.length) return fail(res, 'NOT_FOUND', 'Workshop not found.', 404)
      return ok(res, { workshop: rows[0] })
    }

    if (req.method === 'DELETE') {
      const id = getQueryParam(req, 'id') || req.body?.id
      if (!id) return fail(res, 'MISSING_ID', 'Workshop id is required.')

      const { rowCount } = await query('DELETE FROM workshops WHERE id = $1', [id])
      if (!rowCount) return fail(res, 'NOT_FOUND', 'Workshop not found.', 404)
      return ok(res, { message: 'Workshop deleted.' })
    }

    return methodNotAllowed(res, ['GET', 'POST', 'PATCH', 'DELETE'])
  } catch (error) {
    console.error('workshops API error:', error)
    return fail(res, 'SERVER_ERROR', error.message || 'Database error', 500)
  }
}
