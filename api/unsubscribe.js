import { query } from './_db.js'
import { ensureSchema } from './_schema.js'
import { applyCors, ok, fail, methodNotAllowed, getQueryParam } from './_http.js'
import { verifyUnsubscribeToken } from './_email/unsubscribeToken.js'

/**
 * Honours the unsubscribe link in every email.
 *
 * GET  /api/unsubscribe?e=…&t=…   status check for the /unsubscribe page
 * POST /api/unsubscribe           performs it — also the RFC 8058 one-click target that
 *                                 Gmail and Outlook call directly from the inbox UI
 *
 * The token is required. Without it, anyone could unsubscribe anyone else by guessing
 * addresses.
 */
export default async function handler(req, res) {
  if (applyCors(req, res, 'GET,POST,OPTIONS')) return

  try {
    await ensureSchema()

    const email = String(
      getQueryParam(req, 'e') || req.body?.email || ''
    ).trim().toLowerCase()
    const token = String(getQueryParam(req, 't') || req.body?.token || '').trim()

    if (!email) return fail(res, 'MISSING_EMAIL', 'This unsubscribe link is incomplete.')
    if (!verifyUnsubscribeToken(email, token)) {
      return fail(res, 'INVALID_TOKEN', 'This unsubscribe link is not valid or has expired.', 403)
    }

    if (req.method === 'GET') {
      const { rows } = await query(
        'SELECT full_name, unsubscribed_at FROM registrations WHERE email = $1',
        [email]
      )
      if (!rows.length) {
        return ok(res, { found: false, email, alreadyUnsubscribed: false })
      }
      return ok(res, {
        found: true,
        email,
        name: rows[0].full_name,
        alreadyUnsubscribed: Boolean(rows[0].unsubscribed_at),
      })
    }

    if (req.method !== 'POST') return methodNotAllowed(res, ['GET', 'POST'])

    const { rows } = await query(
      `UPDATE registrations
          SET unsubscribed_at = COALESCE(unsubscribed_at, now())
        WHERE email = $1
        RETURNING full_name, unsubscribed_at`,
      [email]
    )

    // Cancel anything still queued for them. Jobs already sent stay as-is for the record.
    await query(
      `UPDATE email_jobs
          SET status = 'failed', last_error = 'Recipient unsubscribed', updated_at = now()
        WHERE registration_id IN (SELECT id FROM registrations WHERE email = $1)
          AND status IN ('pending', 'deferred', 'processing')`,
      [email]
    )

    // Report success even for an address we don't hold — the person asked to stop
    // receiving mail and does not need to be told whether we had a record of them.
    return ok(res, {
      unsubscribed: true,
      email,
      name: rows[0]?.full_name || null,
    })
  } catch (error) {
    console.error('unsubscribe error:', error)
    return fail(res, 'SERVER_ERROR', 'Could not process that request.', 500)
  }
}
