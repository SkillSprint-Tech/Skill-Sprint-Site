<template>
  <div ref="pageScope" class="overflow-x-hidden">

    <!-- ═══════════════════════════════════════ -->
    <!-- HERO -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="heroScope" class="px-4 sm:px-6 relative bg-[#F8FAFC] pt-12 sm:pt-16 md:pt-24 pb-12 md:pb-20 text-center overflow-hidden">

      <!-- Ambient blueprint grid and light orbs -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div class="absolute top-10 left-1/4 w-[480px] h-[320px] bg-blue-500/10 blur-[120px] rounded-full"></div>
        <div class="absolute bottom-10 right-1/4 w-[400px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full"></div>
        <div class="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_30%,transparent_100%)]"></div>
      </div>

      <!-- Floating Annotation Tags -->
      <div class="hidden sm:block pointer-events-none select-none relative z-10" aria-hidden="true">
        <div class="absolute left-4 md:left-[10%] lg:left-[16%] top-[16%] -rotate-6
                    bg-white shadow-sm px-3.5 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" data-depth="1.2" style="font-family: 'Handlee', cursive;">
          🚀 shipping soon
        </div>
        <div class="absolute right-4 md:right-[10%] lg:right-[16%] top-[12%] rotate-6
                    bg-white shadow-sm px-3.5 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" data-depth="0.9" style="font-family: 'Handlee', cursive;">
          📋 structured tracks
        </div>
        <div class="absolute left-2 md:left-[7%] lg:left-[12%] top-[34%] rotate-8
                    bg-white shadow-sm px-3.5 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" data-depth="1.5" style="font-family: 'Handlee', cursive;">
          ⏰ time-boxed
        </div>
        <div class="absolute right-2 md:right-[7%] lg:right-[12%] top-[32%] -rotate-4
                    bg-white shadow-sm px-3.5 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" data-depth="1.1" style="font-family: 'Handlee', cursive;">
          💻 real deadlines
        </div>
      </div>

      <div class="relative z-10 max-w-4xl mx-auto">
        <div class="flex justify-center mb-5">
          <span class="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-mono font-extrabold px-4 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            Active Engineering Sprints
          </span>
        </div>

        <h1 class="hero-heading h-display text-gray-900 leading-[1.1] mb-5">
          Real Projects.<br/>
          <span class="text-blue-600">Real Deadlines.</span>
        </h1>

        <p class="hero-sub max-w-xs sm:max-w-sm md:max-w-2xl mx-auto text-gray-500 text-base sm:text-lg mb-8 leading-relaxed px-2 font-normal">
          Each sprint is a focused, time-boxed engineering challenge. Teams build, ship, and demo production code in structured cycles with zero institutional fluff.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            v-magnetic
            @click="showQuiz = true"
            class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white text-sm font-extrabold px-7 py-3.5 rounded-full shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
          >
            <span>✨ Take the 2-Min Track Quiz</span>
          </button>
          <a
            href="#active-tracks"
            v-magnetic
            class="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 px-7 py-3.5 rounded-full text-sm font-semibold shadow-xs transition-all cursor-pointer"
          >
            <span>Browse Active Tracks</span>
            <i class="fa-solid fa-arrow-down text-xs"></i>
          </a>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- KINETIC VELOCITY MARQUEE -->
    <!-- ═══════════════════════════════════════ -->
    <div ref="marqueeScope" class="sprints-marquee py-6 bg-slate-950 overflow-hidden relative" aria-hidden="true">
      <div class="sprints-marquee-track flex w-max gap-8 font-mono text-sm sm:text-base font-extrabold uppercase text-white/90 tracking-widest select-none">
        <template v-for="pass in 2" :key="pass">
          <span class="flex items-center gap-8">
            <span class="text-blue-400">⚡ RAPID PROTOTYPING</span>
            <span>·</span>
            <span>PRODUCTION SHIPPED</span>
            <span>·</span>
            <span class="text-indigo-400">🔥 6-WEEK SPRINTS</span>
            <span>·</span>
            <span>REAL CI/CD PIPELINES</span>
            <span>·</span>
            <span class="text-emerald-400">PEER CODE REVIEWS</span>
            <span>·</span>
            <span>ZERO EDTECH THEORIES</span>
            <span>·</span>
          </span>
        </template>
      </div>
    </div>

    <!-- ═══════════════════════════════════════ -->
    <!-- ACTIVE SPRINTS -->
    <!-- ═══════════════════════════════════════ -->
    <section id="active-tracks" ref="activeScope" class="px-4 sm:px-6 bg-[#F8FAFC] py-20 sm:py-28 relative z-10">
      <div class="max-w-7xl mx-auto">
        <div class="mb-14">
          <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-600 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-3">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Enrollment Open
          </div>
          <h2 class="active-heading h-sub text-gray-900 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Active <span class="text-blue-600">Tracks</span>
          </h2>
          <p class="active-sub text-gray-500 text-base sm:text-lg mt-3 font-medium">
            Current sprints accepting student engineers across software architecture, infrastructure, and systems.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          <SprintCard
            v-for="sprint in activeSprints"
            :key="sprint.title"
            v-bind="sprint"
            class="sprint-card-el"
          />
        </div>

        <!-- Track Matchmaker Banner -->
        <div class="mt-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_20px_60px_rgba(37,99,235,0.25)] relative overflow-hidden">
          <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div class="space-y-2 relative z-10 max-w-xl">
            <span class="text-[11px] font-mono font-bold uppercase tracking-widest text-blue-200 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Personalized Guidance Engine
            </span>
            <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Unsure which track fits your background and goals?</h3>
            <p class="text-sm sm:text-base text-blue-100 leading-relaxed font-normal">Answer 4 quick questions about your stack passions and goals to find your ideal collaborative path.</p>
          </div>

          <button
            type="button"
            v-magnetic
            @click="showQuiz = true"
            class="shrink-0 bg-white hover:bg-slate-50 text-blue-600 font-extrabold px-8 py-4 rounded-full shadow-lg transition-all cursor-pointer flex items-center gap-3 relative z-10 self-start md:self-auto text-sm"
          >
            <span>Take 2-Min Matchmaker Quiz</span>
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- HOW IT WORKS (3D Spatial Fanned Section) -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="howSection" class="bg-[#0B101B] py-20 sm:py-28 md:py-36 px-4 sm:px-6 overflow-hidden relative">

      <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div class="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-indigo-500/15 rounded-full blur-[130px]"></div>
        <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_30%,transparent_100%)]"></div>
      </div>

      <div class="max-w-3xl mx-auto text-center mb-16 md:mb-24 relative z-10">
        <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-400 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/20 mb-4 backdrop-blur-sm">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
          Sprint Protocol
        </div>
        <h2 class="how-heading text-white text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          How Sprints <span class="text-blue-500">Work</span>
        </h2>
        <p class="how-sub text-gray-400 text-base sm:text-xl font-medium">
          Three steps. No fluff. Just production engineering.
        </p>
      </div>

      <div class="relative max-w-5xl mx-auto z-10">
        <!-- Mobile: vertical stack -->
        <div class="flex flex-col gap-6 md:hidden w-full">
          <div
            v-for="(card, i) in howCards"
            :key="card.label"
            class="mobile-how-card bg-white rounded-3xl p-7 shadow-2xl border border-white/10 relative overflow-hidden"
          >
            <div class="flex items-center justify-between mb-5">
              <div class="bg-gradient-to-tr from-blue-600 to-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 text-white">
                <span class="text-xl">{{ card.icon }}</span>
              </div>
              <span class="font-mono text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full">
                Phase 0{{ i + 1 }}
              </span>
            </div>
            <p class="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-2">{{ card.label }}</p>
            <h3 class="text-xl font-bold text-gray-900 mb-4 leading-snug">{{ card.heading }}</h3>
            <span class="inline-block bg-blue-50 text-blue-600 text-xs font-extrabold px-3 py-1.5 rounded-full border border-blue-100">
              {{ card.tag }}
            </span>
          </div>
        </div>

        <!-- Desktop: 3D Spatial Fanned Cards -->
        <div class="hidden md:flex justify-center items-center h-[460px] relative desktop-how-container perspective-1000">
          <div
            v-for="(card, i) in howCards"
            :key="card.label"
            class="desktop-how-card absolute bg-white rounded-3xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.4)] flex flex-col justify-between border border-slate-100 select-none transition-shadow duration-300 hover:shadow-[0_35px_80px_rgba(37,99,235,0.25)]"
            :style="{ width: '310px', height: '360px', zIndex: i === 1 ? 25 : 15 }"
          >
            <div>
              <div class="flex items-center justify-between mb-6">
                <div class="bg-gradient-to-tr from-blue-600 to-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 text-white">
                  <span class="text-2xl">{{ card.icon }}</span>
                </div>
                <span class="font-mono text-xs font-extrabold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                  Phase 0{{ i + 1 }}
                </span>
              </div>
              <p class="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-2.5">{{ card.label }}</p>
              <h3 class="text-xl font-extrabold text-gray-900 leading-snug">{{ card.heading }}</h3>
            </div>

            <div class="pt-6 border-t border-gray-100 flex items-center justify-between">
              <span class="inline-block bg-blue-50 text-blue-600 text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-blue-100">
                {{ card.tag }}
              </span>
              <span class="text-gray-300">
                <i class="fa-solid fa-arrow-right-long text-sm"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- PAST SPRINTS -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="pastScope" class="bg-[#F8FAFC] py-20 sm:py-28 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="mb-12">
          <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-slate-500 uppercase tracking-widest px-3 py-1 rounded-full bg-slate-200/60 border border-slate-300 mb-3">
            <i class="fa-solid fa-box-archive text-xs"></i>
            Graduated Tracks
          </div>
          <h2 class="past-heading h-sub text-gray-900 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Completed <span class="text-blue-600">Sprints</span>
          </h2>
          <p class="past-sub text-gray-500 text-base sm:text-lg mt-2 font-medium">
            Tracks that have shipped, demoed, and graduated into public open-source repos.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-7">
          <SprintCard
            v-for="sprint in pastSprints"
            :key="sprint.title"
            v-bind="sprint"
            class="past-card-el"
          />
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- CTA -->
    <!-- ═══════════════════════════════════════ -->
    <section class="relative w-full bg-gradient-to-b from-[#F8FAFC] via-[#dceeff] to-[#b8d4f0] py-20 overflow-hidden">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div class="cta-card relative bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_25px_70px_rgba(37,99,235,0.12)] border border-white/80 px-6 sm:px-12 py-14 sm:py-20 text-center overflow-hidden">
          <div class="absolute right-0 bottom-0 pointer-events-none select-none" aria-hidden="true">
            <img ref="ctaRobot" src="/sidelogo.png" alt="" class="w-36 sm:w-56 md:w-72 h-auto object-contain opacity-95 filter drop-shadow-xl" style="transform: rotate(-15deg) translate(25%, 20%);" />
          </div>
          <div class="relative z-10 max-w-xl mx-auto">
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug mb-4">
              Ready to
              <span class="text-blue-600 relative inline-block ml-1">Sprint?
                <span class="absolute left-0 -bottom-1 w-full h-[3px] bg-blue-500 rotate-[-2deg] rounded-full"></span>
              </span>
            </h2>
            <p class="text-gray-500 mt-3 text-base sm:text-lg max-w-sm mx-auto leading-relaxed mb-8 font-medium">
              Pick a track, join a team, and start shipping production code.
            </p>
            <div class="flex flex-wrap gap-4 justify-center items-center">
              <router-link v-magnetic to="/contact-us">
                <button class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold px-9 py-3.5 rounded-full text-base transition-all duration-200 shadow-lg shadow-blue-500/25 cursor-pointer">
                  Join the Sprint
                </button>
              </router-link>
              <router-link v-magnetic to="/initiatives">
                <button class="bg-white border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-700 font-semibold px-9 py-3.5 rounded-full text-base transition-all duration-200 cursor-pointer shadow-sm">
                  View Initiatives
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Track Matchmaker Modal -->
    <TrackQuizModal :is-open="showQuiz" @close="showQuiz = false" />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGSAP } from '../composables/useGSAP'
