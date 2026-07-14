<template>
  <div ref="teamScope" class="bg-[#F8FAFC] overflow-hidden font-sans">

    <!-- ─── HERO ─── -->
    <section class="relative bg-[#F8FAFC] pt-14 pb-16 px-4 text-center overflow-hidden">
      <!-- Floating annotation tags -->
      <div class="hidden sm:block pointer-events-none select-none" aria-hidden="true">
        <div class="absolute left-[12%] top-[18%] -rotate-6 bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200 text-[11px] font-medium tracking-wide text-gray-600 ann-tag" style="font-family:'Handlee',cursive;">
          🧑‍💻 students leading students
        </div>
        <div class="absolute right-[10%] top-[12%] rotate-6 bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200 text-[11px] font-medium tracking-wide text-gray-600 ann-tag" style="font-family:'Handlee',cursive;">
          🔥 passionate, not perfect
        </div>
        <div class="absolute left-[7%] top-[40%] rotate-12 bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200 text-[11px] font-medium tracking-wide text-gray-600 ann-tag" style="font-family:'Handlee',cursive;">
          🙌 community-built
        </div>
        <div class="absolute right-[8%] top-[42%] -rotate-9 bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200 text-[11px] font-medium tracking-wide text-gray-600 ann-tag" style="font-family:'Handlee',cursive;">
          🌍 diverse skill sets
        </div>
      </div>

      <div class="relative z-10 max-w-4xl mx-auto">
        <h1 class="text-[2.4rem] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-5 team-title">
          Meet the<br />
          <span class="text-blue-600">Core Team</span>
        </h1>
        <p class="max-w-xs sm:max-w-xl mx-auto text-gray-500 text-sm sm:text-base md:text-lg mb-10 leading-relaxed team-sub">
          Students and mentors who build local chapters, manage project sprints, and nurture our learning ecosystem.
        </p>
      </div>
    </section>

    <!-- ─── TEAM GRID (dark section matching Whysection) ─── -->
    <section class="bg-[#0B101B] py-16 sm:py-24 px-4">
      <div class="max-w-6xl mx-auto">

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="member in teamMembers"
            :key="member.name"
            class="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center group hover:scale-[1.03] transition-transform duration-300 team-card"
          >
            <!-- Avatar -->
            <div class="w-28 h-28 rounded-2xl overflow-hidden bg-gray-100 border-2 border-white shadow-lg mb-5 transform group-hover:scale-105 duration-300 shrink-0">
              <img :src="member.image" :alt="member.name" class="w-full h-full object-cover" />
            </div>

            <h3 class="text-lg sm:text-xl font-extrabold text-gray-900 mb-1.5">{{ member.name }}</h3>
            <span class="inline-block bg-blue-50 text-blue-600 text-[11px] font-black px-4 py-1.5 rounded-full mb-4 border border-blue-100 uppercase tracking-widest">
              {{ member.role }}
            </span>
            <p class="text-gray-500 text-sm leading-relaxed font-medium">{{ member.bio }}</p>
          </div>
        </div>

      </div>
    </section>

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

  // Hero entrance
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  tl.from('.team-title', { y: 80, opacity: 0, duration: 1.4, skewY: 2 })
    .from('.team-sub',   { y: 30, opacity: 0, duration: 1.1 }, '-=1.0')

  // Floating annotation tags
  const tags = gsap.utils.toArray('.ann-tag')
  tags.forEach((tag, i) => {
    gsap.from(tag, { scale: 0, opacity: 0, duration: 1, delay: 0.7 + i * 0.12, ease: 'back.out(2)' })
    gsap.to(tag, { y: '+=10', x: i % 2 === 0 ? '+=4' : '-=4', rotation: i % 2 === 0 ? '+=2' : '-=2', duration: 2.2 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.2 })
  })

  // Team cards scroll reveal (with slight delay so localStorage items mount)
  gsap.from('.team-card', {
    scrollTrigger: { trigger: '.team-card', start: 'top 85%', toggleActions: 'play none none reverse' },
    y: 80, opacity: 0, scale: 0.93, duration: 1.2, stagger: 0.15, ease: 'back.out(1.4)'
  })
}, teamScope)
</script>
