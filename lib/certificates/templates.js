import { query } from '../db.js'
import { resolveDesignId } from '../canva/links.js'
import { getDesign, exportDesign } from '../canva/client.js'
import { inspectFont, readPdfInfo } from './render.js'
import { UserFacingError } from '../errors.js'

// Vercel caps a function response at 4.5 MB; the sample download returns the whole PDF.
export const PDF_WARN_BYTES = 4 * 1024 * 1024

const META_COLUMNS = `
  workshop_id, canva_url, canva_design_id, canva_title, page_width, page_height, page_count,
  fetched_at, font_filename, font_family, name_x, name_y, name_size, name_color, name_max_width,
  octet_length(pdf) AS pdf_bytes, (preview_png IS NOT NULL) AS has_preview,
  (font IS NOT NULL) AS has_font, updated_at`

export function styleFromRow(row) {
  return {
    x: row.name_x,
    y: row.name_y,
    size: row.name_size,
    color: row.name_color,
    maxWidth: row.name_max_width,
  }
}

export function templateReadiness(row) {
  const template = Boolean(row?.pdf_bytes)
  const placed = row?.name_x != null && row?.name_y != null
  return { template, style: template && Boolean(row?.has_font) && placed }
}

/** Template settings without the file bytes, or null. */
export async function getTemplateMeta(workshopId) {
  const { rows } = await query(
    `SELECT ${META_COLUMNS} FROM certificate_templates WHERE workshop_id = $1`,
    [workshopId]
  )
  return rows[0] || null
}

const ASSET_COLUMNS = { preview: 'preview_png', font: 'font' }

export async function getTemplateAsset(workshopId, asset) {
  const column = ASSET_COLUMNS[asset]
  if (!column) throw new UserFacingError(`Unknown asset: ${asset}`, 'BAD_ASSET')
  const { rows } = await query(
    `SELECT ${column} AS bytes FROM certificate_templates WHERE workshop_id = $1`,
    [workshopId]
  )
  return rows[0]?.bytes || null
}

/** Everything the renderer needs, or { error } explaining what is still missing. */
export async function loadRenderable(workshopId) {
  const { rows } = await query(
    `SELECT t.pdf, t.font, t.name_x, t.name_y, t.name_size, t.name_color, t.name_max_width,
            w.title
       FROM certificate_templates t
       JOIN workshops w ON w.id = t.workshop_id
      WHERE t.workshop_id = $1`,
    [workshopId]
  )
  const row = rows[0]
  if (!row?.pdf) return { error: 'The certificate template has not been fetched from Canva.' }
  if (!row.font) return { error: 'No font has been uploaded for this certificate.' }
  if (row.name_x == null || row.name_y == null) return { error: 'The name position has not been set.' }
  return {
    templatePdf: row.pdf,
    fontBytes: row.font,
    style: styleFromRow(row),
    workshopTitle: row.title,
  }
}

/** Export the design behind `canvaUrl` (PDF + preview PNG) and store it for the workshop. */
export async function fetchTemplateFromCanva(workshopId, canvaUrl) {
  const designId = await resolveDesignId(canvaUrl)

  // In parallel: two sequential exports can outlast a 60 s function.
  const [design, pdf, png] = await Promise.all([
    getDesign(designId),
    exportDesign(designId, { type: 'pdf', pages: [1] }),
    exportDesign(designId, { type: 'png', pages: [1], width: 1600, lossless: false }),
  ])
  const info = await readPdfInfo(pdf)

  await query(
    `INSERT INTO certificate_templates
       (workshop_id, canva_url, canva_design_id, canva_title, pdf, preview_png,
        page_width, page_height, page_count, fetched_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now())
     ON CONFLICT (workshop_id) DO UPDATE SET
       canva_url = EXCLUDED.canva_url, canva_design_id = EXCLUDED.canva_design_id,
       canva_title = EXCLUDED.canva_title, pdf = EXCLUDED.pdf, preview_png = EXCLUDED.preview_png,
       page_width = EXCLUDED.page_width, page_height = EXCLUDED.page_height,
       page_count = EXCLUDED.page_count, fetched_at = now(), updated_at = now()`,
    [
      workshopId, String(canvaUrl).trim(), designId, design.title, pdf, png,
      info.pageWidth, info.pageHeight, design.pageCount,
    ]
  )

  const warnings = []
  if (design.pageCount > 1) {
    warnings.push(`The design has ${design.pageCount} pages. Only page 1 is used.`)
  }
  if (pdf.length > PDF_WARN_BYTES) {
    warnings.push(
      `The PDF is ${(pdf.length / 1048576).toFixed(1)} MB. Keep it under 4 MB ` +
        '(compress images in Canva) or the sample download may fail.'
    )
  }
  return { designId, title: design.title, warnings }
}

function numberIn(value, min, max, label) {
  const n = Number(value)
  if (!Number.isFinite(n) || n < min || n > max) {
    throw new UserFacingError(`${label} must be between ${min} and ${max}.`, 'BAD_STYLE')
  }
  return n
}

export async function saveStyle(workshopId, input) {
  const color = String(input.color || '').toLowerCase()
  if (!/^#[0-9a-f]{6}$/.test(color)) {
    throw new UserFacingError('Colour must look like #1a2b3c.', 'BAD_STYLE')
  }
  const style = {
    x: numberIn(input.x, 0, 1, 'Horizontal position'),
    y: numberIn(input.y, 0, 1, 'Vertical position'),
    size: numberIn(input.size, 4, 400, 'Font size'),
    color,
    maxWidth: numberIn(input.maxWidth, 0.05, 1, 'Max width'),
  }

  const { rowCount } = await query(
    `UPDATE certificate_templates
        SET name_x = $2, name_y = $3, name_size = $4, name_color = $5, name_max_width = $6,
            updated_at = now()
      WHERE workshop_id = $1`,
    [workshopId, style.x, style.y, style.size, style.color, style.maxWidth]
  )
  if (!rowCount) throw new UserFacingError('Fetch the template from Canva first.', 'NOT_READY')
  return style
}

export async function saveFont(workshopId, { base64, filename }) {
  const bytes = Buffer.from(String(base64 || ''), 'base64')
  const { family } = inspectFont(bytes)
  const name = String(filename || '').slice(0, 200)

  const { rowCount } = await query(
    `UPDATE certificate_templates
        SET font = $2, font_filename = $3, font_family = $4, updated_at = now()
      WHERE workshop_id = $1`,
    [workshopId, bytes, name, family]
  )
  if (!rowCount) throw new UserFacingError('Fetch the template from Canva first.', 'NOT_READY')
  return { family, filename: name }
}
