import { renderCertificate, certificateFilename } from './render.js'
import { loadRenderable } from './templates.js'
import { normalizeName, normalizeEmail, isValidEmail } from './recipients.js'
import { renderCertificateEmail } from '../email/certificateTemplate.js'
import { sendWith } from '../email/providers.js'
import {
  readUsage, pickProvider, incrementUsage, markExhausted, nextResetAt, configuredProviders,
} from '../email/quota.js'
import { getPool, withTransaction } from '../db.js'
import { UserFacingError } from '../errors.js'

// Re-exported so the worker can load everything certificate-related with one dynamic import,
// keeping pdf-lib out of the registration path.
export { loadRenderable }

/** A ready-to-send message: the email plus the person's rendered PDF. */
export async function buildCertificateEmail({ recipient, workshop, renderable, siteUrl }) {
  const pdf = await renderCertificate({
    templatePdf: renderable.templatePdf,
    fontBytes: renderable.fontBytes,
    style: renderable.style,
    name: recipient.full_name,
    title: workshop.title,
  })
  const { subject, html, text } = renderCertificateEmail({ recipient, workshop, siteUrl })
  return {
    to: recipient.email,
    toName: recipient.full_name,
    subject,
    html,
    text,
    attachments: [
      {
        filename: certificateFilename(workshop.title, recipient.full_name),
        content: Buffer.from(pdf).toString('base64'),
      },
    ],
  }
}

/**
 * Send one test certificate straight away, outside the queue. It still counts against the
 * daily quota, because the provider counts it.
 */
export async function sendTestCertificate({ workshopId, to, name, siteUrl }) {
  const email = normalizeEmail(to)
  if (!isValidEmail(email)) {
    throw new UserFacingError('Enter a valid address to send the test to.', 'BAD_EMAIL')
  }

  const renderable = await loadRenderable(workshopId)
  if (renderable.error) throw new UserFacingError(renderable.error, 'NOT_READY')

  const recipient = { full_name: normalizeName(name) || 'Sample Name', email }
  const message = await buildCertificateEmail({
    recipient,
    workshop: { title: renderable.workshopTitle },
    renderable,
    siteUrl,
  })
  message.subject = `[TEST] ${message.subject}`

  const pool = getPool()
  const usage = await readUsage(pool)
  const tried = []

  for (;;) {
    const provider = pickProvider(usage, tried)
    if (!provider) {
      const configured = configuredProviders().length > 0
      return {
        ok: false,
        code: configured ? 'QUOTA_EXHAUSTED' : 'NO_PROVIDER',
        message: configured
          ? 'Daily sending limit reached on every provider.'
          : 'No email provider is configured.',
        resets_at: nextResetAt().toISOString(),
      }
    }

    const result = await sendWith(provider, message)
    if (result.outcome === 'sent') {
      await withTransaction((client) => incrementUsage(client, provider))
      return { ok: true, code: 'SENT', provider }
    }
    if (result.outcome === 'quota') {
      await withTransaction((client) => markExhausted(client, provider))
      usage[provider].remaining = 0
      tried.push(provider)
      continue
    }
    return { ok: false, code: 'SEND_FAILED', provider, message: result.error }
  }
}
