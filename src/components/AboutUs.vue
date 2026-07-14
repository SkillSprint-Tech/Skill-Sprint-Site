<template>
  <div ref="aboutScope" class="min-h-screen bg-[#070B16] text-white overflow-hidden font-sans">
    
    <!-- Hero Header -->
    <header class="relative py-24 sm:py-32 px-4 text-center bg-[radial-gradient(circle_at_50%_0%,#1e2d5a,transparent_60%)] overflow-hidden">
      <!-- Decorative floating glowing circles -->
      <div class="absolute top-[10%] left-[20%] w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full"></div>
      <div class="absolute top-[20%] right-[15%] w-[250px] h-[250px] bg-indigo-500/10 blur-[100px] rounded-full" style="animation-delay: 2s;"></div>
      
      <div class="relative z-10 max-w-4xl mx-auto">
        <p class="text-blue-400 font-black text-xs uppercase tracking-[0.2em] mb-4 select-none animate-label">Who We Are</p>
        <h1 class="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-8 animate-title">
          Bridging Classrooms<br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500">and Careers</span>
        </h1>
        <p class="text-gray-400 text-base sm:text-xl leading-relaxed max-w-2xl mx-auto font-medium animate-desc">
          Skill Sprint is a student-first learning ecosystem. We build projects, share mentor guidance, and forge solid portfolios—entirely peer-led and free.
        </p>
      </div>
    </header>

    <!-- Stats Section -->
    <section class="max-w-7xl mx-auto py-12 px-4 -mt-16 relative z-20 animate-stats">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-900/60 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-white/5">
        <div v-for="stat in stats" :key="stat.label" class="text-center p-4">
          <p class="text-4xl sm:text-5xl font-black text-blue-400 mb-2">{{ stat.value }}</p>
          <p class="text-gray-400 text-xs sm:text-sm font-semibold uppercase tracking-widest">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- Core Philosophy Timeline -->
    <section class="max-w-5xl mx-auto py-24 px-4">
      <div class="text-center mb-20 section-header">
        <h2 class="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Our Core Philosophy</h2>
        <p class="text-gray-400 text-base font-medium max-w-md mx-auto">
          We operate around three pillars that direct every project sprint.
        </p>
      </div>

      <!-- Timeline layout -->
      <div class="relative border-l border-white/10 ml-4 sm:ml-32 md:ml-40 pl-8 sm:pl-12 space-y-16 pb-10">
        <div 
          v-for="(milestone, i) in milestones" 
          :key="milestone.title" 
          class="relative milestone-item"
        >
          <!-- Circle marker with pulsing glow -->
          <div class="absolute -left-[45px] sm:-left-[61px] top-1.5 w-6 h-6 rounded-full bg-blue-500 border-4 border-[#070B16] shadow-md flex items-center justify-center">
            <span class="absolute w-12 h-12 rounded-full bg-blue-500/20 animate-ping" style="animation-duration: 3s;"></span>
          </div>
          
          <div class="bg-slate-900/40 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-white/5 hover:border-blue-500/30 shadow-xl transition-all duration-500 hover:scale-[1.02]">
            <span class="inline-block px-3.5 py-1 bg-blue-500/10 text-blue-400 text-xs font-black rounded-full mb-4 uppercase border border-blue-500/20 tracking-wider">
              Phase 0{{ i + 1 }} — {{ milestone.phase }}
            </span>
            <h3 class="text-2xl sm:text-3xl font-extrabold text-white mb-4">{{ milestone.title }}</h3>
            <p class="text-gray-400 text-sm sm:text-base leading-relaxed font-medium">
              {{ milestone.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Slogan CTA -->
    <section class="relative py-24 px-4 text-center overflow-hidden border-t border-white/5 bg-[radial-gradient(circle_at_50%_100%,#16224f,transparent_60%)]">
      <div class="relative z-10 max-w-3xl mx-auto">
        <h2 class="text-3xl sm:text-5xl font-black mb-6 italic tracking-tight text-white">"We Learn. We Sprint. We Grow."</h2>
        <p class="text-slate-300 text-base sm:text-lg mb-10 max-w-lg mx-auto font-medium">
          Ready to jumpstart your developer journey? Connect with a sprint group today and start building projects that matter.
        </p>
        <router-link to="/contact-us">
          <button class="px-8 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition cursor-pointer">
            Get Started
          </button>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import gsap from 'gsap'
import { useGSAP } from '../composables/useGSAP'

const aboutScope = ref(null)

const stats = [
  { value: '500+', label: 'Sprint Members' },
  { value: '45+', label: 'Projects Completed' },
  { value: '12+', label: 'Tech Workshops' },
  { value: '100%', label: 'Student-Driven' },
]

const milestones = [
  {
    phase: 'We Learn',
    title: 'Acquire Practical, Industry Skills',
    desc: 'Through targeted, peer-led workshops and hands-on guidance, we focus on learning technologies and processes that the industry actually uses. No outdated concepts, just modern engineering.'
  },
  {
    phase: 'We Sprint',
    title: 'Build Under Tight Deadlines in Groups',
    desc: 'Nothing beats real creation. We group developers, designers, and project managers together to build functional applications over short, focused sprints. You learn teamwork, Git collaboration, and speed.'
  },
  {
    phase: 'We Grow',
    title: 'Launch Portfolios & Launch Careers',
    desc: 'We show off what we build. By building a verified portfolio of shipped products, students establish actual proof of expertise, making landing internships and jobs a natural outcome.'
  }
]

useGSAP(() => {
  // Animating header
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  
  tl.from('.animate-label', {
    y: 20,
    opacity: 0,
    duration: 1
  })
  .from('.animate-title', {
    y: 40,
    opacity: 0,
    duration: 1.2
  }, '-=0.8')
  .from('.animate-desc', {
    y: 30,
    opacity: 0,
    duration: 1.1
  }, '-=0.9')
  .from('.animate-stats', {
    y: 50,
    opacity: 0,
    scale: 0.95,
    duration: 1.2,
    ease: 'back.out(1.4)'
  }, '-=0.8')

  // Timeline list items reveal
  const items = gsap.utils.toArray('.milestone-item')
  items.forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      x: -60,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    })
  })
}, aboutScope)
</script>
