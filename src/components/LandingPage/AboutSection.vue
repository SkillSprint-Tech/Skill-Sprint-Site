<template>
  <section ref="scope" class="w-full bg-[#F8FAFC] py-16 sm:py-24 md:py-32 overflow-hidden relative">
    <!-- Ambient background glow -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-400/10 blur-[120px] rounded-full pointer-events-none" aria-hidden="true"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">

      <!-- Apple-style Card with dynamic border sheen and soft elevation -->
      <div
        ref="cardRef"
        class="about-card bg-white rounded-3xl md:rounded-[2.5rem] shadow-[0_20px_70px_rgba(37,99,235,0.08)] border border-slate-100 overflow-hidden transition-all duration-300"
        @pointermove="onPointerMove"
        @pointerleave="onPointerLeave"
      >
        <div class="flex flex-col md:flex-row">

          <!-- Robot Image Block: 3D stage with glowing cyber orb & floating mascot -->
          <div class="robot-stage relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 flex items-center justify-center p-8 md:p-12 md:w-[320px] lg:w-[380px] flex-shrink-0 overflow-hidden">
            <!-- Cybernetic rings & orbs -->
            <div class="robot-ring absolute w-48 h-48 border border-white/20 rounded-full animate-spin-slow pointer-events-none"></div>
            <div class="robot-ring-inner absolute w-32 h-32 border border-white/30 rounded-full pointer-events-none"></div>
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25)_0%,transparent_70%)] pointer-events-none"></div>

            <img
              ref="robotImg"
              src="/logo.png"
              alt="Skill Sprint Robot Mascot"
              class="robot-mascot relative z-10 w-40 sm:w-48 md:w-56 h-auto object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)]"
            />

            <!-- Tech status badge -->
            <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-blue-200/80 bg-blue-950/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <span class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                SYSTEM ACTIVE
              </span>
              <span>VER 3.0</span>
            </div>
          </div>

          <!-- Text Block -->
          <div class="flex-1 p-6 sm:p-10 md:p-12 flex flex-col justify-between relative">
            <div>
              <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-600 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
                <span class="w-2 h-2 rounded-full bg-blue-600"></span>
                The Skill Sprint Manifesto
              </div>

              <h2 class="about-title text-2xl sm:text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-[1.15] tracking-tight">
                So… What's <span class="text-blue-600">Skill Sprint</span>?
              </h2>

              <p class="about-desc text-gray-600 text-base sm:text-lg leading-relaxed mb-6 font-normal">
                Skill Sprint is a
                <span
                  class="text-blue-600 font-extrabold border-b-2 border-blue-500 px-1 inline-block"
                  style="font-family: 'Handlee', cursive;"
                >STUDENT-POWERED</span>
                community that brings ambitious learners together to master cutting-edge skills, collaborate on high-tempo sprints,
                and ship production-grade software. Here, theoretical learning gives way to relentless execution in a hyper-collaborative environment.
              </p>

              <!-- Arrow decoration -->
              <div class="hidden md:flex justify-end mb-2 pr-6">
                <img
                  ref="arrowRef"
                  src="/arrow.png"
                  alt=""
                  aria-hidden="true"
                  class="w-16 opacity-75 -rotate-12 transition-transform duration-300 hover:rotate-0"
                />
              </div>
            </div>

            <!-- Brand Logos / Proud Collaborations with smooth continuous ticker -->
            <div class="border-t border-gray-100 pt-6 mt-4">
              <p class="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-4 text-center md:text-left flex items-center gap-2 justify-center md:justify-start">
                <i class="fa-solid fa-handshake text-blue-500"></i>
                Proud Collaborations & Ecosystem Partners
              </p>

              <div class="overflow-hidden w-full relative">
                <!-- Left/right gradient masks -->
                <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                <div class="logo-track flex items-center gap-8 sm:gap-12 w-max py-2">
                  <div
                    v-for="(logo, i) in [...logos, ...logos]"
                    :key="i"
                    class="logo-item flex-shrink-0 transition-all duration-300 hover:scale-110 grayscale hover:grayscale-0 opacity-70 hover:opacity-100"
                  >
                    <img :src="logo.src" :alt="logo.alt" class="h-6 sm:h-8 w-auto object-contain max-w-[120px]" loading="lazy" />
                  </div>
                </div>
              </div>
            </div>
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
const robotImg = ref(null)
const arrowRef = ref(null)

const logos = [
  { src: '/FoF Lhr.png', alt: 'FoF Lahore' },
  { src: '/IxDF.png', alt: 'Interaction Design Foundation' },
  { src: '/GDG Cloud Lhr.jpg.jpeg', alt: 'GDG Cloud Lahore' },
  { src: '/AWS Cloud Clubs.png', alt: 'AWS Cloud Clubs' },
  { src: '/Superior University Logo.svg', alt: 'Superior University' },
]

// 3D Card tilt effect on hover
const onPointerMove = (e) => {
  if (!cardRef.value || !hasFinePointer()) return
  const rect = cardRef.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5

  if (robotImg.value) {
    robotImg.value.style.transform = `translate3d(${x * 16}px, ${y * 16}px, 0) scale(1.05)`
  }
}

const onPointerLeave = () => {
  if (robotImg.value) {
    robotImg.value.style.transform = `translate3d(0, 0, 0) scale(1)`
  }
}

useGSAP(({ gsap, ScrollTrigger, selector }) => {
  // 1. Reveal card on scroll
  gsap.from(cardRef.value, {
    scrollTrigger: {
      trigger: scope.value,
      start: 'top 82%',
      toggleActions: 'play none none reverse',
    },
    y: 80,
    opacity: 0,
    scale: 0.95,
    duration: 1.2,
    ease: 'power3.out',
  })

  // 2. SplitText title reveal
  const titleSplit = SplitText.create(selector('.about-title'), { type: 'words,chars', wordsClass: 'aw' })
  gsap.from(titleSplit.chars, {
    scrollTrigger: {
      trigger: scope.value,
      start: 'top 78%',
      toggleActions: 'play none none reverse',
    },
    y: 40,
    opacity: 0,
    rotateX: -45,
    stagger: 0.02,
    duration: 0.9,
    ease: 'back.out(1.5)',
  })

  // 3. Robot floating animation
  gsap.to(robotImg.value, {
    y: '+=12',
    duration: 2.8,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
  })

  // 4. Logo ticker continuous loop
  const track = selector('.logo-track')[0]
  if (track) {
    gsap.to(track, {
      xPercent: -50,
      duration: 22,
      ease: 'none',
      repeat: -1,
    })
  }

  // 5. Arrow playful wiggle on view
  if (arrowRef.value) {
    gsap.from(arrowRef.value, {
      scrollTrigger: {
        trigger: arrowRef.value,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
      scale: 0,
      rotation: -60,
      opacity: 0,
      duration: 1,
      ease: 'elastic.out(1, 0.4)',
    })
  }
}, scope)
</script>

<style scoped>
.about-card {
  perspective: 1000px;
}

.robot-stage {
  box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.2);
}

.robot-ring {
  border-style: dashed;
  animation: spin 35s linear infinite;
}
.robot-ring-inner {
  border-style: dotted;
  animation: spin-reverse 25s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes spin-reverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

.robot-mascot {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.about-title :deep(.aw) {
  display: inline-block;
  overflow: clip;
}
</style>