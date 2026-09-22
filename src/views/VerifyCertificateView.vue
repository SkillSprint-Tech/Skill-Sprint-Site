<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
    <!-- Top Navigation Header -->
    <header class="w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-2 group">
          <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
            SS
          </div>
          <span class="font-extrabold tracking-tight text-slate-900 text-sm sm:text-base">
            SkillSprint <span class="text-blue-600">Verification</span>
          </span>
        </router-link>

        <div class="flex items-center gap-4">
          <router-link
            to="/portal"
            class="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            Attendee Portal &rarr;
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden">
      <!-- Background Ambient Glows -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20 relative z-10">
        <div class="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-xs font-semibold text-slate-500 tracking-wide uppercase font-mono">
          Verifying Credential on Neon Ledger…
        </p>
      </div>

      <!-- ── STATE 1: VERIFIED CERTIFICATE CARD ──────────────────────── -->
      <div
        v-else-if="cert && certValid"
        class="w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative z-10 transition-all"
      >
        <!-- Verified Header Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shadow-xs shrink-0">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100/70 text-emerald-800 border border-emerald-200/60">
                  Verified Credential
                </span>
                <span class="text-[11px] font-mono text-slate-400">
                  ID: {{ cert.verification_code }}
                </span>
              </div>
              <h1 class="text-lg font-black text-slate-900 tracking-tight mt-1">
                Official SkillSprint Certificate of Completion
              </h1>
            </div>
          </div>

          <button
            type="button"
            @click="copyLink"
            class="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2z"/>
            </svg>
            <span>{{ copied ? 'Link Copied!' : 'Copy Link' }}</span>
          </button>
        </div>

        <!-- Recipient & Workshop Details -->
        <div class="py-8 space-y-6">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Issued To</span>
            <p class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
              {{ cert.recipient_name }}
            </p>
            <p v-if="cert.recipient_email_masked" class="text-xs text-slate-400 font-mono mt-0.5">
              Verified email: {{ cert.recipient_email_masked }}
            </p>
          </div>

          <div class="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-5 space-y-4">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Workshop Completed</span>
              <p class="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                {{ cert.workshop_title }}
              </p>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-200/50 text-xs">
              <div>
                <span class="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Speaker</span>
                <span class="font-semibold text-slate-800">{{ cert.speaker || 'SkillSprint Technical Team' }}</span>
              </div>
              <div>
                <span class="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Date Issued</span>
                <span class="font-semibold text-slate-800">{{ formatDate(cert.issued_at) }}</span>
              </div>
              <div class="col-span-2 sm:col-span-1">
                <span class="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Issuer</span>
                <span class="font-semibold text-slate-800">{{ cert.issuer }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-slate-100">
          <a
            :href="linkedInUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full sm:w-auto flex-1 bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-[0.98]"
          >
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
            <span>Add to LinkedIn Profile</span>
          </a>

          <router-link
            to="/portal"
            class="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold text-center transition-all cursor-pointer"
          >
            Access All My Certificates &rarr;
          </router-link>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            @click="clearSearch"
            class="text-xs font-medium text-slate-400 hover:text-blue-600 cursor-pointer"
          >
            &larr; Verify another credential
          </button>
        </div>
      </div>

      <!-- ── STATE 2: SEARCH / PORTAL HOMEPAGE (No Code Provided) ─────── -->
      <div
        v-else-if="!currentCode"
        class="w-full max-w-lg bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative z-10 text-center"
      >
        <div class="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-4 shadow-xs">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>

        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Verify SkillSprint Credential
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
          Cryptographically verify the validity, recipient identity, and workshop completion details of official SkillSprint certificates.
        </p>

        <!-- Search Form -->
        <form @submit.prevent="lookupCode" class="mt-6 space-y-3">
          <div class="relative">
            <input
              v-model="searchInput"
              type="text"
              required
              placeholder="Enter verification code (e.g. ss-demo-2026-cert)"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-2 focus:outline-blue-600 transition-all"
            />
          </div>

          <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Verify Credential Status &rarr;</span>
          </button>
        </form>

        <!-- Demo Quick Test Helper -->
        <div class="mt-6 pt-5 border-t border-slate-100">
          <p class="text-[11px] text-slate-400 mb-2">Want to test verification? Try our live sample credential:</p>
          <button
            type="button"
            @click="testDemoCode"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100/80 border border-blue-200/60 text-xs font-mono font-bold text-blue-700 transition-all cursor-pointer"
          >
            <span>📜</span>
            <span>ss-demo-2026-cert</span>
          </button>
        </div>
      </div>

      <!-- ── STATE 3: NOT FOUND / INVALID CODE ───────────────────────── -->
      <div
        v-else
        class="w-full max-w-md bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl text-center relative z-10"
      >
        <div class="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-500 mx-auto mb-4">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h2 class="text-base font-bold text-slate-900 mb-1">
          Credential Not Found
        </h2>
        <p class="text-xs text-slate-500 leading-relaxed mb-6">
          No issued certificate was located for verification code: <code class="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-bold">{{ currentCode }}</code>
        </p>

        <form @submit.prevent="lookupCode" class="flex gap-2">
          <input
            v-model="searchInput"
            type="text"
            required
            placeholder="Try another code…"
            class="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-2 focus:outline-blue-600"
          />
          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Verify
          </button>
        </form>

        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            type="button"
            @click="testDemoCode"
            class="text-blue-600 hover:underline font-medium cursor-pointer"
          >
            Try sample code
          </button>
          <router-link to="/" class="text-slate-400 hover:text-slate-700">
            Return Home &rarr;
          </router-link>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="w-full py-4 text-center border-t border-slate-100 bg-white/50 text-[11px] text-slate-400 font-mono">
      SkillSprint Cryptographic Credential Verification System &bull; Neon Postgres Ledger
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const currentCode = computed(() => String(route.params.code || route.query.code || '').trim())
const searchInput = ref('')
const loading = ref(false)
const certValid = ref(false)
const cert = ref(null)
const copied = ref(false)

const formatDate = (iso) => {
  if (!iso) return 'Recent'
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return String(iso).slice(0, 10)
  }
}

