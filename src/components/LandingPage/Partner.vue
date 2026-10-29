<template>
  <!-- Partner CTA — Apple / k72 style mesh gradient + playful mascot peek -->
  <section ref="scope" class="relative w-full bg-gradient-to-b from-[#F8FAFC] via-[#dceeff] to-[#b8d4f0] py-20 sm:py-28 overflow-hidden">

    <!-- Iridescent mesh gradient orbs -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div class="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[350px] bg-blue-400/25 rounded-full blur-[100px] animate-pulse"></div>
      <div class="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-indigo-300/30 rounded-full blur-[80px]"></div>
    </div>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">

      <!-- Glassmorphic Elevated Card -->
      <div
        ref="cardRef"
        class="partner-card relative bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_25px_70px_rgba(37,99,235,0.12)] border border-white/80 px-6 sm:px-12 py-14 sm:py-20 text-center overflow-hidden"
      >
        <!-- Robot mascot peek — animated with GSAP spring -->
        <div class="absolute right-0 bottom-0 pointer-events-none select-none z-0" aria-hidden="true">
          <img
            ref="robotRef"
            src="/sidelogo.png"
            alt=""
            class="robot-peek w-36 sm:w-56 md:w-72 h-auto object-contain opacity-95 transition-transform duration-300 filter drop-shadow-xl"
            style="transform: rotate(-15deg) translate(25%, 20%);"
          />
        </div>

        <!-- Content -->
        <div class="relative z-10 max-w-2xl mx-auto">
          <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-600 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-5">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Join The Ecosystem
          </div>

          <h2 class="partner-title text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.15] tracking-tight mb-4">
            Partner with
            <span class="text-blue-600 relative inline-block ml-1">
              Skill Sprint
              <span class="absolute left-0 -bottom-1 w-full h-[3px] bg-blue-500 rotate-[-2deg] rounded-full"></span>
              <span class="absolute left-0 -bottom-[6px] w-[85%] h-[2px] bg-blue-400 rotate-[-2deg] rounded-full"></span>
            </span>
          </h2>

          <p class="partner-sub text-gray-500 mt-4 text-base sm:text-lg max-w-md mx-auto leading-relaxed font-medium">
            Collaborate with us to empower the next generation of engineers, designers, and systems architects.
          </p>

          <div class="flex flex-wrap gap-4 justify-center items-center mt-8 sm:mt-10">
            <router-link v-magnetic to="/contact-us" class="w-full sm:w-auto">
              <button
                class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold
                       px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-base transition-all duration-200 shadow-lg shadow-blue-500/25 cursor-pointer"
                aria-label="Join the Sprint"
              >
                Join the Sprint
              </button>
            </router-link>
            <router-link v-magnetic to="/contact-us" class="w-full sm:w-auto">
              <button
                class="w-full sm:w-auto bg-white border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600
                       text-gray-700 font-semibold px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-base transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                aria-label="Contact us"
              >
                Contact us
              </button>
            </router-link>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useGSAP } from '../../composables/useGSAP'
import { SplitText } from '../../motion/gsap'
import { hasFinePointer } from '../../motion/intro'

const scope = ref(null)
const cardRef = ref(null)
const robotRef = ref(null)

useGSAP(({ gsap, ScrollTrigger, selector }) => {
  // 1. Reveal Card with soft lift
  gsap.from(cardRef.value, {
    scrollTrigger: {
      trigger: scope.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    y: 80,
    opacity: 0,
    scale: 0.95,
    duration: 1.1,
    ease: 'power3.out',
  })

  // 2. Heading SplitText reveal
  const titleSplit = SplitText.create(selector('.partner-title'), { type: 'words,chars', wordsClass: 'pw' })
  gsap.from(titleSplit.chars, {
    scrollTrigger: {
      trigger: scope.value,
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
    y: 35,
    opacity: 0,
    rotateX: -45,
    stagger: 0.02,
    duration: 0.85,
    ease: 'power3.out',
  })

  // 3. Robot mascot peek spring animation
  if (robotRef.value) {
    gsap.from(robotRef.value, {
      scrollTrigger: {
        trigger: cardRef.value,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
      xPercent: 50,
      yPercent: 50,
      opacity: 0,
      duration: 1.4,
      ease: 'back.out(1.8)',
    })

    // Mouse parallax for robot peek
    if (hasFinePointer()) {
      const xTo = gsap.quickTo(robotRef.value, 'x', { duration: 1, ease: 'power3.out' })
      const yTo = gsap.quickTo(robotRef.value, 'y', { duration: 1, ease: 'power3.out' })

      const onPointer = (e) => {
        const rect = scope.value.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        xTo(x * -35)
        yTo(y * -25)
      }

      scope.value.addEventListener('pointermove', onPointer)
      return () => {
        scope.value?.removeEventListener('pointermove', onPointer)
      }
    }
  }
}, scope)
</script>

<style scoped>
.partner-title :deep(.pw) {
  display: inline-block;
  overflow: clip;
}
</style>