import { SplitText } from '../motion/gsap'
import SprintCard from '../components/SprintCard.vue'
import TrackQuizModal from '../components/TrackQuizModal.vue'
import { hasFinePointer } from '../motion/intro'

const showQuiz = ref(false)

const pageScope = ref(null)
const heroScope = ref(null)
const activeScope = ref(null)
const howSection = ref(null)
const pastScope = ref(null)
const marqueeScope = ref(null)
const ctaRobot = ref(null)

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
  { icon: '📝', label: 'Step 1 — Apply', heading: 'Pick a track and submit your interest through our open channels.', tag: 'Zero barriers' },
  { icon: '👥', label: 'Step 2 — Build', heading: 'Get matched with a team, a mentor, and a sprint timeline.', tag: 'Real collaboration' },
  { icon: '🚀', label: 'Step 3 — Ship', heading: 'Deploy production code. Present at demos. Add it to your portfolio.', tag: 'Actual output' },
]

useGSAP(({ gsap, ScrollTrigger, selector }) => {
  // Hero SplitText
  const headingSplit = SplitText.create(selector('.hero-heading'), { type: 'words,chars', wordsClass: 'hw' })
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

  // Kinetic marquee loop
  const marqueeTrack = selector('.sprints-marquee-track')[0]
  if (marqueeTrack) {
    gsap.to(marqueeTrack, {
      xPercent: -50,
      duration: 24,
      ease: 'none',
      repeat: -1,
    })
  }

  // Active sprints entrance
  const sprintCards = selector('.sprint-card-el')
  if (sprintCards.length > 0) {
    gsap.from(sprintCards, {
      scrollTrigger: {
        trigger: activeScope.value,
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

  // 3D Fanned Cards Scrub for How Sprints Work
  const desktopHowCards = selector('.desktop-how-card')
  if (desktopHowCards.length === 3) {
    const cardTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.desktop-how-container',
        start: 'top 82%',
        end: 'bottom 40%',
        scrub: 1.2,
      },
    })

    gsap.set(desktopHowCards, {
      xPercent: -50,
      left: '50%',
      y: 80,
      scale: 0.85,
      opacity: 0,
    })

    cardTl
      .to(desktopHowCards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
      })
      .to(desktopHowCards[0], {
        x: -360,
        rotationZ: -7,
        rotationY: 10,
        duration: 1.2,
        ease: 'power3.out',
      }, '-=0.4')
      .to(desktopHowCards[1], {
        x: 0,
        y: -25,
        scale: 1.05,
        rotationZ: 0,
        duration: 1.2,
        ease: 'power3.out',
      }, '-=1.2')
      .to(desktopHowCards[2], {
        x: 360,
        rotationZ: 7,
        rotationY: -10,
        duration: 1.2,
        ease: 'power3.out',
      }, '-=1.2')
  }

  // Past Cards entrance
  const pastCards = selector('.past-card-el')
  if (pastCards.length > 0) {
    gsap.from(pastCards, {
      scrollTrigger: {
        trigger: pastScope.value,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      y: 50,
      opacity: 0,
      stagger: 0.12,
      duration: 0.85,
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
.hero-heading :deep(.hw) {
  display: inline-block;
  overflow: clip;
}

.perspective-1000 {
  perspective: 1200px;
}
</style>
