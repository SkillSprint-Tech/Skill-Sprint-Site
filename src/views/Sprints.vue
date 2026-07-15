<template>
  <div ref="sprintsScope" class="bg-[#F8FAFC] overflow-hidden font-sans">

    <!-- ─── HERO (light) ─── -->
    <section class="relative bg-[#F8FAFC] pt-14 pb-16 px-4 text-center overflow-hidden">
      <!-- Background glow orbs -->
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute top-[-50px] left-[20%] w-[400px] h-[300px] bg-blue-400/8 blur-[100px] rounded-full"></div>
        <div class="absolute top-[10%] right-[15%] w-[300px] h-[250px] bg-indigo-400/6 blur-[90px] rounded-full"></div>
        <div class="absolute bottom-0 left-[50%] w-[500px] h-[200px] bg-blue-300/5 blur-[80px] rounded-full -translate-x-1/2"></div>
      </div>

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
          🤯 intense in a good way
        </div>
      </div>

      <div class="relative z-10 max-w-4xl mx-auto">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black px-4 py-2 rounded-full mb-8 uppercase tracking-widest sprint-badge">
          <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          Sprint Alpha Currently Active
        </div>

        <h1 class="text-[2.4rem] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-5 sprint-title">
          Active Project<br />
          <span class="text-blue-600">Sprints</span>
        </h1>
        <p class="max-w-xs sm:max-w-xl mx-auto text-gray-500 text-sm sm:text-base md:text-lg mb-10 leading-relaxed sprint-sub">
          Collaborate on high-impact projects, earn verified portfolio badges, and build real skills inside focused, structured sprint cycles.
        </p>
        <div class="flex flex-row items-center justify-center gap-3 sprint-ctas">
          <router-link to="/contact-us">
            <button class="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-blue-600 text-white text-sm sm:text-base font-semibold hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-blue-200 cursor-pointer">
              Register Interest
            </button>
          </router-link>
          <router-link to="/community">
            <button class="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-white border border-gray-300 text-gray-700 text-sm sm:text-base font-semibold hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
              Our Community →
            </button>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ─── HOW A SPRINT WORKS (light) ─── -->
    <section class="bg-white py-20 sm:py-28 px-4 border-y border-gray-100">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-14 steps-header">
          <p class="text-blue-600 text-xs font-black uppercase tracking-widest mb-3">The Process</p>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">How a Sprint Works</h2>
          <p class="text-gray-500 text-base mt-3 max-w-md mx-auto">Four focused phases. One shipped product. Infinite learning.</p>
        </div>

        <!-- Steps: horizontal on desktop, vertical on mobile -->
        <div class="relative">
          <!-- Connector line (desktop only) -->
          <div class="hidden md:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent mx-24"></div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
            <div v-for="(step, i) in steps" :key="step.title" class="flex flex-col items-center text-center relative step-item">
              <!-- Step number circle -->
              <div class="relative z-10 w-24 h-24 rounded-2xl flex flex-col items-center justify-center mb-5 shadow-lg transition-transform duration-300 hover:scale-110"
                   :class="step.highlight ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-white text-gray-900 border-2 border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)]'">
                <span class="text-3xl mb-0.5">{{ step.icon }}</span>
                <span class="text-[10px] font-black uppercase tracking-widest" :class="step.highlight ? 'text-blue-200' : 'text-gray-400'">Step {{ i + 1 }}</span>
              </div>
              <h3 class="text-base font-extrabold text-gray-900 mb-2">{{ step.title }}</h3>
              <p class="text-gray-500 text-sm leading-relaxed max-w-[180px]">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── SPRINT CARDS (dark) ─── -->
    <section class="bg-[#0B101B] py-20 sm:py-28 px-4 relative overflow-hidden">
      <!-- Background orb -->
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-blue-600/6 blur-[150px] rounded-full"></div>
      </div>

      <div class="max-w-5xl mx-auto relative z-10">
        <div class="text-center mb-14 sprints-header">
          <p class="text-blue-400 text-xs font-black uppercase tracking-widest mb-3">Sprint Cycles</p>
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
            class="bg-white rounded-2xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-300 sprint-card flex flex-col"
          >
            <!-- Top gradient bar -->
            <div class="h-1.5 w-full" :class="sprint.status === 'Active' ? 'bg-gradient-to-r from-emerald-400 to-blue-500' : 'bg-gradient-to-r from-blue-400 to-indigo-500'"></div>

            <div class="p-6 sm:p-8 flex flex-col flex-1">
              <div>
                <div class="flex items-center justify-between mb-5">
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
                <p class="text-gray-500 text-sm leading-relaxed mb-5">{{ sprint.desc }}</p>

                <!-- Tech chips -->
                <div class="flex flex-wrap gap-2 mb-5">
                  <span v-for="tech in sprint.techChips" :key="tech" class="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-gray-600">
                    {{ tech }}
                  </span>
                </div>

                <div class="space-y-2 mb-7">
                  <div v-for="bullet in sprint.bullets" :key="bullet" class="flex items-center gap-2.5">
                    <span class="text-blue-600 font-black text-sm">✓</span>
                    <span class="text-gray-700 text-sm font-semibold">{{ bullet }}</span>
                  </div>
                </div>
              </div>

              <!-- Progress bar -->
              <div class="mb-6">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-black text-gray-400 uppercase tracking-widest">Sprint Progress</span>
                  <span class="text-xs font-bold text-blue-600">{{ sprint.progress }}%</span>
                </div>
                <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-1000" :class="sprint.status === 'Active' ? 'bg-gradient-to-r from-blue-500 to-emerald-400' : 'bg-gradient-to-r from-blue-400 to-indigo-400'" :style="`width: ${sprint.progress}%`"></div>
                </div>
              </div>

              <router-link to="/contact-us">
                <button class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition shadow-md shadow-blue-200 cursor-pointer text-sm">
                  Register for Sprint →
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── SPRINT PERKS BENTO (dark continues) ─── -->
    <section class="bg-[#0B101B] pb-20 sm:pb-28 px-4">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-12 perks-header">
          <p class="text-blue-400 text-xs font-black uppercase tracking-widest mb-3">What You Get</p>
          <h2 class="text-white text-3xl sm:text-4xl font-extrabold tracking-tight">Sprint Perks</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 perks-grid">
          <div
            v-for="perk in perks"
            :key="perk.title"
            class="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-blue-500/30 transition-all duration-300 group perk-card"
          >
            <div class="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-xl mb-5 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
              {{ perk.icon }}
            </div>
            <h3 class="text-white font-bold text-base mb-2">{{ perk.title }}</h3>
            <p class="text-gray-400 text-sm leading-relaxed">{{ perk.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── TESTIMONIALS (light) ─── -->
    <section class="bg-[#F8FAFC] py-20 sm:py-28 px-4">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-12 quotes-header">
          <p class="text-blue-600 text-xs font-black uppercase tracking-widest mb-3">Sprint Alumni</p>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Straight From the Team</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 quotes-grid">
          <div
            v-for="(quote, i) in displayQuotes"
            :key="i"
            class="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.08)] hover:border-blue-100 transition-all duration-300 quote-card flex flex-col"
          >
            <!-- Stars: yellow for real members, grey for empty slots -->
            <div class="flex gap-1 mb-4">
              <span v-for="s in 5" :key="s" :class="quote.name ? 'text-yellow-400' : 'text-gray-200'" class="text-sm">★</span>
            </div>
            <!-- Quote text or placeholder -->
            <p :class="quote.bio ? 'text-gray-700 italic' : 'text-gray-300'" class="text-sm leading-relaxed mb-5 flex-1">
              {{ quote.bio ? `"${quote.bio}"` : 'This spot is waiting for a team member to join...' }}
            </p>
            <!-- Footer: real avatar+name+role OR blank circle + position label -->
            <div class="flex items-center gap-3 pt-4 border-t border-gray-100">
              <div class="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gray-200">
                <img v-if="quote.image" :src="quote.image" :alt="quote.name" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                </div>
              </div>
              <div>
                <p v-if="quote.name" class="text-gray-900 font-bold text-sm">{{ quote.name }}</p>
                <p v-else class="text-gray-300 font-bold text-sm">—</p>
                <p class="text-gray-400 text-xs">{{ quote.role || 'Team Member' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGSAP } from '../composables/useGSAP'

const sprintsScope = ref(null)

const steps = [
  { icon: '👥', title: 'Form Your Team', desc: 'Get matched with developers, designers, and PMs across disciplines.', highlight: false },
  { icon: '🎯', title: 'Define Scope', desc: 'Align on MVP goals, tech stack, and weekly milestones in day one.', highlight: true },
  { icon: '⚡', title: 'Build & Ship', desc: 'Sprint through focused execution cycles with daily async check-ins.', highlight: false },
  { icon: '🏆', title: 'Showcase & Badge', desc: 'Present your project, earn a verified portfolio badge, get hired.', highlight: false },
]

const sprints = [
  {
    title: 'Sprint Alpha: Full-Stack Web Apps',
    status: 'Active',
    endDate: 'July 30, 2026',
    desc: 'Assemble web developers, UI designers, and copywriters to engineer beautiful web portals. Responsive frontend architectures connected to serverless backends.',
    techChips: ['Vue 3', 'Node/Express', 'Firebase', 'GSAP'],
    bullets: ['Build production-ready web apps', 'GSAP scroll animations', 'Supabase/Firebase backend'],
    progress: 62
  },
  {
    title: 'Sprint Beta: Mobile Experience Design',
    status: 'Starts August 05',
    endDate: 'August 25, 2026',
    desc: 'A sprint focused on designing, prototyping, and engineering fluid mobile interactions using Vue/Ionic or React Native with a strong UX emphasis.',
    techChips: ['React Native', 'Figma', 'Ionic', 'TypeScript'],
    bullets: ['Cross-platform mobile deployment', 'Figma-to-code handoff', 'Gesture & touch animations'],
    progress: 0
  }
]

const perks = [
  { icon: '🏅', title: 'Portfolio Badge', desc: 'Earn a verified Skill Sprint badge for every shipped project, LinkedIn-ready.' },
  { icon: '🧑‍🏫', title: 'Mentor Access', desc: 'Direct access to senior engineers and product managers throughout the sprint.' },
  { icon: '🤝', title: 'Team Network', desc: 'Build a network of developers and designers who actually ship together.' },
  { icon: '📂', title: 'Real Projects', desc: 'Work on real scoped products — not toy tutorials — that you can show employers.' },
]

const teamMembers = ref([])

onMounted(() => {
  teamMembers.value = JSON.parse(localStorage.getItem('team_members') || '[]')
})

// Show up to 3 real members; pad to 3 with empty placeholder slots
const displayQuotes = computed(() => {
  const real = teamMembers.value.slice(0, 3)
  const empties = Array.from({ length: Math.max(0, 3 - real.length) }, () => ({}))
  return [...real, ...empties]
})

useGSAP((self) => {
  const { gsap } = self

  // Hero entrance
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  tl.from('.sprint-badge', { scale: 0, opacity: 0, duration: 0.8, ease: 'back.out(2)' })
    .from('.sprint-title', { y: 80, opacity: 0, duration: 1.4, skewY: 2 }, '-=0.4')
    .from('.sprint-sub', { y: 30, opacity: 0, duration: 1.1 }, '-=1.0')
    .from('.sprint-ctas a, .sprint-ctas a + a', { scale: 0.85, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'back.out(1.8)' }, '-=0.8')

  // Floating annotation tags
  const tags = gsap.utils.toArray('.ann-tag')
  tags.forEach((tag, i) => {
    gsap.from(tag, { scale: 0, opacity: 0, duration: 1, delay: 0.7 + i * 0.12, ease: 'back.out(2)' })
    gsap.to(tag, { y: '+=10', x: i % 2 === 0 ? '+=4' : '-=4', rotation: i % 2 === 0 ? '+=2' : '-=2', duration: 2.2 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.2 })
  })

  // Steps
  gsap.from('.steps-header', {
    scrollTrigger: { trigger: '.steps-header', start: 'top 95%', once: true },
    immediateRender: false, y: 40, opacity: 0, duration: 1, ease: 'power3.out'
  })
  gsap.from('.step-item', {
    scrollTrigger: { trigger: '.step-item', start: 'top 95%', once: true },
    immediateRender: false, y: 60, opacity: 0, duration: 1, stagger: 0.18, ease: 'back.out(1.4)'
  })

  // Sprint cards header and cards
  gsap.from('.sprints-header', {
    scrollTrigger: { trigger: '.sprints-header', start: 'top 95%', once: true },
    immediateRender: false, y: 50, opacity: 0, duration: 1, ease: 'power3.out'
  })
  gsap.from('.sprint-card', {
    scrollTrigger: { trigger: '.sprint-card', start: 'top 95%', once: true },
    immediateRender: false, y: 80, opacity: 0, duration: 1.2, stagger: 0.2, ease: 'back.out(1.4)'
  })

  // Perks
  gsap.from('.perks-header', {
    scrollTrigger: { trigger: '.perks-header', start: 'top 95%', once: true },
    immediateRender: false, y: 40, opacity: 0, duration: 1, ease: 'power3.out'
  })
  gsap.from('.perk-card', {
    scrollTrigger: { trigger: '.perks-grid', start: 'top 95%', once: true },
    immediateRender: false, y: 50, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'back.out(1.4)'
  })

  // Testimonials
  gsap.from('.quotes-header', {
    scrollTrigger: { trigger: '.quotes-header', start: 'top 95%', once: true },
    immediateRender: false, y: 40, opacity: 0, duration: 1, ease: 'power3.out'
  })
  gsap.from('.quote-card', {
    scrollTrigger: { trigger: '.quotes-grid', start: 'top 95%', once: true },
    immediateRender: false, y: 60, opacity: 0, duration: 1, stagger: 0.15, ease: 'back.out(1.4)'
  })
}, sprintsScope)
</script>
