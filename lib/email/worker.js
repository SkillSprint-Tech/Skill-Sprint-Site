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

/**
 * How many sends are in flight at once.
 *
 * Sending one at a time meant a batch of 50 took as long as 50 provider round trips —
 * past the 60s serverless ceiling, so the request 504'd and whatever was mid-flight was
 * killed and stranded in 'processing'. Both providers are happy with a handful of
 * concurrent requests; this turns ~50s of waiting into ~8s.
 */
const SEND_CONCURRENCY = Math.max(1, Number(process.env.EMAIL_SEND_CONCURRENCY || 6))

/**
 * Stop starting new work this far into the invocation.
 *
 * The platform kills the function at 60s with no chance to clean up. Finishing early and
 * handing the rest back is the difference between "carry on next call" and a pile of
 * abandoned locks needing manual release.
 */
const TIME_BUDGET_MS = Number(process.env.EMAIL_TIME_BUDGET_MS || 40_000)

/**
 * How long a 'processing' lock may be held before we assume the invocation that took it
 * is gone. Exported because the admin panel has to draw the same line: a job locked for
 * less than this is genuinely in flight, one locked for longer is abandoned and needs
 * releasing. Two different thresholds would let a job look stuck in the UI while the
 * worker still refuses to reclaim it.
 */
