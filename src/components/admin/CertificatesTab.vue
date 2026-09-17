<template>
  <div class="flex flex-col gap-6">
    <!-- Canva connection -->
    <div class="bg-white border border-gray-200 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="font-extrabold text-gray-900">Canva</h2>
        <p v-if="!canva.configured" class="text-sm text-amber-700 mt-0.5">
          Add <code class="font-mono">CANVA_CLIENT_ID</code> and
          <code class="font-mono">CANVA_CLIENT_SECRET</code> to the environment, then reload.
        </p>
        <p v-else-if="canva.connected" class="text-sm text-gray-500 mt-0.5">
          Connected{{ canva.displayName ? ` as ${canva.displayName}` : '' }}.
          Templates are exported from this account.
        </p>
        <p v-else class="text-sm text-gray-500 mt-0.5">
          Connect the Canva account that owns the certificate designs.
        </p>
      </div>
      <div v-if="canva.configured">
        <button v-if="!canva.connected" type="button" :class="ui.primary" :disabled="connecting" @click="connect">
          {{ connecting ? 'Opening Canva…' : 'Connect Canva' }}
        </button>
        <button v-else type="button" :class="ui.secondary" @click="disconnect">Disconnect</button>
      </div>
    </div>

    <p v-if="usage" class="text-xs text-gray-500 font-mono tabular-nums">
      Sending today:
      <span v-for="(q, name) in usage" :key="name" class="mr-3">{{ name }} {{ q.used }}/{{ q.limit }}</span>
      · resets {{ untilLabel(resetsAt) }}
    </p>

    <p v-if="loading && !loaded" class="text-sm text-gray-500">Loading…</p>
    <div v-else-if="!workshops.length"
         class="bg-white border border-gray-200 rounded-xl p-8 text-center text-sm text-gray-500">
      No workshops yet. Add them in the Workshops tab first.
    </div>

    <div v-for="w in workshops" :key="w.id" class="bg-white border border-gray-200 rounded-xl">
      <button type="button" :aria-expanded="open === w.id"
              class="w-full flex flex-wrap items-center justify-between gap-3 p-5 text-left cursor-pointer
                     focus-visible:outline-2 focus-visible:outline-blue-600 rounded-xl"
              @click="toggle(w.id)">
        <div>
          <div class="font-extrabold text-gray-900">{{ w.title }}</div>
          <div class="text-xs text-gray-500 mt-0.5 tabular-nums">{{ shortDate(w.starts_at) }}</div>
        </div>
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <span v-for="s in steps(w)" :key="s.label" class="px-2 py-1 rounded-full font-semibold"
                :class="s.done ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'">
            {{ s.done ? '✓' : '○' }} {{ s.label }}
          </span>
          <span class="font-mono tabular-nums text-gray-500 ml-1">{{ w.sent }}/{{ w.recipients }} sent</span>
          <span v-if="w.waiting" class="font-mono tabular-nums text-amber-700">{{ w.waiting }} waiting</span>
          <span v-if="w.failed" class="font-mono tabular-nums text-red-600">{{ w.failed }} failed</span>
        </div>
      </button>

      <!-- Mounted on first open and then kept alive, so a send in progress survives collapsing. -->
      <div v-if="opened.includes(w.id)" v-show="open === w.id" class="border-t border-gray-100 p-5">
        <CertificateWorkshop
          :workshop-id="w.id"
          :workshop-title="w.title"
          :canva-connected="canva.connected"
          :toast="toast"
          @changed="load"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CertificateWorkshop from './CertificateWorkshop.vue'
import { apiGet, apiPost, shortDate, untilLabel, ui } from '../../utils/adminApi.js'

const props = defineProps({ toast: { type: Function, required: true } })

const workshops = ref([])
const canva = ref({ configured: false, connected: false, displayName: '' })
const usage = ref(null)
const resetsAt = ref(null)
const loading = ref(false)
const loaded = ref(false)
const open = ref(null)
const opened = ref([])
const connecting = ref(false)

async function load() {
  loading.value = true
  const data = await apiGet('/api/admin/certificates')
  loading.value = false
  if (!data.ok) return props.toast('error', 'Could not load certificates', data.message)
  workshops.value = data.workshops
  canva.value = data.canva
  usage.value = data.usage
  resetsAt.value = data.resets_at
  loaded.value = true
}

function toggle(id) {
  open.value = open.value === id ? null : id
  if (open.value && !opened.value.includes(id)) opened.value.push(id)
}

const steps = (w) => [
  { label: 'Template', done: w.has_template },
  { label: 'Style', done: w.has_template && w.has_font && w.placed },
  { label: 'Attendees', done: w.recipients > 0 },
  { label: 'Sent', done: w.recipients > 0 && w.sent === w.recipients },
]

async function connect() {
  connecting.value = true
  const data = await apiPost('/api/admin/canva', { op: 'authorize' })
  if (!data.ok) {
    connecting.value = false
    return props.toast('error', 'Could not start the Canva connection', data.message)
  }
  window.location.assign(data.url)
}

async function disconnect() {
  if (!window.confirm('Disconnect Canva? Stored templates stay; fetching new ones needs a reconnect.')) return
  const data = await apiPost('/api/admin/canva', { op: 'disconnect' })
  if (!data.ok) return props.toast('error', 'Could not disconnect', data.message)
  props.toast('success', 'Canva disconnected')
  await load()
}

defineExpose({ reload: load })
onMounted(load)
</script>
