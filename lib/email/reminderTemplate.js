/**
 * The "here's your join link" email, sent per workshop to everyone registered.
 *
 * Separate from the welcome email because it carries the one thing that must never appear
 * on a public page: the meeting link.
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

function formatWhen(startsAt) {
  return new Date(startsAt).toLocaleString('en-GB', {
    timeZone: 'Asia/Karachi',
    weekday: 'long', day: 'numeric', month: 'long',
    hour: '2-digit', minute: '2-digit', hour12: true,
  })
}

export function renderWorkshopReminder({ registration, workshop, siteUrl }) {
  const name = firstName(registration.full_name)
  const when = formatWhen(workshop.starts_at)
  const unsubUrl = unsubscribeUrl(siteUrl, registration.email)
  const subject = `Join link — ${workshop.title}, ${new Date(workshop.starts_at).toLocaleDateString('en-GB', { timeZone: 'Asia/Karachi', day: 'numeric', month: 'long' })}`

  const link = workshop.meeting_link || ''

  const button = link
    ? `<tr><td style="padding:24px 0;">
         <a href="${escapeHtml(link)}"
            style="display:inline-block;background:${BRAND};color:#ffffff;text-decoration:none;
                   padding:14px 32px;border-radius:999px;font-weight:700;font-size:15px;">
           Join the session
         </a>
         <div style="color:${MUTED};font-size:12px;margin-top:12px;word-break:break-all;">
           Or paste this into your browser:<br>
           <a href="${escapeHtml(link)}" style="color:${BRAND};">${escapeHtml(link)}</a>
         </div>
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
        SkillSprint Workshop
      </div>
      <h1 style="color:${INK};font-size:24px;line-height:1.25;margin:12px 0 0;font-weight:800;">
        ${escapeHtml(workshop.title)}
      </h1>
      ${
        workshop.speaker_role
          ? `<div style="color:${BRAND};font-size:14px;font-weight:600;margin-top:6px;">${escapeHtml(workshop.speaker_role)}</div>`
          : ''
      }
      <p style="color:${MUTED};font-size:15px;line-height:1.65;margin:16px 0 0;">
        Hi ${escapeHtml(name)} — your session is coming up.
      </p>
    </td></tr>

    <tr><td style="padding-top:20px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
             style="background:#f8fafc;border:1px solid ${RULE};border-radius:8px;">
        <tr><td style="padding:16px 18px;">
          <div style="color:${INK};font-size:15px;font-weight:700;">${escapeHtml(when)} PKT</div>
          <div style="color:${MUTED};font-size:13px;margin-top:4px;">
            ${workshop.duration_mins} minutes${workshop.speaker ? ` · with ${escapeHtml(workshop.speaker)}` : ''}
          </div>
        </td></tr>
      </table>
    </td></tr>

    ${button}

    <tr><td style="padding-top:8px;border-top:1px solid ${RULE};">
      <p style="color:${MUTED};font-size:12px;line-height:1.6;margin:16px 0 0;">
        This link is for registered attendees — please don't share it publicly.
        Full schedule at <a href="${escapeHtml(siteUrl)}/workshops" style="color:${BRAND};">${escapeHtml(siteUrl)}/workshops</a>.
        <a href="${escapeHtml(unsubUrl)}" style="color:${MUTED};">Unsubscribe</a>.
      </p>
    </td></tr>

  </table>
</td></tr></table>
</body></html>`

  const text = [
    `${workshop.title}`,
    workshop.speaker_role || '',
    '',
    `Hi ${name} — your session is coming up.`,
    '',
    `${when} PKT`,
    `${workshop.duration_mins} minutes${workshop.speaker ? ` · with ${workshop.speaker}` : ''}`,
    '',
    link ? `Join here: ${link}` : '',
    '',
    "This link is for registered attendees — please don't share it publicly.",
    `Full schedule: ${siteUrl}/workshops`,
    `Unsubscribe: ${unsubUrl}`,
  ]
    .filter((line, i, all) => !(line === '' && all[i - 1] === ''))
    .join('\n')

  return { subject, html, text }
}
