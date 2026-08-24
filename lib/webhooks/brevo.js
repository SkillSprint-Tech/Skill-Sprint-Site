import crypto from 'node:crypto'
import { getPool } from '../db.js'
import { ensureSchema } from '../schema.js'
import { ok, fail, methodNotAllowed, getQueryParam } from '../http.js'

/**
 * Brevo delivery webhook.
 *
 * Brevo does not issue a signing secret, so we authenticate with a shared token we choose
 * ourselves (BREVO_WEBHOOK_SECRET) passed as ?token= on the webhook URL you register at
 * brevo.com → Transactional → Settings → Webhook. Compared timing-safely.
 */
function verifyToken(req) {
  const secret = process.env.BREVO_WEBHOOK_SECRET
  if (!secret) return { valid: true, unverified: true }

  const supplied =
    getQueryParam(req, 'token') ||
    (req.headers?.authorization || '').replace(/^Bearer\s+/i, '')

  if (!supplied) return { valid: false }

  // Hash both sides so timingSafeEqual always receives equal-length buffers.
  const a = crypto.createHash('sha256').update(String(supplied)).digest()
  const b = crypto.createHash('sha256').update(secret).digest()
  return { valid: crypto.timingSafeEqual(a, b) }
}

const STATUS_BY_EVENT = {
  delivered: 'delivered',
  hard_bounce: 'bounced',
  soft_bounce: null, // Brevo retries these itself; not terminal for us
  blocked: 'bounced',
  spam: 'bounced',
  invalid_email: 'bounced',
  deferred: null,
  opened: null,
  click: null,
  unique_opened: null,
  request: null,
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])

  try {
    const { valid, unverified } = verifyToken(req)
    if (!valid) return fail(res, 'BAD_TOKEN', 'Webhook token is not valid.', 401)

    await ensureSchema()
    const pool = getPool()

    const payload = typeof req.body === 'object' && req.body ? req.body : {}
    const eventType = payload.event || ''
    const messageId = payload['message-id'] || payload.messageId || ''
    const recipient = payload.email || ''

    const { rows } = await pool.query(
      `SELECT j.id FROM email_jobs j
         LEFT JOIN registrations r ON r.id = j.registration_id
        WHERE (j.provider_message_id = $1 AND $1 <> '')
           OR (r.email = lower($2) AND j.provider = 'brevo')
        ORDER BY j.updated_at DESC
        LIMIT 1`,
      [String(messageId), recipient]
    )
    const jobId = rows[0]?.id || null

    await pool.query(
      `INSERT INTO email_events (email_job_id, provider, event_type, payload)
       VALUES ($1, 'brevo', $2, $3)`,
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
    console.error('webhooks/brevo error:', error)
    return ok(res, { received: true, error: error.message })
  }
}
