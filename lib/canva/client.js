import { getAccessToken } from './oauth.js'
import { UserFacingError } from '../errors.js'

const API = 'https://api.canva.com/rest/v1'
const EXPORT_TIMEOUT_MS = 35_000
const POLL_MS = 1_500

const FRIENDLY = {
  permission_denied:
    'The connected Canva account cannot open this design. Connect the account that owns it, or share the design with it.',
  not_found: 'Canva could not find that design.',
  license_required:
    'The design uses premium Canva elements this account has not licensed, so Canva will not export it.',
  approval_required: 'This design needs reviewer approval in Canva before it can be exported.',
  internal_failure: 'Canva failed to export the design. Try again in a minute.',
}

function canvaError(code, fallback) {
  const error = new UserFacingError(FRIENDLY[code] || fallback || 'Canva returned an error.', 'CANVA_ERROR')
  error.canvaCode = code
  return error
}

async function canvaFetch(path, init = {}, retried = false) {
  const token = await getAccessToken({ force: retried })
  let res
  try {
    res = await fetch(`${API}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      },
    })
  } catch {
    throw new UserFacingError('Could not reach Canva. Try again.', 'CANVA_UNREACHABLE')
  }

  // A token can be revoked before it expires; refresh once and retry.
  if (res.status === 401 && !retried) return canvaFetch(path, init, true)

  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw canvaError(json.code, json.message || `Canva returned HTTP ${res.status}.`)
  return json
}

export async function getDesign(designId) {
  const { design } = await canvaFetch(`/designs/${encodeURIComponent(designId)}`)
  return { id: design.id, title: design.title || '', pageCount: design.page_count ?? 1 }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Export one design and download the first file. `format` is the Canva export format object,
 * e.g. { type: 'pdf', pages: [1] }. Returns a Buffer.
 */
export async function exportDesign(designId, format) {
  const created = await canvaFetch('/exports', {
    method: 'POST',
    body: JSON.stringify({ design_id: designId, format }),
  })

  let job = created.job
  const deadline = Date.now() + EXPORT_TIMEOUT_MS
  while (job.status === 'in_progress') {
    if (Date.now() > deadline) {
      throw new UserFacingError('Canva is taking too long to export this design. Try again.', 'CANVA_TIMEOUT')
    }
    await sleep(POLL_MS)
    job = (await canvaFetch(`/exports/${encodeURIComponent(job.id)}`)).job
  }

  if (job.status !== 'success') {
    throw canvaError(job.error?.code || 'internal_failure', job.error?.message)
  }

  const url = job.urls?.[0]
  if (!url || !url.startsWith('https://')) {
    throw new UserFacingError('Canva returned no download link.', 'CANVA_ERROR')
  }

  const file = await fetch(url)
  if (!file.ok) {
    throw new UserFacingError(`Could not download the export from Canva (HTTP ${file.status}).`, 'CANVA_ERROR')
  }
  return Buffer.from(await file.arrayBuffer())
}
