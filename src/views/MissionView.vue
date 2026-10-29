<template>
  <div ref="pageScope" class="overflow-x-hidden">

    <!-- ═══════════════════════════════════════ -->
    <!-- FULL-WIDTH HERO SECTION -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="heroScope" class="relative bg-[#F8FAFC] pt-12 sm:pt-16 md:pt-24 pb-14 md:pb-20 text-center overflow-hidden">
      <!-- Ambient light & blueprint grid -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div class="absolute inset-0 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.14]"></div>
        <div class="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-blue-500/15 blur-[140px] rounded-full"></div>
        <div class="absolute -right-20 top-1/3 w-[450px] h-[450px] bg-indigo-500/12 blur-[130px] rounded-full"></div>
      </div>

      <!-- Floating Annotations -->
      <div class="hidden sm:block pointer-events-none select-none" aria-hidden="true">
        <div class="absolute left-4 md:left-[12%] lg:left-[17%] top-[18%] -rotate-6
                    bg-white/90 backdrop-blur-md shadow-lg shadow-blue-900/5 px-3.5 py-1.5 rounded-full border border-blue-100/80
                    text-[12px] font-bold tracking-wide text-gray-700 floating-tag" style="font-family: 'Handlee', cursive;">
          🎯 no gatekeeping
        </div>
        <div class="absolute right-4 md:right-[12%] lg:right-[17%] top-[14%] rotate-6
                    bg-white/90 backdrop-blur-md shadow-lg shadow-blue-900/5 px-3.5 py-1.5 rounded-full border border-blue-100/80
                    text-[12px] font-bold tracking-wide text-gray-700 floating-tag" style="font-family: 'Handlee', cursive;">
          💡 zero-cost workshops
        </div>
        <div class="absolute left-2 md:left-[8%] lg:left-[13%] top-[40%] rotate-8
                    bg-white/90 backdrop-blur-md shadow-lg shadow-blue-900/5 px-3.5 py-1.5 rounded-full border border-blue-100/80
                    text-[12px] font-bold tracking-wide text-gray-700 floating-tag" style="font-family: 'Handlee', cursive;">
          ✊ students-first
        </div>
        <div class="absolute right-2 md:right-[8%] lg:right-[13%] top-[38%] -rotate-4
                    bg-white/90 backdrop-blur-md shadow-lg shadow-blue-900/5 px-3.5 py-1.5 rounded-full border border-blue-100/80
                    text-[12px] font-bold tracking-wide text-gray-700 floating-tag" style="font-family: 'Handlee', cursive;">
          🔓 open source everything
        </div>
      </div>

      <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        <div class="flex justify-center mb-6">
          <span class="inline-flex items-center gap-2 bg-blue-50/90 text-blue-600 text-xs font-mono font-extrabold px-4 py-1.5 rounded-full border border-blue-200/60 uppercase tracking-widest shadow-sm">
            <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Our Ethos
          </span>
        </div>

        <h1 class="hero-heading h-display text-gray-900 leading-[1.08] mb-5">
          We Believe in<br/>
          <span class="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">Learning by Doing.</span>
        </h1>

        <p class="hero-sub text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
          SkillSprint exists because the gap between academic computer science and real engineering is massive. We bridge it with open-source collaboration, peer mentorship, and zero-cost workshops — no corporate middlemen, no paywalls, no gatekeeping.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-4">
          <router-link to="/contact-us" v-magnetic>
            <button class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-8 py-3.5 rounded-full text-sm transition-all duration-300 shadow-lg shadow-blue-600/25">
              Join the Movement
            </button>
          </router-link>
          <router-link to="/about" v-magnetic>
            <button class="bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-700 font-bold px-7 py-3 rounded-full text-sm transition-all duration-300 shadow-sm">
              Read Our Story
            </button>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- KINETIC VELOCITY MARQUEE -->
    <!-- ═══════════════════════════════════════ -->
    <div ref="marqueeScope" class="kinetic-marquee-container py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-mono text-xs sm:text-sm font-black uppercase tracking-widest overflow-hidden shadow-lg select-none">
      <div class="marquee-track flex whitespace-nowrap gap-10">
        <span v-for="n in 6" :key="n" class="flex items-center gap-8">
          <span>ZERO GATEKEEPING</span>
          <span class="text-blue-300">✦</span>
          <span>ZERO EDTECH</span>
          <span class="text-blue-300">✦</span>
          <span>100% OPEN SOURCE</span>
          <span class="text-blue-300">✦</span>
          <span>STUDENTS FIRST</span>
          <span class="text-blue-300">✦</span>
          <span>PRODUCTION CODE</span>
          <span class="text-blue-300">✦</span>
        </span>
      </div>
    </div>

    <!-- ═══════════════════════════════════════ -->
    <!-- CORE VALUES (Fanned 3D Cards) -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="valuesScope" class="bg-[#F8FAFC] section overflow-hidden relative">
      <div class="max-w-3xl mx-auto text-center mb-14 md:mb-20 px-4">
        <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-600 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-3">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          Foundations
        </div>
        <h2 class="values-heading text-gray-900 h-section mb-3">
          What We Stand For
        </h2>
        <p class="values-sub text-gray-500 text-base sm:text-lg font-medium">
          Three non-negotiable principles guiding every decision we make.
        </p>
      </div>

      <div class="relative max-w-5xl mx-auto px-4">
        <!-- Mobile -->
        <div class="flex flex-col gap-5 md:hidden w-full">
          <div v-for="card in values" :key="card.label"
               class="bg-white/95 backdrop-blur-sm rounded-3xl p-7 shadow-xl border border-slate-100 w-full max-w-sm mx-auto mobile-value-card">
            <div class="bg-gradient-to-tr from-blue-600 to-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-500/20 text-white text-xl">
              <span>{{ card.icon }}</span>
            </div>
            <p class="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-2">{{ card.label }}</p>
            <h3 class="text-lg font-bold text-gray-900 mb-4 leading-snug">{{ card.heading }}</h3>
            <span class="inline-block bg-blue-50 text-blue-600 text-xs font-mono font-extrabold px-3 py-1.5 rounded-full border border-blue-150">
              #{{ card.tag }}
            </span>
          </div>
        </div>

        <!-- Desktop: fanned 3D cards -->
        <div class="hidden md:flex justify-center items-end gap-0 h-[420px] relative desktop-values-container">
          <div v-for="card in values" :key="card.label"
               class="absolute bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-150/80 flex flex-col hover:z-30 hover:scale-[1.04] hover:shadow-[0_25px_60px_rgba(37,99,235,0.18)] hover:border-blue-300 transition-all duration-300 desktop-value-card cursor-default"
               :style="card.desktopStyle">
            <div class="bg-gradient-to-tr from-blue-600 to-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25 text-white text-2xl">
              <span>{{ card.icon }}</span>
            </div>
            <p class="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-2">{{ card.label }}</p>
            <h3 class="text-xl font-black text-gray-900 mb-auto leading-snug tracking-tight">{{ card.heading }}</h3>
            <span class="mt-6 inline-block bg-blue-50 text-blue-600 text-xs font-mono font-extrabold px-3.5 py-1.5 rounded-full border border-blue-150 w-fit">
              #{{ card.tag }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- THE PROBLEM WE SOLVE (Light Split) -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="problemScope" class="bg-slate-50 section overflow-hidden border-y border-gray-100 relative">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <!-- Left: Text -->
          <div class="flex-1 problem-text">
            <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-600 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              The Disconnect
            </div>
            <h2 class="text-gray-900 h-section mb-6 leading-tight">
              Students are stuck between <span class="text-blue-600">theory</span> and <span class="text-blue-600">practice.</span>
            </h2>
            <p class="text-gray-600 text-base sm:text-lg leading-relaxed mb-6 font-normal">
              Universities teach algorithms on paper. Bootcamps sell overpriced certificates. Neither provides the authentic environment of maintaining a live codebase with peer reviews under real constraints.
            </p>
            <p class="text-gray-600 text-base sm:text-lg leading-relaxed font-normal">
              SkillSprint bridges that divide — completely free, open-source, and engineered by the very students who need it most.
            </p>
          </div>

          <!-- Right: Quote cards with 3D hover -->
          <div class="flex-1 flex flex-col gap-4 max-w-md problem-cards">
            <div class="bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-100 -rotate-2 hover:rotate-0 transition-transform duration-300 hover:shadow-xl">
              <p class="text-gray-700 text-sm sm:text-base leading-relaxed italic mb-3">"I graduated without ever using Git in a team setting or seeing a real CI/CD pipeline."</p>
              <span class="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">— CS Graduate, FAST-NUCES</span>
            </div>
            <div class="bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-100 rotate-1 hover:rotate-0 transition-transform duration-300 hover:shadow-xl">
              <p class="text-gray-700 text-sm sm:text-base leading-relaxed italic mb-3">"Every bootcamp I found cost more than a semester of university tuition."</p>
              <span class="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">— Sophomore Builder, COMSATS</span>
            </div>
            <div class="bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-100 -rotate-1 hover:rotate-0 transition-transform duration-300 hover:shadow-xl">
              <p class="text-gray-700 text-sm sm:text-base leading-relaxed italic mb-3">"I needed real collaborative production commits for my portfolio, not tutorial clones."</p>
              <span class="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">— Software Engineering Senior, ITU</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- BIG QUOTE (Scale Scrub) -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="quoteScope" class="bg-[#0B101B] section text-center relative overflow-hidden text-white">
      <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[160px] rounded-full"></div>
      </div>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <blockquote class="big-quote text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.12] tracking-tight mb-8">
          "No paywalls.<br/>
          <span class="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-300 bg-clip-text text-transparent">No secret handshakes."</span>
        </blockquote>
        <div class="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-gray-400 uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-2 rounded-full">
          <span>— The SkillSprint Promise</span>
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
              Get Started
            </span>
            <h2 class="h-sub text-gray-900 leading-snug mb-4">
              Join the
              <span class="text-blue-600 relative inline-block ml-1">Movement
                <span class="absolute left-0 -bottom-1 w-full h-[3px] bg-blue-500 rotate-[-2deg]"></span>
              </span>
            </h2>
            <p class="text-gray-600 text-sm sm:text-base md:text-lg max-w-md mx-auto leading-relaxed mb-8">
              Be part of an open-source technical collective built by students, for students.
            </p>
            <div class="flex flex-wrap gap-4 justify-center items-center">
              <router-link to="/contact-us" v-magnetic>
                <button class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-8 py-3.5 rounded-full text-sm transition-all duration-200 shadow-lg shadow-blue-500/25">
                  Join the Sprint
                </button>
              </router-link>
              <router-link to="/about" v-magnetic>
                <button class="bg-white border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-700 font-bold px-8 py-3.5 rounded-full text-sm transition-all duration-200">
                  About Us
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

