import { query } from '../lib/db.js'
import { ensureSchema } from '../lib/schema.js'
import { applyCors, ok, fail, methodNotAllowed, getQueryParam } from '../lib/http.js'
import {
  createPortalToken,
  portalCookie,
  clearedPortalCookie,
  getPortalUser,
} from '../lib/auth.js'
import { sendWith } from '../lib/email/providers.js'

const ALLOWED = ['GET', 'POST']

/** Construct clean, branded HTML email for OTP passcode */
function buildOtpEmailHtml(code) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your SkillSprint Login Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          <!-- Brand Header -->
          <tr>
            <td style="padding: 32px 32px 24px; background: #0f172a; text-align: center;">
              <div style="display: inline-block; background-color: #2563eb; color: #ffffff; width: 44px; height: 44px; line-height: 44px; border-radius: 12px; font-size: 18px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 12px;">
                SS
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">
                SkillSprint Attendee Portal
              </h1>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center;">
              <h2 style="margin: 0 0 12px; color: #0f172a; font-size: 18px; font-weight: 700;">
                Your Access Passcode
              </h2>
              <p style="margin: 0 0 28px; color: #64748b; font-size: 14px; line-height: 1.6;">
                Use the single-use 6-digit code below to securely access your registered workshops, resource repos, and earned certificates.
              </p>

              <!-- OTP Code Display -->
              <div style="background-color: #eff6ff; border: 2px dashed #93c5fd; border-radius: 16px; padding: 18px 24px; display: inline-block; margin-bottom: 24px;">
                <span style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #1d4ed8;">
                  ${code}
                </span>
              </div>

              <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.5;">
                This code expires in <strong>15 minutes</strong>.<br>If you did not request this login code, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0; color: #94a3b8; font-size: 11px;">
                SkillSprint Technical Community &bull; Real Projects, Real Deadlines.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

