<template>
  <div class="overflow-x-hidden">

    <!-- ═══════════════════════════════════════ -->
    <!-- FULL-WIDTH HERO (Light) -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="heroScope" class="relative bg-[#F8FAFC] py-20 sm:py-28 md:py-36 px-4 sm:px-6 overflow-hidden text-center">

      <!-- Floating Annotations -->
      <div class="hidden sm:block pointer-events-none select-none" aria-hidden="true">
        <div class="absolute left-4 md:left-[12%] lg:left-[18%] top-[20%] -rotate-6
                    bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" style="font-family: 'Handlee', cursive;">
          🎯 no gatekeeping
        </div>
        <div class="absolute right-4 md:right-[12%] lg:right-[18%] top-[16%] rotate-6
                    bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" style="font-family: 'Handlee', cursive;">
          💡 zero-cost workshops
        </div>
        <div class="absolute left-2 md:left-[8%] lg:left-[14%] top-[44%] rotate-8
                    bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" style="font-family: 'Handlee', cursive;">
          ✊ students-first
        </div>
        <div class="absolute right-2 md:right-[8%] lg:right-[14%] top-[42%] -rotate-4
                    bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" style="font-family: 'Handlee', cursive;">
          🔓 open source everything
        </div>
      </div>

      <div class="relative z-10 max-w-4xl mx-auto">
        <h1 class="hero-heading text-[2.4rem] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6">
          We Believe in<br/>
          <span class="text-blue-600">Learning by Doing.</span>
        </h1>
        <p class="hero-sub text-gray-500 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          SkillSprint exists because the gap between academic computer science and real engineering is massive. We bridge it with open-source collaboration, peer mentorship, and zero-cost workshops — no corporate middlemen, no paywalls, no gatekeeping.
        </p>
        <div class="flex justify-center">
          <span class="inline-block bg-blue-50 text-blue-600 text-xs font-extrabold px-4 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest">
            Our Mission
          </span>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- CORE VALUES (Fanned Cards) -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="valuesScope" class="bg-[#F8FAFC] py-16 sm:py-20 md:py-28 px-4 sm:px-6 overflow-hidden">
      <div class="max-w-3xl mx-auto text-center mb-14 md:mb-20">
        <h2 class="values-heading text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3">
          What We Stand For
        </h2>
        <p class="values-sub text-gray-500 text-base sm:text-lg font-medium">
          Three principles. Non-negotiable.
        </p>
      </div>

      <div class="relative max-w-4xl mx-auto">
        <!-- Mobile -->
        <div class="flex flex-col gap-5 md:hidden w-full">
          <div v-for="card in values" :key="card.label"
               class="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm mx-auto mobile-value-card">
            <div class="bg-blue-600 w-11 h-11 rounded-xl flex items-center justify-center mb-5 shadow-md">
              <span class="text-lg brightness-[6] grayscale contrast-[0.9] sepia-[2]">{{ card.icon }}</span>
            </div>
            <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">{{ card.label }}</p>
            <h3 class="text-lg font-bold text-gray-900 mb-4 leading-snug">{{ card.heading }}</h3>
            <span class="inline-block bg-blue-50 text-blue-600 text-xs font-extrabold px-3 py-1.5 rounded-full border border-blue-100">
              {{ card.tag }}
            </span>
          </div>
        </div>

        <!-- Desktop: fanned -->
        <div class="hidden md:flex justify-center items-end gap-0 h-[380px] relative desktop-values-container">
          <div v-for="card in values" :key="card.label"
               class="absolute bg-white rounded-2xl p-6 shadow-2xl flex flex-col hover:z-30 hover:scale-105 duration-300 desktop-value-card"
               :style="card.desktopStyle">
            <div class="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-lg">
              <span class="text-xl brightness-[6] grayscale contrast-[0.9] sepia-[2]">{{ card.icon }}</span>
            </div>
            <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">{{ card.label }}</p>
            <h3 class="text-xl font-bold text-gray-900 mb-auto leading-snug">{{ card.heading }}</h3>
            <span class="mt-5 inline-block bg-blue-50 text-blue-600 text-sm font-extrabold px-4 py-1.5 rounded-full border border-blue-100 w-fit">
              {{ card.tag }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- THE PROBLEM WE SOLVE (Light Split) -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="problemScope" class="bg-slate-50 py-16 sm:py-20 md:py-28 px-4 sm:px-6 overflow-hidden border-y border-gray-100">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <!-- Left: Text -->
          <div class="flex-1 problem-text">
            <h2 class="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              Students are stuck between <span class="text-blue-600">theory</span> and <span class="text-blue-600">practice.</span>
            </h2>
            <p class="text-gray-500 text-base sm:text-lg leading-relaxed mb-6">
              Universities teach algorithms. Bootcamps sell certificates. Neither gives you the experience of working on a real codebase with a real team under real constraints.
            </p>
            <p class="text-gray-500 text-base sm:text-lg leading-relaxed">
              SkillSprint fills that gap — free, open-source, and built by the same students who need it most.
            </p>
          </div>

          <!-- Right: Quote cards -->
          <div class="flex-1 flex flex-col gap-4 max-w-md problem-cards">
            <div class="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 -rotate-2 hover:rotate-0 transition-transform duration-300">
              <p class="text-gray-600 text-sm leading-relaxed italic mb-3">"I graduated without ever using Git in a team setting."</p>
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">— CS Graduate, 2024</span>
            </div>
            <div class="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 rotate-1 hover:rotate-0 transition-transform duration-300">
              <p class="text-gray-600 text-sm leading-relaxed italic mb-3">"Every bootcamp I found cost more than my tuition."</p>
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">— Engineering Student</span>
            </div>
            <div class="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 -rotate-1 hover:rotate-0 transition-transform duration-300">
              <p class="text-gray-600 text-sm leading-relaxed italic mb-3">"I needed real projects for my portfolio, not homework assignments."</p>
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">— Job Seeker, 2025</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- BIG QUOTE -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="quoteScope" class="bg-[#F8FAFC] py-20 sm:py-28 md:py-36 px-4 sm:px-6 text-center">
      <div class="max-w-4xl mx-auto">
        <blockquote class="big-quote text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.15] tracking-tight" style="font-family: 'Handlee', cursive;">
          "No paywalls.<br/>No secret handshakes."
        </blockquote>
        <p class="text-gray-400 text-sm sm:text-base mt-6 font-medium uppercase tracking-widest">
          — The SkillSprint Promise
        </p>
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
              Join the
              <span class="text-blue-600 relative inline-block ml-1">Movement
                <span class="absolute left-0 -bottom-1 w-full h-[2px] bg-blue-500 rotate-[-2deg]"></span>
              </span>
            </h2>
            <p class="text-gray-500 mt-3 text-sm sm:text-base max-w-sm mx-auto leading-relaxed mb-6">
              Be part of something built by students, for students.
            </p>
            <div class="flex flex-wrap gap-3 sm:gap-4 justify-center items-center">
              <router-link to="/contact-us">
                <button class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold px-8 py-3 rounded-full text-sm transition-all duration-200 shadow-md shadow-blue-200 cursor-pointer">
                  Join the Sprint
                </button>
              </router-link>
              <router-link to="/about">
                <button class="bg-white border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-700 font-semibold px-8 py-3 rounded-full text-sm transition-all duration-200 cursor-pointer">
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

const heroScope = ref(null)
const valuesScope = ref(null)
const problemScope = ref(null)
const quoteScope = ref(null)

const values = [
  { icon: '🔓', label: 'Open & Free', heading: 'No paywalls, no gatekeeping, no hidden costs. Everything we build is accessible to every student.', tag: 'yes, actually free', desktopStyle: 'width:260px; min-height:300px; top:20px; left:50%; z-index:10;' },
  { icon: '⚡', label: 'Student-Led', heading: 'Built by students, for students. No corporate agenda. No institutional bureaucracy.', tag: 'We run this', desktopStyle: 'width:280px; min-height:280px; top:0; left:50%; z-index:20;' },
  { icon: '🚀', label: 'Ship Real Code', heading: 'Not theoretical. Not abstract. Production repositories, real deployments, actual portfolio pieces.', tag: 'Proof of work', desktopStyle: 'width:260px; min-height:270px; top:30px; left:50%; z-index:10;' },
]

// Hero (dark)
useGSAP((self) => {
  const { gsap } = self
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  tl.from('.hero-heading', { y: 120, opacity: 0, duration: 1.8, skewY: 3 })
    .from('.hero-sub', { y: 40, opacity: 0, duration: 1.2 }, '-=1.2')

  const labels = gsap.utils.toArray('.floating-tag')
  labels.forEach((label, i) => {
    gsap.from(label, { scale: 0, opacity: 0, duration: 1, delay: 0.7 + i * 0.12, ease: 'back.out(2)' })
    gsap.to(label, { y: '+=10', x: i % 2 === 0 ? '+=4' : '-=4', rotation: i % 2 === 0 ? '+=2' : '-=2', duration: 2.2 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.2 })
  })
}, heroScope)

// Values (fanned)
useGSAP((self) => {
  const { gsap } = self
  gsap.from('.values-heading', { scrollTrigger: { trigger: valuesScope.value, start: 'top 80%', toggleActions: 'play none none reverse' }, y: 50, opacity: 0, duration: 1, ease: 'power3.out' })
  gsap.from('.values-sub', { scrollTrigger: { trigger: valuesScope.value, start: 'top 77%', toggleActions: 'play none none reverse' }, y: 35, opacity: 0, duration: 1, ease: 'power3.out' })

  const mobileCards = gsap.utils.toArray('.mobile-value-card')
  if (mobileCards.length > 0) {
    gsap.from(mobileCards, { scrollTrigger: { trigger: mobileCards[0], start: 'top 85%', toggleActions: 'play none none reverse' }, y: 60, opacity: 0, scale: 0.92, duration: 0.9, stagger: 0.15, ease: 'power3.out' })
  }

  const desktopCards = gsap.utils.toArray('.desktop-value-card')
  if (desktopCards.length > 0) {
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.desktop-values-container', start: 'top 75%', toggleActions: 'play none none reverse' } })
    gsap.set(desktopCards, { xPercent: (i) => i === 1 ? -50 : 0, x: 0, y: 120, rotation: 0, scale: 0.9, opacity: 0 })
    tl.to(desktopCards, { opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.15, ease: 'back.out(1.4)' })
      .to(desktopCards[0], { x: -430, xPercent: 0, rotation: 5, duration: 0.9, ease: 'power3.out' }, '-=0.6')
      .to(desktopCards[1], { x: 0, xPercent: -50, rotation: -4, duration: 0.9, ease: 'power3.out' }, '-=0.8')
      .to(desktopCards[2], { x: 110, xPercent: 0, rotation: 5, duration: 0.9, ease: 'power3.out' }, '-=0.8')
  }
}, valuesScope)

// Problem section
useGSAP((self) => {
  const { gsap } = self
  gsap.from('.problem-text', { scrollTrigger: { trigger: problemScope.value, start: 'top 80%', toggleActions: 'play none none reverse' }, x: -60, opacity: 0, duration: 1.2, ease: 'power3.out' })
  gsap.from('.problem-cards > div', { scrollTrigger: { trigger: '.problem-cards', start: 'top 80%', toggleActions: 'play none none reverse' }, x: 60, opacity: 0, scale: 0.9, duration: 0.9, stagger: 0.15, ease: 'back.out(1.3)' })
}, problemScope)

// Big quote
useGSAP((self) => {
  const { gsap } = self
  gsap.from('.big-quote', { scrollTrigger: { trigger: quoteScope.value, start: 'top 80%', toggleActions: 'play none none reverse' }, scale: 0.7, opacity: 0, duration: 1.4, ease: 'back.out(1.8)' })
}, quoteScope)
</script>
