<template>
  <div ref="pageScope" class="overflow-x-hidden">

    <!-- ═══════════════════════════════════════ -->
    <!-- HERO SECTION -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="heroScope" class="px-4 sm:px-6 relative bg-[#F8FAFC] pt-12 sm:pt-16 md:pt-24 pb-14 md:pb-20 text-center overflow-hidden">
      <!-- Ambient light & blueprint grid -->
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute inset-0 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.14]"></div>
        <div class="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-blue-500/15 blur-[140px] rounded-full"></div>
        <div class="absolute -right-20 top-1/3 w-[450px] h-[450px] bg-indigo-500/12 blur-[130px] rounded-full"></div>
      </div>

      <!-- Floating Annotations -->
      <div class="hidden sm:block pointer-events-none select-none" aria-hidden="true">
        <div class="absolute left-4 md:left-[10%] lg:left-[15%] top-[18%] -rotate-6
                    bg-white/90 backdrop-blur-md shadow-lg shadow-blue-900/5 px-3.5 py-1.5 rounded-full border border-blue-100/80
                    text-[12px] font-bold tracking-wide text-gray-700 floating-tag" style="font-family: 'Handlee', cursive;">
          ⚡ student-led
        </div>
        <div class="absolute right-4 md:right-[10%] lg:right-[15%] top-[14%] rotate-6
                    bg-white/90 backdrop-blur-md shadow-lg shadow-blue-900/5 px-3.5 py-1.5 rounded-full border border-blue-100/80
                    text-[12px] font-bold tracking-wide text-gray-700 floating-tag" style="font-family: 'Handlee', cursive;">
          🛠️ building daily
        </div>
        <div class="absolute left-2 md:left-[8%] lg:left-[12%] top-[34%] rotate-8
                    bg-white/90 backdrop-blur-md shadow-lg shadow-blue-900/5 px-3.5 py-1.5 rounded-full border border-blue-100/80
                    text-[12px] font-bold tracking-wide text-gray-700 floating-tag" style="font-family: 'Handlee', cursive;">
          🤝 real mentors
        </div>
        <div class="absolute right-2 md:right-[8%] lg:right-[12%] top-[32%] -rotate-4
                    bg-white/90 backdrop-blur-md shadow-lg shadow-blue-900/5 px-3.5 py-1.5 rounded-full border border-blue-100/80
                    text-[12px] font-bold tracking-wide text-gray-700 floating-tag" style="font-family: 'Handlee', cursive;">
          🎯 zero hierarchy
        </div>
      </div>

      <div class="relative z-10 max-w-4xl mx-auto">
        <div class="flex justify-center mb-6">
          <span class="inline-flex items-center gap-2 bg-blue-50/90 text-blue-600 text-xs font-mono font-extrabold px-4 py-1.5 rounded-full border border-blue-200/60 uppercase tracking-widest shadow-sm">
            <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Operational Core
          </span>
        </div>

        <h1 class="hero-heading h-display text-gray-900 leading-[1.08] mb-5">
          The Core Infrastructure<br/>
          <span class="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">Team.</span>
        </h1>

        <p class="hero-sub max-w-xs sm:max-w-sm md:max-w-2xl mx-auto text-gray-600 text-sm sm:text-base md:text-lg mb-8 leading-relaxed px-2 font-normal">
          SkillSprint is engineered and steered entirely by an active cohort of student developers, systems architects, and technical organizers. We direct platform roadmaps, coordinate bootcamp schedules, and maintain open-source infrastructure.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-4">
          <router-link to="/contact-us" v-magnetic>
            <button class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-8 py-3.5 rounded-full text-sm transition-all duration-300 shadow-lg shadow-blue-600/25">
              Connect With Us
            </button>
          </router-link>
          <a href="#recruitment-status" v-magnetic>
            <button class="bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-700 font-bold px-7 py-3 rounded-full text-sm transition-all duration-300 shadow-sm">
              Recruitment Windows
            </button>
          </a>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- KINETIC VELOCITY MARQUEE -->
    <!-- ═══════════════════════════════════════ -->
    <div ref="marqueeScope" class="kinetic-marquee-container py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-mono text-xs sm:text-sm font-black uppercase tracking-widest overflow-hidden shadow-lg select-none">
      <div class="marquee-track flex whitespace-nowrap gap-10">
        <span v-for="n in 6" :key="n" class="flex items-center gap-8">
          <span>ACTIVE CORE BUILDERS</span>
          <span class="text-blue-300">✦</span>
          <span>ZERO HIERARCHY</span>
          <span class="text-blue-300">✦</span>
          <span>PRODUCTION SYSTEMS</span>
          <span class="text-blue-300">✦</span>
          <span>OPEN ENROLLMENT</span>
          <span class="text-blue-300">✦</span>
          <span>STUDENT DRIVEN</span>
          <span class="text-blue-300">✦</span>
        </span>
      </div>
    </div>

    <!-- ═══════════════════════════════════════ -->
    <!-- TEAM GRID (Pinned 3D Deck on Desktop) -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="teamSection" class="px-4 sm:px-6 bg-[#F8FAFC] py-12 md:py-20 relative">
      <div class="max-w-6xl mx-auto">

        <div class="text-center mb-14 md:mb-20">
          <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-600 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-3">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Active Stewards
          </div>
          <h2 class="text-gray-900 h-section mb-3">
            Systems & Infrastructure Leads
          </h2>
          <p class="text-gray-500 text-base sm:text-lg font-medium max-w-xl mx-auto">
            The core engineers and organizers behind every repository, release, and live workshop.
          </p>
        </div>

        <!-- Mobile: vertical stack -->
        <div class="flex flex-col gap-5 md:hidden w-full">
          <TeamMemberCard
            v-for="member in allMembers"
            :key="member.id"
            v-bind="member"
            class="team-card-mobile"
          />
        </div>

        <!-- Desktop: fanned overlapping 3D layout for core team -->
        <div class="hidden md:flex justify-center items-end gap-0 h-[450px] relative desktop-team-container mb-16">
          <TeamMemberCard
            v-for="member in coreMembers"
            :key="member.id"
            v-bind="member"
            :desktopStyle="member.desktopStyle"
            class="absolute desktop-team-card hover:z-40"
          />
        </div>

        <!-- Desktop: grid layout for additional dynamic team members from Postgres -->
        <div v-if="addedMembers.length" class="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 added-members-grid pb-12">
          <TeamMemberCard
            v-for="member in addedMembers"
            :key="member.id"
            v-bind="member"
            class="added-member-card"
          />
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- RECRUITMENT STATUS (Cyberpunk Locked Terminal) -->
    <!-- ═══════════════════════════════════════ -->
    <section id="recruitment-status" ref="recruitSection" class="bg-[#0B101B] section overflow-hidden relative text-white border-y border-white/10">
      <!-- Ambient red glow -->
      <div class="absolute -top-32 left-1/3 w-[500px] h-[500px] bg-red-600/10 blur-[160px] rounded-full pointer-events-none"></div>

      <div class="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div class="text-center mb-12 md:mb-16">
          <span class="inline-flex items-center gap-2 bg-red-500/15 text-red-400 text-xs font-mono font-extrabold px-4 py-1.5 rounded-full border border-red-500/30 uppercase tracking-widest mb-4">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            Seasonal Pipeline
          </span>
          <h2 class="recruit-heading text-white h-section mb-3 font-extrabold">
            Core Team Allocation Windows
          </h2>
          <p class="recruit-sub text-gray-400 text-base sm:text-lg font-medium max-w-xl mx-auto">
            Positions are evaluated on a strict seasonal rotation cycle based on active contributions.
          </p>
        </div>

        <!-- Cyber Terminal Card -->
        <div class="recruit-card bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-white/15 p-8 sm:p-12 shadow-[0_25px_70px_rgba(0,0,0,0.8)] relative overflow-hidden group">
          <!-- Laser scanning effect line -->
          <div class="laser-scanner absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-75"></div>

          <!-- HUD Header -->
          <div class="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
              <span class="font-mono text-xs font-black text-gray-300 uppercase tracking-widest">
                SYS_ONBOARDING // STATUS
              </span>
            </div>
            <span class="inline-flex items-center gap-2 bg-red-500/20 text-red-400 text-xs font-mono font-black px-3.5 py-1.5 rounded-full border border-red-500/40">
              LOCKED
            </span>
          </div>

          <!-- Description -->
          <p class="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 font-normal">
            Core leadership and track coordinator positions are evaluated on a strict seasonal rotation cycle. We do not accept passive external applications. When active recruitment pipelines clear, formal onboarding application portals will be routed directly through our verified communication channels.
          </p>

          <!-- Status Indicator Terminal Row -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-black/40 border border-white/10 rounded-2xl">
            <div class="flex items-center gap-3.5">
              <div class="w-3.5 h-3.5 rounded-full bg-red-500 ring-4 ring-red-500/20 shrink-0"></div>
              <span class="font-mono text-xs sm:text-sm font-bold text-gray-200 uppercase tracking-wider">
                Current Pipeline Status: Locked (Evaluating Cohort Alpha)
              </span>
            </div>
            <router-link to="/contact-us" v-magnetic>
              <button class="whitespace-nowrap bg-white/10 hover:bg-white/15 text-white text-xs font-mono font-bold px-4 py-2 rounded-xl border border-white/20 transition-colors">
                Inquire For Next Window &rarr;
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- CTA SECTION -->
    <!-- ═══════════════════════════════════════ -->
    <section class="relative w-full bg-gradient-to-b from-[#F8FAFC] via-[#dceeff] to-[#b8d4f0] section overflow-hidden">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <div class="relative bg-white/95 backdrop-blur-md rounded-3xl md:rounded-[2.5rem] shadow-[0_25px_60px_rgba(37,99,235,0.12)] border border-white/60 px-6 sm:px-12 py-12 md:py-16 text-center overflow-hidden cta-card">
          <div class="absolute right-0 bottom-0 pointer-events-none select-none opacity-80" aria-hidden="true">
            <img ref="ctaMascot" src="/sidelogo.png" alt="" class="w-40 sm:w-56 md:w-72 h-auto object-contain" style="transform: rotate(-12deg) translate(20%, 15%);" />
          </div>
          <div class="relative z-10">
            <span class="inline-block bg-blue-50 text-blue-600 text-xs font-mono font-extrabold px-4 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest mb-4">
              Get Notified
            </span>
            <h2 class="h-sub text-gray-900 leading-snug mb-4">
              Want to join when positions
              <span class="text-blue-600 relative inline-block ml-1">open?
                <span class="absolute left-0 -bottom-1 w-full h-[3px] bg-blue-500 rotate-[-2deg]"></span>
              </span>
            </h2>
            <p class="text-gray-600 text-sm sm:text-base md:text-lg max-w-md mx-auto leading-relaxed mb-8">
              Stay connected through our official community channels for upcoming recruitment announcements.
            </p>
            <div class="flex flex-wrap gap-4 justify-center items-center">
              <router-link to="/contact-us" v-magnetic>
                <button class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-8 py-3.5 rounded-full text-sm transition-all duration-200 shadow-lg shadow-blue-500/25">
                  Join the Sprint
                </button>
              </router-link>
              <router-link to="/community" v-magnetic>
                <button class="bg-white border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-700 font-bold px-8 py-3.5 rounded-full text-sm transition-all duration-200">
                  Community Hub
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
import { ref, computed, onMounted } from 'vue'
import { useGSAP } from '../composables/useGSAP'
import { SplitText } from '../motion/gsap'
import TeamMemberCard from '../components/TeamMemberCard.vue'

