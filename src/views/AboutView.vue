<template>
  <div ref="pageScope" class="overflow-x-hidden">

    <!-- ═══════════════════════════════════════ -->
    <!-- HERO SPLIT SECTION -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="heroScope" class="w-full bg-[#F8FAFC] section-tight relative overflow-hidden">
      <!-- Ambient light & blueprint grid -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div class="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-blue-500/10 blur-[130px] rounded-full"></div>
        <div class="absolute -right-20 top-1/3 w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div class="bg-white rounded-3xl md:rounded-[2.5rem] shadow-[0_20px_70px_rgba(37,99,235,0.08)] border border-slate-100 overflow-hidden">
          <div class="flex flex-col md:flex-row">

            <!-- Robot Image Block: 3D cyber stage -->
            <div class="robot-hero-stage bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 flex items-center justify-center p-8 md:p-12 md:w-[320px] lg:w-[380px] flex-shrink-0 relative overflow-hidden">
              <div class="absolute w-44 h-44 border border-white/20 rounded-full animate-spin-slow pointer-events-none"></div>
              <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_70%)] pointer-events-none"></div>
              <img
                ref="robotMascot"
                src="/logo.png"
                alt="Skill Sprint Robot Mascot"
                class="w-40 sm:w-48 md:w-56 h-auto object-contain relative z-10 filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)]"
              />
            </div>

            <!-- Text Block -->
            <div class="flex-1 p-6 sm:p-10 md:p-12 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-2 mb-4">
                  <span class="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-mono font-extrabold px-3.5 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest">
                    <span class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                    Ecosystem Architecture
                  </span>
                </div>
                <h1 class="hero-heading h-display text-gray-900 mb-5 leading-[1.15]">
                  So… What's Skill Sprint, <span class="text-blue-600">Really?</span>
                </h1>
                <p class="hero-sub text-gray-600 text-base sm:text-lg leading-relaxed mb-6 font-normal">
                  SkillSprint is a
                  <span class="text-blue-600 font-extrabold border-b-2 border-blue-500 px-1 inline-block" style="font-family: 'Handlee', cursive;">STUDENT-POWERED</span>
                  non-profit technical ecosystem focused on open-source engineering collaboration, peer mentorship, and zero-cost technical workshops.
                  We strictly reject any commercial EdTech, LMS, marketplace, or monetized training model. Here, learning meets action in a community-driven environment where students build real software, not academic exercises.
                </p>
                <div class="hidden md:flex justify-end mb-2 pr-4">
                  <img src="/arrow.png" alt="" aria-hidden="true" class="w-16 opacity-70 -rotate-12 hover:rotate-0 transition-transform duration-300" />
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
    <section ref="timelineScope" class="bg-slate-50 section overflow-hidden border-y border-gray-100 relative">
      <div class="max-w-3xl mx-auto text-center mb-16 md:mb-20 relative z-10">
        <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-600 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          Origins & Trajectory
        </div>
        <h2 class="timeline-heading text-gray-900 h-section mb-3">
          The Sprint <span class="text-blue-600">So Far</span>
        </h2>
        <p class="timeline-sub text-gray-500 text-base sm:text-lg font-medium">
          Key milestones in our student-led community journey.
        </p>
      </div>

      <div class="max-w-2xl mx-auto relative z-10 px-4">
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
    <section ref="stepsScope" class="bg-[#F8FAFC] section relative overflow-hidden">
      <div class="max-w-3xl mx-auto text-center mb-16 md:mb-20 relative z-10">
        <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-600 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          Execution Pipeline
        </div>
        <h2 class="steps-heading text-gray-900 h-section mb-3">
          How a Sprint Works
        </h2>
        <p class="steps-sub text-gray-500 text-base sm:text-lg font-medium">
          From day one to production deployment. Four structured phases.
        </p>
      </div>

      <div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        <div
          v-for="(step, i) in steps"
          :key="step.title"
          class="step-card bg-white rounded-3xl p-7 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-slate-100 text-center transition-all duration-300 hover:shadow-[0_25px_60px_rgba(37,99,235,0.15)] hover:border-blue-200 hover:-translate-y-2 relative overflow-hidden group"
        >
          <!-- Background glow on hover -->
          <div class="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

          <!-- Step Number -->
          <div class="bg-gradient-to-tr from-blue-600 to-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25 mx-auto text-white">
            <span class="text-lg font-black font-mono">{{ String(i + 1).padStart(2, '0') }}</span>
          </div>
          <h3 class="text-xl font-extrabold text-gray-900 mb-2.5 tracking-tight group-hover:text-blue-600 transition-colors">{{ step.title }}</h3>
          <p class="text-gray-500 text-sm leading-relaxed">{{ step.description }}</p>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- PARTNERS & COLLABORATIONS -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="partnersScope" class="bg-[#F8FAFC] section-tight border-t border-slate-200/60">
      <div class="max-w-7xl mx-auto px-4">
        <p class="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-8 text-center flex items-center justify-center gap-2">
          <i class="fa-solid fa-handshake text-blue-500"></i>
          Proud Collaborations & Ecosystem Alliances
        </p>
        <div class="flex flex-wrap items-center gap-8 sm:gap-14 justify-center opacity-70 partner-logos">
          <img v-for="(logo, i) in logos" :key="i" :src="logo.src" :alt="logo.alt"
               class="h-7 sm:h-9 w-auto object-contain partner-logo filter grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110 cursor-pointer" loading="lazy" />
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
              Be Part of the
              <span class="text-blue-600 relative inline-block ml-1">Movement
                <span class="absolute left-0 -bottom-1 w-full h-[3px] bg-blue-500 rotate-[-2deg] rounded-full"></span>
              </span>
            </h2>
            <p class="text-gray-500 mt-3 text-base sm:text-lg max-w-sm mx-auto leading-relaxed mb-8">
              Join the SkillSprint community and start building production code.
            </p>
            <div class="flex flex-wrap gap-4 justify-center items-center">
              <router-link v-magnetic to="/contact-us">
                <button class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold px-9 py-3.5 rounded-full text-base transition-all duration-200 shadow-lg shadow-blue-500/25 cursor-pointer">
                  Join the Sprint
                </button>
              </router-link>
              <router-link v-magnetic to="/mission">
                <button class="bg-white border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-700 font-semibold px-9 py-3.5 rounded-full text-base transition-all duration-200 cursor-pointer shadow-sm">
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
import { SplitText } from '../motion/gsap'
import TimelineItem from '../components/TimelineItem.vue'

