import crypto from 'node:crypto'
import { getPool } from '../_db.js'
import { ensureSchema } from '../_schema.js'
import { ok, fail, methodNotAllowed } from '../_http.js'

/**
 * Resend delivery webhook (Svix-signed).
 *
 * This is what makes "did they actually receive it" answerable. A 200 from the send API
 * only means *accepted for delivery*; only a delivered event confirms receipt.
 *
 * Configure at resend.com → Webhooks. Resend issues the signing secret (starts `whsec_`) —
 * do not invent your own or every signature check will fail.
 */
function verifySignature(req, rawBody) {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  // Unconfigured means delivery tracking is simply off yet; accept and record.
  if (!secret) return { valid: true, unverified: true }

  const id = req.headers['svix-id']
  const timestamp = req.headers['svix-timestamp']
  const signatureHeader = req.headers['svix-signature']
  if (!id || !timestamp || !signatureHeader) return { valid: false }

  // Reject anything older than 5 minutes so a captured request cannot be replayed.
  const age = Math.abs(Date.now() / 1000 - Number(timestamp))
  if (!Number.isFinite(age) || age > 300) return { valid: false }

  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64')
  const expected = crypto
    .createHmac('sha256', key)
    .update(`${id}.${timestamp}.${rawBody}`)
    .digest('base64')

  // The header may carry several space-separated `v1,<sig>` values during key rotation.
  const supplied = String(signatureHeader)
    .split(' ')
    .map((part) => part.split(',')[1])
    .filter(Boolean)

  const expectedBuf = Buffer.from(expected)
  const valid = supplied.some((sig) => {
    const buf = Buffer.from(sig)
    return buf.length === expectedBuf.length && crypto.timingSafeEqual(buf, expectedBuf)
  })

  return { valid }
}

const STATUS_BY_EVENT = {
  'email.delivered': 'delivered',
  'email.bounced': 'bounced',
  'email.complained': 'bounced',
  'email.delivery_delayed': null, // informational only
  'email.opened': null,
  'email.clicked': null,
  'email.sent': null,
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])

  try {
    const rawBody =
      typeof req.rawBody === 'string'
        ? req.rawBody
        : typeof req.body === 'string'
          ? req.body
          : JSON.stringify(req.body || {})

    const { valid, unverified } = verifySignature(req, rawBody)
    if (!valid) return fail(res, 'BAD_SIGNATURE', 'Signature verification failed.', 401)

    await ensureSchema()
    const pool = getPool()

    const payload = typeof req.body === 'object' && req.body ? req.body : JSON.parse(rawBody || '{}')
    const eventType = payload.type || ''
    const messageId = payload.data?.email_id || payload.data?.id || ''
    const recipient = Array.isArray(payload.data?.to) ? payload.data.to[0] : payload.data?.to

    // Match on provider message id first; fall back to the recipient address for events
    // that arrive without one.
    const { rows } = await pool.query(
      `SELECT j.id FROM email_jobs j
         LEFT JOIN registrations r ON r.id = j.registration_id
        WHERE (j.provider_message_id = $1 AND $1 <> '')
           OR (r.email = lower($2) AND j.provider = 'resend')
        ORDER BY j.updated_at DESC
        LIMIT 1`,
      [messageId, recipient || '']
    )
    const jobId = rows[0]?.id || null

    await pool.query(
      `INSERT INTO email_events (email_job_id, provider, event_type, payload)
       VALUES ($1, 'resend', $2, $3)`,
      [jobId, eventType, payload]
    )

    const newStatus = STATUS_BY_EVENT[eventType]
    if (jobId && newStatus) {
      await pool.query(
        `UPDATE email_jobs
            SET status = $2,
                delivered_at = CASE WHEN $2 = 'delivered' THEN now() ELSE delivered_at END,
                updated_at = now()
          WHERE id = $1`,
        [jobId, newStatus]
      )
    }

    return ok(res, { received: true, matched: Boolean(jobId), unverified: Boolean(unverified) })
  } catch (error) {
    console.error('webhooks/resend error:', error)
    // 200 so the provider does not retry-storm on our own bug.
    return ok(res, { received: true, error: error.message })
  }
}
