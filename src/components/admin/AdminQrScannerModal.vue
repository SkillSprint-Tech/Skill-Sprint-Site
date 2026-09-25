<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
    <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-scale-in">
      <!-- ═══════════════════ MODAL HEADER ═══════════════════ -->
      <div class="px-4 sm:px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/80">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800/80 shrink-0">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2m-10 0H5a2 2 0 0 1-2-2v-2" />
              <rect x="7" y="7" width="10" height="10" rx="1" />
            </svg>
          </div>
          <div class="min-w-0">
            <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight truncate">
              Live Workshop Check-in
            </h3>
            <p class="text-[11px] text-slate-400 truncate">
              Scan attendee QR ticket or check in by name/email
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="closeModal"
          class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-2"
          title="Close Scanner"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- ═══════════════════ TARGET WORKSHOP SELECTOR BANNER ═══════════════════ -->
      <!-- Mobile: clean 2-row layout without overflow or clipping. Desktop: inline layout. -->
      <div class="px-4 sm:px-6 py-2.5 bg-blue-50/90 dark:bg-slate-800/90 border-b border-blue-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div class="flex items-center justify-between gap-2 w-full sm:w-auto">
          <label class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 font-mono shrink-0">
            Target Workshop:
          </label>
          <span
            v-if="selectedWorkshop"
            class="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 border border-blue-200/70 dark:border-blue-700/60 shrink-0"
          >
            {{ selectedWorkshop.checked_in_count ?? 0 }} checked in
          </span>
        </div>

        <div class="w-full sm:flex-1 sm:max-w-xs">
          <select
            v-model="selectedWorkshopId"
            class="w-full border border-blue-200/80 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer truncate shadow-2xs"
          >
            <option v-for="(w, idx) in workshops" :key="w.id" :value="w.id">
              #{{ idx + 1 }}: {{ w.title }} ({{ w.status }})
            </option>
          </select>
        </div>
      </div>

      <!-- ═══════════════════ MODE TABS ═══════════════════ -->
      <div class="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850 px-4 sm:px-6 pt-2">
        <button
          type="button"
          @click="tab = 'camera'"
          class="px-3 sm:px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5"
          :class="tab === 'camera' ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-bold' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
          <span>Camera QR Scanner</span>
        </button>
        <button
          type="button"
          @click="tab = 'manual'"
          class="px-3 sm:px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5"
          :class="tab === 'manual' ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-bold' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span>Quick Search Check-in</span>
        </button>
      </div>

      <!-- ═══════════════════ BODY CONTENT ═══════════════════ -->
      <div class="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-white dark:bg-slate-900 transition-colors duration-150">
        <!-- Camera Viewfinder -->
        <div v-if="tab === 'camera'" class="space-y-3">
          <div class="relative w-full aspect-square max-w-sm mx-auto bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner">
            <video
              ref="videoEl"
              autoplay
              playsinline
              muted
              class="w-full h-full object-cover"
            ></video>

            <!-- Holographic Reticle Overlay -->
            <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div class="w-52 h-52 border-2 border-cyan-500/80 rounded-2xl relative shadow-[0_0_25px_rgba(6,182,212,0.35)]">
                <!-- Corner Accents -->
                <div class="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-cyan-400 rounded-tl-sm"></div>
                <div class="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-cyan-400 rounded-tr-sm"></div>
                <div class="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-cyan-400 rounded-bl-sm"></div>
                <div class="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-cyan-400 rounded-br-sm"></div>
                <!-- Scanning Laser Line Animation -->
                <div class="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bounce opacity-90 mt-24"></div>
              </div>
            </div>

            <!-- Permission / Camera Warning -->
            <div v-if="cameraError" class="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
              <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-amber-400">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </div>
              <p class="text-xs font-medium text-slate-300">{{ cameraError }}</p>
              <button
                type="button"
                @click="startCamera"
                class="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-xl font-semibold cursor-pointer shadow-sm active:scale-[0.98]"
              >
                Retry Camera
              </button>
            </div>
          </div>

          <p class="text-center text-[11px] font-mono text-slate-500 dark:text-slate-400">
            Point camera at attendee QR ticket pass or mobile screen
          </p>
        </div>

        <!-- Manual Quick Search -->
        <div v-else class="space-y-4">
          <form @submit.prevent="submitSearch" class="flex gap-2">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Search attendee by email, name, or UUID token…"
              class="flex-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autofocus
            />
            <button
              type="submit"
              :disabled="checkingIn"
              class="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98] shrink-0"
            >
              {{ checkingIn ? 'Verifying…' : 'Check In' }}
            </button>
          </form>

          <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-750 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <p class="font-semibold text-slate-700 dark:text-slate-300">Accepted QR & Search Formats:</p>
            <ul class="list-disc list-inside space-y-0.5 font-mono text-[10px]">
              <li>Attendee Registration UUID (e.g. from Portal pass)</li>
              <li>Attendee Registered Email Address</li>
              <li>Attendee Full Name query</li>
            </ul>
          </div>
        </div>

        <!-- Last Checked-In Banner -->
        <div
          v-if="lastCheckedIn"
          class="bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 animate-fade-in shadow-xs"
        >
          <div class="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">
                Checked In Successfully
              </span>
              <span class="text-[10px] text-slate-400 font-mono">Just now</span>
            </div>
            <p class="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
              {{ lastCheckedIn.full_name }}
            </p>
            <p class="text-[11px] text-blue-700 dark:text-blue-400 font-semibold truncate">
              Workshop: {{ lastCheckedIn.workshopTitle }}
            </p>
            <p class="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">
              {{ lastCheckedIn.email }} &bull; {{ lastCheckedIn.university || 'General Attendee' }}
            </p>
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="errorMsg"
          class="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl p-3 text-xs text-rose-700 dark:text-rose-300 font-medium"
        >
          {{ errorMsg }}
        </div>
      </div>

      <!-- ═══════════════════ MODAL FOOTER ═══════════════════ -->
      <div class="px-4 sm:px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span class="font-mono text-[11px] flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Verifying against Neon DB
        </span>
        <button
          type="button"
          @click="closeModal"
          class="px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  workshops: { type: Array, default: () => [] },
  initialWorkshopId: { type: String, default: '' },
  toast: { type: Function, default: () => {} }
})

