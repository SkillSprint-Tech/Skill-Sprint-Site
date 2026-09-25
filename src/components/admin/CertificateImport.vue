<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap gap-2">
      <form class="flex flex-1 flex-wrap gap-2 min-w-72" @submit.prevent="previewFromSheet">
        <label class="sr-only" :for="`sheet-${workshopId}`">Google Sheet link</label>
        <input :id="`sheet-${workshopId}`" v-model.trim="sheetUrl" type="url"
               placeholder="Google Sheet link (shared: anyone with the link)"
               :class="[ui.input, 'flex-1 min-w-64']" />
        <button type="submit" :class="ui.primary" :disabled="!!busy || !sheetUrl">
          {{ busy === 'sheet' ? 'Reading…' : 'Preview' }}
        </button>
      </form>
      <button type="button" :class="ui.secondary" :disabled="!!busy" @click="fileInput.click()">
        {{ busy === 'file' ? 'Reading…' : 'Upload CSV / Excel' }}
      </button>
      <input ref="fileInput" type="file" accept=".csv,.xlsx" class="hidden" @change="previewFromFile" />

      <!-- 1-Click Auto-Populate from Workshop Check-ins -->
      <button
        type="button"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs shadow-emerald-600/20 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
        :disabled="!!busy"
        @click="populateFromAttendance"
        title="Automatically import all attendees who checked in to this workshop"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
        <span>{{ busy === 'attendance' ? 'Populating…' : 'Sync Checked-in Attendees' }}</span>
      </button>
    </div>

    <div v-if="rows.length" class="border border-gray-200 rounded-lg">
      <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-gray-100">
        <p class="text-sm text-gray-700">
          <strong class="tabular-nums">{{ included.length }}</strong> to import
          <span v-for="c in flagCounts" :key="c.flag" class="ml-2 text-gray-500 tabular-nums">
            · {{ c.count }} {{ FLAGS[c.flag].label.toLowerCase() }}
          </span>
        </p>
        <div class="flex gap-2">
          <button type="button" :class="ui.secondary" :disabled="busy === 'import'" @click="clear">Cancel</button>
          <button type="button" :class="ui.primary" :disabled="!included.length || !!busy" @click="importRows">
            {{ busy === 'import' ? 'Importing…' : `Import ${included.length}` }}
          </button>
        </div>
      </div>

      <div class="max-h-96 overflow-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 sticky top-0">
            <tr>
              <th class="px-3 py-2 text-left w-10"><span class="sr-only">Include</span></th>
              <th class="px-3 py-2 text-left w-14">Row</th>
              <th class="px-3 py-2 text-left">Name on certificate</th>
              <th class="px-3 py-2 text-left">Email</th>
              <th class="px-3 py-2 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rows" :key="r.row" class="border-t border-gray-100"
                :class="r.include ? '' : 'bg-gray-50/60 text-gray-400'">
              <td class="px-3 py-1.5">
                <input v-model="r.include" type="checkbox" class="accent-blue-600"
                       :disabled="blocked(r)" :aria-label="`Include row ${r.row}`" />
              </td>
              <td class="px-3 py-1.5 tabular-nums text-gray-400">{{ r.row }}</td>
              <td class="px-3 py-1.5">
                <input v-model="r.fullName" type="text" :class="ui.cellInput"
                       :aria-label="`Name on certificate, row ${r.row}`" />
              </td>
              <td class="px-3 py-1.5 text-gray-600">{{ r.email }}</td>
              <td class="px-3 py-1.5">
                <span v-for="f in r.flags" :key="f"
                      class="inline-block mr-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                      :class="FLAGS[f].class">{{ FLAGS[f].label }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="px-4 py-3 text-xs text-gray-500 border-t border-gray-100">
        Names are printed exactly as shown — fix capitalisation here before importing.
        Once imported, you can turn off link sharing on the sheet.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { apiPost, ui } from '../../utils/adminApi.js'

const props = defineProps({
  workshopId: { type: String, required: true },
  toast: { type: Function, required: true },
})
const emit = defineEmits(['imported'])

const API = '/api/admin/certificates'
const MAX_CSV_BYTES = 1024 * 1024
const MAX_XLSX_BYTES = 2 * 1024 * 1024

