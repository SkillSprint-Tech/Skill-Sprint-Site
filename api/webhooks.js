import { fail, getQueryParam } from '../lib/http.js'

import resend from '../lib/webhooks/resend.js'
import brevo from '../lib/webhooks/brevo.js'

/**
 * Delivery webhooks for both providers behind one function (Hobby plan function cap).
 *
 * Public URLs are unchanged — vercel.json rewrites /api/webhooks/<provider> to
 * /api/webhooks?provider=<provider>, so the endpoints you register with Resend and
 * Brevo stay exactly as documented.
 */
const PROVIDERS = { resend, brevo }

export default async function handler(req, res) {
  let provider = getQueryParam(req, 'provider') || ''
  if (!provider) {
    const path = String(req.url || '').split('?')[0]
    const match = path.match(/\/api\/webhooks\/([^/]+)/)
    provider = match ? match[1] : ''
  }

  const route = PROVIDERS[provider]
  if (!route) {
    return fail(res, 'NOT_FOUND', `Unknown webhook provider: ${provider || '(none)'}`, 404)
  }

  return route(req, res)
}
