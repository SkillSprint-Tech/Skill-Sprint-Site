<template>
  <div ref="pageScope" class="overflow-x-hidden">

    <!-- ═══════════════════════════════════════ -->
    <!-- HERO SECTION -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="heroScope" class="px-4 sm:px-6 relative bg-[#F8FAFC] pt-12 sm:pt-16 md:pt-24 pb-12 md:pb-20 text-center overflow-hidden">

      <!-- Ambient blueprint grid and light orbs -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div class="absolute top-10 left-1/4 w-[480px] h-[320px] bg-blue-500/10 blur-[120px] rounded-full"></div>
        <div class="absolute bottom-10 right-1/4 w-[400px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full"></div>
      </div>

      <!-- Floating Annotation Tags -->
      <div class="hidden sm:block pointer-events-none select-none relative z-10" aria-hidden="true">
        <div class="absolute left-4 md:left-[10%] lg:left-[16%] top-[16%] -rotate-6
                    bg-white shadow-sm px-3.5 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" data-depth="1.2" style="font-family: 'Handlee', cursive;">
          🔧 shipping code
        </div>
        <div class="absolute right-4 md:right-[10%] lg:right-[16%] top-[12%] rotate-6
                    bg-white shadow-sm px-3.5 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" data-depth="0.8" style="font-family: 'Handlee', cursive;">
          📦 real repos
        </div>
        <div class="absolute left-2 md:left-[7%] lg:left-[12%] top-[34%] rotate-8
                    bg-white shadow-sm px-3.5 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" data-depth="1.5" style="font-family: 'Handlee', cursive;">
          🧪 tested in prod
        </div>
        <div class="absolute right-2 md:right-[7%] lg:right-[12%] top-[32%] -rotate-4
                    bg-white shadow-sm px-3.5 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" data-depth="1.1" style="font-family: 'Handlee', cursive;">
          🏗️ building daily
        </div>
      </div>

      <!-- Heading -->
      <div class="relative z-10 max-w-4xl mx-auto">
        <div class="flex justify-center mb-5">
          <span class="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-mono font-extrabold px-4 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            Proof of Work
          </span>
        </div>

        <h1 class="hero-heading h-display text-gray-900 leading-[1.1] mb-5">
          Concrete Community<br/>
          <span class="text-blue-600">Engineering.</span>
        </h1>

        <p class="hero-sub max-w-xs sm:max-w-sm md:max-w-2xl mx-auto text-gray-500 text-base sm:text-lg mb-8 leading-relaxed px-2 font-normal">
          We do not host abstract classes or theoretical lectures. SkillSprint is defined by what we build. Explore the live open-source codebases, systems architectures, and localized technical training bootcamps developed entirely by our student network.
        </p>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- FILTER BAR + GRID -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="gridScope" class="px-4 sm:px-6 bg-[#F8FAFC] pb-20 sm:pb-28 relative z-10">
      <div class="max-w-7xl mx-auto">

        <!-- Filter Bar with Magnetic Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-3 mb-14 filter-bar">
          <button
            v-for="filter in taxonomyFilters"
            :key="filter"
            @click="activeFilter = filter"
            v-magnetic="0.2"
            class="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer border"
            :class="activeFilter === filter
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
              : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600 shadow-xs'"
          >
            {{ filter }}
          </button>

          <span class="w-px h-6 bg-gray-200 mx-2 hidden sm:block"></span>

          <button
            v-for="lifecycle in lifecycleFilters"
            :key="lifecycle"
            @click="activeLifecycle = lifecycle"
            v-magnetic="0.2"
            class="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer border"
            :class="activeLifecycle === lifecycle
              ? 'bg-gray-900 text-white border-gray-900 shadow-md'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900 shadow-xs'"
          >
            {{ lifecycle }}
          </button>
        </div>

        <!-- Initiative Cards Grid -->
        <div v-if="filteredInitiatives.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 initiative-grid">
          <InitiativeCard
            v-for="item in filteredInitiatives"
            :key="item.id"
            :title="item.title"
            :description="item.description"
            :tag="item.tag"
            :status="item.status"
            :techStack="item.techStack"
            class="initiative-card-el"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-20 text-center">
          <div class="bg-white w-20 h-20 rounded-full border border-gray-200 shadow-sm flex items-center justify-center mb-6">
            <svg class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p class="text-gray-400 text-sm max-w-md leading-relaxed">
            No technical initiatives match your chosen filter taxonomy at this time. Adjust selectors to view active tracks.
          </p>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- CTA SECTION -->
    <!-- ═══════════════════════════════════════ -->
    <section class="relative w-full bg-gradient-to-b from-[#F8FAFC] via-[#dceeff] to-[#b8d4f0] py-20 overflow-hidden">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div ref="ctaCard" class="relative bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_25px_70px_rgba(37,99,235,0.12)] border border-white/80 px-6 sm:px-12 py-14 sm:py-20 text-center overflow-hidden">
          <div class="absolute right-0 bottom-0 pointer-events-none select-none" aria-hidden="true">
            <img ref="ctaRobot" src="/sidelogo.png" alt="" class="w-36 sm:w-56 md:w-72 h-auto object-contain opacity-95 filter drop-shadow-xl" style="transform: rotate(-15deg) translate(25%, 20%);" />
          </div>
          <div class="relative z-10 max-w-xl mx-auto">
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug mb-4">
              Start <span class="text-blue-600 relative inline-block ml-1">Contributing
                <span class="absolute left-0 -bottom-1 w-full h-[3px] bg-blue-500 rotate-[-2deg] rounded-full"></span>
              </span>
            </h2>
            <p class="text-gray-500 mt-3 text-base sm:text-lg max-w-sm mx-auto leading-relaxed mb-8 font-medium">
              Join an active engineering track or propose your own open-source initiative.
            </p>
            <div class="flex flex-wrap gap-4 justify-center items-center">
              <router-link v-magnetic to="/contact-us">
                <button class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold px-9 py-3.5 rounded-full text-base transition-all duration-200 shadow-lg shadow-blue-500/25 cursor-pointer">
                  Join the Sprint
                </button>
              </router-link>
              <router-link v-magnetic to="/contact-us">
                <button class="bg-white border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-700 font-semibold px-9 py-3.5 rounded-full text-base transition-all duration-200 cursor-pointer shadow-sm">
                  Contact us
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGSAP } from '../composables/useGSAP'
import { SplitText } from '../motion/gsap'
import { initiativesData } from '../data/initiatives.js'
import InitiativeCard from '../components/InitiativeCard.vue'
import { hasFinePointer } from '../motion/intro'

