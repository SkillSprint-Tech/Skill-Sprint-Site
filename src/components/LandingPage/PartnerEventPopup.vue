<template>
  <!-- Centred announcement — glass panel over a blurred backdrop, layers floating at
       different depths and tilting toward the cursor on desktop. -->
  <Teleport to="body">
    <Transition name="spatial">
      <div
        v-if="visible"
        class="spatial-backdrop fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-hidden"
        @click.self="dismiss"
        @keydown="onKeydown"
        @pointermove="onPointerMove"
        @pointerleave="resetTilt"
      >
        <div class="spatial-orb spatial-orb--violet" aria-hidden="true"></div>
        <div class="spatial-orb spatial-orb--pink" aria-hidden="true"></div>
        <div class="spatial-orb spatial-orb--blue" aria-hidden="true"></div>

        <div class="spatial-entrance relative w-full max-w-[880px]">
          <section
            ref="panel"
            class="spatial-panel relative"
            role="dialog"
            aria-modal="true"
            aria-labelledby="partner-popup-title"
            tabindex="-1"
          >
            <div class="spatial-glass" aria-hidden="true"></div>

            <div class="spatial-body relative grid md:grid-cols-[280px_minmax(0,1fr)] gap-9 md:gap-10 items-center p-5 sm:p-7 md:p-9">

              <!-- Poster stage -->
              <div class="spatial-stage relative aspect-[3/2] md:aspect-[2/3]">
                <img
                  :src="partnerEvent.poster"
                  alt=""
                  class="spatial-poster w-full h-full object-cover object-top rounded-[22px] border border-white/20"
                />
                <div class="spatial-chip spatial-chip--modules hidden md:flex absolute -left-5 top-8 items-center gap-2 rounded-full px-3.5 py-2 text-white text-xs font-bold whitespace-nowrap" aria-hidden="true">
                  <i class="fa-solid fa-layer-group text-violet-200" aria-hidden="true"></i>
                  {{ partnerEvent.modules.length }} modules · 1 day
                </div>
                <div class="spatial-chip spatial-chip--promo absolute -bottom-5 right-3 md:-right-6 md:bottom-10 flex flex-col items-center rounded-2xl px-4 py-2.5 text-white" aria-hidden="true">
                  <span class="text-2xl font-black leading-none tracking-tight">10%</span>
                  <span class="text-[10px] font-extrabold uppercase tracking-widest text-white/80 mt-0.5">off</span>
                </div>
              </div>

              <!-- Copy -->
              <div class="spatial-copy min-w-0 text-center md:text-left">
                <span class="spatial-tile inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-violet-100 px-3.5 py-1.5 rounded-full mb-4">
                  🎉 Exciting news
                </span>
                <h2 id="partner-popup-title" class="text-white text-[26px] sm:text-3xl font-extrabold tracking-tight leading-[1.15] mb-5 sm:mb-3">
                  We're an official
                  <span class="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-sky-300 bg-clip-text text-transparent">{{ partnerEvent.name }}</span>
                  Outreach Partner
                </h2>
                <!-- Dropped on phones so the whole popup fits without scrolling. -->
                <p class="hidden sm:block text-white/70 text-[15px] leading-relaxed mb-5">
                  Skill Sprint has teamed up with {{ partnerEvent.host }}.
                  {{ partnerEvent.modules.length }} modules, one day: build under pressure and compete with the best.
                </p>

                <dl class="grid sm:grid-cols-2 gap-2.5 mb-2.5 text-left">
                  <div class="spatial-tile flex items-start gap-3 rounded-2xl px-4 py-2.5 sm:py-3">
                    <i class="fa-regular fa-calendar text-violet-200 w-4 text-center mt-1" aria-hidden="true"></i>
                    <div>
                      <dt class="text-[10px] font-bold uppercase tracking-widest text-white/50">Date</dt>
                      <dd class="text-white text-sm font-semibold">{{ partnerEvent.date }}</dd>
                    </div>
                  </div>
                  <div class="spatial-tile flex items-start gap-3 rounded-2xl px-4 py-2.5 sm:py-3">
                    <i class="fa-solid fa-location-dot text-violet-200 w-4 text-center mt-1" aria-hidden="true"></i>
                    <div>
                      <dt class="text-[10px] font-bold uppercase tracking-widest text-white/50">Where</dt>
                      <dd class="text-white text-sm font-semibold">{{ partnerEvent.venue }}</dd>
                    </div>
                  </div>
                </dl>

                <p class="spatial-tile spatial-tile--dashed rounded-2xl px-4 py-3 text-sm text-white/75 mb-6">
                  Use code
                  <span class="font-mono font-bold text-white tracking-wider">{{ partnerEvent.promoCode }}</span>
                  for {{ partnerEvent.promoOffer }}
                </p>

                <div class="flex gap-3 justify-center md:justify-start">
                  <a
                    :href="partnerEvent.registerUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    @click="dismiss"
                    class="spatial-cta flex-1 sm:flex-none inline-flex items-center justify-center gap-2.5 text-white text-sm font-bold px-4 sm:px-7 py-3.5 rounded-full whitespace-nowrap"
                  >
                    Register now
                    <i class="fa-solid fa-arrow-up-right-from-square text-xs" aria-hidden="true"></i>
                  </a>
                  <router-link
                    :to="{ path: '/community', hash: `#${partnerEvent.anchor}` }"
                    @click="dismiss"
                    class="spatial-tile spatial-tile--action flex-1 sm:flex-none inline-flex items-center justify-center gap-2.5 text-white text-sm font-semibold px-4 sm:px-7 py-3.5 rounded-full whitespace-nowrap"
                  >
                    See details
                    <i class="fa-solid fa-arrow-right text-xs" aria-hidden="true"></i>
                  </router-link>
                </div>
              </div>
            </div>

            <button
              type="button"
              @click="dismiss"
              class="spatial-close spatial-chip absolute top-3 right-3 md:top-4 md:right-4 w-10 h-10 rounded-full flex items-center justify-center text-white cursor-pointer"
              aria-label="Close announcement"
            >
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </section>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { partnerEvent } from '../../data/partnerEvent'

