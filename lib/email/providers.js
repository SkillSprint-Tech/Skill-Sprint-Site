/**
 * Provider adapters. Both expose the same shape so the worker never branches on provider.
 *
 * Every adapter returns a result object rather than throwing:
 *   { outcome: 'sent',      messageId }
 *   { outcome: 'quota',     error }   provider says rate-limited — defer, don't fail
 *   { outcome: 'rejected',  error }   permanent (bad address) — fail, don't retry
 *   { outcome: 'transient', error }   temporary (5xx, network) — retry with backoff
 *
 * Classifying the failure is the whole job here. Getting it wrong either burns retries on
 * a dead address or permanently fails someone over a blip.
 */

const TIMEOUT_MS = 15_000

async function postJson(url, headers, body) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    const text = await res.text()
    let json = null
    try {
      json = text ? JSON.parse(text) : null
    } catch {
      // Non-JSON body (HTML error page, empty 502). Keep the raw text for the error message.
    }
    return { status: res.status, json, text }
  } finally {
    clearTimeout(timer)
  }
}

/** Map an HTTP status onto our outcome vocabulary. */
function classify(status, message) {
  if (status === 429) return { outcome: 'quota', error: message }
  // 401/403 mean a bad or revoked key — retrying cannot help, but it is a configuration
  // problem rather than a bad recipient, so surface it loudly as transient-with-context.
  if (status === 401 || status === 403) {
    return { outcome: 'transient', error: `Auth rejected (${status}): ${message}` }
  }
  if (status >= 400 && status < 500) return { outcome: 'rejected', error: message }
  return { outcome: 'transient', error: `Provider error (${status}): ${message}` }
}

// ── Resend ────────────────────────────────────────────────────────────────────

async function sendViaResend({ to, subject, html, text, headers }) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { outcome: 'transient', error: 'RESEND_API_KEY is not set' }

  const from = process.env.RESEND_FROM
  if (!from) return { outcome: 'transient', error: 'RESEND_FROM is not set' }

  const { status, json, text: raw } = await postJson(
    'https://api.resend.com/emails',
    { Authorization: `Bearer ${apiKey}` },
    { from, to: [to], subject, html, text, headers }
  )

  if (status >= 200 && status < 300) {
    return { outcome: 'sent', messageId: json?.id || '' }
  }

  const message = json?.message || json?.error?.message || raw?.slice(0, 300) || 'Unknown error'

  // Resend reports daily-cap breaches as a named error, not always as a 429.
  if (/rate.?limit|quota|daily limit|too many/i.test(message)) {
    return { outcome: 'quota', error: message }
  }
  // A malformed or undeliverable recipient is permanent.
  if (/invalid.*(email|recipient|to)|not a valid/i.test(message)) {
    return { outcome: 'rejected', error: message }
  }
  return classify(status, message)
}

// ── Brevo ─────────────────────────────────────────────────────────────────────

async function sendViaBrevo({ to, toName, subject, html, text, headers }) {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) return { outcome: 'transient', error: 'BREVO_API_KEY is not set' }

  const senderEmail = process.env.BREVO_FROM
  if (!senderEmail) return { outcome: 'transient', error: 'BREVO_FROM is not set' }

  const { status, json, text: raw } = await postJson(
    'https://api.brevo.com/v3/smtp/email',
    { 'api-key': apiKey, Accept: 'application/json' },
    {
      sender: { email: senderEmail, name: process.env.BREVO_SENDER_NAME || 'SkillSprint' },
      to: [{ email: to, name: toName || undefined }],
      subject,
      htmlContent: html,
      textContent: text,
      headers,
    }
  )

  if (status >= 200 && status < 300) {
    return { outcome: 'sent', messageId: json?.messageId || '' }
  }

  const code = json?.code || ''
  const message = json?.message || raw?.slice(0, 300) || 'Unknown error'

  if (code === 'too_many_requests' || /limit.*reach|quota|credits/i.test(message)) {
    return { outcome: 'quota', error: message }
  }
  if (code === 'invalid_parameter' && /email/i.test(message)) {
    return { outcome: 'rejected', error: message }
  }
  return classify(status, message)
}

const ADAPTERS = { resend: sendViaResend, brevo: sendViaBrevo }

/**
 * Send one message through the named provider. Never throws — a thrown network error is
 * caught and reported as transient so the worker's control flow stays linear.
 */
export async function sendWith(provider, message) {
  const adapter = ADAPTERS[provider]
  if (!adapter) return { outcome: 'transient', error: `Unknown provider: ${provider}` }
  try {
    return await adapter(message)
  } catch (error) {
    const reason = error.name === 'AbortError' ? 'Request timed out' : error.message
    return { outcome: 'transient', error: reason }
  }
}
