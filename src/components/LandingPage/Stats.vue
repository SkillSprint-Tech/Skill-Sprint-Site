<template>
  <section ref="scope" class="stats-section w-full bg-[#F8FAFC] py-16 sm:py-24 md:py-32 px-4 sm:px-6 relative overflow-hidden">

    <!-- Subtle cyber ambient glow -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/8 blur-[140px] pointer-events-none" aria-hidden="true"></div>

    <div class="max-w-7xl mx-auto relative z-10">

      <!-- Heading & Stats Row -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-14 md:mb-20 pb-8 border-b border-gray-200/80">
        <div>
          <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-600 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            Real Traction Ledger
          </div>
          <h2 class="stats-title text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
            Our Damage <span class="text-blue-600">So Far</span>
          </h2>
          <p class="stats-sub text-gray-500 text-base sm:text-lg mt-3 font-medium">
            Proof we're not just talking. Live metrics across our active student network.
          </p>
        </div>

        <!-- Metric Counters with GSAP ScrollTrigger -->
        <div class="flex flex-wrap sm:flex-nowrap gap-6 sm:gap-10 md:gap-14 w-full lg:w-auto">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="stat-box flex flex-col bg-white/70 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm min-w-[130px] flex-1 sm:flex-none"
          >
            <div class="flex items-baseline gap-0.5">
              <span class="stat-number text-3xl sm:text-4xl md:text-5xl font-black text-blue-600 leading-none tabular-nums font-mono">
                {{ animatedValues[stat.label] }}
              </span>
              <span class="text-xl sm:text-2xl font-bold text-blue-500 leading-none">+</span>
            </div>
            <span class="text-sm sm:text-base font-extrabold text-gray-900 mt-2 uppercase tracking-tight">
              {{ stat.label }}
            </span>
            <span class="text-[10px] text-gray-400 uppercase tracking-widest font-mono font-semibold mt-0.5">
              {{ stat.subtext }}
            </span>
          </div>
        </div>
      </div>

      <!-- Holographic Interactive Map Showcase -->
      <div
        ref="mapCard"
        class="map-container relative bg-white/80 backdrop-blur-md rounded-3xl md:rounded-[2.5rem] p-4 sm:p-8 md:p-12 border border-slate-200/80 shadow-[0_20px_70px_rgba(37,99,235,0.07)] overflow-hidden"
        @pointermove="onMapMove"
        @pointerleave="onMapLeave"
      >
        <!-- Map HUD overlay header -->
        <div class="flex items-center justify-between text-xs font-mono text-slate-400 mb-4 px-2">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span class="text-slate-700 font-bold">REGIONAL CAMPUS GRID</span>
          </div>
          <div class="hidden sm:flex items-center gap-4 text-[11px]">
            <span>LAT: 31.5204° N</span>
            <span>LON: 74.3587° E</span>
            <span class="text-blue-600 font-bold">11 NODES ACTIVE</span>
          </div>
        </div>

        <!-- Radar scanline effect -->
        <div class="radar-scanline pointer-events-none" aria-hidden="true"></div>

        <!-- Map graphic with pulsing beacons -->
        <div class="relative flex justify-center py-4">
          <img
            ref="mapImg"
            src="/mapremovebg.png"
            alt="Global presence map showing Skill Sprint universities"
            class="w-full max-w-5xl h-auto opacity-95 transition-transform duration-300 ease-out select-none"
            loading="lazy"
          />

          <!-- Beacons / University Nodes placed on map -->
          <div class="beacon-node absolute top-[36%] left-[48%] pointer-events-none">
            <span class="beacon-ping"></span>
            <span class="beacon-dot"></span>
          </div>
          <div class="beacon-node absolute top-[42%] left-[45%] pointer-events-none">
            <span class="beacon-ping" style="animation-delay: 0.5s"></span>
            <span class="beacon-dot"></span>
          </div>
          <div class="beacon-node absolute top-[38%] left-[52%] pointer-events-none">
            <span class="beacon-ping" style="animation-delay: 1s"></span>
            <span class="beacon-dot"></span>
          </div>
          <div class="beacon-node absolute top-[48%] left-[50%] pointer-events-none">
            <span class="beacon-ping" style="animation-delay: 1.5s"></span>
            <span class="beacon-dot"></span>
          </div>
          <div class="beacon-node absolute top-[34%] left-[43%] pointer-events-none">
            <span class="beacon-ping" style="animation-delay: 0.8s"></span>
            <span class="beacon-dot"></span>
          </div>
        </div>

        <!-- Map Footer Badge -->
        <div class="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono">
          <span>Continuous expansion across partner institutions and university clubs</span>
          <span class="text-blue-600 font-bold flex items-center gap-1.5">
            <i class="fa-solid fa-satellite-dish text-xs"></i>
            Live Network Synchronized
          </span>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useGSAP } from '../../composables/useGSAP'