const DISMISSED_KEY = `ss:popup-dismissed:${partnerEvent.id}`
// Let the hero land first so the popup reads as news, not as part of the page load.
const SHOW_DELAY_MS = 1500
// Keep in sync with the 3D media query in the styles below.
const TILT_QUERY = '(min-width: 768px) and (min-height: 700px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
const MAX_TILT_X_DEG = 5
const MAX_TILT_Y_DEG = 7

const visible = ref(false)
const panel = ref(null)
let showTimer = null
let lastFocused = null

const wasDismissed = () => {
  try { return localStorage.getItem(DISMISSED_KEY) === '1' } catch { return false }
}

// Pad for the scrollbar that disappears, so the page behind doesn't jump sideways.
const lockScroll = () => {
  const root = document.documentElement
  root.style.paddingRight = `${window.innerWidth - root.clientWidth}px`
  root.style.overflow = 'hidden'
}

const unlockScroll = () => {
  const root = document.documentElement
  root.style.overflow = ''
  root.style.paddingRight = ''
}

const show = async () => {
  lastFocused = document.activeElement
  lockScroll()
  visible.value = true
  await nextTick()
  panel.value?.focus({ preventScroll: true })
}

const dismiss = () => {
  if (!visible.value) return
  visible.value = false
  unlockScroll()
  lastFocused?.focus?.({ preventScroll: true })
  try { localStorage.setItem(DISMISSED_KEY, '1') } catch { /* private mode: not remembered */ }
}

const onKeydown = (e) => {
  if (e.key === 'Escape') return dismiss()
  if (e.key !== 'Tab' || !panel.value) return

  // Keep Tab inside the dialog.
  const focusable = panel.value.querySelectorAll('a[href], button')
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  const active = document.activeElement
  if (e.shiftKey && (active === first || active === panel.value)) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && active === last) {
    e.preventDefault()
    first.focus()
  }
}

const clamp = (n) => Math.max(-1, Math.min(1, n))

const onPointerMove = (e) => {
  if (!panel.value || !window.matchMedia(TILT_QUERY).matches) return
  const rect = panel.value.getBoundingClientRect()
  const x = clamp((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2))
  const y = clamp((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2))
  const { style } = panel.value
  style.setProperty('--ry', `${x * MAX_TILT_Y_DEG}deg`)
  style.setProperty('--rx', `${-y * MAX_TILT_X_DEG}deg`)
  // Specular highlight follows the cursor across the glass.
  style.setProperty('--mx', `${e.clientX - rect.left}px`)
  style.setProperty('--my', `${e.clientY - rect.top}px`)
}

const resetTilt = () => {
  panel.value?.style.setProperty('--rx', '0deg')
  panel.value?.style.setProperty('--ry', '0deg')
}

onMounted(() => {
  const eventOver = Date.now() > new Date(partnerEvent.endsAt).getTime()
  if (eventOver || wasDismissed()) return
  showTimer = setTimeout(show, SHOW_DELAY_MS)
})

onUnmounted(() => {
  clearTimeout(showTimer)
  if (visible.value) unlockScroll()
})
</script>

<style scoped>
/* Backdrop ------------------------------------------------------------------ */
.spatial-backdrop {
  background: rgba(8, 11, 22, 0.62);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  backdrop-filter: blur(14px) saturate(140%);
}

