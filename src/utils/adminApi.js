/**
 * Fetch helpers for the admin panel. JSON calls always resolve to { ok, code?, message? }
 * so components can branch on `ok` without try/catch. The session is an HttpOnly cookie.
 */

async function request(path, init) {
  try {
    const res = await fetch(path, { credentials: 'same-origin', ...init })
    const data = await res.json().catch(() => ({}))
    if (res.status === 401) {
      return { ok: false, code: 'UNAUTHORIZED', message: 'Your session expired. Sign in again.' }
    }
    if (typeof data.ok !== 'boolean') {
      return { ok: false, code: 'BAD_RESPONSE', message: `Unexpected response (HTTP ${res.status}).` }
    }
    return data
  } catch {
    return { ok: false, code: 'NETWORK', message: 'Could not reach the server.' }
  }
}

export const apiGet = (path) => request(path)

export const apiPost = (path, body) =>
  request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

/** Binary download (preview image, font, sample PDF). Throws with the server's message. */
export async function apiBlob(path) {
  const res = await fetch(path, { credentials: 'same-origin' })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || `HTTP ${res.status}`)
  }
  return res.blob()
}

export async function fileToBase64(file) {
  const bytes = new Uint8Array(await file.arrayBuffer())
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }
  return btoa(binary)
}

export const shortDate = (value) =>
  new Date(value).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit',
  })

export function untilLabel(iso) {
  const ms = new Date(iso).getTime() - Date.now()
  if (!Number.isFinite(ms) || ms <= 0) return 'now'
  return `in ${Math.floor(ms / 3.6e6)}h ${Math.floor((ms % 3.6e6) / 6e4)}m`
}

// Shared class strings, matching the existing admin panel.
export const ui = {
  input:
    'border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-900 bg-white ' +
    'focus-visible:outline-2 focus-visible:outline-blue-600 transition-colors duration-200',
  cellInput:
    'w-full border border-transparent hover:border-gray-200 rounded-md px-2 py-1 text-sm text-gray-900 ' +
    'bg-transparent focus-visible:outline-2 focus-visible:outline-blue-600 focus:bg-white',
  primary:
    'bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 ' +
    'transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
  secondary:
    'border border-gray-200 bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold ' +
    'hover:border-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
  link:
    'text-sm font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-40 ' +
    'disabled:cursor-not-allowed cursor-pointer',
  label: 'text-xs font-bold uppercase tracking-wider text-gray-500',
  stepTitle: 'font-extrabold text-gray-900 mb-3 flex items-center gap-2',
}
