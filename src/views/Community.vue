<template>
  <div ref="communityScope" class="min-h-screen bg-[#F8FAFC] text-gray-950 py-20 px-4 font-sans overflow-hidden">
    <div class="max-w-6xl mx-auto relative">
      
      <!-- Ambient Background Glows -->
      <div class="absolute -right-20 -top-20 w-[400px] h-[400px] bg-blue-400/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div class="absolute -left-20 bottom-20 w-[400px] h-[400px] bg-indigo-400/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <!-- Hero Banner (Premium Glassmorphic Panel in Slate) -->
      <div class="bg-slate-900 text-white rounded-[2.5rem] p-8 sm:p-12 lg:p-16 border border-white/5 shadow-2xl mb-16 relative overflow-hidden hero-banner">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-indigo-500/10"></div>
        <div class="absolute -right-16 -top-16 w-80 h-80 bg-blue-500/10 blur-3xl rounded-full"></div>
        
        <div class="relative z-10 max-w-2xl">
          <span class="inline-block bg-blue-500/20 text-blue-300 text-xs font-black px-4 py-2 rounded-full mb-6 uppercase tracking-widest border border-blue-500/30">
            Connected Learning
          </span>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-[1.1]">
            We Sprint <br class="hidden sm:inline" />Together.
          </h1>
          <p class="text-slate-300 text-sm sm:text-lg mb-8 leading-relaxed font-medium">
            Join a vibrant ecosystem of student developers, designers, and creators who collaborate to build projects, hold workshops, and grow together.
          </p>
          <a href="https://discord.gg/invite" target="_blank" class="inline-block">
            <button class="px-8 py-4 bg-[#0178FF] hover:bg-[#0168E0] text-white font-bold rounded-full shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-3">
              <span>💬</span> Join Discord Server
            </button>
          </a>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        <!-- Left 2 Cols: Events & Activities -->
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-white rounded-[2rem] p-8 sm:p-10 border border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] content-block hover:border-blue-300/20 transition duration-300">
            <h2 class="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
              <span class="text-[#0178FF]">📅</span> Upcoming Community Events
            </h2>
            
            <div class="space-y-6">
              <div v-for="event in events" :key="event.title" class="flex flex-col sm:flex-row gap-5 p-5 rounded-2xl bg-gray-50/50 hover:bg-slate-50 transition border border-gray-100 hover:border-gray-200 duration-300">
                <div class="bg-blue-50 text-blue-600 font-black w-full sm:w-24 h-20 rounded-xl flex flex-col items-center justify-center shrink-0 border border-blue-100">
                  <span class="text-lg font-black">{{ event.date.split(' ')[0] }}</span>
                  <span class="text-xs uppercase tracking-widest">{{ event.date.split(' ')[1] }}</span>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900 mb-2">{{ event.title }}</h3>
                  <p class="text-gray-500 text-sm mb-3 font-medium leading-relaxed">{{ event.desc }}</p>
                  <span class="inline-block bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full border border-gray-200">
                    {{ event.time }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right 1 Col: Pillars -->
        <div class="space-y-8">
          <div class="bg-white rounded-[2rem] p-8 sm:p-10 border border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] content-block hover:border-blue-300/20 transition duration-300">
            <h2 class="text-xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
              <span class="text-[#0178FF]">🚀</span> Core Pillars
            </h2>
            
            <div class="space-y-6">
              <div v-for="(pillar, idx) in pillars" :key="pillar.title" class="flex gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:border-gray-200 transition duration-300">
                <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-sm font-black border border-blue-100">
                  {{ idx + 1 }}
                </div>
                <div>
                  <h4 class="font-bold text-gray-900 mb-1.5">{{ pillar.title }}</h4>
                  <p class="text-gray-500 text-xs sm:text-sm font-medium leading-relaxed">{{ pillar.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import gsap from 'gsap'
import { useGSAP } from '../composables/useGSAP'

const communityScope = ref(null)

const events = [
  {
    date: '18 July',
    title: 'Intro to Vue 3 & GSAP Animations',
    desc: 'Learn how to construct reactive web applications and create complex GSAP scroll animations cleanly.',
    time: '6:00 PM - 7:30 PM (Online)'
  },
  {
    date: '25 July',
    title: 'Skill Sprint Project Kickoff',
    desc: 'Pitch your project ideas, form cross-functional groups, and align on goals for the next sprint.',
    time: '4:00 PM - 6:00 PM (Seminar Room 3)'
  },
  {
    date: '02 Aug',
    title: 'Portfolio Review & Mentorship Hour',
    desc: 'Share your latest project dashboards and code repos with senior developers for advice and feedback.',
    time: '5:30 PM - 7:00 PM (Discord Voice)'
  }
]

const pillars = [
  {
    title: 'Peer-to-Peer Help',
    desc: 'We are all learning. No request is too simple. Ask questions and help others when they are stuck.'
  },
  {
    title: 'Speed & Execution',
    desc: 'Progress beats perfection. Focus on building MVP products, ship quickly, and iterate based on use.'
  },
  {
    title: 'Cross-Disciplinary Magic',
    desc: 'Teams succeed when designers, managers, and engineers mix. Respect all skills and learn from one another.'
  }
]

useGSAP(() => {
  gsap.from('.hero-banner', {
    y: 60,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out'
  })

  gsap.from('.content-block', {
    y: 40,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: 'power3.out',
    delay: 0.3
  })
}, communityScope)
</script>