/* Colour behind the glass, so the panel has something to refract. */
.spatial-orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(90px);
  opacity: 0.6;
  pointer-events: none;
  animation: spatial-drift 14s ease-in-out infinite alternate;
}
.spatial-orb--violet { width: 420px; height: 420px; background: #7c3aed; top: 8%;    left: calc(50% - 560px); }
.spatial-orb--pink   { width: 360px; height: 360px; background: #db2777; bottom: 6%; left: calc(50% + 180px); animation-delay: -5s; }
.spatial-orb--blue   { width: 300px; height: 300px; background: #2563eb; top: 45%;   left: calc(50% - 150px); animation-delay: -9s; opacity: 0.4; }

/* Panel --------------------------------------------------------------------- */
.spatial-entrance {
  animation: spatial-in 0.75s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}

.spatial-panel {
  --rx: 0deg;
  --ry: 0deg;
  --mx: 50%;
  --my: 0%;
  border-radius: 36px;
  outline: none;
}

/* The glass is its own layer: backdrop-filter and overflow would flatten the 3D
   children if they sat on the panel itself. */
.spatial-glass {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  background: linear-gradient(140deg, rgba(49, 46, 129, 0.55), rgba(15, 18, 38, 0.74) 55%, rgba(76, 29, 149, 0.48));
  -webkit-backdrop-filter: blur(40px) saturate(170%);
  backdrop-filter: blur(40px) saturate(170%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    0 50px 120px -30px rgba(3, 5, 15, 0.85),
    inset 0 1px 0 rgba(255, 255, 255, 0.28);
}
.spatial-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(520px circle at var(--mx) var(--my), rgba(255, 255, 255, 0.16), transparent 60%);
}

/* Small screens and touch: flat, and scrollable if the panel outgrows the viewport. */
.spatial-body {
  max-height: calc(100dvh - 2rem);
  overflow-y: auto;
  border-radius: inherit;
  scrollbar-width: none;
}
.spatial-body::-webkit-scrollbar { display: none; }

.spatial-poster {
  box-shadow:
    0 30px 60px -20px rgba(0, 0, 0, 0.7),
    0 0 60px -10px rgba(168, 85, 247, 0.45);
}

/* Surfaces ------------------------------------------------------------------ */
.spatial-tile {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
}
.spatial-tile--dashed { border-style: dashed; border-color: rgba(255, 255, 255, 0.25); }
.spatial-tile--action { transition: background-color 0.2s; }
.spatial-tile--action:hover { background: rgba(255, 255, 255, 0.15); }

.spatial-chip {
  background: rgba(255, 255, 255, 0.16);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 16px 30px -10px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}
.spatial-chip--modules { animation: spatial-bob 5s ease-in-out infinite; }
.spatial-chip--promo {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.85), rgba(217, 70, 239, 0.85));
  rotate: -6deg;
  animation: spatial-bob 6s ease-in-out -2s infinite;
}

.spatial-close { transition: background-color 0.2s; }
.spatial-close:hover { background: rgba(255, 255, 255, 0.28); }

.spatial-cta {
  background: linear-gradient(135deg, #8b5cf6, #d946ef);
  box-shadow:
    0 12px 30px -8px rgba(168, 85, 247, 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
  transition: filter 0.2s;
}
.spatial-cta:hover { filter: brightness(1.12); }

.spatial-panel :is(a, button):focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
}

/* Depth --------------------------------------------------------------------- */
/* Desktop with a mouse: the panel tilts toward the cursor and each layer sits at
   its own distance. Keep in sync with TILT_QUERY in the script. */
@media (min-width: 768px) and (min-height: 700px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .spatial-entrance { perspective: 1400px; }
  .spatial-panel {
    transform: rotateX(var(--rx)) rotateY(var(--ry));
    transform-style: preserve-3d;
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .spatial-body {
    max-height: none;
    overflow: visible;
    transform-style: preserve-3d;
  }
  .spatial-stage         { transform-style: preserve-3d; }
  .spatial-copy          { transform: translateZ(24px); }
  .spatial-close         { transform: translateZ(40px); }
  .spatial-poster        { transform: translateZ(50px); }
  .spatial-chip--modules { transform: translateZ(95px); }
  .spatial-chip--promo   { transform: translateZ(110px); }
}

/* Motion -------------------------------------------------------------------- */
.spatial-enter-active { transition: opacity 0.4s ease-out; }
.spatial-leave-active { transition: opacity 0.25s ease-in; }
.spatial-enter-from,
.spatial-leave-to { opacity: 0; }
.spatial-leave-active .spatial-entrance { transition: transform 0.25s ease-in; }
.spatial-leave-to .spatial-entrance { transform: scale(0.95); }

@keyframes spatial-in {
  from { opacity: 0; transform: translateY(48px) scale(0.9); filter: blur(12px); }
  to   { opacity: 1; transform: none; filter: blur(0); }
}
@keyframes spatial-bob {
  0%, 100% { translate: 0 0; }
  50%      { translate: 0 -8px; }
}
@keyframes spatial-drift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(40px, -30px) scale(1.15); }
}

@media (prefers-reduced-motion: reduce) {
  .spatial-entrance,
  .spatial-orb,
  .spatial-chip--modules,
  .spatial-chip--promo { animation: none; }
}
</style>
