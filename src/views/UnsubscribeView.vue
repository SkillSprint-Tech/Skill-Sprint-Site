<template>
  <section class="min-h-[70vh] bg-[#F8FAFC] flex items-center justify-center px-4 py-20">
    <div class="w-full max-w-md text-center">

      <!-- Checking -->
      <div v-if="state === 'loading'" class="bg-white border border-gray-100 rounded-2xl p-10">
        <p class="text-gray-400 text-sm">Checking your subscription…</p>
      </div>

      <!-- Confirm -->
      <div v-else-if="state === 'confirm'" class="bg-white border border-gray-100 rounded-2xl p-8 sm:p-10">
        <p class="text-4xl mb-5" aria-hidden="true">✉️</p>
        <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight mb-3">
          Stop receiving workshop emails?
        </h1>
        <p class="text-gray-500 text-sm leading-relaxed mb-2">
          We'll stop emailing <strong class="text-gray-700">{{ email }}</strong> about workshop
          schedules and session links.
        </p>
        <p class="text-gray-400 text-xs leading-relaxed mb-7">
          Your registration stays intact — you can still attend anything you've signed up for.
        </p>

        <button @click="confirm" :disabled="working"
                class="w-full bg-gray-900 text-white py-3.5 rounded-full font-semibold text-sm
                       hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 cursor-pointer">
          {{ working ? 'Unsubscribing…' : 'Yes, unsubscribe me' }}
        </button>
        <router-link to="/workshops"
                     class="block mt-4 text-blue-600 text-sm font-semibold hover:text-blue-800 transition-colors duration-200">
          Keep me subscribed
        </router-link>
      </div>

      <!-- Done -->
      <div v-else-if="state === 'done'" class="bg-white border border-gray-100 rounded-2xl p-8 sm:p-10">
        <p class="text-4xl mb-5" aria-hidden="true">👋</p>
        <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight mb-3">
          You're unsubscribed
        </h1>
        <p class="text-gray-500 text-sm leading-relaxed mb-7">
          We won't email <strong class="text-gray-700">{{ email }}</strong> again.
          Changed your mind? Just register again any time — no hard feelings.
        </p>
        <router-link to="/workshops"
                     class="inline-block bg-blue-600 text-white px-7 py-3 rounded-full font-semibold text-sm
                            hover:bg-blue-700 transition-colors duration-200">
          Back to workshops
        </router-link>
      </div>

      <!-- Already done -->
      <div v-else-if="state === 'already'" class="bg-white border border-gray-100 rounded-2xl p-8 sm:p-10">
        <p class="text-4xl mb-5" aria-hidden="true">✅</p>
        <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight mb-3">
          Already unsubscribed
        </h1>
        <p class="text-gray-500 text-sm leading-relaxed mb-7">
          <strong class="text-gray-700">{{ email }}</strong> is already off our list.
          Nothing more to do.
        </p>
        <router-link to="/workshops"
                     class="inline-block bg-blue-600 text-white px-7 py-3 rounded-full font-semibold text-sm
                            hover:bg-blue-700 transition-colors duration-200">
          Back to workshops
        </router-link>
      </div>

      <!-- Bad link -->
      <div v-else class="bg-white border border-gray-100 rounded-2xl p-8 sm:p-10">
        <p class="text-4xl mb-5" aria-hidden="true">🔗</p>
        <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight mb-3">
          This link isn't valid
        </h1>
        <p class="text-gray-500 text-sm leading-relaxed mb-7">
          {{ errorMessage }} If you're still getting emails you don't want, reply to any of
          them and we'll remove you by hand.
        </p>
        <router-link to="/"
                     class="inline-block border border-gray-200 text-gray-700 px-7 py-3 rounded-full font-semibold text-sm
                            hover:border-gray-300 transition-colors duration-200">
          Go to homepage
        </router-link>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const state = ref('loading') // loading | confirm | done | already | error
const email = ref('')
const errorMessage = ref('That link may be incomplete or out of date.')
const working = ref(false)

const params = () => ({
  e: String(route.query.e || ''),
  t: String(route.query.t || ''),
})

onMounted(async () => {
  const { e, t } = params()
  if (!e || !t) {
    state.value = 'error'
    return
  }

  try {
    const res = await fetch(`/api/unsubscribe?e=${encodeURIComponent(e)}&t=${encodeURIComponent(t)}`)
    const data = await res.json().catch(() => ({}))

    if (!data.ok) {
      errorMessage.value = data.message || errorMessage.value
      state.value = 'error'
      return
    }

    email.value = data.email
    state.value = data.alreadyUnsubscribed ? 'already' : 'confirm'
  } catch {
    errorMessage.value = 'We could not reach the server.'
    state.value = 'error'
  }
})

/**
 * Deliberately a second step rather than unsubscribing on page load: mail clients and
 * security scanners pre-fetch links, which would silently unsubscribe people who never
 * clicked anything.
 */
const confirm = async () => {
  const { e, t } = params()
  working.value = true
  try {
    const res = await fetch('/api/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: e, token: t }),
    })
    const data = await res.json().catch(() => ({}))
    if (data.ok) {
      state.value = 'done'
    } else {
      errorMessage.value = data.message || errorMessage.value
      state.value = 'error'
    }
  } catch {
    errorMessage.value = 'We could not reach the server.'
    state.value = 'error'
  } finally {
    working.value = false
  }
}
</script>