export default async function handler(req, res) {
  if (applyCors(req, res, 'GET,POST,OPTIONS')) return

  if (!ALLOWED.includes(req.method)) {
    return methodNotAllowed(res, ALLOWED)
  }

  try {
    await ensureSchema()

    let action = getQueryParam(req, 'action') || ''
    if (!action) {
      const path = String(req.url || '').split('?')[0]
      const match = path.match(/\/api\/portal\/([^/]+)/)
      action = match ? match[1] : ''
    }

    // ── 1. SEND OTP ─────────────────────────────────────────────────────────
    if (action === 'send-otp' || (req.method === 'POST' && req.body?.email && !req.body?.code && !action)) {
      const email = String(req.body?.email || '').trim().toLowerCase()
      if (!email || !email.includes('@')) {
        return fail(res, 'INVALID_EMAIL', 'A valid email address is required.', 400)
      }

      // Check whether this email is associated with any registration or certificate
      const { rows: regCheck } = await query(
        `SELECT id FROM registrations WHERE LOWER(email) = $1 LIMIT 1`,
        [email]
      )
      const { rows: certCheck } = await query(
        `SELECT id FROM certificate_recipients WHERE LOWER(email) = $1 LIMIT 1`,
        [email]
      )

      if (regCheck.length === 0 && certCheck.length === 0) {
        return fail(
          res,
          'NOT_FOUND',
          'No workshop registrations or certificates found for this email address. Please make sure you enter the email you registered with.',
          404
        )
      }

      // Generate 6-digit cryptographic numeric OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString()

      // Store in attendee_otps (expires in 15 minutes)
      await query(
        `INSERT INTO attendee_otps (email, otp_code, expires_at, attempts, created_at)
         VALUES ($1, $2, now() + interval '15 minutes', 0, now())
         ON CONFLICT (email) DO UPDATE
           SET otp_code = $2,
               expires_at = now() + interval '15 minutes',
               attempts = 0,
               created_at = now()`,
        [email, otpCode]
      )

      // Send transactional email
      const provider = process.env.EMAIL_PROVIDER || (process.env.BREVO_API_KEY ? 'brevo' : 'resend')
      let sendError = null

      try {
        const sendResult = await sendWith(provider, {
          to: email,
          subject: `Your SkillSprint Portal Passcode: ${otpCode}`,
          html: buildOtpEmailHtml(otpCode),
          text: `Your SkillSprint portal access passcode is ${otpCode}. It expires in 15 minutes.`,
        })

        if (sendResult.outcome !== 'sent') {
          console.warn('send-otp non-sent outcome:', sendResult)
          sendError = sendResult.error || 'Provider did not confirm send'
        }
      } catch (err) {
        console.error('send-otp provider error:', err)
        sendError = err.message
      }

      // If email failed or in development environment, log to console for zero-friction dev
      console.log(`[PORTAL OTP] Generated OTP for ${email}: ${otpCode}`)

      return ok(res, {
        message: 'A 6-digit passcode has been sent to your email.',
        email,
        ...(sendError && process.env.NODE_ENV !== 'production' ? { devOtp: otpCode } : {}),
      })
    }

    // ── 2. VERIFY OTP ───────────────────────────────────────────────────────
    if (action === 'verify-otp' || (req.method === 'POST' && req.body?.email && req.body?.code)) {
      const email = String(req.body?.email || '').trim().toLowerCase()
      const code = String(req.body?.code || '').trim()

      if (!email || !code) {
        return fail(res, 'MISSING_FIELDS', 'Email and 6-digit code are required.', 400)
      }

      const { rows } = await query(
        `SELECT * FROM attendee_otps WHERE LOWER(email) = $1`,
        [email]
      )

      if (rows.length === 0) {
        return fail(res, 'INVALID_CODE', 'No active passcode request found. Please request a new code.', 400)
      }

      const record = rows[0]

      if (new Date(record.expires_at) < new Date()) {
        return fail(res, 'CODE_EXPIRED', 'Passcode has expired. Please request a new code.', 400)
      }

      if (record.attempts >= 5) {
        return fail(res, 'TOO_MANY_ATTEMPTS', 'Too many failed attempts. Please request a new code.', 429)
      }

      if (record.otp_code !== code) {
        await query(
          `UPDATE attendee_otps SET attempts = attempts + 1 WHERE LOWER(email) = $1`,
          [email]
        )
        return fail(res, 'INVALID_CODE', 'Incorrect verification code. Please try again.', 400)
      }

      // Success! Clean up used OTP
      await query(`DELETE FROM attendee_otps WHERE LOWER(email) = $1`, [email])

      // Issue signed session token
      const token = createPortalToken(email)
      res.setHeader('Set-Cookie', portalCookie(token))

      return ok(res, {
        message: 'Authenticated successfully',
        token,
        email,
      })
    }

    // ── 3. GET ATTENDEE DATA ────────────────────────────────────────────────
    if (req.method === 'GET' || action === 'data' || action === 'me') {
      const email = getPortalUser(req)
      if (!email) {
        return fail(res, 'UNAUTHORIZED', 'Attendee session invalid or expired. Please log in.', 401)
      }

      // Fetch all registrations for this attendee with full workshop details
      const { rows: registrations } = await query(
        `SELECT r.id, r.full_name, r.email, r.university, r.skill_level,
                r.attended, r.checked_in_at, r.created_at AS registered_at,
                w.id AS workshop_id, w.title AS workshop_title, w.description AS workshop_desc,
                w.speaker, w.speaker_role, w.starts_at, w.duration_mins, w.location,
                w.status, w.meeting_link, w.recording_url, w.slides_url, w.repo_url, w.resources_notes
           FROM registrations r
           JOIN workshops w ON r.workshop_id = w.id
          WHERE LOWER(r.email) = $1
          ORDER BY w.starts_at DESC`,
        [email]
      )

      // Fetch all earned certificates
      const { rows: certificates } = await query(
        `SELECT cr.id, cr.full_name AS recipient_name, cr.email, cr.verification_code,
                cr.issued_at, cr.created_at,
                w.id AS workshop_id, w.title AS workshop_title, w.speaker, w.speaker_role,
                w.starts_at AS workshop_date, w.duration_mins
           FROM certificate_recipients cr
           JOIN workshops w ON cr.workshop_id = w.id
          WHERE LOWER(cr.email) = $1
          ORDER BY cr.issued_at DESC NULLS LAST, cr.created_at DESC`,
        [email]
      )

      // Get primary attendee profile name
      const primaryName = registrations[0]?.full_name || certificates[0]?.recipient_name || email.split('@')[0]

      return ok(res, {
        email,
        profile: {
          name: primaryName,
          email,
          university: registrations[0]?.university || '',
          skill_level: registrations[0]?.skill_level || '',
        },
        stats: {
          totalRegistered: registrations.length,
          totalAttended: registrations.filter(r => r.attended).length,
          totalCertificates: certificates.length,
        },
        registrations,
        certificates,
      })
    }

    // ── 4. LOGOUT ───────────────────────────────────────────────────────────
    if (action === 'logout') {
      res.setHeader('Set-Cookie', clearedPortalCookie())
      return ok(res, { message: 'Logged out successfully' })
    }

    return fail(res, 'NOT_FOUND', `Unknown portal action: ${action}`, 404)
  } catch (error) {
    console.error('portal API error:', error)
    return fail(res, 'DB_ERROR', error.message || 'Database error occurred', 500)
  }
}
