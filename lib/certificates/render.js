import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { layoutName } from './layout.js'
import { normalizeName } from './recipients.js'
import { UserFacingError } from '../errors.js'

export const MAX_FONT_BYTES = 2 * 1024 * 1024

// sfnt signatures pdf-lib can embed: TrueType (two spellings) and CFF OpenType.
// Collections (ttcf) and web fonts (wOFF / wOF2) open in fontkit but cannot be embedded.
const EMBEDDABLE_SIGNATURES = new Set(['00010000', '74727565', '4f54544f'])

export class MissingGlyphError extends UserFacingError {
  constructor(chars, family) {
    super(
      `The font "${family}" has no character for: ${chars.join(' ')}. ` +
        'Upload a font that includes it, or correct the name.',
      'MISSING_GLYPH'
    )
    this.name = 'MissingGlyphError'
    this.chars = chars
  }
}

function openFont(bytes) {
  if (!bytes || bytes.length < 4) return null
  const signature = Buffer.from(bytes.subarray(0, 4)).toString('hex')
  if (!EMBEDDABLE_SIGNATURES.has(signature)) return null
  try {
    return fontkit.create(Buffer.from(bytes))
  } catch {
    return null
  }
}

/** Validate an uploaded font. Returns its family name. */
export function inspectFont(bytes) {
  if (!bytes?.length) throw new UserFacingError('The font file is empty.', 'BAD_FONT')
  if (bytes.length > MAX_FONT_BYTES) {
    throw new UserFacingError('Font files must be 2 MB or smaller.', 'BAD_FONT')
  }
  const font = openFont(bytes)
  if (!font?.familyName) throw new UserFacingError('Upload a .ttf or .otf font file.', 'BAD_FONT')
  return { family: font.familyName }
}

export function missingGlyphs(font, text) {
  const missing = new Set()
  for (const ch of text) {
    if (/\s/.test(ch)) continue
    if (!font.hasGlyphForCodePoint(ch.codePointAt(0))) missing.add(ch)
  }
  return [...missing]
}

export function parseHexColor(hex) {
  const match = /^#?([0-9a-f]{6})$/i.exec(String(hex ?? ''))
  const n = parseInt(match ? match[1] : '111827', 16)
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255)
}

export async function readPdfInfo(bytes) {
  let doc
  try {
    doc = await PDFDocument.load(bytes)
  } catch {
    throw new UserFacingError('Canva returned a PDF that could not be read. Fetch it again.', 'BAD_PDF')
  }
  const { width, height } = doc.getPage(0).getSize()
  return { pageWidth: width, pageHeight: height, pageCount: doc.getPageCount() }
}

export function certificateFilename(workshopTitle, name) {
  const clean = (s) =>
    String(s ?? '').normalize('NFKD').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  const stem = ['SkillSprint-Certificate', clean(workshopTitle), clean(name)].filter(Boolean).join('-')
  return `${stem.slice(0, 120)}.pdf`
}

/** The template with `name` drawn on page 1. Returns the PDF bytes. */
export async function renderCertificate({ templatePdf, fontBytes, style, name, title = '' }) {
  const text = normalizeName(name)
  if (!text) throw new UserFacingError('The name is empty.', 'EMPTY_NAME')

  const fk = openFont(fontBytes)
  if (!fk) throw new UserFacingError('The stored font could not be read. Upload it again.', 'BAD_FONT')
  const missing = missingGlyphs(fk, text)
  if (missing.length) throw new MissingGlyphError(missing, fk.familyName)

  const doc = await PDFDocument.load(templatePdf)
  doc.registerFontkit(fontkit)
  // Embedded whole rather than subset: pdf-lib's subsetter garbles glyphs in some fonts, and a
  // few hundred KB on one attachment is a fair price for never sending a broken name.
  const font = await doc.embedFont(fontBytes, { subset: false })

  // Only page 1 is the certificate.
  while (doc.getPageCount() > 1) doc.removePage(doc.getPageCount() - 1)

  const page = doc.getPage(0)
  const { width: pageWidth, height: pageHeight } = page.getSize()
  const layout = layoutName({
    name: text,
    style,
    pageWidth,
    pageHeight,
    measure: (t, size) => font.widthOfTextAtSize(t, size),
  })

  page.drawText(text, {
    x: layout.x,
    y: layout.y,
    size: layout.size,
    font,
    color: parseHexColor(style.color),
  })

  doc.setTitle(title ? `Certificate — ${text} — ${title}` : `Certificate — ${text}`)
  doc.setProducer('SkillSprint')
  return doc.save()
}
