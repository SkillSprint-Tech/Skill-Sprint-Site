<template>
  <section ref="sectionRef" class="why-section relative bg-[#0B101B] py-20 sm:py-28 md:py-36 px-4 sm:px-6 overflow-hidden">

    <!-- Ambient glowing motion-graphics background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div class="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-indigo-500/15 rounded-full blur-[130px]"></div>
      <!-- Subtle technical grid -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_30%,transparent_100%)]"></div>
    </div>

    <!-- Heading -->
    <div class="max-w-3xl mx-auto text-center mb-16 md:mb-24 relative z-10">
      <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-400 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/20 mb-4 backdrop-blur-sm">
        <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
        Core Philosophy
      </div>
      <h2 class="why-title text-white text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
        Why <span class="text-blue-500">Skill Sprint</span> Exists?
      </h2>
      <p class="why-sub text-gray-400 text-base sm:text-xl font-medium max-w-xl mx-auto">
        Students said this. We didn't make it up. Built to break the cycle of passive tutorials.
      </p>
    </div>

    <!-- Cards Container -->
    <div class="relative max-w-5xl mx-auto z-10">

      <!-- Mobile: clean staggered cards -->
      <div class="flex flex-col gap-6 md:hidden w-full">
        <div
          v-for="(card, i) in cards"
          :key="card.label"
          class="mobile-card bg-white rounded-3xl p-7 shadow-2xl border border-white/10 relative overflow-hidden"
        >
          <div class="flex items-center justify-between mb-5">
            <div class="bg-gradient-to-tr from-blue-600 to-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 text-white">
              <span class="text-xl">{{ card.icon }}</span>
            </div>
            <span class="font-mono text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full">
              0{{ i + 1 }}
            </span>
          </div>
          <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 font-mono">{{ card.label }}</p>
          <h3 class="text-xl font-bold text-gray-900 mb-4 leading-snug">{{ card.heading }}</h3>
          <span class="inline-block bg-blue-50 text-blue-600 text-xs font-extrabold px-3 py-1.5 rounded-full border border-blue-100">
            {{ card.tag }}
          </span>
        </div>
      </div>

      <!-- Desktop: 3D Spatial Fanned Cards pinned / scrubbed -->
      <div class="hidden md:flex justify-center items-center h-[460px] relative desktop-container perspective-1000">
        <div
          v-for="(card, i) in cards"
          :key="card.label"
          class="desktop-card absolute bg-white rounded-3xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.4)] flex flex-col justify-between border border-slate-100 cursor-pointer select-none transition-shadow duration-300 hover:shadow-[0_35px_80px_rgba(37,99,235,0.25)]"
          :data-index="i"
          @pointermove="(e) => onCardMove(e, i)"
          @pointerleave="(e) => onCardLeave(e, i)"
          :style="{ width: '310px', height: '360px', zIndex: i === 1 ? 25 : 15 }"
        >
          <div>
            <div class="flex items-center justify-between mb-6">
              <div class="bg-gradient-to-tr from-blue-600 to-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 text-white">
                <span class="text-2xl">{{ card.icon }}</span>
              </div>
              <span class="font-mono text-xs font-extrabold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                0{{ i + 1 }}
              </span>
            </div>
            <p class="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-2.5">{{ card.label }}</p>
            <h3 class="text-xl font-extrabold text-gray-900 leading-snug">{{ card.heading }}</h3>
          </div>

          <div class="pt-6 border-t border-gray-100 flex items-center justify-between">
            <span class="inline-block bg-blue-50 text-blue-600 text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-blue-100">
              {{ card.tag }}
            </span>
            <span class="text-gray-300 hover:text-blue-600 transition-colors">
              <i class="fa-solid fa-arrow-right-long text-sm"></i>
            </span>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useGSAP } from '../../composables/useGSAP'
import { SplitText } from '../../motion/gsap'
import { hasFinePointer } from '../../motion/intro'

const sectionRef = ref(null)

const cards = [
  {
    icon: '👥',
    label: 'Community-driven learning',
    heading: 'You learn with peers who are equally ambitious and motivated.',
    tag: 'No solo grind',
  },
  {
    icon: '🧩',
    label: 'Multi-disciplinary sprints',
    heading: 'Tech. Design. Architecture. Real engineering pipelines.',
    tag: 'Mix skills, ship magic',
  },
  {
    icon: '🤝',
    label: 'Free & Open Ecosystem',
    heading: 'Zero paywalls. Zero gated content. 100% peer powered.',
    tag: 'Yes, genuinely free',
  },
]

const onCardMove = (e, i) => {
  if (!hasFinePointer()) return
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  card.style.transform = `perspective(1000px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-8px)`
}

const onCardLeave = (e, i) => {
  const card = e.currentTarget
  // Return to GSAP controlled transform
  card.style.transform = ''
}

useGSAP(({ gsap, ScrollTrigger, selector }) => {
  // 1. Heading SplitText reveal
  const titleSplit = SplitText.create(selector('.why-title'), { type: 'words,chars', wordsClass: 'ww' })
  gsap.from(titleSplit.chars, {
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    y: 50,
    opacity: 0,
    rotateX: -60,
    stagger: 0.02,
    duration: 1,
    ease: 'power3.out',
  })

  gsap.from(selector('.why-sub'), {
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
    y: 30,
    opacity: 0,
    duration: 0.9,
    ease: 'power2.out',
  })

  // 2. Desktop 3D Fanned Cards Scrub Animation
  const desktopCards = selector('.desktop-card')
  if (desktopCards.length === 3) {
    const cardTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.desktop-container',
        start: 'top 82%',
        end: 'bottom 40%',
        scrub: 1.2,
      },
    })

    // Start stacked in the center, zero rotation
    gsap.set(desktopCards, {
      xPercent: -50,
      left: '50%',
      y: 80,
      scale: 0.85,
      opacity: 0,
    })

    // Scrub rollout: middle card lifts, left/right fan out with realistic 3D angles
    cardTl
      .to(desktopCards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
      })
      .to(desktopCards[0], {
        x: -360,
        rotationZ: -7,
        rotationY: 10,
        duration: 1.2,
        ease: 'power3.out',
      }, '-=0.4')
      .to(desktopCards[1], {
        x: 0,
        y: -25,
        scale: 1.05,
        rotationZ: 0,
        duration: 1.2,
        ease: 'power3.out',
      }, '-=1.2')
      .to(desktopCards[2], {
        x: 360,
        rotationZ: 7,
        rotationY: -10,
        duration: 1.2,
        ease: 'power3.out',
      }, '-=1.2')
  }

  // 3. Mobile Card Cascade
  const mobileCards = selector('.mobile-card')
  if (mobileCards.length > 0) {
    gsap.from(mobileCards, {
      scrollTrigger: {
        trigger: mobileCards[0],
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      y: 60,
      opacity: 0,
      scale: 0.92,
      duration: 0.8,
      stagger: 0.16,
      ease: 'power3.out',
    })
  }
}, sectionRef)
</script>

<style scoped>
.perspective-1000 {
  perspective: 1200px;
}

.desktop-card {
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  will-change: transform;
}

.why-title :deep(.ww) {
  display: inline-block;
  overflow: clip;
}
</style>