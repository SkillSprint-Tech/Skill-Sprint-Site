<template>
  <div ref="sprintsScope" class="min-h-screen bg-[#F8FAFC] py-16 px-4 font-sans">
    <div class="max-w-6xl mx-auto">
      
      <!-- Page Header -->
      <div class="text-center mb-16 header-area">
        <span class="text-blue-600 font-bold text-xs uppercase tracking-widest mb-3 inline-block tracking-widest-2">Sprint Cycles</span>
        <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-none mb-4">
          Active Project Sprints
        </h1>
        <p class="text-gray-500 text-base sm:text-lg max-w-xl mx-auto font-medium">
          Collaborate on high-impact projects, gain verified badges, and build out your portfolio inside focused, structured cycles.
        </p>
      </div>

      <!-- Sprints Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md-sprints-container">
        
        <div 
          v-for="sprint in sprints" 
          :key="sprint.title" 
          class="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300 flex flex-col justify-between sprint-card"
        >
          <div>
            <div class="flex items-center justify-between mb-6">
              <span 
                class="px-3 py-1 text-xs font-black rounded-full border"
                :class="[
                  sprint.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                ]"
              >
                ● {{ sprint.status }}
              </span>
              <span class="text-gray-400 text-xs font-semibold">Ends {{ sprint.endDate }}</span>
            </div>
            
            <h3 class="text-2xl font-extrabold text-gray-900 mb-3 leading-snug">{{ sprint.title }}</h3>
            <p class="text-gray-500 text-sm sm:text-base leading-relaxed mb-6 font-medium">{{ sprint.desc }}</p>
            
            <div class="space-y-3 mb-8">
              <div v-for="bullet in sprint.bullets" :key="bullet" class="flex items-center gap-3">
                <span class="text-emerald-500">✓</span>
                <span class="text-gray-700 text-sm font-semibold">{{ bullet }}</span>
              </div>
            </div>
          </div>
          
          <router-link to="/contact-us">
            <button class="w-full py-3 bg-[#0178FF] hover:bg-[#0168E0] text-white font-bold rounded-full transition shadow-md shadow-blue-100 cursor-pointer">
              Register for Sprint
            </button>
          </router-link>
        </div>
        
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGSAP } from '../composables/useGSAP'

const sprintsScope = ref(null)

const sprints = [
  {
    title: 'Sprint Alpha: Full-Stack Web Apps',
    status: 'Active',
    endDate: 'July 30, 2026',
    desc: 'Assemble web developers, UI designers, and copywriters to engineer beautiful web portals. The focus is responsive frontend architectures connected to simple serverless backends.',
    bullets: ['Node/Express & Vue', 'Tailwind/GSAP animations', 'Firebase/Supabase Integration']
  },
  {
    title: 'Sprint Beta: Mobile Experience Design',
    status: 'Starts August 05',
    endDate: 'August 25, 2026',
    desc: 'A sprint focused heavily on designing, prototyping, and engineering fluid mobile interactions. Teams will construct application interfaces using Vue/Ionic or React Native.',
    bullets: ['Cross-platform deployments', 'Figma layout handoff', 'Gesture & touch micro-animations']
  }
]

useGSAP((self) => {
  const { gsap } = self

  gsap.from('.header-area', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  })

  gsap.from('.sprint-card', {
    y: 60,
    opacity: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: 'back.out(1.3)',
    delay: 0.3
  })
}, sprintsScope)
</script>
