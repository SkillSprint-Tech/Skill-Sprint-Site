<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-md animate-fade-in"
    @click.self="close"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl sm:rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh] animate-scale-in"
    >
      <!-- ═══════════════════ MODAL HEADER ═══════════════════ -->
      <div
        class="px-3.5 sm:px-5 py-3 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 bg-slate-50/90 dark:bg-slate-900/90"
      >
        <!-- Left: Icon & Template Selector Dropdown -->
        <div class="flex items-center gap-2.5 min-w-0">
          <div
            class="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800/70 shrink-0"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <div class="min-w-0 flex flex-col">
            <div class="flex items-center gap-2">
              <span class="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight shrink-0">
                Email Preview
              </span>

              <!-- In-Modal Template Selector Dropdown -->
              <div class="relative">
                <select
                  v-model="activeTemplate"
                  @change="handleTemplateChange"
                  class="border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[170px] sm:max-w-xs truncate"
                >
                  <option value="welcome_schedule">
                    Campaign: Welcome & Schedule
                  </option>
                  <optgroup v-if="workshops.length" label="Workshop Reminders">
                    <option
                      v-for="w in workshops"
                      :key="w.id"
                      :value="`reminder:${w.id}`"
                    >
                      Meeting Link · {{ w.title }}
                    </option>
                  </optgroup>
                </select>
              </div>
            </div>

            <!-- Subject Line HUD -->
            <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[240px] sm:max-w-md mt-0.5">
              Subject:
              <strong class="text-slate-700 dark:text-slate-200 font-medium">
                {{ previewData?.subject || 'Rendering subject…' }}
              </strong>
            </p>
          </div>
        </div>

        <!-- Right: Viewport Mode Switcher & Close -->
        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
          <!-- View Modes: Desktop, Mobile, Plain Text -->
          <div
            class="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 text-xs font-medium"
          >
            <button
              type="button"
              @click="viewMode = 'desktop'"
              class="px-2 sm:px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer text-[11px]"
              :class="
                viewMode === 'desktop'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              "
              title="Desktop viewport (wide table preview)"
            >
              Desktop
            </button>
            <button
              type="button"
              @click="viewMode = 'mobile'"
              class="px-2 sm:px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer text-[11px]"
              :class="
                viewMode === 'mobile'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              "
              title="Mobile viewport (smartphone frame mockup)"
            >
              Mobile
            </button>
            <button
              type="button"
              @click="viewMode = 'text'"
              class="hidden sm:inline-block px-2 sm:px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer text-[11px]"
              :class="
                viewMode === 'text'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              "
              title="Plain text fallback inspected by anti-spam filters"
            >
              Plain Text
            </button>
          </div>

          <!-- Close Modal Button -->
          <button
            type="button"
            @click="close"
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Preview"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- ═══════════════════ PREVIEW CANVAS BODY ═══════════════════ -->
      <div
        class="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 p-2 sm:p-5 flex items-start justify-center transition-colors duration-150"
      >
        <!-- Loading State -->
        <div v-if="loading" class="py-24 text-center space-y-2.5">
          <div
            class="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"
          ></div>
          <p class="text-xs font-mono text-slate-500 dark:text-slate-400">
            Rendering template & inject sample attendee…
          </p>
        </div>

        <!-- Error State -->
        <div
          v-else-if="errorMessage"
          class="py-16 text-center max-w-sm px-4 space-y-3"
        >
          <div class="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="text-xs text-rose-600 dark:text-rose-400 font-semibold">{{ errorMessage }}</p>
          <button
            type="button"
            @click="fetchPreview"
            class="text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
          >
            Retry Preview
          </button>
        </div>

        <!-- Rendered Iframe (Desktop Mode) -->
        <div
          v-else-if="viewMode === 'desktop'"
          class="w-full max-w-[620px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/90 dark:border-slate-800 transition-all duration-200"
        >
          <!-- Desktop Mockup Browser Header Bar -->
          <div
            class="bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between"
          >
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            </div>
            <span class="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate max-w-[200px]">
              {{ previewData?.subject || 'Inbox Preview' }}
            </span>
            <div class="w-8"></div>
          </div>

          <iframe
            :srcdoc="previewData?.html"
            class="w-full h-[58vh] min-h-[460px] max-h-[660px] border-0 bg-white"
            title="Desktop HTML Email Preview"
          ></iframe>
        </div>

        <!-- Rendered Iframe (Mobile Phone Mockup Mode) -->
        <div
          v-else-if="viewMode === 'mobile'"
          class="w-full max-w-[360px] bg-slate-900 border-4 border-slate-800 dark:border-slate-700 rounded-[36px] shadow-2xl overflow-hidden transition-all duration-200"
        >
          <!-- Smartphone Status Bar Notch -->
          <div
            class="bg-slate-900 text-slate-300 px-5 py-2 text-[10px] font-mono flex items-center justify-between select-none border-b border-slate-800"
          >
            <span class="font-bold">9:41</span>
            <div class="w-14 h-3 bg-slate-800 rounded-full mx-auto"></div>
            <div class="flex items-center gap-1">
              <span>5G</span>
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
              </svg>
            </div>
          </div>

          <iframe
            :srcdoc="previewData?.html"
            class="w-full h-[58vh] min-h-[460px] max-h-[640px] border-0 bg-white"
            title="Mobile HTML Email Preview"
          ></iframe>

          <!-- Smartphone Home Bar -->
          <div class="bg-slate-900 py-1.5 flex justify-center">
            <div class="w-24 h-1 bg-slate-700 rounded-full"></div>
          </div>
        </div>

        <!-- Plain Text Fallback View -->
        <div
          v-else-if="viewMode === 'text'"
          class="w-full max-w-[620px] bg-slate-900 text-slate-200 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col transition-all duration-200"
        >
          <div
            class="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400"
          >
            <span>text/plain MIME Payload</span>
            <button
              type="button"
              @click="copyText"
              class="text-blue-400 hover:text-blue-300 text-[11px] font-semibold cursor-pointer"
            >
              {{ copied ? 'Copied!' : 'Copy Plain Text' }}
            </button>
          </div>
          <pre
            class="p-4 text-xs font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed overflow-y-auto h-[58vh] min-h-[460px] max-h-[660px] selection:bg-emerald-500/30 selection:text-white"
          >{{ previewData?.text || 'No plain text rendered.' }}</pre>
        </div>
      </div>

      <!-- ═══════════════════ MODAL FOOTER & TEST DISPATCH ═══════════════════ -->
      <div
        class="px-3.5 sm:px-5 py-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
      >
        <!-- Test Dispatch Form -->
        <form
          @submit.prevent="sendTestEmail"
          class="flex items-center gap-2 flex-1 min-w-0"
        >
          <label
            for="testEmail"
            class="text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase shrink-0"
          >
            Live Test:
          </label>
          <input
            id="testEmail"
            v-model="testEmailInput"
            type="email"
            required
            placeholder="organizer@university.edu"
            class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
          <button
            type="submit"
            :disabled="sendingTest || !testEmailInput"
            class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs disabled:opacity-50 shrink-0 flex items-center gap-1.5 active:scale-[0.98]"
          >
            <svg
              v-if="sendingTest"
              class="w-3 h-3 animate-spin"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" class="opacity-25" />
              <path d="M8 2a6 6 0 016 6" stroke="currentColor" stroke-width="2" class="opacity-75" />
            </svg>
            <span>{{ sendingTest ? 'Dispatching…' : 'Send Test' }}</span>
          </button>
        </form>

        <!-- Right Action: Close -->
        <div class="flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            @click="close"
            class="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  template: { type: String, default: 'welcome_schedule' },
  workshops: { type: Array, default: () => [] },
  toast: { type: Function, default: () => {} },
})

