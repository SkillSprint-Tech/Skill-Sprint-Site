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
