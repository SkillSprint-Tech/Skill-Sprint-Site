import crypto from 'node:crypto'
import { query, withTransaction } from '../db.js'
import { encryptToken, decryptToken } from './tokenCrypto.js'
import { UserFacingError } from '../errors.js'

/**
 * Canva Connect OAuth (authorization code + PKCE) for a single admin-owned connection.
 * https://www.canva.dev/docs/connect/authentication/
 */
export const CANVA_SCOPES = ['design:meta:read', 'design:content:read', 'profile:read']

const AUTHORIZE_URL = 'https://www.canva.com/api/oauth/authorize'
const TOKEN_URL = 'https://api.canva.com/rest/v1/oauth/token'
const PROFILE_URL = 'https://api.canva.com/rest/v1/users/me/profile'
const STATE_TTL_MINUTES = 15
const REFRESH_MARGIN_MS = 5 * 60 * 1000

export function isCanvaConfigured() {
  return Boolean(process.env.CANVA_CLIENT_ID && process.env.CANVA_CLIENT_SECRET)
}

/** Must exactly match a redirect URL registered on the Canva integration. */
export function redirectUriFor(req) {
  if (process.env.CANVA_REDIRECT_URI) return process.env.CANVA_REDIRECT_URI
  const host = String(req.headers?.['x-forwarded-host'] || req.headers?.host || 'localhost')
  const loopback = /^(127\.0\.0\.1|localhost)(:\d+)?$/.test(host)
  const forwarded = String(req.headers?.['x-forwarded-proto'] || '').split(',')[0].trim()
  const proto = forwarded || (loopback ? 'http' : 'https')
  return `${proto}://${host}/admin/canva/callback`
}

export function pkcePair() {
  const verifier = crypto.randomBytes(48).toString('base64url') // 64 characters
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url')
  return { verifier, challenge }
}

export function authorizeUrl({ state, challenge, redirectUri }) {
  const params = new URLSearchParams({
    code_challenge: challenge,
    code_challenge_method: 'S256',
    scope: CANVA_SCOPES.join(' '),
    response_type: 'code',
    client_id: process.env.CANVA_CLIENT_ID || '',
    state,
    redirect_uri: redirectUri,
  })
  return `${AUTHORIZE_URL}?${params}`
}

function requireConfigured() {
  if (!isCanvaConfigured()) {
    throw new UserFacingError('Set CANVA_CLIENT_ID and CANVA_CLIENT_SECRET first.', 'CANVA_NOT_CONFIGURED')
  }
}

/** Start a connection. Returns the Canva URL to send the browser to. */
export async function createAuthorization(redirectUri) {
  requireConfigured()
  const state = crypto.randomBytes(24).toString('base64url')
  const { verifier, challenge } = pkcePair()

  await query(
    `DELETE FROM canva_oauth_states WHERE created_at < now() - ($1 || ' minutes')::interval`,
    [String(STATE_TTL_MINUTES)]
  )
  await query(
    'INSERT INTO canva_oauth_states (state, code_verifier, redirect_uri) VALUES ($1, $2, $3)',
    [state, verifier, redirectUri]
  )
  return authorizeUrl({ state, challenge, redirectUri })
}

async function tokenRequest(form) {
  const credentials = Buffer.from(
    `${process.env.CANVA_CLIENT_ID}:${process.env.CANVA_CLIENT_SECRET}`
  ).toString('base64')

  let res
  try {
    res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(form),
    })
  } catch {
    throw new UserFacingError('Could not reach Canva. Try again.', 'CANVA_UNREACHABLE')
  }

  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json.access_token) {
    const detail = json.error_description || json.message || json.error || `HTTP ${res.status}`
    const error = new UserFacingError(`Canva rejected the sign-in: ${detail}`, 'CANVA_TOKEN_FAILED')
    error.status = res.status
    throw error
  }
  return json
}

async function fetchDisplayName(accessToken) {
  try {
    const res = await fetch(PROFILE_URL, { headers: { Authorization: `Bearer ${accessToken}` } })
    const json = await res.json().catch(() => ({}))
    return json?.profile?.display_name || ''
  } catch {
    return '' // The name is cosmetic; never fail a connection over it.
  }
}

