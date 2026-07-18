<template>
  <div ref="pageScope" class="overflow-x-hidden">

    <!-- ═══════════════════════════════════════ -->
    <!-- HERO SECTION -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="heroScope" class="relative bg-[#F8FAFC] pt-10 sm:pt-14 md:pt-20 pb-10 md:pb-16 text-center px-4 overflow-hidden">

      <!-- Floating Annotation Tags -->
      <div class="hidden sm:block pointer-events-none select-none" aria-hidden="true">
        <div class="absolute left-4 md:left-[10%] lg:left-[16%] top-[16%] -rotate-6
                    bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" style="font-family: 'Handlee', cursive;">
          🔧 shipping code
        </div>
        <div class="absolute right-4 md:right-[10%] lg:right-[16%] top-[12%] rotate-6
                    bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" style="font-family: 'Handlee', cursive;">
          📦 real repos
        </div>
        <div class="absolute left-2 md:left-[7%] lg:left-[12%] top-[32%] rotate-8
                    bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" style="font-family: 'Handlee', cursive;">
          🧪 tested in prod
        </div>
        <div class="absolute right-2 md:right-[7%] lg:right-[12%] top-[30%] -rotate-4
                    bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" style="font-family: 'Handlee', cursive;">
          🏗️ building daily
        </div>
      </div>

      <!-- Heading -->
      <div class="relative z-10">
        <h1 class="hero-heading text-[2.4rem] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-4">
          Concrete Community<br/>
          <span class="text-blue-600">Engineering.</span>
        </h1>

        <p class="hero-sub max-w-xs sm:max-w-sm md:max-w-2xl mx-auto text-gray-500 text-sm sm:text-base md:text-lg mb-8 leading-relaxed px-2">
          We do not host abstract classes or theoretical lectures. SkillSprint is defined by what we build. Explore the live open-source codebases, systems architectures, and localized technical training bootcamps developed entirely by our student network.
        </p>

        <!-- Eyebrow Badge -->
        <div class="flex justify-center mb-6">
          <span class="inline-block bg-blue-50 text-blue-600 text-xs font-extrabold px-4 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest">
            Proof of Work
          </span>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- FILTER BAR + GRID -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="gridScope" class="bg-[#F8FAFC] px-4 sm:px-6 pb-16 sm:pb-24">
      <div class="max-w-7xl mx-auto">

        <!-- Filter Bar -->
        <div class="flex flex-wrap items-center justify-center gap-3 mb-12 filter-bar">
          <button
            v-for="filter in taxonomyFilters"
            :key="filter"
            @click="activeFilter = filter"
            class="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer border"
            :class="activeFilter === filter
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
              : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600'"
          >
            {{ filter }}
          </button>

          <span class="w-px h-6 bg-gray-200 mx-2 hidden sm:block"></span>

          <button
            v-for="lifecycle in lifecycleFilters"
            :key="lifecycle"
            @click="activeLifecycle = lifecycle"
            class="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer border"
            :class="activeLifecycle === lifecycle
              ? 'bg-gray-900 text-white border-gray-900 shadow-md'
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700'"
          >
            {{ lifecycle }}
          </button>
        </div>

        <!-- Initiative Cards Grid -->
        <div v-if="filteredInitiatives.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 initiative-grid">
          <InitiativeCard
            v-for="item in filteredInitiatives"
            :key="item.id"
            :title="item.title"
            :description="item.description"
            :tag="item.tag"
            :status="item.status"
            :techStack="item.techStack"
            class="initiative-card"
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
    <section class="relative w-full bg-gradient-to-b from-[#F8FAFC] via-[#dceeff] to-[#b8d4f0] py-16 sm:py-20 overflow-hidden">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <div ref="ctaCard" class="relative bg-white rounded-3xl shadow-lg px-6 sm:px-10 py-12 sm:py-16 text-center overflow-hidden cta-card">
          <div class="absolute right-0 bottom-0 pointer-events-none select-none" aria-hidden="true">
            <img src="/sidelogo.png" alt="" class="w-32 sm:w-48 md:w-64 h-auto object-contain opacity-90" style="transform: rotate(-15deg) translate(20%, 15%);" />
          </div>
          <div class="relative z-10">
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug mb-3">
              Start <span class="text-blue-600 relative inline-block ml-1">Contributing
                <span class="absolute left-0 -bottom-1 w-full h-[2px] bg-blue-500 rotate-[-2deg]"></span>
              </span>
            </h2>
            <p class="text-gray-500 mt-3 text-sm sm:text-base max-w-sm mx-auto leading-relaxed mb-6">
              Join an active engineering track or propose your own open-source initiative.
            </p>
            <div class="flex flex-wrap gap-3 sm:gap-4 justify-center items-center">
              <router-link to="/contact-us">
                <button class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold px-8 py-3 rounded-full text-sm transition-all duration-200 shadow-md shadow-blue-200 cursor-pointer">
                  Join the Sprint
                </button>
              </router-link>
              <router-link to="/contact-us">
                <button class="bg-white border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-700 font-semibold px-8 py-3 rounded-full text-sm transition-all duration-200 cursor-pointer">
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
import { initiativesData } from '../data/initiatives.js'
import InitiativeCard from '../components/InitiativeCard.vue'

const heroScope = ref(null)
const pageScope = ref(null)
const gridScope = ref(null)

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

// Unified Page Animations
useGSAP((self) => {
  const { gsap } = self

  // Hero animations
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  tl.from('.hero-heading', {
    y: 80,
    opacity: 0,
    duration: 1.4,
    skewY: 2,
  })
  .from('.hero-sub', {
    y: 30,
    opacity: 0,
    duration: 1.1
  }, '-=1.0')
  .from('.bg-blue-50', {
    scale: 0.85,
    opacity: 0,
    duration: 0.9,
    ease: 'back.out(1.8)'
  }, '-=0.8')

  // Floating tags
  const labels = self.selector('.floating-tag')
  labels.forEach((label, i) => {
    gsap.from(label, {
      scale: 0,
      opacity: 0,
      duration: 1,
      delay: 0.7 + i * 0.12,
      ease: 'back.out(2)'
    })
    gsap.to(label, {
      y: '+=10',
      x: i % 2 === 0 ? '+=4' : '-=4',
      rotation: i % 2 === 0 ? '+=2' : '-=2',
      duration: 2.2 + i * 0.4,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      delay: i * 0.2
    })
  })

  // Filter bar
  gsap.from('.filter-bar button', {
    scrollTrigger: {
      trigger: gridScope.value,
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    },
    y: 20,
    opacity: 0,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power3.out'
  })

  // Initiative cards
  const cards = self.selector('.initiative-card')
  if (cards.length > 0) {
    gsap.from(cards, {
      scrollTrigger: {
        trigger: gridScope.value,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 60,
      opacity: 0,
      scale: 0.92,
      duration: 0.9,
      stagger: 0.15,
      ease: 'back.out(1.3)'
    })
  }

  // CTA card
  const cta = self.selector('.cta-card')
  if (cta.length > 0) {
    gsap.from(cta, {
      scrollTrigger: {
        trigger: cta[0],
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 40,
      scale: 0.9,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.5)'
    })
  }
}, pageScope)
</script>
