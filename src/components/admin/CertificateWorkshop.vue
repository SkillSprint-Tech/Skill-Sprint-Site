<template>
  <p v-if="!detail" class="text-sm text-gray-500">Loading…</p>

  <div v-else class="flex flex-col gap-10">
    <!-- 1 · Template -->
    <section>
      <h3 :class="ui.stepTitle">
        <span>1 · Template</span><span v-if="readiness.template" class="text-emerald-600">✓</span>
      </h3>
      <p v-if="!canvaConnected" class="text-sm text-amber-700 mb-3">Connect Canva above first.</p>
      <form class="flex flex-wrap gap-2" @submit.prevent="fetchTemplate">
        <label class="sr-only" :for="`canva-${workshopId}`">Canva design link</label>
        <input :id="`canva-${workshopId}`" v-model.trim="canvaUrl" type="text" required
               placeholder="https://canva.link/…" :class="[ui.input, 'flex-1 min-w-64']" />
        <button type="submit" :class="ui.primary" :disabled="fetching || !canvaConnected || !canvaUrl">
          {{ fetching ? 'Exporting from Canva…' : template?.fetched_at ? 'Refresh from Canva' : 'Fetch from Canva' }}
        </button>
      </form>
      <p v-if="fetching" class="text-xs text-gray-500 mt-2">This can take up to a minute.</p>
      <p v-else-if="template?.fetched_at" class="text-xs text-gray-500 mt-2 tabular-nums">
        “{{ template.canva_title || 'Untitled design' }}” ·
        {{ Math.round(template.page_width) }} × {{ Math.round(template.page_height) }} pt ·
        {{ megabytes(template.pdf_bytes) }} · fetched {{ shortDate(template.fetched_at) }}
      </p>
      <p class="text-xs text-gray-500 mt-1">
        The name area in the Canva design must be empty — the name is drawn on top of it.
      </p>
    </section>

    <!-- 2 · Name style -->
    <section v-if="readiness.template">
      <h3 :class="ui.stepTitle">
        <span>2 · Name style</span><span v-if="readiness.style" class="text-emerald-600">✓</span>
      </h3>

      <div class="flex flex-wrap items-center gap-3 mb-4">
        <button type="button" :class="ui.secondary" :disabled="uploadingFont" @click="fontInput.click()">
          {{ uploadingFont ? 'Uploading…' : template.has_font ? 'Replace font' : 'Upload font' }}
        </button>
        <input ref="fontInput" type="file" accept=".ttf,.otf" class="hidden" @change="uploadFont" />
        <span v-if="template.has_font" class="text-sm text-gray-700">
          {{ template.font_family }}
          <span class="text-gray-400">({{ template.font_filename }})</span>
        </span>
        <span v-else class="text-sm text-gray-500">
          Upload the font used for the name in Canva (.ttf or .otf, up to 2 MB).
        </span>
      </div>

      <CertificateStylePreview
        v-if="previewUrl"
        v-model="style"
        :preview-url="previewUrl"
        :font-url="fontUrl"
        :font-key="fontKey"
        :page-width="template.page_width"
        :page-height="template.page_height"
        :sample-name="sampleName"
      />

      <div class="flex flex-wrap items-center gap-2 mt-4">
        <button type="button" :class="ui.primary" :disabled="!styleDirty || savingStyle || style.x == null"
                @click="saveStyle">
          {{ savingStyle ? 'Saving…' : 'Save position' }}
        </button>
        <button type="button" :class="ui.secondary" :disabled="!readiness.style || styleDirty" @click="openSample">
          Download sample
        </button>
        <span v-if="styleDirty && style.x != null" class="text-xs text-amber-700">Unsaved changes</span>
      </div>
    </section>

    <!-- 3 · Attendees -->
    <section>
      <h3 :class="ui.stepTitle">
        <span>3 · Attendees</span>
        <span v-if="recipients.length" class="text-emerald-600">✓ {{ recipients.length }}</span>
      </h3>
      <CertificateImport :workshop-id="workshopId" :toast="toast" @imported="reload" />
      <CertificateRecipients
        v-if="recipients.length"
        class="mt-6"
        :recipients="recipients"
        :can-send="sendReady"
        :toast="toast"
        @changed="reload"
      />
    </section>

    <!-- 4 · Send -->
    <section>
      <h3 :class="ui.stepTitle"><span>4 · Send</span></h3>
      <CertificateSend
        :workshop-id="workshopId"
        :workshop-title="workshopTitle"
        :template-ready="readiness.style"
        :ready="sendReady"
        :recipients="recipients"
        :sample-name="sampleName"
        :toast="toast"
        @changed="reload"
      />
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CertificateStylePreview from './CertificateStylePreview.vue'
import CertificateImport from './CertificateImport.vue'
import CertificateRecipients from './CertificateRecipients.vue'
import CertificateSend from './CertificateSend.vue'
import { apiGet, apiPost, apiBlob, fileToBase64, shortDate, ui } from '../../utils/adminApi.js'

const props = defineProps({
  workshopId: { type: String, required: true },
  workshopTitle: { type: String, required: true },
  canvaConnected: { type: Boolean, default: false },
  toast: { type: Function, required: true },
})
const emit = defineEmits(['changed'])

