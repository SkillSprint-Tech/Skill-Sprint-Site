<template>
  <!-- First-load intro: k72-style counter + wordmark, exiting through a double "stair"
       curtain (dark, then brand blue) that hands off straight into the hero entrance. -->
  <div
    v-if="active"
    ref="root"
    class="preloader"
    role="status"
    aria-live="polite"
    aria-label="Loading Skill Sprint"
  >
    <div class="pl-stairs pl-stairs--blue" aria-hidden="true">
      <span v-for="n in COLS" :key="`b${n}`" class="pl-col"></span>
    </div>
    <div class="pl-stairs pl-stairs--dark" aria-hidden="true">
      <span v-for="n in COLS" :key="`d${n}`" class="pl-col"></span>
    </div>

    <div class="pl-content" aria-hidden="true">
      <div class="pl-row pl-fade font-mono">
        <span>[ Learn by doing ]</span>
        <span class="hidden sm:inline">[ Build by collaborating ]</span>
      </div>

      <div class="pl-word">
        <span class="pl-line">
          <span v-for="(ch, i) in 'SKILL'" :key="`s${i}`" class="pl-char">{{ ch }}</span>
        </span>
        <span class="pl-line pl-line--accent">
          <span v-for="(ch, i) in 'SPRINT'" :key="`p${i}`" class="pl-char">{{ ch }}</span>
        </span>
      </div>

      <div class="pl-row pl-row--bottom">
        <span class="pl-fade font-mono">Loading the sprint</span>
        <span class="pl-count tabular-nums">{{ count }}<sup>%</sup></span>
      </div>
      <div class="pl-bar"><span ref="bar"></span></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from '../../motion/gsap'
import { markIntroDone, prefersReducedMotion } from '../../motion/intro'

const COLS = 5
const router = useRouter()

// Bare-layout routes (admin, portal, verify) and reduced-motion visitors never see the intro.
const initial = typeof window !== 'undefined'
  ? router.resolve(window.location.pathname + window.location.search)
  : null
const skip = prefersReducedMotion() || Boolean(initial?.meta?.bareLayout)

const active = ref(!skip)
const root = ref(null)
const bar = ref(null)
const count = ref('000')
let tl = null

// Block user scrolling while the curtain is down — without `overflow: hidden`, which would
// drop the scrollbar and make every ScrollTrigger measure a page 15px wider than reality.
const SCROLL_KEYS = new Set([' ', 'PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown'])
const block = (e) => {
  if (e.type === 'keydown' && !SCROLL_KEYS.has(e.key)) return
  e.preventDefault()
  e.stopImmediatePropagation()
}
const opts = { capture: true, passive: false }
const lock = () => {
  window.addEventListener('wheel', block, opts)
  window.addEventListener('touchmove', block, opts)
  window.addEventListener('keydown', block, opts)
}
const unlock = () => {
  window.removeEventListener('wheel', block, opts)
  window.removeEventListener('touchmove', block, opts)
  window.removeEventListener('keydown', block, opts)
}

const finish = () => {
  unlock()
  markIntroDone()
}

onMounted(() => {
  if (skip) { markIntroDone(); return }
  lock()
  window.scrollTo(0, 0)

  const start = () => {
    if (!root.value) return finish()
    const q = gsap.utils.selector(root.value)
    const chars = q('.pl-char')
    const counter = { v: 0 }
    const nav = document.querySelector('nav')

    tl = gsap.timeline({ onComplete: () => { active.value = false } })

    tl.fromTo(chars, { yPercent: 115, rotate: 6 }, {
      yPercent: 0, rotate: 0, duration: 1, stagger: 0.045, ease: 'cinematic',
    })
      .fromTo(q('.pl-fade'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, 0.15)
      .fromTo(q('.pl-count'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.15)
      .to(counter, {
        v: 100,
        duration: 1.35,
        ease: 'power2.inOut',
        onUpdate: () => { count.value = String(Math.round(counter.v)).padStart(3, '0') },
      }, 0.1)
      .fromTo(bar.value, { scaleX: 0 }, { scaleX: 1, duration: 1.35, ease: 'power2.inOut' }, 0.1)
      // Exit: letters fly up out of their masks, chrome fades…
      .to(chars, { yPercent: -115, duration: 0.55, stagger: 0.03, ease: 'power3.in' }, '+=0.1')
      .to([...q('.pl-row'), ...q('.pl-bar')], { opacity: 0, duration: 0.35 }, '<')
      // …then the double stair curtain: dark columns lift, revealing brand blue, which lifts too.
      .to(q('.pl-stairs--dark .pl-col'), { yPercent: -100, duration: 0.8, stagger: 0.06, ease: 'curtain' }, '-=0.15')
      .addLabel('reveal', '-=0.35')
      .add(finish, 'reveal')
      .to(q('.pl-stairs--blue .pl-col'), { yPercent: -100, duration: 0.85, stagger: 0.06, ease: 'curtain' }, 'reveal')

    if (nav) {
      tl.fromTo(nav, { yPercent: -100, autoAlpha: 0 }, {
        yPercent: 0, autoAlpha: 1, duration: 1, ease: 'cinematic', clearProps: 'transform,opacity,visibility',
      }, 'reveal+=0.35')
    }
  }

  // Wait for webfonts so the wordmark never swaps mid-animation (capped, never stalls).
  let started = false
  const go = () => { if (!started) { started = true; start() } }
  if (document.fonts?.ready) document.fonts.ready.then(go).catch(go)
  setTimeout(go, 900)
  if (!document.fonts?.ready) go()
})

onBeforeUnmount(() => {
  tl?.kill()
  finish()
})
</script>

<style scoped>
.preloader {
  position: fixed;
  inset: 0;
  z-index: 200;
  pointer-events: auto;
}

.pl-stairs {
  position: absolute;
  inset: 0;
  display: flex;
}
.pl-col {
  flex: 1;
  height: 100%;
  /* Hairline overlap so no sub-pixel seams show between columns. */
  margin-right: -1px;
}
.pl-stairs--blue .pl-col { background: #2563eb; }
.pl-stairs--dark .pl-col { background: #0b101b; }

.pl-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(1.25rem, 3vw, 2.5rem);
  color: #fff;
}

.pl-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}

.pl-word {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 0.86;
  font-weight: 900;
  letter-spacing: -0.05em;
  font-size: clamp(3.5rem, 15vw, 13rem);
}
.pl-line {
  display: flex;
  overflow: hidden;
  /* Room for the rotated glyphs so the mask doesn't nick their corners. */
  padding: 0.04em 0.06em;
}
.pl-line--accent { color: #3b82f6; }
.pl-char {
  display: inline-block;
  will-change: transform;
}

.pl-count {
  font-weight: 900;
  font-size: clamp(3rem, 10vw, 8rem);
  line-height: 0.8;
  letter-spacing: -0.05em;
  color: #fff;
}
.pl-count sup {
  font-size: 0.3em;
  vertical-align: top;
  margin-left: 0.1em;
  color: #3b82f6;
}

.pl-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
}
.pl-bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #60a5fa);
  transform-origin: left center;
  transform: scaleX(0);
}
</style>
