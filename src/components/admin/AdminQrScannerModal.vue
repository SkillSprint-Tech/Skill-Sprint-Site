<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
    <div class="bg-white border border-slate-200/80 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2m-10 0H5a2 2 0 0 1-2-2v-2" />
              <rect x="7" y="7" width="10" height="10" rx="1" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-900 tracking-tight">Live Workshop Check-in</h3>
            <p class="text-[11px] text-slate-400">Scan attendee QR ticket or check in by name/email</p>
          </div>
        </div>

        <button
          type="button"
          @click="closeModal"
          class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Mode Tabs -->
      <div class="flex border-b border-slate-100 bg-slate-50/30 px-6 pt-2">
        <button
          type="button"
          @click="tab = 'camera'"
          class="px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer"
          :class="tab === 'camera' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'"
        >
          Camera QR Scanner
        </button>
        <button
          type="button"
          @click="tab = 'manual'"
          class="px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer"
          :class="tab === 'manual' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'"
        >
          Quick Search Check-in
        </button>
      </div>

      <!-- Body Content -->
      <div class="p-6 overflow-y-auto flex-1 space-y-4">
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

            <!-- Target Reticle Overlay -->
            <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div class="w-48 h-48 border-2 border-blue-500/80 rounded-2xl relative shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                <!-- Corner Accents -->
                <div class="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-blue-400"></div>
                <div class="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-blue-400"></div>
                <div class="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-blue-400"></div>
                <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-blue-400"></div>
                <!-- Scanning Laser Animation -->
                <div class="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-bounce opacity-80 mt-24"></div>
              </div>
            </div>

            <!-- Permission / Camera Warning -->
            <div v-if="cameraError" class="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-6 text-center text-white">
              <p class="text-xs font-medium text-slate-300 mb-3">{{ cameraError }}</p>
              <button
                type="button"
                @click="startCamera"
                class="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-xl font-semibold cursor-pointer"
              >
                Retry Camera
              </button>
            </div>
          </div>

          <p class="text-center text-[11px] text-slate-400">
            Point camera at attendee QR confirmation ticket
          </p>
        </div>

        <!-- Manual Quick Search -->
        <div v-else class="space-y-4">
          <form @submit.prevent="submitSearch" class="flex gap-2">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Search by name, email, or ticket token…"
              class="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-2 focus:outline-blue-600"
              autofocus
            />
            <button
              type="submit"
              :disabled="checkingIn"
              class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              {{ checkingIn ? 'Searching…' : 'Check In' }}
            </button>
          </form>
        </div>

        <!-- Last Checked-In Banner -->
        <div
          v-if="lastCheckedIn"
          class="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3 animate-fade-in"
        >
          <div class="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Checked In Successfully</span>
              <span class="text-[10px] text-slate-400 font-mono">Just now</span>
            </div>
            <p class="text-sm font-bold text-slate-900 truncate mt-0.5">{{ lastCheckedIn.full_name }}</p>
            <p class="text-[11px] text-slate-500 truncate">{{ lastCheckedIn.email }} &bull; {{ lastCheckedIn.university || 'General Attendee' }}</p>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMsg" class="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-700 font-medium">
          {{ errorMsg }}
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
        <span class="font-mono text-[11px]">Auto-verifying against Neon DB</span>
        <button
          type="button"
          @click="closeModal"
          class="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 font-semibold cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
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

    // Attempt native BarcodeDetector scan loop
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
  } catch (err) {
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
  checkingIn.value = true
  errorMsg.value = ''
  try {
    const res = await fetch('/api/admin/check-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, attended: true }),
    })
    const data = await res.json().catch(() => ({}))
    if (data.ok && data.registration) {
      lastCheckedIn.value = data.registration
      playSuccessChime()
      props.toast('success', 'Checked in', data.registration.full_name)
      emit('checked-in', data.registration)
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
