<template>
  <section ref="heroScope" class="hero relative bg-[#F8FAFC] text-center overflow-hidden">

    <!-- Motion-graphic backdrop: drifting blueprint grid + soft brand-blue light orbs. -->
    <div class="hero-bg pointer-events-none" aria-hidden="true">
      <div class="hero-grid"></div>
      <div class="hero-orbs">
        <span class="hero-orb hero-orb--a"></span>
        <span class="hero-orb hero-orb--b"></span>
        <span class="hero-orb hero-orb--c"></span>
      </div>
    </div>

    <div class="hero-content relative z-10 px-4 pt-10 sm:pt-14 md:pt-16 pb-10 md:pb-14">

      <!-- Floating Annotation Tags (hidden on mobile, show from sm) -->
      <div class="hero-tags hidden sm:block pointer-events-none select-none" aria-hidden="true">
        <div
          v-for="tag in tags"
          :key="tag.text"
          class="hero-tag absolute"
          :class="tag.pos"
          :data-depth="tag.depth"
        >
          <div
            class="hero-tag-inner bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                   text-[11px] font-medium tracking-wide text-gray-600"
            :class="tag.rot"
            style="font-family: 'Handlee', cursive;"
          >
            {{ tag.text }}
          </div>
        </div>
      </div>

      <!-- Heading -->
      <div class="hero-copy relative z-10">
        <h1 class="text-[2.4rem] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-4">
          <span class="hero-line block">Learn by doing</span>
          <span class="hero-line hero-line--accent relative inline-block text-blue-600">
            Build by collaborating
            <svg class="hero-squiggle hidden lg:block" viewBox="0 0 600 24" preserveAspectRatio="none" aria-hidden="true">
              <path pathLength="1" d="M4 16 C 90 4, 160 22, 250 12 S 420 4, 500 13 S 580 18, 596 8" />
            </svg>
          </span>
        </h1>

        <!-- Subtext -->
        <p class="hero-sub max-w-xs sm:max-w-sm md:max-w-2xl mx-auto text-gray-500 text-sm sm:text-base md:text-lg mb-8 leading-relaxed px-2">
          A student-driven community where learners connect, collaborate on projects, and grow together.
        </p>

        <!-- CTA Buttons -->
        <div class="hero-ctas flex flex-row items-center justify-center gap-3 mb-10 md:mb-14">
          <router-link v-magnetic to="/contact-us" class="hero-cta">
            <button class="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-blue-600 text-white text-sm sm:text-base font-semibold hover:bg-blue-700 hover:scale-105 active:scale-95 transition-[background-color,scale] duration-200 shadow-md shadow-blue-200 cursor-pointer">
              Join the Sprint
            </button>
          </router-link>
          <router-link v-magnetic to="/contact-us" class="hero-cta">
            <button class="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-white border border-gray-300 text-gray-700 text-sm sm:text-base font-semibold hover:bg-gray-50 hover:scale-105 active:scale-95 transition-[background-color,scale] duration-200 cursor-pointer">
              Contact us
            </button>
          </router-link>
        </div>
      </div>

      <!-- Image Cards Row -->
      <div class="hero-row relative z-10 w-full overflow-x-auto pb-3 -mx-4 px-4" style="-webkit-overflow-scrolling: touch; scrollbar-width: none;">
        <div class="flex gap-3 sm:gap-4 md:justify-center md:flex-wrap w-max md:w-full mx-auto flex-wrap" data-cursor="Scroll">
          <div
            v-for="(img, i) in images"
            :key="i"
            class="hero-card-wrap flex-shrink-0"
            :data-featured="i === FEATURED ? '' : null"
          >
            <div
              class="hero-card w-[100px] sm:w-[130px] md:w-[200px] h-[80px] sm:h-[100px] md:h-[160px]
                     rounded-2xl md:rounded-3xl overflow-hidden bg-gray-200 border-2 border-white
                     shadow-lg transition-[scale] duration-300 hover:scale-[1.05]"
              :class="[
                i === 0 ? 'md:rotate-2 md:translate-y-3' : '',
                i === 1 ? 'md:-rotate-2' : '',
                i === 2 ? 'md:rotate-3 md:translate-y-4' : '',
                i === 3 ? 'md:-rotate-1' : '',
              ]"
            >
              <img :src="img.src" :alt="img.alt" class="w-full h-full object-cover" :loading="i === FEATURED ? 'eager' : 'lazy'" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll stage (desktop): the featured photo grows out of its card to fill the screen. -->
    <div class="hero-stage" aria-hidden="true">
      <img class="hero-stage-img" :src="images[FEATURED].src" alt="" decoding="async" />
      <div class="hero-stage-shade"></div>
      <div class="hero-stage-copy">
        <p class="hero-stage-eyebrow font-mono">[ 1500+ students · 11 universities · 20 mentors ]</p>
        <div class="hero-stage-title">
          <span class="hs-mask"><span class="hs-word">Learn.</span></span>
          <span class="hs-mask"><span class="hs-word">Build.</span></span>
          <span class="hs-mask"><span class="hs-word hs-word--accent">Sprint.</span></span>
        </div>
      </div>
      <div class="hero-stage-hint font-mono">Keep scrolling</div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useGSAP } from '../../composables/useGSAP'
