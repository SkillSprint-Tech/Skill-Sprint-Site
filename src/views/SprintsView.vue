<template>
  <div ref="pageScope" class="overflow-x-hidden">

    <!-- ═══════════════════════════════════════ -->
    <!-- HERO -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="heroScope" class="relative bg-[#F8FAFC] pt-10 sm:pt-14 md:pt-20 pb-10 md:pb-16 text-center px-4 overflow-hidden">

      <div class="hidden sm:block pointer-events-none select-none" aria-hidden="true">
        <div class="absolute left-4 md:left-[10%] lg:left-[16%] top-[16%] -rotate-6
                    bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" style="font-family: 'Handlee', cursive;">
          🚀 shipping soon
        </div>
        <div class="absolute right-4 md:right-[10%] lg:right-[16%] top-[12%] rotate-6
                    bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" style="font-family: 'Handlee', cursive;">
          📋 structured tracks
        </div>
        <div class="absolute left-2 md:left-[7%] lg:left-[12%] top-[30%] rotate-8
                    bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" style="font-family: 'Handlee', cursive;">
          ⏰ time-boxed
        </div>
        <div class="absolute right-2 md:right-[7%] lg:right-[12%] top-[28%] -rotate-4
                    bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" style="font-family: 'Handlee', cursive;">
          💻 real deadlines
        </div>
      </div>

      <div class="relative z-10">
        <h1 class="hero-heading text-[2.4rem] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-4">
          Real Projects.<br/>
          <span class="text-blue-600">Real Deadlines.</span>
        </h1>
        <p class="hero-sub max-w-xs sm:max-w-sm md:max-w-2xl mx-auto text-gray-500 text-sm sm:text-base md:text-lg mb-8 leading-relaxed px-2">
          Each sprint is a focused, time-boxed engineering challenge. Teams build, ship, and demo production code in structured cycles.
        </p>
        <div class="flex justify-center">
          <span class="inline-block bg-blue-50 text-blue-600 text-xs font-extrabold px-4 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest">
            Active Programs
          </span>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- ACTIVE SPRINTS -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="activeScope" class="bg-[#F8FAFC] px-4 sm:px-6 pb-16 sm:pb-24">
      <div class="max-w-7xl mx-auto">
        <div class="mb-10">
          <h2 class="active-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Active Tracks
          </h2>
          <p class="active-sub text-gray-500 text-base mt-2 font-medium">
            Current engineering sprints accepting participants.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SprintCard
            v-for="sprint in activeSprints"
            :key="sprint.title"
            v-bind="sprint"
            class="sprint-card"
          />
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- HOW IT WORKS (Light Section — Fanned Cards) -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="howSection" class="bg-slate-50 py-16 sm:py-20 md:py-28 px-4 sm:px-6 overflow-hidden border-y border-gray-100">
      <div class="max-w-3xl mx-auto text-center mb-14 md:mb-20">
        <h2 class="how-heading text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3">
          How Sprints Work
        </h2>
        <p class="how-sub text-gray-500 text-base sm:text-lg font-medium">
          Three steps. No fluff. Just engineering.
        </p>
      </div>

      <div class="relative max-w-4xl mx-auto">
        <!-- Mobile: vertical stack -->
        <div class="flex flex-col gap-5 md:hidden w-full">
          <div v-for="card in howCards" :key="card.label"
               class="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm mx-auto mobile-how-card">
            <div class="bg-blue-600 w-11 h-11 rounded-xl flex items-center justify-center mb-5 shadow-md">
              <span class="text-lg brightness-[6] grayscale contrast-[0.9] sepia-[2]">{{ card.icon }}</span>
            </div>
            <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">{{ card.label }}</p>
            <h3 class="text-lg font-bold text-gray-900 mb-4 leading-snug">{{ card.heading }}</h3>
            <span class="inline-block bg-blue-50 text-blue-600 text-xs font-extrabold px-3 py-1.5 rounded-full border border-blue-100">
              {{ card.tag }}
            </span>
          </div>
        </div>

        <!-- Desktop: fanned -->
        <div class="hidden md:flex justify-center items-end gap-0 h-[380px] relative desktop-how-container">
          <div v-for="card in howCards" :key="card.label"
               class="absolute bg-white rounded-2xl p-6 shadow-2xl flex flex-col hover:z-30 hover:scale-105 duration-300 desktop-how-card"
               :style="card.desktopStyle">
            <div class="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-lg">
              <span class="text-xl brightness-[6] grayscale contrast-[0.9] sepia-[2]">{{ card.icon }}</span>
            </div>
            <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">{{ card.label }}</p>
            <h3 class="text-xl font-bold text-gray-900 mb-auto leading-snug">{{ card.heading }}</h3>
            <span class="mt-5 inline-block bg-blue-50 text-blue-600 text-sm font-extrabold px-4 py-1.5 rounded-full border border-blue-100 w-fit">
              {{ card.tag }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- PAST SPRINTS -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="pastScope" class="bg-[#F8FAFC] py-16 sm:py-20 px-4 sm:px-6">
      <div class="max-w-7xl mx-auto">
        <div class="mb-10">
          <h2 class="past-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Completed Sprints
          </h2>
          <p class="past-sub text-gray-500 text-base mt-2 font-medium">
            Tracks that have shipped and graduated.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SprintCard
            v-for="sprint in pastSprints"
            :key="sprint.title"
            v-bind="sprint"
            class="past-card"
          />
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- CTA -->
    <!-- ═══════════════════════════════════════ -->
    <section class="relative w-full bg-gradient-to-b from-[#F8FAFC] via-[#dceeff] to-[#b8d4f0] py-16 sm:py-20 overflow-hidden">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <div class="relative bg-white rounded-3xl shadow-lg px-6 sm:px-10 py-12 sm:py-16 text-center overflow-hidden cta-card">
          <div class="absolute right-0 bottom-0 pointer-events-none select-none" aria-hidden="true">
            <img src="/sidelogo.png" alt="" class="w-32 sm:w-48 md:w-64 h-auto object-contain opacity-90" style="transform: rotate(-15deg) translate(20%, 15%);" />
          </div>
          <div class="relative z-10">
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug mb-3">
              Ready to
              <span class="text-blue-600 relative inline-block ml-1">Sprint?
                <span class="absolute left-0 -bottom-1 w-full h-[2px] bg-blue-500 rotate-[-2deg]"></span>
              </span>
            </h2>
            <p class="text-gray-500 mt-3 text-sm sm:text-base max-w-sm mx-auto leading-relaxed mb-6">
              Pick a track, join a team, and start shipping.
            </p>
            <div class="flex flex-wrap gap-3 sm:gap-4 justify-center items-center">
              <router-link to="/contact-us">
                <button class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold px-8 py-3 rounded-full text-sm transition-all duration-200 shadow-md shadow-blue-200 cursor-pointer">
                  Join the Sprint
                </button>
              </router-link>
              <router-link to="/initiatives">
                <button class="bg-white border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-700 font-semibold px-8 py-3 rounded-full text-sm transition-all duration-200 cursor-pointer">
                  View Initiatives
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
import { ref } from 'vue'
import { useGSAP } from '../composables/useGSAP'
import SprintCard from '../components/SprintCard.vue'

const pageScope = ref(null)
const heroScope = ref(null)
const activeScope = ref(null)
const howSection = ref(null)
const pastScope = ref(null)

const activeSprints = [
  { icon: '🔧', label: 'Engineering Track', title: 'Open-Source Frontend Architecture', description: 'Collaborative track dedicated to building optimized frontend architectures. Teams design and maintain production-ready repositories with peer reviews and system profiling.', status: 'Active', duration: 'Semester-Long Track', techStack: ['Vue.js', 'Tailwind CSS', 'TypeScript'] },
  { icon: '🤝', label: 'Mentorship Program', title: 'Peer-to-Peer Engineering Mentorship', description: 'Structured mentorship pairing advanced upperclassmen with incoming students. Focus on code logic testing, optimization habits, and interview preparedness.', status: 'Active', duration: 'Rolling Enrollment', techStack: ['CI/CD Paths', 'Code Quality'] },
  { icon: '🧪', label: 'Lab Sprint', title: 'API Design & Systems Architecture', description: 'Intensive sprint building RESTful services from scratch. Teams deploy real infrastructure, handle authentication, and write comprehensive test suites.', status: 'Active', duration: '6-Week Sprint', techStack: ['Node.js', 'PostgreSQL', 'Docker'] },
]

const pastSprints = [
  { icon: '📚', label: 'Completed Bootcamp', title: 'Technical Literacy Bootcamps', description: 'Hands-on workshops bridging academic CS theory and industrial software requirements. Focused on version control discipline, API optimization, and real-world deployments.', status: 'Completed', duration: 'Completed Dec 2025', techStack: ['Systems Design', 'REST APIs', 'Git Engine'] },
  { icon: '🎨', label: 'Completed Sprint', title: 'UI/UX Design Systems Workshop', description: 'Cross-functional sprint where engineering and design students collaborated to build component libraries and design token systems for community projects.', status: 'Completed', duration: 'Completed Mar 2025', techStack: ['Figma', 'Design Tokens', 'Storybook'] },
]

const howCards = [
  { icon: '📝', label: 'Step 1 — Apply', heading: 'Pick a track and submit your interest through our open channels.', tag: 'Zero barriers', desktopStyle: 'width:260px; min-height:300px; top:20px; left:50%; z-index:10;' },
  { icon: '👥', label: 'Step 2 — Build', heading: 'Get matched with a team, a mentor, and a sprint timeline.', tag: 'Real collaboration', desktopStyle: 'width:280px; min-height:280px; top:0; left:50%; z-index:20;' },
  { icon: '🚀', label: 'Step 3 — Ship', heading: 'Deploy production code. Present at demos. Add it to your portfolio.', tag: 'Actual output', desktopStyle: 'width:260px; min-height:270px; top:30px; left:50%; z-index:10;' },
]

// Unified Page Animations
useGSAP((self) => {
  const { gsap } = self

  // Hero
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  tl.from('.hero-heading', { y: 80, opacity: 0, duration: 1.4, skewY: 2 })
    .from('.hero-sub', { y: 30, opacity: 0, duration: 1.1 }, '-=1.0')

  const labels = self.selector('.floating-tag')
  labels.forEach((label, i) => {
    gsap.from(label, { scale: 0, opacity: 0, duration: 1, delay: 0.7 + i * 0.12, ease: 'back.out(2)' })
    gsap.to(label, { y: '+=10', x: i % 2 === 0 ? '+=4' : '-=4', rotation: i % 2 === 0 ? '+=2' : '-=2', duration: 2.2 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.2 })
  })

  // Active sprints
  gsap.from('.active-heading', { scrollTrigger: { trigger: activeScope.value, start: 'top 85%', toggleActions: 'play none none reverse' }, y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
  gsap.from('.active-sub', { scrollTrigger: { trigger: activeScope.value, start: 'top 83%', toggleActions: 'play none none reverse' }, y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' })
  
  const sprintCards = self.selector('.sprint-card')
  if (sprintCards.length > 0) {
    gsap.from(sprintCards, { scrollTrigger: { trigger: activeScope.value, start: 'top 80%', toggleActions: 'play none none reverse' }, y: 60, opacity: 0, scale: 0.92, duration: 0.9, stagger: 0.15, ease: 'back.out(1.3)' })
  }

  // How Sprints Work
  gsap.from('.how-heading', { scrollTrigger: { trigger: howSection.value, start: 'top 80%', toggleActions: 'play none none reverse' }, y: 50, opacity: 0, duration: 1, ease: 'power3.out' })
  gsap.from('.how-sub', { scrollTrigger: { trigger: howSection.value, start: 'top 77%', toggleActions: 'play none none reverse' }, y: 35, opacity: 0, duration: 1, ease: 'power3.out' })

  // Mobile how cards
  const mobileCards = self.selector('.mobile-how-card')
  if (mobileCards.length > 0) {
    gsap.from(mobileCards, { scrollTrigger: { trigger: howSection.value, start: 'top 85%', toggleActions: 'play none none reverse' }, y: 60, opacity: 0, scale: 0.92, duration: 0.9, stagger: 0.15, ease: 'power3.out' })
  }

  // Desktop fanned how cards
  const desktopCards = self.selector('.desktop-how-card')
  if (desktopCards.length > 0) {
    const tlHow = gsap.timeline({ scrollTrigger: { trigger: '.desktop-how-container', start: 'top 75%', toggleActions: 'play none none reverse' } })
    gsap.set(desktopCards, { xPercent: (i) => i === 1 ? -50 : 0, x: 0, y: 120, scale: 0.9, opacity: 0 })
    tlHow.to(desktopCards, { opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.15, ease: 'back.out(1.4)' })
      .to(desktopCards[0], { x: -430, xPercent: 0, rotation: 5, duration: 0.9, ease: 'power3.out' }, '-=0.6')
      .to(desktopCards[1], { x: 0, xPercent: -50, rotation: -4, duration: 0.9, ease: 'power3.out' }, '-=0.8')
      .to(desktopCards[2], { x: 110, xPercent: 0, rotation: 5, duration: 0.9, ease: 'power3.out' }, '-=0.8')
  }

  // Past Sprints
  gsap.from('.past-heading', { scrollTrigger: { trigger: pastScope.value, start: 'top 85%', toggleActions: 'play none none reverse' }, y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
  
  const pastCards = self.selector('.past-card')
  if (pastCards.length > 0) {
    gsap.from(pastCards, { scrollTrigger: { trigger: pastScope.value, start: 'top 80%', toggleActions: 'play none none reverse' }, y: 60, opacity: 0, scale: 0.92, duration: 0.9, stagger: 0.15, ease: 'back.out(1.3)' })
  }
}, pageScope)
</script>
