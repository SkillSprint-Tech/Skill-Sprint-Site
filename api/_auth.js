import crypto from 'node:crypto'
import { parseCookies, clientIp, fail } from './_http.js'
import { query } from './_db.js'

export const SESSION_COOKIE = 'ss_admin'
const SESSION_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

const MAX_ATTEMPTS = 5
const ATTEMPT_WINDOW_MINUTES = 15

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET
  if (!value) throw new Error('ADMIN_SESSION_SECRET is not set')
  return value
}

function base64url(input) {
  return Buffer.from(input).toString('base64url')
}

function sign(payload) {
  return crypto.createHmac('sha256', secret()).update(payload).digest('base64url')
}

/**
 * Compare two strings without leaking their contents through timing.
 * Lengths are hashed first so timingSafeEqual always gets equal-length buffers —
 * comparing raw buffers of different lengths throws and would itself leak length.
 */
export function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest()
  const hb = crypto.createHash('sha256').update(String(b)).digest()
  return crypto.timingSafeEqual(ha, hb)
}

/** Issue a signed session token. Format: <base64url(json)>.<hmac> */
export function createSessionToken() {
  const body = base64url(JSON.stringify({ iat: Date.now(), exp: Date.now() + SESSION_TTL_MS }))
  return `${body}.${sign(body)}`
}

export function verifySessionToken(token) {
  if (typeof token !== 'string' || !token.includes('.')) return false
  const [body, signature] = token.split('.')
  if (!body || !signature) return false

  // Verify the signature before trusting anything inside the payload.
  if (!safeEqual(signature, sign(body))) return false

  try {
    const claims = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
    return typeof claims.exp === 'number' && claims.exp > Date.now()
  } catch {
    return false
  }
}

export function sessionCookie(token) {
  const parts = [
    `${SESSION_COOKIE}=${token}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
  ]
  // Secure would make the cookie unusable over plain-HTTP localhost during development.
  if (process.env.NODE_ENV === 'production') parts.push('Secure')
  return parts.join('; ')
}

export function clearedSessionCookie() {
  return `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`
}

export function isAuthenticated(req) {
  const token = parseCookies(req)[SESSION_COOKIE]
  return Boolean(token) && verifySessionToken(token)
}

/**
 * Guard for admin routes. Returns true when the request has been rejected and the
 * caller should return immediately.
 */
export function requireAdmin(req, res) {
  if (isAuthenticated(req)) return false
  fail(res, 'UNAUTHORIZED', 'Sign in to continue.', 401)
  return true
}

// ── Login throttling ──────────────────────────────────────────────────────────

/** IPs are hashed before storage — we need to count attempts, not identify people. */
export function hashIp(req) {
  return crypto
    .createHmac('sha256', secret())
    .update(clientIp(req))
    .digest('hex')
    .slice(0, 32)
}

export async function isRateLimited(ipHash) {
  const { rows } = await query(
    `SELECT count(*)::int AS count
       FROM admin_login_attempts
      WHERE ip_hash = $1
        AND succeeded = false
        AND created_at > now() - ($2 || ' minutes')::interval`,
    [ipHash, String(ATTEMPT_WINDOW_MINUTES)]
  )
  return (rows[0]?.count ?? 0) >= MAX_ATTEMPTS
}

export async function recordAttempt(ipHash, succeeded) {
  await query(
    'INSERT INTO admin_login_attempts (ip_hash, succeeded) VALUES ($1, $2)',
    [ipHash, succeeded]
  )
  // Opportunistic cleanup so the table cannot grow without bound.
  await query(
    "DELETE FROM admin_login_attempts WHERE created_at < now() - interval '24 hours'"
  )
}

export const LOGIN_LIMITS = { MAX_ATTEMPTS, ATTEMPT_WINDOW_MINUTES }