import { SplitText } from '../../motion/gsap'
import { whenIntroDone, isIntroDone, hasFinePointer } from '../../motion/intro'

const heroScope = ref(null)
const FEATURED = 2

const images = [
  { src: '/Speaker.jpg.jpeg', alt: 'Speaker at Skill Sprint event' },
  { src: '/Short Group.jpg.jpeg', alt: 'Group of Skill Sprint students' },
  { src: '/Long Group.jpg.jpeg', alt: 'Large Skill Sprint community group' },
  { src: '/Crowd.JPG.jpeg', alt: 'Skill Sprint event crowd' },
]

const tags = [
  { text: '⏳ portfolio loading…',         pos: 'left-4 md:left-[8%] lg:left-[14%] top-[14%]',   rot: '-rotate-6', depth: 1.2 },
  { text: '🧠 real projects, real panic',   pos: 'right-4 md:right-[8%] lg:right-[14%] top-[10%]', rot: 'rotate-6',  depth: 0.8 },
  { text: '💪🏼 flex but deserved',          pos: 'left-2 md:left-[6%] lg:left-[11%] top-[26%]',   rot: 'rotate-12', depth: 1.6 },
  { text: '🔖 better than doomscrolling',   pos: 'right-2 md:right-[6%] lg:right-[11%] top-[28%]', rot: '-rotate-9', depth: 1.0 },
]

const navHeight = () => document.querySelector('nav')?.offsetHeight ?? 0

/** Position of `el` inside `ancestor` from layout offsets — immune to any transforms. */
const offsetWithin = (el, ancestor) => {
  let top = 0
  let left = 0
  let node = el
  while (node && node !== ancestor) {
    top += node.offsetTop
    left += node.offsetLeft
    node = node.offsetParent
  }
  return { top, left }
}

