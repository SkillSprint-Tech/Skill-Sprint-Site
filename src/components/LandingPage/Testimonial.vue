<template>
  <section ref="scope" class="testimonial-section bg-[#F8FAFC] py-20 sm:py-28 md:py-36 px-4 sm:px-6 overflow-hidden relative">

    <!-- Ambient light orbs -->
    <div class="absolute top-1/3 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true"></div>
    <div class="absolute bottom-10 right-10 w-80 h-80 bg-indigo-400/10 rounded-full blur-[100px] pointer-events-none" aria-hidden="true"></div>

    <!-- Heading -->
    <div class="max-w-3xl mx-auto text-center mb-16 md:mb-24 relative z-10">
      <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-600 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
        <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
        Community Unfiltered
      </div>
      <h2 class="testi-title text-gray-900 text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
        Student <span class="text-blue-600">Receipts</span>
      </h2>
      <p class="testi-sub text-gray-500 text-base sm:text-lg font-medium">
        Students said this. We didn't make it up. Real outcomes from real sprints.
      </p>

      <!-- Arrow decoration (md+) -->
      <img
        ref="arrowImg"
        src="/rightarrow.png"
        alt=""
        aria-hidden="true"
        class="hidden md:block absolute left-[18%] top-[82%] w-24 opacity-80 -rotate-12 pointer-events-none filter drop-shadow-sm"
      />
    </div>

    <!-- Mobile: smooth card list -->
    <div class="flex flex-col gap-5 max-w-sm mx-auto md:hidden w-full px-2 relative z-10">
      <div
        v-for="(t, i) in testimonials"
        :key="i"
        class="mobile-testi bg-white border border-gray-100 shadow-lg p-6 rounded-3xl w-full relative overflow-hidden"
      >
        <div class="text-blue-500/20 text-3xl font-serif mb-2 select-none">“</div>
        <p class="text-gray-700 text-[15px] leading-relaxed mb-6 font-medium">
          {{ t.quote }}
        </p>
        <div class="flex items-center justify-between border-t border-slate-100 pt-4">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm"
              :class="t.avatarClass"
            >
              {{ t.initials }}
            </div>
            <div>
              <span class="block text-sm font-bold text-gray-900">{{ t.name }}</span>
              <span class="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Verified Sprinter</span>
            </div>
          </div>
          <span class="text-amber-400 text-xs flex gap-0.5">
            <i v-for="star in 5" :key="star" class="fa-solid fa-star"></i>
          </span>
        </div>
      </div>
    </div>

    <!-- Tablet/Desktop: organic scattered floating cards with parallax & dynamic reveal -->
    <div
      class="hidden md:block relative max-w-5xl mx-auto h-[600px] lg:h-[540px] z-10"
      data-cursor="Read"
    >
      <div
        v-for="(t, i) in testimonials"
        :key="i"
        class="testi-card absolute bg-white border border-slate-100/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-7 rounded-[2rem]
               transition-[box-shadow,border-color] duration-300 hover:border-blue-200 hover:shadow-[0_25px_60px_rgba(37,99,235,0.15)] cursor-default select-none"
        :style="t.desktopStyle"
        :data-depth="t.depth"
        @pointerenter="(e) => onCardHover(e, true)"
        @pointerleave="(e) => onCardHover(e, false)"
      >
        <div class="flex items-center justify-between mb-4">
          <span class="text-blue-500 text-2xl font-serif leading-none opacity-40">“</span>
          <span class="text-amber-400 text-xs flex gap-0.5">
            <i v-for="star in 5" :key="star" class="fa-solid fa-star"></i>
          </span>
        </div>

        <p class="text-gray-700 text-[14px] leading-relaxed mb-6 font-medium">
          {{ t.quote }}
        </p>

        <div class="flex items-center justify-between pt-4 border-t border-slate-100">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm"
              :class="t.avatarClass"
            >
              {{ t.initials }}
            </div>
            <div>
              <span class="block text-sm font-bold text-gray-900 leading-snug">{{ t.name }}</span>
              <span class="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Verified Sprinter</span>
            </div>
          </div>
          <span class="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px]">
            <i class="fa-solid fa-check"></i>
          </span>
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
const arrowImg = ref(null)

