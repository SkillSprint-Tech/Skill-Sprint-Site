/**
 * The welcome + schedule email. One module renders both HTML and plain text so the two
 * can never drift, and both providers receive identical content.
 *
 * Email HTML is not web HTML: tables for layout, inline styles only, no flexbox/grid,
 * no external stylesheets. Outlook and Gmail strip nearly everything else.
 */

import { unsubscribeUrl } from './unsubscribeToken.js'

const BRAND = '#2563eb'
const INK = '#0f172a'
const MUTED = '#64748b'
const RULE = '#e2e8f0'

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function firstName(fullName) {
  return String(fullName || '').trim().split(/\s+/)[0] || 'there'
}

/** Fixed to Pakistan time — the audience is local, and UTC in an email confuses people. */
function formatWhen(startsAt, durationMins) {
  const date = new Date(startsAt)
  const opts = {
    timeZone: 'Asia/Karachi',
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit', hour12: true,
  }
  return `${date.toLocaleString('en-GB', opts)} PKT · ${durationMins} min`
}

function renderRows(workshops) {
  if (!workshops.length) {
    return `
      <tr><td style="padding:16px 0;color:${MUTED};font-size:14px;line-height:1.6;">
        Dates for the next block are being finalised. We'll email you the moment they're live.
      </td></tr>`
  }

  return workshops
    .map((w) => {
      // The focus area lives in speaker_role and must show whether or not a speaker is
      // named — it is the line that tells someone what the session actually covers.
      const focus = w.speaker_role
        ? `<div style="color:${BRAND};font-size:13px;margin-top:4px;font-weight:600;">${escapeHtml(w.speaker_role)}</div>`
        : ''
      const speaker = w.speaker
        ? `<div style="color:${MUTED};font-size:13px;margin-top:4px;">with ${escapeHtml(w.speaker)}</div>`
        : ''
      const place = w.location
        ? `<div style="color:${MUTED};font-size:13px;margin-top:2px;">${escapeHtml(w.location)}</div>`
        : ''
      return `
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid ${RULE};">
          <div style="color:${BRAND};font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;">
            ${escapeHtml(formatWhen(w.starts_at, w.duration_mins))}
          </div>
          <div style="color:${INK};font-size:16px;font-weight:700;margin-top:6px;">
            ${escapeHtml(w.title)}
          </div>
          ${focus}${speaker}${place}
        </td>
      </tr>`
    })
    .join('')
}

export function renderWelcomeSchedule({ registration, workshops = [], siteUrl, whatsappUrl }) {
  const unsubUrl = unsubscribeUrl(siteUrl, registration.email)
  const name = firstName(registration.full_name)
  const subject = workshops.length
    ? `Your SkillSprint workshop schedule (${workshops.length} session${workshops.length === 1 ? '' : 's'})`
    : `You're registered for SkillSprint workshops`

  const whatsappBlock =
    whatsappUrl && !whatsappUrl.includes('PLACEHOLDER')
      ? `
      <tr><td style="padding:24px 0 0;">
        <a href="${escapeHtml(whatsappUrl)}"
           style="display:inline-block;background:#10b981;color:#ffffff;text-decoration:none;
                  padding:12px 24px;border-radius:999px;font-weight:700;font-size:14px;">
          Join the WhatsApp group
        </a>
      </td></tr>`
      : ''

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#f8fafc;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="max-width:560px;background:#ffffff;border:1px solid ${RULE};border-radius:12px;
                padding:32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">

    <tr><td>
      <div style="color:${BRAND};font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">
        SkillSprint Workshops
      </div>
      <h1 style="color:${INK};font-size:26px;line-height:1.25;margin:12px 0 0;font-weight:800;">
        You're in, ${escapeHtml(name)}.
      </h1>
      <p style="color:${MUTED};font-size:15px;line-height:1.65;margin:12px 0 0;">
        Thanks for registering. Every session is free, hands-on, and run by student engineers.
        Here's what's coming up — no need to sign up again for individual sessions.
      </p>
    </td></tr>

    <tr><td style="padding-top:28px;">
      <div style="color:${INK};font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
                  padding-bottom:4px;border-bottom:2px solid ${INK};">
        Your schedule
      </div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${renderRows(workshops)}
      </table>
    </td></tr>

    ${whatsappBlock}

    <tr><td style="padding-top:32px;border-top:1px solid ${RULE};margin-top:32px;">
      <p style="color:${MUTED};font-size:12px;line-height:1.6;margin:16px 0 0;">
        You're receiving this because you registered at
        <a href="${escapeHtml(siteUrl)}" style="color:${BRAND};">${escapeHtml(siteUrl)}</a>.
        <a href="${escapeHtml(unsubUrl)}" style="color:${MUTED};">Unsubscribe</a>.
      </p>
    </td></tr>

  </table>
</td></tr></table>
</body></html>`

  const textLines = [
    `You're in, ${name}.`,
    '',
    'Thanks for registering for SkillSprint workshops. Every session is free,',
    'hands-on, and run by student engineers.',
    '',
    'YOUR SCHEDULE',
    '-------------',
  ]

  if (workshops.length) {
    for (const w of workshops) {
      textLines.push(`${formatWhen(w.starts_at, w.duration_mins)}`)
      textLines.push(`  ${w.title}`)
      if (w.speaker_role) textLines.push(`  ${w.speaker_role}`)
      if (w.speaker) textLines.push(`  with ${w.speaker}`)
      if (w.location) textLines.push(`  ${w.location}`)
      textLines.push('')
    }
  } else {
    textLines.push("Dates for the next block are being finalised. We'll email you", 'the moment they are live.', '')
  }

  if (whatsappUrl && !whatsappUrl.includes('PLACEHOLDER')) {
    textLines.push(`Join the WhatsApp group: ${whatsappUrl}`, '')
  }

  textLines.push(
    '---',
    `You're receiving this because you registered at ${siteUrl}.`,
    `Unsubscribe: ${unsubUrl}`
  )

  return { subject, html, text: textLines.join('\n') }
}
