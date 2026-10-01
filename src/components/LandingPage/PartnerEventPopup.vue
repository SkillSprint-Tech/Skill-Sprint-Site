<template>
  <!-- Announcement card — bottom-left so it never sits on the chatbot launcher (bottom-right) -->
  <Transition
    enter-active-class="transition duration-500 ease-out motion-reduce:transition-none"
    enter-from-class="opacity-0 translate-y-6"
    leave-active-class="transition duration-200 ease-in motion-reduce:transition-none"
    leave-to-class="opacity-0 translate-y-6"
  >
    <aside
      v-if="visible"
      class="fixed bottom-6 left-4 right-24 sm:left-6 sm:right-auto sm:w-[360px] z-40
             bg-[#0B101B] text-white rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
      aria-label="Partner event announcement"
    >
      <button
        type="button"
        @click="dismiss"
        class="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center
               text-gray-400 hover:text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer"
        aria-label="Dismiss announcement"
      >
        <i class="fa-solid fa-xmark text-sm" aria-hidden="true"></i>
      </button>

      <div class="flex items-stretch">
        <img
          :src="partnerEvent.poster"
          alt=""
          aria-hidden="true"
          class="hidden min-[400px]:block w-24 flex-shrink-0 object-cover object-top"
        />

        <div class="p-4 pr-10 min-w-0">
          <p class="text-[10px] font-extrabold uppercase tracking-widest text-violet-300 mb-1.5">
            🎉 Exciting news
          </p>
          <h2 class="text-[15px] font-extrabold leading-snug mb-1.5">
            We're a {{ partnerEvent.name }} Outreach Partner
          </h2>
          <p class="text-gray-400 text-xs leading-relaxed mb-3">
            {{ partnerEvent.date }}. Use code
            <span class="font-mono font-bold text-white">{{ partnerEvent.promoCode }}</span>
            for {{ partnerEvent.promoOffer }}.
          </p>
          <router-link
            :to="{ path: '/community', hash: `#${partnerEvent.anchor}` }"
            @click="dismiss"
            class="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold
                   px-4 py-2 rounded-full transition-colors duration-200"
          >
            See details
            <i class="fa-solid fa-arrow-right text-[10px]" aria-hidden="true"></i>
          </router-link>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { partnerEvent } from '../../data/partnerEvent'

const DISMISSED_KEY = `ss:announcement-dismissed:${partnerEvent.id}`
// Let the hero land first so the card reads as news, not as part of the page load.
const SHOW_DELAY_MS = 1500

const visible = ref(false)
let showTimer = null

const wasDismissed = () => {
  try { return localStorage.getItem(DISMISSED_KEY) === '1' } catch { return false }
}

const dismiss = () => {
  visible.value = false
  try { localStorage.setItem(DISMISSED_KEY, '1') } catch { /* private mode: not remembered */ }
}

onMounted(() => {
  const eventOver = Date.now() > new Date(partnerEvent.endsAt).getTime()
  if (eventOver || wasDismissed()) return
  showTimer = setTimeout(() => { visible.value = true }, SHOW_DELAY_MS)
})

onUnmounted(() => clearTimeout(showTimer))
</script>
