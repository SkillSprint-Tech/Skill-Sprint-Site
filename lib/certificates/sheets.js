import { parseCsv } from './csv.js'
import { UserFacingError } from '../errors.js'

export const MAX_CSV_CHARS = 1_000_000

const SHARE_HELP =
  'In Google Sheets choose Share → General access → "Anyone with the link" (Viewer), ' +
  'or download the sheet as CSV and upload the file instead.'

/**
 * { id, gid } from a Google Sheets link, or null. Only docs.google.com spreadsheet links are
 * accepted — the export URL is rebuilt from the id, so nothing user-supplied is ever fetched.
 */
export function parseSheetUrl(input) {
  let url
  try {
    url = new URL(String(input ?? '').trim())
  } catch {
    return null
  }
  if (url.protocol !== 'https:' || url.hostname !== 'docs.google.com') return null

  const id = url.pathname.match(/^\/spreadsheets\/d\/([A-Za-z0-9_-]{20,})(?:\/|$)/)?.[1]
  if (!id) return null

  // The tab id lives in the query string, the fragment, or both.
  const fromHash = new URLSearchParams(url.hash.replace(/^#/, '')).get('gid')
  const gid = url.searchParams.get('gid') || fromHash || '0'
  return { id, gid: /^\d+$/.test(gid) ? gid : '0' }
}

/** Rows (header first) of a link-shared Google Sheet tab. */
export async function fetchSheetRows(input, fetchImpl = fetch) {
  const ref = parseSheetUrl(input)
  if (!ref) {
    throw new UserFacingError(
      'Paste a Google Sheets link (https://docs.google.com/spreadsheets/d/…).',
      'BAD_SHEET_URL'
    )
  }

  let res
  try {
    res = await fetchImpl(
      `https://docs.google.com/spreadsheets/d/${ref.id}/export?format=csv&gid=${ref.gid}`,
      { redirect: 'follow' }
    )
  } catch {
    throw new UserFacingError('Could not reach Google Sheets. Try again.', 'SHEET_UNREACHABLE')
  }

  // A private sheet answers 200 with a sign-in page, so the content type is the real signal.
  const type = res.headers.get('content-type') || ''
  if (!res.ok || !type.includes('text/csv')) {
    throw new UserFacingError(`Could not read that sheet. ${SHARE_HELP}`, 'SHEET_NOT_SHARED')
  }

  const text = await res.text()
  if (text.length > MAX_CSV_CHARS) {
    throw new UserFacingError('That sheet is larger than 1 MB.', 'TOO_LARGE')
  }
  return parseCsv(text)
}
