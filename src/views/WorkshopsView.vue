<template>
  <div ref="pageScope" class="overflow-x-hidden">

    <!-- ═══════════════════════════════════════ -->
    <!-- HERO -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="heroScope" class="px-4 sm:px-6 relative bg-[#F8FAFC] pt-10 sm:pt-14 md:pt-20 pb-10 md:pb-16 text-center overflow-hidden">

      <div class="hidden sm:block pointer-events-none select-none" aria-hidden="true">
        <div v-for="(tag, i) in floatingTags" :key="i"
             class="absolute bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag"
             :class="tag.position" style="font-family: 'Handlee', cursive;">
          {{ tag.label }}
        </div>
      </div>

      <div class="relative z-10">
        <h1 class="hero-heading h-display text-gray-900 leading-[1.1] mb-4">
          Free Workshops.<br />
          <span class="text-blue-600">Real Skills.</span>
        </h1>
        <p class="hero-sub max-w-xs sm:max-w-sm md:max-w-2xl mx-auto text-gray-500 text-sm sm:text-base md:text-lg mb-8 leading-relaxed px-2">
          Hands-on sessions run by student engineers, open to everyone, costing nothing.
          Register once and we'll email you the full schedule.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <a href="#register"
             class="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-full font-semibold
                    hover:bg-blue-700 transition-colors duration-200 shadow-sm shadow-blue-100">
            Register for the series
          </a>
          <span class="inline-block bg-blue-50 text-blue-600 text-xs font-extrabold px-4 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest">
            Workshops
          </span>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- UPCOMING -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="upcomingScope" class="bg-slate-50 section border-y border-gray-100">
      <div class="max-w-7xl mx-auto">

        <div class="mb-10 md:mb-14">
          <h2 class="upcoming-heading text-gray-900 h-section">
            What's Coming Up
          </h2>
          <p class="upcoming-sub text-gray-500 text-base sm:text-lg mt-2 font-medium">
            Every session is free. No prerequisites, no catch.
          </p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="n in 3" :key="n"
               class="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse">
            <div class="h-5 w-24 bg-gray-100 rounded-full mb-4"></div>
            <div class="h-6 w-3/4 bg-gray-100 rounded mb-3"></div>
            <div class="h-4 w-full bg-gray-100 rounded mb-2"></div>
            <div class="h-4 w-2/3 bg-gray-100 rounded"></div>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="loadError"
             class="bg-white border border-red-100 rounded-2xl p-8 text-center">
          <p class="text-gray-900 font-bold mb-1">Couldn't load the schedule</p>
          <p class="text-gray-500 text-sm mb-5">{{ loadError }}</p>
          <button @click="loadWorkshops"
                  class="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors duration-200">
            Try again
          </button>
        </div>

        <!-- Empty -->
        <div v-else-if="!upcoming.length"
             class="bg-white border border-gray-100 rounded-2xl p-10 sm:p-14 text-center">
          <p class="text-4xl mb-4" aria-hidden="true">🗓️</p>
          <p class="text-gray-900 font-bold text-lg mb-2">No sessions scheduled right now</p>
          <p class="text-gray-500 text-sm max-w-md mx-auto mb-6">
            The next block is still being planned. Register below and you'll be the first to know
            when dates go live.
          </p>
          <a href="#register"
             class="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors duration-200">
            Get notified
          </a>
        </div>

        <!-- Grid -->
        <div v-else class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <article v-for="w in upcoming" :key="w.id"
                   class="workshop-card group bg-white border border-gray-100 rounded-2xl p-6 flex flex-col
                          hover:border-blue-200 transition-colors duration-200">

            <div class="flex items-start justify-between gap-3 mb-4">
              <div class="flex flex-col items-center justify-center bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 flex-shrink-0">
                <span class="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 leading-none">
                  {{ monthOf(w.starts_at) }}
                </span>
                <span class="text-xl font-extrabold text-gray-900 leading-tight tabular-nums">
                  {{ dayOf(w.starts_at) }}
                </span>
              </div>
              <StatusBadge :status="badgeLabel(w)" />
            </div>

            <div v-if="w.status === 'live'"
                 class="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-3">
              <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse mt-1.5 flex-shrink-0" aria-hidden="true"></span>
              <p class="text-red-700 text-xs font-semibold leading-relaxed">
                Happening right now.
                <template v-if="w.has_meeting_link">
                  The join link is in the email we sent you.
                </template>
                <template v-else>
                  We're sharing the join link by email shortly.
                </template>
              </p>
            </div>

            <h3 class="text-lg font-extrabold text-gray-900 tracking-tight mb-1.5 group-hover:text-blue-600 transition-colors duration-200">
              {{ w.title }}
            </h3>
            <!-- Focus area: what the session actually covers. Shown whether or not a
                 speaker has been named yet. -->
            <p v-if="w.speaker_role" class="text-blue-600 text-xs font-bold uppercase tracking-wider mb-2.5">
              {{ w.speaker_role }}
            </p>
            <p v-if="w.description" class="text-gray-500 text-sm leading-relaxed mb-4 flex-1">
              {{ w.description }}
            </p>

            <dl class="flex flex-col gap-1.5 text-xs text-gray-500 font-mono pt-4 border-t border-gray-100">
              <div v-if="w.speaker" class="flex gap-2">
                <dt class="sr-only">Speaker</dt>
                <dd><span aria-hidden="true">🎙️</span> {{ w.speaker }}</dd>
              </div>
              <div class="flex gap-2">
                <dt class="sr-only">Time</dt>
                <dd><span aria-hidden="true">🕒</span> {{ timeOf(w.starts_at) }} · {{ w.duration_mins }} min</dd>
              </div>
              <div v-if="w.location" class="flex gap-2">
                <dt class="sr-only">Location</dt>
                <dd><span aria-hidden="true">📍</span> {{ w.location }}</dd>
              </div>
              <div v-if="w.seats != null" class="flex gap-2">
                <dt class="sr-only">Seats</dt>
                <dd><span aria-hidden="true">💺</span> {{ w.seats }} seats</dd>
              </div>
              <div class="flex gap-2">
                <dt class="sr-only">Join link</dt>
                <dd :class="w.has_meeting_link ? 'text-emerald-600' : 'text-gray-400'">
                  <span aria-hidden="true">🔗</span>
                  {{ w.has_meeting_link ? 'Join link ready — emailed to registrants' : 'Join link emailed before the session' }}
                </dd>
              </div>
            </dl>
          </article>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- CANCELLED -->
    <!-- A cancelled session is not "already delivered", so it gets its own block rather
         than being quietly filed under past sessions. -->
    <!-- ═══════════════════════════════════════ -->
    <section v-if="cancelled.length" class="bg-slate-50 section border-b border-gray-100">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8">
          <h2 class="text-gray-900 h-section">Called Off</h2>
          <p class="text-gray-500 text-base sm:text-lg mt-2 font-medium">
            These sessions won't be running. We'll reschedule what we can.
          </p>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="w in cancelled" :key="w.id"
               class="bg-white border border-red-100 rounded-xl px-5 py-4 flex items-center gap-4">
            <span class="text-xs font-mono text-gray-400 tabular-nums flex-shrink-0 line-through">
              {{ shortDate(w.starts_at) }}
            </span>
            <span class="text-sm font-bold text-gray-500 truncate line-through">{{ w.title }}</span>
            <StatusBadge status="Cancelled" class="ml-auto flex-shrink-0" />
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- PAST SESSIONS -->
    <!-- ═══════════════════════════════════════ -->
    <section v-if="past.length" ref="pastScope" class="bg-[#F8FAFC] section">
      <div class="max-w-7xl mx-auto">
        <div class="mb-10">
          <h2 class="past-heading text-gray-900 h-section">
            Already Delivered
          </h2>
          <p class="text-gray-500 text-base sm:text-lg mt-2 font-medium">
            Sessions we've already run for the community.
          </p>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="w in past" :key="w.id"
               class="past-card bg-white/60 border border-gray-100 rounded-xl px-5 py-4 flex items-center gap-4">
            <span class="text-xs font-mono text-gray-400 tabular-nums flex-shrink-0">
              {{ shortDate(w.starts_at) }}
            </span>
            <span class="text-sm font-bold text-gray-700 truncate">{{ w.title }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- REGISTRATION -->
    <!-- ═══════════════════════════════════════ -->
    <section id="register" ref="formScope" class="bg-[#0B101B] section relative overflow-hidden scroll-mt-16">
      <div class="max-w-3xl mx-auto relative z-10">

        <!-- Success -->
        <div v-if="submitted" class="text-center form-panel">
          <p class="text-5xl mb-5" aria-hidden="true">✅</p>
          <h2 class="text-white h-section mb-3">
            You're on the list{{ submittedName ? ', ' + submittedName.split(' ')[0] : '' }}.
          </h2>
          <p class="text-gray-400 text-base leading-relaxed max-w-lg mx-auto mb-8">
            <template v-if="alreadyRegistered">
              You'd already registered with that email, so we've refreshed your details.
              The schedule is on its way to your inbox.
            </template>
            <template v-else>
              We've queued your personalised schedule. It'll land in your inbox shortly —
              check spam if you don't see it.
            </template>
          </p>
          <a v-if="whatsappGroup.url && !whatsappGroup.url.includes('PLACEHOLDER')"
             :href="whatsappGroup.url" target="_blank" rel="noopener noreferrer"
             class="inline-flex items-center gap-2 bg-emerald-500 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-emerald-600 transition-colors duration-200">
            <i class="fab fa-whatsapp text-lg" aria-hidden="true"></i>
            Join the WhatsApp group
          </a>
          <button @click="resetForm"
                  class="block mx-auto mt-6 text-gray-500 text-sm hover:text-gray-300 transition-colors duration-200 underline underline-offset-4">
            Register someone else
          </button>
        </div>

        <!-- Form -->
        <div v-else class="form-panel">
          <div class="text-center mb-10">
            <h2 class="text-white h-section mb-3">
              Register for the series
            </h2>
            <p class="text-gray-400 text-base sm:text-lg max-w-lg mx-auto">
              One form, every session. We'll email you the full schedule and keep you posted
              when new dates land.
            </p>
          </div>

          <form @submit.prevent="submit" novalidate class="flex flex-col gap-5">

            <!-- Honeypot: hidden from people, irresistible to bots -->
            <div class="absolute opacity-0 pointer-events-none -z-10" aria-hidden="true">
              <label for="website">Website</label>
              <input id="website" v-model="form.website" type="text" tabindex="-1" autocomplete="off" />
            </div>

            <div class="grid gap-5 sm:grid-cols-2">
              <div class="flex flex-col gap-1.5">
                <label for="full_name" class="text-gray-300 text-sm font-semibold">
                  Full name <span class="text-blue-400">*</span>
                </label>
                <input id="full_name" v-model="form.full_name" type="text" autocomplete="name"
                       :class="inputClass(fieldErrors.full_name)" placeholder="Ayesha Khan" />
                <p v-if="fieldErrors.full_name" class="text-red-400 text-xs">{{ fieldErrors.full_name }}</p>
              </div>

              <div class="flex flex-col gap-1.5">
                <label for="email" class="text-gray-300 text-sm font-semibold">
                  Email <span class="text-blue-400">*</span>
                </label>
                <input id="email" v-model="form.email" type="email" autocomplete="email"
                       :class="inputClass(fieldErrors.email)" placeholder="you@university.edu.pk" />
                <p v-if="fieldErrors.email" class="text-red-400 text-xs">{{ fieldErrors.email }}</p>
              </div>

              <div class="flex flex-col gap-1.5">
                <label for="university" class="text-gray-300 text-sm font-semibold">
                  University <span class="text-blue-400">*</span>
                </label>
                <input id="university" v-model="form.university" type="text" autocomplete="organization"
                       :class="inputClass(fieldErrors.university)" placeholder="UET Lahore" />
                <p v-if="fieldErrors.university" class="text-red-400 text-xs">{{ fieldErrors.university }}</p>
              </div>

              <div class="flex flex-col gap-1.5">
                <label for="phone" class="text-gray-300 text-sm font-semibold">
                  Phone <span class="text-blue-400">*</span>
                </label>
                <input id="phone" v-model="form.phone" type="tel" autocomplete="tel"
                       :class="inputClass(fieldErrors.phone)" placeholder="03xx xxxxxxx" />
                <p v-if="fieldErrors.phone" class="text-red-400 text-xs">{{ fieldErrors.phone }}</p>
              </div>

              <div class="flex flex-col gap-1.5">
                <label for="year_of_study" class="text-gray-300 text-sm font-semibold">
                  Year of study <span class="text-blue-400">*</span>
                </label>
                <select id="year_of_study" v-model="form.year_of_study"
                        :class="selectClass(fieldErrors.year_of_study)">
                  <option value="" disabled>Select…</option>
                  <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                </select>
                <p v-if="fieldErrors.year_of_study" class="text-red-400 text-xs">{{ fieldErrors.year_of_study }}</p>
              </div>

              <div class="flex flex-col gap-1.5">
                <label for="skill_level" class="text-gray-300 text-sm font-semibold">
                  Experience level <span class="text-blue-400">*</span>
                </label>
                <select id="skill_level" v-model="form.skill_level"
                        :class="selectClass(fieldErrors.skill_level)">
                  <option value="" disabled>Select…</option>
                  <option v-for="lvl in skillLevels" :key="lvl" :value="lvl">{{ lvl }}</option>
                </select>
                <p v-if="fieldErrors.skill_level" class="text-red-400 text-xs">{{ fieldErrors.skill_level }}</p>
              </div>
            </div>

            <fieldset class="flex flex-col gap-2.5">
              <legend class="text-gray-300 text-sm font-semibold mb-2">
                What are you interested in? <span class="text-blue-400">*</span>
              </legend>
              <div class="flex flex-wrap gap-2">
                <button v-for="topic in topics" :key="topic" type="button"
                        @click="toggleInterest(topic)"
                        :aria-pressed="form.interests.includes(topic)"
                        class="px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-200 cursor-pointer"
                        :class="form.interests.includes(topic)
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/25 hover:text-gray-200'">
                  {{ topic }}
                </button>
              </div>
              <p v-if="fieldErrors.interests" class="text-red-400 text-xs">{{ fieldErrors.interests }}</p>
            </fieldset>

            <label class="flex items-start gap-3 cursor-pointer">
              <input v-model="form.consent" type="checkbox"
                     class="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-blue-600 focus-visible:outline-2 focus-visible:outline-blue-500 cursor-pointer" />
              <span class="text-gray-400 text-sm leading-relaxed">
                Email me the workshop schedule and updates about new sessions.
                We don't share your details with anyone.
              </span>
            </label>
            <p v-if="fieldErrors.consent" class="text-red-400 text-xs -mt-3">{{ fieldErrors.consent }}</p>

            <div v-if="submitError"
                 class="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3">
              <p class="text-red-300 text-sm">{{ submitError }}</p>
            </div>

            <button type="submit" :disabled="submitting"
                    class="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-base
                           hover:bg-blue-700 transition-colors duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              {{ submitting ? 'Registering…' : 'Register for the series' }}
            </button>

            <p class="text-gray-600 text-xs text-center">
              Free forever. No payment details, ever.
            </p>
          </form>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useGSAP } from '../composables/useGSAP'
