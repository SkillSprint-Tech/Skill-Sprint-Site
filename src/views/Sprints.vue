<template>
  <div ref="sprintsScope" class="bg-[#F8FAFC] overflow-hidden font-sans">

    <!-- ─── HERO (light) ─── -->
    <section class="relative bg-[#F8FAFC] pt-20 pb-20 px-4 text-center overflow-hidden">
      <!-- Background glow orbs -->
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute top-[-50px] left-[20%] w-[450px] h-[350px] bg-blue-400/8 blur-[110px] rounded-full"></div>
        <div class="absolute top-[10%] right-[15%] w-[350px] h-[280px] bg-indigo-400/6 blur-[100px] rounded-full"></div>
        <div class="absolute bottom-0 left-[50%] w-[600px] h-[250px] bg-blue-300/5 blur-[90px] rounded-full -translate-x-1/2"></div>
      </div>

      <!-- Floating annotation tags -->
      <div class="hidden sm:block pointer-events-none select-none" aria-hidden="true">
        <div class="absolute left-[12%] top-[18%] -rotate-6 bg-white shadow-lg px-4 py-2.5 rounded-2xl border border-gray-150 text-[11px] font-bold tracking-widest text-blue-600 uppercase ann-tag" style="font-family:'Handlee',cursive;">
          ⚡ build fast, learn faster
        </div>
        <div class="absolute right-[10%] top-[12%] rotate-6 bg-white shadow-lg px-4 py-2.5 rounded-2xl border border-gray-150 text-[11px] font-bold tracking-widest text-blue-600 uppercase ann-tag" style="font-family:'Handlee',cursive;">
          🚀 ship before the deadline
        </div>
        <div class="absolute left-[7%] top-[40%] rotate-12 bg-white shadow-lg px-4 py-2.5 rounded-2xl border border-gray-150 text-[11px] font-bold tracking-widest text-blue-600 uppercase ann-tag" style="font-family:'Handlee',cursive;">
          💼 portfolio = proof
        </div>
        <div class="absolute right-[8%] top-[42%] -rotate-9 bg-white shadow-lg px-4 py-2.5 rounded-2xl border border-gray-150 text-[11px] font-bold tracking-widest text-blue-600 uppercase ann-tag" style="font-family:'Handlee',cursive;">
          🤯 intense in a good way
        </div>
      </div>

      <div class="relative z-10 max-w-4xl mx-auto">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-250 text-emerald-700 text-xs font-black px-5 py-2.5 rounded-full mb-8 uppercase tracking-widest sprint-badge">
          <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          Sprint Alpha Currently Active
        </div>

        <h1 class="text-[2.6rem] sm:text-6xl md:text-7xl font-extrabold text-gray-900 leading-[1.05] tracking-tight mb-6 sprint-title">
          Active Project<br />
          <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Sprints</span>
        </h1>
        <p class="max-w-sm sm:max-w-2xl mx-auto text-gray-500 text-sm sm:text-base md:text-lg mb-12 leading-relaxed sprint-sub font-medium">
          Collaborate on high-impact projects, earn verified portfolio badges, and build real skills inside focused, structured sprint cycles.
        </p>

        <!-- CTA area -->
        <div class="relative inline-flex flex-col sm:flex-row items-center justify-center gap-4 sprint-ctas">
          <router-link to="/contact-us">
            <button class="px-9 py-4 rounded-full bg-blue-600 text-white text-sm sm:text-base font-black hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-2xl shadow-blue-500/20 cursor-pointer">
              Register Interest
            </button>
          </router-link>
          <router-link to="/community">
            <button class="px-9 py-4 rounded-full bg-white border border-gray-200 text-gray-700 text-sm sm:text-base font-black hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
              Our Community →
            </button>
          </router-link>

          <!-- Handdrawn Arrow overlay pointing to register -->
          <img src="/arrow.png" class="hidden lg:block absolute left-[-22%] top-[60%] w-16 opacity-75 -rotate-12 pointer-events-none" alt="" />
        </div>
      </div>
    </section>

    <!-- ─── HOW A SPRINT WORKS ─── -->
    <section class="bg-white py-24 sm:py-32 px-4 border-y border-gray-150/70">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-20 steps-header">
          <p class="text-blue-600 text-xs font-black uppercase tracking-widest mb-3">The Process</p>
          <h2 class="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-none">How a Sprint Works</h2>
          <p class="text-gray-500 text-sm sm:text-base mt-4 max-w-md mx-auto font-medium">Four focused phases. One shipped product. Infinite learning.</p>
        </div>

        <!-- Steps layout -->
        <div class="relative">
          <!-- Connector line -->
          <div class="hidden md:block absolute top-14 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-150 to-transparent mx-24"></div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
            <div v-for="(step, i) in steps" :key="step.title" class="flex flex-col items-center text-center relative step-item group">
              <!-- Step counter badge -->
              <div class="relative z-10 w-28 h-28 rounded-[2rem] flex flex-col items-center justify-center mb-6 shadow-xl transition-all duration-300 group-hover:scale-105"
                   :class="step.highlight ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-500/20' : 'bg-[#F8FAFC] text-gray-900 border border-gray-150/80 shadow-[0_12px_35px_rgba(0,0,0,0.03)]'">
                <span class="text-4xl mb-1">{{ step.icon }}</span>
                <span class="text-[9px] font-black uppercase tracking-widest" :class="step.highlight ? 'text-blue-200' : 'text-gray-400'">Step {{ i + 1 }}</span>
              </div>
              <h3 class="text-base sm:text-lg font-extrabold text-gray-900 mb-2.5 leading-tight group-hover:text-blue-600 transition-colors">{{ step.title }}</h3>
              <p class="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-[200px] font-medium">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── SPRINT CARDS (Dark Premium Dashboard Design) ─── -->
    <section class="bg-[#0B101B] py-24 sm:py-32 px-4 relative overflow-hidden">
      <!-- Background glow orb -->
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[550px] bg-blue-600/5 blur-[170px] rounded-full"></div>
      </div>

      <div class="max-w-6xl mx-auto relative z-10">
        <div class="text-center mb-20 sprints-header">
          <p class="text-blue-400 text-xs font-black uppercase tracking-widest mb-3">Sprint Cycles</p>
          <h2 class="text-white text-3xl sm:text-5xl font-black tracking-tight leading-none mb-4">
            Current Sprint Cycles
          </h2>
          <p class="text-gray-400 text-sm sm:text-base font-medium max-w-sm mx-auto">
            Pick a sprint, join a team, ship something real.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div
            v-for="sprint in sprints"
            :key="sprint.title"
            class="bg-[#131926] rounded-[2.5rem] overflow-hidden shadow-2xl hover:scale-[1.01] transition-transform duration-300 sprint-card flex flex-col border border-white/5 shadow-black/40"
          >
            <!-- Top bar indicator -->
            <div class="h-2.5 w-full" :class="sprint.status === 'Active' ? 'bg-gradient-to-r from-emerald-400 to-blue-500' : 'bg-gradient-to-r from-blue-400 to-indigo-500'"></div>

            <div class="p-8 sm:p-10 flex flex-col flex-1">
              <div>
                <div class="flex items-center justify-between mb-8">
                  <span
                    class="px-4 py-2 text-[9px] font-black rounded-full border flex items-center gap-2 uppercase tracking-widest"
                    :class="sprint.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      : 'bg-blue-500/10 text-blue-300 border-blue-500/20'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full animate-pulse" :class="sprint.status === 'Active' ? 'bg-emerald-400' : 'bg-blue-400'"></span>
                    {{ sprint.status }}
                  </span>
                  <span class="text-gray-400 text-xs font-bold">Ends {{ sprint.endDate }}</span>
                </div>

                <h3 class="text-xl sm:text-3.5xl font-black text-white mb-4 leading-snug">{{ sprint.title }}</h3>
                <p class="text-gray-400 text-sm sm:text-base leading-relaxed mb-6 font-medium">{{ sprint.desc }}</p>

                <!-- Tech chips -->
                <div class="flex flex-wrap gap-2 mb-8">
                  <span v-for="tech in sprint.techChips" :key="tech" class="text-xs font-black px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-gray-300">
                    {{ tech }}
                  </span>
                </div>

                <!-- Bullets with custom svg checkmarks -->
                <div class="space-y-4 mb-10">
                  <div v-for="bullet in sprint.bullets" :key="bullet" class="flex items-center gap-3">
                    <span class="w-6 h-6 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-extrabold shrink-0 text-sm">✓</span>
                    <span class="text-gray-300 text-sm sm:text-base font-semibold leading-none">{{ bullet }}</span>
                  </div>
                </div>
              </div>

              <!-- Progress panel -->
              <div class="mb-8 mt-auto">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-[9px] font-black text-gray-500 uppercase tracking-widest">Sprint Progress</span>
                  <span class="text-xs font-black text-blue-400">{{ sprint.progress }}%</span>
                </div>
                <div class="h-3 bg-white/[0.03] rounded-full overflow-hidden border border-white/5">
                  <div class="h-full rounded-full transition-all duration-1000 bg-gradient-to-r" :class="sprint.status === 'Active' ? 'from-blue-500 to-emerald-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'from-blue-400 to-indigo-400'" :style="`width: ${sprint.progress}%`"></div>
                </div>
              </div>

              <router-link to="/contact-us">
                <button class="w-full py-4.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-full transition shadow-xl shadow-blue-500/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-sm sm:text-base">
                  Register for Sprint →
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── SPRINT PERKS BENTO ─── -->
    <section class="bg-[#0B101B] pb-24 sm:pb-32 px-4 relative">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16 perks-header">
          <p class="text-blue-400 text-xs font-black uppercase tracking-widest mb-3">What You Get</p>
          <h2 class="text-white text-3xl sm:text-5xl font-black tracking-tight leading-none">Sprint Perks</h2>
        </div>
        
        <!-- Bento Cards Layout with space age neon highlights -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 perks-grid">
          <div
            v-for="perk in perks"
            :key="perk.title"
            class="bg-white/[0.02] border border-white/[0.07] backdrop-blur-md rounded-[2rem] p-8 hover:bg-white/[0.05] hover:border-blue-500/40 transition-all duration-300 group perk-card shadow-[0_12px_45px_0_rgba(0,0,0,0.3)] flex flex-col justify-between"
          >
            <div>
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                {{ perk.icon }}
              </div>
              <h3 class="text-white font-extrabold text-lg mb-3 leading-tight">{{ perk.title }}</h3>
              <p class="text-gray-400 text-xs sm:text-sm leading-relaxed font-medium">{{ perk.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── TESTIMONIALS (light) ─── -->
    <section class="bg-[#F8FAFC] py-24 sm:py-32 px-4 border-t border-gray-150/70">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-20 quotes-header">
          <p class="text-blue-600 text-xs font-black uppercase tracking-widest mb-3">Sprint Alumni</p>
          <h2 class="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-none">Straight From the Team</h2>
        </div>
        
        <!-- Physical Board fanned layouts -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 quotes-grid">
          <div
            v-for="(quote, i) in displayQuotes"
            :key="i"
            class="bg-white rounded-[2rem] p-8 border border-gray-150 shadow-[0_15px_45px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:z-20 transition-all duration-300 quote-card flex flex-col cursor-default"
            :class="[
              i === 0 ? 'md:-rotate-3 md:-translate-y-2' : '',
              i === 1 ? 'md:rotate-1 md:translate-y-1' : '',
              i === 2 ? 'md:rotate-3 md:translate-y-2' : ''
            ]"
          >
            <!-- Stars -->
            <div class="flex gap-1 mb-5">
              <span v-for="s in 5" :key="s" :class="quote.name ? 'text-yellow-400' : 'text-gray-200'" class="text-sm">★</span>
            </div>
            <!-- Testimonial content -->
            <p :class="quote.bio ? 'text-gray-700 italic' : 'text-gray-300'" class="text-sm sm:text-base leading-relaxed mb-8 flex-1 font-medium">
              {{ quote.bio ? `"${quote.bio}"` : 'This spot is waiting for a team member to join...' }}
            </p>
            <!-- Footer alignment -->
            <div class="flex items-center gap-3.5 pt-5 border-t border-gray-100">
              <div class="w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-gray-100 bg-gray-50 flex items-center justify-center">
                <img v-if="quote.image" :src="quote.image" :alt="quote.name" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                </div>
              </div>
              <div>
                <p v-if="quote.name" class="text-gray-900 font-extrabold text-sm sm:text-base leading-none mb-1">{{ quote.name }}</p>
                <p v-else class="text-gray-300 font-bold text-sm leading-none mb-1">—</p>
                <p class="text-gray-400 text-xs font-bold">{{ quote.role || 'Team Member' }}</p>
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
