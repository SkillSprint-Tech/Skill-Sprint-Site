<template>
  <div ref="sprintsScope" class="bg-[#F8FAFC] overflow-hidden font-sans">

    <!-- ─── HERO ─── -->
    <section class="relative bg-[#F8FAFC] pt-14 pb-16 px-4 text-center overflow-hidden">
      <!-- Floating annotation tags -->
      <div class="hidden sm:block pointer-events-none select-none" aria-hidden="true">
        <div class="absolute left-[12%] top-[18%] -rotate-6 bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200 text-[11px] font-medium tracking-wide text-gray-600 ann-tag" style="font-family:'Handlee',cursive;">
          ⚡ build fast, learn faster
        </div>
        <div class="absolute right-[10%] top-[12%] rotate-6 bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200 text-[11px] font-medium tracking-wide text-gray-600 ann-tag" style="font-family:'Handlee',cursive;">
          🚀 ship before the deadline
        </div>
        <div class="absolute left-[7%] top-[40%] rotate-12 bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200 text-[11px] font-medium tracking-wide text-gray-600 ann-tag" style="font-family:'Handlee',cursive;">
          💼 portfolio = proof
        </div>
        <div class="absolute right-[8%] top-[42%] -rotate-9 bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200 text-[11px] font-medium tracking-wide text-gray-600 ann-tag" style="font-family:'Handlee',cursive;">
          🤯 sprints are intense (in a good way)
        </div>
      </div>

      <div class="relative z-10 max-w-4xl mx-auto">
        <h1 class="text-[2.4rem] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-5 sprint-title">
          Active Project<br />
          <span class="text-blue-600">Sprints</span>
        </h1>
        <p class="max-w-xs sm:max-w-xl mx-auto text-gray-500 text-sm sm:text-base md:text-lg mb-10 leading-relaxed sprint-sub">
          Collaborate on high-impact projects, gain verified badges, and build out your portfolio inside focused, structured cycles.
        </p>
        <div class="flex flex-row items-center justify-center gap-3 sprint-ctas">
          <router-link to="/contact-us">
            <button class="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-blue-600 text-white text-sm sm:text-base font-semibold hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-blue-200 cursor-pointer">
              Register Interest
            </button>
          </router-link>
          <router-link to="/community">
            <button class="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-white border border-gray-300 text-gray-700 text-sm sm:text-base font-semibold hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
              Our Community
            </button>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ─── SPRINT CARDS (dark section matching Whysection) ─── -->
    <section class="bg-[#0B101B] py-16 sm:py-24 px-4">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-14 sprints-header">
          <h2 class="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            Current Sprint Cycles
          </h2>
          <p class="text-gray-400 text-base sm:text-lg font-medium">
            Pick a sprint, join a team, ship something real.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="sprint in sprints"
            :key="sprint.title"
            class="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 sprint-card"
          >
            <div>
              <div class="flex items-center justify-between mb-6">
                <span
                  class="px-3.5 py-1.5 text-xs font-black rounded-full border flex items-center gap-2"
                  :class="sprint.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : 'bg-blue-50 text-blue-600 border-blue-100'"
                >
                  <span class="w-1.5 h-1.5 rounded-full animate-pulse" :class="sprint.status === 'Active' ? 'bg-emerald-500' : 'bg-blue-500'"></span>
                  {{ sprint.status }}
                </span>
                <span class="text-gray-400 text-xs font-semibold">Ends {{ sprint.endDate }}</span>
              </div>

              <h3 class="text-xl sm:text-2xl font-extrabold text-gray-900 mb-3 leading-snug">{{ sprint.title }}</h3>
              <p class="text-gray-500 text-sm leading-relaxed mb-6">{{ sprint.desc }}</p>

              <div class="space-y-2.5 mb-7">
                <div v-for="bullet in sprint.bullets" :key="bullet" class="flex items-center gap-2.5">
                  <span class="text-blue-600 font-black text-sm">✓</span>
                  <span class="text-gray-700 text-sm font-semibold">{{ bullet }}</span>
                </div>
              </div>
            </div>

            <router-link to="/contact-us">
              <button class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition shadow-md shadow-blue-200 cursor-pointer text-sm">
                Register for Sprint
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGSAP } from '../composables/useGSAP'

const sprintsScope = ref(null)

const sprints = [
  {
    title: 'Sprint Alpha: Full-Stack Web Apps',
    status: 'Active',
    endDate: 'July 30, 2026',
    desc: 'Assemble web developers, UI designers, and copywriters to engineer beautiful web portals. The focus is responsive frontend architectures connected to simple serverless backends.',
    bullets: ['Node/Express & Vue 3', 'GSAP animations', 'Firebase/Supabase Integration']
  },
  {
    title: 'Sprint Beta: Mobile Experience Design',
    status: 'Starts August 05',
    endDate: 'August 25, 2026',
    desc: 'A sprint focused heavily on designing, prototyping, and engineering fluid mobile interactions using Vue/Ionic or React Native.',
    bullets: ['Cross-platform deployments', 'Figma layout handoff', 'Gesture & touch animations']
  }
]

useGSAP((self) => {
  const { gsap } = self

  // Hero entrance
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  tl.from('.sprint-title', { y: 80, opacity: 0, duration: 1.4, skewY: 2 })
    .from('.sprint-sub',   { y: 30, opacity: 0, duration: 1.1 }, '-=1.0')
    .from('.sprint-ctas a', { scale: 0.85, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'back.out(1.8)' }, '-=0.8')

  // Floating annotation tags
  const tags = gsap.utils.toArray('.ann-tag')
  tags.forEach((tag, i) => {
    gsap.from(tag, { scale: 0, opacity: 0, duration: 1, delay: 0.7 + i * 0.12, ease: 'back.out(2)' })
    gsap.to(tag, { y: '+=10', x: i % 2 === 0 ? '+=4' : '-=4', rotation: i % 2 === 0 ? '+=2' : '-=2', duration: 2.2 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.2 })
  })

  // Dark section header
  gsap.from('.sprints-header', {
    scrollTrigger: { trigger: '.sprints-header', start: 'top 80%', toggleActions: 'play none none reverse' },
    y: 50, opacity: 0, duration: 1, ease: 'power3.out'
  })

  // Sprint cards fanning in
  gsap.from('.sprint-card', {
    scrollTrigger: { trigger: '.sprint-card', start: 'top 80%', toggleActions: 'play none none reverse' },
    y: 80, opacity: 0, duration: 1.2, stagger: 0.2, ease: 'back.out(1.4)'
  })
}, sprintsScope)
</script>
