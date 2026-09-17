import { test } from 'node:test'
import assert from 'node:assert/strict'
import { layoutName } from '../../lib/certificates/layout.js'

// Every character is half the font size wide.
const measure = (text, size) => text.length * size * 0.5

test('centres the name on the chosen point, baseline measured from the bottom', () => {
  const r = layoutName({
    name: 'Ali Raza',
    style: { x: 0.5, y: 0.4, size: 20, maxWidth: 0.8 },
    pageWidth: 800,
    pageHeight: 600,
    measure,
  })
  assert.deepEqual(r, { size: 20, width: 80, x: 360, y: 360 })
})

test('shrinks a long name to fit the max width', () => {
  const r = layoutName({
    name: 'A'.repeat(50),
    style: { x: 0.5, y: 0.5, size: 20, maxWidth: 0.5 },
    pageWidth: 800,
    pageHeight: 600,
    measure,
  })
  assert.deepEqual(r, { size: 16, width: 400, x: 200, y: 300 })
})
