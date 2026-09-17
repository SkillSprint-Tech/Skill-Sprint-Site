import { test, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { sendWith } from '../../lib/email/providers.js'

const realFetch = globalThis.fetch
afterEach(() => { globalThis.fetch = realFetch })

function captureFetch() {
  const calls = []
  globalThis.fetch = async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body) })
    return new Response(JSON.stringify({ id: 'r_1', messageId: 'b_1' }), { status: 201 })
  }
  return calls
}

const attachments = [{ filename: 'cert.pdf', content: 'JVBERi0=' }]
const message = { to: 'x@example.com', toName: 'X', subject: 's', html: 'h', text: 't' }

process.env.RESEND_API_KEY = 'test'
process.env.RESEND_FROM = 'SkillSprint <from@skillsprint.test>'
process.env.BREVO_API_KEY = 'test'
process.env.BREVO_FROM = 'from@skillsprint.test'

test('Resend receives attachments as filename/content', async () => {
  const calls = captureFetch()
  const result = await sendWith('resend', { ...message, attachments })
  assert.equal(result.outcome, 'sent')
  assert.deepEqual(calls[0].body.attachments, [{ filename: 'cert.pdf', content: 'JVBERi0=' }])
})

test('Brevo receives attachments as name/content', async () => {
  const calls = captureFetch()
  const result = await sendWith('brevo', { ...message, attachments })
  assert.equal(result.outcome, 'sent')
  assert.deepEqual(calls[0].body.attachment, [{ name: 'cert.pdf', content: 'JVBERi0=' }])
})

test('no attachment field is sent when there are none', async () => {
  const calls = captureFetch()
  await sendWith('resend', message)
  await sendWith('brevo', message)
  assert.equal('attachments' in calls[0].body, false)
  assert.equal('attachment' in calls[1].body, false)
})