import StatusBadge from '../components/StatusBadge.vue'
import { whatsappGroup } from '../data/site'

const pageScope = ref(null)
const heroScope = ref(null)
const upcomingScope = ref(null)
const pastScope = ref(null)
const formScope = ref(null)

const floatingTags = [
  { label: '🎓 always free', position: 'left-4 md:left-[10%] lg:left-[16%] top-[16%] -rotate-6' },
  { label: '🛠️ hands-on', position: 'right-4 md:right-[10%] lg:right-[16%] top-[12%] rotate-6' },
  { label: '☕ bring a laptop', position: 'left-2 md:left-[7%] lg:left-[12%] top-[30%] rotate-6' },
  { label: '🚀 no gatekeeping', position: 'right-2 md:right-[7%] lg:right-[12%] top-[28%] -rotate-4' },
]

const years = ['1st year', '2nd year', '3rd year', '4th year', 'Graduate', 'Not a student']
const skillLevels = ['Complete beginner', 'Some experience', 'Comfortable', 'Advanced']
const topics = ['Web Development', 'APIs & Backend', 'Git & Collaboration', 'UI/UX Design', 'DevOps', 'Career & Interviews']

// ── Schedule ────────────────────────────────────────────────────────────────
const upcoming = ref([])
const past = ref([])
const cancelled = ref([])
const loading = ref(true)
const loadError = ref('')