const linkedInUrl = computed(() => {
  if (!cert.value) return '#'
  const issueDate = cert.value.issued_at ? new Date(cert.value.issued_at) : new Date()
  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: `${cert.value.workshop_title} — SkillSprint Workshop`,
    organizationName: 'SkillSprint',
    issueYear: String(issueDate.getFullYear()),
    issueMonth: String(issueDate.getMonth() + 1),
    certUrl: window.location.href,
    certId: cert.value.verification_code,
  })
  return `https://www.linkedin.com/profile/add?${params.toString()}`
})

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => { copied.value = false }, 3000)
  } catch {
    /* ignore clipboard permissions failure */
  }
}

const verifyCode = async (targetCode) => {
  if (!targetCode) {
    loading.value = false
    certValid.value = false
    cert.value = null
    return
  }

  loading.value = true
  try {
    const res = await fetch(`/api/verify-certificate?code=${encodeURIComponent(targetCode)}`)
    const data = await res.json().catch(() => ({}))
    if (res.ok && data.ok && data.valid && data.certificate) {
      certValid.value = true
      cert.value = data.certificate
      document.title = `Verified Certificate: ${data.certificate.recipient_name} — SkillSprint`
    } else {
      certValid.value = false
      cert.value = null
    }
  } catch {
    certValid.value = false
    cert.value = null
  } finally {
    loading.value = false
  }
}

const lookupCode = () => {
  const clean = searchInput.value.trim()
  if (!clean) return
  router.push(`/verify/${clean}`)
}

const testDemoCode = () => {
  searchInput.value = 'ss-demo-2026-cert'
  router.push('/verify/ss-demo-2026-cert')
}

const clearSearch = () => {
  searchInput.value = ''
  cert.value = null
  certValid.value = false
  router.push('/verify')
}

watch(currentCode, (newCode) => {
  verifyCode(newCode)
})

onMounted(() => {
  if (currentCode.value) {
    verifyCode(currentCode.value)
  } else {
    loading.value = false
  }
})
</script>
