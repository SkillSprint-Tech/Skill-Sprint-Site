// Exercises the certificate storage layer against the real database WITHOUT sending email.
// Creates one throwaway, unpublished workshop and deletes it (cascading to everything under
// it) at the end. Jobs it queues are parked a day in the future so no worker can claim them.
//
// Usage: node --env-file=.env scripts/certificates-smoke.mjs
import assert from 'node:assert/strict'
import { query, getPool } from '../lib/db.js'
import { ensureSchema } from '../lib/schema.js'
import {
  workshopSummaries, listRecipients, existingEmails, insertRecipients, updateRecipient,
  queueAll, prepareResend, countDueCertificateJobs, deleteRecipient,
} from '../lib/certificates/store.js'
import { getTemplateMeta, templateReadiness, loadRenderable } from '../lib/certificates/templates.js'

const park = (workshopId) =>
  query(
    `UPDATE email_jobs SET next_attempt_at = now() + interval '1 day'
      WHERE certificate_recipient_id IN
            (SELECT id FROM certificate_recipients WHERE workshop_id = $1)`,
    [workshopId]
  )

await ensureSchema()
console.log('schema ok')

const { rows: [workshop] } = await query(
  `INSERT INTO workshops (title, starts_at, is_published, status)
   VALUES ('ZZ certificates smoke test — safe to delete', now() - interval '1 day', false, 'completed')
   RETURNING id`
)

try {
  const people = [
    { fullName: 'Smoke One', email: 'smoke1@example.com' },
    { fullName: 'Smoke Two', email: 'smoke2@example.com' },
  ]
  assert.equal(await insertRecipients(workshop.id, people, 'smoke'), 2)
  assert.equal(
    await insertRecipients(workshop.id, [{ fullName: 'Again', email: 'smoke1@example.com' }], 'smoke'),
    0,
    're-import must not duplicate'
  )
  assert.deepEqual([...(await existingEmails(workshop.id))].sort(), ['smoke1@example.com', 'smoke2@example.com'])

  assert.equal(await queueAll(workshop.id), 2)
  await park(workshop.id)
  assert.equal(await queueAll(workshop.id), 0, 'queueing twice must not duplicate jobs')

  const list = await listRecipients(workshop.id)
  assert.equal(list.length, 2)
  assert.ok(list.every((r) => r.status === 'pending'))

  const renamed = await updateRecipient(list[0].id, { fullName: '  Smoke   Uno ', email: 'SMOKE1@example.com' })
  assert.equal(renamed.full_name, 'Smoke Uno')
  await assert.rejects(
    updateRecipient(list[0].id, { fullName: 'X', email: 'smoke2@example.com' }),
    { code: 'DUPLICATE' }
  )

  await query(
    `UPDATE email_jobs SET status = 'failed', attempts = 3 WHERE certificate_recipient_id = $1`,
    [list[0].id]
  )
  const jobId = await prepareResend(list[0].id)
  await park(workshop.id)
  const { rows: [job] } = await query('SELECT status, attempts FROM email_jobs WHERE id = $1', [jobId])
  assert.deepEqual(job, { status: 'pending', attempts: 0 })

  await assert.rejects(
    query(`INSERT INTO email_jobs (template) VALUES ('certificate')`),
    /email_jobs_one_recipient/
  )

  const summary = (await workshopSummaries()).find((s) => s.id === workshop.id)
  assert.equal(summary.recipients, 2)
  assert.equal(summary.queued, 2)
  assert.equal(summary.waiting, 2)
  assert.equal(templateReadiness(await getTemplateMeta(workshop.id)).template, false)
  assert.ok((await loadRenderable(workshop.id)).error)
  assert.equal(typeof (await countDueCertificateJobs()), 'number')

  await deleteRecipient(list[1].id)
  assert.equal((await listRecipients(workshop.id)).length, 1)

  console.log('certificate storage smoke test passed')
} finally {
  await query('DELETE FROM workshops WHERE id = $1', [workshop.id])
  const { rows } = await query(
    'SELECT count(*)::int AS n FROM certificate_recipients WHERE workshop_id = $1',
    [workshop.id]
  )
  console.log(rows[0].n === 0 ? 'cleaned up' : `WARNING: ${rows[0].n} recipients left behind`)
  await getPool().end()
}