export const STUCK_AFTER_MINUTES = 15

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
async function buildRegistrationMessage(pool, job, schedule, sessionNumbers) {
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

  const siteUrl = process.env.PUBLIC_SITE_URL || 'https://skill-sprint.pk'
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
    const workshop = wRows[0]
    if (!workshop) return { error: 'Workshop no longer exists' }

    if (!sessionNumbers.has(workshop.id)) {
      sessionNumbers.set(workshop.id, await workshopSessionNumber(pool, workshop))
    }

    rendered = renderWorkshopReminder({
      registration,
      workshop,
      siteUrl,
      sessionNumber: sessionNumbers.get(workshop.id),
    })
  } else {
    rendered = renderWelcomeSchedule({
      registration,
      workshops: schedule,
      siteUrl,
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
        'List-Unsubscribe': `<${unsubscribeUrl(siteUrl, registration.email)}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    },
  }
}

/**
 * Certificate emails. Template bytes are loaded once per workshop per run — the cache holds
 * the promise, so concurrent lanes share one load. Unsubscribes are not checked: a
 * certificate is not marketing (see the certificates design spec).
 */
async function buildCertificateMessage(pool, job, certificates) {
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

  if (!certificates.has(recipient.workshop_id)) {
    certificates.set(recipient.workshop_id, delivery.loadRenderable(recipient.workshop_id))
  }
  const renderable = await certificates.get(recipient.workshop_id)
  if (renderable.error) return { error: renderable.error }

  const siteUrl = process.env.PUBLIC_SITE_URL || 'https://skill-sprint.pk'
  try {
    const message = await delivery.buildCertificateEmail({
      recipient,
      workshop: { title: recipient.title },
      renderable,
      siteUrl,
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
async function processJob(pool, job, schedule, usage, sessionNumbers = new Map(), certificates = new Map()) {
  const built = job.template === 'certificate'
    ? await buildCertificateMessage(pool, job, certificates)
    : await buildRegistrationMessage(pool, job, schedule, sessionNumbers)

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
 * Always resolves — callers (cron endpoint, admin button, post-registration trigger) can
 * rely on getting a summary rather than having to catch.
 */
export async function runWorker({ limit = BATCH_SIZE, timeBudgetMs = TIME_BUDGET_MS } = {}) {
  const pool = getPool()
  const deadline = Date.now() + timeBudgetMs
  const workerId = `w_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
  const tally = {
    claimed: 0, sent: 0, deferred: 0, failed: 0, retry: 0, reclaimed: 0,
    // Claimed but handed back untouched because the clock ran out. Not an error — the
    // next call picks them straight up.
    returned: 0,
  }

  try {
    tally.reclaimed = await reclaimStuck(pool)

    const jobs = await claimBatch(pool, workerId, limit)
    tally.claimed = jobs.length
    if (!jobs.length) return { ok: true, ...tally, remaining: await countClaimable(pool) }

    const [schedule, usage] = await Promise.all([
      loadPublishedSchedule(pool),
      readUsage(pool),
    ])

    // Session numbers are per workshop, not per recipient. Resolving one per job meant
    // 134 identical COUNT queries for a single resend.
    const sessionNumbers = new Map()
    // Certificate template bytes, per workshop, shared by every lane.
    const certificates = new Map()

    let next = 0
    const unprocessed = []

    const lane = async () => {
      for (;;) {
        if (next >= jobs.length) return
        if (Date.now() >= deadline) {
          // Give back everything nobody has started, so it is not left locked.
          while (next < jobs.length) unprocessed.push(jobs[next++])
          return
        }

        const job = jobs[next++]
        try {
          const outcome = await processJob(pool, job, schedule, usage, sessionNumbers, certificates)
          tally[outcome] = (tally[outcome] || 0) + 1
        } catch (error) {
          // A job that blows up in an unexpected way must not strand itself in
          // 'processing' or take the rest of the batch down with it.
          console.error('email worker: job failed unexpectedly', job.id, error)
          await pool
            .query(
              `UPDATE email_jobs
                  SET status='pending', attempts=attempts+1, last_error=$2,
                      next_attempt_at = now() + interval '10 minutes',
                      locked_at=NULL, locked_by=NULL, updated_at=now()
                WHERE id=$1`,
              [job.id, String(error.message).slice(0, 500)]
            )
            .catch(() => {})
          tally.retry += 1
        }
      }
    }

    await Promise.all(Array.from({ length: Math.min(SEND_CONCURRENCY, jobs.length) }, lane))

    if (unprocessed.length) {
      tally.returned = unprocessed.length
      await pool
        .query(
          `UPDATE email_jobs
              SET status='pending', locked_at=NULL, locked_by=NULL, updated_at=now()
            WHERE id = ANY($1::uuid[])`,
          [unprocessed.map((j) => j.id)]
        )
        .catch((error) => console.error('email worker: could not release unprocessed jobs', error))
    }

    return { ok: true, ...tally, remaining: await countClaimable(pool) }
  } catch (error) {
    console.error('email worker error:', error)
    return { ok: false, error: error.message, ...tally }
  }
}

/** Jobs still waiting to be sent, so a caller knows whether to come back for more. */
async function countClaimable(pool) {
  const { rows } = await pool.query(
    `SELECT count(*)::int AS n
       FROM email_jobs
      WHERE status IN ('pending', 'deferred')
        AND attempts < $1`,
    [MAX_ATTEMPTS]
  )
  return rows[0]?.n ?? 0
}

/**
 * Render the real reminder template and send it to one address, bypassing the queue.
 *
 * Deliberately writes nothing to email_jobs: a test must not create a row that later
 * makes an attendee look already-mailed, and it must be repeatable without tripping the
 * UNIQUE (registration_id, template) guard. It does count against the daily quota,
 * because it is a real send through a real provider.
 */
export async function sendTestReminder({ workshop, to }) {
  const pool = getPool()
  const usage = await readUsage(pool)
  const siteUrl = process.env.PUBLIC_SITE_URL || 'https://www.skillsprint.pk'

  const sessionNumber = await workshopSessionNumber(pool, workshop)

  const { subject, html, text } = renderWorkshopReminder({
    // A stand-in recipient. The unsubscribe link is generated for the test address, so
    // clicking it in a test opts out only that address.
    registration: { full_name: 'Test Recipient', email: to },
    workshop,
    siteUrl,
    sessionNumber,
  })

  const tried = []
  for (;;) {
    const provider = pickProvider(usage, tried)
    if (!provider) {
      return {
        outcome: configuredProviders().length ? 'quota' : 'failed',
        error: configuredProviders().length
          ? 'Daily sending limit reached on all providers.'
          : 'No email provider configured (set RESEND_API_KEY or BREVO_API_KEY).',
      }
    }

    const result = await sendWith(provider, {
      to,
      toName: 'Test Recipient',
      subject: `[TEST] ${subject}`,
      html,
      text,
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl(siteUrl, to)}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    })

    if (result.outcome === 'sent') {
      await withTransaction(async (client) => incrementUsage(client, provider))
      return { outcome: 'sent', provider, subject }
    }
    if (result.outcome === 'quota') {
      await withTransaction(async (client) => markExhausted(client, provider))
      usage[provider].remaining = 0
      tried.push(provider)
      continue
    }
    return { outcome: 'failed', error: result.error, provider }
  }
}

/**
 * 1-based position of a workshop within the published series, so the email can say
 * "Workshop #2" without anyone maintaining a counter by hand.
 */
async function workshopSessionNumber(pool, workshop) {
  const { rows } = await pool.query(
    `SELECT count(*)::int AS n
       FROM workshops
      WHERE is_published = true
        AND status <> 'cancelled'
        AND starts_at <= $1`,
    [workshop.starts_at]
  )
  return rows[0]?.n || null
}

/**
 * Send a single job on demand (the admin panel's Send button).
 * Returns { ok, code, ... } — QUOTA_EXHAUSTED is a normal response, not an error.
 */
export async function sendOneJob(jobId) {
  const pool = getPool()

  // Take the job unless it is genuinely in flight. A lock older than STUCK_AFTER_MINUTES
  // belongs to an invocation that died (on Vercel, a function frozen right after it
  // returned its response), so refusing it would strand the row forever — the operator
  // would press Send and be told "already sending" by a worker that no longer exists.
  const claimed = await pool.query(
    `UPDATE email_jobs
        SET status='processing', locked_at=now(), locked_by='admin', updated_at=now()
      WHERE id = (
        SELECT id FROM email_jobs
         WHERE id = $1
           AND (status <> 'processing'
                OR locked_at IS NULL
                OR locked_at < now() - ($2 || ' minutes')::interval)
         FOR UPDATE SKIP LOCKED
      )
      RETURNING id, registration_id, certificate_recipient_id, template, attempts`,
    [jobId, String(STUCK_AFTER_MINUTES)]
  )

  if (!claimed.rows.length) {
    return {
      ok: false,
      code: 'BUSY',
      message: `That email is being sent right now. If it is still stuck in ${STUCK_AFTER_MINUTES} minutes, try again.`,
    }
  }

  const usage = await readUsage(pool)
  const schedule = await loadPublishedSchedule(pool)

  let outcome
  try {
    outcome = await processJob(pool, claimed.rows[0], schedule, usage)
  } catch (error) {
    // Without this, a throw while building the message left the row locked in
    // 'processing' until the stuck-lock timeout.
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
