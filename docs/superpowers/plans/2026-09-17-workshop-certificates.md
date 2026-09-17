# Workshop Certificates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** From the admin panel, email every workshop attendee a PDF certificate with their name drawn onto the workshop's Canva design.

**Architecture:**
- Canva designs are exported to PDF through the Canva Connect API, using OAuth with PKCE under the admin's own account. The PDFs are stored in Postgres.
- Attendees are imported from link-shared Google Sheets or from uploaded files into `certificate_recipients`.
- Each certificate is a `template='certificate'` job in the existing `email_jobs` queue. The worker renders the PDF with `pdf-lib` and attaches it.
- All new endpoints live behind the existing `api/admin.js` dispatcher, so there are no new serverless functions.

**Tech Stack:** Vue 3, Vite 8, Tailwind 4, Vercel Node functions, Neon Postgres (`pg`), `pdf-lib` + `@pdf-lib/fontkit`, `read-excel-file` (browser only), `node:test`.

**Spec:** `docs/superpowers/specs/2026-09-17-workshop-certificates-design.md`

---

## Conventions

- **Complete files** appear as code blocks immediately preceded by a line `<!-- file: path -->`. `node scripts/extract-plan-files.mjs <task-number>` writes every file block in that task to disk. The extractor is created in Task 1.
- **Edits to existing files** are shown as before/after snippets, applied by hand.
- **Tests:** `npm test` runs `node --test "tests/**/*.test.js"`.
- **Error convention:** a thrown `UserFacingError` (`lib/errors.js`) carries a message written for the admin. `respondWithError` turns it into HTTP 400 `{ ok:false, code, message }`. Anything else becomes a 500.
- **Commits:** end every commit message with the `Co-Authored-By` trailer from the session.

## File map

| File | Responsibility |
|---|---|
| `lib/errors.js` | `UserFacingError`, `respondWithError` |
| `lib/certificates/csv.js` | RFC 4180 CSV parser |
| `lib/certificates/sheets.js` | Google Sheet link → CSV rows |
| `lib/certificates/recipients.js` | Name/email normalisation, column picking, import preview flags |
| `lib/certificates/layout.js` | Name placement maths (shared by server and browser) |
| `lib/certificates/render.js` | Font validation, PDF rendering, filenames |
| `lib/canva/links.js` | Canva link → design ID |
| `lib/canva/tokenCrypto.js` | AES-256-GCM token sealing |
| `lib/canva/oauth.js` | OAuth + PKCE, token storage and refresh |
| `lib/canva/client.js` | Canva REST calls: get design, export |
| `lib/certificates/templates.js` | `certificate_templates` reads/writes, Canva fetch |
| `lib/certificates/store.js` | Recipient and certificate-job queries |
| `lib/certificates/delivery.js` | Build a certificate email; send a test |
| `lib/email/certificateTemplate.js` | Certificate email HTML/text |
| `lib/email/providers.js` | *(modify)* attachments |
| `lib/email/worker.js` | *(modify)* certificate jobs, deadline |
| `lib/schema.js` | *(modify)* new tables, `email_jobs` changes |
| `lib/admin/canva.js` | Admin route: Canva connect/disconnect |
| `lib/admin/certificates.js` | Admin route: every certificate operation |
| `lib/admin/stats.js`, `lib/webhooks/*.js` | *(modify)* ignore/include certificate jobs correctly |
| `api/admin.js`, `vercel.json`, `.env.example`, `package.json` | *(modify)* wiring |
| `src/utils/adminApi.js` | Browser fetch helpers |
| `src/components/admin/Certificates*.vue`, `CertificateWorkshop.vue`, `CertificateStylePreview.vue`, `CertificateImport.vue`, `CertificateRecipients.vue`, `CertificateSend.vue` | The Certificates tab |
| `src/views/AdminView.vue`, `src/router/index.js` | *(modify)* tab and OAuth callback |

---

## Task 1: Test runner, plan extractor, shared errors

**Files:**
- Create: `scripts/extract-plan-files.mjs`, `lib/errors.js`, `tests/errors.test.js`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Add the extractor** (written by hand, since the extractor can't extract itself)

<!-- file: scripts/extract-plan-files.mjs -->
```js
// Writes the complete-file code blocks of one task in the certificates plan to disk.
// Usage: node scripts/extract-plan-files.mjs <taskNumber>
import fs from 'node:fs'
import path from 'node:path'

const PLAN = 'docs/superpowers/plans/2026-09-17-workshop-certificates.md'
const task = process.argv[2]
if (!task) {
  console.error('Usage: node scripts/extract-plan-files.mjs <taskNumber>')
  process.exit(1)
}

const text = fs.readFileSync(PLAN, 'utf8')
const start = text.indexOf(`\n## Task ${task}:`)
if (start < 0) throw new Error(`Task ${task} not found`)
const next = text.indexOf('\n## Task ', start + 1)
const section = text.slice(start, next < 0 ? undefined : next)

const pattern = /<!-- file: (.+?) -->\r?\n```[a-z]*\r?\n([\s\S]*?)\r?\n```/g
let count = 0
for (const [, file, body] of section.matchAll(pattern)) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, body.replace(/\r\n/g, '\n') + '\n')
  console.log('wrote', file)
  count++
}
if (!count) console.log('no file blocks in task', task)
```

- [ ] **Step 2: Add the test script** to `package.json` `scripts`:

```json
"test": "node --test \"tests/**/*.test.js\""
```

- [ ] **Step 3: Write the failing test**

<!-- file: tests/errors.test.js -->
```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { UserFacingError, respondWithError } from '../lib/errors.js'

function fakeRes() {
  return {
    headers: {},
    setHeader(key, value) { this.headers[key] = value },
    end(body) { this.body = JSON.parse(body) },
  }
}

test('user-facing errors become a 400 with their code and message', () => {
  const res = fakeRes()
  respondWithError(res, new UserFacingError('Nope', 'BAD_THING'), 'test')
  assert.equal(res.statusCode, 400)
  assert.deepEqual(res.body, { ok: false, code: 'BAD_THING', message: 'Nope' })
})

test('unexpected errors become a 500 and are logged', (t) => {
  const logged = t.mock.method(console, 'error', () => {})
  const res = fakeRes()
  respondWithError(res, new Error('boom'), 'test')
  assert.equal(res.statusCode, 500)
  assert.equal(res.body.code, 'SERVER_ERROR')
  assert.equal(logged.mock.callCount(), 1)
})
```

- [ ] **Step 4: Run it and confirm it fails.** Run `npm test`. Expected: FAIL, `Cannot find module …/lib/errors.js`.

- [ ] **Step 5: Implement**

<!-- file: lib/errors.js -->
```js
import { fail } from './http.js'

/**
 * An error whose message is written for the admin and is safe to show them. Anything else
 * that reaches a handler is a bug, and is reported as a generic 500.
 */
export class UserFacingError extends Error {
  constructor(message, code = 'BAD_REQUEST') {
    super(message)
    this.name = 'UserFacingError'
    this.code = code
    this.expose = true
  }
}

export function respondWithError(res, error, label) {
  if (error?.expose) return fail(res, error.code || 'BAD_REQUEST', error.message, 400)
  console.error(`${label} error:`, error)
  return fail(res, 'SERVER_ERROR', error?.message || 'Something went wrong.', 500)
}
```

- [ ] **Step 6: Extract and run.** Run `node scripts/extract-plan-files.mjs 1 && npm test`. Expected: 2 passing.

- [ ] **Step 7: Commit.** Run `git add package.json package-lock.json scripts/extract-plan-files.mjs lib/errors.js tests/errors.test.js` and commit with message `chore: test runner and shared user-facing errors`.

---

## Task 2: CSV parser

**Files:** Create `lib/certificates/csv.js`, `tests/certificates/csv.test.js`

- [ ] **Step 1: Write the failing test**

<!-- file: tests/certificates/csv.test.js -->
```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseCsv } from '../../lib/certificates/csv.js'

test('parses simple rows', () => {
  assert.deepEqual(parseCsv('Full Name,Email\nAyesha Khan,ayesha@example.com\n'), [
    ['Full Name', 'Email'],
    ['Ayesha Khan', 'ayesha@example.com'],
  ])
})

test('handles quoted commas and escaped quotes', () => {
  assert.deepEqual(parseCsv('a,b\n"Khan, Ayesha","say ""hi"""\n'), [
    ['a', 'b'],
    ['Khan, Ayesha', 'say "hi"'],
  ])
})

test('keeps newlines inside quoted fields and accepts CRLF', () => {
  assert.deepEqual(parseCsv('"Full Name\nfirst and last",Email\r\nAli,ali@example.com\r\n'), [
    ['Full Name\nfirst and last', 'Email'],
    ['Ali', 'ali@example.com'],
  ])
})

test('strips a BOM, drops blank rows, reads a last row with no newline', () => {
  assert.deepEqual(parseCsv('﻿Name,Email\n\n , \nSara,sara@example.com'), [
    ['Name', 'Email'],
    ['Sara', 'sara@example.com'],
  ])
})

test('treats a quote inside an unquoted field as a literal', () => {
  assert.deepEqual(parseCsv('a,b\nO"Neil,x@example.com\n'), [
    ['a', 'b'],
    ['O"Neil', 'x@example.com'],
  ])
})
```

- [ ] **Step 2: Run and confirm it fails.** Run `npm test`. Expected: FAIL (module not found).

- [ ] **Step 3: Implement**

<!-- file: lib/certificates/csv.js -->
```js
/**
 * RFC 4180 CSV parser. Handles quoted fields, "" escapes, CR / LF / CRLF line breaks —
 * including inside quotes, which Google Forms headers contain — and a leading BOM.
 * Returns string[][] and drops rows where every cell is blank.
 */
export function parseCsv(text) {
  const input = String(text ?? '').replace(/^﻿/, '')
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < input.length; i++) {
    const ch = input[i]

    if (inQuotes) {
      if (ch !== '"') field += ch
      else if (input[i + 1] === '"') {
        field += '"'
        i++
      } else inQuotes = false
      continue
    }

    if (ch === '"' && field === '') inQuotes = true
    else if (ch === ',') {
      row.push(field)
      field = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && input[i + 1] === '\n') i++
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else field += ch
  }

  if (field !== '' || row.length) {
    row.push(field)
    rows.push(row)
  }

  return rows.filter((r) => r.some((cell) => cell.trim() !== ''))
}
```

- [ ] **Step 4: Extract and run.** Run `node scripts/extract-plan-files.mjs 2 && npm test`. Expected: all pass.

- [ ] **Step 5: Commit.** Message: `feat(certificates): CSV parser`.

---

## Task 3: Google Sheet import

**Files:** Create `lib/certificates/sheets.js`, `tests/certificates/sheets.test.js`

- [ ] **Step 1: Write the failing test**

<!-- file: tests/certificates/sheets.test.js -->
```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseSheetUrl, fetchSheetRows } from '../../lib/certificates/sheets.js'

const ID = 'AbCdEfGhIjKlMnOpQrStUvWxYz0123456789'

test('reads id and gid from an edit link with the gid in query and fragment', () => {
  assert.deepEqual(
    parseSheetUrl(`https://docs.google.com/spreadsheets/d/${ID}/edit?resourcekey=&gid=1246713780#gid=1246713780`),
    { id: ID, gid: '1246713780' }
  )
})

test('reads gid from the fragment alone and defaults to 0', () => {
  assert.equal(parseSheetUrl(`https://docs.google.com/spreadsheets/d/${ID}/edit#gid=42`).gid, '42')
  assert.equal(parseSheetUrl(`https://docs.google.com/spreadsheets/d/${ID}`).gid, '0')
})

test('rejects other hosts, schemes and paths', () => {
  for (const bad of [
    `http://docs.google.com/spreadsheets/d/${ID}`,
    `https://evil.example/spreadsheets/d/${ID}`,
    `https://docs.google.com/document/d/${ID}`,
    'not a url',
    '',
  ]) {
    assert.equal(parseSheetUrl(bad), null, bad)
  }
})

test('fetches the CSV export URL and parses the body', async () => {
  let called
  const fakeFetch = async (url) => {
    called = url
    return new Response('Full Name,Email\nAli,ali@example.com\n', {
      headers: { 'content-type': 'text/csv; charset=utf-8' },
    })
  }
  const rows = await fetchSheetRows(`https://docs.google.com/spreadsheets/d/${ID}/edit#gid=7`, fakeFetch)
  assert.equal(called, `https://docs.google.com/spreadsheets/d/${ID}/export?format=csv&gid=7`)
  assert.deepEqual(rows, [['Full Name', 'Email'], ['Ali', 'ali@example.com']])
})

test('explains how to share when Google returns a sign-in page', async () => {
  const fakeFetch = async () => new Response('<html>Sign in</html>', { headers: { 'content-type': 'text/html' } })
  await assert.rejects(
    fetchSheetRows(`https://docs.google.com/spreadsheets/d/${ID}/edit`, fakeFetch),
    (e) => e.code === 'SHEET_NOT_SHARED' && e.expose === true
  )
})

test('rejects a bad link without fetching', async () => {
  await assert.rejects(
    fetchSheetRows('https://example.com', async () => { throw new Error('should not fetch') }),
    { code: 'BAD_SHEET_URL' }
  )
})
```

- [ ] **Step 2: Run and confirm it fails.** Run `npm test`. Expected: FAIL (module not found).

- [ ] **Step 3: Implement**

<!-- file: lib/certificates/sheets.js -->
```js
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
```

- [ ] **Step 4: Extract and run.** Run `node scripts/extract-plan-files.mjs 3 && npm test`. Expected: all pass.

- [ ] **Step 5: Commit.** Message: `feat(certificates): read attendees from link-shared Google Sheets`.

---

## Task 4: Recipient normalisation and import preview

**Files:** Create `lib/certificates/recipients.js`, `tests/certificates/recipients.test.js`

- [ ] **Step 1: Write the failing test**

<!-- file: tests/certificates/recipients.test.js -->
```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  normalizeName, normalizeEmail, isValidEmail, pickColumns, buildPreview, cleanImportRows,
} from '../../lib/certificates/recipients.js'

test('normalizeName trims and collapses whitespace without touching case', () => {
  assert.equal(normalizeName('  ayesha   KHAN \t'), 'ayesha KHAN')
  assert.equal(normalizeName(null), '')
})

test('normalizeEmail trims and lowercases', () => {
  assert.equal(normalizeEmail('  Ali@Example.COM '), 'ali@example.com')
})

test('isValidEmail accepts ordinary addresses only', () => {
  assert.equal(isValidEmail('ali@example.com'), true)
  for (const bad of ['ali@', 'ali example.com', 'a@b', '', '@example.com']) {
    assert.equal(isValidEmail(bad), false, bad)
  }
})

test('pickColumns prefers "full name" and finds the email column', () => {
  assert.deepEqual(
    pickColumns(['Timestamp', 'Name of university', 'Full Name\nas on CNIC', 'Email Address']),
    { name: 2, email: 3 }
  )
})

test('pickColumns falls back to any header containing "name"', () => {
  assert.deepEqual(pickColumns(['Name', 'E-mail']), { name: 0, email: 1 })
})

test('pickColumns lists the headers it found when a column is missing', () => {
  assert.throws(
    () => pickColumns(['Student', 'Phone']),
    (e) => e.expose === true && e.message.includes('"Student", "Phone"')
  )
})

test('buildPreview flags duplicates, existing, invalid, missing and odd case', () => {
  const table = [
    ['Full Name', 'Email'],
    ['  Ayesha   Khan ', 'Ayesha@Example.com'],
    ['Ayesha Khan', 'ayesha@example.com'],
    ['BILAL AHMED', 'bilal@example.com'],
    ['Sara', 'sara@example.com'],
    ['', 'nameless@example.com'],
    ['Zain', 'not-an-email'],
  ]
  const rows = buildPreview(table, new Set(['sara@example.com']))
  assert.deepEqual(
    rows.map((r) => [r.row, r.fullName, r.email, r.flags, r.include]),
    [
      [2, 'Ayesha Khan', 'ayesha@example.com', [], true],
      [3, 'Ayesha Khan', 'ayesha@example.com', ['duplicate'], false],
      [4, 'BILAL AHMED', 'bilal@example.com', ['oddCase'], true],
      [5, 'Sara', 'sara@example.com', ['existing'], false],
      [6, '', 'nameless@example.com', ['missingName'], false],
      [7, 'Zain', 'not-an-email', ['invalidEmail'], false],
    ]
  )
})

test('buildPreview rejects a sheet with no attendee rows', () => {
  assert.throws(() => buildPreview([['Full Name', 'Email']]), (e) => e.expose === true)
})

test('cleanImportRows re-validates, dedupes and counts what it skipped', () => {
  const { clean, skipped } = cleanImportRows([
    { fullName: ' Ali  Raza ', email: 'ALI@example.com' },
    { fullName: 'Ali Raza', email: 'ali@example.com' },
    { fullName: '', email: 'x@example.com' },
    { fullName: 'Bad', email: 'bad' },
    null,
  ])
  assert.deepEqual(clean, [{ fullName: 'Ali Raza', email: 'ali@example.com' }])
  assert.equal(skipped, 4)
})

test('cleanImportRows requires a list', () => {
  assert.throws(() => cleanImportRows('nope'), (e) => e.expose === true)
})
```

- [ ] **Step 2: Run and confirm it fails.** Run `npm test`. Expected: FAIL (module not found).

- [ ] **Step 3: Implement**

<!-- file: lib/certificates/recipients.js -->
```js
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
```

- [ ] **Step 4: Extract and run.** Run `node scripts/extract-plan-files.mjs 4 && npm test`. Expected: all pass.

- [ ] **Step 5: Commit.** Message: `feat(certificates): attendee normalisation and import preview`.

---

## Task 5: Name layout and PDF rendering

**Files:** Create `lib/certificates/layout.js`, `lib/certificates/render.js`, `tests/certificates/layout.test.js`, `tests/certificates/render.test.js`

- [ ] **Step 1: Write the failing tests**

<!-- file: tests/certificates/layout.test.js -->
```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { layoutName } from '../../lib/certificates/layout.js'

// Every character is half the font size wide.
const measure = (text, size) => text.length * size * 0.5

test('centres the name on the chosen point, baseline measured from the bottom', () => {
  const r = layoutName({
    name: 'Ali Raza',
    style: { x: 0.5, y: 0.4, size: 20, maxWidth: 0.8 },
    pageWidth: 800,
    pageHeight: 600,
    measure,
  })
  assert.deepEqual(r, { size: 20, width: 80, x: 360, y: 360 })
})

test('shrinks a long name to fit the max width', () => {
  const r = layoutName({
    name: 'A'.repeat(50),
    style: { x: 0.5, y: 0.5, size: 20, maxWidth: 0.5 },
    pageWidth: 800,
    pageHeight: 600,
    measure,
  })
  assert.deepEqual(r, { size: 16, width: 400, x: 200, y: 300 })
})
```

<!-- file: tests/certificates/render.test.js -->
```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { PDFDocument } from 'pdf-lib'
import {
  renderCertificate, inspectFont, certificateFilename, parseHexColor, readPdfInfo, MissingGlyphError,
} from '../../lib/certificates/render.js'

