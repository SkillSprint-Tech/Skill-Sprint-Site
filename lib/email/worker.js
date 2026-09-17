import { getPool, withTransaction } from '../db.js'
import { renderWelcomeSchedule } from './template.js'
import { renderWorkshopReminder } from './reminderTemplate.js'
import { sendWith } from './providers.js'
import { unsubscribeUrl } from './unsubscribeToken.js'
import {
  readUsage, pickProvider, incrementUsage, markExhausted,
  nextResetAt, configuredProviders,
} from './quota.js'

const BATCH_SIZE = Number(process.env.EMAIL_BATCH_SIZE || 30)
export const MAX_ATTEMPTS = 6
const STUCK_AFTER_MINUTES = 15
// Stop starting new jobs after this long. A single job can take ~30 s in the worst case (two
// providers each timing out at 15 s) and every caller runs inside a 60 s function, so a job
// started later than this risks being killed after the provider accepted it — which the
// stuck-job reclaim would then send a second time.
const DEFAULT_DEADLINE_MS = 25_000

const siteUrl = () => process.env.PUBLIC_SITE_URL || 'https://skill-sprint.pk'

/** Exponential backoff, capped so a job never parks for days. */
function backoffMinutes(attempts) {
  return Math.min(2 ** attempts, 240) // 2, 4, 8, 16, 32, 64 … max 4h
}

/** Release jobs abandoned mid-flight by a crashed or timed-out invocation. */
async function reclaimStuck(pool) {
  const { rowCount } = await pool.query(
    `UPDATE email_jobs
        SET status = 'pending', locked_at = NULL, locked_by = NULL, updated_at = now()
      WHERE status = 'processing'
        AND locked_at < now() - ($1 || ' minutes')::interval`,
    [String(STUCK_AFTER_MINUTES)]
  )
  return rowCount
}

/**
 * Atomically take ownership of up to `limit` due jobs.
 *
 * FOR UPDATE SKIP LOCKED is what makes concurrent runs safe: two workers racing on the
 * same rows each get a disjoint set instead of both sending the same email.
 */
async function claimBatch(pool, workerId, limit) {
  const { rows } = await pool.query(
    `UPDATE email_jobs
        SET status = 'processing', locked_at = now(), locked_by = $1, updated_at = now()
      WHERE id IN (
        SELECT id FROM email_jobs
         WHERE status IN ('pending', 'deferred')
           AND attempts < $3
           AND next_attempt_at <= now()
         ORDER BY created_at
         LIMIT $2
         FOR UPDATE SKIP LOCKED
      )
      RETURNING id, registration_id, certificate_recipient_id, template, attempts`,
    [workerId, limit, MAX_ATTEMPTS]
  )
  return rows
}

/** Hand claimed-but-unstarted jobs back to the queue. Not an attempt. */
async function releaseJobs(pool, ids, workerId) {
  if (!ids.length) return 0
  const { rowCount } = await pool.query(
    `UPDATE email_jobs
        SET status = 'pending', locked_at = NULL, locked_by = NULL, updated_at = now()
      WHERE id = ANY($1::uuid[]) AND status = 'processing' AND locked_by = $2`,
    [ids, workerId]
  )
  return rowCount
}

async function loadPublishedSchedule(pool) {
  const { rows } = await pool.query(
    `SELECT id, title, speaker, speaker_role, starts_at, duration_mins, location
       FROM workshops
      WHERE is_published = true
        AND status NOT IN ('completed', 'cancelled')
        AND starts_at > now()
      ORDER BY starts_at ASC`
  )
  return rows
}

/** Park a job until quota resets. Deliberately does NOT count as an attempt. */
async function deferJob(pool, jobId, reason) {
  await pool.query(
    `UPDATE email_jobs
        SET status = 'deferred', locked_at = NULL, locked_by = NULL,
            next_attempt_at = $2, last_error = $3, updated_at = now()
      WHERE id = $1`,
    [jobId, nextResetAt(), reason]
  )
}

/** Permanent failure that retrying cannot fix. */
async function failJob(pool, jobId, reason) {
  await pool.query(
    `UPDATE email_jobs SET status='failed', last_error=$2,
            locked_at=NULL, locked_by=NULL, updated_at=now() WHERE id=$1`,
    [jobId, String(reason).slice(0, 500)]
  )
}

/** An unexpected throw: count it as an attempt and try again later. */
async function requeueAfterCrash(pool, jobId, error) {
  await pool
    .query(
      `UPDATE email_jobs
          SET status='pending', attempts=attempts+1, last_error=$2,
              next_attempt_at = now() + interval '10 minutes',
              locked_at=NULL, locked_by=NULL, updated_at=now()
        WHERE id=$1`,
      [jobId, String(error?.message).slice(0, 500)]
    )
    .catch(() => {})
}

