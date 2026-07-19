import pg from 'pg'

const { Pool } = pg

// Reuse a single pool across requests/invocations (cached on globalThis so the dev API plugin,
// which re-imports this file per request, and serverless warm starts don't open new pools).
function getPool() {
  if (!globalThis.__ssTeamPool) {
    if (!process.env.DB_URI) throw new Error('DB_URI environment variable is not set')
    globalThis.__ssTeamPool = new Pool({
      connectionString: process.env.DB_URI,
      // CockroachDB requires TLS; skip local cert verification for a zero-config connection.
      ssl: { rejectUnauthorized: false },
      max: 3,
    })
  }
  return globalThis.__ssTeamPool
}

async function ensureSchema(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS team_members (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      bio TEXT NOT NULL,
      focus TEXT[] NOT NULL DEFAULT ARRAY['Core Builder', 'Collaborator'],
      image TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const pool = getPool()
    await ensureSchema(pool)

    if (req.method === 'GET') {
      const { rows } = await pool.query(
        'SELECT id, name, role, bio, focus, image FROM team_members ORDER BY created_at ASC'
      )
      return res.status(200).json({ success: true, members: rows })
    }

    if (req.method === 'POST') {
      const body = req.body || {}
      const name = String(body.name || '').trim()
      const role = String(body.role || '').trim()
      const bio = String(body.bio || '').trim()
      const image = typeof body.image === 'string' ? body.image : ''
      const focus =
        Array.isArray(body.focus) && body.focus.length ? body.focus : ['Core Builder', 'Collaborator']

      if (!name || !role || !bio) {
        return res.status(400).json({ success: false, message: 'Name, role and bio are required.' })
      }

      // Note: we intentionally do NOT echo the (potentially large base64) image back in the
      // response — the client already has it, and a small response keeps the request snappy.
      const { rows } = await pool.query(
        `INSERT INTO team_members (name, role, bio, focus, image)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, role, bio, focus`,
        [name, role, bio, focus, image]
      )
      return res.status(201).json({ success: true, member: rows[0] })
    }

    if (req.method === 'DELETE') {
      // Accept id from query string (?id=...) or request body
      const id = req.query?.id || (req.body && req.body.id)
      if (!id) {
        return res.status(400).json({ success: false, message: 'Member id is required.' })
      }

      const { rowCount } = await pool.query(
        'DELETE FROM team_members WHERE id = $1',
        [id]
      )

      if (rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Member not found.' })
      }

      return res.status(200).json({ success: true, message: 'Member deleted.' })
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' })
  } catch (error) {
    console.error('team-members API error:', error)
    return res.status(500).json({ success: false, message: error.message || 'Database error' })
  }
}