// No font ships with the repo; use a system one where available.
const FONT_PATH = 'C:/Windows/Fonts/arial.ttf'
const COLLECTION_PATH = 'C:/Windows/Fonts/cambria.ttc'
const fontBytes = fs.existsSync(FONT_PATH) ? fs.readFileSync(FONT_PATH) : null
const skip = fontBytes ? false : `needs ${FONT_PATH}`

async function blankTemplate(pages = 1) {
  const doc = await PDFDocument.create()
  for (let i = 0; i < pages; i++) doc.addPage([842, 595])
  return doc.save()
}

const style = { x: 0.5, y: 0.5, size: 36, color: '#1e3a8a', maxWidth: 0.6 }

test('certificateFilename strips accents and punctuation', () => {
  assert.equal(
    certificateFilename('Git & GitHub: Basics', 'Zoë  O’Neil'),
    'SkillSprint-Certificate-Git-GitHub-Basics-Zoe-O-Neil.pdf'
  )
})

test('parseHexColor converts to pdf-lib rgb and falls back on bad input', () => {
  const c = parseHexColor('#ff0080')
  assert.equal(c.red, 1)
  assert.equal(c.green, 0)
  assert.ok(Math.abs(c.blue - 128 / 255) < 1e-9)
  assert.equal(parseHexColor('nope').red, 0x11 / 255)
})

test('inspectFont rejects empty, oversized and non-font files', () => {
  assert.throws(() => inspectFont(Buffer.alloc(0)), { code: 'BAD_FONT' })
  assert.throws(() => inspectFont(Buffer.alloc(2 * 1024 * 1024 + 1)), { code: 'BAD_FONT' })
  assert.throws(() => inspectFont(Buffer.from('not a font at all')), { code: 'BAD_FONT' })
})

test('inspectFont rejects font collections', { skip: fs.existsSync(COLLECTION_PATH) ? false : `needs ${COLLECTION_PATH}` }, () => {
  assert.throws(() => inspectFont(fs.readFileSync(COLLECTION_PATH)), { code: 'BAD_FONT' })
})

test('inspectFont returns the family name', { skip }, () => {
  assert.equal(inspectFont(fontBytes).family, 'Arial')
})

test('renderCertificate draws on a single page and sets the title', { skip }, async () => {
  const out = await renderCertificate({
    templatePdf: await blankTemplate(2),
    fontBytes,
    style,
    name: '  Ayesha   Khan ',
    title: 'Git Basics',
  })
  const doc = await PDFDocument.load(out)
  assert.equal(doc.getPageCount(), 1)
  assert.equal(doc.getTitle(), 'Certificate — Ayesha Khan — Git Basics')
  assert.deepEqual(await readPdfInfo(out), { pageWidth: 842, pageHeight: 595, pageCount: 1 })
})

test('renderCertificate refuses characters the font lacks', { skip }, async () => {
  await assert.rejects(
    renderCertificate({ templatePdf: await blankTemplate(), fontBytes, style, name: 'Ali 中' }),
    (e) => e instanceof MissingGlyphError && e.chars.includes('中') && e.expose === true
  )
})

test('renderCertificate refuses an empty name', { skip }, async () => {
  await assert.rejects(
    renderCertificate({ templatePdf: await blankTemplate(), fontBytes, style, name: '   ' }),
    { code: 'EMPTY_NAME' }
  )
})

test('readPdfInfo rejects bytes that are not a PDF', async () => {
  await assert.rejects(readPdfInfo(Buffer.from('nope')), { code: 'BAD_PDF' })
})
```

- [ ] **Step 2: Run and confirm they fail.** Run `npm test`. Expected: FAIL (modules not found).

- [ ] **Step 3: Implement**

<!-- file: lib/certificates/layout.js -->
```js
/**
 * Where the attendee's name goes on the page. Dependency-free on purpose: the server uses it
 * to draw the PDF and the admin panel uses it for the live preview, so both agree.
 *
 * style.x, style.y  baseline centre, as fractions of the page measured from the top-left
 * style.size        font size, in the same units as pageWidth / pageHeight
 * style.maxWidth    widest the name may be, as a fraction of the page width; longer names are
 *                   scaled down rather than wrapped
 * measure(t, size)  rendered width of `t` at `size`
 *
 * Returns { size, width, x, y } in PDF convention: x is the left edge of the text, y is the
 * baseline measured from the BOTTOM of the page.
 */
export function layoutName({ name, style, pageWidth, pageHeight, measure }) {
  const limit = style.maxWidth * pageWidth
  let size = style.size
  let width = measure(name, size)

  if (width > limit && width > 0) {
    size = (size * limit) / width
    width = measure(name, size)
  }

  return {
    size,
    width,
    x: style.x * pageWidth - width / 2,
    y: pageHeight - style.y * pageHeight,
  }
}
```

<!-- file: lib/certificates/render.js -->
```js
import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { layoutName } from './layout.js'
import { normalizeName } from './recipients.js'
import { UserFacingError } from '../errors.js'

export const MAX_FONT_BYTES = 2 * 1024 * 1024

// sfnt signatures pdf-lib can embed: TrueType (two spellings) and CFF OpenType.
// Collections (ttcf) and web fonts (wOFF / wOF2) open in fontkit but cannot be embedded.
const EMBEDDABLE_SIGNATURES = new Set(['00010000', '74727565', '4f54544f'])

export class MissingGlyphError extends UserFacingError {
  constructor(chars, family) {
    super(
      `The font "${family}" has no character for: ${chars.join(' ')}. ` +
        'Upload a font that includes it, or correct the name.',
      'MISSING_GLYPH'
    )
    this.name = 'MissingGlyphError'
    this.chars = chars
  }
}

function openFont(bytes) {
  if (!bytes || bytes.length < 4) return null
  const signature = Buffer.from(bytes.subarray(0, 4)).toString('hex')
  if (!EMBEDDABLE_SIGNATURES.has(signature)) return null
  try {
    return fontkit.create(Buffer.from(bytes))
  } catch {
    return null
  }
}

/** Validate an uploaded font. Returns its family name. */
export function inspectFont(bytes) {
  if (!bytes?.length) throw new UserFacingError('The font file is empty.', 'BAD_FONT')
  if (bytes.length > MAX_FONT_BYTES) {
    throw new UserFacingError('Font files must be 2 MB or smaller.', 'BAD_FONT')
  }
  const font = openFont(bytes)
  if (!font?.familyName) throw new UserFacingError('Upload a .ttf or .otf font file.', 'BAD_FONT')
  return { family: font.familyName }
}

export function missingGlyphs(font, text) {
  const missing = new Set()
  for (const ch of text) {
    if (/\s/.test(ch)) continue
    if (!font.hasGlyphForCodePoint(ch.codePointAt(0))) missing.add(ch)
  }
  return [...missing]
}

export function parseHexColor(hex) {
  const match = /^#?([0-9a-f]{6})$/i.exec(String(hex ?? ''))
  const n = parseInt(match ? match[1] : '111827', 16)
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255)
}

export async function readPdfInfo(bytes) {
  let doc
  try {
    doc = await PDFDocument.load(bytes)
  } catch {
    throw new UserFacingError('Canva returned a PDF that could not be read. Fetch it again.', 'BAD_PDF')
  }
  const { width, height } = doc.getPage(0).getSize()
  return { pageWidth: width, pageHeight: height, pageCount: doc.getPageCount() }
}

export function certificateFilename(workshopTitle, name) {
  const clean = (s) =>
    String(s ?? '').normalize('NFKD').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  const stem = ['SkillSprint-Certificate', clean(workshopTitle), clean(name)].filter(Boolean).join('-')
  return `${stem.slice(0, 120)}.pdf`
}

/** The template with `name` drawn on page 1. Returns the PDF bytes. */
export async function renderCertificate({ templatePdf, fontBytes, style, name, title = '' }) {
  const text = normalizeName(name)
  if (!text) throw new UserFacingError('The name is empty.', 'EMPTY_NAME')

  const fk = openFont(fontBytes)
  if (!fk) throw new UserFacingError('The stored font could not be read. Upload it again.', 'BAD_FONT')
  const missing = missingGlyphs(fk, text)
  if (missing.length) throw new MissingGlyphError(missing, fk.familyName)

  const doc = await PDFDocument.load(templatePdf)
  doc.registerFontkit(fontkit)
  // Embedded whole rather than subset: pdf-lib's subsetter garbles glyphs in some fonts, and a
  // few hundred KB on one attachment is a fair price for never sending a broken name.
  const font = await doc.embedFont(fontBytes, { subset: false })

  // Only page 1 is the certificate.
  while (doc.getPageCount() > 1) doc.removePage(doc.getPageCount() - 1)

  const page = doc.getPage(0)
  const { width: pageWidth, height: pageHeight } = page.getSize()
  const layout = layoutName({
    name: text,
    style,
    pageWidth,
    pageHeight,
    measure: (t, size) => font.widthOfTextAtSize(t, size),
  })

  page.drawText(text, {
    x: layout.x,
    y: layout.y,
    size: layout.size,
    font,
    color: parseHexColor(style.color),
  })

  doc.setTitle(title ? `Certificate — ${text} — ${title}` : `Certificate — ${text}`)
  doc.setProducer('SkillSprint')
  return doc.save()
}
```

- [ ] **Step 4: Extract and run.** Run `node scripts/extract-plan-files.mjs 5 && npm test`. Expected: all pass on Windows. The font-dependent tests report as skipped elsewhere.

- [ ] **Step 5: Commit.** Message: `feat(certificates): name layout and PDF rendering`.

---

## Task 6: Canva link parsing

**Files:** Create `lib/canva/links.js`, `tests/canva/links.test.js`

- [ ] **Step 1: Write the failing test**

<!-- file: tests/canva/links.test.js -->
```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { designIdFromUrl, shortLinkSlug, resolveDesignId } from '../../lib/canva/links.js'

test('designIdFromUrl reads the id from view and edit links', () => {
  assert.equal(
    designIdFromUrl('https://www.canva.com/design/DAHVYCBCOmg/FrZFPM0pMMohw0sdQGrcqw/view?utm_content=x'),
    'DAHVYCBCOmg'
  )
  assert.equal(designIdFromUrl('https://www.canva.com/design/DAHVYCBCOmg/edit'), 'DAHVYCBCOmg')
  assert.equal(designIdFromUrl('www.canva.com/design/DAHVYCBCOmg/view'), 'DAHVYCBCOmg')
})

test('designIdFromUrl rejects other hosts and paths', () => {
  for (const bad of [
    'https://evil.example/design/DAHVYCBCOmg/view',
    'https://www.canva.com.evil.example/design/DAHVYCBCOmg/view',
    'https://www.canva.com/templates/EAF123456/',
    '',
    null,
  ]) {
    assert.equal(designIdFromUrl(bad), null, String(bad))
  }
})

test('shortLinkSlug accepts canva.link only', () => {
  assert.equal(shortLinkSlug('https://canva.link/9e9xyxpifdtp4ex'), '9e9xyxpifdtp4ex')
  assert.equal(shortLinkSlug('canva.link/9e9xyxpifdtp4ex'), '9e9xyxpifdtp4ex')
  assert.equal(shortLinkSlug('https://canva.link/9e9x/../../etc'), null)
  assert.equal(shortLinkSlug('https://bit.ly/9e9xyxpifdtp4ex'), null)
})

test('resolveDesignId reads one canva.link redirect without following it', async () => {
  let seen
  const fakeFetch = async (url, init) => {
    seen = { url, init }
    return new Response(null, {
      status: 301,
      headers: { location: 'https://www.canva.com/design/DAHVYOULcqg/5Cd6/view?mode=preview' },
    })
  }
  assert.equal(await resolveDesignId('https://canva.link/9e9xyxpifdtp4ex', fakeFetch), 'DAHVYOULcqg')
  assert.equal(seen.url, 'https://canva.link/9e9xyxpifdtp4ex')
  assert.equal(seen.init.redirect, 'manual')
})

test('resolveDesignId rejects a short link that points somewhere else', async () => {
  const fakeFetch = async () => new Response(null, { status: 301, headers: { location: 'https://example.com/' } })
  await assert.rejects(resolveDesignId('https://canva.link/abcdef123', fakeFetch), { code: 'BAD_CANVA_LINK' })
})

test('resolveDesignId uses a direct design link without fetching', async () => {
  const noFetch = async () => { throw new Error('should not fetch') }
  assert.equal(await resolveDesignId('https://www.canva.com/design/DAHVYCRah4Y/x/view', noFetch), 'DAHVYCRah4Y')
})

test('resolveDesignId rejects anything else', async () => {
  await assert.rejects(resolveDesignId('https://example.com/abc'), { code: 'BAD_CANVA_LINK' })
})
```

- [ ] **Step 2: Run and confirm it fails.** Run `npm test`. Expected: FAIL (module not found).

- [ ] **Step 3: Implement**

<!-- file: lib/canva/links.js -->
```js
import { UserFacingError } from '../errors.js'

const DESIGN_PATH = /^\/design\/([A-Za-z0-9_-]{6,64})(?:\/|$)/
const SHORT_PATH = /^\/([A-Za-z0-9]{6,64})\/?$/

function toUrl(input) {
  const raw = String(input ?? '').trim()
  if (!raw) return null
  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url : null
  } catch {
    return null
  }
}

/** Design id from a canva.com/design/<id>/… link, or null. */
export function designIdFromUrl(input) {
  const url = toUrl(input)
  if (!url || (url.hostname !== 'www.canva.com' && url.hostname !== 'canva.com')) return null
  return url.pathname.match(DESIGN_PATH)?.[1] ?? null
}

/** Slug from a canva.link/<slug> short link, or null. */
export function shortLinkSlug(input) {
  const url = toUrl(input)
  if (!url || url.hostname !== 'canva.link') return null
  return url.pathname.match(SHORT_PATH)?.[1] ?? null
}

/**
 * The design id behind a pasted Canva link. Short links are resolved with a single request
 * to a URL we build ourselves, and the redirect is read rather than followed.
 */
export async function resolveDesignId(input, fetchImpl = fetch) {
  const direct = designIdFromUrl(input)
  if (direct) return direct

  const slug = shortLinkSlug(input)
  if (!slug) {
    throw new UserFacingError(
      'Paste a Canva design link (canva.com/design/… or canva.link/…).',
      'BAD_CANVA_LINK'
    )
  }

  let res
  try {
    res = await fetchImpl(`https://canva.link/${slug}`, { redirect: 'manual' })
  } catch {
    throw new UserFacingError('Could not reach canva.link. Try again.', 'CANVA_UNREACHABLE')
  }

  const id = designIdFromUrl(res.headers.get('location'))
  if (!id) {
    throw new UserFacingError('That canva.link address does not point to a Canva design.', 'BAD_CANVA_LINK')
  }
  return id
}
```

- [ ] **Step 4: Extract and run.** Run `node scripts/extract-plan-files.mjs 6 && npm test`. Expected: all pass.

- [ ] **Step 5: Commit.** Message: `feat(canva): resolve design ids from pasted links`.

---

## Task 7: Token encryption

**Files:** Create `lib/canva/tokenCrypto.js`, `tests/canva/tokenCrypto.test.js`

- [ ] **Step 1: Write the failing test**

<!-- file: tests/canva/tokenCrypto.test.js -->
```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { encryptToken, decryptToken } from '../../lib/canva/tokenCrypto.js'

const SECRET = 'test-secret-for-token-crypto'
process.env.ADMIN_SESSION_SECRET = SECRET

test('round-trips a token', () => {
  assert.equal(decryptToken(encryptToken('abc.def-123')), 'abc.def-123')
})

test('seals the same token differently each time', () => {
  assert.notEqual(encryptToken('same'), encryptToken('same'))
})

test('refuses tampered ciphertext', () => {
  const parts = encryptToken('secret').split('.')
  parts[3] = Buffer.from('tampered').toString('base64url')
  assert.throws(() => decryptToken(parts.join('.')))
})

test('refuses a token sealed under a different secret', () => {
  const sealed = encryptToken('secret')
  process.env.ADMIN_SESSION_SECRET = 'a-different-secret'
  try {
    assert.throws(() => decryptToken(sealed))
  } finally {
    process.env.ADMIN_SESSION_SECRET = SECRET
  }
})

test('refuses unknown formats', () => {
  assert.throws(() => decryptToken('plain-token'))
})
```

- [ ] **Step 2: Run and confirm it fails.** Run `npm test`. Expected: FAIL (module not found).

- [ ] **Step 3: Implement**

<!-- file: lib/canva/tokenCrypto.js -->
```js
import crypto from 'node:crypto'

/**
 * AES-256-GCM sealing for Canva OAuth tokens at rest. The key is derived from
 * ADMIN_SESSION_SECRET, so no extra secret is needed; rotating that secret simply means
 * reconnecting Canva.
 *
 * Format: v1.<iv>.<tag>.<ciphertext>, each part base64url.
 */
function key() {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set')
  return Buffer.from(crypto.hkdfSync('sha256', secret, 'skillsprint', 'canva-token-v1', 32))
}

export function encryptToken(plain) {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv)
  const data = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return ['v1', iv, tag, data].map((p) => (typeof p === 'string' ? p : p.toString('base64url'))).join('.')
}

