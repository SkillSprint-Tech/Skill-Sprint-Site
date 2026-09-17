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
