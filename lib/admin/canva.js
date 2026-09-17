import { ensureSchema } from '../schema.js'
import { applyCors, ok, fail, methodNotAllowed } from '../http.js'
import { requireAdmin } from '../auth.js'
import { respondWithError } from '../errors.js'
import {
  getConnectionStatus, createAuthorization, completeAuthorization, disconnect, redirectUriFor,
} from '../canva/oauth.js'

/**
 * GET                       → { configured, connected, displayName }
 * POST { op: 'authorize' }  → { url } to send the browser to
 * POST { op: 'callback', code, state }
 * POST { op: 'disconnect' }
 */
export default async function handler(req, res) {
  if (applyCors(req, res, 'GET,POST,OPTIONS')) return
  if (requireAdmin(req, res)) return

  try {
    await ensureSchema()

    if (req.method === 'GET') return ok(res, await getConnectionStatus())
    if (req.method !== 'POST') return methodNotAllowed(res, ['GET', 'POST'])

    const body = req.body || {}
    switch (body.op) {
      case 'authorize':
        return ok(res, { url: await createAuthorization(redirectUriFor(req)) })
      case 'callback': {
        const { displayName } = await completeAuthorization({ code: body.code, state: body.state })
        return ok(res, { connected: true, displayName })
      }
      case 'disconnect':
        await disconnect()
        return ok(res, { connected: false })
      default:
        return fail(res, 'UNKNOWN_OP', `Unknown op: ${body.op || '(none)'}`)
    }
  } catch (error) {
    return respondWithError(res, error, 'admin/canva')
  }
}

export const config = { maxDuration: 30 }