const testimonials = [
  {
    quote: 'This course made consistency feel realistic. Instead of guessing every time, I now follow a process that actually fits my routine.',
    name: 'Bilal P.',
    initials: 'BP',
    avatarClass: 'bg-blue-100 text-blue-600',
    desktopStyle: 'width:290px; top:35px; left:20px; z-index:20;',
    targetRot: -5,
    depth: 1.2,
  },
  {
    quote: 'I finally understand what to post and why it works. Skill Sprint gave me structure without making content feel forced or overwhelming.',
    name: 'Ali R.',
    initials: 'AR',
    avatarClass: 'bg-indigo-100 text-indigo-600',
    desktopStyle: 'width:320px; top:10px; left:330px; z-index:30;',
    targetRot: 2,
    depth: 0.8,
  },
  {
    quote: 'They helped me stop overthinking content and start posting with confidence. Everything feels simpler and easier to stick with.',
    name: 'Sana K.',
    initials: 'SK',
    avatarClass: 'bg-pink-100 text-pink-600',
    desktopStyle: 'width:290px; top:30px; right:20px; z-index:20;',
    targetRot: 6,
    depth: 1.4,
  },
  {
    quote: 'Skill Sprint gave me clarity. I don\'t waste time guessing what to post anymore, and that alone made a huge difference for me.',
    name: 'Laiba M.',
    initials: 'LM',
    avatarClass: 'bg-emerald-100 text-emerald-600',
    desktopStyle: 'width:300px; bottom:25px; left:80px; z-index:15;',
    targetRot: -3,
    depth: 1.0,
  },
  {
    quote: 'The biggest change for me was confidence. I know what I\'m doing now, and my content reflects that in a much more consistent way.',
    name: 'Eman T.',
    initials: 'ET',
    avatarClass: 'bg-orange-100 text-orange-600',
    desktopStyle: 'width:300px; bottom:25px; right:80px; z-index:15;',
    targetRot: 3,
    depth: 1.5,
  },
]

const onCardHover = (e, isHovered) => {
  const card = e.currentTarget
  if (isHovered) {
    card.style.zIndex = '50'
  } else {
    setTimeout(() => {
      card.style.zIndex = ''
    }, 200)
  }
}

useGSAP(({ gsap, ScrollTrigger, selector }) => {
  // 1. Heading SplitText reveal
  const titleSplit = SplitText.create(selector('.testi-title'), { type: 'words,chars', wordsClass: 'tw' })
  gsap.from(titleSplit.chars, {
    scrollTrigger: {
      trigger: scope.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    y: 45,
    opacity: 0,
    rotateX: -45,
    stagger: 0.02,
    duration: 0.9,
    ease: 'power3.out',
  })

  gsap.from(selector('.testi-sub'), {
    scrollTrigger: {
      trigger: scope.value,
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
    y: 25,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
  })

  // 2. Arrow bounce in
  if (arrowImg.value) {
    gsap.from(arrowImg.value, {
      scrollTrigger: {
        trigger: arrowImg.value,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      scale: 0,
      opacity: 0,
      rotation: -60,
      duration: 1,
      ease: 'elastic.out(1, 0.4)',
    })
  }

  // 3. Desktop Cards Reveal & Floating Organic Placement
  const desktopCards = selector('.testi-card')
  if (desktopCards.length > 0) {
    desktopCards.forEach((card, i) => {
      const targetRot = testimonials[i]?.targetRot || 0

      gsap.fromTo(card,
        {
          opacity: 0,
          scale: 0.7,
          y: 120,
          rotation: targetRot * 3,
        },
        {
          scrollTrigger: {
            trigger: scope.value,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
          opacity: 1,
          scale: 1,
          y: 0,
          rotation: targetRot,
          duration: 1.2,
          delay: i * 0.1,
          ease: 'power3.out',
        }
      )

      // Continuous subtle levitation
      gsap.to(card, {
        y: '+=8',
        rotation: `${targetRot + (i % 2 === 0 ? 1.5 : -1.5)}`,
        duration: 3 + i * 0.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: i * 0.2,
      })
    })

    // Mouse parallax depth on cards
    if (hasFinePointer()) {
      const cardMovers = desktopCards.map((el) => ({
        depth: parseFloat(el.dataset.depth) || 1,
        x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3.out' }),
      }))

      const onPointer = (e) => {
        const r = scope.value.getBoundingClientRect()
        const nx = (e.clientX - r.left) / r.width - 0.5
        const ny = (e.clientY - r.top) / r.height - 0.5
        cardMovers.forEach((m) => {
          m.x(nx * 30 * m.depth)
          m.y(ny * 20 * m.depth)
        })
      }
      scope.value.addEventListener('pointermove', onPointer)
      return () => {
        scope.value?.removeEventListener('pointermove', onPointer)
      }
    }
  }

  // 4. Mobile Testimonials Cascade
  const mobileCards = selector('.mobile-testi')
  if (mobileCards.length > 0) {
    gsap.from(mobileCards, {
      scrollTrigger: {
        trigger: mobileCards[0],
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      y: 50,
      opacity: 0,
      scale: 0.94,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
    })
  }
}, scope)
</script>

<style scoped>
.testi-card {
  will-change: transform;
}

.testi-title :deep(.tw) {
  display: inline-block;
  overflow: clip;
}
</style>