<template>
  <div class="overflow-x-hidden">

    <!-- ═══════════════════════════════════════ -->
    <!-- HERO SECTION -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="heroScope" class="relative bg-[#F8FAFC] pt-10 sm:pt-14 md:pt-20 pb-10 md:pb-16 text-center px-4 overflow-hidden">

      <!-- Floating Annotations -->
      <div class="hidden sm:block pointer-events-none select-none" aria-hidden="true">
        <div class="absolute left-4 md:left-[10%] lg:left-[16%] top-[16%] -rotate-6
                    bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" style="font-family: 'Handlee', cursive;">
          ⚡ student-led
        </div>
        <div class="absolute right-4 md:right-[10%] lg:right-[16%] top-[12%] rotate-6
                    bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" style="font-family: 'Handlee', cursive;">
          🛠️ building daily
        </div>
        <div class="absolute left-2 md:left-[7%] lg:left-[12%] top-[30%] rotate-8
                    bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" style="font-family: 'Handlee', cursive;">
          🤝 real mentors
        </div>
        <div class="absolute right-2 md:right-[7%] lg:right-[12%] top-[28%] -rotate-4
                    bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" style="font-family: 'Handlee', cursive;">
          🎯 zero hierarchy
        </div>
      </div>

      <div class="relative z-10">
        <h1 class="hero-heading text-[2.4rem] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-4">
          The Core Infrastructure<br/>
          <span class="text-blue-600">Team.</span>
        </h1>
        <p class="hero-sub max-w-xs sm:max-w-sm md:max-w-2xl mx-auto text-gray-500 text-sm sm:text-base md:text-lg mb-8 leading-relaxed px-2">
          SkillSprint is managed entirely by an active core group of student developers, systems builders, and technical community organizers. We coordinate engineering directions, establish workshop schedules, and manage platform deployments.
        </p>
        <div class="flex justify-center mb-6">
          <span class="inline-block bg-blue-50 text-blue-600 text-xs font-extrabold px-4 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest">
            Structure
          </span>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- TEAM GRID (Fanned on desktop) -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="teamSection" class="bg-[#F8FAFC] px-4 sm:px-6 pb-6 md:pb-10">
      <div class="max-w-4xl mx-auto">

        <!-- Mobile: vertical stack -->
        <div class="flex flex-col gap-5 md:hidden w-full">
          <TeamMemberCard
            v-for="member in allMembers"
            :key="member.id"
            v-bind="member"
            class="team-card-mobile"
          />
        </div>

        <!-- Desktop: fanned overlapping layout for core team -->
        <div class="hidden md:flex justify-center items-end gap-0 h-[420px] relative desktop-team-container mb-16">
          <TeamMemberCard
            v-for="member in coreMembers"
            :key="member.id"
            v-bind="member"
            :desktopStyle="member.desktopStyle"
            class="absolute desktop-team-card hover:z-30 hover:!scale-105"
          />
        </div>

        <!-- Desktop: grid layout for additional dynamic team members -->
        <div v-if="addedMembers.length" class="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 added-members-grid pb-12">
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
    <!-- RECRUITMENT STATUS (Dark Section) -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="recruitSection" class="bg-slate-50 py-16 sm:py-20 md:py-28 px-4 sm:px-6 overflow-hidden border-y border-gray-100">
      <div class="max-w-3xl mx-auto text-center mb-12 md:mb-16">
        <h2 class="recruit-heading text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3">
          Core Team Allocation Windows
        </h2>
        <p class="recruit-sub text-gray-500 text-base sm:text-lg font-medium">
          Positions are evaluated on a strict seasonal rotation cycle.
        </p>
      </div>

      <div class="max-w-2xl mx-auto">
        <div class="recruit-card bg-white rounded-2xl md:rounded-3xl p-8 sm:p-10 shadow-2xl">
          <!-- LOCKED Badge -->
          <div class="flex items-center justify-between mb-6">
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recruitment Pipeline</span>
            <span class="inline-flex items-center gap-2 bg-red-50 text-red-500 text-xs font-extrabold px-3 py-1.5 rounded-full border border-red-100">
              <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              LOCKED
            </span>
          </div>

          <!-- Description -->
          <p class="text-gray-500 text-sm sm:text-base leading-relaxed mb-8">
            Core leadership and track coordinator positions are evaluated on a strict seasonal rotation cycle. We do not accept passive community applications. When active recruitment pipelines clear, formal onboarding application portals will be routed directly through our official communication channels.
          </p>

          <!-- Status Indicator -->
          <div class="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <div class="w-3 h-3 rounded-full bg-red-500 ring-4 ring-red-100"></div>
            <span class="text-[11px] font-extrabold text-gray-600 uppercase tracking-wider">
              Current Recruitment Status: Locked
            </span>
          </div>
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
              Want to join when positions
              <span class="text-blue-600 relative inline-block ml-1">open?
                <span class="absolute left-0 -bottom-1 w-full h-[2px] bg-blue-500 rotate-[-2deg]"></span>
              </span>
            </h2>
            <p class="text-gray-500 mt-3 text-sm sm:text-base max-w-sm mx-auto leading-relaxed mb-6">
              Stay connected through our official channels for recruitment updates.
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
import { ref, computed, onMounted } from 'vue'
import { useGSAP } from '../composables/useGSAP'
import TeamMemberCard from '../components/TeamMemberCard.vue'