const loadWorkshops = async ({ quiet = false } = {}) => {
  if (!quiet) loading.value = true
  loadError.value = ''
  try {
    // cache: 'no-store' on top of the server's no-store header. A stale schedule is the
    // one thing this page must never show — an admin flipping a session to Live or
    // Cancelled has to be visible on the next load, not after a hard refresh.
    const res = await fetch('/api/workshops', { cache: 'no-store' })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.ok) throw new Error(data.message || `Server responded ${res.status}`)
    upcoming.value = data.upcoming || []
    past.value = data.past || []
    cancelled.value = data.cancelled || []
  } catch (e) {
    if (!quiet) loadError.value = e.message || 'Could not reach the server.'
  } finally {
    loading.value = false
  }
}

/** Label for the card badge, driven entirely by the status an admin set. */
const badgeLabel = (w) => ({
  live: 'Live now',
  completed: 'Completed',
  cancelled: 'Cancelled',
}[w.status] || 'Active')

// A session going live is time-sensitive, so an open tab picks the change up on its own:
// on refocus, and on a slow poll while the tab is visible.
const REFRESH_MS = 60_000
let refreshTimer = null

const refreshIfVisible = () => {
  if (document.visibilityState === 'visible') loadWorkshops({ quiet: true })
}

onMounted(() => {
  loadWorkshops()
  refreshTimer = setInterval(refreshIfVisible, REFRESH_MS)
  document.addEventListener('visibilitychange', refreshIfVisible)
  window.addEventListener('focus', refreshIfVisible)
})

