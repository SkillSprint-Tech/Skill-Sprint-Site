import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { PDFDocument } from 'pdf-lib'
import {
  renderCertificate, inspectFont, certificateFilename, parseHexColor, readPdfInfo, MissingGlyphError,
} from '../../lib/certificates/render.js'

// No font ships with the repo; use a system one where available.
const FONT_PATH = 'C:/Windows/Fonts/arial.ttf'
const COLLECTION_PATH = 'C:/Windows/Fonts/cambria.ttc'
const fontBytes = fs.existsSync(FONT_PATH) ? fs.readFileSync(FONT_PATH) : null
const skip = fontBytes ? false : `needs ${FONT_PATH}`

async function blankTemplate(pages = 1) {
  const doc = await PDFDocument.create()
  for (let i = 0; i < pages; i++) doc.addPage([842, 595])
  return doc.save()
}

const style = { x: 0.5, y: 0.5, size: 36, color: '#1e3a8a', maxWidth: 0.6 }

test('certificateFilename strips accents and punctuation', () => {
  assert.equal(
    certificateFilename('Git & GitHub: Basics', 'Zoë  O’Neil'),
    'SkillSprint-Certificate-Git-GitHub-Basics-Zoe-O-Neil.pdf'
  )
})

test('parseHexColor converts to pdf-lib rgb and falls back on bad input', () => {
  const c = parseHexColor('#ff0080')
  assert.equal(c.red, 1)
  assert.equal(c.green, 0)
  assert.ok(Math.abs(c.blue - 128 / 255) < 1e-9)
  assert.equal(parseHexColor('nope').red, 0x11 / 255)
})

test('inspectFont rejects empty, oversized and non-font files', () => {
  assert.throws(() => inspectFont(Buffer.alloc(0)), { code: 'BAD_FONT' })
  assert.throws(() => inspectFont(Buffer.alloc(2 * 1024 * 1024 + 1)), { code: 'BAD_FONT' })
  assert.throws(() => inspectFont(Buffer.from('not a font at all')), { code: 'BAD_FONT' })
})

test('inspectFont rejects font collections', { skip: fs.existsSync(COLLECTION_PATH) ? false : `needs ${COLLECTION_PATH}` }, () => {
  assert.throws(() => inspectFont(fs.readFileSync(COLLECTION_PATH)), { code: 'BAD_FONT' })
})

test('inspectFont returns the family name', { skip }, () => {
  assert.equal(inspectFont(fontBytes).family, 'Arial')
})

test('renderCertificate draws on a single page and sets the title', { skip }, async () => {
  const out = await renderCertificate({
    templatePdf: await blankTemplate(2),
    fontBytes,
    style,
    name: '  Ayesha   Khan ',
    title: 'Git Basics',
  })
  const doc = await PDFDocument.load(out)
  assert.equal(doc.getPageCount(), 1)
  assert.equal(doc.getTitle(), 'Certificate — Ayesha Khan — Git Basics')
  assert.deepEqual(await readPdfInfo(out), { pageWidth: 842, pageHeight: 595, pageCount: 1 })
})

test('renderCertificate refuses characters the font lacks', { skip }, async () => {
  await assert.rejects(
    renderCertificate({ templatePdf: await blankTemplate(), fontBytes, style, name: 'Ali 中' }),
    (e) => e instanceof MissingGlyphError && e.chars.includes('中') && e.expose === true
  )
})

test('renderCertificate refuses an empty name', { skip }, async () => {
  await assert.rejects(
    renderCertificate({ templatePdf: await blankTemplate(), fontBytes, style, name: '   ' }),
    { code: 'EMPTY_NAME' }
  )
})

test('readPdfInfo rejects bytes that are not a PDF', async () => {
  await assert.rejects(readPdfInfo(Buffer.from('nope')), { code: 'BAD_PDF' })
})
