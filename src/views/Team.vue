<template>
  <div ref="teamScope" class="bg-[#F8FAFC] overflow-hidden font-sans">

    <!-- ─── HERO (light) ─── -->
    <section class="relative bg-[#F8FAFC] pt-14 pb-16 px-4 text-center overflow-hidden">
      <!-- Background decoration: subtle dot grid SVG -->
      <div class="absolute inset-0 pointer-events-none opacity-[0.035]" aria-hidden="true">
        <svg class="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dotgrid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#1e40af" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotgrid)" />
        </svg>
      </div>
      <!-- Glow orbs -->
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute top-[-60px] left-[25%] w-[450px] h-[300px] bg-blue-400/6 blur-[100px] rounded-full"></div>
        <div class="absolute top-[20%] right-[10%] w-[300px] h-[250px] bg-indigo-300/5 blur-[90px] rounded-full"></div>
      </div>

      <!-- Floating annotation tags -->
      <div class="hidden sm:block pointer-events-none select-none" aria-hidden="true">
        <div class="absolute left-[12%] top-[18%] -rotate-6 bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200 text-[11px] font-medium tracking-wide text-gray-600 ann-tag" style="font-family:'Handlee',cursive;">
          🧑‍💻 students leading students
        </div>
        <div class="absolute right-[10%] top-[12%] rotate-6 bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200 text-[11px] font-medium tracking-wide text-gray-600 ann-tag" style="font-family:'Handlee',cursive;">
          🔥 passionate, not perfect
        </div>
        <div class="absolute left-[7%] top-[40%] rotate-12 bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200 text-[11px] font-medium tracking-wide text-gray-600 ann-tag" style="font-family:'Handlee',cursive;">
          🙌 community-built
        </div>
        <div class="absolute right-[8%] top-[42%] -rotate-9 bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200 text-[11px] font-medium tracking-wide text-gray-600 ann-tag" style="font-family:'Handlee',cursive;">
          🌍 diverse skill sets
        </div>
      </div>

      <div class="relative z-10 max-w-4xl mx-auto">
        <h1 class="text-[2.4rem] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-5 team-title">
          Meet the<br />
          <span class="text-blue-600">Core Team</span>
        </h1>
        <p class="max-w-xs sm:max-w-xl mx-auto text-gray-500 text-sm sm:text-base md:text-lg mb-10 leading-relaxed team-sub">
          Students and mentors who build local chapters, manage project sprints, and nurture our learning ecosystem — all driven by passion, not profit.
        </p>
        <div class="flex flex-row items-center justify-center gap-3 team-ctas">
          <router-link to="/team-form">
            <button class="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-blue-600 text-white text-sm sm:text-base font-semibold hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-blue-200 cursor-pointer">
              Apply to the Team →
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

    <!-- ─── JOIN THE TEAM BANNER (white) ─── -->
    <section class="bg-white border-y border-gray-100 py-10 px-4 join-banner">
      <div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p class="text-blue-600 text-xs font-black uppercase tracking-widest mb-1">We're Growing</p>
          <h3 class="text-xl sm:text-2xl font-extrabold text-gray-900">Think you belong here? We're looking for passionate people.</h3>
        </div>
        <router-link to="/team-form" class="shrink-0">
          <button class="px-7 py-3 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-blue-200 cursor-pointer whitespace-nowrap">
            🙋 Apply Now
          </button>
        </router-link>
      </div>
    </section>

    <!-- ─── TEAM GRID (dark) ─── -->
    <section class="bg-[#0B101B] py-20 sm:py-28 px-4 relative overflow-hidden">
      <!-- Glow orb -->
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full"></div>
      </div>

      <div class="max-w-6xl mx-auto relative z-10">
        <div class="text-center mb-14 team-grid-header">
          <p class="text-blue-400 text-xs font-black uppercase tracking-widest mb-3">The Crew</p>
          <h2 class="text-white text-3xl sm:text-4xl font-extrabold tracking-tight">Who Runs the Show</h2>
        </div>

        <!-- Empty state -->
        <div v-if="teamMembers.length === 0" class="flex flex-col items-center justify-center py-20 text-center empty-state">
          <div class="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl mb-6">
            🙋
          </div>
          <p class="text-blue-400 text-xs font-black uppercase tracking-widest mb-3">Coming Soon</p>
          <h3 class="text-white text-2xl font-extrabold mb-3">No team members yet.</h3>
          <p class="text-gray-400 text-sm leading-relaxed max-w-sm mb-8">
            Team members will appear here once they submit their details. Share the form with your crew!
          </p>
          <router-link to="/team-form">
            <button class="px-7 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-blue-500/30 cursor-pointer">
              Be the first → Register
            </button>
          </router-link>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="member in teamMembers"
            :key="member.name"
            class="bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col group hover:scale-[1.03] transition-transform duration-300 team-card"
          >
            <!-- Top gradient bar -->
            <div class="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 w-full"></div>

            <div class="p-6 sm:p-8 flex flex-col items-center text-center flex-1">
              <!-- Avatar with ring -->
              <div class="w-28 h-28 rounded-2xl overflow-hidden bg-gray-100 border-4 border-white shadow-xl mb-5 transform group-hover:scale-105 duration-300 shrink-0 ring-4 ring-blue-50 group-hover:ring-blue-200 transition-all">
                <img :src="member.image" :alt="member.name" class="w-full h-full object-cover" />
              </div>

              <h3 class="text-lg sm:text-xl font-extrabold text-gray-900 mb-1.5">{{ member.name }}</h3>
              <span class="inline-block bg-blue-50 text-blue-600 text-[11px] font-black px-4 py-1.5 rounded-full mb-4 border border-blue-100 uppercase tracking-widest">
                {{ member.role }}
              </span>
              <p class="text-gray-500 text-sm leading-relaxed font-medium mb-5">{{ member.bio }}</p>

              <!-- Social row -->
              <div class="flex items-center justify-center gap-3 mt-auto pt-4 border-t border-gray-100 w-full">
                <a href="#" class="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 text-xs font-bold">
                  in
                </a>
                <a href="#" class="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-800 hover:border-gray-400 hover:bg-gray-100 transition-all duration-200 text-xs">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>
                </a>
                <a href="#" class="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 text-xs">
                  𝕏
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── TEAM VALUES (dark continues) ─── -->
    <section class="bg-[#0B101B] pb-20 sm:pb-28 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="border-t border-white/10 pt-14">
          <div class="text-center mb-12 values-header">
            <p class="text-blue-400 text-xs font-black uppercase tracking-widest mb-3">What We Stand For</p>
            <h2 class="text-white text-3xl sm:text-4xl font-extrabold tracking-tight">Team Values</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 values-grid">
            <div
              v-for="value in values"
              :key="value.title"
              class="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 hover:bg-white/8 transition-all duration-300 value-card"
            >
              <div class="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-xl mb-5 shadow-lg shadow-blue-500/20">
                {{ value.icon }}
              </div>
              <h3 class="text-white font-extrabold text-lg mb-3">{{ value.title }}</h3>
              <p class="text-gray-400 text-sm leading-relaxed">{{ value.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── OPEN ROLES (light) ─── -->
    <section class="bg-[#F8FAFC] py-20 sm:py-28 px-4">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-12 roles-header">
          <p class="text-blue-600 text-xs font-black uppercase tracking-widest mb-3">Open Positions</p>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Roles We're Hiring</h2>
          <p class="text-gray-500 text-base mt-3 max-w-md mx-auto">All roles are volunteer-based. The reward is skills, network, and portfolio.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 roles-grid">
          <div
            v-for="role in openRoles"
            :key="role.title"
            class="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.08)] hover:border-blue-100 transition-all duration-300 flex gap-5 role-card"
          >
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 bg-blue-50 border border-blue-100">
              {{ role.icon }}
            </div>
            <div class="flex-1">
              <h3 class="text-gray-900 font-extrabold text-base mb-1">{{ role.title }}</h3>
              <p class="text-gray-500 text-sm leading-relaxed mb-3">{{ role.desc }}</p>
              <router-link to="/contact-us">
                <button class="text-blue-600 text-xs font-black uppercase tracking-widest hover:text-blue-700 transition cursor-pointer">
                  Apply → 
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
import { ref, onMounted } from 'vue'
import { useGSAP } from '../composables/useGSAP'

const teamScope = ref(null)
const teamMembers = ref([])

const values = [
  { icon: '🏗️', title: 'Build in Public', desc: 'We share our work, our failures, and our wins openly. Progress is better than perfection, and transparency beats gatekeeping.' },
  { icon: '🤝', title: 'Students First', desc: 'Every decision we make starts with the question: does this help students learn and grow? Our community is not a product — it is a movement.' },
  { icon: '⚡', title: 'Bias for Action', desc: 'We move fast, experiment often, and course-correct based on feedback. Ideas that stay ideas are just dreams. We ship.' },
]

const openRoles = [
  { icon: '📣', title: 'Community Manager', desc: 'Run local chapters, host events, and keep Discord buzzing with energy and real conversations.' },
  { icon: '🧑‍💻', title: 'Tech Lead (Sprint)', desc: 'Set sprint architecture, guide team coding sessions, code review, and mentor junior developers.' },
  { icon: '🎨', title: 'Design Lead', desc: 'Lead design system workshops, UX sprints, and Figma handoffs for sprint teams.' },
  { icon: '🤝', title: 'Partnerships Lead', desc: 'Reach out to universities and companies for MOUs, sponsorships, and mentorship deals.' },
]

onMounted(() => {
  teamMembers.value = JSON.parse(localStorage.getItem('team_members') || '[]')
})

useGSAP((self) => {
  const { gsap } = self

  // Hero entrance
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  tl.from('.team-title', { y: 80, opacity: 0, duration: 1.4, skewY: 2 })
    .from('.team-sub', { y: 30, opacity: 0, duration: 1.1 }, '-=1.0')
    .from('.team-ctas a, .team-ctas a + a', { scale: 0.85, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'back.out(1.8)' }, '-=0.8')

  // Floating annotation tags
  const tags = gsap.utils.toArray('.ann-tag')
  tags.forEach((tag, i) => {
    gsap.from(tag, { scale: 0, opacity: 0, duration: 1, delay: 0.7 + i * 0.12, ease: 'back.out(2)' })
    gsap.to(tag, { y: '+=10', x: i % 2 === 0 ? '+=4' : '-=4', rotation: i % 2 === 0 ? '+=2' : '-=2', duration: 2.2 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.2 })
  })

  // Join banner
  gsap.from('.join-banner', {
    scrollTrigger: { trigger: '.join-banner', start: 'top 95%', once: true },
    immediateRender: false, y: 30, opacity: 0, duration: 0.9, ease: 'power3.out'
  })

  // Team grid header
  gsap.from('.team-grid-header', {
    scrollTrigger: { trigger: '.team-grid-header', start: 'top 95%', once: true },
    immediateRender: false, y: 40, opacity: 0, duration: 1, ease: 'power3.out'
  })

  // Team cards (delayed to allow localStorage items to mount)
  setTimeout(() => {
    gsap.from('.team-card', {
      scrollTrigger: { trigger: '.team-card', start: 'top 95%', once: true },
      immediateRender: false, y: 80, opacity: 0, scale: 0.93, duration: 1.2, stagger: 0.15, ease: 'back.out(1.4)'
    })
  }, 200)

  // Values
  gsap.from('.values-header', {
    scrollTrigger: { trigger: '.values-header', start: 'top 95%', once: true },
    immediateRender: false, y: 40, opacity: 0, duration: 1, ease: 'power3.out'
  })
  gsap.from('.value-card', {
    scrollTrigger: { trigger: '.values-grid', start: 'top 95%', once: true },
    immediateRender: false, y: 50, opacity: 0, duration: 1, stagger: 0.15, ease: 'back.out(1.4)'
  })

  // Roles
  gsap.from('.roles-header', {
    scrollTrigger: { trigger: '.roles-header', start: 'top 95%', once: true },
    immediateRender: false, y: 40, opacity: 0, duration: 1, ease: 'power3.out'
  })
  gsap.from('.role-card', {
    scrollTrigger: { trigger: '.roles-grid', start: 'top 95%', once: true },
    immediateRender: false, y: 50, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'back.out(1.4)'
  })
}, teamScope)
</script>
