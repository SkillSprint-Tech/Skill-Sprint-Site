<template>
  <section ref="statsSection" class="w-full bg-[#F8FAFC] py-12 md:py-20 px-4 sm:px-6">
    <div class="max-w-7xl mx-auto">

      <!-- Heading Row -->
      <div class="flex flex-col md:flex-row justify-between items-start gap-6 mb-10 md:mb-14">
        <div>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Our Damage So Far
          </h2>
          <p class="text-gray-500 text-base sm:text-lg mt-2 font-medium">
            Proof we're not just talking
          </p>
        </div>

        <!-- Stats — inline on mobile, row on desktop -->
        <div class="flex flex-row gap-8 sm:gap-12 md:gap-16 w-full md:w-auto">
          <div v-for="stat in stats" :key="stat.label" class="flex flex-col">
            <span class="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 leading-none">
              {{ animatedValues[stat.label] }}+
            </span>
            <span class="text-sm sm:text-base md:text-lg font-extrabold text-gray-900 mt-1 uppercase">
              {{ stat.label }}
            </span>
            <span class="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-0.5">
              {{ stat.subtext }}
            </span>
          </div>
        </div>
      </div>

      <!-- Map -->
      <div class="flex justify-center">
        <img
          src="/mapremovebg.png"
          alt="Global presence map showing Skill Sprint universities"
          class="w-full max-w-5xl h-auto opacity-90"
        />
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

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

const statsSection = ref(null)
let hasAnimated = false

const animateCount = (label, target) => {
  let current = 0
  const steps = 80
  const increment = target / steps
  const interval = setInterval(() => {
    current += increment
    if (current >= target) {
      animatedValues[label] = target
      clearInterval(interval)
    } else {
      animatedValues[label] = Math.floor(current)
    }
  }, 18)
}

const handleScroll = () => {
  if (hasAnimated || !statsSection.value) return
  const rect = statsSection.value.getBoundingClientRect()
  if (rect.top < window.innerHeight - 80) {
    hasAnimated = true
    stats.forEach(s => animateCount(s.label, s.value))
    window.removeEventListener('scroll', handleScroll)
  }
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>