useGSAP(({ gsap, ScrollTrigger, selector }) => {
  const hero = heroScope.value
  const q = selector

  // ── 1. Entrance (plays once the preloader curtain lifts) ──────────────────────────
  const lines = q('.hero-line')
  const titleSplit = SplitText.create(lines, { type: 'words,chars', wordsClass: 'hw' })
  const subSplit = SplitText.create(q('.hero-sub'), { type: 'words' })

  const intro = gsap.timeline({ paused: true, defaults: { ease: 'cinematic' } })
  intro
    .fromTo(titleSplit.chars, { yPercent: 115 }, { yPercent: 0, duration: 1.3, stagger: 0.022 })
    .fromTo(q('.hero-squiggle path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' }, 0.6)
    .fromTo(subSplit.words,
      { opacity: 0, y: 18, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.025, ease: 'power3.out' }, 0.45)
    .fromTo(q('.hero-cta'),
      { opacity: 0, y: 24, scale: 0.85 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.1, ease: 'pop' }, 0.7)
    .fromTo(q('.hero-card'),
      { opacity: 0, y: 160, scale: 0.8, rotation: (i) => [-14, 10, -8, 14][i] || 0 },
      { opacity: 1, y: 0, scale: 1, rotation: 0, duration: 1.4, stagger: 0.1 }, 0.75)
    .fromTo(q('.hero-tag-inner'),
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.9, stagger: 0.1, ease: 'pop' }, 1.0)
    .fromTo(q('.hero-orb'), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 2, stagger: 0.2, ease: 'power2.out' }, 0)

  // On an SPA visit the route curtain is still lifting — give it a beat.
  let alive = true
  const delay = isIntroDone() ? 0.45 : 0
  whenIntroDone().then(() => { if (alive) intro.delay(delay).play() })

  // Ambient motion: tags bob, orbs drift — never stops, like a looping comp in After Effects.
  q('.hero-tag-inner').forEach((tag, i) => {
    gsap.to(tag, {
      y: '+=10', x: i % 2 ? '-=4' : '+=4', rotation: i % 2 ? '-=2' : '+=2',
      duration: 2.2 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.2,
    })
  })
  q('.hero-orb').forEach((orb, i) => {
    gsap.to(orb, {
      xPercent: [18, -22, 14][i], yPercent: [-14, 18, 22][i],
      duration: 9 + i * 3, yoyo: true, repeat: -1, ease: 'sine.inOut',
    })
  })

  // ── 2. Mouse depth (mouse only) ────────────────────────────────────────────────────
  let onPointer = null
  if (hasFinePointer()) {
    const tagMovers = q('.hero-tag').map((el) => ({
      depth: parseFloat(el.dataset.depth) || 1,
      x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3.out' }),
    }))
    const orbsEl = q('.hero-orbs')[0]
    const orbX = gsap.quickTo(orbsEl, 'x', { duration: 1.8, ease: 'power3.out' })
    const orbY = gsap.quickTo(orbsEl, 'y', { duration: 1.8, ease: 'power3.out' })
    onPointer = (e) => {
      const r = hero.getBoundingClientRect()
      const nx = (e.clientX - r.left) / r.width - 0.5
      const ny = (e.clientY - r.top) / r.height - 0.5
      tagMovers.forEach((m) => { m.x(nx * 40 * m.depth); m.y(ny * 30 * m.depth) })
      orbX(nx * -60)
      orbY(ny * -40)
    }
    hero.addEventListener('pointermove', onPointer)
  }

  // ── 3. Scroll story ────────────────────────────────────────────────────────────────
  const mm = gsap.matchMedia()

  // Desktop: pin the hero and zoom *into* the featured photo, Apple-keynote style.
  mm.add('(min-width: 768px) and (min-height: 560px)', () => {
    const stage = q('.hero-stage')[0]
    const wraps = q('.hero-card-wrap')
    const featured = wraps[FEATURED]
    const others = wraps.filter((w) => w !== featured)

    const cardInset = () => {
      const { top, left } = offsetWithin(featured, hero)
      const right = hero.offsetWidth - (left + featured.offsetWidth)
      const bottom = hero.offsetHeight - (top + featured.offsetHeight)
      return `inset(${top}px ${right}px ${bottom}px ${left}px round 24px)`
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: () => `top ${navHeight()}px`,
        end: () => `+=${Math.round(window.innerHeight * 1.7)}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    tl.to(q('.hero-copy'), { yPercent: -35, scale: 0.9, opacity: 0, duration: 0.35, ease: 'power2.in' }, 0)
      .to(q('.hero-tags'), { scale: 1.6, opacity: 0, duration: 0.35, ease: 'power2.in' }, 0)
      .to(q('.hero-bg'), { scale: 1.25, opacity: 0.4, duration: 0.6, ease: 'none' }, 0)
      .to(others, {
        x: (i) => (wraps.indexOf(others[i]) < FEATURED ? -1 : 1) * 320,
        y: 90,
        rotation: (i) => (wraps.indexOf(others[i]) < FEATURED ? -10 : 10),
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
      }, 0.02)
      .fromTo(stage, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, ease: 'none' }, 0)
      .to(featured, { opacity: 0, duration: 0.05, ease: 'none' }, 0.03)
      .fromTo(stage,
        { clipPath: () => cardInset() },
        { clipPath: 'inset(0px 0px 0px 0px round 0px)', duration: 0.55, ease: 'power3.inOut', immediateRender: true }, 0)
      .fromTo(q('.hero-stage-img'), { scale: 1.4 }, { scale: 1, duration: 0.75, ease: 'power2.out' }, 0)
      .fromTo(q('.hero-stage-shade'), { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'none' }, 0.38)
      .fromTo(q('.hs-word'), { yPercent: 120, rotate: 4 }, { yPercent: 0, rotate: 0, duration: 0.3, stagger: 0.07, ease: 'power3.out' }, 0.5)
      .fromTo(q('.hero-stage-eyebrow'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, 0.62)
      .fromTo(q('.hero-stage-hint'), { opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.75)
      .to({}, { duration: 0.2 }) // a beat to breathe before the pin releases
  })

  // Mobile: lighter parallax, no pinning (keeps touch scrolling dependable).
  mm.add('(max-width: 767px), (max-height: 559px)', () => {
    gsap.timeline({
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 },
    })
      .to(q('.hero-copy'), { y: -60, opacity: 0.25, ease: 'none' }, 0)
      .to(q('.hero-row'), { y: -30, ease: 'none' }, 0)
  })

  return () => {
    alive = false
    if (onPointer) hero.removeEventListener('pointermove', onPointer)
    mm.revert()
  }
}, heroScope)
</script>

<style scoped>
/* Hide scrollbar for image row */
div::-webkit-scrollbar {
  display: none;
}

/* Full first screen on desktop, so the pinned stage fills everything under the navbar. */
@media (min-width: 768px) {
  .hero { min-height: calc(100svh - var(--nav-h, 0px)); display: flex; }
  .hero-content { flex: 1; display: flex; flex-direction: column; justify-content: center; }
}

/* Backdrop ---------------------------------------------------------------------- */
.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.hero-grid {
  position: absolute;
  inset: -64px;
  background-image:
    linear-gradient(rgba(37, 99, 235, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37, 99, 235, 0.07) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 75%);
  animation: hero-grid-drift 18s linear infinite;
}
@keyframes hero-grid-drift {
  to { transform: translate3d(64px, 64px, 0); }
}
.hero-orbs {
  position: absolute;
  inset: 0;
}
.hero-orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(70px);
  will-change: transform;
}
.hero-orb--a {
  width: 42vw; height: 42vw; max-width: 560px; max-height: 560px;
  left: -8%; top: -18%;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.22), transparent 70%);
}
.hero-orb--b {
  width: 36vw; height: 36vw; max-width: 480px; max-height: 480px;
  right: -6%; top: 6%;
  background: radial-gradient(circle, rgba(96, 165, 250, 0.26), transparent 70%);
}
.hero-orb--c {
  width: 30vw; height: 30vw; max-width: 420px; max-height: 420px;
  left: 35%; bottom: -22%;
  background: radial-gradient(circle, rgba(129, 140, 248, 0.18), transparent 70%);
}

/* Heading ----------------------------------------------------------------------- */
/* Each word is a mask; its characters rise up from below the baseline. */
.hero-copy :deep(.hw) {
  overflow: clip;
  /* Room for descenders (g, y) inside the mask without changing line spacing. */
  padding-bottom: 0.1em;
  margin-bottom: -0.1em;
}
.hero-squiggle {
  position: absolute;
  left: 2%;
  right: 2%;
  bottom: -0.18em;
  width: 96%;
  height: 0.32em;
  overflow: visible;
}
.hero-squiggle path {
  fill: none;
  stroke: #60a5fa;
  stroke-width: 5;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
  vector-effect: non-scaling-stroke;
}

/* Stage ------------------------------------------------------------------------- */
.hero-stage {
  position: absolute;
  inset: 0;
  z-index: 30;
  overflow: hidden;
  visibility: hidden;
  background: #0b101b;
  pointer-events: none;
}
.hero-stage-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
}
.hero-stage-shade {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 50% 60%, rgba(11, 16, 27, 0.25), rgba(11, 16, 27, 0.8)),
    linear-gradient(180deg, rgba(37, 99, 235, 0.25), transparent 40%);
}
.hero-stage-copy {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  color: #fff;
  padding: 2rem;
}
.hero-stage-eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
}
.hero-stage-title {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0 0.28em;
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 0.95;
  font-size: clamp(3.5rem, 10vw, 10rem);
}
.hs-mask {
  display: inline-block;
  overflow: clip;
  padding: 0.04em 0.04em 0.1em;
}
.hs-word {
  display: inline-block;
}
.hs-word--accent { color: #60a5fa; }
.hero-stage-hint {
  position: absolute;
  bottom: 1.75rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}
.hero-stage-hint::after {
  content: '';
  display: block;
  width: 1px;
  height: 36px;
  margin: 0.75rem auto 0;
  background: linear-gradient(#fff, transparent);
  animation: hero-hint 1.8s ease-in-out infinite;
  transform-origin: top;
}
@keyframes hero-hint {
  0% { transform: scaleY(0); opacity: 1; }
  60% { transform: scaleY(1); opacity: 1; }
  100% { transform: scaleY(1); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-grid { animation: none; }
}
</style>