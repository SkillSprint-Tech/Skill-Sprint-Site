<template>
  <div class="flex flex-col gap-5">
    <dl class="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <div v-for="c in cards" :key="c.label" class="border border-gray-200 rounded-lg px-3 py-2">
        <dt class="text-xs text-gray-500">{{ c.label }}</dt>
        <dd class="text-xl font-extrabold tabular-nums" :class="c.cls">{{ c.value }}</dd>
      </div>
    </dl>

    <form class="flex flex-wrap items-end gap-2" @submit.prevent="sendTest">
      <label class="flex flex-col gap-1.5 flex-1 min-w-56">
        <span :class="ui.label">Send a test to</span>
        <input v-model.trim="testTo" type="email" required placeholder="you@example.com" :class="ui.input" />
      </label>
      <label class="flex flex-col gap-1.5 flex-1 min-w-48">
        <span :class="ui.label">Name on the test</span>
        <input v-model="testName" type="text" :class="ui.input" />
      </label>
      <button type="submit" :class="ui.secondary" :disabled="!testReady || testing">
        {{ testing ? 'Sending…' : 'Send test' }}
      </button>
    </form>

    <div class="flex flex-wrap items-center gap-3">
      <button type="button" :class="ui.primary" :disabled="!ready || draining || (!notQueued && !waiting)"
              @click="sendAll">
        {{ primaryLabel }}
      </button>
      <button v-if="draining" type="button" :class="ui.secondary" @click="stopRequested = true">Pause</button>
      <span v-if="!ready" class="text-sm text-gray-500">Finish steps 1–3 first.</span>
      <span v-else-if="progress" class="text-sm text-gray-600" aria-live="polite">{{ progress }}</span>
    </div>
    <p class="text-xs text-gray-500">
      Sending continues while this page is open. Anything left — including whatever the daily
      limit holds back — goes out automatically on the next scheduled run.
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { apiPost, untilLabel, ui } from '../../utils/adminApi.js'

const props = defineProps({
  workshopId: { type: String, required: true },
  workshopTitle: { type: String, required: true },
  // Template, font and placement are set — enough for a test.
  templateReady: { type: Boolean, default: false },
  // …and there is someone to send to.
  ready: { type: Boolean, default: false },
  recipients: { type: Array, required: true },
  sampleName: { type: String, default: 'Sample Name' },
  toast: { type: Function, required: true },
})
const emit = defineEmits(['changed'])

const API = '/api/admin/certificates'
const TEST_TO_KEY = 'ss_cert_test_to'

function readStored() {
  try { return localStorage.getItem(TEST_TO_KEY) || '' } catch { return '' }
}
function store(value) {
  try { localStorage.setItem(TEST_TO_KEY, value) } catch { /* private mode: not remembered */ }
}

const testTo = ref(readStored())
const testName = ref(props.sampleName)
const testing = ref(false)
const draining = ref(false)
const stopRequested = ref(false)
const progress = ref('')
let unmounted = false

watch(() => props.sampleName, (value) => { testName.value = value })

const testReady = computed(() => props.templateReady && Boolean(testTo.value))

const count = (statuses) => props.recipients.filter((r) => statuses.includes(r.status)).length
const notQueued = computed(() => props.recipients.filter((r) => !r.job_id).length)
const waiting = computed(() => count(['pending', 'processing', 'deferred']))
const cards = computed(() => [
  { label: 'Attendees', value: props.recipients.length, cls: 'text-gray-900' },
  { label: 'Sent', value: count(['sent', 'delivered']), cls: 'text-blue-700' },
  { label: 'Delivered', value: count(['delivered']), cls: 'text-emerald-600' },
  { label: 'Waiting', value: waiting.value, cls: waiting.value ? 'text-amber-700' : 'text-gray-900' },
  { label: 'Failed', value: count(['failed', 'bounced']), cls: count(['failed', 'bounced']) ? 'text-red-600' : 'text-gray-900' },
])

const primaryLabel = computed(() => {
  if (draining.value) return 'Sending…'
  if (notQueued.value) return `Send ${notQueued.value} certificate${notQueued.value === 1 ? '' : 's'}`
  if (waiting.value) return `Continue sending (${waiting.value} waiting)`
  return 'All certificates sent'
})

async function sendTest() {
  testing.value = true
  store(testTo.value)
  const data = await apiPost(API, {
    op: 'send-test', workshopId: props.workshopId, to: testTo.value, name: testName.value,
  })
  testing.value = false

  if (data.ok) props.toast('success', 'Test sent', `Check ${testTo.value}${data.provider ? ` (via ${data.provider})` : ''}.`)
  else if (data.code === 'QUOTA_EXHAUSTED') props.toast('warn', 'Daily limit reached', `Resets ${untilLabel(data.resets_at)}.`)
  else props.toast('error', 'Test failed', data.message, 10000)
}

async function sendAll() {
  const first = notQueued.value > 0
  if (first) {
    const ok = window.confirm(
      `Send ${notQueued.value} certificate${notQueued.value === 1 ? '' : 's'} for “${props.workshopTitle}”?\n\n` +
        'Each person gets one email with their PDF attached.'
    )
    if (!ok) return
  }

  draining.value = true
  stopRequested.value = false
  let sent = 0
  let data = await apiPost(API, first ? { op: 'send-all', workshopId: props.workshopId } : { op: 'process' })

  for (;;) {
    if (!data.ok && data.code !== 'QUOTA_EXHAUSTED') {
      props.toast('error', 'Sending stopped', data.message, 12000)
      break
    }
    sent += data.summary?.sent || 0
    progress.value = `${sent} sent so far…`
    emit('changed')

    if (data.code === 'QUOTA_EXHAUSTED') {
      props.toast('warn', 'Daily limit reached',
        `The rest go out automatically after the reset (${untilLabel(data.resets_at)}).`, 12000)
      break
    }
    if (stopRequested.value || unmounted || !data.remaining || !data.summary?.claimed) break
    data = await apiPost(API, { op: 'process' })
  }

  draining.value = false
  progress.value = sent ? `${sent} sent this session.` : ''
  if (sent && !stopRequested.value) props.toast('success', 'Certificates sent', `${sent} delivered to the providers.`)
  emit('changed')
}

onUnmounted(() => { unmounted = true })
</script>
