<template>
  <div ref="communityScope" class="bg-[#F8FAFC] overflow-hidden font-sans">

    <!-- ─── HERO (dark panel matching Whysection palette) ─── -->
    <section class="bg-[#0B101B] py-16 sm:py-24 px-4 overflow-hidden relative">
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full"></div>
      </div>

      <div class="max-w-4xl mx-auto relative z-10 text-center">
        <h1 class="text-[2.4rem] sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-5 comm-title">
          We Sprint<br />
          <span class="text-blue-400">Together.</span>
        </h1>
        <p class="max-w-sm sm:max-w-xl mx-auto text-gray-400 text-sm sm:text-base md:text-lg mb-10 leading-relaxed comm-sub">
          Join a vibrant ecosystem of student developers, designers, and creators who collaborate to build projects, hold workshops, and grow together.
        </p>
        <div class="flex flex-row items-center justify-center gap-3 comm-ctas">
          <a href="https://discord.gg/invite" target="_blank">
            <button class="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-blue-600 text-white text-sm sm:text-base font-semibold hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-2">
              💬 Join Discord Server
            </button>
          </a>
          <router-link to="/sprints">
            <button class="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-white/10 border border-white/20 text-white text-sm sm:text-base font-semibold hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
              Browse Sprints
            </button>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ─── EVENTS + PILLARS GRID ─── -->
    <section class="bg-[#F8FAFC] py-16 sm:py-24 px-4">
      <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Events (2 cols) -->
        <div class="lg:col-span-2 events-col">
          <div class="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] h-full">
            <h2 class="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              <span class="text-blue-600">📅</span> Upcoming Community Events
            </h2>

            <div class="space-y-5">
              <div
                v-for="event in events"
                :key="event.title"
                class="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50/40 border border-gray-100 hover:border-blue-100 transition duration-300 event-card"
              >
                <div class="bg-blue-600 text-white font-black w-full sm:w-20 h-16 rounded-xl flex flex-col items-center justify-center shrink-0 shadow-md shadow-blue-200">
                  <span class="text-base font-black leading-none">{{ event.date.split(' ')[0] }}</span>
                  <span class="text-[10px] uppercase tracking-widest">{{ event.date.split(' ')[1] }}</span>
                </div>
                <div>
                  <h3 class="text-base font-bold text-gray-900 mb-1">{{ event.title }}</h3>
                  <p class="text-gray-500 text-sm mb-2 leading-relaxed">{{ event.desc }}</p>
                  <span class="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
                    {{ event.time }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pillars (1 col) -->
        <div class="pillars-col">
          <div class="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] h-full">
            <h2 class="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              <span class="text-blue-600">🚀</span> Core Pillars
            </h2>

            <div class="space-y-5">
              <div
                v-for="(pillar, idx) in pillars"
                :key="pillar.title"
                class="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition duration-300 pillar-card"
              >
                <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 text-xs font-black shadow-md shadow-blue-200">
                  {{ idx + 1 }}
                </div>
                <div>
                  <h4 class="font-bold text-gray-900 mb-1 text-sm">{{ pillar.title }}</h4>
                  <p class="text-gray-500 text-xs leading-relaxed">{{ pillar.desc }}</p>
                </div>
              </div>
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

const communityScope = ref(null)

const events = [
  {
    date: '18 July',
    title: 'Intro to Vue 3 & GSAP Animations',
    desc: 'Learn how to construct reactive web applications and create complex GSAP scroll animations cleanly.',
    time: '6:00 PM – 7:30 PM (Online)'
  },
  {
    date: '25 July',
    title: 'Skill Sprint Project Kickoff',
    desc: 'Pitch your project ideas, form cross-functional groups, and align on goals for the next sprint.',
    time: '4:00 PM – 6:00 PM (Seminar Room 3)'
  },
  {
    date: '02 Aug',
    title: 'Portfolio Review & Mentorship Hour',
    desc: 'Share your latest project dashboards and code repos with senior developers for advice and feedback.',
    time: '5:30 PM – 7:00 PM (Discord Voice)'
  }
]

const pillars = [
  { title: 'Peer-to-Peer Help',       desc: 'We are all learning. No request is too simple. Ask questions and help others when they are stuck.' },
  { title: 'Speed & Execution',        desc: 'Progress beats perfection. Focus on building MVP products, ship quickly, and iterate based on use.' },
  { title: 'Cross-Disciplinary Magic', desc: 'Teams succeed when designers, managers, and engineers mix. Respect all skills and learn from one another.' }
]

useGSAP((self) => {
  const { gsap } = self

  // Hero entrance
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  tl.from('.comm-title', { y: 80, opacity: 0, duration: 1.4, skewY: 2 })
    .from('.comm-sub',   { y: 30, opacity: 0, duration: 1.1 }, '-=1.0')
    .from('.comm-ctas a', { scale: 0.85, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'back.out(1.8)' }, '-=0.8')

  // Events column scroll reveal
  gsap.from('.events-col', {
    scrollTrigger: { trigger: '.events-col', start: 'top 80%', toggleActions: 'play none none reverse' },
    x: -60, opacity: 0, duration: 1.2, ease: 'power3.out'
  })

  // Individual event cards stagger
  gsap.from('.event-card', {
    scrollTrigger: { trigger: '.events-col', start: 'top 75%', toggleActions: 'play none none reverse' },
    y: 40, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out', delay: 0.2
  })

  // Pillars column scroll reveal
  gsap.from('.pillars-col', {
    scrollTrigger: { trigger: '.pillars-col', start: 'top 80%', toggleActions: 'play none none reverse' },
    x: 60, opacity: 0, duration: 1.2, ease: 'power3.out'
  })

  // Pillar cards stagger
  gsap.from('.pillar-card', {
    scrollTrigger: { trigger: '.pillars-col', start: 'top 75%', toggleActions: 'play none none reverse' },
    y: 40, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out', delay: 0.2
  })
}, communityScope)
</script>
