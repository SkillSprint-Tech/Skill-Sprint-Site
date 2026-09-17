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
