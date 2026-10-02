<template>
  <!-- Floating countdown — bottom-left so it never sits on the chatbot launcher (bottom-right).
       Counts down to the event, then to its end on the day, then disappears. -->
  <Transition name="countdown">
    <aside
      v-if="visible && !over"
      class="countdown-card fixed bottom-6 left-4 right-24 sm:left-6 sm:right-auto z-40 rounded-3xl text-white"
      :aria-label="`${partnerEvent.name} countdown`"
    >
      <router-link
        :to="{ path: '/community', hash: `#${partnerEvent.anchor}` }"
        class="countdown-link block rounded-[inherit] p-4"
      >
        <p class="flex items-center gap-2 pr-8 text-[10px] font-extrabold uppercase tracking-widest leading-snug text-violet-100 mb-3">
          <span class="countdown-dot" :class="{ 'countdown-dot--live': live }" aria-hidden="true"></span>
          {{ live ? `${partnerEvent.name} is on today · ends in` : `${partnerEvent.name} starts in` }}
        </p>

        <div class="flex gap-1.5 sm:gap-2" role="timer">
          <div
            v-for="unit in units"
            :key="unit.label"
            class="countdown-tile flex-1 sm:flex-none sm:w-[58px] rounded-xl py-2 text-center"
          >
            <span class="block text-xl sm:text-2xl font-black tabular-nums leading-none">{{ unit.value }}</span>
            <span class="block text-[9px] font-bold uppercase tracking-widest text-white/55 mt-1.5">{{ unit.label }}</span>
          </div>
        </div>
      </router-link>

      <button
        type="button"
        @click="hide"
        class="countdown-close absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-white/70 cursor-pointer"
        aria-label="Hide countdown"
      >
        <i class="fa-solid fa-xmark text-xs" aria-hidden="true"></i>
      </button>
    </aside>
  </Transition>
</template>

<script>
// Module scope, so it outlives the component: closing the countdown keeps it closed while
// the visitor moves around the site, and a fresh page load shows it again.
let hiddenThisLoad = false
</script>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { partnerEvent } from '../../data/partnerEvent'

// Matches the announcement popup, so the two arrive together.
const SHOW_DELAY_MS = 1500

const startsAt = new Date(partnerEvent.startsAt).getTime()
const endsAt = new Date(partnerEvent.endsAt).getTime()

const visible = ref(false)
const now = ref(Date.now())
let showTimer = null
let tick = null

const live = computed(() => now.value >= startsAt)
const over = computed(() => now.value > endsAt)

const pad = (n) => String(n).padStart(2, '0')

const units = computed(() => {
  const seconds = Math.max(0, Math.floor(((live.value ? endsAt : startsAt) - now.value) / 1000))
  const all = [
    { label: 'Days', value: pad(Math.floor(seconds / 86400)) },
    { label: 'Hrs', value: pad(Math.floor((seconds % 86400) / 3600)) },
    { label: 'Min', value: pad(Math.floor((seconds % 3600) / 60)) },
    { label: 'Sec', value: pad(seconds % 60) },
  ]
  // On the day itself there's less than a day left, so the days tile is dead weight.
  return live.value ? all.slice(1) : all
})

const hide = () => {
  visible.value = false
  hiddenThisLoad = true
  clearInterval(tick)
}

onMounted(() => {
  if (over.value || hiddenThisLoad) return
  // Recomputed from the clock each tick, so a throttled background tab can't drift.
  tick = setInterval(() => {
    now.value = Date.now()
    if (over.value) clearInterval(tick)
  }, 1000)
  showTimer = setTimeout(() => { visible.value = true }, SHOW_DELAY_MS)
})

onUnmounted(() => {
  clearTimeout(showTimer)
  clearInterval(tick)
})
</script>

<style scoped>
/* Same dark glass as the announcement popup, but denser: this one sits straight on the
   light page with no dimmed backdrop behind it. */
.countdown-card {
  background: linear-gradient(140deg, rgba(49, 46, 129, 0.93), rgba(15, 18, 38, 0.95) 55%, rgba(88, 28, 135, 0.92));
  -webkit-backdrop-filter: blur(28px) saturate(170%);
  backdrop-filter: blur(28px) saturate(170%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    0 30px 60px -20px rgba(3, 5, 15, 0.7),
    0 0 50px -12px rgba(168, 85, 247, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.28);
}

.countdown-tile {
  background: rgba(255, 255, 255, 0.09);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
}

.countdown-dot {
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background: #c4b5fd;
  box-shadow: 0 0 0 0 rgba(196, 181, 253, 0.7);
  animation: countdown-pulse 2s ease-out infinite;
}
.countdown-dot--live {
  background: #34d399;
  box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.7);
}

.countdown-close { transition: background-color 0.2s, color 0.2s; }
.countdown-close:hover { background: rgba(255, 255, 255, 0.16); color: #fff; }

.countdown-link:focus-visible,
.countdown-close:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.countdown-enter-active { transition: opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
.countdown-leave-active { transition: opacity 0.2s ease-in, transform 0.2s ease-in; }
.countdown-enter-from,
.countdown-leave-to { opacity: 0; transform: translateY(24px) scale(0.96); }

@keyframes countdown-pulse {
  to { box-shadow: 0 0 0 8px transparent; }
}

@media (prefers-reduced-motion: reduce) {
  .countdown-dot { animation: none; }
  .countdown-enter-active,
  .countdown-leave-active { transition: none; }
}
</style>
