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
