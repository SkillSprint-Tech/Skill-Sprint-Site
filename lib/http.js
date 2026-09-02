/**
 * Small helpers shared by every API route so responses and CORS handling stay consistent
 * between the Vercel runtime and the Vite dev middleware.
 */

const DEFAULT_METHODS = 'GET,POST,PATCH,DELETE,OPTIONS'

/**
 * Apply CORS headers and short-circuit preflight requests.
 * Returns true when the request has been fully handled and the caller should return.
 */
export function applyCors(req, res, methods = DEFAULT_METHODS) {
  res.setHeader('Access-Control-Allow-Origin', process.env.PUBLIC_SITE_URL || '*')
  res.setHeader('Access-Control-Allow-Methods', methods)
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return true
  }
  return false
}

export function ok(res, data = {}, status = 200) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  // API responses are always live state. Without this the browser (and Vercel's edge)
  // is free to hand back a heuristically cached copy, which is why a workshop edited in
  // /admin could keep showing its old status on /workshops.
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
  res.end(JSON.stringify({ ok: true, ...data }))
}

/**
 * Structured failure. `code` is a stable machine-readable string the frontend switches on
 * (e.g. QUOTA_EXHAUSTED) — never parse `message`, which is for humans and may change.
 */
export function fail(res, code, message, status = 400, extra = {}) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
  res.end(JSON.stringify({ ok: false, code, message, ...extra }))
}

export function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed.join(', '))
  return fail(res, 'METHOD_NOT_ALLOWED', `Use one of: ${allowed.join(', ')}`, 405)
}

/**
 * Read a query param. Vercel populates req.query; the Vite dev plugin populates it too
 * (see vercelApiPlugin), but fall back to parsing the URL so this works either way.
 */
export function getQueryParam(req, name) {
  if (req.query && req.query[name] != null) return req.query[name]
  try {
    const url = new URL(req.url, 'http://localhost')
    return url.searchParams.get(name)
  } catch {
    return null
  }
}

/** Parse the Cookie header into a plain object. Neither runtime does this for us. */
export function parseCookies(req) {
  const header = req.headers?.cookie
  if (!header) return {}
  return header.split(';').reduce((acc, part) => {
    const index = part.indexOf('=')
    if (index < 0) return acc
    const key = part.slice(0, index).trim()
    const value = part.slice(index + 1).trim()
    if (key) acc[key] = decodeURIComponent(value)
    return acc
  }, {})
}

/** Client IP, trusting Vercel's forwarding headers. Used only for hashed rate limiting. */
export function clientIp(req) {
  const forwarded = req.headers?.['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length) {
    return forwarded.split(',')[0].trim()
  }
  return req.headers?.['x-real-ip'] || req.socket?.remoteAddress || 'unknown'
}