onUnmounted(() => {
  clearInterval(refreshTimer)
  document.removeEventListener('visibilitychange', refreshIfVisible)
  window.removeEventListener('focus', refreshIfVisible)
})

// ── Date formatting ─────────────────────────────────────────────────────────
const asDate = (value) => new Date(value)
const monthOf = (v) => asDate(v).toLocaleDateString('en-GB', { month: 'short' })
const dayOf = (v) => asDate(v).getDate()
const timeOf = (v) => asDate(v).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
const shortDate = (v) => asDate(v).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })

// ── Form ────────────────────────────────────────────────────────────────────
const form = reactive({
  full_name: '', email: '', phone: '', university: '',
  year_of_study: '', skill_level: '', interests: [], consent: true,
  website: '', // honeypot
})

// Every field on this form is required, so every field needs somewhere to put its error.
const blankErrors = () => ({
  full_name: '', email: '', university: '', phone: '',
  year_of_study: '', skill_level: '', interests: '', consent: '',
})
const fieldErrors = reactive(blankErrors())
const submitting = ref(false)
const submitted = ref(false)
const submittedName = ref('')
const alreadyRegistered = ref(false)
const submitError = ref('')

const inputClass = (hasError) => [
  'bg-white/5 border rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600',
  'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-500',
  'transition-colors duration-200',
  hasError ? 'border-red-500/60' : 'border-white/10 hover:border-white/20',
]