import { SplitText } from '../../motion/gsap'
import { hasFinePointer } from '../../motion/intro'

const scope = ref(null)
const mapCard = ref(null)
const mapImg = ref(null)

const stats = [
  { value: 1500, label: 'Students', subtext: 'Squad Expanding' },
  { value: 11,   label: 'Universities', subtext: 'MOUs Signed' },
  { value: 20,   label: 'Mentors', subtext: 'Grownups Who Help' },
]

const animatedValues = reactive({
  Students: 0,
  Universities: 0,
  Mentors: 0,
})

const onMapMove = (e) => {
  if (!mapCard.value || !mapImg.value || !hasFinePointer()) return
  const rect = mapCard.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  mapImg.value.style.transform = `scale(1.02) translate3d(${x * 12}px, ${y * 12}px, 0)`
}

const onMapLeave = () => {
  if (mapImg.value) {
    mapImg.value.style.transform = 'scale(1) translate3d(0, 0, 0)'
  }
}

useGSAP(({ gsap, ScrollTrigger, selector }) => {
  // 1. Heading SplitText reveal
  const titleSplit = SplitText.create(selector('.stats-title'), { type: 'words,chars', wordsClass: 'sw' })
  gsap.from(titleSplit.chars, {
    scrollTrigger: {
      trigger: scope.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    y: 40,
    opacity: 0,
    rotateX: -45,
    stagger: 0.02,
    duration: 0.9,
    ease: 'power3.out',
  })

  // 2. Stat Boxes reveal and Numeric Counter animation
  const statBoxes = selector('.stat-box')
  gsap.from(statBoxes, {
    scrollTrigger: {
      trigger: scope.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    y: 50,
    opacity: 0,
    stagger: 0.12,
    duration: 0.9,
    ease: 'back.out(1.4)',
  })

  // Numeric count-up with GSAP
  stats.forEach((s) => {
    const proxy = { val: 0 }
    gsap.to(proxy, {
      scrollTrigger: {
        trigger: scope.value,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
      val: s.value,
      duration: 2.2,
      ease: 'power2.out',
      onUpdate: () => {
        animatedValues[s.label] = Math.floor(proxy.val)
      },
    })
  })

  // 3. Map Card entrance
  if (mapCard.value) {
    gsap.from(mapCard.value, {
      scrollTrigger: {
        trigger: mapCard.value,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      y: 70,
      opacity: 0,
      scale: 0.96,
      duration: 1.1,
      ease: 'power3.out',
    })
  }
}, scope)
</script>

<style scoped>
.stats-title :deep(.sw) {
  display: inline-block;
  overflow: clip;
}

.radar-scanline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, rgba(37, 99, 235, 0.6) 50%, transparent 100%);
  animation: radar-sweep 5s ease-in-out infinite;
  box-shadow: 0 0 15px rgba(37, 99, 235, 0.8);
  opacity: 0.7;
}

@keyframes radar-sweep {
  0% { transform: translateY(0); opacity: 0; }
  10% { opacity: 0.8; }
  90% { opacity: 0.8; }
  100% { transform: translateY(500px); opacity: 0; }
}

.beacon-node {
  position: absolute;
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.beacon-dot {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: #2563eb;
  border: 1.5px solid #fff;
  box-shadow: 0 0 10px rgba(37, 99, 235, 0.8);
}

.beacon-ping {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  background: rgba(37, 99, 235, 0.4);
  animation: ping-pulse 2.2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping-pulse {
  75%, 100% {
    transform: scale(2.5);
    opacity: 0;
  }
}
</style>