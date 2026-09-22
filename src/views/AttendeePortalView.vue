<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
    <!-- Top Navigation Header -->
    <header class="w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-2 group">
          <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
            SS
          </div>
          <span class="font-extrabold tracking-tight text-slate-900 text-sm sm:text-base">
            SkillSprint <span class="text-blue-600">Portal</span>
          </span>
        </router-link>

        <div class="flex items-center gap-3">
          <template v-if="step === 'dashboard'">
            <div class="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span class="font-mono">{{ portalEmail }}</span>
            </div>
            <button
              type="button"
              @click="logout"
              class="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/60 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </template>
          <template v-else>
            <router-link
              to="/workshops"
              class="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              Workshops &rarr;
            </router-link>
          </template>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <!-- Ambient Glow Background -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Initial Session Checking Spinner -->
      <div v-if="checkingSession" class="text-center py-20 relative z-10">
        <div class="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
          Verifying Attendee Credentials…
        </p>
      </div>

      <!-- ── LOGIN FORM CONTAINER ──────────────────────────────────────── -->
      <div
        v-else-if="step === 'email' || step === 'otp'"
        class="w-full max-w-md bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative z-10"
      >
        <!-- Icon & Title -->
        <div class="text-center mb-6">
          <div class="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-3 shadow-xs">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h1 class="text-xl font-black text-slate-900 tracking-tight">
            Attendee Access Portal
          </h1>
          <p class="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Zero-password access to your registered workshops, live links, and verified certificates.
          </p>
        </div>

        <!-- Error Notification -->
        <div
          v-if="errorMessage"
          class="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2"
        >
          <svg class="w-4 h-4 shrink-0 mt-0.5 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Success Notification -->
        <div
          v-if="successMessage"
          class="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2"
        >
          <svg class="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span>{{ successMessage }}</span>
        </div>

        <!-- Step 1: Email Form -->
        <form v-if="step === 'email'" @submit.prevent="submitEmail" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
              Registered Email Address
            </label>
            <input
              v-model="emailInput"
              type="email"
              required
              placeholder="you@university.edu"
              autocomplete="email"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-2 focus:outline-blue-600 transition-all"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ loading ? 'Sending Passcode…' : 'Send 6-Digit Passcode' }}</span>
          </button>
        </form>

        <!-- Step 2: OTP Form -->
        <form v-else-if="step === 'otp'" @submit.prevent="submitOtp" class="space-y-4">
          <div class="text-center pb-2">
            <p class="text-xs text-slate-600">
              We emailed a 6-digit passcode to<br/>
              <strong class="font-mono text-slate-900">{{ emailInput }}</strong>
            </p>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono text-center">
              Enter 6-Digit Code
            </label>
            <input
              v-model="otpInput"
              type="text"
              required
              maxlength="6"
              pattern="[0-9]{6}"
              placeholder="123456"
              inputmode="numeric"
              autocomplete="one-time-code"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-center text-2xl font-mono tracking-[0.4em] font-extrabold text-blue-600 placeholder:text-slate-300 focus:bg-white focus:outline-2 focus:outline-blue-600 transition-all"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ loading ? 'Verifying…' : 'Access My Portal' }}</span>
          </button>

          <div class="flex items-center justify-between pt-2 text-xs">
            <button
              type="button"
              @click="resendOtp"
              :disabled="loading"
              class="text-blue-600 hover:underline font-medium cursor-pointer"
            >
              Resend Code
            </button>
            <button
              type="button"
              @click="step = 'email'; otpInput = ''; errorMessage = ''"
              class="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Use different email
            </button>
          </div>
        </form>

        <!-- Security Footnote -->
        <div class="mt-6 pt-4 border-t border-slate-100 text-center">
          <p class="text-[11px] text-slate-400">
            Secure, passwordless verification powered by SkillSprint identity.
          </p>
        </div>
      </div>

      <!-- ── DASHBOARD VIEW ────────────────────────────────────────────── -->
      <div v-else-if="step === 'dashboard'" class="w-full max-w-5xl mx-auto space-y-6 relative z-10 py-4">
        <!-- Welcome Banner Card -->
        <div class="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                  Verified Attendee
                </span>
                <span class="text-xs font-mono text-slate-400">{{ portalData?.profile?.university || 'Engineering Community' }}</span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Welcome back, {{ portalData?.profile?.name || 'Engineer' }}!
              </h1>
              <p class="text-xs sm:text-sm text-slate-500 mt-1">
                Access your workshop schedule, live session links, and verified completion credentials.
              </p>
            </div>

            <!-- Stats Counters -->
            <div class="grid grid-cols-3 gap-3 shrink-0">
              <div class="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center min-w-[80px]">
                <span class="block text-xl font-black text-slate-900">{{ portalData?.stats?.totalRegistered || 0 }}</span>
                <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Enrolled</span>
              </div>
              <div class="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3 text-center min-w-[80px]">
                <span class="block text-xl font-black text-emerald-700">{{ portalData?.stats?.totalAttended || 0 }}</span>
                <span class="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Attended</span>
              </div>
              <div class="bg-blue-50/60 border border-blue-100 rounded-2xl p-3 text-center min-w-[80px]">
                <span class="block text-xl font-black text-blue-700">{{ portalData?.stats?.totalCertificates || 0 }}</span>
                <span class="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Certificates</span>
              </div>
            </div>
          </div>

          <!-- Section Switcher Tabs -->
          <div class="flex items-center gap-2 mt-6 pt-6 border-t border-slate-100">
            <button
              type="button"
              @click="activeTab = 'workshops'"
              class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
              :class="activeTab === 'workshops' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'"
            >
              <span>🎟️ My Workshops</span>
              <span class="px-1.5 py-0.2 rounded-full text-[10px]" :class="activeTab === 'workshops' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'">
                {{ portalData?.registrations?.length || 0 }}
              </span>
            </button>
            <button
              type="button"
              @click="activeTab = 'certificates'"
              class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
              :class="activeTab === 'certificates' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'"
            >
              <span>📜 Certificate Vault</span>
              <span class="px-1.5 py-0.2 rounded-full text-[10px]" :class="activeTab === 'certificates' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'">
                {{ portalData?.certificates?.length || 0 }}
              </span>
            </button>
          </div>
        </div>

        <!-- ── TAB 1: WORKSHOPS & EVENTS ─────────────────────────────── -->
        <div v-if="activeTab === 'workshops'" class="space-y-4">
          <div v-if="!portalData?.registrations || portalData.registrations.length === 0" class="bg-white rounded-3xl p-10 text-center border border-slate-200/80">
            <p class="text-sm font-semibold text-slate-600 mb-2">No workshop registrations found.</p>
            <p class="text-xs text-slate-400 mb-4">You have not registered for any SkillSprint workshops yet.</p>
            <router-link to="/workshops" class="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors">
              Explore Upcoming Workshops &rarr;
            </router-link>
          </div>

          <div
            v-for="reg in portalData.registrations"
            :key="reg.id"
            class="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs hover:border-blue-200 transition-all"
          >
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <!-- Workshop Info -->
              <div class="space-y-1.5 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    :class="{
                      'bg-emerald-100 text-emerald-800 border border-emerald-200': reg.attended,
                      'bg-blue-100 text-blue-800 border border-blue-200': !reg.attended && reg.status === 'upcoming',
                      'bg-amber-100 text-amber-800 border border-amber-200': !reg.attended && reg.status === 'live',
                      'bg-slate-100 text-slate-700 border border-slate-200': !reg.attended && reg.status === 'completed',
                    }"
                  >
                    {{ reg.attended ? '✓ Checked In & Attended' : reg.status }}
                  </span>

                  <span class="text-xs text-slate-400 font-mono">
                    {{ formatDate(reg.starts_at) }}
                  </span>
                </div>

                <h3 class="text-lg font-bold text-slate-900 tracking-tight">
                  {{ reg.workshop_title }}
                </h3>

                <p v-if="reg.speaker" class="text-xs text-slate-500">
                  Speaker: <strong class="text-slate-700">{{ reg.speaker }}</strong> <span v-if="reg.speaker_role">({{ reg.speaker_role }})</span>
                </p>
              </div>

              <!-- Action Buttons / Links -->
              <div class="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
                <!-- Join Meeting Link (if workshop is upcoming/live and link exists) -->
                <a
                  v-if="reg.meeting_link && reg.status !== 'completed'"
                  :href="reg.meeting_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 10l5-5v14l-5-5" />
                    <rect x="2" y="6" width="13" height="12" rx="2" />
                  </svg>
                  <span>Join Session</span>
                </a>

                <!-- Post-Workshop Resources -->
                <a
                  v-if="reg.recording_url"
                  :href="reg.recording_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="bg-rose-50 hover:bg-rose-100/80 text-rose-700 border border-rose-200 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
                >
                  <span>🎥 Recording</span>
                </a>
                <a
                  v-if="reg.slides_url"
                  :href="reg.slides_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="bg-amber-50 hover:bg-amber-100/80 text-amber-800 border border-amber-200 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
                >
                  <span>📑 Slides</span>
                </a>
                <a
                  v-if="reg.repo_url"
                  :href="reg.repo_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
                >
                  <span>💻 Code</span>
                </a>
              </div>
            </div>

            <div v-if="reg.resources_notes" class="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 bg-slate-50/50 p-2.5 rounded-lg">
              <span class="font-bold text-slate-700">Workshop Notes:</span> {{ reg.resources_notes }}
            </div>
          </div>
        </div>

        <!-- ── TAB 2: CERTIFICATE VAULT ──────────────────────────────── -->
        <div v-else-if="activeTab === 'certificates'" class="space-y-4">
          <div v-if="!portalData?.certificates || portalData.certificates.length === 0" class="bg-white rounded-3xl p-10 text-center border border-slate-200/80">
            <div class="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mx-auto mb-3">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
            </div>
            <h3 class="text-base font-bold text-slate-900 mb-1">No Certificates Issued Yet</h3>
            <p class="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Certificates of completion are issued by organizers following live workshop attendance and project submissions.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="cert in portalData.certificates"
              :key="cert.id"
              class="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:border-blue-200 transition-all space-y-5"
            >
              <div>
                <div class="flex items-center justify-between gap-2 mb-3">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Official Certificate
                  </span>
                  <span class="text-[11px] font-mono text-slate-400">
                    ID: {{ cert.verification_code }}
                  </span>
                </div>

                <h3 class="text-base font-bold text-slate-900 leading-snug">
                  {{ cert.workshop_title }}
                </h3>
                <p class="text-xs text-slate-500 mt-1">
                  Issued to <strong class="text-slate-800">{{ cert.recipient_name }}</strong> on {{ formatDate(cert.issued_at || cert.created_at) }}
                </p>
              </div>

              <!-- Action Links -->
              <div class="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
                <router-link
                  :to="`/verify/${cert.verification_code}`"
                  class="w-full sm:w-auto flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all text-center cursor-pointer shadow-xs"
                >
                  View Credential &rarr;
                </router-link>

                <a
                  :href="getLinkedInCertUrl(cert)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-full sm:w-auto bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold px-3 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Add to LinkedIn Profile"
                >
                  <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="w-full py-4 text-center border-t border-slate-100 bg-white/50 text-[11px] text-slate-400 font-mono">
      SkillSprint Attendee Self-Service Portal &bull; Verified Technical Ledger
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const step = ref('email') // 'email' | 'otp' | 'dashboard'
const checkingSession = ref(true)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const emailInput = ref('')
const otpInput = ref('')
const portalEmail = ref('')
const portalData = ref(null)
const activeTab = ref('workshops')

