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
