<template>
  <div ref="pageScope" class="overflow-x-hidden">

    <!-- ═══════════════════════════════════════ -->
    <!-- HERO SPLIT SECTION -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="heroScope" class="w-full bg-[#F8FAFC] py-10 md:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div class="bg-white rounded-2xl md:rounded-3xl shadow-md overflow-hidden">
          <div class="flex flex-col md:flex-row">

            <!-- Robot Image Block -->
            <div class="bg-blue-600 flex items-center justify-center p-8 md:p-10 md:w-[280px] lg:w-[340px] flex-shrink-0 hero-image">
              <img src="/logo.png" alt="Skill Sprint Robot Mascot" class="w-36 sm:w-44 md:w-52 h-auto object-contain" />
            </div>

            <!-- Text Block -->
            <div class="flex-1 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-2 mb-4">
                  <span class="inline-block bg-blue-50 text-blue-600 text-xs font-extrabold px-4 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest">
                    About Us
                  </span>
                </div>
                <h1 class="hero-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                  So… What's Skill Sprint, <span class="text-blue-600">Really?</span>
                </h1>
                <p class="hero-sub text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                  SkillSprint is a
                  <span class="text-blue-600 font-extrabold border-b-2 border-blue-500 px-0.5" style="font-family: 'Handlee', cursive;">STUDENT-POWERED</span>
                  non-profit technical ecosystem focused on open-source engineering collaboration, peer mentorship, and zero-cost technical workshops.
                  We strictly reject any commercial EdTech, LMS, marketplace, or monetized training model. Here, learning meets action in a community-driven environment where students build real software, not academic exercises.
                </p>
                <div class="hidden md:flex justify-end mb-2">
                  <img src="/arrow.png" alt="" aria-hidden="true" class="w-16 opacity-60 -rotate-12" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- INTERACTIVE TIMELINE (Light Section) -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="timelineScope" class="bg-slate-50 py-16 sm:py-20 md:py-28 px-4 sm:px-6 overflow-hidden border-y border-gray-100">
      <div class="max-w-3xl mx-auto text-center mb-14 md:mb-20">
        <h2 class="timeline-heading text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3">
          The Sprint So Far
        </h2>
        <p class="timeline-sub text-gray-500 text-base sm:text-lg font-medium">
          Key milestones in our community journey.
        </p>
      </div>

      <div class="max-w-2xl mx-auto">
        <TimelineItem
          v-for="(milestone, i) in milestones"
          :key="milestone.year + i"
          :year="milestone.year"
          :title="milestone.title"
          :description="milestone.description"
          :isLast="i === milestones.length - 1"
          class="timeline-item-el"
        />
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- HOW A SPRINT WORKS -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="stepsScope" class="bg-[#F8FAFC] py-16 sm:py-20 md:py-28 px-4 sm:px-6">
      <div class="max-w-3xl mx-auto text-center mb-14 md:mb-20">
        <h2 class="steps-heading text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3">
          How a Sprint Works
        </h2>
        <p class="steps-sub text-gray-500 text-base sm:text-lg font-medium">
          From day one to deployment. Four steps.
        </p>
      </div>

      <div class="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(step, i) in steps"
          :key="step.title"
          class="step-card bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center transition-all duration-300 hover:shadow-xl hover:scale-[1.03] hover:border-blue-100"
        >
          <!-- Step Number -->
          <div class="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-lg mx-auto">
            <span class="text-white text-lg font-extrabold">{{ String(i + 1).padStart(2, '0') }}</span>
          </div>
          <h3 class="text-lg font-extrabold text-gray-900 mb-2 tracking-tight">{{ step.title }}</h3>
          <p class="text-gray-500 text-sm leading-relaxed">{{ step.description }}</p>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- PARTNERS & COLLABORATIONS -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="partnersScope" class="bg-[#F8FAFC] py-10 md:py-16 px-4 sm:px-6">
      <div class="max-w-7xl mx-auto">
        <div class="border-t border-gray-100 pt-8">
          <p class="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 text-center">
            Proud Collaborations
          </p>
          <div class="flex flex-wrap items-center gap-6 sm:gap-10 justify-center opacity-60 partner-logos">
            <img v-for="(logo, i) in logos" :key="i" :src="logo.src" :alt="logo.alt"
                 class="h-6 sm:h-7 md:h-8 w-auto object-contain partner-logo" loading="lazy" />
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
              Be Part of the
              <span class="text-blue-600 relative inline-block ml-1">Movement
                <span class="absolute left-0 -bottom-1 w-full h-[2px] bg-blue-500 rotate-[-2deg]"></span>
              </span>
            </h2>
            <p class="text-gray-500 mt-3 text-sm sm:text-base max-w-sm mx-auto leading-relaxed mb-6">
              Join the SkillSprint community and start building.
            </p>
            <div class="flex flex-wrap gap-3 sm:gap-4 justify-center items-center">
              <router-link to="/contact-us">
                <button class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold px-8 py-3 rounded-full text-sm transition-all duration-200 shadow-md shadow-blue-200 cursor-pointer">
                  Join the Sprint
                </button>
              </router-link>
              <router-link to="/mission">
                <button class="bg-white border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-700 font-semibold px-8 py-3 rounded-full text-sm transition-all duration-200 cursor-pointer">
                  Our Mission
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
import TimelineItem from '../components/TimelineItem.vue'

