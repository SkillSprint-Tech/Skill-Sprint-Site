<template>
  <div class="border border-gray-200 rounded-lg">
    <div class="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-gray-100">
      <label class="sr-only" for="cert-search">Search attendees</label>
      <input id="cert-search" v-model.trim="search" type="search" placeholder="Search name or email"
             :class="[ui.input, 'flex-1 min-w-48']" />
      <label class="sr-only" for="cert-filter">Filter by status</label>
      <select id="cert-filter" v-model="filter" :class="ui.input">
        <option value="all">All ({{ recipients.length }})</option>
        <option v-for="g in GROUPS" :key="g.id" :value="g.id">{{ g.label }} ({{ counts[g.id] }})</option>
      </select>
    </div>

    <div class="max-h-[28rem] overflow-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 sticky top-0">
          <tr>
            <th class="px-3 py-2 text-left">Name on certificate</th>
            <th class="px-3 py-2 text-left">Email</th>
            <th class="px-3 py-2 text-left">Status</th>
            <th class="px-3 py-2 text-left">Sent</th>
            <th class="px-3 py-2 text-right"><span class="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in visible" :key="r.id" class="border-t border-gray-100 align-top">
            <template v-if="editing === r.id">
              <td class="px-3 py-2">
                <input v-model="draft.fullName" type="text" :class="ui.input + ' w-full'" aria-label="Name on certificate" />
              </td>
              <td class="px-3 py-2">
                <input v-model="draft.email" type="email" :class="ui.input + ' w-full'" aria-label="Email" />
              </td>
              <td colspan="2" class="px-3 py-2 text-xs text-gray-500">
                <template v-if="isSent(r)">Already sent — resend after saving to deliver the correction.</template>
              </td>
              <td class="px-3 py-2 text-right whitespace-nowrap">
                <button type="button" :class="ui.link" :disabled="saving" @click="saveEdit(r)">Save</button>
                <button type="button" class="ml-3" :class="ui.link" @click="editing = null">Cancel</button>
              </td>
            </template>

            <template v-else>
              <td class="px-3 py-2 font-medium text-gray-900">{{ r.full_name }}</td>
              <td class="px-3 py-2 text-gray-600">{{ r.email }}</td>
              <td class="px-3 py-2">
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
                      :class="STATUS[r.status || 'none'].class">{{ STATUS[r.status || 'none'].label }}</span>
                <div v-if="r.last_error && !isSent(r)" class="text-xs text-red-600 mt-1 max-w-xs">{{ r.last_error }}</div>
              </td>
              <td class="px-3 py-2 text-xs text-gray-500 tabular-nums whitespace-nowrap">
                {{ r.sent_at ? shortDate(r.sent_at) : '—' }}
              </td>
              <td class="px-3 py-2 text-right whitespace-nowrap">
                <button type="button" :class="ui.link"
                        :disabled="!canSend || busyId === r.id || r.status === 'processing'"
                        @click="resend(r)">
                  {{ busyId === r.id ? 'Sending…' : r.job_id ? 'Resend' : 'Send' }}
                </button>
                <button type="button" class="ml-3" :class="ui.link" @click="startEdit(r)">Edit</button>
                <button type="button" class="ml-3 text-sm font-semibold text-red-600 hover:text-red-800 cursor-pointer"
                        @click="remove(r)">Remove</button>
              </td>
            </template>
          </tr>
          <tr v-if="!visible.length">
            <td colspan="5" class="px-3 py-6 text-center text-sm text-gray-500">Nobody matches.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { apiPost, shortDate, ui } from '../../utils/adminApi.js'

const props = defineProps({
  recipients: { type: Array, required: true },
  canSend: { type: Boolean, default: false },
  toast: { type: Function, required: true },
})
const emit = defineEmits(['changed'])

const API = '/api/admin/certificates'

const STATUS = {
  none: { label: 'Not sent', class: 'bg-gray-100 text-gray-600' },
  pending: { label: 'Queued', class: 'bg-gray-100 text-gray-700' },
  processing: { label: 'Sending', class: 'bg-gray-100 text-gray-700' },
  deferred: { label: 'Waiting · daily limit', class: 'bg-amber-50 text-amber-700' },
  sent: { label: 'Sent', class: 'bg-blue-50 text-blue-700' },
  delivered: { label: 'Delivered', class: 'bg-emerald-50 text-emerald-700' },
  failed: { label: 'Failed', class: 'bg-red-50 text-red-700' },
  bounced: { label: 'Bounced', class: 'bg-red-50 text-red-700' },
}

const GROUPS = [
  { id: 'notSent', label: 'Not sent', match: (r) => !r.job_id },
  { id: 'waiting', label: 'Waiting', match: (r) => ['pending', 'processing', 'deferred'].includes(r.status) },
  { id: 'sent', label: 'Sent', match: (r) => ['sent', 'delivered'].includes(r.status) },
  { id: 'problem', label: 'Failed', match: (r) => ['failed', 'bounced'].includes(r.status) },
]

const search = ref('')
const filter = ref('all')
const editing = ref(null)
const draft = reactive({ fullName: '', email: '' })
const saving = ref(false)
const busyId = ref(null)

const isSent = (r) => r.status === 'sent' || r.status === 'delivered'

const counts = computed(() =>
  Object.fromEntries(GROUPS.map((g) => [g.id, props.recipients.filter(g.match).length]))
)

const visible = computed(() => {
  const q = search.value.toLowerCase()
  const group = GROUPS.find((g) => g.id === filter.value)
  return props.recipients.filter(
    (r) =>
      (!group || group.match(r)) &&
      (!q || r.full_name.toLowerCase().includes(q) || r.email.includes(q))
  )
})

function startEdit(r) {
  editing.value = r.id
  draft.fullName = r.full_name
  draft.email = r.email
}

async function saveEdit(r) {
  saving.value = true
  const data = await apiPost(API, { op: 'update-recipient', id: r.id, fullName: draft.fullName, email: draft.email })
  saving.value = false
  if (!data.ok) return props.toast('error', 'Could not save', data.message)
  editing.value = null
  props.toast('success', 'Saved', isSent(r) ? 'Click Resend to deliver the corrected certificate.' : '')
  emit('changed')
}

async function resend(r) {
  busyId.value = r.id
  const data = await apiPost(API, { op: 'resend', id: r.id })
  busyId.value = null

  if (data.ok) {
    props.toast('success', `Certificate sent to ${r.full_name}`, data.provider ? `via ${data.provider}` : '')
  } else if (data.code === 'QUOTA_EXHAUSTED') {
    props.toast('warn', 'Daily limit reached', 'It will go out automatically after the reset.')
  } else {
    props.toast('error', `Could not send to ${r.full_name}`, data.message, 10000)
  }
  emit('changed')
}

async function remove(r) {
  if (!window.confirm(`Remove ${r.full_name} from this workshop's certificate list?`)) return
  const data = await apiPost(API, { op: 'delete-recipient', id: r.id })
  if (!data.ok) return props.toast('error', 'Could not remove', data.message)
  props.toast('success', `${r.full_name} removed`)
  emit('changed')
}
</script>
