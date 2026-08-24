import { applyCors, ok, fail, methodNotAllowed } from '../_http.js'
import { ensureSchema } from '../_schema.js'
import {
  safeEqual,
  createSessionToken,
  sessionCookie,
  clearedSessionCookie,
  isAuthenticated,
  hashIp,
  isRateLimited,
  recordAttempt,
  LOGIN_LIMITS,
} from '../_auth.js'

/**
 * POST   { password }  → sign in, sets the session cookie
 * GET                  → { authenticated: boolean }, used by the frontend on load
 * DELETE               → sign out
 *
 * The password itself is never returned, logged, or sent to the client in any form.
 */
export default async function handler(req, res) {
  if (applyCors(req, res, 'GET,POST,DELETE,OPTIONS')) return

  try {
    if (req.method === 'GET') {
      return ok(res, { authenticated: isAuthenticated(req) })
    }

    if (req.method === 'DELETE') {
      res.setHeader('Set-Cookie', clearedSessionCookie())
      return ok(res, { authenticated: false })
    }

    if (req.method !== 'POST') {
      return methodNotAllowed(res, ['GET', 'POST', 'DELETE'])
    }

    const expected = process.env.ADMIN_PASSWORD
    if (!expected) {
      console.error('admin/login: ADMIN_PASSWORD is not set')
      return fail(res, 'NOT_CONFIGURED', 'Admin access is not configured on this server.', 500)
    }

    await ensureSchema()

    const ipHash = hashIp(req)
    if (await isRateLimited(ipHash)) {
      return fail(
        res,
        'RATE_LIMITED',
        `Too many attempts. Wait ${LOGIN_LIMITS.ATTEMPT_WINDOW_MINUTES} minutes and try again.`,
        429
      )
    }

    const supplied = String(req.body?.password ?? '')
    if (!supplied) {
      await recordAttempt(ipHash, false)
      return fail(res, 'INVALID_PASSWORD', 'Enter the admin password.', 401)
    }

    if (!safeEqual(supplied, expected)) {
      await recordAttempt(ipHash, false)
      // Deliberately vague: never confirm whether a password was close or a user exists.
      return fail(res, 'INVALID_PASSWORD', 'That password is not correct.', 401)
    }

    await recordAttempt(ipHash, true)
    res.setHeader('Set-Cookie', sessionCookie(createSessionToken()))
    return ok(res, { authenticated: true })
  } catch (error) {
    console.error('admin/login error:', error)
    return fail(res, 'SERVER_ERROR', 'Could not complete sign in.', 500)
  }
}
