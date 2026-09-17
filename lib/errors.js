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