/**
 * Selects need one extra class beyond the shared input styling.
 *
 * The native dropdown list is painted by the OS using the select's own background and
 * colour. With a translucent `bg-white/5` on a dark panel that resolved to a white popup
 * with white text — the options were there, just invisible. `dark-select` pins a solid
 * dark background and `color-scheme: dark` so the browser renders the popup to match.
 */
const selectClass = (hasError) => [...inputClass(hasError), 'dark-select']

const toggleInterest = (topic) => {
  const i = form.interests.indexOf(topic)
  if (i === -1) form.interests.push(topic)
  else form.interests.splice(i, 1)
  if (form.interests.length) fieldErrors.interests = ''
}

// Mirrors the server rule exactly so the client never accepts what the server rejects.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Digits only, so "+92 300 1234567" and "0300-1234567" both pass. Mirrors api/register.js.
const phoneDigits = (value) => String(value).replace(/\D/g, '')

const validate = () => {
  fieldErrors.full_name = form.full_name.trim().length < 2 ? 'Please enter your full name.' : ''
  fieldErrors.email = EMAIL_RE.test(form.email.trim()) ? '' : 'Please enter a valid email address.'
  fieldErrors.university = form.university.trim().length < 2
    ? 'Please tell us where you study or work.' : ''

  const digits = phoneDigits(form.phone)
  fieldErrors.phone = digits.length < 10 || digits.length > 15
    ? 'Please enter a valid phone number.' : ''

  fieldErrors.year_of_study = form.year_of_study ? '' : 'Please select your year of study.'
  fieldErrors.skill_level = form.skill_level ? '' : 'Please select your experience level.'
  fieldErrors.interests = form.interests.length ? '' : 'Pick at least one topic.'
  fieldErrors.consent = form.consent ? '' : 'We need your consent to email you the schedule.'

  return !Object.values(fieldErrors).some(Boolean)
}

