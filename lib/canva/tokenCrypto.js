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
