/**
 * The certificate email. The PDF itself travels as an attachment; this is the note around it.
 * Same table-based, inline-styled shell as template.js, because email clients strip the rest.
 *
 * No unsubscribe link: a certificate is something the person earned, sent once, and is not
 * marketing.
 */

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

export function renderCertificateEmail({ recipient, workshop, siteUrl }) {
  const name = firstName(recipient.full_name)
  const title = workshop.title
  const subject = `Your certificate — ${title}`
  const workshopsUrl = `${String(siteUrl).replace(/\/+$/, '')}/workshops`

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
        Congratulations, ${escapeHtml(name)}.
      </h1>
      <p style="color:${MUTED};font-size:15px;line-height:1.65;margin:12px 0 0;">
        Thank you for attending <strong style="color:${INK};">${escapeHtml(title)}</strong>.
        Your certificate is attached to this email as a PDF.
      </p>
      <p style="color:${MUTED};font-size:15px;line-height:1.65;margin:12px 0 0;">
        You can add it to LinkedIn under <em>Licenses &amp; certifications</em>.
      </p>
    </td></tr>

    <tr><td style="padding:24px 0 0;">
      <a href="${escapeHtml(workshopsUrl)}"
         style="display:inline-block;background:${BRAND};color:#ffffff;text-decoration:none;
                padding:12px 24px;border-radius:999px;font-weight:700;font-size:14px;">
        See upcoming workshops
      </a>
    </td></tr>

    <tr><td style="padding-top:32px;border-top:1px solid ${RULE};">
      <p style="color:${MUTED};font-size:12px;line-height:1.6;margin:16px 0 0;">
        You're receiving this because you attended a SkillSprint workshop.
        If your name is misspelled, reply to this email and we'll send a corrected copy.
      </p>
    </td></tr>

  </table>
</td></tr></table>
</body></html>`

  const text = [
    `Congratulations, ${name}.`,
    '',
    `Thank you for attending ${title}.`,
    'Your certificate is attached to this email as a PDF.',
    'You can add it to LinkedIn under Licenses & certifications.',
    '',
    `Upcoming workshops: ${workshopsUrl}`,
    '',
    '---',
    "You're receiving this because you attended a SkillSprint workshop.",
    "If your name is misspelled, reply to this email and we'll send a corrected copy.",
  ].join('\n')

  return { subject, html, text }
}
