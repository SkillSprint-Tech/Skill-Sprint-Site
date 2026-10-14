<template>
  <!-- Route-change curtain: brand-blue stairs rise to cover the old page (with the
       destination's name), the route swaps underneath, then the stairs lift away. -->
  <div ref="root" class="pt" aria-hidden="true">
    <span v-for="n in COLS" :key="n" class="pt-col"></span>
    <div class="pt-label">
      <span class="pt-label-inner">{{ label }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from '../../motion/gsap'
import { prefersReducedMotion } from '../../motion/intro'

const COLS = 5
const router = useRouter()
const root = ref(null)
const label = ref('')
let covered = false
let removeBefore = null
let removeAfter = null
let removeError = null

const LABELS = {
  home: 'Home',
  contact: 'Contact',
  about: 'About',
  initiatives: 'Initiatives',
  sprints: 'Sprints',
  workshops: 'Workshops',
  community: 'Community',
  team: 'Team',
  mission: 'Mission',
  unsubscribe: 'Preferences',
}

// Only marketing-page → marketing-page navigations get the curtain. Admin/portal/verify
// have their own bare layout; hash-only jumps on the same page must stay instant.
const shouldAnimate = (to, from) =>
  !prefersReducedMotion() &&
  Boolean(from.matched.length) &&
  to.path !== from.path &&
  !to.meta?.bareLayout &&
  !from.meta?.bareLayout

const cols = () => root.value?.querySelectorAll('.pt-col') ?? []

const cover = () => new Promise((resolve) => {
  if (!root.value) return resolve()
  gsap.killTweensOf([root.value, ...cols()])
  gsap.set(root.value, { autoAlpha: 1 })
  const tl = gsap.timeline({ onComplete: resolve })
  tl.fromTo(cols(), { yPercent: 100 }, { yPercent: 0, duration: 0.55, stagger: 0.05, ease: 'curtain' })
    .fromTo(root.value.querySelector('.pt-label-inner'),
      { yPercent: 110 }, { yPercent: 0, duration: 0.5, ease: 'cinematic' }, 0.25)
  // Never hold a navigation hostage if something goes wrong with the tween.
  setTimeout(resolve, 1200)
})

const reveal = () => {
  if (!root.value) return
  const tl = gsap.timeline({
    onComplete: () => gsap.set(root.value, { autoAlpha: 0 }),
  })
  tl.to(root.value.querySelector('.pt-label-inner'), { yPercent: -110, duration: 0.4, ease: 'power3.in' })
    .to(cols(), { yPercent: -100, duration: 0.65, stagger: 0.05, ease: 'curtain' }, 0.15)
}

onMounted(() => {
  gsap.set(root.value, { autoAlpha: 0 })

  removeBefore = router.beforeEach(async (to, from) => {
    if (!shouldAnimate(to, from)) return true
    label.value = LABELS[to.name] ?? ''
    covered = true
    await cover()
    return true
  })

  removeAfter = router.afterEach(() => {
    if (!covered) return
    covered = false
    // Let the new page render and paint a frame before lifting the curtain.
    nextTick(() => requestAnimationFrame(() => requestAnimationFrame(reveal)))
  })

  removeError = router.onError(() => {
    if (!covered) return
    covered = false
    reveal()
  })
})

onBeforeUnmount(() => {
  removeBefore?.()
  removeAfter?.()
  removeError?.()
})
</script>

<style scoped>
.pt {
  position: fixed;
  inset: 0;
  z-index: 150;
  display: flex;
  pointer-events: none;
  visibility: hidden;
}
.pt-col {
  flex: 1;
  height: 100%;
  margin-right: -1px;
  background: #2563eb;
}
.pt-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.pt-label-inner {
  display: inline-block;
  color: #fff;
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 1;
  font-size: clamp(2.75rem, 11vw, 9rem);
  text-transform: uppercase;
  padding: 0.05em 0.1em;
}
</style>
