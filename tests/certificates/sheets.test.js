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
