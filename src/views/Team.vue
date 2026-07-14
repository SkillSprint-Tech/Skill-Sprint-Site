<template>
  <div ref="teamScope" class="min-h-screen bg-[#F8FAFC] text-gray-950 py-20 px-4 font-sans overflow-hidden">
    <div class="max-w-6xl mx-auto relative">
      
      <!-- Ambient Background Glows -->
      <div class="absolute -right-20 -top-20 w-[400px] h-[400px] bg-blue-400/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div class="absolute -left-20 bottom-20 w-[400px] h-[400px] bg-indigo-400/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <!-- Page Header -->
      <div class="text-center mb-20 header-area">
        <span class="text-[#0178FF] font-black text-xs uppercase tracking-[0.2em] mb-4 inline-block">Our Community Leaders</span>
        <h1 class="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-none mb-6">
          Meet the Core Team
        </h1>
        <p class="text-gray-500 text-base sm:text-lg max-w-xl mx-auto font-medium leading-relaxed">
          Students and mentors who build local chapters, manage project sprints, and nurture our learning ecosystem.
        </p>
      </div>

      <!-- Team Members Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 cards-container">
        
        <div 
          v-for="member in teamMembers" 
          :key="member.name" 
          class="bg-white rounded-[2.5rem] p-8 border border-gray-100 hover:border-blue-300/30 shadow-[0_15px_40px_rgba(0,0,0,0.03)] transition-all duration-500 hover:scale-[1.02] flex flex-col items-center text-center group team-card"
        >
          <!-- Image Container with Zoom and Glow -->
          <div class="w-32 h-32 rounded-[2rem] overflow-hidden bg-slate-100 border-2 border-white shadow-md mb-6 transform group-hover:scale-105 duration-500 shrink-0">
            <img :src="member.image" :alt="member.name" class="w-full h-full object-cover" />
          </div>
          
          <h3 class="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">{{ member.name }}</h3>
          <span class="inline-block bg-blue-50 text-blue-600 text-xs font-black px-4 py-1.5 rounded-full mb-6 border border-blue-100 uppercase tracking-wider">
            {{ member.role }}
          </span>
          <p class="text-gray-500 text-sm leading-relaxed font-medium">
            {{ member.bio }}
          </p>
        </div>
        
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { useGSAP } from '../composables/useGSAP'

const teamScope = ref(null)
const teamMembers = ref([])

const defaultTeam = [
  {
    name: 'Zainab Malik',
    role: 'Community Lead',
    bio: 'Organizes campus chapters, structures university collaborations, and arranges tech mentorship.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=faces'
  },
  {
    name: 'Bilal Ahmed',
    role: 'Tech Lead',
    bio: 'Oversees development sprint architectures, sets up code templates, and guides weekly code jams.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces'
  },
  {
    name: 'Sarah Joseph',
    role: 'Product Designer',
    bio: 'Instructs sprints on UX flow, Figma prototyping, component systems, and premium design patterns.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=faces'
  }
]

onMounted(() => {
  const localMembers = JSON.parse(localStorage.getItem('team_members') || '[]')
  teamMembers.value = [...defaultTeam, ...localMembers]
})

useGSAP(() => {
  gsap.from('.header-area', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  })

  gsap.from('.team-card', {
    y: 60,
    opacity: 0,
    scale: 0.95,
    duration: 1.2,
    stagger: 0.15,
    ease: 'back.out(1.3)',
    delay: 0.2
  })
}, teamScope)
</script>
