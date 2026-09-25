import { getPool } from '../db.js'
import { ensureSchema } from '../schema.js'
import { applyCors, ok, fail, methodNotAllowed } from '../http.js'
import { requireAdmin } from '../auth.js'
import { sendOneJob, runWorker } from '../email/worker.js'
import { readUsage, nextResetAt } from '../email/quota.js'
import { WELCOME_TEMPLATE } from './registrations.js'
import { renderWelcomeSchedule } from '../email/template.js'
import { renderWorkshopReminder } from '../email/reminderTemplate.js'
import { sendWith } from '../email/providers.js'

/**
 * POST { jobId }            → send that one email now
 * POST { registrationId }   → same, resolved via the registration
 * POST { all: true }        → drain a batch of everything outstanding
 * POST { retryFailed: true} → put failed jobs back in the queue, then drain
 * POST { preview: true }    → return rendered HTML & subject for template
 * POST { testEmail, ... }   → send live test preview to specified inbox
 */
export default async function handler(req, res) {
  if (applyCors(req, res, 'POST,OPTIONS')) return
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])
  if (requireAdmin(req, res)) return

  try {
    await ensureSchema()
    const pool = getPool()
    const body = req.body || {}

    // ── Preview or Test Send ──────────────────────────────────────────────
    if (body.preview === true || body.testEmail) {
      const template = String(body.template || WELCOME_TEMPLATE)
      const siteUrl = process.env.PUBLIC_SITE_URL || 'https://skill-sprint.pk'
      const whatsappUrl = process.env.WHATSAPP_GROUP_URL || ''

      const sampleReg = {
        full_name: 'Jane Doe',
        email: body.testEmail || 'student@university.edu.pk',
        university: 'NUST Islamabad',
      }

      let emailContent
      if (template.startsWith('reminder:')) {
        const workshopId = template.replace('reminder:', '')
        const { rows: wRows } = await pool.query('SELECT * FROM workshops WHERE id = $1', [workshopId])
        const workshop = wRows[0] || {
          title: 'Fullstack Systems with Vue & Node',
          starts_at: new Date(Date.now() + 86400000).toISOString(),
          duration_mins: 90,
          location: 'Online',
          meeting_link: 'https://meet.google.com/abc-defg-hij',
        }
        emailContent = renderWorkshopReminder({ registration: sampleReg, workshop, siteUrl })
      } else {
        const { rows: workshops } = await pool.query(
          'SELECT title, speaker, starts_at, duration_mins, location FROM workshops WHERE is_published = true ORDER BY starts_at ASC LIMIT 5'
        )
        emailContent = renderWelcomeSchedule({
          registration: sampleReg,
          workshops,
          siteUrl,
          whatsappUrl,
        })
      }

      if (body.testEmail) {
        const provider = process.env.EMAIL_PROVIDER || (process.env.BREVO_API_KEY ? 'brevo' : 'resend')
        const result = await sendWith(provider, {
          to: body.testEmail,
          subject: `[TEST PREVIEW] ${emailContent.subject}`,
          html: emailContent.html,
          text: emailContent.text,
        })
        return ok(res, {
          testSent: true,
          provider,
          outcome: result.outcome,
          to: body.testEmail,
          subject: emailContent.subject,
        })
      }

      return ok(res, {
        preview: true,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      })
    }

    // ── Bulk ──────────────────────────────────────────────────────────────
    if (body.all === true || body.retryFailed === true) {
      // A misconfigured sender (wrong FROM domain, revoked key) fails every job it
      // touches and burns an attempt each time. Once a job passes MAX_ATTEMPTS the
      // worker stops claiming it, so fixing the config is not enough on its own — the
      // jobs have to be put back in the queue. Resetting attempts is what does that.
      let requeued = 0
      if (body.retryFailed === true) {
        const reset = await pool.query(
          `UPDATE email_jobs
              SET status = 'pending', attempts = 0, next_attempt_at = now(),
                  locked_at = NULL, locked_by = NULL, updated_at = now()
            WHERE status IN ('failed', 'deferred')
              AND last_error IS DISTINCT FROM 'Recipient unsubscribed'
            RETURNING id`
        )
        requeued = reset.rowCount
      }

      const summary = await runWorker({ limit: 50 })
      const usage = await readUsage(pool)

      if (summary.sent === 0 && summary.deferred > 0) {
        return ok(res, {
          ok: false,
          code: 'QUOTA_EXHAUSTED',
          message: 'Daily sending limit reached. Queued emails will send automatically after reset.',
          resets_at: nextResetAt().toISOString(),
          requeued,
          usage,
          summary,
        })
      }
      return ok(res, { summary, usage, requeued })
    }

    // ── Single ────────────────────────────────────────────────────────────
    let jobId = body.jobId

    if (!jobId && body.registrationId) {
      // Which email to send. The panel can now be looking at a workshop's meeting link
      // rather than the welcome email, and resolving by registration alone would silently
      // send the wrong one — a second welcome email to someone who wanted a join link.
      const template = String(body.template || WELCOME_TEMPLATE)
      if (template !== WELCOME_TEMPLATE && !template.startsWith('reminder:')) {
        return fail(res, 'INVALID_TEMPLATE', `Unknown email template: ${template}`)
      }

      const { rows } = await pool.query(
        `SELECT id FROM email_jobs
          WHERE registration_id = $1 AND template = $2`,
        [body.registrationId, template]
      )
      if (!rows.length) {
        // No job yet: either a registration predating the queue, or someone who signed up
        // after this workshop's link went out. Queue it rather than reporting "not found".
        const created = await pool.query(
          `INSERT INTO email_jobs (registration_id, template)
           VALUES ($1, $2)
           ON CONFLICT (registration_id, template) DO NOTHING
           RETURNING id`,
          [body.registrationId, template]
        )
        jobId = created.rows[0]?.id
      } else {
        jobId = rows[0].id
      }
    }

    if (!jobId) return fail(res, 'MISSING_ID', 'A jobId or registrationId is required.')

    const result = await sendOneJob(jobId)

    // Deliberately 200 even when ok:false — this is a normal operational state, and a
    // non-2xx would make the frontend treat a full quota as a broken request.
    return ok(res, result)
  } catch (error) {
    console.error('admin/send-email error:', error)
    return fail(res, 'SERVER_ERROR', error.message || 'Could not send.', 500)
  }
}

export const config = { maxDuration: 60 }