const heroScope = ref(null)
const pageScope = ref(null)
const gridScope = ref(null)
const ctaRobot = ref(null)

const taxonomyFilters = ['All', 'Engineering', 'Education', 'Community']
const lifecycleFilters = ['All Stages', 'Active', 'Completed']

const activeFilter = ref('All')
const activeLifecycle = ref('All Stages')

const filteredInitiatives = computed(() => {
  return initiativesData.filter(item => {
    const matchesTaxonomy = activeFilter.value === 'All' || item.tag === activeFilter.value
    const matchesLifecycle = activeLifecycle.value === 'All Stages' || item.status === activeLifecycle.value
    return matchesTaxonomy && matchesLifecycle
  })
})

useGSAP(({ gsap, ScrollTrigger, selector }) => {
  // Hero headline SplitText reveal
  const headingSplit = SplitText.create(selector('.hero-heading'), { type: 'words,chars', wordsClass: 'iw' })
  gsap.from(headingSplit.chars, {
    y: 50,
    opacity: 0,
    rotateX: -45,
    stagger: 0.02,
    duration: 1,
    ease: 'power3.out',
  })

  gsap.from(selector('.hero-sub'), {
    y: 30,
    opacity: 0,
    duration: 0.9,
    delay: 0.3,
    ease: 'power3.out',
  })

  // Floating tags animation & mouse parallax
  const labels = selector('.floating-tag')
  labels.forEach((label, i) => {
    gsap.from(label, {
      scale: 0,
      opacity: 0,
      duration: 1,
      delay: 0.5 + i * 0.1,
      ease: 'back.out(2)',
    })
    gsap.to(label, {
      y: '+=8',
      x: i % 2 === 0 ? '+=4' : '-=4',
      rotation: i % 2 === 0 ? '+=2' : '-=2',
      duration: 2.4 + i * 0.4,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    })
  })

  if (hasFinePointer()) {
    const tagMovers = labels.map((el) => ({
      depth: parseFloat(el.dataset.depth) || 1,
      x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3.out' }),
    }))

    const onPointer = (e) => {
      const r = heroScope.value?.getBoundingClientRect()
      if (!r) return
      const nx = (e.clientX - r.left) / r.width - 0.5
      const ny = (e.clientY - r.top) / r.height - 0.5
      tagMovers.forEach((m) => {
        m.x(nx * 30 * m.depth)
        m.y(ny * 20 * m.depth)
      })
    }
    heroScope.value?.addEventListener('pointermove', onPointer)
  }

  // Filter buttons reveal
  gsap.from(selector('.filter-bar button'), {
    scrollTrigger: {
      trigger: gridScope.value,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
    y: 20,
    opacity: 0,
    stagger: 0.06,
    duration: 0.7,
    ease: 'power3.out',
  })

  // Initiative cards entrance
  const cards = selector('.initiative-card-el')
  if (cards.length > 0) {
    gsap.from(cards, {
      scrollTrigger: {
        trigger: gridScope.value,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
      y: 60,
      opacity: 0,
      scale: 0.94,
      stagger: 0.12,
      duration: 0.9,
      ease: 'power3.out',
    })
  }

  // CTA Robot peek
  if (ctaRobot.value) {
    gsap.from(ctaRobot.value, {
      scrollTrigger: {
        trigger: '.cta-card',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      xPercent: 40,
      yPercent: 40,
      opacity: 0,
      duration: 1.2,
      ease: 'back.out(1.6)',
    })
  }
}, pageScope)
</script>

<style scoped>
.hero-heading :deep(.iw) {
  display: inline-block;
  overflow: clip;
}
</style>