const formatDate = (iso) => {
  if (!iso) return 'Recent'
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return String(iso).slice(0, 10)
  }
}

const getLinkedInCertUrl = (cert) => {
  if (!cert) return '#'
  const issueDate = cert.issued_at ? new Date(cert.issued_at) : new Date()
  const verifyUrl = `${window.location.origin}/verify/${cert.verification_code}`
  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: `${cert.workshop_title} — SkillSprint Workshop`,
    organizationName: 'SkillSprint',
    issueYear: String(issueDate.getFullYear()),
    issueMonth: String(issueDate.getMonth() + 1),
    certUrl: verifyUrl,
    certId: cert.verification_code,
  })
  return `https://www.linkedin.com/profile/add?${params.toString()}`
}

const checkExistingSession = async () => {
  checkingSession.value = true
  try {
    const res = await fetch('/api/portal?action=data')
    const data = await res.json().catch(() => ({}))
    if (res.ok && data.ok) {
      portalData.value = data
      portalEmail.value = data.email
      step.value = 'dashboard'
    } else {
      step.value = 'email'
    }
  } catch {
    step.value = 'email'
  } finally {
    checkingSession.value = false
  }
}

const submitEmail = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true
  try {
    const res = await fetch('/api/portal?action=send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput.value.trim() }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.ok) {
      errorMessage.value = data.message || 'Could not send passcode. Please verify your email.'
      return
    }

    successMessage.value = data.message || 'Passcode sent! Check your inbox.'
    step.value = 'otp'
    if (data.devOtp) {
      console.info('Development OTP code:', data.devOtp)
      otpInput.value = data.devOtp
    }
  } catch (err) {
    errorMessage.value = err.message || 'Network error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}

const resendOtp = async () => {
  await submitEmail()
}

const submitOtp = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true
  try {
    const res = await fetch('/api/portal?action=verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailInput.value.trim(),
        code: otpInput.value.trim(),
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.ok) {
      errorMessage.value = data.message || 'Incorrect verification code. Please try again.'
      return
    }

    portalEmail.value = data.email
    await checkExistingSession()
  } catch (err) {
    errorMessage.value = err.message || 'Network error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}

const logout = async () => {
  try {
    await fetch('/api/portal?action=logout', { method: 'POST' })
  } catch {
    /* ignore */
  }
  portalData.value = null
  portalEmail.value = ''
  otpInput.value = ''
  step.value = 'email'
}

onMounted(() => {
  checkExistingSession()
})
</script>