const pageScope = ref(null)
const heroScope = ref(null)
const timelineScope = ref(null)
const stepsScope = ref(null)
const partnersScope = ref(null)
const robotMascot = ref(null)
const ctaRobot = ref(null)

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

useGSAP(({ gsap, ScrollTrigger, selector }) => {
  // Hero animations with SplitText
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

  // Robot floating
  if (robotMascot.value) {
    gsap.to(robotMascot.value, {
      y: '+=12',
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    })
  }

  // Timeline animations
  gsap.from(selector('.timeline-heading'), {
    scrollTrigger: { trigger: timelineScope.value, start: 'top 80%', toggleActions: 'play none none reverse' },
    y: 40, opacity: 0, duration: 0.9, ease: 'power3.out'
  })
  
  const items = selector('.timeline-item-el')
  items.forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none reverse' },
      x: i % 2 === 0 ? -50 : 50, opacity: 0, duration: 0.85, ease: 'power3.out'
    })
  })

  // Step cards staggered reveal
  const stepCards = selector('.step-card')
  if (stepCards.length > 0) {
    gsap.from(stepCards, {
      scrollTrigger: { trigger: stepsScope.value, start: 'top 75%', toggleActions: 'play none none reverse' },
      y: 60, opacity: 0, scale: 0.92, duration: 0.9, stagger: 0.12, ease: 'back.out(1.4)'
    })
  }

  // CTA Robot peek
  if (ctaRobot.value) {
    gsap.from(ctaRobot.value, {
      scrollTrigger: { trigger: '.cta-card', start: 'top 80%', toggleActions: 'play none none reverse' },
      xPercent: 40, yPercent: 40, opacity: 0, duration: 1.2, ease: 'back.out(1.6)'
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
