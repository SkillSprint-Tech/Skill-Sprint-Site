import { fail, getQueryParam } from '../lib/http.js'

import login from '../lib/admin/login.js'
import stats from '../lib/admin/stats.js'
import registrations from '../lib/admin/registrations.js'
import exportCsv from '../lib/admin/export.js'
import sendEmail from '../lib/admin/sendEmail.js'
import sendLink from '../lib/admin/sendLink.js'

/**
 * Single entry point for every admin endpoint.
 *
 * Vercel's Hobby plan caps a deployment at 12 Serverless Functions, and one file per
 * admin route blew straight past it. Collapsing them behind one dispatcher keeps the
 * deployment inside the limit without changing any public URL: `vercel.json` rewrites
 * /api/admin/<action> to /api/admin?action=<action>, and the Vite dev plugin mirrors
 * that locally.
 */
const ROUTES = {
  login,
  stats,
  registrations,
  export: exportCsv,
  'send-email': sendEmail,
  'send-link': sendLink,
}

export default async function handler(req, res) {
  // The rewrite supplies ?action=…; fall back to parsing the path so a direct hit on
  // /api/admin/stats still resolves if the rewrite is ever missing.
  let action = getQueryParam(req, 'action') || ''
  if (!action) {
    const path = String(req.url || '').split('?')[0]
    const match = path.match(/\/api\/admin\/([^/]+)/)
    action = match ? match[1] : ''
  }

  const route = ROUTES[action]
  if (!route) {
    return fail(res, 'NOT_FOUND', `Unknown admin action: ${action || '(none)'}`, 404)
  }

  return route(req, res)
}

export const config = { maxDuration: 60 }
