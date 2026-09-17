import { query } from '../db.js'
import { normalizeName, normalizeEmail, isValidEmail } from './recipients.js'
import { MAX_ATTEMPTS } from '../email/worker.js'
import { UserFacingError } from '../errors.js'

const TEMPLATE = 'certificate'

export async function assertWorkshop(workshopId) {
  const { rowCount } = await query('SELECT 1 FROM workshops WHERE id = $1', [workshopId])
  if (!rowCount) throw new UserFacingError('That workshop no longer exists.', 'NOT_FOUND')
}

/** Per-workshop readiness and delivery counts for the tab overview. */
export async function workshopSummaries() {
  const { rows } = await query(
    `SELECT w.id, w.title, w.starts_at,
            (t.pdf IS NOT NULL) AS has_template,
            (t.font IS NOT NULL) AS has_font,
            (t.name_x IS NOT NULL AND t.name_y IS NOT NULL) AS placed,
            COALESCE(c.recipients, 0) AS recipients,
            COALESCE(j.queued, 0)     AS queued,
            COALESCE(j.sent, 0)       AS sent,
            COALESCE(j.delivered, 0)  AS delivered,
            COALESCE(j.waiting, 0)    AS waiting,
            COALESCE(j.failed, 0)     AS failed
       FROM workshops w
       LEFT JOIN certificate_templates t ON t.workshop_id = w.id
       LEFT JOIN (
         SELECT workshop_id, count(*)::int AS recipients
           FROM certificate_recipients GROUP BY workshop_id
       ) c ON c.workshop_id = w.id
       LEFT JOIN (
         SELECT cr.workshop_id,
                count(*)::int AS queued,
                count(*) FILTER (WHERE j.status IN ('sent', 'delivered'))::int AS sent,
                count(*) FILTER (WHERE j.status = 'delivered')::int AS delivered,
                count(*) FILTER (WHERE j.status IN ('pending', 'processing', 'deferred'))::int AS waiting,
                count(*) FILTER (WHERE j.status IN ('failed', 'bounced'))::int AS failed
           FROM email_jobs j
           JOIN certificate_recipients cr ON cr.id = j.certificate_recipient_id
          WHERE j.template = $1
          GROUP BY cr.workshop_id
       ) j ON j.workshop_id = w.id
      ORDER BY w.starts_at ASC`,
    [TEMPLATE]
  )
  return rows
}

export async function listRecipients(workshopId) {
  const { rows } = await query(
    `SELECT c.id, c.full_name, c.email, c.created_at,
            j.id AS job_id, j.status, j.provider, j.last_error, j.attempts,
            j.sent_at, j.delivered_at, j.next_attempt_at
       FROM certificate_recipients c
       LEFT JOIN email_jobs j
              ON j.certificate_recipient_id = c.id AND j.template = $2
      WHERE c.workshop_id = $1
      ORDER BY lower(c.full_name), c.email`,
    [workshopId, TEMPLATE]
  )
  return rows
}

export async function existingEmails(workshopId) {
  const { rows } = await query(
    'SELECT email FROM certificate_recipients WHERE workshop_id = $1',
    [workshopId]
  )
  return new Set(rows.map((r) => r.email))
}

/** Insert cleaned rows; people already on the list are left untouched. Returns the count added. */
export async function insertRecipients(workshopId, rows, source) {
  if (!rows.length) return 0
  const { rowCount } = await query(
    `INSERT INTO certificate_recipients (workshop_id, full_name, email, source)
     SELECT $1, t.full_name, t.email, $4
       FROM unnest($2::text[], $3::text[]) AS t(full_name, email)
     ON CONFLICT (workshop_id, email) DO NOTHING`,
    [workshopId, rows.map((r) => r.fullName), rows.map((r) => r.email), String(source || '').slice(0, 500)]
  )
  return rowCount
}

export async function updateRecipient(id, { fullName, email }) {
  const name = normalizeName(fullName)
  const mail = normalizeEmail(email)
  if (!name) throw new UserFacingError('The name cannot be empty.', 'BAD_NAME')
  if (!isValidEmail(mail)) throw new UserFacingError('That email address does not look right.', 'BAD_EMAIL')

  let rows
  try {
    ;({ rows } = await query(
      `UPDATE certificate_recipients
          SET full_name = $2, email = $3, updated_at = now()
        WHERE id = $1
        RETURNING id, full_name, email`,
      [id, name, mail]
    ))
  } catch (error) {
    if (error.code === '23505') {
      throw new UserFacingError('Someone with that email is already on this workshop list.', 'DUPLICATE')
    }
    throw error
  }
  if (!rows.length) throw new UserFacingError('That person is no longer on the list.', 'NOT_FOUND')
  return rows[0]
}

export async function deleteRecipient(id) {
  // email_jobs rows go with it (ON DELETE CASCADE).
  await query('DELETE FROM certificate_recipients WHERE id = $1', [id])
}

/** Queue a certificate for everyone on the list who does not have one yet. */
export async function queueAll(workshopId) {
  const { rowCount } = await query(
    `INSERT INTO email_jobs (certificate_recipient_id, template)
     SELECT c.id, $2 FROM certificate_recipients c WHERE c.workshop_id = $1
     ON CONFLICT (certificate_recipient_id, template)
       WHERE certificate_recipient_id IS NOT NULL
     DO NOTHING`,
    [workshopId, TEMPLATE]
  )
  return rowCount
}

/**
 * Make one person's certificate sendable again: create the job if it never existed,
 * otherwise reset it with a fresh retry budget. Returns the job id, or null while it is
 * mid-send.
 */
export async function prepareResend(recipientId) {
  try {
    const { rows } = await query(
      `INSERT INTO email_jobs (certificate_recipient_id, template)
       VALUES ($1, $2)
       ON CONFLICT (certificate_recipient_id, template)
         WHERE certificate_recipient_id IS NOT NULL
       DO UPDATE SET status = 'pending', attempts = 0, last_error = NULL,
                     next_attempt_at = now(), delivered_at = NULL, updated_at = now()
         WHERE email_jobs.status <> 'processing'
       RETURNING id`,
      [recipientId, TEMPLATE]
    )
    return rows[0]?.id || null
  } catch (error) {
    if (error.code === '23503') {
      throw new UserFacingError('That person is no longer on the list.', 'NOT_FOUND')
    }
    throw error
  }
}

/** Certificate jobs a worker run could pick up right now. */
export async function countDueCertificateJobs() {
  const { rows } = await query(
    `SELECT count(*)::int AS n
       FROM email_jobs
      WHERE certificate_recipient_id IS NOT NULL
        AND status IN ('pending', 'deferred')
        AND attempts < $1
        AND next_attempt_at <= now()`,
    [MAX_ATTEMPTS]
  )
  return rows[0].n
}
