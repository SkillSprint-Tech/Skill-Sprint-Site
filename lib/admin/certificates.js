import { getPool } from '../db.js'
import { ensureSchema } from '../schema.js'
import { applyCors, ok, fail, methodNotAllowed, getQueryParam } from '../http.js'
import { requireAdmin } from '../auth.js'
import { UserFacingError, respondWithError } from '../errors.js'
import { getConnectionStatus } from '../canva/oauth.js'
import { runWorker, sendOneJob } from '../email/worker.js'
import { readUsage, nextResetAt, configuredProviders } from '../email/quota.js'
import { parseCsv } from '../certificates/csv.js'
import { fetchSheetRows, MAX_CSV_CHARS } from '../certificates/sheets.js'
import {
  buildPreview, cleanImportRows, normalizeName, MAX_IMPORT_ROWS,
} from '../certificates/recipients.js'
import { renderCertificate, certificateFilename } from '../certificates/render.js'
import {
  getTemplateMeta, getTemplateAsset, templateReadiness, loadRenderable,
  fetchTemplateFromCanva, saveStyle, saveFont,
} from '../certificates/templates.js'
import {
  assertWorkshop, workshopSummaries, listRecipients, existingEmails, insertRecipients,
  updateRecipient, deleteRecipient, queueAll, prepareResend, countDueCertificateJobs,
} from '../certificates/store.js'
import { sendTestCertificate } from '../certificates/delivery.js'

/**
 * Every certificate operation for the admin panel. GET reads; POST dispatches on body.op.
 * See the certificates design spec §7 for the full list.
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const WORKER_BATCH = 25

const siteUrl = () => process.env.PUBLIC_SITE_URL || 'https://skill-sprint.pk'

function requireId(value, label = 'workshopId') {
  if (!UUID.test(String(value || ''))) {
    throw new UserFacingError(`A valid ${label} is required.`, 'MISSING_ID')
  }
  return String(value)
}

function sendBytes(res, bytes, type, disposition) {
  if (!bytes) return fail(res, 'NOT_FOUND', 'Nothing has been uploaded yet.', 404)
  res.statusCode = 200
  res.setHeader('Content-Type', type)
  res.setHeader('Content-Length', bytes.length)
  res.setHeader('Cache-Control', 'no-store')
  if (disposition) res.setHeader('Content-Disposition', disposition)
  res.end(bytes)
}

async function handleGet(req, res) {
  const workshopId = getQueryParam(req, 'workshopId')

  if (!workshopId) {
    const [workshops, canva, usage] = await Promise.all([
      workshopSummaries(),
      getConnectionStatus(),
      readUsage(getPool()),
    ])
    return ok(res, { workshops, canva, usage, resets_at: nextResetAt().toISOString() })
  }

  requireId(workshopId)
  const asset = getQueryParam(req, 'asset')

  if (asset === 'preview') {
    return sendBytes(res, await getTemplateAsset(workshopId, 'preview'), 'image/png')
  }
  if (asset === 'font') {
    return sendBytes(res, await getTemplateAsset(workshopId, 'font'), 'application/octet-stream')
  }
  if (asset === 'sample') {
    const renderable = await loadRenderable(workshopId)
    if (renderable.error) throw new UserFacingError(renderable.error, 'NOT_READY')
    const name = normalizeName(getQueryParam(req, 'name')) || 'Sample Name'
    const pdf = await renderCertificate({ ...renderable, name, title: renderable.workshopTitle })
    return sendBytes(
      res,
      Buffer.from(pdf),
      'application/pdf',
      `inline; filename="${certificateFilename(renderable.workshopTitle, name)}"`
    )
  }

  const [template, recipients] = await Promise.all([
    getTemplateMeta(workshopId),
    listRecipients(workshopId),
  ])
  return ok(res, { template, readiness: templateReadiness(template), recipients })
}

async function readImportTable(body) {
  if (body.sheetUrl) return fetchSheetRows(body.sheetUrl)

  if (typeof body.csv === 'string') {
    if (body.csv.length > MAX_CSV_CHARS) {
      throw new UserFacingError('That CSV is larger than 1 MB.', 'TOO_LARGE')
    }
    return parseCsv(body.csv)
  }

  if (Array.isArray(body.table)) {
    if (body.table.length > MAX_IMPORT_ROWS + 1) {
      throw new UserFacingError(`At most ${MAX_IMPORT_ROWS} rows can be imported at once.`, 'TOO_LARGE')
    }
    return body.table.map((row) =>
      Array.isArray(row) ? row.map((cell) => (cell == null ? '' : String(cell))) : []
    )
  }

  throw new UserFacingError('Provide a Google Sheet link or a file.', 'NO_SOURCE')
}

/** Run one worker batch and describe where certificate sending stands. */
async function drain(res, extra = {}) {
  const summary = await runWorker({ limit: WORKER_BATCH })
  const [usage, remaining] = await Promise.all([readUsage(getPool()), countDueCertificateJobs()])
  const payload = { ...extra, summary, usage, remaining, resets_at: nextResetAt().toISOString() }

  if (summary.sent === 0 && summary.deferred > 0) {
    return ok(res, {
      ...payload,
      ok: false,
      code: configuredProviders().length ? 'QUOTA_EXHAUSTED' : 'NO_PROVIDER',
      message: 'Daily sending limit reached. The rest go out automatically after the reset.',
    })
  }
  return ok(res, payload)
}

