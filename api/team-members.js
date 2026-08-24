import { query } from '../lib/db.js'
import { ensureSchema } from '../lib/schema.js'
import { applyCors, ok, fail, methodNotAllowed, getQueryParam } from '../lib/http.js'
import { requireAdmin } from '../lib/auth.js'

const ALLOWED = ['GET', 'POST', 'DELETE']
const DEFAULT_FOCUS = ['Core Builder', 'Collaborator']

export default async function handler(req, res) {
  if (applyCors(req, res, 'GET,POST,DELETE,OPTIONS')) return

  try {
    await ensureSchema()

    if (req.method === 'GET') {
      const { rows } = await query(
        'SELECT id, name, role, bio, focus, image FROM team_members ORDER BY created_at ASC'
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

      // The image can be a large base64 string — deliberately not echoed back, since the
      // client already has it and a small response keeps the request snappy.
      const { rows } = await query(
        `INSERT INTO team_members (name, role, bio, focus, image)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, role, bio, focus`,
        [name, role, bio, focus, image]
      )
      return ok(res, { member: rows[0] }, 201)
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