const FLAGS = {
  duplicate: { label: 'Duplicate', class: 'bg-gray-100 text-gray-600' },
  existing: { label: 'Already imported', class: 'bg-blue-50 text-blue-700' },
  invalidEmail: { label: 'Invalid email', class: 'bg-red-50 text-red-700' },
  missingName: { label: 'No name', class: 'bg-red-50 text-red-700' },
  oddCase: { label: 'Check capitals', class: 'bg-amber-50 text-amber-800' },
}

const sheetUrl = ref('')
const fileInput = ref(null)
const busy = ref('')
const rows = ref([])
const source = ref('')

const blocked = (r) => r.flags.includes('invalidEmail') || !r.fullName.trim()
const included = computed(() => rows.value.filter((r) => r.include && !blocked(r)))
const flagCounts = computed(() =>
  Object.keys(FLAGS)
    .map((flag) => ({ flag, count: rows.value.filter((r) => r.flags.includes(flag)).length }))
    .filter((c) => c.count)
)

function clear() {
  rows.value = []
  source.value = ''
}

async function preview(payload, label) {
  const data = await apiPost(API, { op: 'preview-import', workshopId: props.workshopId, ...payload })
  if (!data.ok) return props.toast('error', 'Could not read the attendees', data.message, 12000)
  rows.value = data.rows
  source.value = label
  if (!data.rows.length) props.toast('warn', 'No attendees found', 'The sheet has a header but no rows.')
}

async function previewFromSheet() {
  busy.value = 'sheet'
  try {
    await preview({ sheetUrl: sheetUrl.value }, sheetUrl.value)
  } finally {
    busy.value = ''
  }
}

async function previewFromFile(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return

  const isXlsx = /\.xlsx$/i.test(file.name)
  if (!isXlsx && !/\.csv$/i.test(file.name)) {
    return props.toast('error', 'Unsupported file', 'Upload a .csv or .xlsx file.')
  }
  if (file.size > (isXlsx ? MAX_XLSX_BYTES : MAX_CSV_BYTES)) {
    return props.toast('error', 'File too large', `Keep ${isXlsx ? 'Excel files under 2 MB' : 'CSV files under 1 MB'}.`)
  }

  busy.value = 'file'
  try {
    if (isXlsx) {
      // Loaded on demand: only admins who upload Excel pay for the parser.
      const { readSheet } = await import('read-excel-file/browser')
      const table = await readSheet(file)
      await preview({ table: table.map((row) => row.map((c) => (c == null ? '' : String(c)))) }, file.name)
    } else {
      await preview({ csv: await file.text() }, file.name)
    }
  } catch (error) {
    props.toast('error', 'Could not read the file', error.message || '')
  } finally {
    busy.value = ''
  }
}

async function populateFromAttendance() {
  busy.value = 'attendance'
  try {
    const data = await apiPost(API, { op: 'populate-from-checkins', workshopId: props.workshopId })
    if (!data.ok) return props.toast('error', 'Could not populate attendees', data.message)
    if (data.inserted === 0 && data.totalCheckedIn === 0) {
      return props.toast('warn', 'No checked-in attendees', 'Nobody has checked into this workshop yet.')
    }
    props.toast(
      'success',
      'Certificate Recipients Updated',
      data.message || `Added ${data.inserted} checked-in attendees.`
    )
    emit('imported')
  } catch (err) {
    props.toast('error', 'Populate failed', err.message)
  } finally {
    busy.value = ''
  }
}

async function importRows() {
  busy.value = 'import'
  const data = await apiPost(API, {
    op: 'import',
    workshopId: props.workshopId,
    source: source.value,
    rows: included.value.map(({ fullName, email }) => ({ fullName, email })),
  })
  busy.value = ''
  if (!data.ok) return props.toast('error', 'Import failed', data.message)

  const notes = [
    data.alreadyPresent && `${data.alreadyPresent} already on the list`,
    data.skipped && `${data.skipped} skipped`,
  ].filter(Boolean).join(' · ')
  props.toast('success', `Imported ${data.inserted} ${data.inserted === 1 ? 'person' : 'people'}`, notes)
  clear()
  emit('imported')
}
</script>