const OPS = {
  async 'fetch-template'(body, res) {
    const workshopId = requireId(body.workshopId)
    await assertWorkshop(workshopId)
    return ok(res, await fetchTemplateFromCanva(workshopId, body.canvaUrl))
  },

  async 'save-style'(body, res) {
    const style = await saveStyle(requireId(body.workshopId), body.style || {})
    return ok(res, { style })
  },

  async 'upload-font'(body, res) {
    return ok(res, await saveFont(requireId(body.workshopId), body))
  },

  async 'preview-import'(body, res) {
    const workshopId = requireId(body.workshopId)
    const table = await readImportTable(body)
    const rows = buildPreview(table, await existingEmails(workshopId))
    return ok(res, { rows })
  },

  async import(body, res) {
    const workshopId = requireId(body.workshopId)
    await assertWorkshop(workshopId)
    const { clean, skipped } = cleanImportRows(body.rows)
    const inserted = await insertRecipients(workshopId, clean, body.source)
    return ok(res, { inserted, skipped, alreadyPresent: clean.length - inserted })
  },

  async 'update-recipient'(body, res) {
    return ok(res, { recipient: await updateRecipient(requireId(body.id, 'id'), body) })
  },

  async 'delete-recipient'(body, res) {
    await deleteRecipient(requireId(body.id, 'id'))
    return ok(res, { deleted: true })
  },

  async 'send-test'(body, res) {
    const result = await sendTestCertificate({
      workshopId: requireId(body.workshopId),
      to: body.to,
      name: body.name,
      siteUrl: siteUrl(),
    })
    return ok(res, result)
  },

  async 'send-all'(body, res) {
    const workshopId = requireId(body.workshopId)
    const renderable = await loadRenderable(workshopId)
    if (renderable.error) throw new UserFacingError(renderable.error, 'NOT_READY')
    const newlyQueued = await queueAll(workshopId)
    return drain(res, { newlyQueued })
  },

  async process(body, res) {
    return drain(res)
  },

  async resend(body, res) {
    const jobId = await prepareResend(requireId(body.id, 'id'))
    if (!jobId) {
      return ok(res, { ok: false, code: 'BUSY', message: 'That certificate is being sent right now.' })
    }
    return ok(res, await sendOneJob(jobId))
  },
}

export default async function handler(req, res) {
  if (applyCors(req, res, 'GET,POST,OPTIONS')) return
  if (requireAdmin(req, res)) return

  try {
    await ensureSchema()
    if (req.method === 'GET') return await handleGet(req, res)
    if (req.method !== 'POST') return methodNotAllowed(res, ['GET', 'POST'])

    const body = req.body || {}
    const op = Object.hasOwn(OPS, body.op) ? OPS[body.op] : null
    if (!op) return fail(res, 'UNKNOWN_OP', `Unknown op: ${body.op || '(none)'}`)
    return await op(body, res)
  } catch (error) {
    return respondWithError(res, error, 'admin/certificates')
  }
}

export const config = { maxDuration: 60 }
