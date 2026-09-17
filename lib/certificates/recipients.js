import { UserFacingError } from '../errors.js'

export const MAX_IMPORT_ROWS = 2000
const MAX_NAME_LENGTH = 120
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Trim and collapse whitespace. Case is never changed — "McDonald" and "bin Ahmed" matter. */
export function normalizeName(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim()
}

export function normalizeEmail(value) {
  return String(value ?? '').trim().toLowerCase()
}

export function isValidEmail(value) {
  return typeof value === 'string' && value.length <= 254 && EMAIL.test(value)
}

/** Column indexes for the name and email. Prefers a "full name" header over any "name". */
export function pickColumns(headers) {
  const norm = headers.map((h) => normalizeName(h).toLowerCase())
  let name = norm.findIndex((h) => h.includes('full name'))
  if (name < 0) name = norm.findIndex((h) => h.includes('name'))
  const email = norm.findIndex((h) => h.includes('mail'))

  if (name < 0 || email < 0) {
    const found = headers.map((h) => `"${normalizeName(h)}"`).join(', ') || '(none)'
    throw new UserFacingError(
      `Could not find a name column and an email column. Headers found: ${found}.`,
      'MISSING_COLUMNS'
    )
  }
  return { name, email }
}

/** All-caps or all-lowercase names are worth a second look before they are printed. */
export function hasOddCase(name) {
  const letters = name.replace(/[^A-Za-z]/g, '')
  return letters.length > 1 && (letters === letters.toUpperCase() || letters === letters.toLowerCase())
}

/**
 * Turn a raw table (header row first) into preview rows the admin can review.
 * `existingEmails` holds the lowercased emails already imported for this workshop.
 * `row` is the spreadsheet row number, so the admin can find it in the sheet.
 */
export function buildPreview(table, existingEmails = new Set()) {
  if (!Array.isArray(table) || table.length < 2) {
    throw new UserFacingError('The sheet has no attendee rows.', 'EMPTY_SHEET')
  }
  const [headers, ...body] = table
  if (body.length > MAX_IMPORT_ROWS) {
    throw new UserFacingError(`That sheet has ${body.length} rows; the limit is ${MAX_IMPORT_ROWS}.`, 'TOO_LARGE')
  }

  const cols = pickColumns(headers)
  const seen = new Set()

  return body.map((cells, index) => {
    const fullName = normalizeName(cells[cols.name])
    const email = normalizeEmail(cells[cols.email])
    const valid = isValidEmail(email)
    const flags = []

    if (!fullName) flags.push('missingName')
    if (!valid) flags.push('invalidEmail')
    else if (existingEmails.has(email)) flags.push('existing')
    else if (seen.has(email)) flags.push('duplicate')
    if (fullName && hasOddCase(fullName)) flags.push('oddCase')
    if (valid) seen.add(email)

    // oddCase is a warning; every other flag keeps the row out unless the admin opts in.
    const include = flags.every((f) => f === 'oddCase')
    return { row: index + 2, fullName, email, flags, include }
  })
}

/** Server-side re-validation of the rows the admin confirmed. Never trust the preview. */
export function cleanImportRows(rows) {
  if (!Array.isArray(rows)) throw new UserFacingError('rows must be a list.', 'BAD_ROWS')
  if (rows.length > MAX_IMPORT_ROWS) {
    throw new UserFacingError(`At most ${MAX_IMPORT_ROWS} people can be imported at once.`, 'TOO_LARGE')
  }

  const seen = new Set()
  const clean = []
  let skipped = 0

  for (const row of rows) {
    const fullName = normalizeName(row?.fullName)
    const email = normalizeEmail(row?.email)
    if (!fullName || fullName.length > MAX_NAME_LENGTH || !isValidEmail(email) || seen.has(email)) {
      skipped++
      continue
    }
    seen.add(email)
    clean.push({ fullName, email })
  }
  return { clean, skipped }
}
