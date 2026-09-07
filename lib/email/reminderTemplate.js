/**
 * The "here's your join link" email, sent per workshop to everyone registered.
 *
 * Separate from the welcome email because it carries the one thing that must never appear
 * on a public page: the meeting link.
 *
 * Every line that changes between workshops comes from the workshop row, so session #2
 * reads correctly without anyone editing this file. The only hand-written copy here is
 * the framing the whole series shares.
 */

import { unsubscribeUrl } from './unsubscribeToken.js'
import { SITE_TIME_ZONE, SITE_TIME_ZONE_LABEL } from '../timezone.js'
import { SOCIAL_LINKS, SITE_NAME } from '../socials.js'

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

const inZone = (startsAt, options) =>
  new Date(startsAt).toLocaleString('en-GB', { timeZone: SITE_TIME_ZONE, ...options })

/** "7th", "1st", "22nd" — the ordinal the copy asks for. */
function ordinalDay(day) {
  if (day % 100 >= 11 && day % 100 <= 13) return `${day}th`
  return `${day}${{ 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] || 'th'}`
}

/** Calendar date in site time, so "is it today?" is asked in Pakistan, not in UTC. */
const zonedYmd = (value) => inZone(value, { year: 'numeric', month: '2-digit', day: '2-digit' })

/**
 * "Today, September 7th" when the session is today, otherwise "Monday, September 7th".
 * The relative wording is what makes the email read like it was written for tonight.
 */
function formatDateLine(startsAt, now) {
  const month = inZone(startsAt, { month: 'long' })
  const day = ordinalDay(Number(inZone(startsAt, { day: 'numeric' })))

  const target = zonedYmd(startsAt)
  if (target === zonedYmd(now)) return `Today, ${month} ${day}`

  const tomorrow = new Date(now.getTime() + 86400000)
  if (target === zonedYmd(tomorrow)) return `Tomorrow, ${month} ${day}`

  return `${inZone(startsAt, { weekday: 'long' })}, ${month} ${day}`
}

/** "8:00 PM" — no leading zero, uppercase meridiem, matching the copy. */
function formatTime(startsAt) {
  return inZone(startsAt, { hour: 'numeric', minute: '2-digit', hour12: true })
    .replace(/\s*(am|pm)/i, (_, m) => ` ${m.toUpperCase()}`)
}

/** "tonight" reads wrong at 9am, and "coming up" reads wrong an hour before. */
function whenPhrase(startsAt, now) {
  if (zonedYmd(startsAt) !== zonedYmd(now)) {
    const tomorrow = new Date(now.getTime() + 86400000)
    return zonedYmd(startsAt) === zonedYmd(tomorrow) ? 'tomorrow' : 'coming up'
  }
  const hour = Number(inZone(startsAt, { hour: 'numeric', hour12: false }))
  if (hour >= 17) return 'tonight'
  if (hour >= 12) return 'this afternoon'
  return 'this morning'
}

/** "first", "second"… so the opener matches the session actually being announced. */
const ORDINALS = [
  'first', 'second', 'third', 'fourth', 'fifth',
  'sixth', 'seventh', 'eighth', 'ninth', 'tenth',
]
const ordinalWord = (n) => ORDINALS[n - 1] || `${n}th`

const socialsHtml = SOCIAL_LINKS
  .map(
    ({ label, url }) =>
      `<a href="${escapeHtml(url)}" style="color:${BRAND};text-decoration:none;font-weight:600;">${escapeHtml(label)}</a>`
  )
  .join(`<span style="color:#cbd5e1;"> | </span>`)

const socialsText = SOCIAL_LINKS.map(({ label, url }) => `${label}: ${url}`)

/**
 * @param {object}   args
 * @param {number}  [args.sessionNumber] 1-based position in the series. Omitted gives a
 *                                       heading with no number rather than "#undefined".
 * @param {Date}    [args.now]           injected so "Today"/"tonight" is testable.
 */
