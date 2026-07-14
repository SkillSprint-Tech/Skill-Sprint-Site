<template>
  <section ref="sectionRef" class="bg-[#0B101B] py-16 sm:py-20 md:py-28 px-4 sm:px-6 overflow-hidden">

    <!-- Heading -->
    <div class="max-w-3xl mx-auto text-center mb-14 md:mb-20">
      <h2 class="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3">
        Why Skill Sprint Exists?
      </h2>
      <p class="text-gray-400 text-base sm:text-lg font-medium">
        Students said this. We didn't make it up.
      </p>
    </div>

    <!-- Cards – fanned on desktop, stacked on mobile -->
    <div class="relative max-w-4xl mx-auto">

      <!-- Mobile: simple vertical stack -->
      <div class="flex flex-col gap-5 md:hidden w-full break-words whitespace-normal">
        <div
          v-for="card in cards"
          :key="card.label"
          class="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm mx-auto mobile-card"
        >
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

      <!-- Desktop: fanned/overlapping layout -->
      <div class="hidden md:flex justify-center items-end gap-0 h-[380px] relative desktop-container">
        <div
          v-for="card in cards"
          :key="card.label"
          class="absolute bg-white rounded-2xl p-6 shadow-2xl flex flex-col hover:z-30 hover:scale-105 duration-300 desktop-card"
          :style="card.desktopStyle"
        >
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
</template>

<script setup>
import { ref } from 'vue'
import { useGSAP } from '../../composables/useGSAP'

const sectionRef = ref(null)

const cards = [
  {
    icon: '👥',
    label: 'Community-driven learning',
    heading: 'You learn with people who are also confused but motivated.',
    tag: 'No solo grind',
    desktopStyle: 'width:260px; min-height:300px; top:20px; left:50%; z-index:10;',
  },
  {
    icon: '🧩',
    label: 'Multi-disciplinary sprints',
    heading: 'Tech. Marketing. Business. Design.',
    tag: 'Mix skills, make magic',
    desktopStyle: 'width:280px; min-height:280px; top:0; left:50%; z-index:20;',
  },
  {
    icon: '🤝',
    label: 'Free & Open',
    heading: 'No paywalls. No secret handshakes.',
    tag: 'yes, actually free',
    desktopStyle: 'width:260px; min-height:270px; top:30px; left:50%; z-index:10;',
  },
]

useGSAP((self) => {
  const { gsap } = self

  // Header ScrollTrigger
  gsap.from('.max-w-3xl h2', {
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  })

  gsap.from('.max-w-3xl p', {
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 77%',
      toggleActions: 'play none none reverse'
    },
    y: 35,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  })

  // Desktop Fanned Cards Animation on Scroll
  const desktopCards = gsap.utils.toArray('.desktop-card')
  if (desktopCards.length > 0) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.desktop-container',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    })

    // Set initial stacked and hidden state in the center
    gsap.set(desktopCards, {
      xPercent: (i) => i === 1 ? -50 : 0,
      x: 0,
      y: 120,
      rotation: 0,
      scale: 0.9,
      opacity: 0
    })

    // Animate them fanning out
    tl.to(desktopCards, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      stagger: 0.15,
      ease: 'back.out(1.4)'
    })
    .to(desktopCards[0], {
      x: -430,
      xPercent: 0,
      rotation: 5,
      duration: 0.9,
      ease: 'power3.out'
    }, '-=0.6')
    .to(desktopCards[1], {
      x: 0,
      xPercent: -50,
      rotation: -4,
      duration: 0.9,
      ease: 'power3.out'
    }, '-=0.8')
    .to(desktopCards[2], {
      x: 110,
      xPercent: 0,
      rotation: 5,
      duration: 0.9,
      ease: 'power3.out'
    }, '-=0.8')
  }

  // Mobile Cards Animations
  const mobileCards = gsap.utils.toArray('.mobile-card')
  if (mobileCards.length > 0) {
    gsap.from(mobileCards, {
      scrollTrigger: {
        trigger: '.flex-col.md\\:hidden',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 60,
      opacity: 0,
      scale: 0.92,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out'
    })
  }
}, sectionRef)
</script>