export function decryptToken(sealed) {
  const [version, iv, tag, data] = String(sealed ?? '').split('.')
  if (version !== 'v1' || !iv || !tag || data === undefined) {
    throw new Error('Unrecognised token format')
  }
  const decipher = crypto.createDecipheriv('aes-256-gcm', key(), Buffer.from(iv, 'base64url'))
  decipher.setAuthTag(Buffer.from(tag, 'base64url'))
  return Buffer.concat([decipher.update(Buffer.from(data, 'base64url')), decipher.final()]).toString('utf8')
}
```

- [ ] **Step 4: Extract and run.** Run `node scripts/extract-plan-files.mjs 7 && npm test`. Expected: all pass.

- [ ] **Step 5: Commit.** Message: `feat(canva): encrypt OAuth tokens at rest`.

---

## Task 8: Schema

**Files:** Modify `lib/schema.js`, adding to the end of the `STATEMENTS` array, after the `admin_login_attempts_idx` statement.

- [ ] **Step 1: Append these statements** inside `STATEMENTS`, before the closing `]`:

```js
  // ── Certificates ─────────────────────────────────────────────────────────────
  // One template per workshop: the Canva export plus where and how the name is drawn.
  `CREATE TABLE IF NOT EXISTS certificate_templates (
     workshop_id     UUID PRIMARY KEY REFERENCES workshops(id) ON DELETE CASCADE,
     canva_url       TEXT NOT NULL DEFAULT '',
     canva_design_id TEXT NOT NULL DEFAULT '',
     canva_title     TEXT NOT NULL DEFAULT '',
     pdf             BYTEA,
     preview_png     BYTEA,
     page_width      REAL,
     page_height     REAL,
     page_count      INT,
     fetched_at      TIMESTAMPTZ,
     font            BYTEA,
     font_filename   TEXT NOT NULL DEFAULT '',
     font_family     TEXT NOT NULL DEFAULT '',
     name_x          REAL,
     name_y          REAL,
     name_size       REAL NOT NULL DEFAULT 36,
     name_color      TEXT NOT NULL DEFAULT '#111827',
     name_max_width  REAL NOT NULL DEFAULT 0.6,
     created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
     updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  // Attendees, per workshop. Deliberately separate from registrations: reminders go to every
  // registration, and walk-in attendees never asked for those.
  `CREATE TABLE IF NOT EXISTS certificate_recipients (
     id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
     full_name   TEXT NOT NULL,
     email       TEXT NOT NULL,
     source      TEXT NOT NULL DEFAULT '',
     created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
     updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
     CONSTRAINT certificate_recipients_unique UNIQUE (workshop_id, email)
   )`,
  // A job now belongs to a registration OR a certificate recipient. Guarded so a warm
  // start does not take a table lock for a change that is already in place.
  `DO $$ BEGIN
     IF EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'email_jobs' AND column_name = 'registration_id'
                   AND is_nullable = 'NO') THEN
       ALTER TABLE email_jobs ALTER COLUMN registration_id DROP NOT NULL;
     END IF;
   END $$`,
  `ALTER TABLE email_jobs ADD COLUMN IF NOT EXISTS certificate_recipient_id UUID
     REFERENCES certificate_recipients(id) ON DELETE CASCADE`,
  `DO $$ BEGIN
     IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'email_jobs_one_recipient') THEN
       ALTER TABLE email_jobs ADD CONSTRAINT email_jobs_one_recipient
         CHECK ((registration_id IS NULL) <> (certificate_recipient_id IS NULL));
     END IF;
   END $$`,
  // One certificate job per attendee per workshop, however often Send is clicked.
  `CREATE UNIQUE INDEX IF NOT EXISTS email_jobs_unique_certificate
     ON email_jobs (certificate_recipient_id, template)
     WHERE certificate_recipient_id IS NOT NULL`,

  // ── Canva connection ─────────────────────────────────────────────────────────
  // A single row. Tokens are AES-GCM sealed (lib/canva/tokenCrypto.js).
  `CREATE TABLE IF NOT EXISTS canva_connection (
     id            INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
     access_token  TEXT NOT NULL,
     refresh_token TEXT NOT NULL,
     expires_at    TIMESTAMPTZ NOT NULL,
     scope         TEXT NOT NULL DEFAULT '',
     display_name  TEXT NOT NULL DEFAULT '',
     connected_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
     updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  // Short-lived PKCE verifiers, keyed by the OAuth state. Single use.
  `CREATE TABLE IF NOT EXISTS canva_oauth_states (
     state         TEXT PRIMARY KEY,
     code_verifier TEXT NOT NULL,
     redirect_uri  TEXT NOT NULL,
     created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
```

- [ ] **Step 2: Syntax check.** Run `node --check lib/schema.js`. Expected: no output.

- [ ] **Step 3: Commit.** Message: `feat(certificates): schema for templates, recipients and the Canva connection`.

The migration runs against the database in Task 16, after the user confirms.

---

## Task 9: Canva OAuth and API client

**Files:** Create `lib/canva/oauth.js`, `lib/canva/client.js`, `tests/canva/oauth.test.js`

- [ ] **Step 1: Write the failing test**

<!-- file: tests/canva/oauth.test.js -->
```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { pkcePair, redirectUriFor, CANVA_SCOPES, authorizeUrl } from '../../lib/canva/oauth.js'

test('pkcePair makes an RFC 7636 verifier and its S256 challenge', () => {
  const { verifier, challenge } = pkcePair()
  assert.match(verifier, /^[A-Za-z0-9_-]{43,128}$/)
  assert.equal(challenge, crypto.createHash('sha256').update(verifier).digest('base64url'))
})

test('redirectUriFor prefers CANVA_REDIRECT_URI', () => {
  process.env.CANVA_REDIRECT_URI = 'https://example.org/admin/canva/callback'
  try {
    assert.equal(redirectUriFor({ headers: { host: '127.0.0.1:5173' } }), 'https://example.org/admin/canva/callback')
  } finally {
    delete process.env.CANVA_REDIRECT_URI
  }
})

test('redirectUriFor uses http for loopback hosts and https elsewhere', () => {
  assert.equal(redirectUriFor({ headers: { host: '127.0.0.1:5173' } }), 'http://127.0.0.1:5173/admin/canva/callback')
  assert.equal(
    redirectUriFor({ headers: { host: 'skill-sprint.pk', 'x-forwarded-proto': 'https,http' } }),
    'https://skill-sprint.pk/admin/canva/callback'
  )
  assert.equal(redirectUriFor({ headers: { host: 'skill-sprint.pk' } }), 'https://skill-sprint.pk/admin/canva/callback')
})

test('authorizeUrl asks for exactly the scopes the feature needs, with S256 PKCE', () => {
  process.env.CANVA_CLIENT_ID = 'OC-test'
  const url = new URL(authorizeUrl({ state: 'st', challenge: 'ch', redirectUri: 'http://127.0.0.1:5173/admin/canva/callback' }))
  assert.equal(url.origin + url.pathname, 'https://www.canva.com/api/oauth/authorize')
  assert.equal(url.searchParams.get('scope'), CANVA_SCOPES.join(' '))
  assert.deepEqual(CANVA_SCOPES, ['design:meta:read', 'design:content:read', 'profile:read'])
  assert.equal(url.searchParams.get('code_challenge_method'), 'S256')
  assert.equal(url.searchParams.get('code_challenge'), 'ch')
  assert.equal(url.searchParams.get('response_type'), 'code')
  assert.equal(url.searchParams.get('client_id'), 'OC-test')
  assert.equal(url.searchParams.get('state'), 'st')
})
```

- [ ] **Step 2: Run and confirm it fails.** Run `npm test`. Expected: FAIL (module not found).

- [ ] **Step 3: Implement**

<!-- file: lib/canva/oauth.js -->
```js
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
```

<!-- file: lib/canva/client.js -->
```js
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
```

- [ ] **Step 4: Extract and run.** Run `node scripts/extract-plan-files.mjs 9 && npm test && node --check lib/canva/client.js`. Expected: all pass.

- [ ] **Step 5: Commit.** Message: `feat(canva): OAuth connection and design export client`.

---

## Task 10: Template and recipient storage

**Files:** Create `lib/certificates/templates.js`, `lib/certificates/store.js`

These modules are thin SQL wrappers. They're exercised against the database in Task 16, so there are no unit tests here.

- [ ] **Step 1: Implement**

<!-- file: lib/certificates/templates.js -->
```js
import { query } from '../db.js'
import { resolveDesignId } from '../canva/links.js'
import { getDesign, exportDesign } from '../canva/client.js'
import { inspectFont, readPdfInfo } from './render.js'
import { UserFacingError } from '../errors.js'

// Vercel caps a function response at 4.5 MB; the sample download returns the whole PDF.
export const PDF_WARN_BYTES = 4 * 1024 * 1024

const META_COLUMNS = `
  workshop_id, canva_url, canva_design_id, canva_title, page_width, page_height, page_count,
  fetched_at, font_filename, font_family, name_x, name_y, name_size, name_color, name_max_width,
  octet_length(pdf) AS pdf_bytes, (preview_png IS NOT NULL) AS has_preview,
  (font IS NOT NULL) AS has_font, updated_at`

export function styleFromRow(row) {
  return {
    x: row.name_x,
    y: row.name_y,
    size: row.name_size,
    color: row.name_color,
    maxWidth: row.name_max_width,
  }
}

export function templateReadiness(row) {
  const template = Boolean(row?.pdf_bytes)
  const placed = row?.name_x != null && row?.name_y != null
  return { template, style: template && Boolean(row?.has_font) && placed }
}

/** Template settings without the file bytes, or null. */
export async function getTemplateMeta(workshopId) {
  const { rows } = await query(
    `SELECT ${META_COLUMNS} FROM certificate_templates WHERE workshop_id = $1`,
    [workshopId]
  )
  return rows[0] || null
}

const ASSET_COLUMNS = { preview: 'preview_png', font: 'font' }

export async function getTemplateAsset(workshopId, asset) {
  const column = ASSET_COLUMNS[asset]
  if (!column) throw new UserFacingError(`Unknown asset: ${asset}`, 'BAD_ASSET')
  const { rows } = await query(
    `SELECT ${column} AS bytes FROM certificate_templates WHERE workshop_id = $1`,
    [workshopId]
  )
  return rows[0]?.bytes || null
}

/** Everything the renderer needs, or { error } explaining what is still missing. */
export async function loadRenderable(workshopId) {
  const { rows } = await query(
    `SELECT t.pdf, t.font, t.name_x, t.name_y, t.name_size, t.name_color, t.name_max_width,
            w.title
       FROM certificate_templates t
       JOIN workshops w ON w.id = t.workshop_id
      WHERE t.workshop_id = $1`,
    [workshopId]
  )
  const row = rows[0]
  if (!row?.pdf) return { error: 'The certificate template has not been fetched from Canva.' }
  if (!row.font) return { error: 'No font has been uploaded for this certificate.' }
  if (row.name_x == null || row.name_y == null) return { error: 'The name position has not been set.' }
  return {
    templatePdf: row.pdf,
    fontBytes: row.font,
    style: styleFromRow(row),
    workshopTitle: row.title,
  }
}

/** Export the design behind `canvaUrl` (PDF + preview PNG) and store it for the workshop. */
export async function fetchTemplateFromCanva(workshopId, canvaUrl) {
  const designId = await resolveDesignId(canvaUrl)

  // In parallel: two sequential exports can outlast a 60 s function.
  const [design, pdf, png] = await Promise.all([
    getDesign(designId),
    exportDesign(designId, { type: 'pdf', pages: [1] }),
    exportDesign(designId, { type: 'png', pages: [1], width: 1600, lossless: false }),
  ])
  const info = await readPdfInfo(pdf)

  await query(
    `INSERT INTO certificate_templates
       (workshop_id, canva_url, canva_design_id, canva_title, pdf, preview_png,
        page_width, page_height, page_count, fetched_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now())
     ON CONFLICT (workshop_id) DO UPDATE SET
       canva_url = EXCLUDED.canva_url, canva_design_id = EXCLUDED.canva_design_id,
       canva_title = EXCLUDED.canva_title, pdf = EXCLUDED.pdf, preview_png = EXCLUDED.preview_png,
       page_width = EXCLUDED.page_width, page_height = EXCLUDED.page_height,
       page_count = EXCLUDED.page_count, fetched_at = now(), updated_at = now()`,
    [
      workshopId, String(canvaUrl).trim(), designId, design.title, pdf, png,
      info.pageWidth, info.pageHeight, design.pageCount,
    ]
  )

  const warnings = []
  if (design.pageCount > 1) {
    warnings.push(`The design has ${design.pageCount} pages. Only page 1 is used.`)
  }
  if (pdf.length > PDF_WARN_BYTES) {
    warnings.push(
      `The PDF is ${(pdf.length / 1048576).toFixed(1)} MB. Keep it under 4 MB ` +
        '(compress images in Canva) or the sample download may fail.'
    )
  }
  return { designId, title: design.title, warnings }
}

function numberIn(value, min, max, label) {
  const n = Number(value)
  if (!Number.isFinite(n) || n < min || n > max) {
    throw new UserFacingError(`${label} must be between ${min} and ${max}.`, 'BAD_STYLE')
  }
  return n
}

export async function saveStyle(workshopId, input) {
  const color = String(input.color || '').toLowerCase()
  if (!/^#[0-9a-f]{6}$/.test(color)) {
    throw new UserFacingError('Colour must look like #1a2b3c.', 'BAD_STYLE')
  }
  const style = {
    x: numberIn(input.x, 0, 1, 'Horizontal position'),
    y: numberIn(input.y, 0, 1, 'Vertical position'),
    size: numberIn(input.size, 4, 400, 'Font size'),
    color,
    maxWidth: numberIn(input.maxWidth, 0.05, 1, 'Max width'),
  }

  const { rowCount } = await query(
    `UPDATE certificate_templates
        SET name_x = $2, name_y = $3, name_size = $4, name_color = $5, name_max_width = $6,
            updated_at = now()
      WHERE workshop_id = $1`,
    [workshopId, style.x, style.y, style.size, style.color, style.maxWidth]
  )
  if (!rowCount) throw new UserFacingError('Fetch the template from Canva first.', 'NOT_READY')
  return style
}

export async function saveFont(workshopId, { base64, filename }) {
  const bytes = Buffer.from(String(base64 || ''), 'base64')
  const { family } = inspectFont(bytes)
  const name = String(filename || '').slice(0, 200)

  const { rowCount } = await query(
    `UPDATE certificate_templates
        SET font = $2, font_filename = $3, font_family = $4, updated_at = now()
      WHERE workshop_id = $1`,
    [workshopId, bytes, name, family]
  )
  if (!rowCount) throw new UserFacingError('Fetch the template from Canva first.', 'NOT_READY')
  return { family, filename: name }
}
```

<!-- file: lib/certificates/store.js -->
```js
import { query } from '../db.js'
import { normalizeName, normalizeEmail, isValidEmail } from './recipients.js'
import { MAX_ATTEMPTS } from '../email/worker.js'
import { UserFacingError } from '../errors.js'

const TEMPLATE = 'certificate'

export async function assertWorkshop(workshopId) {
  const { rowCount } = await query('SELECT 1 FROM workshops WHERE id = $1', [workshopId])
  if (!rowCount) throw new UserFacingError('That workshop no longer exists.', 'NOT_FOUND')
}

/** Per-workshop readiness and delivery counts for the tab overview. */
export async function workshopSummaries() {
  const { rows } = await query(
    `SELECT w.id, w.title, w.starts_at,
            (t.pdf IS NOT NULL) AS has_template,
            (t.font IS NOT NULL) AS has_font,
            (t.name_x IS NOT NULL AND t.name_y IS NOT NULL) AS placed,
            COALESCE(c.recipients, 0) AS recipients,
            COALESCE(j.queued, 0)     AS queued,
            COALESCE(j.sent, 0)       AS sent,
            COALESCE(j.delivered, 0)  AS delivered,
            COALESCE(j.waiting, 0)    AS waiting,
            COALESCE(j.failed, 0)     AS failed
       FROM workshops w
       LEFT JOIN certificate_templates t ON t.workshop_id = w.id
       LEFT JOIN (
         SELECT workshop_id, count(*)::int AS recipients
           FROM certificate_recipients GROUP BY workshop_id
       ) c ON c.workshop_id = w.id
       LEFT JOIN (
         SELECT cr.workshop_id,
                count(*)::int AS queued,
                count(*) FILTER (WHERE j.status IN ('sent', 'delivered'))::int AS sent,
                count(*) FILTER (WHERE j.status = 'delivered')::int AS delivered,
                count(*) FILTER (WHERE j.status IN ('pending', 'processing', 'deferred'))::int AS waiting,
                count(*) FILTER (WHERE j.status IN ('failed', 'bounced'))::int AS failed
           FROM email_jobs j
           JOIN certificate_recipients cr ON cr.id = j.certificate_recipient_id
          WHERE j.template = $1
          GROUP BY cr.workshop_id
       ) j ON j.workshop_id = w.id
      ORDER BY w.starts_at ASC`,
    [TEMPLATE]
  )
  return rows
}

export async function listRecipients(workshopId) {
  const { rows } = await query(
    `SELECT c.id, c.full_name, c.email, c.created_at,
            j.id AS job_id, j.status, j.provider, j.last_error, j.attempts,
            j.sent_at, j.delivered_at, j.next_attempt_at
       FROM certificate_recipients c
       LEFT JOIN email_jobs j
              ON j.certificate_recipient_id = c.id AND j.template = $2
      WHERE c.workshop_id = $1
      ORDER BY lower(c.full_name), c.email`,
    [workshopId, TEMPLATE]
  )
  return rows
}

export async function existingEmails(workshopId) {
  const { rows } = await query(
    'SELECT email FROM certificate_recipients WHERE workshop_id = $1',
    [workshopId]
  )
  return new Set(rows.map((r) => r.email))
}

/** Insert cleaned rows; people already on the list are left untouched. Returns the count added. */
export async function insertRecipients(workshopId, rows, source) {
  if (!rows.length) return 0
  const { rowCount } = await query(
    `INSERT INTO certificate_recipients (workshop_id, full_name, email, source)
     SELECT $1, t.full_name, t.email, $4
       FROM unnest($2::text[], $3::text[]) AS t(full_name, email)
     ON CONFLICT (workshop_id, email) DO NOTHING`,
    [workshopId, rows.map((r) => r.fullName), rows.map((r) => r.email), String(source || '').slice(0, 500)]
  )
  return rowCount
}

export async function updateRecipient(id, { fullName, email }) {
  const name = normalizeName(fullName)
  const mail = normalizeEmail(email)
  if (!name) throw new UserFacingError('The name cannot be empty.', 'BAD_NAME')
  if (!isValidEmail(mail)) throw new UserFacingError('That email address does not look right.', 'BAD_EMAIL')

  let rows
  try {
    ;({ rows } = await query(
      `UPDATE certificate_recipients
          SET full_name = $2, email = $3, updated_at = now()
        WHERE id = $1
        RETURNING id, full_name, email`,
      [id, name, mail]
    ))
  } catch (error) {
    if (error.code === '23505') {
      throw new UserFacingError('Someone with that email is already on this workshop list.', 'DUPLICATE')
    }
    throw error
  }
  if (!rows.length) throw new UserFacingError('That person is no longer on the list.', 'NOT_FOUND')
  return rows[0]
}

export async function deleteRecipient(id) {
  // email_jobs rows go with it (ON DELETE CASCADE).
  await query('DELETE FROM certificate_recipients WHERE id = $1', [id])
}

/** Queue a certificate for everyone on the list who does not have one yet. */
export async function queueAll(workshopId) {
  const { rowCount } = await query(
    `INSERT INTO email_jobs (certificate_recipient_id, template)
     SELECT c.id, $2 FROM certificate_recipients c WHERE c.workshop_id = $1
     ON CONFLICT (certificate_recipient_id, template)
       WHERE certificate_recipient_id IS NOT NULL
     DO NOTHING`,
    [workshopId, TEMPLATE]
  )
  return rowCount
}

/**
 * Make one person's certificate sendable again: create the job if it never existed,
 * otherwise reset it with a fresh retry budget. Returns the job id, or null while it is
 * mid-send.
 */
export async function prepareResend(recipientId) {
  try {
    const { rows } = await query(
      `INSERT INTO email_jobs (certificate_recipient_id, template)
       VALUES ($1, $2)
       ON CONFLICT (certificate_recipient_id, template)
         WHERE certificate_recipient_id IS NOT NULL
       DO UPDATE SET status = 'pending', attempts = 0, last_error = NULL,
                     next_attempt_at = now(), delivered_at = NULL, updated_at = now()
         WHERE email_jobs.status <> 'processing'
       RETURNING id`,
      [recipientId, TEMPLATE]
    )
    return rows[0]?.id || null
  } catch (error) {
    if (error.code === '23503') {
      throw new UserFacingError('That person is no longer on the list.', 'NOT_FOUND')
    }
    throw error
  }
}

/** Certificate jobs a worker run could pick up right now. */
export async function countDueCertificateJobs() {
  const { rows } = await query(
    `SELECT count(*)::int AS n
       FROM email_jobs
      WHERE certificate_recipient_id IS NOT NULL
        AND status IN ('pending', 'deferred')
        AND attempts < $1
        AND next_attempt_at <= now()`,
    [MAX_ATTEMPTS]
  )
  return rows[0].n
}
```

- [ ] **Step 2: Syntax check.** Run `node scripts/extract-plan-files.mjs 10 && node --check lib/certificates/templates.js && node --check lib/certificates/store.js`. Expected: no errors.

`store.js` imports `MAX_ATTEMPTS` from `lib/email/worker.js`, which Task 13 exports. Until then, only run the syntax check here, not an import.

- [ ] **Step 3: Commit.** Message: `feat(certificates): template and recipient storage`.

---

## Task 11: Certificate email and provider attachments

**Files:**
- Create: `lib/email/certificateTemplate.js`, `tests/email/certificateTemplate.test.js`, `tests/email/providers.test.js`
- Modify: `lib/email/providers.js`

- [ ] **Step 1: Write the failing tests**

<!-- file: tests/email/certificateTemplate.test.js -->
```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { renderCertificateEmail } from '../../lib/email/certificateTemplate.js'

test('names the workshop, escapes HTML and has no unsubscribe link', () => {
  const { subject, html, text } = renderCertificateEmail({
    recipient: { full_name: '<b>Ali</b> Raza', email: 'ali@example.com' },
    workshop: { title: 'Git & GitHub' },
    siteUrl: 'https://skill-sprint.pk',
  })
  assert.equal(subject, 'Your certificate — Git & GitHub')
  assert.ok(html.includes('&lt;b&gt;Ali&lt;/b&gt;'))
  assert.ok(!html.includes('<b>Ali</b>'))
  assert.ok(html.includes('Git &amp; GitHub'))
  assert.ok(text.includes('Git & GitHub'))
  assert.ok(text.includes('https://skill-sprint.pk/workshops'))
  assert.ok(!/unsubscribe/i.test(html + text))
})
```

<!-- file: tests/email/providers.test.js -->
```js
import { test, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { sendWith } from '../../lib/email/providers.js'

const realFetch = globalThis.fetch
afterEach(() => { globalThis.fetch = realFetch })

function captureFetch() {
  const calls = []
  globalThis.fetch = async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body) })
    return new Response(JSON.stringify({ id: 'r_1', messageId: 'b_1' }), { status: 201 })
  }
  return calls
}

const attachments = [{ filename: 'cert.pdf', content: 'JVBERi0=' }]
const message = { to: 'x@example.com', toName: 'X', subject: 's', html: 'h', text: 't' }

process.env.RESEND_API_KEY = 'test'
process.env.RESEND_FROM = 'from@example.com'
process.env.BREVO_API_KEY = 'test'
process.env.BREVO_FROM = 'from@example.com'

test('Resend receives attachments as filename/content', async () => {
  const calls = captureFetch()
  const result = await sendWith('resend', { ...message, attachments })
  assert.equal(result.outcome, 'sent')
  assert.deepEqual(calls[0].body.attachments, [{ filename: 'cert.pdf', content: 'JVBERi0=' }])
})

test('Brevo receives attachments as name/content', async () => {
  const calls = captureFetch()
  const result = await sendWith('brevo', { ...message, attachments })
  assert.equal(result.outcome, 'sent')
  assert.deepEqual(calls[0].body.attachment, [{ name: 'cert.pdf', content: 'JVBERi0=' }])
})

test('no attachment field is sent when there are none', async () => {
  const calls = captureFetch()
  await sendWith('resend', message)
  await sendWith('brevo', message)
  assert.equal('attachments' in calls[0].body, false)
  assert.equal('attachment' in calls[1].body, false)
})
```

- [ ] **Step 2: Run and confirm they fail.** Run `npm test`. Expected: the template test fails (module missing), and the attachment tests fail (`undefined` attachments).

- [ ] **Step 3: Implement the template**

<!-- file: lib/email/certificateTemplate.js -->
```js
/**
 * The certificate email. The PDF itself travels as an attachment; this is the note around it.
 * Same table-based, inline-styled shell as template.js, because email clients strip the rest.
 *
 * No unsubscribe link: a certificate is something the person earned, sent once, and is not
 * marketing.
 */

const BRAND = '#2563eb'
const INK = '#0f172a'
const MUTED = '#64748b'
const RULE = '#e2e8f0'

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function firstName(fullName) {
  return String(fullName || '').trim().split(/\s+/)[0] || 'there'
}

export function renderCertificateEmail({ recipient, workshop, siteUrl }) {
  const name = firstName(recipient.full_name)
  const title = workshop.title
  const subject = `Your certificate — ${title}`
  const workshopsUrl = `${String(siteUrl).replace(/\/+$/, '')}/workshops`

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#f8fafc;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="max-width:560px;background:#ffffff;border:1px solid ${RULE};border-radius:12px;
                padding:32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">

    <tr><td>
      <div style="color:${BRAND};font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">
        SkillSprint Workshops
      </div>
      <h1 style="color:${INK};font-size:26px;line-height:1.25;margin:12px 0 0;font-weight:800;">
        Congratulations, ${escapeHtml(name)}.
      </h1>
      <p style="color:${MUTED};font-size:15px;line-height:1.65;margin:12px 0 0;">
        Thank you for attending <strong style="color:${INK};">${escapeHtml(title)}</strong>.
        Your certificate is attached to this email as a PDF.
      </p>
      <p style="color:${MUTED};font-size:15px;line-height:1.65;margin:12px 0 0;">
        You can add it to LinkedIn under <em>Licenses &amp; certifications</em>.
      </p>
    </td></tr>

    <tr><td style="padding:24px 0 0;">
      <a href="${escapeHtml(workshopsUrl)}"
         style="display:inline-block;background:${BRAND};color:#ffffff;text-decoration:none;
                padding:12px 24px;border-radius:999px;font-weight:700;font-size:14px;">
        See upcoming workshops
      </a>
    </td></tr>

    <tr><td style="padding-top:32px;border-top:1px solid ${RULE};">
      <p style="color:${MUTED};font-size:12px;line-height:1.6;margin:16px 0 0;">
        You're receiving this because you attended a SkillSprint workshop.
        If your name is misspelled, reply to this email and we'll send a corrected copy.
      </p>
    </td></tr>

  </table>
</td></tr></table>
</body></html>`

  const text = [
    `Congratulations, ${name}.`,
    '',
    `Thank you for attending ${title}.`,
    'Your certificate is attached to this email as a PDF.',
    'You can add it to LinkedIn under Licenses & certifications.',
    '',
    `Upcoming workshops: ${workshopsUrl}`,
    '',
    '---',
    "You're receiving this because you attended a SkillSprint workshop.",
    "If your name is misspelled, reply to this email and we'll send a corrected copy.",
  ].join('\n')

  return { subject, html, text }
}
```

- [ ] **Step 4: Add attachments to `lib/email/providers.js`**

In `sendViaResend`, change the signature and body:

```js
// before
async function sendViaResend({ to, subject, html, text, headers }) {
// after
async function sendViaResend({ to, subject, html, text, headers, attachments }) {
```

```js
// before
    { from, to: [to], subject, html, text, headers }
// after
    {
      from, to: [to], subject, html, text, headers,
      ...(attachments?.length
        ? { attachments: attachments.map((a) => ({ filename: a.filename, content: a.content })) }
        : {}),
    }
```

In `sendViaBrevo`:

```js
// before
async function sendViaBrevo({ to, toName, subject, html, text, headers }) {
// after
async function sendViaBrevo({ to, toName, subject, html, text, headers, attachments }) {
```

```js
// before
      textContent: text,
      headers,
    }
// after
      textContent: text,
      headers,
      ...(attachments?.length
        ? { attachment: attachments.map((a) => ({ name: a.filename, content: a.content })) }
        : {}),
    }
```

Also add this line to the top comment block of `providers.js`:
`* Messages may carry attachments: [{ filename, content (base64) }].`

- [ ] **Step 5: Extract and run.** Run `node scripts/extract-plan-files.mjs 11 && npm test`. Expected: all pass.

- [ ] **Step 6: Commit.** Message: `feat(email): certificate email and attachment support`.

---

## Task 12: Certificate delivery

**Files:** Create `lib/certificates/delivery.js`

- [ ] **Step 1: Implement**

<!-- file: lib/certificates/delivery.js -->
```js
import { renderCertificate, certificateFilename } from './render.js'
import { loadRenderable } from './templates.js'
import { normalizeName, normalizeEmail, isValidEmail } from './recipients.js'
import { renderCertificateEmail } from '../email/certificateTemplate.js'
import { sendWith } from '../email/providers.js'
import {
  readUsage, pickProvider, incrementUsage, markExhausted, nextResetAt, configuredProviders,
} from '../email/quota.js'
import { getPool, withTransaction } from '../db.js'
import { UserFacingError } from '../errors.js'

// Re-exported so the worker can load everything certificate-related with one dynamic import,
// keeping pdf-lib out of the registration path.
export { loadRenderable }

/** A ready-to-send message: the email plus the person's rendered PDF. */
export async function buildCertificateEmail({ recipient, workshop, renderable, siteUrl }) {
  const pdf = await renderCertificate({
    templatePdf: renderable.templatePdf,
    fontBytes: renderable.fontBytes,
    style: renderable.style,
    name: recipient.full_name,
    title: workshop.title,
  })
  const { subject, html, text } = renderCertificateEmail({ recipient, workshop, siteUrl })
  return {
    to: recipient.email,
    toName: recipient.full_name,
    subject,
    html,
    text,
    attachments: [
      {
        filename: certificateFilename(workshop.title, recipient.full_name),
        content: Buffer.from(pdf).toString('base64'),
      },
    ],
  }
}

/**
 * Send one test certificate straight away, outside the queue. It still counts against the
 * daily quota, because the provider counts it.
 */
export async function sendTestCertificate({ workshopId, to, name, siteUrl }) {
  const email = normalizeEmail(to)
  if (!isValidEmail(email)) {
    throw new UserFacingError('Enter a valid address to send the test to.', 'BAD_EMAIL')
  }

  const renderable = await loadRenderable(workshopId)
  if (renderable.error) throw new UserFacingError(renderable.error, 'NOT_READY')

  const recipient = { full_name: normalizeName(name) || 'Sample Name', email }
  const message = await buildCertificateEmail({
    recipient,
    workshop: { title: renderable.workshopTitle },
    renderable,
    siteUrl,
  })
  message.subject = `[TEST] ${message.subject}`

  const pool = getPool()
  const usage = await readUsage(pool)
  const tried = []

  for (;;) {
    const provider = pickProvider(usage, tried)
    if (!provider) {
      const configured = configuredProviders().length > 0
      return {
        ok: false,
        code: configured ? 'QUOTA_EXHAUSTED' : 'NO_PROVIDER',
        message: configured
          ? 'Daily sending limit reached on every provider.'
          : 'No email provider is configured.',
        resets_at: nextResetAt().toISOString(),
      }
    }

    const result = await sendWith(provider, message)
    if (result.outcome === 'sent') {
      await withTransaction((client) => incrementUsage(client, provider))
      return { ok: true, code: 'SENT', provider }
    }
    if (result.outcome === 'quota') {
      await withTransaction((client) => markExhausted(client, provider))
      usage[provider].remaining = 0
      tried.push(provider)
      continue
    }
    return { ok: false, code: 'SEND_FAILED', provider, message: result.error }
  }
}
```

- [ ] **Step 2: Syntax check.** Run `node scripts/extract-plan-files.mjs 12 && node --check lib/certificates/delivery.js`. Expected: no errors.

- [ ] **Step 3: Commit.** Message: `feat(certificates): build and test-send certificate emails`.

---

## Task 13: Worker — certificate jobs and a time budget

**Files:** Replace `lib/email/worker.js` (full file below).

Behaviour kept exactly as before for welcome and reminder jobs. What changes:
- **Message building** is split into `buildRegistrationMessage` and `buildCertificateMessage`. The provider/quota loop is unchanged.
- **Certificate jobs** render the PDF, cache template bytes per workshop for the run, and skip the unsubscribe check and header (spec §1).
- **`runWorker({ deadlineMs })`** stops starting jobs after 25 s and releases the unstarted ones.
- **`sendOneJob`** no longer leaves a job stuck in `processing` when rendering throws.
- **`MAX_ATTEMPTS`** is exported.

- [ ] **Step 1: Replace the file**

<!-- file: lib/email/worker.js -->
```js
import { getPool, withTransaction } from '../db.js'
import { renderWelcomeSchedule } from './template.js'
import { renderWorkshopReminder } from './reminderTemplate.js'
import { sendWith } from './providers.js'
import { unsubscribeUrl } from './unsubscribeToken.js'
import {
  readUsage, pickProvider, incrementUsage, markExhausted,
  nextResetAt, configuredProviders,
} from './quota.js'

const BATCH_SIZE = Number(process.env.EMAIL_BATCH_SIZE || 30)
export const MAX_ATTEMPTS = 6
const STUCK_AFTER_MINUTES = 15
// Stop starting new jobs after this long. A single job can take ~30 s in the worst case (two
// providers each timing out at 15 s) and every caller runs inside a 60 s function, so a job
// started later than this risks being killed after the provider accepted it — which the
// stuck-job reclaim would then send a second time.
const DEFAULT_DEADLINE_MS = 25_000

const siteUrl = () => process.env.PUBLIC_SITE_URL || 'https://skill-sprint.pk'

/** Exponential backoff, capped so a job never parks for days. */
function backoffMinutes(attempts) {
  return Math.min(2 ** attempts, 240) // 2, 4, 8, 16, 32, 64 … max 4h
}

/** Release jobs abandoned mid-flight by a crashed or timed-out invocation. */
async function reclaimStuck(pool) {
  const { rowCount } = await pool.query(
    `UPDATE email_jobs
        SET status = 'pending', locked_at = NULL, locked_by = NULL, updated_at = now()
      WHERE status = 'processing'
        AND locked_at < now() - ($1 || ' minutes')::interval`,
    [String(STUCK_AFTER_MINUTES)]
  )
  return rowCount
}

/**
 * Atomically take ownership of up to `limit` due jobs.
 *
 * FOR UPDATE SKIP LOCKED is what makes concurrent runs safe: two workers racing on the
 * same rows each get a disjoint set instead of both sending the same email.
 */
async function claimBatch(pool, workerId, limit) {
  const { rows } = await pool.query(
    `UPDATE email_jobs
        SET status = 'processing', locked_at = now(), locked_by = $1, updated_at = now()
      WHERE id IN (
        SELECT id FROM email_jobs
         WHERE status IN ('pending', 'deferred')
           AND attempts < $3
           AND next_attempt_at <= now()
         ORDER BY created_at
         LIMIT $2
         FOR UPDATE SKIP LOCKED
      )
      RETURNING id, registration_id, certificate_recipient_id, template, attempts`,
    [workerId, limit, MAX_ATTEMPTS]
  )
  return rows
}

/** Hand claimed-but-unstarted jobs back to the queue. Not an attempt. */
async function releaseJobs(pool, ids, workerId) {
  if (!ids.length) return 0
  const { rowCount } = await pool.query(
    `UPDATE email_jobs
        SET status = 'pending', locked_at = NULL, locked_by = NULL, updated_at = now()
      WHERE id = ANY($1::uuid[]) AND status = 'processing' AND locked_by = $2`,
    [ids, workerId]
  )
  return rowCount
}

async function loadPublishedSchedule(pool) {
  const { rows } = await pool.query(
    `SELECT id, title, speaker, speaker_role, starts_at, duration_mins, location
       FROM workshops
      WHERE is_published = true
        AND status NOT IN ('completed', 'cancelled')
        AND starts_at > now()
      ORDER BY starts_at ASC`
  )
  return rows
}

/** Park a job until quota resets. Deliberately does NOT count as an attempt. */
async function deferJob(pool, jobId, reason) {
  await pool.query(
    `UPDATE email_jobs
        SET status = 'deferred', locked_at = NULL, locked_by = NULL,
            next_attempt_at = $2, last_error = $3, updated_at = now()
      WHERE id = $1`,
    [jobId, nextResetAt(), reason]
  )
}

/** Permanent failure that retrying cannot fix. */
async function failJob(pool, jobId, reason) {
  await pool.query(
    `UPDATE email_jobs SET status='failed', last_error=$2,
            locked_at=NULL, locked_by=NULL, updated_at=now() WHERE id=$1`,
    [jobId, String(reason).slice(0, 500)]
  )
}

/** An unexpected throw: count it as an attempt and try again later. */
async function requeueAfterCrash(pool, jobId, error) {
  await pool
    .query(
      `UPDATE email_jobs
          SET status='pending', attempts=attempts+1, last_error=$2,
              next_attempt_at = now() + interval '10 minutes',
              locked_at=NULL, locked_by=NULL, updated_at=now()
        WHERE id=$1`,
      [jobId, String(error?.message).slice(0, 500)]
    )
    .catch(() => {})
}

/** Welcome and reminder emails. Returns { message } or { error } (permanent). */
async function buildRegistrationMessage(pool, job, schedule) {
  const { rows } = await pool.query(
    `SELECT r.id, r.full_name, r.email, r.unsubscribed_at
       FROM registrations r
      WHERE r.id = $1`,
    [job.registration_id]
  )
  const registration = rows[0]

  // Never mail someone who opted out, even if a job was queued before they did.
  if (registration?.unsubscribed_at) return { error: 'Recipient unsubscribed' }
  if (!registration) return { error: 'Registration no longer exists' }

  let rendered
  // Reminder jobs carry their workshop in the template key: `reminder:<workshop_id>`.
  // That keeps UNIQUE (registration_id, template) meaningful per session, so each person
  // can get one reminder per workshop but never two for the same one.
  if (job.template.startsWith('reminder:')) {
    const workshopId = job.template.slice('reminder:'.length)
    const { rows: wRows } = await pool.query(
      `SELECT id, title, speaker, speaker_role, starts_at, duration_mins, location, meeting_link
         FROM workshops WHERE id = $1`,
      [workshopId]
    )
    if (!wRows[0]) return { error: 'Workshop no longer exists' }
    rendered = renderWorkshopReminder({ registration, workshop: wRows[0], siteUrl: siteUrl() })
  } else {
    rendered = renderWelcomeSchedule({
      registration,
      workshops: schedule,
      siteUrl: siteUrl(),
      whatsappUrl: process.env.WHATSAPP_GROUP_URL || '',
    })
  }

  return {
    message: {
      to: registration.email,
      toName: registration.full_name,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      headers: {
        // RFC 8058 one-click: the POST target lets Gmail/Outlook unsubscribe from the
        // inbox UI without the person opening anything.
        'List-Unsubscribe': `<${unsubscribeUrl(siteUrl(), registration.email)}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    },
  }
}

/**
 * Certificate emails. Template bytes are cached per workshop for the run. Unsubscribes are
 * not checked: a certificate is not marketing (see the certificates design spec).
 */
async function buildCertificateMessage(pool, job, cache) {
  const { rows } = await pool.query(
    `SELECT c.full_name, c.email, c.workshop_id, w.title
       FROM certificate_recipients c
       JOIN workshops w ON w.id = c.workshop_id
      WHERE c.id = $1`,
    [job.certificate_recipient_id]
  )
  const recipient = rows[0]
  if (!recipient) return { error: 'Certificate recipient no longer exists' }

  // Loaded lazily so registrations never pay for pdf-lib.
  const delivery = await import('../certificates/delivery.js')

  if (!cache.has(recipient.workshop_id)) {
    cache.set(recipient.workshop_id, await delivery.loadRenderable(recipient.workshop_id))
  }
  const renderable = cache.get(recipient.workshop_id)
  if (renderable.error) return { error: renderable.error }

  try {
    const message = await delivery.buildCertificateEmail({
      recipient,
      workshop: { title: recipient.title },
      renderable,
      siteUrl: siteUrl(),
    })
    return { message }
  } catch (error) {
    // A name the font cannot draw fails the same way on every retry.
    if (error?.expose) return { error: error.message }
    throw error
  }
}

/**
 * Process exactly one claimed job. Returns an outcome string for the caller's tally.
 * Every expected failure path writes a terminal or retryable state to the row.
 */
async function processJob(pool, job, schedule, usage, cache) {
  const built = job.template === 'certificate'
    ? await buildCertificateMessage(pool, job, cache)
    : await buildRegistrationMessage(pool, job, schedule)

  if (built.error) {
    await failJob(pool, job.id, built.error)
    return 'failed'
  }
  const { message } = built

  const tried = []
  // Try each provider with headroom, in priority order, before giving up for the day.
  for (;;) {
    const provider = pickProvider(usage, tried)
    if (!provider) {
      const configured = configuredProviders()
      const reason = configured.length
        ? 'Daily sending limit reached on all providers'
        : 'No email provider configured (set RESEND_API_KEY or BREVO_API_KEY)'
      await deferJob(pool, job.id, reason)
      return 'deferred'
    }

    const result = await sendWith(provider, message)

    if (result.outcome === 'sent') {
      // Ledger and job state move together — a crash between them would let us
      // over-send tomorrow or double-send today.
      await withTransaction(async (client) => {
        await client.query(
          `UPDATE email_jobs
              SET status='sent', provider=$2, provider_message_id=$3, sent_at=now(),
                  last_error=NULL, locked_at=NULL, locked_by=NULL, updated_at=now()
            WHERE id=$1`,
          [job.id, provider, result.messageId || '']
        )
        await incrementUsage(client, provider)
      })
      usage[provider].used += 1
      usage[provider].remaining = Math.max(0, usage[provider].remaining - 1)
      return 'sent'
    }

    if (result.outcome === 'quota') {
      // Trust the provider over our own counter and move to the next one.
      await withTransaction(async (client) => markExhausted(client, provider))
      usage[provider].remaining = 0
      tried.push(provider)
      continue
    }

    if (result.outcome === 'rejected') {
      await pool.query(
        `UPDATE email_jobs
            SET status='failed', provider=$2, last_error=$3, attempts=attempts+1,
                locked_at=NULL, locked_by=NULL, updated_at=now()
          WHERE id=$1`,
        [job.id, provider, String(result.error).slice(0, 500)]
      )
      return 'failed'
    }

    // transient
    const attempts = job.attempts + 1
    const terminal = attempts >= MAX_ATTEMPTS
    await pool.query(
      `UPDATE email_jobs
          SET status=$4, provider=$2, last_error=$3, attempts=$5,
              next_attempt_at = now() + ($6 || ' minutes')::interval,
              locked_at=NULL, locked_by=NULL, updated_at=now()
        WHERE id=$1`,
      [
        job.id, provider, String(result.error).slice(0, 500),
        terminal ? 'failed' : 'pending', attempts, String(backoffMinutes(attempts)),
      ]
    )
    return terminal ? 'failed' : 'retry'
  }
}

/**
 * Drain up to one batch of due email jobs.
 *
 * Always resolves — callers (cron endpoint, admin buttons, post-registration trigger) can
 * rely on getting a summary rather than having to catch.
 */
export async function runWorker({ limit = BATCH_SIZE, deadlineMs = DEFAULT_DEADLINE_MS } = {}) {
  const startedAt = Date.now()
  const pool = getPool()
  const workerId = `w_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
  const tally = { claimed: 0, sent: 0, deferred: 0, failed: 0, retry: 0, reclaimed: 0, released: 0 }

  try {
    tally.reclaimed = await reclaimStuck(pool)

    const jobs = await claimBatch(pool, workerId, limit)
    tally.claimed = jobs.length
    if (!jobs.length) return { ok: true, ...tally }

    const [schedule, usage] = await Promise.all([
      loadPublishedSchedule(pool),
      readUsage(pool),
    ])
    const cache = new Map()

    for (let i = 0; i < jobs.length; i++) {
      if (Date.now() - startedAt > deadlineMs) {
        tally.released = await releaseJobs(pool, jobs.slice(i).map((j) => j.id), workerId)
        break
      }

      const job = jobs[i]
      try {
        const outcome = await processJob(pool, job, schedule, usage, cache)
        tally[outcome] = (tally[outcome] || 0) + 1
      } catch (error) {
        // A job that blows up in an unexpected way must not strand itself in 'processing'
        // or take the rest of the batch down with it.
        console.error('email worker: job failed unexpectedly', job.id, error)
        await requeueAfterCrash(pool, job.id, error)
        tally.retry += 1
      }
    }

    return { ok: true, ...tally }
  } catch (error) {
    console.error('email worker error:', error)
    return { ok: false, error: error.message, ...tally }
  }
}

/**
 * Send a single job on demand (the admin panel's Send / Resend buttons).
 * Returns { ok, code, ... } — QUOTA_EXHAUSTED is a normal response, not an error.
 */
export async function sendOneJob(jobId) {
  const pool = getPool()

  const claimed = await pool.query(
    `UPDATE email_jobs
        SET status='processing', locked_at=now(), locked_by='admin', updated_at=now()
      WHERE id = (
        SELECT id FROM email_jobs
         WHERE id = $1 AND status <> 'processing'
         FOR UPDATE SKIP LOCKED
      )
      RETURNING id, registration_id, certificate_recipient_id, template, attempts`,
    [jobId]
  )

  if (!claimed.rows.length) {
    return { ok: false, code: 'BUSY', message: 'That email is already being sent.' }
  }

  const usage = await readUsage(pool)
  const schedule = await loadPublishedSchedule(pool)

  let outcome
  try {
    outcome = await processJob(pool, claimed.rows[0], schedule, usage, new Map())
  } catch (error) {
    console.error('email worker: single send failed unexpectedly', jobId, error)
    await requeueAfterCrash(pool, jobId, error)
    return { ok: false, code: 'SEND_FAILED', message: error.message || 'Could not send.' }
  }

  if (outcome === 'sent') {
    const { rows } = await pool.query('SELECT provider FROM email_jobs WHERE id=$1', [jobId])
    return { ok: true, code: 'SENT', provider: rows[0]?.provider || null }
  }

  if (outcome === 'deferred') {
    const { rows } = await pool.query('SELECT last_error FROM email_jobs WHERE id=$1', [jobId])
    return {
      ok: false,
      code: configuredProviders().length ? 'QUOTA_EXHAUSTED' : 'NO_PROVIDER',
      message: rows[0]?.last_error || 'Daily sending limit reached.',
      resets_at: nextResetAt().toISOString(),
      usage,
    }
  }

  const { rows } = await pool.query('SELECT last_error FROM email_jobs WHERE id=$1', [jobId])
  return {
    ok: false,
    code: outcome === 'failed' ? 'SEND_FAILED' : 'WILL_RETRY',
    message: rows[0]?.last_error || 'Could not send.',
  }
}
```

- [ ] **Step 2: Check the diff against the original.** Run `git diff --stat lib/email/worker.js && node --check lib/email/worker.js`. Then read `git diff lib/email/worker.js` and confirm that the welcome/reminder SQL and control flow are unchanged apart from the extraction.

- [ ] **Step 3: Confirm every module loads.** Run:

```bash
node -e "Promise.all(['./lib/email/worker.js','./lib/certificates/store.js','./lib/certificates/delivery.js'].map(p=>import(p))).then(()=>console.log('ok'))"
```

Expected: `ok`. Then run `npm test` and expect all tests to pass.

- [ ] **Step 4: Commit.** Message: `feat(email): send certificate jobs and cap worker run time`.

---

## Task 14: Keep registration stats and webhooks correct

**Files:** Modify `lib/admin/stats.js`, `lib/webhooks/resend.js`, `lib/webhooks/brevo.js`

- [ ] **Step 1: `lib/admin/stats.js`.** Only registration emails feed the Registrations tab cards.

```js
// before
      pool.query(`SELECT status, count(*)::int AS count FROM email_jobs GROUP BY status`),
// after
      // Registration emails only — certificates have their own counts in the Certificates tab.
      pool.query(`SELECT status, count(*)::int AS count FROM email_jobs
                   WHERE registration_id IS NOT NULL GROUP BY status`),
```

```js
// before
         WHERE status = 'sent'
           AND delivered_at IS NULL
// after
         WHERE status = 'sent'
           AND registration_id IS NOT NULL
           AND delivered_at IS NULL
```

- [ ] **Step 2: `lib/webhooks/resend.js`.** The fallback match by email now covers certificate recipients too.

```js
// before
      `SELECT j.id FROM email_jobs j
         LEFT JOIN registrations r ON r.id = j.registration_id
        WHERE (j.provider_message_id = $1 AND $1 <> '')
           OR (r.email = lower($2) AND j.provider = 'resend')
// after
      `SELECT j.id FROM email_jobs j
         LEFT JOIN registrations r ON r.id = j.registration_id
         LEFT JOIN certificate_recipients c ON c.id = j.certificate_recipient_id
        WHERE (j.provider_message_id = $1 AND $1 <> '')
           OR (COALESCE(r.email, c.email) = lower($2) AND j.provider = 'resend')
```

- [ ] **Step 3: `lib/webhooks/brevo.js`.** Make the same change, with `j.provider = 'brevo'`.

- [ ] **Step 4: Check and commit.** Run `node --check lib/admin/stats.js && node --check lib/webhooks/resend.js && node --check lib/webhooks/brevo.js`, then commit with message `fix: keep registration stats and webhook matching correct alongside certificates`.

---

## Task 15: Admin endpoints and wiring

**Files:**
- Create: `lib/admin/canva.js`, `lib/admin/certificates.js`
- Modify: `api/admin.js`, `vercel.json`, `.env.example`

- [ ] **Step 1: Implement the routes**

<!-- file: lib/admin/canva.js -->
```js
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
```

<!-- file: lib/admin/certificates.js -->
```js
import { getPool } from '../db.js'
import { ensureSchema } from '../schema.js'
import { applyCors, ok, fail, methodNotAllowed, getQueryParam } from '../http.js'
import { requireAdmin } from '../auth.js'
import { UserFacingError, respondWithError } from '../errors.js'
import { getConnectionStatus } from '../canva/oauth.js'
import { runWorker, sendOneJob } from '../email/worker.js'
import { readUsage, nextResetAt, configuredProviders } from '../email/quota.js'
import { parseCsv } from '../certificates/csv.js'
import { fetchSheetRows, MAX_CSV_CHARS } from '../certificates/sheets.js'
import {
  buildPreview, cleanImportRows, normalizeName, MAX_IMPORT_ROWS,
} from '../certificates/recipients.js'
import { renderCertificate, certificateFilename } from '../certificates/render.js'
import {
  getTemplateMeta, getTemplateAsset, templateReadiness, loadRenderable,
  fetchTemplateFromCanva, saveStyle, saveFont,
} from '../certificates/templates.js'
import {
  assertWorkshop, workshopSummaries, listRecipients, existingEmails, insertRecipients,
  updateRecipient, deleteRecipient, queueAll, prepareResend, countDueCertificateJobs,
} from '../certificates/store.js'
import { sendTestCertificate } from '../certificates/delivery.js'

/**
 * Every certificate operation for the admin panel. GET reads; POST dispatches on body.op.
 * See the certificates design spec §7 for the full list.
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const WORKER_BATCH = 25

const siteUrl = () => process.env.PUBLIC_SITE_URL || 'https://skill-sprint.pk'

function requireId(value, label = 'workshopId') {
  if (!UUID.test(String(value || ''))) {
    throw new UserFacingError(`A valid ${label} is required.`, 'MISSING_ID')
  }
  return String(value)
}

function sendBytes(res, bytes, type, disposition) {
  if (!bytes) return fail(res, 'NOT_FOUND', 'Nothing has been uploaded yet.', 404)
  res.statusCode = 200
  res.setHeader('Content-Type', type)
  res.setHeader('Content-Length', bytes.length)
  res.setHeader('Cache-Control', 'no-store')
  if (disposition) res.setHeader('Content-Disposition', disposition)
  res.end(bytes)
}

async function handleGet(req, res) {
  const workshopId = getQueryParam(req, 'workshopId')

  if (!workshopId) {
    const [workshops, canva, usage] = await Promise.all([
      workshopSummaries(),
      getConnectionStatus(),
      readUsage(getPool()),
    ])
    return ok(res, { workshops, canva, usage, resets_at: nextResetAt().toISOString() })
  }

  requireId(workshopId)
  const asset = getQueryParam(req, 'asset')

  if (asset === 'preview') {
    return sendBytes(res, await getTemplateAsset(workshopId, 'preview'), 'image/png')
  }
  if (asset === 'font') {
    return sendBytes(res, await getTemplateAsset(workshopId, 'font'), 'application/octet-stream')
  }
  if (asset === 'sample') {
    const renderable = await loadRenderable(workshopId)
    if (renderable.error) throw new UserFacingError(renderable.error, 'NOT_READY')
    const name = normalizeName(getQueryParam(req, 'name')) || 'Sample Name'
    const pdf = await renderCertificate({ ...renderable, name, title: renderable.workshopTitle })
    return sendBytes(
      res,
      Buffer.from(pdf),
      'application/pdf',
      `inline; filename="${certificateFilename(renderable.workshopTitle, name)}"`
    )
  }

  const [template, recipients] = await Promise.all([
    getTemplateMeta(workshopId),
    listRecipients(workshopId),
  ])
  return ok(res, { template, readiness: templateReadiness(template), recipients })
}

async function readImportTable(body) {
  if (body.sheetUrl) return fetchSheetRows(body.sheetUrl)

  if (typeof body.csv === 'string') {
    if (body.csv.length > MAX_CSV_CHARS) {
      throw new UserFacingError('That CSV is larger than 1 MB.', 'TOO_LARGE')
    }
    return parseCsv(body.csv)
  }

  if (Array.isArray(body.table)) {
    if (body.table.length > MAX_IMPORT_ROWS + 1) {
      throw new UserFacingError(`At most ${MAX_IMPORT_ROWS} rows can be imported at once.`, 'TOO_LARGE')
    }
    return body.table.map((row) =>
      Array.isArray(row) ? row.map((cell) => (cell == null ? '' : String(cell))) : []
    )
  }

  throw new UserFacingError('Provide a Google Sheet link or a file.', 'NO_SOURCE')
}

/** Run one worker batch and describe where certificate sending stands. */
async function drain(res, extra = {}) {
  const summary = await runWorker({ limit: WORKER_BATCH })
  const [usage, remaining] = await Promise.all([readUsage(getPool()), countDueCertificateJobs()])
  const payload = { ...extra, summary, usage, remaining, resets_at: nextResetAt().toISOString() }

  if (summary.sent === 0 && summary.deferred > 0) {
    return ok(res, {
      ...payload,
      ok: false,
      code: configuredProviders().length ? 'QUOTA_EXHAUSTED' : 'NO_PROVIDER',
      message: 'Daily sending limit reached. The rest go out automatically after the reset.',
    })
  }
  return ok(res, payload)
}

const OPS = {
  async 'fetch-template'(body, res) {
    const workshopId = requireId(body.workshopId)
    await assertWorkshop(workshopId)
    return ok(res, await fetchTemplateFromCanva(workshopId, body.canvaUrl))
  },

  async 'save-style'(body, res) {
    const style = await saveStyle(requireId(body.workshopId), body.style || {})
    return ok(res, { style })
  },

  async 'upload-font'(body, res) {
    return ok(res, await saveFont(requireId(body.workshopId), body))
  },

  async 'preview-import'(body, res) {
    const workshopId = requireId(body.workshopId)
    const table = await readImportTable(body)
    const rows = buildPreview(table, await existingEmails(workshopId))
    return ok(res, { rows })
  },

  async import(body, res) {
    const workshopId = requireId(body.workshopId)
    await assertWorkshop(workshopId)
    const { clean, skipped } = cleanImportRows(body.rows)
    const inserted = await insertRecipients(workshopId, clean, body.source)
    return ok(res, { inserted, skipped, alreadyPresent: clean.length - inserted })
  },

  async 'update-recipient'(body, res) {
    return ok(res, { recipient: await updateRecipient(requireId(body.id, 'id'), body) })
  },

  async 'delete-recipient'(body, res) {
    await deleteRecipient(requireId(body.id, 'id'))
    return ok(res, { deleted: true })
  },

  async 'send-test'(body, res) {
    const result = await sendTestCertificate({
      workshopId: requireId(body.workshopId),
      to: body.to,
      name: body.name,
      siteUrl: siteUrl(),
    })
    return ok(res, result)
  },

  async 'send-all'(body, res) {
    const workshopId = requireId(body.workshopId)
    const renderable = await loadRenderable(workshopId)
    if (renderable.error) throw new UserFacingError(renderable.error, 'NOT_READY')
    const newlyQueued = await queueAll(workshopId)
    return drain(res, { newlyQueued })
  },

  async process(body, res) {
    return drain(res)
  },

  async resend(body, res) {
    const jobId = await prepareResend(requireId(body.id, 'id'))
    if (!jobId) {
      return ok(res, { ok: false, code: 'BUSY', message: 'That certificate is being sent right now.' })
    }
    return ok(res, await sendOneJob(jobId))
  },
}

export default async function handler(req, res) {
  if (applyCors(req, res, 'GET,POST,OPTIONS')) return
  if (requireAdmin(req, res)) return

  try {
    await ensureSchema()
    if (req.method === 'GET') return await handleGet(req, res)
    if (req.method !== 'POST') return methodNotAllowed(res, ['GET', 'POST'])

    const body = req.body || {}
    const op = Object.hasOwn(OPS, body.op) ? OPS[body.op] : null
    if (!op) return fail(res, 'UNKNOWN_OP', `Unknown op: ${body.op || '(none)'}`)
    return await op(body, res)
  } catch (error) {
    return respondWithError(res, error, 'admin/certificates')
  }
}

export const config = { maxDuration: 60 }
```

- [ ] **Step 2: Register the routes in `api/admin.js`**

```js
// after the existing imports
import canva from '../lib/admin/canva.js'
import certificates from '../lib/admin/certificates.js'
```

```js
// in ROUTES, after 'send-link': sendLink,
  canva,
  certificates,
```

- [ ] **Step 3: `vercel.json`.** Keep the OAuth callback out of search results too. Replace the `headers` array with:

```json
  "headers": [
    {
      "source": "/admin",
      "headers": [{ "key": "X-Robots-Tag", "value": "noindex, nofollow" }]
    },
    {
      "source": "/admin/(.*)",
      "headers": [{ "key": "X-Robots-Tag", "value": "noindex, nofollow" }]
    }
  ]
```

- [ ] **Step 4: `.env.example`.** Add this before the `# ── Site` block:

```bash
# ── Canva (certificate templates) ─────────────────────────────────────────────
# Create an integration at https://www.canva.com/developers/integrations/connect-api
# (your Canva account needs two-factor login turned on).
# Scopes: design:meta (read), design:content (read), profile (read).
# Redirect URLs: http://127.0.0.1:5173/admin/canva/callback  (local — use 127.0.0.1)
#                https://<your domain>/admin/canva/callback
CANVA_CLIENT_ID=
CANVA_CLIENT_SECRET=
# Optional: set only if the callback URL cannot be derived from the request host.
CANVA_REDIRECT_URI=
```

- [ ] **Step 5: Confirm everything loads.** Run:

```bash
node -e "import('./api/admin.js').then(()=>console.log('ok'))"
```

Expected: `ok`. Then run `npm test` and expect all tests to pass. Finally, confirm that `ls api` still lists 9 files.

- [ ] **Step 6: Commit.** Message: `feat(admin): certificate and Canva endpoints behind the admin dispatcher`.

---

## Task 16: Database migration and storage smoke test

**Files:** Create `scripts/certificates-smoke.mjs`

> **Gate:** `.env` `DB_URI` points at the live Neon database. Ask the user before running anything in this task.
>
> - The migration only adds tables, a nullable column, a CHECK constraint that every existing row already passes, and an index.
> - The smoke test sends no email. It creates one unpublished throwaway workshop, parks its jobs a day in the future so no worker picks them up, and deletes everything in a `finally`.

- [ ] **Step 1: Write the smoke test**

<!-- file: scripts/certificates-smoke.mjs -->
```js
// Exercises the certificate storage layer against the real database WITHOUT sending email.
// Creates one throwaway, unpublished workshop and deletes it (cascading to everything under
// it) at the end. Jobs it queues are parked a day in the future so no worker can claim them.
//
// Usage: node --env-file=.env scripts/certificates-smoke.mjs
import assert from 'node:assert/strict'
import { query, getPool } from '../lib/db.js'
import { ensureSchema } from '../lib/schema.js'
import {
  workshopSummaries, listRecipients, existingEmails, insertRecipients, updateRecipient,
  queueAll, prepareResend, countDueCertificateJobs, deleteRecipient,
} from '../lib/certificates/store.js'
import { getTemplateMeta, templateReadiness, loadRenderable } from '../lib/certificates/templates.js'

const park = (workshopId) =>
  query(
    `UPDATE email_jobs SET next_attempt_at = now() + interval '1 day'
      WHERE certificate_recipient_id IN
            (SELECT id FROM certificate_recipients WHERE workshop_id = $1)`,
    [workshopId]
  )

await ensureSchema()
console.log('schema ok')

const { rows: [workshop] } = await query(
  `INSERT INTO workshops (title, starts_at, is_published, status)
   VALUES ('ZZ certificates smoke test — safe to delete', now() - interval '1 day', false, 'completed')
   RETURNING id`
)

try {
  const people = [
    { fullName: 'Smoke One', email: 'smoke1@example.com' },
    { fullName: 'Smoke Two', email: 'smoke2@example.com' },
  ]
  assert.equal(await insertRecipients(workshop.id, people, 'smoke'), 2)
  assert.equal(
    await insertRecipients(workshop.id, [{ fullName: 'Again', email: 'smoke1@example.com' }], 'smoke'),
    0,
    're-import must not duplicate'
  )
  assert.deepEqual([...(await existingEmails(workshop.id))].sort(), ['smoke1@example.com', 'smoke2@example.com'])

  assert.equal(await queueAll(workshop.id), 2)
  await park(workshop.id)
  assert.equal(await queueAll(workshop.id), 0, 'queueing twice must not duplicate jobs')

  const list = await listRecipients(workshop.id)
  assert.equal(list.length, 2)
  assert.ok(list.every((r) => r.status === 'pending'))

  const renamed = await updateRecipient(list[0].id, { fullName: '  Smoke   Uno ', email: 'SMOKE1@example.com' })
  assert.equal(renamed.full_name, 'Smoke Uno')
  await assert.rejects(
    updateRecipient(list[0].id, { fullName: 'X', email: 'smoke2@example.com' }),
    { code: 'DUPLICATE' }
  )

  await query(
    `UPDATE email_jobs SET status = 'failed', attempts = 3 WHERE certificate_recipient_id = $1`,
    [list[0].id]
  )
  const jobId = await prepareResend(list[0].id)
  await park(workshop.id)
  const { rows: [job] } = await query('SELECT status, attempts FROM email_jobs WHERE id = $1', [jobId])
  assert.deepEqual(job, { status: 'pending', attempts: 0 })

  await assert.rejects(
    query(`INSERT INTO email_jobs (template) VALUES ('certificate')`),
    /email_jobs_one_recipient/
  )

  const summary = (await workshopSummaries()).find((s) => s.id === workshop.id)
  assert.equal(summary.recipients, 2)
  assert.equal(summary.queued, 2)
  assert.equal(summary.waiting, 2)
  assert.equal(templateReadiness(await getTemplateMeta(workshop.id)).template, false)
  assert.ok((await loadRenderable(workshop.id)).error)
  assert.equal(typeof (await countDueCertificateJobs()), 'number')

  await deleteRecipient(list[1].id)
  assert.equal((await listRecipients(workshop.id)).length, 1)

  console.log('certificate storage smoke test passed')
} finally {
  await query('DELETE FROM workshops WHERE id = $1', [workshop.id])
  const { rows } = await query(
    'SELECT count(*)::int AS n FROM certificate_recipients WHERE workshop_id = $1',
    [workshop.id]
  )
  console.log(rows[0].n === 0 ? 'cleaned up' : `WARNING: ${rows[0].n} recipients left behind`)
  await getPool().end()
}
```

- [ ] **Step 2: Run (after the user says yes).** Run `node scripts/extract-plan-files.mjs 16 && node --env-file=.env scripts/certificates-smoke.mjs`. Expected output: `schema ok`, `certificate storage smoke test passed`, `cleaned up`.

- [ ] **Step 3: Commit.** Message: `test: storage smoke test for certificates against the database`.

---

## Task 17: Admin API helper, route, and the Certificates tab shell

**Files:**
- Create: `src/utils/adminApi.js`, `src/components/admin/CertificatesTab.vue`
- Modify: `src/router/index.js`, `src/views/AdminView.vue`

- [ ] **Step 1: Create the helper and the tab**

<!-- file: src/utils/adminApi.js -->
```js
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
```

<!-- file: src/components/admin/CertificatesTab.vue -->
```vue
<template>
  <div class="flex flex-col gap-6">
    <!-- Canva connection -->
    <div class="bg-white border border-gray-200 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="font-extrabold text-gray-900">Canva</h2>
        <p v-if="!canva.configured" class="text-sm text-amber-700 mt-0.5">
          Add <code class="font-mono">CANVA_CLIENT_ID</code> and
          <code class="font-mono">CANVA_CLIENT_SECRET</code> to the environment, then reload.
        </p>
        <p v-else-if="canva.connected" class="text-sm text-gray-500 mt-0.5">
          Connected{{ canva.displayName ? ` as ${canva.displayName}` : '' }}.
          Templates are exported from this account.
        </p>
        <p v-else class="text-sm text-gray-500 mt-0.5">
          Connect the Canva account that owns the certificate designs.
        </p>
      </div>
      <div v-if="canva.configured">
        <button v-if="!canva.connected" type="button" :class="ui.primary" :disabled="connecting" @click="connect">
          {{ connecting ? 'Opening Canva…' : 'Connect Canva' }}
        </button>
        <button v-else type="button" :class="ui.secondary" @click="disconnect">Disconnect</button>
      </div>
    </div>

    <p v-if="usage" class="text-xs text-gray-500 font-mono tabular-nums">
      Sending today:
      <span v-for="(q, name) in usage" :key="name" class="mr-3">{{ name }} {{ q.used }}/{{ q.limit }}</span>
      · resets {{ untilLabel(resetsAt) }}
    </p>

    <p v-if="loading && !loaded" class="text-sm text-gray-500">Loading…</p>
    <div v-else-if="!workshops.length"
         class="bg-white border border-gray-200 rounded-xl p-8 text-center text-sm text-gray-500">
      No workshops yet. Add them in the Workshops tab first.
    </div>

    <div v-for="w in workshops" :key="w.id" class="bg-white border border-gray-200 rounded-xl">
      <button type="button" :aria-expanded="open === w.id"
              class="w-full flex flex-wrap items-center justify-between gap-3 p-5 text-left cursor-pointer
                     focus-visible:outline-2 focus-visible:outline-blue-600 rounded-xl"
              @click="toggle(w.id)">
        <div>
          <div class="font-extrabold text-gray-900">{{ w.title }}</div>
          <div class="text-xs text-gray-500 mt-0.5 tabular-nums">{{ shortDate(w.starts_at) }}</div>
        </div>
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <span v-for="s in steps(w)" :key="s.label" class="px-2 py-1 rounded-full font-semibold"
                :class="s.done ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'">
            {{ s.done ? '✓' : '○' }} {{ s.label }}
          </span>
          <span class="font-mono tabular-nums text-gray-500 ml-1">{{ w.sent }}/{{ w.recipients }} sent</span>
          <span v-if="w.waiting" class="font-mono tabular-nums text-amber-700">{{ w.waiting }} waiting</span>
          <span v-if="w.failed" class="font-mono tabular-nums text-red-600">{{ w.failed }} failed</span>
        </div>
      </button>

      <!-- Mounted on first open and then kept alive, so a send in progress survives collapsing. -->
      <div v-if="opened.includes(w.id)" v-show="open === w.id" class="border-t border-gray-100 p-5">
        <CertificateWorkshop
          :workshop-id="w.id"
          :workshop-title="w.title"
          :canva-connected="canva.connected"
          :toast="toast"
          @changed="load"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CertificateWorkshop from './CertificateWorkshop.vue'
import { apiGet, apiPost, shortDate, untilLabel, ui } from '../../utils/adminApi.js'

const props = defineProps({ toast: { type: Function, required: true } })

const workshops = ref([])
const canva = ref({ configured: false, connected: false, displayName: '' })
const usage = ref(null)
const resetsAt = ref(null)
const loading = ref(false)
const loaded = ref(false)
const open = ref(null)
const opened = ref([])
const connecting = ref(false)

async function load() {
  loading.value = true
  const data = await apiGet('/api/admin/certificates')
  loading.value = false
  if (!data.ok) return props.toast('error', 'Could not load certificates', data.message)
  workshops.value = data.workshops
  canva.value = data.canva
  usage.value = data.usage
  resetsAt.value = data.resets_at
  loaded.value = true
}

function toggle(id) {
  open.value = open.value === id ? null : id
  if (open.value && !opened.value.includes(id)) opened.value.push(id)
}

const steps = (w) => [
  { label: 'Template', done: w.has_template },
  { label: 'Style', done: w.has_template && w.has_font && w.placed },
  { label: 'Attendees', done: w.recipients > 0 },
  { label: 'Sent', done: w.recipients > 0 && w.sent === w.recipients },
]

async function connect() {
  connecting.value = true
  const data = await apiPost('/api/admin/canva', { op: 'authorize' })
  if (!data.ok) {
    connecting.value = false
    return props.toast('error', 'Could not start the Canva connection', data.message)
  }
  window.location.assign(data.url)
}

async function disconnect() {
  if (!window.confirm('Disconnect Canva? Stored templates stay; fetching new ones needs a reconnect.')) return
  const data = await apiPost('/api/admin/canva', { op: 'disconnect' })
  if (!data.ok) return props.toast('error', 'Could not disconnect', data.message)
  props.toast('success', 'Canva disconnected')
  await load()
}

defineExpose({ reload: load })
onMounted(load)
</script>
```

- [ ] **Step 2: `src/router/index.js`.** Canva redirects back to `/admin/canva/callback`. Making it an alias of `/admin` keeps a single `AdminView` instance through the redirect, so it isn't re-created.

```js
// before
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue'),
    meta: { noindex: true, bareLayout: true }
  },
// after
  {
    path: '/admin',
    // Canva's OAuth redirect lands here; AdminView finishes the connection and
    // replaces the URL with /admin.
    alias: ['/admin/canva/callback'],
    name: 'admin',
    component: () => import('../views/AdminView.vue'),
    meta: { noindex: true, bareLayout: true }
  },
```

- [ ] **Step 3: `src/views/AdminView.vue`: add the tab**

Template: after the closing `</div>` of the `<!-- ─────────── TEAM TAB ─────────── -->` block (the `v-show="tab === 'team'"` div), add:

```html
      <!-- ─────────── CERTIFICATES TAB ─────────── -->
      <!-- Mounted on first visit, then kept so an in-progress send survives tab switches. -->
      <div v-if="certificatesOpened" v-show="tab === 'certificates'">
        <CertificatesTab ref="certificatesTab" :toast="toast" />
      </div>
```

Script imports:

```js
// before
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
// after
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CertificatesTab from '../components/admin/CertificatesTab.vue'
import { apiPost } from '../utils/adminApi.js'
```

Tabs:

```js
// before
  { id: 'team', label: 'Team' },
]
const tab = ref('people')
// after
  { id: 'team', label: 'Team' },
  { id: 'certificates', label: 'Certificates' },
]
const tab = ref('people')

const certificatesTab = ref(null)
const certificatesOpened = ref(false)
watch(tab, (t) => { if (t === 'certificates') certificatesOpened.value = true }, { immediate: true })
```

`refreshAll`:

```js
// before
const refreshAll = () =>
  Promise.all([loadStats(), loadRegistrations(), loadWorkshops(), loadMembers()])
// after
const refreshAll = () =>
  Promise.all([
    loadStats(), loadRegistrations(), loadWorkshops(), loadMembers(),
    certificatesTab.value?.reload(),
  ])
```

- [ ] **Step 4: `src/views/AdminView.vue`: finish the Canva connection.** Add this just above `// ── Lifecycle`:

```js
// ── Canva OAuth callback ────────────────────────────────────────────────────
// Canva redirects to /admin/canva/callback?code=…&state=…. The code is read once at setup
// and exchanged as soon as the admin is signed in (immediately, if the session survived).
const route = useRoute()
const router = useRouter()
let pendingCanva = route.path === '/admin/canva/callback'
  ? { code: route.query.code, state: route.query.state, error: route.query.error }
  : null
if (pendingCanva) tab.value = 'certificates'

const finishCanvaConnect = async () => {
  if (!pendingCanva) return
  const { code, state, error } = pendingCanva
  pendingCanva = null
  router.replace('/admin')

  if (error) {
    toast('warn', 'Canva connection cancelled', String(error))
    return
  }
  const data = await apiPost('/api/admin/canva', { op: 'callback', code, state })
  if (data.ok) {
    toast('success', 'Canva connected', data.displayName ? `Signed in as ${data.displayName}.` : '')
  } else {
    toast('error', 'Could not connect Canva', data.message, 10000)
  }
  certificatesTab.value?.reload()
}

watch(authed, (value) => { if (value) finishCanvaConnect() })
```

- [ ] **Step 5: Build.** Run `npm run build`. Expected: the build succeeds.

It needs `CertificateWorkshop.vue`, so create that stub first (Task 18 replaces it):

```vue
<template><div class="text-sm text-gray-500">Loading…</div></template>
<script setup>
defineProps({ workshopId: String, workshopTitle: String, canvaConnected: Boolean, toast: Function })
defineEmits(['changed'])
</script>
```

- [ ] **Step 6: Commit.** Message: `feat(admin): Certificates tab shell and Canva OAuth callback`.

---

## Task 18: Workshop panel and click-to-place preview

**Files:** Create (replacing the stub) `src/components/admin/CertificateWorkshop.vue`, and create `src/components/admin/CertificateStylePreview.vue`

Tasks 19 and 20 create the child components `CertificateImport`, `CertificateRecipients` and `CertificateSend`. To keep the build green in between, Step 2 adds stubs for them.

- [ ] **Step 1: Create the components**

<!-- file: src/components/admin/CertificateWorkshop.vue -->
```vue
<template>
  <p v-if="!detail" class="text-sm text-gray-500">Loading…</p>

  <div v-else class="flex flex-col gap-10">
    <!-- 1 · Template -->
    <section>
      <h3 :class="ui.stepTitle">
        <span>1 · Template</span><span v-if="readiness.template" class="text-emerald-600">✓</span>
      </h3>
      <p v-if="!canvaConnected" class="text-sm text-amber-700 mb-3">Connect Canva above first.</p>
      <form class="flex flex-wrap gap-2" @submit.prevent="fetchTemplate">
        <label class="sr-only" :for="`canva-${workshopId}`">Canva design link</label>
        <input :id="`canva-${workshopId}`" v-model.trim="canvaUrl" type="text" required
               placeholder="https://canva.link/…" :class="[ui.input, 'flex-1 min-w-64']" />
        <button type="submit" :class="ui.primary" :disabled="fetching || !canvaConnected || !canvaUrl">
          {{ fetching ? 'Exporting from Canva…' : template?.fetched_at ? 'Refresh from Canva' : 'Fetch from Canva' }}
        </button>
      </form>
      <p v-if="fetching" class="text-xs text-gray-500 mt-2">This can take up to a minute.</p>
      <p v-else-if="template?.fetched_at" class="text-xs text-gray-500 mt-2 tabular-nums">
        “{{ template.canva_title || 'Untitled design' }}” ·
        {{ Math.round(template.page_width) }} × {{ Math.round(template.page_height) }} pt ·
        {{ megabytes(template.pdf_bytes) }} · fetched {{ shortDate(template.fetched_at) }}
      </p>
      <p class="text-xs text-gray-500 mt-1">
        The name area in the Canva design must be empty — the name is drawn on top of it.
      </p>
    </section>

    <!-- 2 · Name style -->
    <section v-if="readiness.template">
      <h3 :class="ui.stepTitle">
        <span>2 · Name style</span><span v-if="readiness.style" class="text-emerald-600">✓</span>
      </h3>

      <div class="flex flex-wrap items-center gap-3 mb-4">
        <button type="button" :class="ui.secondary" :disabled="uploadingFont" @click="fontInput.click()">
          {{ uploadingFont ? 'Uploading…' : template.has_font ? 'Replace font' : 'Upload font' }}
        </button>
        <input ref="fontInput" type="file" accept=".ttf,.otf" class="hidden" @change="uploadFont" />
        <span v-if="template.has_font" class="text-sm text-gray-700">
          {{ template.font_family }}
          <span class="text-gray-400">({{ template.font_filename }})</span>
        </span>
        <span v-else class="text-sm text-gray-500">
          Upload the font used for the name in Canva (.ttf or .otf, up to 2 MB).
        </span>
      </div>

      <CertificateStylePreview
        v-if="previewUrl"
        v-model="style"
        :preview-url="previewUrl"
        :font-url="fontUrl"
        :font-key="fontKey"
        :page-width="template.page_width"
        :page-height="template.page_height"
        :sample-name="sampleName"
      />

      <div class="flex flex-wrap items-center gap-2 mt-4">
        <button type="button" :class="ui.primary" :disabled="!styleDirty || savingStyle || style.x == null"
                @click="saveStyle">
          {{ savingStyle ? 'Saving…' : 'Save position' }}
        </button>
        <button type="button" :class="ui.secondary" :disabled="!readiness.style || styleDirty" @click="openSample">
          Download sample
        </button>
        <span v-if="styleDirty && style.x != null" class="text-xs text-amber-700">Unsaved changes</span>
      </div>
    </section>

    <!-- 3 · Attendees -->
    <section>
      <h3 :class="ui.stepTitle">
        <span>3 · Attendees</span>
        <span v-if="recipients.length" class="text-emerald-600">✓ {{ recipients.length }}</span>
      </h3>
      <CertificateImport :workshop-id="workshopId" :toast="toast" @imported="reload" />
      <CertificateRecipients
        v-if="recipients.length"
        class="mt-6"
        :recipients="recipients"
        :can-send="sendReady"
        :toast="toast"
        @changed="reload"
      />
    </section>

    <!-- 4 · Send -->
    <section>
      <h3 :class="ui.stepTitle"><span>4 · Send</span></h3>
      <CertificateSend
        :workshop-id="workshopId"
        :workshop-title="workshopTitle"
        :template-ready="readiness.style"
        :ready="sendReady"
        :recipients="recipients"
        :sample-name="sampleName"
        :toast="toast"
        @changed="reload"
      />
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CertificateStylePreview from './CertificateStylePreview.vue'
import CertificateImport from './CertificateImport.vue'
import CertificateRecipients from './CertificateRecipients.vue'
import CertificateSend from './CertificateSend.vue'
import { apiGet, apiPost, apiBlob, fileToBase64, shortDate, ui } from '../../utils/adminApi.js'

const props = defineProps({
  workshopId: { type: String, required: true },
  workshopTitle: { type: String, required: true },
  canvaConnected: { type: Boolean, default: false },
  toast: { type: Function, required: true },
})
const emit = defineEmits(['changed'])

const API = '/api/admin/certificates'
const assetUrl = (asset, extra = '') => `${API}?workshopId=${props.workshopId}&asset=${asset}${extra}`

const detail = ref(null)
const template = computed(() => detail.value?.template || null)
const readiness = computed(() => detail.value?.readiness || { template: false, style: false })
const recipients = computed(() => detail.value?.recipients || [])
const sendReady = computed(() => readiness.value.style && recipients.value.length > 0)

// The preview uses the longest real name, so shrink-to-fit is visible before sending.
const sampleName = computed(() =>
  recipients.value.reduce((longest, r) => (r.full_name.length > longest.length ? r.full_name : longest), '') ||
  'Sample Name'
)

const canvaUrl = ref('')
const fetching = ref(false)

const style = ref({ x: null, y: null, size: 36, color: '#111827', maxWidth: 0.6 })
const savedStyleKey = ref('')
const styleKey = (s) => [s.x, s.y, s.size, s.color, s.maxWidth].join('|')
const styleDirty = computed(() => styleKey(style.value) !== savedStyleKey.value)
const savingStyle = ref(false)

const fontInput = ref(null)
const uploadingFont = ref(false)
const previewUrl = ref('')
const fontUrl = ref('')
const fontKey = ref('')

const megabytes = (bytes) => `${(Number(bytes || 0) / 1048576).toFixed(1)} MB`

async function reload({ notify = true } = {}) {
  const data = await apiGet(`${API}?workshopId=${props.workshopId}`)
  if (!data.ok) return props.toast('error', 'Could not load this workshop', data.message)

  const previousFetch = detail.value?.template?.fetched_at
  detail.value = data

  const t = data.template
  if (t) {
    if (!canvaUrl.value) canvaUrl.value = t.canva_url
    const saved = { x: t.name_x, y: t.name_y, size: t.name_size, color: t.name_color, maxWidth: t.name_max_width }
    // Take the saved placement unless the admin is mid-adjustment.
    if (!savedStyleKey.value || !styleDirty.value) {
      style.value = { ...saved }
      savedStyleKey.value = styleKey(saved)
    }
    if (t.fetched_at && t.fetched_at !== previousFetch) await loadPreview()
    if (t.has_font && !fontUrl.value) await loadFont()
  }
  if (notify) emit('changed')
}

async function loadPreview() {
  try {
    const blob = await apiBlob(assetUrl('preview'))
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = URL.createObjectURL(blob)
  } catch (error) {
    props.toast('error', 'Could not load the template preview', error.message)
  }
}

async function loadFont() {
  try {
    const blob = await apiBlob(assetUrl('font'))
    if (fontUrl.value) URL.revokeObjectURL(fontUrl.value)
    fontUrl.value = URL.createObjectURL(blob)
    fontKey.value = `${props.workshopId}-${Date.now()}`
  } catch (error) {
    props.toast('error', 'Could not load the font', error.message)
  }
}

async function fetchTemplate() {
  fetching.value = true
  const data = await apiPost(API, { op: 'fetch-template', workshopId: props.workshopId, canvaUrl: canvaUrl.value })
  fetching.value = false
  if (!data.ok) return props.toast('error', 'Could not fetch the template', data.message, 12000)

  props.toast('success', 'Template fetched', data.title ? `“${data.title}” from Canva.` : '')
  for (const warning of data.warnings || []) props.toast('warn', 'Check the template', warning, 12000)
  await reload()
}

async function uploadFont(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    return props.toast('error', 'Font too large', 'Font files must be 2 MB or smaller.')
  }

  uploadingFont.value = true
  const data = await apiPost(API, {
    op: 'upload-font',
    workshopId: props.workshopId,
    base64: await fileToBase64(file),
    filename: file.name,
  })
  uploadingFont.value = false
  if (!data.ok) return props.toast('error', 'Could not use that font', data.message)

  props.toast('success', 'Font uploaded', `Names will be drawn in ${data.family}.`)
  await loadFont()
  await reload()
}

async function saveStyle() {
  savingStyle.value = true
  const data = await apiPost(API, { op: 'save-style', workshopId: props.workshopId, style: style.value })
  savingStyle.value = false
  if (!data.ok) return props.toast('error', 'Could not save the position', data.message)

  style.value = { ...data.style }
  savedStyleKey.value = styleKey(data.style)
  props.toast('success', 'Position saved', 'Download a sample to check the exact output.')
  await reload()
}

async function openSample() {
  // Open synchronously so the popup blocker treats it as user-initiated.
  const win = window.open('', '_blank')
  try {
    const blob = await apiBlob(assetUrl('sample', `&name=${encodeURIComponent(sampleName.value)}`))
    const url = URL.createObjectURL(blob)
    if (win) win.location.href = url
    else window.location.assign(url)
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  } catch (error) {
    win?.close()
    props.toast('error', 'Could not build the sample', error.message)
  }
}

onMounted(() => reload({ notify: false }))
onUnmounted(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  if (fontUrl.value) URL.revokeObjectURL(fontUrl.value)
})
</script>
```

<!-- file: src/components/admin/CertificateStylePreview.vue -->
```vue
<template>
  <div class="grid gap-4 lg:grid-cols-[1fr_15rem]">
    <div ref="wrap" class="relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
      <canvas ref="canvas" class="block w-full cursor-crosshair" role="img"
              :aria-label="`Certificate preview. Name baseline ${placedLabel}. Click to move it.`"
              @click="place"></canvas>
      <p v-if="modelValue.x == null" class="absolute inset-x-0 top-3 text-center pointer-events-none">
        <span class="bg-white/95 text-sm font-semibold text-gray-800 px-3 py-1.5 rounded-full shadow-sm">
          Click where the name should sit (its baseline)
        </span>
      </p>
    </div>

    <div class="flex flex-col gap-4">
      <label class="flex flex-col gap-1.5">
        <span :class="ui.label">Size (pt)</span>
        <input type="number" min="4" max="400" step="1" :value="modelValue.size" :class="ui.input"
               @change="update({ size: clamp(Number($event.target.value), 4, 400) })" />
      </label>
      <label class="flex flex-col gap-1.5">
        <span :class="ui.label">Colour</span>
        <input type="color" :value="modelValue.color"
               class="h-10 w-full rounded-lg border border-gray-200 bg-white cursor-pointer"
               @input="update({ color: $event.target.value })" />
      </label>
      <label class="flex flex-col gap-1.5">
        <span :class="ui.label">Max width · {{ Math.round(modelValue.maxWidth * 100) }}%</span>
        <input type="range" min="10" max="100" step="1" :value="Math.round(modelValue.maxWidth * 100)"
               class="accent-blue-600" @input="update({ maxWidth: Number($event.target.value) / 100 })" />
      </label>
      <label class="flex flex-col gap-1.5">
        <span :class="ui.label">Preview name</span>
        <input v-model="previewName" type="text" :class="ui.input" />
      </label>
      <p class="text-xs text-gray-500 leading-relaxed">
        Names longer than the dashed line shrink to fit. The preview is close; the sample PDF is exact.
      </p>
      <p v-if="fontError" class="text-xs text-red-600">{{ fontError }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { layoutName } from '../../../lib/certificates/layout.js'
import { ui } from '../../utils/adminApi.js'

const props = defineProps({
  modelValue: { type: Object, required: true },
  previewUrl: { type: String, required: true },
  fontUrl: { type: String, default: '' },
  fontKey: { type: String, default: '' },
  pageWidth: { type: Number, required: true },
  pageHeight: { type: Number, required: true },
  sampleName: { type: String, default: 'Sample Name' },
})
const emit = defineEmits(['update:modelValue'])

const wrap = ref(null)
const canvas = ref(null)
const previewName = ref(props.sampleName)
const fontError = ref('')
let image = null
let family = ''
let observer = null

watch(() => props.sampleName, (value) => { if (value) previewName.value = value })

const clamp = (n, min, max) => Math.min(max, Math.max(min, Number.isFinite(n) ? n : min))
const placedLabel = computed(() =>
  props.modelValue.x == null
    ? 'not set'
    : `at ${Math.round(props.modelValue.x * 100)}% across, ${Math.round(props.modelValue.y * 100)}% down`
)

function update(patch) {
  emit('update:modelValue', { ...props.modelValue, ...patch })
}

async function loadImage(url) {
  const img = new Image()
  img.src = url
  await img.decode()
  image = img
}

async function loadFont() {
  fontError.value = ''
  family = ''
  if (!props.fontUrl) return
  const name = `cert-${props.fontKey}`
  try {
    const face = new FontFace(name, `url(${props.fontUrl})`)
    await face.load()
    document.fonts.add(face)
    family = name
  } catch {
    fontError.value = 'The browser could not load this font for the preview. The sample PDF still uses it.'
  }
}

function draw() {
  const el = canvas.value
  if (!el || !image || !wrap.value) return

  const cssWidth = wrap.value.clientWidth
  const cssHeight = cssWidth * (props.pageHeight / props.pageWidth)
  const dpr = window.devicePixelRatio || 1
  el.width = Math.round(cssWidth * dpr)
  el.height = Math.round(cssHeight * dpr)
  el.style.height = `${cssHeight}px`

  const ctx = el.getContext('2d')
  ctx.clearRect(0, 0, el.width, el.height)
  ctx.drawImage(image, 0, 0, el.width, el.height)

  const s = props.modelValue
  if (s.x == null || s.y == null) return

  // Guide: the max-width line on the baseline, with end ticks.
  const centreX = s.x * el.width
  const baseline = s.y * el.height
  const half = (s.maxWidth * el.width) / 2
  const tick = 8 * dpr
  ctx.save()
  ctx.strokeStyle = 'rgba(37, 99, 235, 0.9)'
  ctx.lineWidth = Math.max(1, dpr)
  ctx.setLineDash([6 * dpr, 4 * dpr])
  ctx.beginPath()
  ctx.moveTo(centreX - half, baseline)
  ctx.lineTo(centreX + half, baseline)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.beginPath()
  for (const edge of [-half, half]) {
    ctx.moveTo(centreX + edge, baseline - tick)
    ctx.lineTo(centreX + edge, baseline + tick)
  }
  ctx.stroke()
  ctx.restore()

  const name = previewName.value.replace(/\s+/g, ' ').trim()
  if (!name) return

  // Same maths as the PDF renderer, in canvas pixels. pdf-lib does not kern, so neither do we.
  const scale = el.width / props.pageWidth
  const fontStack = family ? `"${family}"` : 'sans-serif'
  ctx.fontKerning = 'none'
  const measure = (text, size) => {
    ctx.font = `${size}px ${fontStack}`
    return ctx.measureText(text).width
  }
  const layout = layoutName({
    name,
    style: { ...s, size: s.size * scale },
    pageWidth: el.width,
    pageHeight: el.height,
    measure,
  })
  ctx.font = `${layout.size}px ${fontStack}`
  ctx.fillStyle = s.color
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(name, layout.x, el.height - layout.y)
}

function place(event) {
  const rect = canvas.value.getBoundingClientRect()
  const round = (n) => Math.round(clamp(n, 0, 1) * 10000) / 10000
  update({
    x: round((event.clientX - rect.left) / rect.width),
    y: round((event.clientY - rect.top) / rect.height),
  })
}

watch(() => props.previewUrl, async (url) => { await loadImage(url); draw() })
watch(() => props.fontKey, async () => { await loadFont(); draw() })
watch([() => props.modelValue, previewName], draw, { deep: true })

onMounted(async () => {
  await Promise.all([loadImage(props.previewUrl), loadFont()])
  draw()
  observer = new ResizeObserver(draw)
  observer.observe(wrap.value)
})
onUnmounted(() => observer?.disconnect())
</script>
```

- [ ] **Step 2: Add temporary child stubs** so the build passes until Tasks 19 and 20. Each file is `<template><div /></template>`, with a `<script setup>` declaring the same props:
  - `src/components/admin/CertificateImport.vue`: props `workshopId`, `toast`; emits `imported`
  - `src/components/admin/CertificateRecipients.vue`: props `recipients`, `canSend`, `toast`; emits `changed`
  - `src/components/admin/CertificateSend.vue`: props `workshopId`, `workshopTitle`, `templateReady`, `ready`, `recipients`, `sampleName`, `toast`; emits `changed`

- [ ] **Step 3: Extract and build.** Run `node scripts/extract-plan-files.mjs 18 && npm run build`. Expected: the build succeeds.

- [ ] **Step 4: Commit.** Message: `feat(admin): certificate template, font and click-to-place name style`.

---

## Task 19: Attendee import

**Files:** Replace the stub with `src/components/admin/CertificateImport.vue`

- [ ] **Step 1: Create the component**

<!-- file: src/components/admin/CertificateImport.vue -->
```vue
<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap gap-2">
      <form class="flex flex-1 flex-wrap gap-2 min-w-72" @submit.prevent="previewFromSheet">
        <label class="sr-only" :for="`sheet-${workshopId}`">Google Sheet link</label>
        <input :id="`sheet-${workshopId}`" v-model.trim="sheetUrl" type="url"
               placeholder="Google Sheet link (shared: anyone with the link)"
               :class="[ui.input, 'flex-1 min-w-64']" />
        <button type="submit" :class="ui.primary" :disabled="!!busy || !sheetUrl">
          {{ busy === 'sheet' ? 'Reading…' : 'Preview' }}
        </button>
      </form>
      <button type="button" :class="ui.secondary" :disabled="!!busy" @click="fileInput.click()">
        {{ busy === 'file' ? 'Reading…' : 'Upload CSV / Excel' }}
      </button>
      <input ref="fileInput" type="file" accept=".csv,.xlsx" class="hidden" @change="previewFromFile" />
    </div>

    <div v-if="rows.length" class="border border-gray-200 rounded-lg">
      <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-gray-100">
        <p class="text-sm text-gray-700">
          <strong class="tabular-nums">{{ included.length }}</strong> to import
          <span v-for="c in flagCounts" :key="c.flag" class="ml-2 text-gray-500 tabular-nums">
            · {{ c.count }} {{ FLAGS[c.flag].label.toLowerCase() }}
          </span>
        </p>
        <div class="flex gap-2">
          <button type="button" :class="ui.secondary" :disabled="busy === 'import'" @click="clear">Cancel</button>
          <button type="button" :class="ui.primary" :disabled="!included.length || !!busy" @click="importRows">
            {{ busy === 'import' ? 'Importing…' : `Import ${included.length}` }}
          </button>
        </div>
      </div>

      <div class="max-h-96 overflow-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 sticky top-0">
            <tr>
              <th class="px-3 py-2 text-left w-10"><span class="sr-only">Include</span></th>
              <th class="px-3 py-2 text-left w-14">Row</th>
              <th class="px-3 py-2 text-left">Name on certificate</th>
              <th class="px-3 py-2 text-left">Email</th>
              <th class="px-3 py-2 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rows" :key="r.row" class="border-t border-gray-100"
                :class="r.include ? '' : 'bg-gray-50/60 text-gray-400'">
              <td class="px-3 py-1.5">
                <input v-model="r.include" type="checkbox" class="accent-blue-600"
                       :disabled="blocked(r)" :aria-label="`Include row ${r.row}`" />
              </td>
              <td class="px-3 py-1.5 tabular-nums text-gray-400">{{ r.row }}</td>
              <td class="px-3 py-1.5">
                <input v-model="r.fullName" type="text" :class="ui.cellInput"
                       :aria-label="`Name on certificate, row ${r.row}`" />
              </td>
              <td class="px-3 py-1.5 text-gray-600">{{ r.email }}</td>
              <td class="px-3 py-1.5">
                <span v-for="f in r.flags" :key="f"
                      class="inline-block mr-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                      :class="FLAGS[f].class">{{ FLAGS[f].label }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="px-4 py-3 text-xs text-gray-500 border-t border-gray-100">
        Names are printed exactly as shown — fix capitalisation here before importing.
        Once imported, you can turn off link sharing on the sheet.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { apiPost, ui } from '../../utils/adminApi.js'

const props = defineProps({
  workshopId: { type: String, required: true },
  toast: { type: Function, required: true },
})
const emit = defineEmits(['imported'])

const API = '/api/admin/certificates'
const MAX_CSV_BYTES = 1024 * 1024
const MAX_XLSX_BYTES = 2 * 1024 * 1024

const FLAGS = {
  duplicate: { label: 'Duplicate', class: 'bg-gray-100 text-gray-600' },
  existing: { label: 'Already imported', class: 'bg-blue-50 text-blue-700' },
  invalidEmail: { label: 'Invalid email', class: 'bg-red-50 text-red-700' },
  missingName: { label: 'No name', class: 'bg-red-50 text-red-700' },
  oddCase: { label: 'Check capitals', class: 'bg-amber-50 text-amber-800' },
}

const sheetUrl = ref('')
const fileInput = ref(null)
const busy = ref('')
const rows = ref([])
const source = ref('')

const blocked = (r) => r.flags.includes('invalidEmail') || !r.fullName.trim()
const included = computed(() => rows.value.filter((r) => r.include && !blocked(r)))
const flagCounts = computed(() =>
  Object.keys(FLAGS)
    .map((flag) => ({ flag, count: rows.value.filter((r) => r.flags.includes(flag)).length }))
    .filter((c) => c.count)
)

function clear() {
  rows.value = []
  source.value = ''
}

async function preview(payload, label) {
  const data = await apiPost(API, { op: 'preview-import', workshopId: props.workshopId, ...payload })
  if (!data.ok) return props.toast('error', 'Could not read the attendees', data.message, 12000)
  rows.value = data.rows
  source.value = label
  if (!data.rows.length) props.toast('warn', 'No attendees found', 'The sheet has a header but no rows.')
}

async function previewFromSheet() {
  busy.value = 'sheet'
  try {
    await preview({ sheetUrl: sheetUrl.value }, sheetUrl.value)
  } finally {
    busy.value = ''
  }
}

async function previewFromFile(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return

  const isXlsx = /\.xlsx$/i.test(file.name)
  if (!isXlsx && !/\.csv$/i.test(file.name)) {
    return props.toast('error', 'Unsupported file', 'Upload a .csv or .xlsx file.')
  }
  if (file.size > (isXlsx ? MAX_XLSX_BYTES : MAX_CSV_BYTES)) {
    return props.toast('error', 'File too large', `Keep ${isXlsx ? 'Excel files under 2 MB' : 'CSV files under 1 MB'}.`)
  }

  busy.value = 'file'
  try {
    if (isXlsx) {
      // Loaded on demand: only admins who upload Excel pay for the parser.
      const { readSheet } = await import('read-excel-file/browser')
      const table = await readSheet(file)
      await preview({ table: table.map((row) => row.map((c) => (c == null ? '' : String(c)))) }, file.name)
    } else {
      await preview({ csv: await file.text() }, file.name)
    }
  } catch (error) {
    props.toast('error', 'Could not read the file', error.message || '')
  } finally {
    busy.value = ''
  }
}

async function importRows() {
  busy.value = 'import'
  const data = await apiPost(API, {
    op: 'import',
    workshopId: props.workshopId,
    source: source.value,
    rows: included.value.map(({ fullName, email }) => ({ fullName, email })),
  })
  busy.value = ''
  if (!data.ok) return props.toast('error', 'Import failed', data.message)

  const notes = [
    data.alreadyPresent && `${data.alreadyPresent} already on the list`,
    data.skipped && `${data.skipped} skipped`,
  ].filter(Boolean).join(' · ')
  props.toast('success', `Imported ${data.inserted} ${data.inserted === 1 ? 'person' : 'people'}`, notes)
  clear()
  emit('imported')
}
</script>
```

- [ ] **Step 2: Extract and build.** Run `node scripts/extract-plan-files.mjs 19 && npm run build`. Expected: the build succeeds, with `read-excel-file` split into its own chunk.

- [ ] **Step 3: Commit.** Message: `feat(admin): import certificate attendees from a Sheet link or file`.

---

## Task 20: Recipient list and sending

**Files:** Replace the stubs with `src/components/admin/CertificateRecipients.vue` and `src/components/admin/CertificateSend.vue`

- [ ] **Step 1: Create the components**

<!-- file: src/components/admin/CertificateRecipients.vue -->
```vue
<template>
  <div class="border border-gray-200 rounded-lg">
    <div class="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-gray-100">
      <label class="sr-only" for="cert-search">Search attendees</label>
      <input id="cert-search" v-model.trim="search" type="search" placeholder="Search name or email"
             :class="[ui.input, 'flex-1 min-w-48']" />
      <label class="sr-only" for="cert-filter">Filter by status</label>
      <select id="cert-filter" v-model="filter" :class="ui.input">
        <option value="all">All ({{ recipients.length }})</option>
        <option v-for="g in GROUPS" :key="g.id" :value="g.id">{{ g.label }} ({{ counts[g.id] }})</option>
      </select>
    </div>

    <div class="max-h-[28rem] overflow-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 sticky top-0">
          <tr>
            <th class="px-3 py-2 text-left">Name on certificate</th>
            <th class="px-3 py-2 text-left">Email</th>
            <th class="px-3 py-2 text-left">Status</th>
            <th class="px-3 py-2 text-left">Sent</th>
            <th class="px-3 py-2 text-right"><span class="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in visible" :key="r.id" class="border-t border-gray-100 align-top">
            <template v-if="editing === r.id">
              <td class="px-3 py-2">
                <input v-model="draft.fullName" type="text" :class="ui.input + ' w-full'" aria-label="Name on certificate" />
              </td>
              <td class="px-3 py-2">
                <input v-model="draft.email" type="email" :class="ui.input + ' w-full'" aria-label="Email" />
              </td>
              <td colspan="2" class="px-3 py-2 text-xs text-gray-500">
                <template v-if="isSent(r)">Already sent — resend after saving to deliver the correction.</template>
              </td>
              <td class="px-3 py-2 text-right whitespace-nowrap">
                <button type="button" :class="ui.link" :disabled="saving" @click="saveEdit(r)">Save</button>
                <button type="button" class="ml-3" :class="ui.link" @click="editing = null">Cancel</button>
              </td>
            </template>

            <template v-else>
              <td class="px-3 py-2 font-medium text-gray-900">{{ r.full_name }}</td>
              <td class="px-3 py-2 text-gray-600">{{ r.email }}</td>
              <td class="px-3 py-2">
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
                      :class="STATUS[r.status || 'none'].class">{{ STATUS[r.status || 'none'].label }}</span>
                <div v-if="r.last_error && !isSent(r)" class="text-xs text-red-600 mt-1 max-w-xs">{{ r.last_error }}</div>
              </td>
              <td class="px-3 py-2 text-xs text-gray-500 tabular-nums whitespace-nowrap">
                {{ r.sent_at ? shortDate(r.sent_at) : '—' }}
              </td>
              <td class="px-3 py-2 text-right whitespace-nowrap">
                <button type="button" :class="ui.link"
                        :disabled="!canSend || busyId === r.id || r.status === 'processing'"
                        @click="resend(r)">
                  {{ busyId === r.id ? 'Sending…' : r.job_id ? 'Resend' : 'Send' }}
                </button>
                <button type="button" class="ml-3" :class="ui.link" @click="startEdit(r)">Edit</button>
                <button type="button" class="ml-3 text-sm font-semibold text-red-600 hover:text-red-800 cursor-pointer"
                        @click="remove(r)">Remove</button>
              </td>
            </template>
          </tr>
          <tr v-if="!visible.length">
            <td colspan="5" class="px-3 py-6 text-center text-sm text-gray-500">Nobody matches.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { apiPost, shortDate, ui } from '../../utils/adminApi.js'

const props = defineProps({
  recipients: { type: Array, required: true },
  canSend: { type: Boolean, default: false },
  toast: { type: Function, required: true },
})
const emit = defineEmits(['changed'])

const API = '/api/admin/certificates'

const STATUS = {
  none: { label: 'Not sent', class: 'bg-gray-100 text-gray-600' },
  pending: { label: 'Queued', class: 'bg-gray-100 text-gray-700' },
  processing: { label: 'Sending', class: 'bg-gray-100 text-gray-700' },
  deferred: { label: 'Waiting · daily limit', class: 'bg-amber-50 text-amber-700' },
  sent: { label: 'Sent', class: 'bg-blue-50 text-blue-700' },
  delivered: { label: 'Delivered', class: 'bg-emerald-50 text-emerald-700' },
  failed: { label: 'Failed', class: 'bg-red-50 text-red-700' },
  bounced: { label: 'Bounced', class: 'bg-red-50 text-red-700' },
}

const GROUPS = [
  { id: 'notSent', label: 'Not sent', match: (r) => !r.job_id },
  { id: 'waiting', label: 'Waiting', match: (r) => ['pending', 'processing', 'deferred'].includes(r.status) },
  { id: 'sent', label: 'Sent', match: (r) => ['sent', 'delivered'].includes(r.status) },
  { id: 'problem', label: 'Failed', match: (r) => ['failed', 'bounced'].includes(r.status) },
]

const search = ref('')
const filter = ref('all')
const editing = ref(null)
const draft = reactive({ fullName: '', email: '' })
const saving = ref(false)
const busyId = ref(null)

const isSent = (r) => r.status === 'sent' || r.status === 'delivered'

const counts = computed(() =>
  Object.fromEntries(GROUPS.map((g) => [g.id, props.recipients.filter(g.match).length]))
)

const visible = computed(() => {
  const q = search.value.toLowerCase()
  const group = GROUPS.find((g) => g.id === filter.value)
  return props.recipients.filter(
    (r) =>
      (!group || group.match(r)) &&
      (!q || r.full_name.toLowerCase().includes(q) || r.email.includes(q))
  )
})

function startEdit(r) {
  editing.value = r.id
  draft.fullName = r.full_name
  draft.email = r.email
}

async function saveEdit(r) {
  saving.value = true
  const data = await apiPost(API, { op: 'update-recipient', id: r.id, fullName: draft.fullName, email: draft.email })
  saving.value = false
  if (!data.ok) return props.toast('error', 'Could not save', data.message)
  editing.value = null
  props.toast('success', 'Saved', isSent(r) ? 'Click Resend to deliver the corrected certificate.' : '')
  emit('changed')
}

async function resend(r) {
  busyId.value = r.id
  const data = await apiPost(API, { op: 'resend', id: r.id })
  busyId.value = null

  if (data.ok) {
    props.toast('success', `Certificate sent to ${r.full_name}`, data.provider ? `via ${data.provider}` : '')
  } else if (data.code === 'QUOTA_EXHAUSTED') {
    props.toast('warn', 'Daily limit reached', 'It will go out automatically after the reset.')
  } else {
    props.toast('error', `Could not send to ${r.full_name}`, data.message, 10000)
  }
  emit('changed')
}

async function remove(r) {
  if (!window.confirm(`Remove ${r.full_name} from this workshop's certificate list?`)) return
  const data = await apiPost(API, { op: 'delete-recipient', id: r.id })
  if (!data.ok) return props.toast('error', 'Could not remove', data.message)
  props.toast('success', `${r.full_name} removed`)
  emit('changed')
}
</script>
```

<!-- file: src/components/admin/CertificateSend.vue -->
```vue
<template>
  <div class="flex flex-col gap-5">
    <dl class="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <div v-for="c in cards" :key="c.label" class="border border-gray-200 rounded-lg px-3 py-2">
        <dt class="text-xs text-gray-500">{{ c.label }}</dt>
        <dd class="text-xl font-extrabold tabular-nums" :class="c.cls">{{ c.value }}</dd>
      </div>
    </dl>

    <form class="flex flex-wrap items-end gap-2" @submit.prevent="sendTest">
      <label class="flex flex-col gap-1.5 flex-1 min-w-56">
        <span :class="ui.label">Send a test to</span>
        <input v-model.trim="testTo" type="email" required placeholder="you@example.com" :class="ui.input" />
      </label>
      <label class="flex flex-col gap-1.5 flex-1 min-w-48">
        <span :class="ui.label">Name on the test</span>
        <input v-model="testName" type="text" :class="ui.input" />
      </label>
      <button type="submit" :class="ui.secondary" :disabled="!testReady || testing">
        {{ testing ? 'Sending…' : 'Send test' }}
      </button>
    </form>

    <div class="flex flex-wrap items-center gap-3">
      <button type="button" :class="ui.primary" :disabled="!ready || draining || (!notQueued && !waiting)"
              @click="sendAll">
        {{ primaryLabel }}
      </button>
      <button v-if="draining" type="button" :class="ui.secondary" @click="stopRequested = true">Pause</button>
      <span v-if="!ready" class="text-sm text-gray-500">Finish steps 1–3 first.</span>
      <span v-else-if="progress" class="text-sm text-gray-600" aria-live="polite">{{ progress }}</span>
    </div>
    <p class="text-xs text-gray-500">
      Sending continues while this page is open. Anything left — including whatever the daily
      limit holds back — goes out automatically on the next scheduled run.
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { apiPost, untilLabel, ui } from '../../utils/adminApi.js'

const props = defineProps({
  workshopId: { type: String, required: true },
  workshopTitle: { type: String, required: true },
  // Template, font and placement are set — enough for a test.
  templateReady: { type: Boolean, default: false },
  // …and there is someone to send to.
  ready: { type: Boolean, default: false },
  recipients: { type: Array, required: true },
  sampleName: { type: String, default: 'Sample Name' },
  toast: { type: Function, required: true },
})
const emit = defineEmits(['changed'])

const API = '/api/admin/certificates'
const TEST_TO_KEY = 'ss_cert_test_to'

function readStored() {
  try { return localStorage.getItem(TEST_TO_KEY) || '' } catch { return '' }
}
function store(value) {
  try { localStorage.setItem(TEST_TO_KEY, value) } catch { /* private mode: not remembered */ }
}

const testTo = ref(readStored())
const testName = ref(props.sampleName)
const testing = ref(false)
const draining = ref(false)
const stopRequested = ref(false)
const progress = ref('')
let unmounted = false

watch(() => props.sampleName, (value) => { testName.value = value })

const testReady = computed(() => props.templateReady && Boolean(testTo.value))

const count = (statuses) => props.recipients.filter((r) => statuses.includes(r.status)).length
const notQueued = computed(() => props.recipients.filter((r) => !r.job_id).length)
const waiting = computed(() => count(['pending', 'processing', 'deferred']))
const cards = computed(() => [
  { label: 'Attendees', value: props.recipients.length, cls: 'text-gray-900' },
  { label: 'Sent', value: count(['sent', 'delivered']), cls: 'text-blue-700' },
  { label: 'Delivered', value: count(['delivered']), cls: 'text-emerald-600' },
  { label: 'Waiting', value: waiting.value, cls: waiting.value ? 'text-amber-700' : 'text-gray-900' },
  { label: 'Failed', value: count(['failed', 'bounced']), cls: count(['failed', 'bounced']) ? 'text-red-600' : 'text-gray-900' },
])

const primaryLabel = computed(() => {
  if (draining.value) return 'Sending…'
  if (notQueued.value) return `Send ${notQueued.value} certificate${notQueued.value === 1 ? '' : 's'}`
  if (waiting.value) return `Continue sending (${waiting.value} waiting)`
  return 'All certificates sent'
})

async function sendTest() {
  testing.value = true
  store(testTo.value)
  const data = await apiPost(API, {
    op: 'send-test', workshopId: props.workshopId, to: testTo.value, name: testName.value,
  })
  testing.value = false

  if (data.ok) props.toast('success', 'Test sent', `Check ${testTo.value}${data.provider ? ` (via ${data.provider})` : ''}.`)
  else if (data.code === 'QUOTA_EXHAUSTED') props.toast('warn', 'Daily limit reached', `Resets ${untilLabel(data.resets_at)}.`)
  else props.toast('error', 'Test failed', data.message, 10000)
}

async function sendAll() {
  const first = notQueued.value > 0
  if (first) {
    const ok = window.confirm(
      `Send ${notQueued.value} certificate${notQueued.value === 1 ? '' : 's'} for “${props.workshopTitle}”?\n\n` +
        'Each person gets one email with their PDF attached.'
    )
    if (!ok) return
  }

  draining.value = true
  stopRequested.value = false
  let sent = 0
  let data = await apiPost(API, first ? { op: 'send-all', workshopId: props.workshopId } : { op: 'process' })

  for (;;) {
    if (!data.ok && data.code !== 'QUOTA_EXHAUSTED') {
      props.toast('error', 'Sending stopped', data.message, 12000)
      break
    }
    sent += data.summary?.sent || 0
    progress.value = `${sent} sent so far…`
    emit('changed')

    if (data.code === 'QUOTA_EXHAUSTED') {
      props.toast('warn', 'Daily limit reached',
        `The rest go out automatically after the reset (${untilLabel(data.resets_at)}).`, 12000)
      break
    }
    if (stopRequested.value || unmounted || !data.remaining || !data.summary?.claimed) break
    data = await apiPost(API, { op: 'process' })
  }

  draining.value = false
  progress.value = sent ? `${sent} sent this session.` : ''
  if (sent && !stopRequested.value) props.toast('success', 'Certificates sent', `${sent} delivered to the providers.`)
  emit('changed')
}

onUnmounted(() => { unmounted = true })
</script>
```

- [ ] **Step 2: Extract and build.** Run `node scripts/extract-plan-files.mjs 20 && npm run build`. Expected: the build succeeds.

- [ ] **Step 3: Commit.** Message: `feat(admin): certificate recipient list and batched sending`.

---

## Task 21: End-to-end verification

Nothing here sends email to real attendees.

- [ ] **Step 1: Run everything offline.** Run `npm test && npm run build`. Expected: all tests pass and the build succeeds.

- [ ] **Step 2: Start the dev server** with `preview_start` `{ name: "vite-dev" }`. Open **`http://127.0.0.1:5173/admin`**, not `localhost`: the Canva redirect URL is registered for 127.0.0.1, and the session cookie is per-host.

- [ ] **Step 3: Sign in.** The user types the admin password. Claude does not.

- [ ] **Step 4: Tab shell.** Open the Certificates tab. Check that all workshops are listed, the Canva card shows the correct state, and the console has no errors.

- [ ] **Step 5: Canva connection.** This needs `CANVA_CLIENT_ID` and `CANVA_CLIENT_SECRET` in `.env`.
  1. Click **Connect Canva**. The user approves in Canva.
  2. Confirm the toast "Canva connected" appears and the URL is back to `/admin`.

- [ ] **Step 6: Template.** On Workshop 1:
  1. Paste `https://canva.link/9e9xyxpifdtp4ex` and click **Fetch from Canva**.
  2. Confirm the preview renders.
  3. Confirm the placeholder text has been removed from the design. If not, tell the user.

- [ ] **Step 7: Name style.**
  1. The user uploads the font.
  2. Click to place the name, then click **Save position**.
  3. Click **Download sample** and confirm the name matches the preview's position.

- [ ] **Step 8: Test send.** With the user's permission, send a test only to an address the user gives. Confirm it arrives with the PDF attached.

- [ ] **Step 9: Import preview.**
  1. Paste the Workshop 1 sheet link and click **Preview**.
  2. Check the counts: 58 rows, and the odd-capitalisation flags.
  3. Click **Cancel**. Don't import unless the user asks.

- [ ] **Step 10: Stop.** Hand the real imports and **Send** to the user.

- [ ] **Step 11: Finish the branch.** Use superpowers:finishing-a-development-branch.
