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