const emit = defineEmits(['close', 'template-change'])

const activeTemplate = ref(props.template || 'welcome_schedule')
const viewMode = ref('desktop')
const loading = ref(false)
const errorMessage = ref('')
const previewData = ref(null)
const testEmailInput = ref('')
const sendingTest = ref(false)
const copied = ref(false)

watch(
  () => props.template,
  (newVal) => {
    if (newVal && newVal !== activeTemplate.value) {
      activeTemplate.value = newVal
      fetchPreview()
    }
  }
)

const handleTemplateChange = () => {
  emit('template-change', activeTemplate.value)
  fetchPreview()
}

const fetchPreview = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const res = await fetch('/api/admin/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        preview: true,
        template: activeTemplate.value,
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (data.ok) {
      previewData.value = data
    } else {
      errorMessage.value = data.message || 'Could not render email preview from backend.'
      props.toast('error', 'Preview render error', errorMessage.value)
    }
  } catch (err) {
    errorMessage.value = err.message || 'Network error'
    props.toast('error', 'Network error', err.message)
  } finally {
    loading.value = false
  }
}

const sendTestEmail = async () => {
  const target = testEmailInput.value.trim()
  if (!target || sendingTest.value) return
  sendingTest.value = true
  try {
    const res = await fetch('/api/admin/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        testEmail: target,
        template: activeTemplate.value,
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (data.ok && data.testSent) {
      props.toast(
        'success',
        'Test email delivered',
        `Dispatched via ${data.provider || 'default provider'} to ${data.to}`
      )
    } else {
      props.toast('error', 'Test send failed', data.message || '')
    }
  } catch (err) {
    props.toast('error', 'Network error during test dispatch', err.message)
  } finally {
    sendingTest.value = false
  }
}

const copyText = async () => {
  if (!previewData.value?.text) return
  try {
    await navigator.clipboard.writeText(previewData.value.text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // ignore
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
