import { query } from '../lib/db.js'
import { ensureSchema } from '../lib/schema.js'
import { applyCors, ok, fail, methodNotAllowed, getQueryParam } from '../lib/http.js'
import { requireAdmin } from '../lib/auth.js'

const ALLOWED = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
const DEFAULT_FOCUS = ['Core Builder', 'Collaborator']

export default async function handler(req, res) {
  if (applyCors(req, res, 'GET,POST,PATCH,PUT,DELETE,OPTIONS')) return

  try {
    await ensureSchema()

    if (req.method === 'GET') {
      const { rows } = await query(
        'SELECT id, name, role, bio, focus, image, sort_order FROM team_members ORDER BY sort_order ASC, created_at ASC'
      )
      return ok(res, { members: rows })
    }

    // Reads stay public — the /team page needs them. Everything that changes the roster
    // requires an admin session, managed from the Team tab in /admin.
    if (requireAdmin(req, res)) return

    if (req.method === 'POST') {
      const body = req.body || {}
      const name = String(body.name || '').trim()
      const role = String(body.role || '').trim()
      const bio = String(body.bio || '').trim()
      const image = typeof body.image === 'string' ? body.image : ''
      const focus =
        Array.isArray(body.focus) && body.focus.length ? body.focus : DEFAULT_FOCUS

      if (!name || !role || !bio) {
        return fail(res, 'MISSING_FIELDS', 'Name, role and bio are required.')
      }

      const { rows: orderRows } = await query(
        'SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM team_members'
      )
      const sortOrder = orderRows[0]?.next_order || 0

      // The image can be a large base64 string — deliberately not echoed back, since the
      // client already has it and a small response keeps the request snappy.
      const { rows } = await query(
        `INSERT INTO team_members (name, role, bio, focus, image, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, name, role, bio, focus, sort_order`,
        [name, role, bio, focus, image, sortOrder]
      )
      return ok(res, { member: rows[0] }, 201)
    }

    if (req.method === 'PATCH' || req.method === 'PUT') {
      const body = req.body || {}

      // Bulk reordering: { reorder: [{ id, sort_order }, ...] }
      if (Array.isArray(body.reorder)) {
        for (const item of body.reorder) {
          if (item.id && typeof item.sort_order === 'number') {
            await query('UPDATE team_members SET sort_order = $1 WHERE id = $2', [
              item.sort_order,
              item.id,
            ])
          }
        }
        return ok(res, { message: 'Order updated.' })
      }

      const id = getQueryParam(req, 'id') || body.id
      if (!id) {
        return fail(res, 'MISSING_ID', 'Member id is required.')
      }

      const { rows: existingRows } = await query(
        'SELECT * FROM team_members WHERE id = $1',
        [id]
      )
      if (existingRows.length === 0) {
        return fail(res, 'NOT_FOUND', 'Member not found.', 404)
      }
      const existing = existingRows[0]

      const name = body.name !== undefined ? String(body.name).trim() : existing.name
      const role = body.role !== undefined ? String(body.role).trim() : existing.role
      const bio = body.bio !== undefined ? String(body.bio).trim() : existing.bio
      const image = typeof body.image === 'string' ? body.image : existing.image
      const focus =
        Array.isArray(body.focus) && body.focus.length ? body.focus : existing.focus
      const sortOrder =
        typeof body.sort_order === 'number' ? body.sort_order : existing.sort_order

      if (!name || !role || !bio) {
        return fail(res, 'MISSING_FIELDS', 'Name, role and bio cannot be empty.')
      }

      const { rows: updatedRows } = await query(
        `UPDATE team_members
         SET name = $1, role = $2, bio = $3, focus = $4, image = $5, sort_order = $6
         WHERE id = $7
         RETURNING id, name, role, bio, focus, sort_order`,
        [name, role, bio, focus, image, sortOrder, id]
      )
      return ok(res, { member: updatedRows[0] })
    }

    if (req.method === 'DELETE') {
      const id = getQueryParam(req, 'id') || req.body?.id
      if (!id) {
        return fail(res, 'MISSING_ID', 'Member id is required.')
      }

      const { rowCount } = await query('DELETE FROM team_members WHERE id = $1', [id])
      if (rowCount === 0) {
        return fail(res, 'NOT_FOUND', 'Member not found.', 404)
      }
      return ok(res, { message: 'Member deleted.' })
    }

    return methodNotAllowed(res, ALLOWED)
  } catch (error) {
    console.error('team-members API error:', error)
    return fail(res, 'DB_ERROR', error.message || 'Database error', 500)
  }
}