const pageScope = ref(null)
const heroScope = ref(null)
const marqueeScope = ref(null)
const teamSection = ref(null)
const recruitSection = ref(null)
const ctaMascot = ref(null)

const coreMembers = ref([
  {
    id: 'tm-01',
    name: 'Core Engineering Lead',
    initials: 'EL',
    role: 'Systems Architecture',
    bio: 'Oversees all technical infrastructure decisions, repository standards, and deployment pipeline configurations across the SkillSprint ecosystem.',
    focus: ['Vue.js', 'DevOps', 'CI/CD'],
    avatarClass: 'bg-blue-600 text-white',
    desktopStyle: 'width:300px; min-height:340px; top:20px; left:50%; z-index:10;',
  },
  {
    id: 'tm-02',
    name: 'Workshop Coordinator',
    initials: 'WC',
    role: 'Education Operations',
    bio: 'Designs and schedules localized technical literacy bootcamps, manages curriculum iterations, and coordinates venue logistics for in-person sessions.',
    focus: ['Curriculum', 'Outreach'],
    avatarClass: 'bg-indigo-600 text-white',
    desktopStyle: 'width:310px; min-height:320px; top:0; left:50%; z-index:20;',
  },
  {
    id: 'tm-03',
    name: 'Community Operations',
    initials: 'CO',
    role: 'Mentorship Programs',
    bio: 'Manages peer-to-peer mentorship frameworks, tracks participant progression metrics, and ensures mentorship alignment across engineering cohorts.',
    focus: ['Mentorship', 'QA'],
    avatarClass: 'bg-blue-500 text-white',
    desktopStyle: 'width:300px; min-height:330px; top:30px; left:50%; z-index:10;',
  }
])