const pageScope = ref(null)
const heroScope = ref(null)
const timelineScope = ref(null)
const stepsScope = ref(null)
const partnersScope = ref(null)

const milestones = [
  { year: '2024', title: 'The First Sprint', description: 'A small group of university students organized the first community hackathon. 40 participants, one weekend, three shipped projects.' },
  { year: '2024', title: 'University Partnerships', description: 'Signed first MOUs with local universities to formalize bootcamp schedules and provide campus spaces for sprint sessions.' },
  { year: '2025', title: 'Open-Source Engineering Tracks', description: 'Launched structured, semester-long engineering tracks where students maintain real production-ready repositories with peer code reviews.' },
  { year: '2025', title: 'Mentorship Framework', description: 'Established peer-to-peer mentorship programs pairing upperclassmen engineers with incoming students across 11 universities.' },
  { year: '2026', title: '1,500+ Active Members', description: 'Community expanded to over 1,500 students, 20+ mentors, and partnerships with GDG Cloud, AWS Cloud Clubs, and IxDF.' },
]

const steps = [
  { title: 'Join', description: 'Apply to an active engineering track or workshop through our open enrollment channels.' },
  { title: 'Get Matched', description: 'You\'re paired with a team, a mentor, and a structured sprint timeline.' },
  { title: 'Build Together', description: 'Collaborate on real codebases with peer reviews, CI/CD pipelines, and shared repos.' },
  { title: 'Ship & Showcase', description: 'Deploy production code. Add it to your portfolio. Present at community demos.' },
]

const logos = [
  { src: '/FoF Lhr.png', alt: 'FoF Lahore' },
  { src: '/IxDF.png', alt: 'Interaction Design Foundation' },
  { src: '/GDG Cloud Lhr.jpg.jpeg', alt: 'GDG Cloud Lahore' },
  { src: '/AWS Cloud Clubs.png', alt: 'AWS Cloud Clubs' },
  { src: '/Superior University Logo.svg', alt: 'Superior University' },
]

// Unified Page Animations
useGSAP((self) => {
  const { gsap } = self

  // Hero animations
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  tl.from('.hero-image', { x: -80, opacity: 0, duration: 1.2 })
    .from('.hero-heading', { x: 60, opacity: 0, duration: 1.2 }, '-=1.0')
    .from('.hero-sub', { y: 30, opacity: 0, duration: 1 }, '-=0.8')

  // Timeline animations
  gsap.from('.timeline-heading', {
    scrollTrigger: { trigger: timelineScope.value, start: 'top 80%', toggleActions: 'play none none reverse' },
    y: 50, opacity: 0, duration: 1, ease: 'power3.out'
  })
  gsap.from('.timeline-sub', {
    scrollTrigger: { trigger: timelineScope.value, start: 'top 77%', toggleActions: 'play none none reverse' },
    y: 35, opacity: 0, duration: 1, ease: 'power3.out'
  })
  
  const items = self.selector('.timeline-item-el')
  items.forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none reverse' },
      x: i % 2 === 0 ? -40 : 40, opacity: 0, duration: 0.8, ease: 'power3.out'
    })
  })

  // Steps animations
  gsap.from('.steps-heading', {
    scrollTrigger: { trigger: stepsScope.value, start: 'top 80%', toggleActions: 'play none none reverse' },
    y: 50, opacity: 0, duration: 1, ease: 'power3.out'
  })
  gsap.from('.steps-sub', {
    scrollTrigger: { trigger: stepsScope.value, start: 'top 77%', toggleActions: 'play none none reverse' },
    y: 35, opacity: 0, duration: 1, ease: 'power3.out'
  })
  
  const stepCards = self.selector('.step-card')
  if (stepCards.length > 0) {
    gsap.from(stepCards, {
      scrollTrigger: { trigger: stepsScope.value, start: 'top 80%', toggleActions: 'play none none reverse' },
      y: 60, opacity: 0, scale: 0.92, duration: 0.9, stagger: 0.15, ease: 'back.out(1.3)'
    })
  }

  // Partner logos
  const logosList = self.selector('.partner-logo')
  if (logosList.length > 0) {
    gsap.from(logosList, {
      scrollTrigger: { trigger: partnersScope.value, start: 'top 90%', toggleActions: 'play none none reverse' },
      y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out'
    })
  }
}, pageScope)
</script>
