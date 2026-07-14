<template>
  <div ref="sprintsScope" class="min-h-screen bg-[#F8FAFC] text-gray-950 py-20 px-4 font-sans overflow-hidden">
    <div class="max-w-6xl mx-auto relative">
      
      <!-- Ambient Background Glows -->
      <div class="absolute -left-20 -top-20 w-[400px] h-[400px] bg-blue-400/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div class="absolute -right-20 bottom-20 w-[400px] h-[400px] bg-indigo-400/5 blur-[120px] rounded-full pointer-events-none"></div>

      <!-- Page Header -->
      <div class="text-center mb-20 header-area">
        <span class="text-[#0178FF] font-black text-xs uppercase tracking-[0.2em] mb-4 inline-block">Sprint Cycles</span>
        <h1 class="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-none mb-6">
          Active Project Sprints
        </h1>
        <p class="text-gray-500 text-base sm:text-lg max-w-xl mx-auto font-medium leading-relaxed">
          Collaborate on high-impact projects, gain verified badges, and build out your portfolio inside focused, structured cycles.
        </p>
      </div>

      <!-- Sprints Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 md-sprints-container">
        
        <div 
          v-for="sprint in sprints" 
          :key="sprint.title" 
          class="bg-white rounded-[2.5rem] p-8 border border-gray-100 hover:border-blue-300/30 shadow-[0_15px_40px_rgba(0,0,0,0.03)] transition-all duration-500 hover:scale-[1.02] flex flex-col justify-between sprint-card"
        >
          <div>
            <div class="flex items-center justify-between mb-8">
              <span 
                class="px-4 py-1.5 text-xs font-black rounded-full border flex items-center gap-2"
                :class="[
                  sprint.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                ]"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="[sprint.status === 'Active' ? 'bg-emerald-500' : 'bg-blue-500']"></span>
                {{ sprint.status }}
              </span>
              <span class="text-gray-400 text-xs font-semibold">Ends {{ sprint.endDate }}</span>
            </div>
            
            <h3 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 leading-snug">{{ sprint.title }}</h3>
            <p class="text-gray-500 text-sm sm:text-base leading-relaxed mb-8 font-medium">{{ sprint.desc }}</p>
            
            <div class="space-y-4 mb-8">
              <div v-for="bullet in sprint.bullets" :key="bullet" class="flex items-center gap-3">
                <span class="text-emerald-500 font-bold">✓</span>
                <span class="text-gray-700 text-sm sm:text-base font-semibold">{{ bullet }}</span>
              </div>
            </div>
          </div>
          
          <router-link to="/contact-us">
            <button class="w-full py-4 bg-[#0178FF] hover:bg-[#0168E0] text-white font-bold rounded-full transition shadow-lg shadow-blue-500/10 cursor-pointer">
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
import gsap from 'gsap'
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

useGSAP(() => {
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
