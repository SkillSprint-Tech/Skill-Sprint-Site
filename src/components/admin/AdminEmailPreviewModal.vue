<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in"
    @click.self="close"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-scale-in"
    >
      <!-- Modal Header -->
      <div class="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/60">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Live Email Template Preview
              </h3>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                {{ templateLabel }}
              </span>
            </div>
            <p class="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
              Subject: <strong class="text-slate-700 dark:text-slate-300 font-medium">{{ previewData?.subject || 'Loading subject…' }}</strong>
            </p>
          </div>
        </div>

        <!-- Viewport Switcher & Close -->
        <div class="flex items-center gap-2">
          <div class="hidden sm:flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 text-xs">
            <button
              type="button"
              @click="device = 'desktop'"
              class="px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer"
              :class="device === 'desktop' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs' : 'text-slate-500 hover:text-slate-700'"
            >
              Desktop
            </button>
            <button
              type="button"
              @click="device = 'mobile'"
              class="px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer"
              :class="device === 'mobile' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs' : 'text-slate-500 hover:text-slate-700'"
            >
              Mobile
            </button>
          </div>

          <button
            type="button"
            @click="close"
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Preview Body Container -->
      <div class="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 flex items-start justify-center">
        <!-- Loading State -->
        <div v-if="loading" class="py-20 text-center space-y-2">
          <div class="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p class="text-xs text-slate-500">Rendering HTML email template…</p>
        </div>

        <!-- Rendered Iframe Content -->
        <div
          v-else
          class="transition-all duration-300 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/80"
          :class="device === 'desktop' ? 'w-full max-w-[620px]' : 'w-[375px] border-4 border-slate-800 rounded-[32px]'"
        >
          <!-- Mobile Status Bar Mockup -->
          <div v-if="device === 'mobile'" class="bg-slate-900 text-white px-4 py-1.5 text-[10px] font-mono flex items-center justify-between">
            <span>9:41</span>
            <div class="flex items-center gap-1 text-[10px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          <iframe
            :srcdoc="previewData?.html"
            class="w-full h-[520px] border-0"
            sandbox="allow-same-origin"
          ></iframe>
        </div>
      </div>

      <!-- Footer Test Dispatcher -->
      <div class="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
        <form @submit.prevent="sendTestEmail" class="flex items-center gap-2 flex-1 min-w-[280px]">
          <label class="text-[11px] font-mono font-bold text-slate-500 uppercase shrink-0">
            Send Test:
          </label>
          <input
            v-model="testEmailInput"
            type="email"
            required
            placeholder="organizer@gmail.com"
            class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 flex-1 max-w-xs focus:outline-2 focus:outline-blue-600"
          />
          <button
            type="submit"
            :disabled="sendingTest || !testEmailInput"
            class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs disabled:opacity-50 shrink-0"
          >
            {{ sendingTest ? 'Sending…' : 'Send Test to Me' }}
          </button>
        </form>

        <button
          type="button"
          @click="close"
          class="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  template: { type: String, default: 'welcome_schedule' },
  workshops: { type: Array, default: () => [] },
  toast: { type: Function, default: () => {} },
})

const emit = defineEmits(['close'])

const loading = ref(false)
const device = ref('desktop')
const previewData = ref(null)
const testEmailInput = ref('')
const sendingTest = ref(false)

const templateLabel = computed(() => {
  if (props.template === 'welcome_schedule') return 'Welcome Schedule'
  if (props.template.startsWith('reminder:')) {
    const id = props.template.replace('reminder:', '')
    const w = props.workshops.find((w) => w.id === id)
    return w ? `Meeting Link · ${w.title}` : 'Meeting Link Reminder'
  }
  return props.template
})

const fetchPreview = async () => {
  loading.value = true
  try {
    const res = await fetch('/api/admin/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        preview: true,
        template: props.template,
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (data.ok) {
      previewData.value = data
    } else {
      props.toast('error', 'Could not load preview', data.message || '')
    }
  } catch (err) {
    props.toast('error', 'Network error', err.message)
  } finally {
    loading.value = false
  }
}

const sendTestEmail = async () => {
  if (!testEmailInput.value.trim() || sendingTest.value) return
  sendingTest.value = true
  try {
    const res = await fetch('/api/admin/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        testEmail: testEmailInput.value.trim(),
        template: props.template,
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (data.ok && data.testSent) {
      props.toast(
        'success',
        'Test email delivered',
        `Sent via ${data.provider || 'configured provider'} to ${data.to}`
      )
    } else {
      props.toast('error', 'Test send failed', data.message || '')
    }
  } catch (err) {
    props.toast('error', 'Network error during test send', err.message)
  } finally {
    sendingTest.value = false
  }
}

const close = () => {
  emit('close')
}

onMounted(() => {
  fetchPreview()
})

defineExpose({ fetchPreview, close })
</script>