/** Welcome and reminder emails. Returns { message } or { error } (permanent). */
async function buildRegistrationMessage(pool, job, schedule) {
  const { rows } = await pool.query(
    `SELECT r.id, r.full_name, r.email, r.unsubscribed_at
       FROM registrations r
      WHERE r.id = $1`,
    [job.registration_id]
  )
  const registration = rows[0]

  // Never mail someone who opted out, even if a job was queued before they did.
  if (registration?.unsubscribed_at) return { error: 'Recipient unsubscribed' }
  if (!registration) return { error: 'Registration no longer exists' }

  let rendered
  // Reminder jobs carry their workshop in the template key: `reminder:<workshop_id>`.
  // That keeps UNIQUE (registration_id, template) meaningful per session, so each person
  // can get one reminder per workshop but never two for the same one.
  if (job.template.startsWith('reminder:')) {
    const workshopId = job.template.slice('reminder:'.length)
    const { rows: wRows } = await pool.query(
      `SELECT id, title, speaker, speaker_role, starts_at, duration_mins, location, meeting_link
         FROM workshops WHERE id = $1`,
      [workshopId]
    )
    if (!wRows[0]) return { error: 'Workshop no longer exists' }
    rendered = renderWorkshopReminder({ registration, workshop: wRows[0], siteUrl: siteUrl() })
  } else {
    rendered = renderWelcomeSchedule({
      registration,
      workshops: schedule,
      siteUrl: siteUrl(),
      whatsappUrl: process.env.WHATSAPP_GROUP_URL || '',
    })
  }

  return {
    message: {
      to: registration.email,
      toName: registration.full_name,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      headers: {
        // RFC 8058 one-click: the POST target lets Gmail/Outlook unsubscribe from the
        // inbox UI without the person opening anything.
        'List-Unsubscribe': `<${unsubscribeUrl(siteUrl(), registration.email)}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    },
  }
}

/**
 * Certificate emails. Template bytes are cached per workshop for the run. Unsubscribes are
 * not checked: a certificate is not marketing (see the certificates design spec).
 */
async function buildCertificateMessage(pool, job, cache) {
  const { rows } = await pool.query(
    `SELECT c.full_name, c.email, c.workshop_id, w.title
       FROM certificate_recipients c
       JOIN workshops w ON w.id = c.workshop_id
      WHERE c.id = $1`,
    [job.certificate_recipient_id]
  )
  const recipient = rows[0]
  if (!recipient) return { error: 'Certificate recipient no longer exists' }

  // Loaded lazily so registrations never pay for pdf-lib.
  const delivery = await import('../certificates/delivery.js')

  if (!cache.has(recipient.workshop_id)) {
    cache.set(recipient.workshop_id, await delivery.loadRenderable(recipient.workshop_id))
  }
  const renderable = cache.get(recipient.workshop_id)
  if (renderable.error) return { error: renderable.error }

  try {
    const message = await delivery.buildCertificateEmail({
      recipient,
      workshop: { title: recipient.title },
      renderable,
      siteUrl: siteUrl(),
    })
    return { message }
  } catch (error) {
    // A name the font cannot draw fails the same way on every retry.
    if (error?.expose) return { error: error.message }
    throw error
  }
}

/**
 * Process exactly one claimed job. Returns an outcome string for the caller's tally.
 * Every expected failure path writes a terminal or retryable state to the row.
 */
async function processJob(pool, job, schedule, usage, cache) {
  const built = job.template === 'certificate'
    ? await buildCertificateMessage(pool, job, cache)
    : await buildRegistrationMessage(pool, job, schedule)

  if (built.error) {
    await failJob(pool, job.id, built.error)
    return 'failed'
  }
  const { message } = built

  const tried = []
  // Try each provider with headroom, in priority order, before giving up for the day.
  for (;;) {
    const provider = pickProvider(usage, tried)
    if (!provider) {
      const configured = configuredProviders()
      const reason = configured.length
        ? 'Daily sending limit reached on all providers'
        : 'No email provider configured (set RESEND_API_KEY or BREVO_API_KEY)'
      await deferJob(pool, job.id, reason)
      return 'deferred'
    }

    const result = await sendWith(provider, message)

    if (result.outcome === 'sent') {
      // Ledger and job state move together — a crash between them would let us
      // over-send tomorrow or double-send today.
      await withTransaction(async (client) => {
        await client.query(
          `UPDATE email_jobs
              SET status='sent', provider=$2, provider_message_id=$3, sent_at=now(),
                  last_error=NULL, locked_at=NULL, locked_by=NULL, updated_at=now()
            WHERE id=$1`,
          [job.id, provider, result.messageId || '']
        )
        await incrementUsage(client, provider)
      })
      usage[provider].used += 1
      usage[provider].remaining = Math.max(0, usage[provider].remaining - 1)
      return 'sent'
    }

    if (result.outcome === 'quota') {
      // Trust the provider over our own counter and move to the next one.
      await withTransaction(async (client) => markExhausted(client, provider))
      usage[provider].remaining = 0
      tried.push(provider)
      continue
    }

    if (result.outcome === 'rejected') {
      await pool.query(
        `UPDATE email_jobs
            SET status='failed', provider=$2, last_error=$3, attempts=attempts+1,
                locked_at=NULL, locked_by=NULL, updated_at=now()
          WHERE id=$1`,
        [job.id, provider, String(result.error).slice(0, 500)]
      )
      return 'failed'
    }

    // transient
    const attempts = job.attempts + 1
    const terminal = attempts >= MAX_ATTEMPTS
    await pool.query(
      `UPDATE email_jobs
          SET status=$4, provider=$2, last_error=$3, attempts=$5,
              next_attempt_at = now() + ($6 || ' minutes')::interval,
              locked_at=NULL, locked_by=NULL, updated_at=now()
        WHERE id=$1`,
      [
        job.id, provider, String(result.error).slice(0, 500),
        terminal ? 'failed' : 'pending', attempts, String(backoffMinutes(attempts)),
      ]
    )
    return terminal ? 'failed' : 'retry'
  }
}

/**
 * Drain up to one batch of due email jobs.
 *
 * Always resolves — callers (cron endpoint, admin buttons, post-registration trigger) can
 * rely on getting a summary rather than having to catch.
 */
export async function runWorker({ limit = BATCH_SIZE, deadlineMs = DEFAULT_DEADLINE_MS } = {}) {
  const startedAt = Date.now()
  const pool = getPool()
  const workerId = `w_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
  const tally = { claimed: 0, sent: 0, deferred: 0, failed: 0, retry: 0, reclaimed: 0, released: 0 }

  try {
    tally.reclaimed = await reclaimStuck(pool)

    const jobs = await claimBatch(pool, workerId, limit)
    tally.claimed = jobs.length
    if (!jobs.length) return { ok: true, ...tally }

    const [schedule, usage] = await Promise.all([
      loadPublishedSchedule(pool),
      readUsage(pool),
    ])
    const cache = new Map()

    for (let i = 0; i < jobs.length; i++) {
      if (Date.now() - startedAt > deadlineMs) {
        tally.released = await releaseJobs(pool, jobs.slice(i).map((j) => j.id), workerId)
        break
      }

      const job = jobs[i]
      try {
        const outcome = await processJob(pool, job, schedule, usage, cache)
        tally[outcome] = (tally[outcome] || 0) + 1
      } catch (error) {
        // A job that blows up in an unexpected way must not strand itself in 'processing'
        // or take the rest of the batch down with it.
        console.error('email worker: job failed unexpectedly', job.id, error)
        await requeueAfterCrash(pool, job.id, error)
        tally.retry += 1
      }
    }

    return { ok: true, ...tally }
  } catch (error) {
    console.error('email worker error:', error)
    return { ok: false, error: error.message, ...tally }
  }
}

/**
 * Send a single job on demand (the admin panel's Send / Resend buttons).
 * Returns { ok, code, ... } — QUOTA_EXHAUSTED is a normal response, not an error.
 */
export async function sendOneJob(jobId) {
  const pool = getPool()

  const claimed = await pool.query(
    `UPDATE email_jobs
        SET status='processing', locked_at=now(), locked_by='admin', updated_at=now()
      WHERE id = (
        SELECT id FROM email_jobs
         WHERE id = $1 AND status <> 'processing'
         FOR UPDATE SKIP LOCKED
      )
      RETURNING id, registration_id, certificate_recipient_id, template, attempts`,
    [jobId]
  )

  if (!claimed.rows.length) {
    return { ok: false, code: 'BUSY', message: 'That email is already being sent.' }
  }

  const usage = await readUsage(pool)
  const schedule = await loadPublishedSchedule(pool)

  let outcome
  try {
    outcome = await processJob(pool, claimed.rows[0], schedule, usage, new Map())
  } catch (error) {
    console.error('email worker: single send failed unexpectedly', jobId, error)
    await requeueAfterCrash(pool, jobId, error)
    return { ok: false, code: 'SEND_FAILED', message: error.message || 'Could not send.' }
  }

  if (outcome === 'sent') {
    const { rows } = await pool.query('SELECT provider FROM email_jobs WHERE id=$1', [jobId])
    return { ok: true, code: 'SENT', provider: rows[0]?.provider || null }
  }

  if (outcome === 'deferred') {
    const { rows } = await pool.query('SELECT last_error FROM email_jobs WHERE id=$1', [jobId])
    return {
      ok: false,
      code: configuredProviders().length ? 'QUOTA_EXHAUSTED' : 'NO_PROVIDER',
      message: rows[0]?.last_error || 'Daily sending limit reached.',
      resets_at: nextResetAt().toISOString(),
      usage,
    }
  }

  const { rows } = await pool.query('SELECT last_error FROM email_jobs WHERE id=$1', [jobId])
  return {
    ok: false,
    code: outcome === 'failed' ? 'SEND_FAILED' : 'WILL_RETRY',
    message: rows[0]?.last_error || 'Could not send.',
  }
}