/** With eight required fields, an error above the fold is easy to miss. Take them to it. */
const focusFirstError = () => {
  const field = Object.keys(fieldErrors).find((key) => fieldErrors[key])
  if (!field) return
  const el = document.getElementById(field)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.focus({ preventScroll: true })
  }
}

const submit = async () => {
  submitError.value = ''
  if (!validate()) {
    submitError.value = 'Please fill in every field before registering.'
    focusFirstError()
    return
  }

  submitting.value = true
  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, source: 'workshops-page' }),
    })
    const data = await res.json().catch(() => ({}))

    if (!res.ok || !data.ok) {
      submitError.value = data.message || `Something went wrong (${res.status}). Please try again.`
      return
    }

    submittedName.value = data.name || form.full_name
    alreadyRegistered.value = Boolean(data.alreadyRegistered)
    submitted.value = true
  } catch {
    submitError.value = 'Could not reach the server. Check your connection and try again.'
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  Object.assign(form, {
    full_name: '', email: '', phone: '', university: '',
    year_of_study: '', skill_level: '', interests: [], consent: true, website: '',
  })
  Object.assign(fieldErrors, blankErrors())
  submitted.value = false
  submittedName.value = ''
  alreadyRegistered.value = false
  submitError.value = ''
}

// ── Animations ──────────────────────────────────────────────────────────────
useGSAP((self) => {
  const { gsap } = self

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  tl.from('.hero-heading', { y: 80, opacity: 0, duration: 1.4, skewY: 2 })
    .from('.hero-sub', { y: 30, opacity: 0, duration: 1.1 }, '-=1.0')

  self.selector('.floating-tag').forEach((label, i) => {
    gsap.from(label, { scale: 0, opacity: 0, duration: 1, delay: 0.7 + i * 0.12, ease: 'back.out(2)' })
    gsap.to(label, {
      y: '+=10', x: i % 2 === 0 ? '+=4' : '-=4', rotation: i % 2 === 0 ? '+=2' : '-=2',
      duration: 2.2 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.2,
    })
  })

  gsap.from('.upcoming-heading', {
    scrollTrigger: { trigger: upcomingScope.value, start: 'top 85%', toggleActions: 'play none none reverse' },
    y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
  })
  gsap.from('.upcoming-sub', {
    scrollTrigger: { trigger: upcomingScope.value, start: 'top 83%', toggleActions: 'play none none reverse' },
    y: 20, opacity: 0, duration: 0.8, ease: 'power3.out',
  })

  gsap.from('.form-panel', {
    scrollTrigger: { trigger: formScope.value, start: 'top 85%', once: true },
    y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
  })
}, pageScope)
</script>

<style scoped>
/**
 * The native <select> popup is drawn by the operating system, not by us. It inherits the
 * control's own background and text colour, and `bg-white/5` over a dark panel resolves
 * to a white list — which, with `text-white` options, rendered every choice invisible.
 *
 * `color-scheme: dark` tells the browser to paint its own widgets (the popup, the
 * scrollbar, the arrow) in dark mode, and the explicit option colours cover the browsers
 * that ignore it. Both are needed: Chrome honours color-scheme, Firefox leans on the
 * option rules.
 */
.dark-select {
  color-scheme: dark;
  /* Opaque, so the popup never inherits a see-through white. Matches bg-white/5 over #0B101B. */
  background-color: #151b28;
}

.dark-select option {
  background-color: #151b28;
  color: #e5e7eb;
}

/* The placeholder row reads as a prompt, not as a pickable answer. */
.dark-select option[value=''] {
  color: #9ca3af;
}
</style>