async function storeTokens(client, tokens, { displayName = '', connected = false } = {}) {
  const expiresAt = new Date(Date.now() + Number(tokens.expires_in || 14400) * 1000)
  await client.query(
    `INSERT INTO canva_connection (id, access_token, refresh_token, expires_at, scope, display_name)
     VALUES (1, $1, $2, $3, $4, $5)
     ON CONFLICT (id) DO UPDATE SET
       access_token  = EXCLUDED.access_token,
       refresh_token = EXCLUDED.refresh_token,
       expires_at    = EXCLUDED.expires_at,
       scope         = EXCLUDED.scope,
       display_name  = COALESCE(NULLIF(EXCLUDED.display_name, ''), canva_connection.display_name),
       connected_at  = CASE WHEN $6 THEN now() ELSE canva_connection.connected_at END,
       updated_at    = now()`,
    [
      encryptToken(tokens.access_token),
      encryptToken(tokens.refresh_token),
      expiresAt,
      tokens.scope || '',
      displayName,
      connected,
    ]
  )
}

/** Finish a connection with the code Canva sent back. */
export async function completeAuthorization({ code, state }) {
  requireConfigured()
  if (!code || !state) {
    throw new UserFacingError('Canva did not return an authorisation code.', 'CANVA_BAD_CALLBACK')
  }

  // DELETE … RETURNING makes the state single-use even if the callback is replayed.
  const { rows } = await query(
    `DELETE FROM canva_oauth_states
      WHERE state = $1 AND created_at > now() - ($2 || ' minutes')::interval
      RETURNING code_verifier, redirect_uri`,
    [String(state), String(STATE_TTL_MINUTES)]
  )
  if (!rows.length) {
    throw new UserFacingError('This Canva sign-in has expired. Click Connect Canva again.', 'CANVA_BAD_STATE')
  }

  const tokens = await tokenRequest({
    grant_type: 'authorization_code',
    code: String(code),
    code_verifier: rows[0].code_verifier,
    redirect_uri: rows[0].redirect_uri,
  })
  const displayName = await fetchDisplayName(tokens.access_token)
  await withTransaction((client) => storeTokens(client, tokens, { displayName, connected: true }))
  return { displayName }
}

export async function getConnectionStatus() {
  const { rows } = await query('SELECT display_name, connected_at FROM canva_connection WHERE id = 1')
  return {
    configured: isCanvaConfigured(),
    connected: rows.length > 0,
    displayName: rows[0]?.display_name || '',
    connectedAt: rows[0]?.connected_at || null,
  }
}

export async function disconnect() {
  await query('DELETE FROM canva_connection WHERE id = 1')
}

const notConnected = () =>
  new UserFacingError('Connect a Canva account first.', 'CANVA_NOT_CONNECTED')

/**
 * A usable access token. Refreshes when it is close to expiry, or when `force` is set after
 * a 401. Canva refresh tokens are single-use, so the refresh happens under a row lock: two
 * concurrent requests must never both spend the same one.
 */
export async function getAccessToken({ force = false } = {}) {
  const { rows } = await query('SELECT access_token, expires_at FROM canva_connection WHERE id = 1')
  if (!rows.length) throw notConnected()

  const fresh = (row) => new Date(row.expires_at).getTime() - Date.now() > REFRESH_MARGIN_MS
  if (!force && fresh(rows[0])) return decryptToken(rows[0].access_token)

  const outcome = await withTransaction(async (client) => {
    const locked = await client.query(
      'SELECT access_token, refresh_token, expires_at FROM canva_connection WHERE id = 1 FOR UPDATE'
    )
    const row = locked.rows[0]
    if (!row) return { error: notConnected() }

    // Another request refreshed while we waited for the lock — use its token.
    const replacedMeanwhile = row.access_token !== rows[0].access_token
    if (fresh(row) && (!force || replacedMeanwhile)) {
      return { token: decryptToken(row.access_token) }
    }

    try {
      const tokens = await tokenRequest({
        grant_type: 'refresh_token',
        refresh_token: decryptToken(row.refresh_token),
      })
      await storeTokens(client, tokens)
      return { token: tokens.access_token }
    } catch (error) {
      // 400/401 means Canva will never accept this refresh token again. Forget it (the
      // transaction still commits) so the panel asks for a reconnect.
      if (error.code === 'CANVA_TOKEN_FAILED' && (error.status === 400 || error.status === 401)) {
        await client.query('DELETE FROM canva_connection WHERE id = 1')
        return {
          error: new UserFacingError(
            'The Canva connection has expired. Click Connect Canva again.',
            'CANVA_NOT_CONNECTED'
          ),
        }
      }
      throw error
    }
  })

  if (outcome.error) throw outcome.error
  return outcome.token
}
