import crypto from 'node:crypto'

/**
 * Signed unsubscribe links.
 *
 * Without a signature, `/unsubscribe?e=someone@example.com` would let anyone unsubscribe
 * anyone else just by guessing an address. The token binds the link to the email using a
 * server-side secret, so only a link we actually sent will work.
 */
function secret() {
  const value = process.env.ADMIN_SESSION_SECRET
  if (!value) throw new Error('ADMIN_SESSION_SECRET is not set')
  return value
}

export function unsubscribeToken(email) {
  return crypto
    .createHmac('sha256', secret())
    .update(`unsubscribe:${String(email).toLowerCase()}`)
    .digest('base64url')
    .slice(0, 32)
}

export function verifyUnsubscribeToken(email, token) {
  if (!email || !token) return false
  const expected = unsubscribeToken(email)
  const a = Buffer.from(String(token))
  const b = Buffer.from(expected)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

/** Full URL used in both the visible link and the List-Unsubscribe header. */
export function unsubscribeUrl(siteUrl, email) {
  const base = String(siteUrl || '').replace(/\/+$/, '')
  return `${base}/unsubscribe?e=${encodeURIComponent(email)}&t=${unsubscribeToken(email)}`
}
