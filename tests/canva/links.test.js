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
