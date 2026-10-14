<template>
  <!-- Trailing cursor ring (mouse only). The native cursor stays visible — this is a
       follower, not a replacement, so usability is never traded for flair. -->
  <div v-if="enabled" ref="ring" class="cursor-ring" aria-hidden="true">
    <span ref="labelEl" class="cursor-label">{{ label }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from '../../motion/gsap'
import { hasFinePointer, prefersReducedMotion } from '../../motion/intro'

const enabled = ref(false)
const ring = ref(null)
const labelEl = ref(null)
const label = ref('')

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, summary'
let xTo, yTo
let mode = 'idle'
let shown = false

const STATES = {
  idle:  { scale: 1,   backgroundColor: 'rgba(37,99,235,0)',    borderColor: 'rgba(37,99,235,0.55)' },
  hover: { scale: 1.7, backgroundColor: 'rgba(37,99,235,0.12)', borderColor: 'rgba(37,99,235,0)' },
  label: { scale: 2.4, backgroundColor: 'rgba(37,99,235,0.95)', borderColor: 'rgba(37,99,235,0)' },
}

const setMode = (next, text = '') => {
  if (!ring.value || (next === mode && text === label.value)) return
  mode = next
  label.value = text
  gsap.to(ring.value, { ...STATES[next], duration: 0.45, ease: 'power3.out', overwrite: 'auto' })
  gsap.to(labelEl.value, { opacity: next === 'label' ? 1 : 0, duration: 0.25, overwrite: 'auto' })
}

const onMove = (e) => {
  if (!ring.value) return
  if (!shown) {
    shown = true
    gsap.set(ring.value, { x: e.clientX, y: e.clientY })
    gsap.to(ring.value, { autoAlpha: 1, duration: 0.3 })
  }
  xTo(e.clientX)
  yTo(e.clientY)

  const t = e.target instanceof Element ? e.target : null
  const labelled = t?.closest('[data-cursor]')
  if (labelled) return setMode('label', labelled.getAttribute('data-cursor') || '')
  if (t?.closest(INTERACTIVE)) return setMode('hover')
  setMode('idle')
}

const onLeave = () => {
  shown = false
  if (ring.value) gsap.to(ring.value, { autoAlpha: 0, duration: 0.3 })
}
const onDown = () => {
  if (ring.value) gsap.to(ring.value, { scale: (STATES[mode]?.scale ?? 1) * 0.8, duration: 0.15 })
}
const onUp = () => { const m = mode; mode = ''; setMode(m, label.value) }

onMounted(async () => {
  if (!hasFinePointer() || prefersReducedMotion()) return
  enabled.value = true
  await Promise.resolve()
  await new Promise(requestAnimationFrame)
  if (!ring.value) return
  gsap.set(ring.value, { xPercent: -50, yPercent: -50, autoAlpha: 0 })
  xTo = gsap.quickTo(ring.value, 'x', { duration: 0.5, ease: 'power3.out' })
  yTo = gsap.quickTo(ring.value, 'y', { duration: 0.5, ease: 'power3.out' })
  window.addEventListener('pointermove', onMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', onLeave)
  window.addEventListener('pointerdown', onDown)
  window.addEventListener('pointerup', onUp)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onMove)
  document.documentElement.removeEventListener('pointerleave', onLeave)
  window.removeEventListener('pointerdown', onDown)
  window.removeEventListener('pointerup', onUp)
  if (ring.value) gsap.killTweensOf(ring.value)
})
</script>

<style scoped>
.cursor-ring {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 120;
  width: 38px;
  height: 38px;
  border-radius: 9999px;
  border: 1.5px solid rgba(37, 99, 235, 0.55);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;
  will-change: transform;
}
.cursor-label {
  /* Counter-scaled so text stays crisp while the ring is at scale 2.4. */
  transform: scale(calc(1 / 2.4));
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #fff;
  white-space: nowrap;
  opacity: 0;
}
</style>
