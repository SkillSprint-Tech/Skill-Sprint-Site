<template>
  <section ref="heroScope" class="relative bg-[#F8FAFC] pt-10 sm:pt-14 md:pt-20 pb-10 md:pb-16 text-center px-4 overflow-hidden">

    <!-- Floating Annotation Tags (hidden on mobile, show from sm) -->
    <div class="hidden sm:block pointer-events-none select-none" aria-hidden="true">
      <!-- Left top -->
      <div class="absolute left-4 md:left-[8%] lg:left-[14%] top-[14%] -rotate-6
                  bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                  text-[11px] font-medium tracking-wide text-gray-600" style="font-family: 'Handlee', cursive;">
        ⏳ portfolio loading…
      </div>
      <!-- Right top -->
      <div class="absolute right-4 md:right-[8%] lg:right-[14%] top-[10%] rotate-6
                  bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                  text-[11px] font-medium tracking-wide text-gray-600" style="font-family: 'Handlee', cursive;">
        🧠 real projects, real panic
      </div>
      <!-- Left bottom -->
      <div class="absolute left-2 md:left-[6%] lg:left-[11%] top-[26%] rotate-12
                  bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                  text-[11px] font-medium tracking-wide text-gray-600" style="font-family: 'Handlee', cursive;">
        💪🏼 flex but deserved
      </div>
      <!-- Right bottom -->
      <div class="absolute right-2 md:right-[6%] lg:right-[11%] top-[28%] -rotate-9
                  bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                  text-[11px] font-medium tracking-wide text-gray-600" style="font-family: 'Handlee', cursive;">
        🔖 better than doomscrolling
      </div>
    </div>

    <!-- Heading -->
    <div class="relative z-10">
      <h1 class="text-[2.4rem] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-4">
        Learn by doing<br />
        <span class="text-blue-600">Build by collaborating</span>
      </h1>

      <!-- Subtext -->
      <p class="max-w-xs sm:max-w-sm md:max-w-2xl mx-auto text-gray-500 text-sm sm:text-base md:text-lg mb-8 leading-relaxed px-2">
        A student-driven community where learners connect, collaborate on projects, and grow together.
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-row items-center justify-center gap-3 mb-10 md:mb-14">
        <router-link to="/contact-us">
          <button class="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-blue-600 text-white text-sm sm:text-base font-semibold hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-blue-200 cursor-pointer">
            Join the Sprint
          </button>
        </router-link>
        <router-link to="/contact-us">
          <button class="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-white border border-gray-300 text-gray-700 text-sm sm:text-base font-semibold hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
            Contact us
          </button>
        </router-link>
      </div>
    </div>

    <!-- Image Cards Row -->
    <div class="relative z-10 w-full overflow-x-auto pb-3 -mx-4 px-4" style="-webkit-overflow-scrolling: touch; scrollbar-width: none;">
      <div class="flex gap-3 sm:gap-4 md:justify-center md:flex-wrap w-max md:w-full mx-auto flex-wrap">
        <div
          v-for="(img, i) in images"
          :key="i"
          class="flex-shrink-0 w-[100px] sm:w-[130px] md:w-[200px] h-[80px] sm:h-[100px] md:h-[160px]
                 rounded-2xl md:rounded-3xl overflow-hidden bg-gray-200 border-2 border-white
                 shadow-lg transition-transform duration-300 hover:scale-[1.05]"
          :class=" [
            i === 0 ? 'md:rotate-2 md:translate-y-3' : '',
            i === 1 ? 'md:-rotate-2' : '',
            i === 2 ? 'md:rotate-3 md:translate-y-4' : '',
            i === 3 ? 'md:-rotate-1' : '',
          ]"
        >
          <img :src="img.src" :alt="img.alt" class="w-full h-full object-cover" loading="lazy" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useGSAP } from '../../composables/useGSAP'

const heroScope = ref(null)

const images = [
  { src: '/Speaker.jpg.jpeg', alt: 'Speaker at Skill Sprint event' },
  { src: '/Short Group.jpg.jpeg', alt: 'Group of Skill Sprint students' },
  { src: '/Long Group.jpg.jpeg', alt: 'Large Skill Sprint community group' },
  { src: '/Crowd.JPG.jpeg', alt: 'Skill Sprint event crowd' },
]

useGSAP((self) => {
  const { gsap } = self

  // 1. Initial timeline for main content elements
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

  tl.from('h1', {
    y: 80,
    opacity: 0,
    duration: 1.4,
    skewY: 2,
    stagger: 0.15
  })
  .from('p', {
    y: 30,
    opacity: 0,
    duration: 1.1
  }, '-=1.0')
  .from('.flex-row a', {
    scale: 0.85,
    opacity: 0,
    duration: 0.9,
    stagger: 0.1,
    ease: 'back.out(1.8)'
  }, '-=0.8')
  .from('.flex-shrink-0', {
    y: 120,
    rotation: (i) => [15, -15, 20, -10][i] || 0,
    opacity: 0,
    duration: 1.2,
    stagger: 0.12,
    ease: 'back.out(1.3)'
  }, '-=0.7')

  // 2. Animate floating labels
  const labels = gsap.utils.toArray('.pointer-events-none > div')
  labels.forEach((label, i) => {
    // Initial reveal
    gsap.from(label, {
      scale: 0,
      opacity: 0,
      duration: 1,
      delay: 0.7 + i * 0.12,
      ease: 'back.out(2)'
    })

    // Infinite floating/wiggle animation
    gsap.to(label, {
      y: '+=10',
      x: i % 2 === 0 ? '+=4' : '-=4',
      rotation: i % 2 === 0 ? '+=2' : '-=2',
      duration: 2.2 + i * 0.4,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      delay: i * 0.2
    })
  })
}, heroScope)
</script>

<style scoped>
/* Hide scrollbar for image row */
div::-webkit-scrollbar {
  display: none;
}
</style>