const getInitials = (name) => {
  if (!name) return 'SS'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

// Dynamic team members from database
const addedMembers = ref([])

onMounted(async () => {
  try {
    const res = await fetch('/api/team-members')
    if (!res.ok) return
    const data = await res.json()
    const members = Array.isArray(data.members) ? data.members : []
    addedMembers.value = members.map((m, idx) => ({
      id: m.id || `added-${idx}`,
      name: m.name,
      role: m.role,
      bio: m.bio,
      initials: getInitials(m.name),
      focus: Array.isArray(m.focus) && m.focus.length ? m.focus : ['Core Builder', 'Collaborator'],
      image: m.image || ''
    }))
  } catch (e) {
    // If database is unavailable, default core team is displayed
  }
})

const allMembers = computed(() => [...coreMembers.value, ...addedMembers.value])

// Unified GSAP Animations
useGSAP(({ gsap, ScrollTrigger, selector }) => {
  // 1. Hero SplitText & Parallax
  const headingEl = selector('.hero-heading')[0]
  if (headingEl) {
    const split = SplitText.create(headingEl, { type: 'words,chars', wordsClass: 'hw' })
    gsap.from(split.chars, {
      y: 50,
      opacity: 0,
      rotateX: -45,
      stagger: 0.02,
      duration: 1,
      ease: 'power3.out',
    })
  }

  gsap.from(selector('.hero-sub'), {
    y: 30,
    opacity: 0,
    duration: 0.9,
    delay: 0.3,
    ease: 'power3.out',
  })

  const labels = selector('.floating-tag')
  labels.forEach((label, i) => {
    gsap.from(label, { scale: 0, opacity: 0, duration: 1, delay: 0.6 + i * 0.12, ease: 'back.out(2)' })
    gsap.to(label, { y: '+=8', x: i % 2 === 0 ? '+=4' : '-=4', rotation: i % 2 === 0 ? '+=2' : '-=2', duration: 2.4 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.2 })
  })

  // 2. Kinetic Marquee Scrub
  const marqueeTrack = selector('.marquee-track')[0]
  if (marqueeTrack) {
    gsap.to(marqueeTrack, {
      xPercent: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: marqueeScope.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8,
      }
    })
  }

  // 3. Desktop Fanned Cards Scrub / Reveal
  const desktopCards = selector('.desktop-team-card')
  if (desktopCards.length > 0) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.desktop-team-container',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    })

    gsap.set(desktopCards, {
      xPercent: (i) => i === 1 ? -50 : 0,
      x: 0,
      y: 120,
      rotation: 0,
      scale: 0.9,
      opacity: 0
    })

    tl.to(desktopCards, { opacity: 1, y: 0, scale: 1, duration: 1.1, stagger: 0.12, ease: 'back.out(1.4)' })
      .to(desktopCards[0], { x: -440, xPercent: 0, rotation: 5, duration: 0.9, ease: 'power3.out' }, '-=0.6')
      .to(desktopCards[1], { x: 0, xPercent: -50, rotation: -4, duration: 0.9, ease: 'power3.out' }, '-=0.8')
      .to(desktopCards[2], { x: 130, xPercent: 0, rotation: 5, duration: 0.9, ease: 'power3.out' }, '-=0.8')
  }

  // 4. Added Dynamic Members Stagger
  const addedCards = selector('.added-member-card')
  if (addedCards.length > 0) {
    gsap.from(addedCards, {
      scrollTrigger: {
        trigger: '.added-members-grid',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 40,
      opacity: 0,
      scale: 0.95,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out'
    })
  }

  // 5. Recruitment Locked Terminal Reveal & Laser Scanner
  gsap.from(selector('.recruit-card'), {
    scrollTrigger: { trigger: recruitSection.value, start: 'top 75%', toggleActions: 'play none none reverse' },
    y: 50,
    scale: 0.92,
    opacity: 0,
    duration: 1.1,
    ease: 'back.out(1.4)'
  })

  // Laser sweep animation
  const scanner = selector('.laser-scanner')[0]
  if (scanner) {
    gsap.to(scanner, {
      top: '100%',
      duration: 2.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }

  // 6. CTA Mascot Parallax
  if (ctaMascot.value) {
    gsap.from(ctaMascot.value, {
      scrollTrigger: { trigger: '.cta-card', start: 'top 85%', toggleActions: 'play none none reverse' },
      xPercent: 30,
      yPercent: 30,
      opacity: 0,
      duration: 1.2,
      ease: 'back.out(1.5)'
    })
  }
}, pageScope)
</script>

<style scoped>
.hero-heading :deep(.hw) {
  display: inline-block;
  overflow: clip;
}
</style>
