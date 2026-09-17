import { test } from 'node:test'
import assert from 'node:assert/strict'
import { renderCertificateEmail } from '../../lib/email/certificateTemplate.js'

test('names the workshop, escapes HTML and has no unsubscribe link', () => {
  const { subject, html, text } = renderCertificateEmail({
    recipient: { full_name: '<b>Ali</b> Raza', email: 'ali@example.com' },
    workshop: { title: 'Git & GitHub' },
    siteUrl: 'https://skill-sprint.pk',
  })
  assert.equal(subject, 'Your certificate — Git & GitHub')
  assert.ok(html.includes('&lt;b&gt;Ali&lt;/b&gt;'))
  assert.ok(!html.includes('<b>Ali</b>'))
  assert.ok(html.includes('Git &amp; GitHub'))
  assert.ok(text.includes('Git & GitHub'))
  assert.ok(text.includes('https://skill-sprint.pk/workshops'))
  assert.ok(!/unsubscribe/i.test(html + text))
})
