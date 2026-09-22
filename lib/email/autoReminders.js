import { getPool } from '../db.js'

/**
 * Checks for upcoming workshops that require automated 24-hour or 1-hour reminders,
 * injects the jobs into email_jobs idempotently, and timestamps the workshop row.
 */
export async function enqueueAutomatedReminders() {
  const pool = getPool()

  // 1. Check for 24-hour reminders:
  // Starts between 23 and 25 hours from now, reminder_24h_sent_at IS NULL, is_published = true, meeting_link is set
  const { rows: due24h } = await pool.query(
    `SELECT id, title, meeting_link
       FROM workshops
      WHERE is_published = true
        AND status IN ('upcoming', 'live')
        AND starts_at BETWEEN now() + interval '23 hours' AND now() + interval '25 hours'
        AND reminder_24h_sent_at IS NULL
        AND meeting_link != ''`
  )

  // 2. Check for 1-hour reminders:
  // Starts between 45 and 75 minutes from now, reminder_1h_sent_at IS NULL, is_published = true, meeting_link is set
  const { rows: due1h } = await pool.query(
    `SELECT id, title, meeting_link
       FROM workshops
      WHERE is_published = true
        AND status IN ('upcoming', 'live')
        AND starts_at BETWEEN now() + interval '45 minutes' AND now() + interval '75 minutes'
        AND reminder_1h_sent_at IS NULL
        AND meeting_link != ''`
  )

  let enqueuedCount = 0

  for (const w of due24h) {
    const { rowCount } = await pool.query(
      `INSERT INTO email_jobs (registration_id, template, status, next_attempt_at)
       SELECT r.id, $1, 'pending', now()
         FROM registrations r
        WHERE r.unsubscribed_at IS NULL
       ON CONFLICT (registration_id, template) DO NOTHING`,
      [`reminder_24h:${w.id}`]
    )
    enqueuedCount += rowCount
    await pool.query('UPDATE workshops SET reminder_24h_sent_at = now() WHERE id = $1', [w.id])
  }

  for (const w of due1h) {
    const { rowCount } = await pool.query(
      `INSERT INTO email_jobs (registration_id, template, status, next_attempt_at)
       SELECT r.id, $1, 'pending', now()
         FROM registrations r
        WHERE r.unsubscribed_at IS NULL
       ON CONFLICT (registration_id, template) DO NOTHING`,
      [`reminder_1h:${w.id}`]
    )
    enqueuedCount += rowCount
    await pool.query('UPDATE workshops SET reminder_1h_sent_at = now() WHERE id = $1', [w.id])
  }

  return { enqueuedCount, workshops24h: due24h.length, workshops1h: due1h.length }
}