const API = '/api/admin/certificates'
const assetUrl = (asset, extra = '') => `${API}?workshopId=${props.workshopId}&asset=${asset}${extra}`

const detail = ref(null)
const template = computed(() => detail.value?.template || null)
const readiness = computed(() => detail.value?.readiness || { template: false, style: false })
const recipients = computed(() => detail.value?.recipients || [])
const sendReady = computed(() => readiness.value.style && recipients.value.length > 0)

// The preview uses the longest real name, so shrink-to-fit is visible before sending.
const sampleName = computed(() =>
  recipients.value.reduce((longest, r) => (r.full_name.length > longest.length ? r.full_name : longest), '') ||
  'Sample Name'
)

const canvaUrl = ref('')
const fetching = ref(false)

const style = ref({ x: null, y: null, size: 36, color: '#111827', maxWidth: 0.6 })
const savedStyleKey = ref('')
const styleKey = (s) => [s.x, s.y, s.size, s.color, s.maxWidth].join('|')
const styleDirty = computed(() => styleKey(style.value) !== savedStyleKey.value)
const savingStyle = ref(false)

const fontInput = ref(null)
const uploadingFont = ref(false)
const previewUrl = ref('')
const fontUrl = ref('')
const fontKey = ref('')

const megabytes = (bytes) => `${(Number(bytes || 0) / 1048576).toFixed(1)} MB`

async function reload({ notify = true } = {}) {
  const data = await apiGet(`${API}?workshopId=${props.workshopId}`)
  if (!data.ok) return props.toast('error', 'Could not load this workshop', data.message)

  const previousFetch = detail.value?.template?.fetched_at
  detail.value = data

  const t = data.template
  if (t) {
    if (!canvaUrl.value) canvaUrl.value = t.canva_url
    const saved = { x: t.name_x, y: t.name_y, size: t.name_size, color: t.name_color, maxWidth: t.name_max_width }
    // Take the saved placement unless the admin is mid-adjustment.
    if (!savedStyleKey.value || !styleDirty.value) {
      style.value = { ...saved }
      savedStyleKey.value = styleKey(saved)
    }
    if (t.fetched_at && t.fetched_at !== previousFetch) await loadPreview()
    if (t.has_font && !fontUrl.value) await loadFont()
  }
  if (notify) emit('changed')
}

async function loadPreview() {
  try {
    const blob = await apiBlob(assetUrl('preview'))
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = URL.createObjectURL(blob)
  } catch (error) {
    props.toast('error', 'Could not load the template preview', error.message)
  }
}

async function loadFont() {
  try {
    const blob = await apiBlob(assetUrl('font'))
    if (fontUrl.value) URL.revokeObjectURL(fontUrl.value)
    fontUrl.value = URL.createObjectURL(blob)
    fontKey.value = `${props.workshopId}-${Date.now()}`
  } catch (error) {
    props.toast('error', 'Could not load the font', error.message)
  }
}

async function fetchTemplate() {
  fetching.value = true
  const data = await apiPost(API, { op: 'fetch-template', workshopId: props.workshopId, canvaUrl: canvaUrl.value })
  fetching.value = false
  if (!data.ok) return props.toast('error', 'Could not fetch the template', data.message, 12000)

  props.toast('success', 'Template fetched', data.title ? `“${data.title}” from Canva.` : '')
  for (const warning of data.warnings || []) props.toast('warn', 'Check the template', warning, 12000)
  await reload()
}

async function uploadFont(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    return props.toast('error', 'Font too large', 'Font files must be 2 MB or smaller.')
  }

  uploadingFont.value = true
  const data = await apiPost(API, {
    op: 'upload-font',
    workshopId: props.workshopId,
    base64: await fileToBase64(file),
    filename: file.name,
  })
  uploadingFont.value = false
  if (!data.ok) return props.toast('error', 'Could not use that font', data.message)

  props.toast('success', 'Font uploaded', `Names will be drawn in ${data.family}.`)
  await loadFont()
  await reload()
}

async function saveStyle() {
  savingStyle.value = true
  const data = await apiPost(API, { op: 'save-style', workshopId: props.workshopId, style: style.value })
  savingStyle.value = false
  if (!data.ok) return props.toast('error', 'Could not save the position', data.message)

  style.value = { ...data.style }
  savedStyleKey.value = styleKey(data.style)
  props.toast('success', 'Position saved', 'Download a sample to check the exact output.')
  await reload()
}

async function openSample() {
  // Open synchronously so the popup blocker treats it as user-initiated.
  const win = window.open('', '_blank')
  try {
    const blob = await apiBlob(assetUrl('sample', `&name=${encodeURIComponent(sampleName.value)}`))
    const url = URL.createObjectURL(blob)
    if (win) win.location.href = url
    else window.location.assign(url)
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  } catch (error) {
    win?.close()
    props.toast('error', 'Could not build the sample', error.message)
  }
}

onMounted(() => reload({ notify: false }))
onUnmounted(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  if (fontUrl.value) URL.revokeObjectURL(fontUrl.value)
})
</script>