const heroScope = ref(null)
const teamSection = ref(null)
const recruitSection = ref(null)

const coreMembers = ref([
  {
    id: 'tm-01',
    name: 'Core Engineering Lead',
    initials: 'EL',
    role: 'Systems Architecture',
    bio: 'Oversees all technical infrastructure decisions, repository standards, and deployment pipeline configurations across the SkillSprint ecosystem.',
    focus: ['Vue.js', 'DevOps', 'CI/CD'],
    avatarClass: 'bg-blue-100 text-blue-600',
    desktopStyle: 'width:280px; min-height:330px; top:20px; left:50%; z-index:10;',
  },
  {
    id: 'tm-02',
    name: 'Workshop Coordinator',
    initials: 'WC',
    role: 'Education Operations',
    bio: 'Designs and schedules localized technical literacy bootcamps, manages curriculum iterations, and coordinates venue logistics for in-person sessions.',
    focus: ['Curriculum', 'Outreach'],
    avatarClass: 'bg-indigo-100 text-indigo-600',
    desktopStyle: 'width:290px; min-height:310px; top:0; left:50%; z-index:20;',
  },
  {
    id: 'tm-03',
    name: 'Community Operations',
    initials: 'CO',
    role: 'Mentorship Programs',
    bio: 'Manages peer-to-peer mentorship frameworks, tracks participant progression metrics, and ensures mentorship alignment across engineering cohorts.',
    focus: ['Mentorship', 'QA'],
    avatarClass: 'bg-pink-100 text-pink-600',
    desktopStyle: 'width:280px; min-height:320px; top:30px; left:50%; z-index:10;',
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

// Team members are loaded from the database (CockroachDB) via the /api/team-members endpoint,
// so every visitor sees the same live roster. New members are added through the hidden
// /team-form, which writes straight to the same database.
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
    // If the API/DB is unavailable, just show the core team.
  }
})

const allMembers = computed(() => [...coreMembers.value, ...addedMembers.value])

// Hero animations
useGSAP((self) => {
  const { gsap } = self

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  tl.from('.hero-heading', { y: 80, opacity: 0, duration: 1.4, skewY: 2 })
    .from('.hero-sub', { y: 30, opacity: 0, duration: 1.1 }, '-=1.0')
    .from('.bg-blue-50', { scale: 0.85, opacity: 0, duration: 0.9, ease: 'back.out(1.8)' }, '-=0.8')

  const labels = gsap.utils.toArray('.floating-tag')
  labels.forEach((label, i) => {
    gsap.from(label, { scale: 0, opacity: 0, duration: 1, delay: 0.7 + i * 0.12, ease: 'back.out(2)' })
    gsap.to(label, { y: '+=10', x: i % 2 === 0 ? '+=4' : '-=4', rotation: i % 2 === 0 ? '+=2' : '-=2', duration: 2.2 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.2 })
  })
}, heroScope)

// Team fanned cards
useGSAP((self) => {
  const { gsap } = self

  // Mobile cards
  const mobileCards = self.selector('.team-card-mobile')
  if (mobileCards.length > 0) {
    gsap.from(mobileCards, {
      scrollTrigger: { trigger: teamSection.value, start: 'top 85%', toggleActions: 'play none none reverse' },
      y: 60, opacity: 0, scale: 0.92, duration: 0.9, stagger: 0.15, ease: 'power3.out'
    })
  }

  // Desktop fanned cards
  const desktopCards = self.selector('.desktop-team-card')
  if (desktopCards.length > 0) {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.desktop-team-container', start: 'top 75%', toggleActions: 'play none none reverse' }
    })

    gsap.set(desktopCards, {
      xPercent: (i) => i === 1 ? -50 : 0,
      x: 0, y: 120, rotation: 0, scale: 0.9, opacity: 0
    })

    tl.to(desktopCards, { opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.15, ease: 'back.out(1.4)' })
      .to(desktopCards[0], { x: -430, xPercent: 0, rotation: 5, duration: 0.9, ease: 'power3.out' }, '-=0.6')
      .to(desktopCards[1], { x: 0, xPercent: -50, rotation: -4, duration: 0.9, ease: 'power3.out' }, '-=0.8')
      .to(desktopCards[2], { x: 110, xPercent: 0, rotation: 5, duration: 0.9, ease: 'power3.out' }, '-=0.8')
  }

  // Added grid members animation
  const addedCards = self.selector('.added-member-card')
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
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out'
    })
  }
}, teamSection)

// Recruitment section
useGSAP((self) => {
  const { gsap } = self

  gsap.from('.recruit-heading', {
    scrollTrigger: { trigger: recruitSection.value, start: 'top 80%', toggleActions: 'play none none reverse' },
    y: 50, opacity: 0, duration: 1, ease: 'power3.out'
  })
  gsap.from('.recruit-sub', {
    scrollTrigger: { trigger: recruitSection.value, start: 'top 77%', toggleActions: 'play none none reverse' },
    y: 35, opacity: 0, duration: 1, ease: 'power3.out'
  })
  gsap.from('.recruit-card', {
    scrollTrigger: { trigger: '.recruit-card', start: 'top 85%', toggleActions: 'play none none reverse' },
    y: 40, scale: 0.9, opacity: 0, duration: 1, ease: 'back.out(1.5)'
  })
}, recruitSection)
</script>
