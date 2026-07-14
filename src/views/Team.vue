<template>
  <div ref="teamScope" class="min-h-screen bg-[#F8FAFC] py-16 px-4 font-sans">
    <div class="max-w-6xl mx-auto">
      
      <!-- Page Header -->
      <div class="text-center mb-16 header-area">
        <span class="text-blue-600 font-bold text-xs uppercase tracking-widest mb-3 inline-block tracking-widest-2">Our Community Leaders</span>
        <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-none mb-4">
          Meet the Core Team
        </h1>
        <p class="text-gray-500 text-base sm:text-lg max-w-xl mx-auto font-medium">
          Students and mentors who build local chapters, manage project sprints, and nurture our learning ecosystem.
        </p>
      </div>

      <!-- Team Members Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 cards-container">
        
        <div 
          v-for="member in teamMembers" 
          :key="member.name" 
          class="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 duration-300 flex flex-col items-center text-center group team-card"
        >
          <!-- Image -->
          <div class="w-32 h-32 rounded-[2rem] overflow-hidden bg-slate-100 border-2 border-white shadow-md mb-6 transform group-hover:scale-105 duration-300 shrink-0">
            <img :src="member.image" :alt="member.name" class="w-full h-full object-cover" />
          </div>
          
          <h3 class="text-xl font-extrabold text-gray-900 mb-1">{{ member.name }}</h3>
          <span class="inline-block bg-blue-50 text-blue-600 text-xs font-black px-3 py-1 rounded-full mb-4 border border-blue-100 uppercase">
            {{ member.role }}
          </span>
          <p class="text-gray-500 text-sm leading-relaxed font-medium">
            {{ member.bio }}
          </p>
        </div>
        
      </div>

      <!-- Action Footer -->
      <div class="mt-16 text-center footer-cta">
        <p class="text-gray-500 text-sm font-semibold mb-4">Are you a core team member who hasn't registered yet?</p>
        <router-link to="/team-members-form">
          <button class="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase rounded-full shadow-sm transition hover:scale-105 active:scale-95 cursor-pointer">
            Register Details
          </button>
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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

useGSAP((self) => {
  const { gsap } = self

  gsap.from('.header-area', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  })

  // We defer card animations slightly to allow teamMembers array to load in onMounted
  gsap.from('.team-card', {
    y: 60,
    opacity: 0,
    scale: 0.95,
    duration: 1.2,
    stagger: 0.15,
    ease: 'back.out(1.3)',
    delay: 0.2
  })

  gsap.from('.footer-cta', {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    delay: 0.6
  })
}, teamScope)
</script>
