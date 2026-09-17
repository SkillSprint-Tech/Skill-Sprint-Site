import crypto from 'node:crypto'
import { withTransaction, query } from '../lib/db.js'
import { ensureSchema } from '../lib/schema.js'
import { applyCors, ok, fail, methodNotAllowed, clientIp } from '../lib/http.js'
import { runWorker } from '../lib/email/worker.js'

// Deliberately permissive but structurally strict — matches the context.md rule of a
// single @, a dotted domain, and no whitespace. Over-clever regexes reject valid addresses.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Every field on the form is required, so the server enforces the same rule the page
// does. A phone number is checked on digit count only — Pakistani mobiles, landlines and
// international formats vary far too much for a pattern that would not reject real people.
const MIN_PHONE_DIGITS = 10
const MAX_PHONE_DIGITS = 15

// Generous enough for a lab full of students sharing one campus NAT, tight enough that a
// script cannot drain a 400/day email quota unattended.
const RATE_WINDOW_MINUTES = 60
const RATE_MAX_PER_WINDOW = 15

const MAX_LENGTHS = {
  full_name: 120,
  email: 254,
  phone: 40,
  university: 160,
  year_of_study: 40,
  skill_level: 40,
  source: 120,
}

function clean(value, field) {
  const text = String(value ?? '').trim()
  return text.slice(0, MAX_LENGTHS[field] ?? 200)
}

function hashIp(ip) {
  // Salted with a server secret so the stored value cannot be reversed by rainbow table.
  const salt = process.env.ADMIN_SESSION_SECRET || 'skillsprint'
  return crypto.createHmac('sha256', salt).update(ip).digest('hex').slice(0, 32)
}

export default async function handler(req, res) {
  if (applyCors(req, res, 'POST,OPTIONS')) return
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])

  try {
    await ensureSchema()

    const body = req.body || {}

    // Honeypot: a field hidden from real users. Anything filling it is a bot.
    // Respond with success so the bot has no signal that it was caught.
    if (String(body.website ?? '').trim()) {
      console.warn('register: honeypot triggered')
      return ok(res, { registered: true, queued: false })
    }

    const full_name = clean(body.full_name ?? body.name, 'full_name')
    const email = clean(body.email, 'email').toLowerCase()

    const phone = clean(body.phone, 'phone')
    const university = clean(body.university, 'university')
    const year_of_study = clean(body.year_of_study, 'year_of_study')
    const skill_level = clean(body.skill_level, 'skill_level')

    const interests = Array.isArray(body.interests)
      ? body.interests.map((i) => String(i).trim()).filter(Boolean).slice(0, 20)
      : []

    if (full_name.length < 2) {
      return fail(res, 'INVALID_NAME', 'Please enter your full name.')
    }
    if (!EMAIL_RE.test(email)) {
      return fail(res, 'INVALID_EMAIL', 'Please enter a valid email address.')
    }
    if (university.length < 2) {
      return fail(res, 'INVALID_UNIVERSITY', 'Please tell us where you study or work.')
    }

    const phoneDigits = phone.replace(/\D/g, '')
    if (phoneDigits.length < MIN_PHONE_DIGITS || phoneDigits.length > MAX_PHONE_DIGITS) {
      return fail(res, 'INVALID_PHONE', 'Please enter a valid phone number.')
    }
    if (!year_of_study) {
      return fail(res, 'INVALID_YEAR', 'Please select your year of study.')
    }
    if (!skill_level) {
      return fail(res, 'INVALID_SKILL_LEVEL', 'Please select your experience level.')
    }
    if (!interests.length) {
      return fail(res, 'INVALID_INTERESTS', 'Please pick at least one topic you are interested in.')
    }
    if (body.consent === false) {
      return fail(res, 'CONSENT_REQUIRED', 'We need your consent to email you the schedule.')
    }

    // Per-IP throttle. The honeypot stops naive bots; this stops a deliberate script
    // from queueing thousands of registrations and draining the daily email quota.
    // Counted against distinct registrations, so resubmitting the same address (which
    // upserts and queues nothing new) never locks someone out.
    const ipHash = hashIp(clientIp(req))
    const { rows: recent } = await query(
      `SELECT count(*)::int AS count
         FROM registrations
        WHERE ip_hash = $1
          AND created_at > now() - ($2 || ' minutes')::interval`,
      [ipHash, String(RATE_WINDOW_MINUTES)]
    )
    if ((recent[0]?.count ?? 0) >= RATE_MAX_PER_WINDOW) {
      return fail(
        res,
        'RATE_LIMITED',
        "That's a lot of signups from one place. Please try again in a little while.",
        429
      )
    }

    const record = {
      full_name,
      email,
      phone,
      university,
      year_of_study,
      skill_level,
      interests,
      source: clean(body.source, 'source'),
      ip_hash: ipHash,
    }

    // Registration and its email job are written together: a registration that exists
    // without a queued email would silently never get one.
    const result = await withTransaction(async (client) => {
      const inserted = await client.query(
        `INSERT INTO registrations
           (full_name, email, phone, university, year_of_study, skill_level,
            interests, consent, source, ip_hash)
         VALUES ($1,$2,$3,$4,$5,$6,$7,true,$8,$9)
         ON CONFLICT (email) DO UPDATE SET
           full_name     = EXCLUDED.full_name,
           phone         = COALESCE(NULLIF(EXCLUDED.phone, ''), registrations.phone),
           university    = COALESCE(NULLIF(EXCLUDED.university, ''), registrations.university),
           year_of_study = COALESCE(NULLIF(EXCLUDED.year_of_study, ''), registrations.year_of_study),
           skill_level   = COALESCE(NULLIF(EXCLUDED.skill_level, ''), registrations.skill_level),
           interests     = EXCLUDED.interests
         RETURNING id, full_name, email, (xmax = 0) AS is_new`,
        [
          record.full_name, record.email, record.phone, record.university,
          record.year_of_study, record.skill_level, record.interests,
          record.source, record.ip_hash,
        ]
      )

      const registration = inserted.rows[0]

      // UNIQUE (registration_id, template) makes this a no-op on repeat submissions,
      // so nobody can be queued the same email twice by resubmitting the form.
      const job = await client.query(
        `INSERT INTO email_jobs (registration_id, template)
         VALUES ($1, 'welcome_schedule')
         ON CONFLICT (registration_id, template) DO NOTHING
         RETURNING id`,
        [registration.id]
      )

      return { registration, queuedNow: job.rowCount > 0 }
    })

    // Send immediately rather than waiting for the next cron tick. Deliberately not
    // awaited on the critical path — a slow provider must never delay the user's
    // confirmation, and the queue guarantees delivery either way.
    if (result.queuedNow) {
      runWorker({ limit: 5 }).catch((error) => {
        console.error('register: inline worker failed (job stays queued)', error)
      })
    }

    return ok(
      res,
      {
        registered: true,
        alreadyRegistered: !result.registration.is_new,
        queued: result.queuedNow,
        name: result.registration.full_name,
      },
      result.registration.is_new ? 201 : 200
    )
  } catch (error) {
    console.error('register API error:', error)
    return fail(res, 'SERVER_ERROR', 'Could not complete your registration.', 500)
  }
}