const emit = defineEmits(['close', 'checked-in'])

const tab = ref('camera')
const videoEl = ref(null)
const cameraError = ref('')
const searchTerm = ref('')
const checkingIn = ref(false)
const lastCheckedIn = ref(null)
const errorMsg = ref('')

const selectedWorkshopId = ref(
  props.initialWorkshopId ||
  props.workshops.find((w) => w.status === 'live')?.id ||
  props.workshops.find((w) => w.status === 'upcoming')?.id ||
  props.workshops[0]?.id ||
  ''
)

const selectedWorkshop = computed(() =>
  props.workshops.find((w) => w.id === selectedWorkshopId.value)
)

watch(
  () => props.initialWorkshopId,
  (newId) => {
    if (newId) selectedWorkshopId.value = newId
  }
)

let stream = null
let scanInterval = null

// Play a friendly two-tone check-in chime
const playSuccessChime = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const now = ctx.currentTime
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.frequency.setValueAtTime(523.25, now) // C5
    gain1.gain.setValueAtTime(0.15, now)
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.15)

    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.frequency.setValueAtTime(659.25, now + 0.1) // E5
    gain2.gain.setValueAtTime(0.2, now + 0.1)
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now + 0.1)
    osc2.stop(now + 0.3)
  } catch {
    /* AudioContext not allowed or not supported */
  }
}

const startCamera = async () => {
  cameraError.value = ''
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      cameraError.value = 'Camera access is not supported by your browser.'
      tab.value = 'manual'
      return
    }
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    })
    if (videoEl.value) {
      videoEl.value.srcObject = stream
    }

    // Native BarcodeDetector scan loop
    if ('BarcodeDetector' in window) {
      const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] })
      scanInterval = setInterval(async () => {
        if (!videoEl.value || videoEl.value.readyState < 2) return
        try {
          const barcodes = await barcodeDetector.detect(videoEl.value)
          if (barcodes.length > 0) {
            const rawValue = barcodes[0].rawValue
            await performCheckIn({ query: rawValue })
          }
        } catch {
          /* scan frame failed */
        }
      }, 500)
    }
  } catch {
    cameraError.value = 'Camera permission denied or camera in use.'
  }
}

const stopCamera = () => {
  if (scanInterval) {
    clearInterval(scanInterval)
    scanInterval = null
  }
  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
    stream = null
  }
}

const performCheckIn = async (payload) => {
  if (checkingIn.value) return
  if (!selectedWorkshopId.value && props.workshops.length > 0) {
    selectedWorkshopId.value = props.workshops[0].id
  }
  checkingIn.value = true
  errorMsg.value = ''
  try {
    const res = await fetch('/api/admin/check-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        workshop_id: selectedWorkshopId.value,
        attended: true,
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (data.ok && data.registration) {
      const workshopTitle = data.workshop?.title || selectedWorkshop.value?.title || 'Workshop'
      lastCheckedIn.value = {
        ...data.registration,
        workshopTitle,
      }
      playSuccessChime()
      props.toast('success', 'Checked in', `${data.registration.full_name} · ${workshopTitle}`)
      emit('checked-in', { registration: data.registration, workshop: data.workshop })
      searchTerm.value = ''
    } else {
      errorMsg.value = data.message || 'Attendee not found.'
    }
  } catch {
    errorMsg.value = 'Network error during check-in.'
  } finally {
    checkingIn.value = false
  }
}

const submitSearch = () => {
  if (!searchTerm.value.trim()) return
  performCheckIn({ query: searchTerm.value.trim() })
}

const closeModal = () => {
  stopCamera()
  emit('close')
}

watch(tab, (newTab) => {
  if (newTab === 'camera') startCamera()
  else stopCamera()
})

onMounted(() => {
  startCamera()
})

onUnmounted(() => {
  stopCamera()
})
</script>