export function renderWorkshopReminder({
  registration, workshop, siteUrl, sessionNumber, now = new Date(),
}) {
  const unsubUrl = unsubscribeUrl(siteUrl, registration.email)

  const dateLine = formatDateLine(workshop.starts_at, now)
  const timeLine = formatTime(workshop.starts_at)
  const phrase = whenPhrase(workshop.starts_at, now)
  const link = workshop.meeting_link || ''

  const heading = sessionNumber
    ? `Workshop #${sessionNumber}: ${workshop.title}`
    : workshop.title

  const opener = sessionNumber
    ? `The wait is over! Our ${ordinalWord(sessionNumber)} session of the ${SITE_NAME} Workshop Series is happening ${phrase}, and we are excited to get started.`
    : `Our next session of the ${SITE_NAME} Workshop Series is happening ${phrase}, and we are excited to get started.`

  // Only claim a speaker when there is one to name.
  const speakerLine = workshop.speaker
    ? `Join ${workshop.speaker}${workshop.speaker_role ? `, ${workshop.speaker_role}` : ''}, for a practical, live session.`
    : ''

  const subject = `${heading} — ${dateLine.replace(/^Today, /, '')}, ${timeLine} ${SITE_TIME_ZONE_LABEL}`

  const detailRow = (icon, label, value) => `
            <tr><td style="padding:4px 0;color:${INK};font-size:15px;line-height:1.6;">
              <span aria-hidden="true">${icon}</span>
              <strong style="font-weight:700;">${label}:</strong> ${value}
            </td></tr>`

  const linkValue = link
    ? `<a href="${escapeHtml(link)}" style="color:${BRAND};word-break:break-all;">${escapeHtml(link)}</a>`
    : `<span style="color:${MUTED};">to be shared shortly</span>`

  const button = link
    ? `<tr><td style="padding:24px 0 8px;">
         <a href="${escapeHtml(link)}"
            style="display:inline-block;background:${BRAND};color:#ffffff;text-decoration:none;
                   padding:14px 32px;border-radius:999px;font-weight:700;font-size:15px;">
           Join the session
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
      <p style="color:${INK};font-size:16px;font-weight:700;margin:0;">Dear Attendee,</p>
      <p style="color:${INK};font-size:15px;line-height:1.65;margin:16px 0 0;">
        ${escapeHtml(opener)}
      </p>
    </td></tr>

    <tr><td style="padding-top:24px;">
      <h1 style="color:${INK};font-size:20px;line-height:1.3;margin:0;font-weight:800;">
        ${escapeHtml(heading)}
      </h1>
    </td></tr>
${
  workshop.description
    ? `
    <tr><td style="padding-top:12px;">
      <p style="color:${MUTED};font-size:15px;line-height:1.65;margin:0;">${escapeHtml(workshop.description)}</p>
    </td></tr>`
    : ''
}${
  speakerLine
    ? `
    <tr><td style="padding-top:12px;">
      <p style="color:${MUTED};font-size:15px;line-height:1.65;margin:0;">${escapeHtml(speakerLine)}</p>
    </td></tr>`
    : ''
}
    <tr><td style="padding-top:20px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
             style="background:#f8fafc;border:1px solid ${RULE};border-radius:8px;">
        <tr><td style="padding:16px 18px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${detailRow('&#128197;', 'Date', escapeHtml(dateLine))}${detailRow('&#9200;', 'Time', `${escapeHtml(timeLine)} (${SITE_TIME_ZONE_LABEL})`)}${detailRow('&#128205;', 'Joining Link', linkValue)}
          </table>
        </td></tr>
      </table>
    </td></tr>

    ${button}

    <tr><td style="padding-top:12px;">
      <p style="color:${MUTED};font-size:13px;line-height:1.6;margin:0;font-style:italic;">
        Please try to join 5 minutes early so we can admit everyone and start right on time.
      </p>
    </td></tr>

    <tr><td style="padding-top:24px;">
      <div style="color:${INK};font-size:15px;font-weight:700;">Stay Connected</div>
      <p style="color:${MUTED};font-size:14px;line-height:1.65;margin:8px 0 0;">
        Follow our official channels for real-time reminders, speaker announcements, and
        networking opportunities:
      </p>
      <p style="font-size:14px;line-height:2;margin:10px 0 0;">${socialsHtml}</p>
    </td></tr>

    <tr><td style="padding-top:24px;">
      <p style="color:${INK};font-size:15px;line-height:1.65;margin:0;">
        See you at ${escapeHtml(timeLine)}!
      </p>
      <p style="color:${INK};font-size:15px;line-height:1.65;margin:16px 0 0;">
        Best regards,<br><strong>${escapeHtml(SITE_NAME)}</strong>
      </p>
    </td></tr>

    <tr><td style="padding-top:20px;border-top:1px solid ${RULE};">
      <p style="color:${MUTED};font-size:12px;line-height:1.6;margin:16px 0 0;">
        This link is for registered attendees — please don&#39;t share it publicly.
        <a href="${escapeHtml(unsubUrl)}" style="color:${MUTED};">Unsubscribe</a>.
      </p>
    </td></tr>

  </table>
</td></tr></table>
</body></html>`

  const text = [
    'Dear Attendee,',
    '',
    opener,
    '',
    heading,
    '',
    workshop.description,
    speakerLine,
    '',
    `Date: ${dateLine}`,
    `Time: ${timeLine} (${SITE_TIME_ZONE_LABEL})`,
    `Joining Link: ${link || 'to be shared shortly'}`,
    '',
    'Note: Please try to join 5 minutes early so we can admit everyone and start right on time.',
    '',
    'Stay Connected',
    'Follow our official channels for real-time reminders, speaker announcements, and networking opportunities:',
    ...socialsText,
    '',
    `See you at ${timeLine}!`,
    '',
    'Best regards,',
    SITE_NAME,
    '',
    `Unsubscribe: ${unsubUrl}`,
  ]
    .filter((line) => line !== undefined && line !== null)
    .join('\n')
    // Collapse the gaps left by an absent description or speaker line.
    .replace(/\n{3,}/g, '\n\n')

  return { subject, html, text }
}
