import { getPool } from '../db.js'
import { ensureSchema } from '../schema.js'
import { applyCors, fail, methodNotAllowed, getQueryParam } from '../http.js'
import { requireAdmin } from '../auth.js'
import { buildQuery } from './registrations.js'

const COLUMNS = [
  ['full_name', 'Full Name'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['university', 'University'],
  ['year_of_study', 'Year of Study'],
  ['skill_level', 'Skill Level'],
  ['interests', 'Interests'],
  ['created_at', 'Registered At'],
  ['email_status', 'Email Status'],
  ['provider', 'Provider'],
  ['sent_at', 'Sent At'],
  ['delivered_at', 'Delivered At'],
  ['attempts', 'Attempts'],
  ['last_error', 'Last Error'],
]

/**
 * Escape one CSV cell.
 *
 * Two separate concerns:
 *  1. RFC 4180 — wrap in quotes, double any internal quote. Without this, a name
 *     containing a comma silently shifts every later column.
 *  2. Formula injection — a cell starting with = + - @ (or tab/CR) is executed by Excel
 *     and Sheets when opened. The registration form is public, so someone can type
 *     `=HYPERLINK(...)` into their name. Prefixing with a single quote neutralises it.
 */
function csvCell(value) {
  if (value == null) return '""'

  let text = Array.isArray(value)
    ? value.join('; ')
    : value instanceof Date
      ? value.toISOString()
      : String(value)

  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`

  return `"${text.replace(/"/g, '""')}"`
}

export default async function handler(req, res) {
  if (applyCors(req, res, 'GET,OPTIONS')) return
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])
  if (requireAdmin(req, res)) return

  try {
    await ensureSchema()
    const pool = getPool()

    // scope=all ignores the operator's active filters; anything else honours them, so
    // "everyone who hasn't received the email" exports as its own list.
    const scope = getQueryParam(req, 'scope') || 'view'
    const search = scope === 'all' ? '' : (getQueryParam(req, 'search') || '').trim()
    const status = scope === 'all' ? 'all' : getQueryParam(req, 'status') || 'all'

    const { sql, params } = buildQuery({ search, status })
    const { rows } = await pool.query(sql, params)

    const filename = `skillsprint-registrations-${new Date().toISOString().slice(0, 10)}.csv`

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Cache-Control', 'no-store')

    const lines = [COLUMNS.map(([, label]) => csvCell(label)).join(',')]
    for (const row of rows) {
      lines.push(COLUMNS.map(([key]) => csvCell(row[key])).join(','))
    }

    // Leading BOM. Without it Excel on Windows reads UTF-8 as the legacy codepage and
    // mangles any non-ASCII character — which hits real student names immediately.
    res.end('﻿' + lines.join('\r\n') + '\r\n')
  } catch (error) {
    console.error('admin/export error:', error)
    return fail(res, 'SERVER_ERROR', error.message || 'Could not build the export.', 500)
  }
}
