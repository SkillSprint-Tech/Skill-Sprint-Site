import { query } from '../lib/db.js'
import { ensureSchema } from '../lib/schema.js'
import { applyCors, ok, fail, methodNotAllowed, getQueryParam } from '../lib/http.js'

const ALLOWED = ['GET']

/** Mask email: e.g. "abdullah@example.com" -> "a***h@example.com" */
function maskEmail(email) {
  if (!email || !email.includes('@')) return ''
  const [local, domain] = email.split('@')
  if (local.length <= 2) return `${local[0]}*@${domain}`
  return `${local[0]}${'*'.repeat(Math.min(local.length - 2, 5))}${local[local.length - 1]}@${domain}`
}

export default async function handler(req, res) {
  if (applyCors(req, res, 'GET,OPTIONS')) return

  if (req.method !== 'GET') {
    return methodNotAllowed(res, ALLOWED)
  }

  try {
    await ensureSchema()

    const code = (getQueryParam(req, 'code') || getQueryParam(req, 'id') || '').trim().toLowerCase()
    if (!code) {
      return fail(res, 'MISSING_CODE', 'A certificate verification code or ID is required.', 400)
    }

    // Lookup recipient by verification_code or id (UUID)
    const { rows } = await query(
      `SELECT c.id, c.full_name, c.email, c.verification_code, c.issued_at, c.created_at,
              w.id AS workshop_id, w.title AS workshop_title, w.speaker, w.speaker_role,
              w.starts_at, w.duration_mins, w.location
         FROM certificate_recipients c
         JOIN workshops w ON w.id = c.workshop_id
        WHERE LOWER(c.verification_code) = $1
           OR c.id::text = $1
        LIMIT 1`,
      [code]
    )

    if (rows.length === 0) {
      return ok(res, {
        valid: false,
        message: 'No issued certificate was found matching this verification code or credential ID.',
      })
    }

    const row = rows[0]
    return ok(res, {
      valid: true,
      certificate: {
        id: row.id,
        verification_code: row.verification_code || row.id.slice(0, 16),
        recipient_name: row.full_name,
        recipient_email_masked: maskEmail(row.email),
        workshop_title: row.workshop_title,
        speaker: row.speaker,
        speaker_role: row.speaker_role,
        issued_at: row.issued_at || row.created_at,
        workshop_date: row.starts_at,
        duration_mins: row.duration_mins,
        location: row.location,
        issuer: 'SkillSprint Technical Community',
      },
    })
  } catch (error) {
    console.error('verify-certificate API error:', error)
    return fail(res, 'DB_ERROR', error.message || 'Database error occurred', 500)
  }
}