const pageScope = ref(null)
const heroScope = ref(null)
const marqueeScope = ref(null)
const valuesScope = ref(null)
const problemScope = ref(null)
const quoteScope = ref(null)
const ctaMascot = ref(null)

const values = [
  { icon: '🔓', label: 'Open & Free', heading: 'No paywalls, no gatekeeping, no hidden costs. Everything we build is accessible to every student.', tag: 'yes, actually free', desktopStyle: 'width:290px; min-height:320px; top:20px; left:50%; z-index:10;' },
  { icon: '⚡', label: 'Student-Led', heading: 'Built by students, for students. No corporate agenda. No institutional bureaucracy.', tag: 'we run this', desktopStyle: 'width:310px; min-height:300px; top:0; left:50%; z-index:20;' },
  { icon: '🚀', label: 'Ship Real Code', heading: 'Not theoretical. Not abstract. Production repositories, real deployments, actual portfolio pieces.', tag: 'proof of work', desktopStyle: 'width:290px; min-height:290px; top:30px; left:50%; z-index:10;' },
]

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

  // 3. Values Fanned Deck Reveal
  const desktopCards = selector('.desktop-value-card')
  if (desktopCards.length > 0) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.desktop-values-container',
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

  // 4. Problem Split Section Reveal
  gsap.from(selector('.problem-text'), {
    scrollTrigger: { trigger: problemScope.value, start: 'top 78%', toggleActions: 'play none none reverse' },
    x: -50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  })

  const problemCards = selector('.problem-cards > div')
  if (problemCards.length > 0) {
    gsap.from(problemCards, {
      scrollTrigger: { trigger: '.problem-cards', start: 'top 80%', toggleActions: 'play none none reverse' },
      x: 50,
      opacity: 0,
      scale: 0.92,
      duration: 0.9,
      stagger: 0.12,
      ease: 'back.out(1.4)'
    })
  }

  // 5. Big Quote Scale & Glow Reveal
  gsap.from(selector('.big-quote'), {
    scrollTrigger: { trigger: quoteScope.value, start: 'top 75%', toggleActions: 'play none none reverse' },
    scale: 0.85,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out'
  })

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
