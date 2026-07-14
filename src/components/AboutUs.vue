<template>
  <div ref="aboutScope" class="min-h-screen bg-[#F8FAFC] overflow-hidden font-sans">
    
    <!-- Hero Header -->
    <header class="relative py-20 sm:py-28 px-4 text-center bg-white border-b border-gray-100 overflow-hidden">
      <!-- Decorative background blur -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-blue-100/40 to-indigo-100/40 blur-3xl rounded-full"></div>
      
      <div class="relative z-10 max-w-4xl mx-auto">
        <p class="text-blue-600 font-bold text-xs uppercase tracking-widest mb-3 select-none tracking-widest-2">Who We Are</p>
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6 animate-text">
          Bridging the Gap Between <br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">Classrooms and Careers</span>
        </h1>
        <p class="text-gray-500 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-medium animate-p">
          Skill Sprint is a student-led learning and collaboration community focused on helping students gain practical, real-world skills beyond the textbook.
        </p>
      </div>
    </header>

    <!-- Stats Section -->
    <section class="max-w-7xl mx-auto py-12 px-4 -mt-10 relative z-20 animate-stats">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 sm:p-8 rounded-[2rem] shadow-xl border border-gray-100">
        <div v-for="stat in stats" :key="stat.label" class="text-center p-4">
          <p class="text-3xl sm:text-4xl font-extrabold text-[#0178FF] mb-1">{{ stat.value }}</p>
          <p class="text-gray-500 text-xs sm:text-sm font-semibold uppercase tracking-wider">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- Core Values Timeline -->
    <section class="max-w-5xl mx-auto py-20 px-4">
      <div class="text-center mb-16">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Our Core Philosophy</h2>
        <p class="text-gray-500 text-base font-medium max-w-md mx-auto">
          We operate around three main milestones that direct every project sprint.
        </p>
      </div>

      <div class="relative border-l-2 border-blue-100 ml-4 sm:ml-32 md:ml-40 pl-8 space-y-12 pb-10">
        <div 
          v-for="(milestone, i) in milestones" 
          :key="milestone.title" 
          class="relative milestone-item"
        >
          <!-- Circle marker -->
          <div class="absolute -left-[41px] top-1.5 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-md"></div>
          
          <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
            <span class="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-extrabold rounded-full mb-3 uppercase border border-blue-100">
              Phase 0{{ i + 1 }} — {{ milestone.phase }}
            </span>
            <h3 class="text-xl sm:text-2xl font-extrabold text-gray-900 mb-3">{{ milestone.title }}</h3>
            <p class="text-gray-500 text-sm sm:text-base leading-relaxed font-medium">
              {{ milestone.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Slogan CTA -->
    <section class="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 px-4 text-center text-white relative overflow-hidden">
      <!-- Background glow patterns -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      
      <div class="relative z-10 max-w-3xl mx-auto">
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-black mb-6 italic tracking-tight">"We Learn. We Sprint. We Grow."</h2>
        <p class="text-blue-100 text-base sm:text-lg mb-8 max-w-lg mx-auto font-medium">
          Ready to jumpstart your developer journey? Connect with a sprint group today and start building projects that matter.
        </p>
        <router-link to="/contact-us">
          <button class="px-8 py-3 bg-white text-blue-600 font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer">
            Get Started
          </button>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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

useGSAP((self) => {
  const { gsap } = self

  // Header timeline animation
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  
  tl.from('.animate-text', {
    y: 50,
    opacity: 0,
    duration: 1.2
  })
  .from('.animate-p', {
    y: 30,
    opacity: 0,
    duration: 1
  }, '-=0.9')
  .from('.animate-stats', {
    y: 40,
    opacity: 0,
    scale: 0.95,
    duration: 1,
    ease: 'back.out(1.2)'
  }, '-=0.7')

  // Timeline list items reveal
  const items = gsap.utils.toArray('.milestone-item')
  items.forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      x: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: i * 0.1
    })
  })
}, aboutScope)
</script>
