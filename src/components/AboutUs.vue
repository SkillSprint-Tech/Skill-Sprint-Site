<template>
  <div ref="aboutScope" class="bg-[#F8FAFC] overflow-hidden font-sans">

    <!-- ─── HERO (light) ─── -->
    <section class="relative bg-[#F8FAFC] pt-14 pb-16 px-4 text-center overflow-hidden">
      <!-- Dot grid background -->
      <div class="absolute inset-0 pointer-events-none opacity-[0.04]" aria-hidden="true">
        <svg class="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dotgrid-about" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#1e40af" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotgrid-about)" />
        </svg>
      </div>
      <!-- Glow orbs -->
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute top-[-60px] left-[20%] w-[500px] h-[350px] bg-blue-400/7 blur-[110px] rounded-full"></div>
        <div class="absolute top-[25%] right-[10%] w-[280px] h-[220px] bg-indigo-300/5 blur-[80px] rounded-full"></div>
      </div>

      <!-- Floating annotation tags (with depth parallax classes) -->
      <div class="hidden sm:block pointer-events-none select-none" aria-hidden="true">
        <div class="absolute left-[12%] top-[18%] -rotate-6 bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200 text-[11px] font-medium tracking-wide text-gray-600 ann-tag" style="font-family:'Handlee',cursive;">
          🏆 real projects, real growth
        </div>
        <div class="absolute right-[10%] top-[14%] rotate-6 bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200 text-[11px] font-medium tracking-wide text-gray-600 ann-tag" style="font-family:'Handlee',cursive;">
          🌱 student-first always
        </div>
        <div class="absolute left-[8%] top-[38%] rotate-12 bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200 text-[11px] font-medium tracking-wide text-gray-600 ann-tag" style="font-family:'Handlee',cursive;">
          💡 learn by doing
        </div>
        <div class="absolute right-[8%] top-[40%] -rotate-9 bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200 text-[11px] font-medium tracking-wide text-gray-600 ann-tag" style="font-family:'Handlee',cursive;">
          🤝 community > competition
        </div>
      </div>

      <div class="relative z-10 max-w-4xl mx-auto">
        <h1 class="text-[2.4rem] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-5 about-title">
          Bridging Classrooms<br/>
          <span class="text-blue-600">and Careers</span>
        </h1>
        <p class="max-w-sm sm:max-w-xl mx-auto text-gray-500 text-sm sm:text-base md:text-lg mb-10 leading-relaxed about-sub">
          Skill Sprint is a student-first learning ecosystem. We build projects, share mentor guidance, and forge solid portfolios — entirely peer-led, entirely free, and entirely real.
        </p>
        <div class="flex flex-row items-center justify-center gap-3 about-ctas">
          <router-link to="/contact-us">
            <button class="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-blue-600 text-white text-sm sm:text-base font-semibold hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-blue-200 cursor-pointer">
              Join the Sprint
            </button>
          </router-link>
          <router-link to="/community">
            <button class="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-white border border-gray-300 text-gray-700 text-sm sm:text-base font-semibold hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
              Our Community →
            </button>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ─── STATS (dark) ─── -->
    <section class="bg-[#0B101B] py-16 sm:py-24 px-4 relative overflow-hidden stats-section">
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-blue-600/6 blur-[150px] rounded-full"></div>
      </div>
      <div class="max-w-4xl mx-auto relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
        <div v-for="stat in stats" :key="stat.label" class="text-center stat-item">
          <!-- Pulsing ring -->
          <div class="relative inline-flex items-center justify-center mb-3">
            <div class="absolute w-20 h-20 rounded-full border-2 border-blue-500/20 animate-ping" style="animation-duration: 3s;"></div>
            <div class="relative w-16 h-16 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
              <span class="text-2xl">{{ stat.icon }}</span>
            </div>
          </div>
          <p class="text-4xl sm:text-5xl font-black text-white mb-2">{{ stat.value }}</p>
          <p class="text-gray-400 text-xs sm:text-sm font-semibold uppercase tracking-widest">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- ─── OUR STORY (light) ─── -->
    <section class="bg-[#F8FAFC] py-20 sm:py-28 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center story-section">
          <!-- Left: Story text -->
          <div class="story-left">
            <p class="text-blue-600 text-xs font-black uppercase tracking-widest mb-4">Our Origin</p>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-6 leading-[1.15]">
              Started by Students,<br/>Built for Students.
            </h2>
            <div class="space-y-5">
              <p class="text-gray-600 text-base leading-relaxed">
                Skill Sprint started with a simple frustration: students were spending thousands on bootcamps, but still graduating without portfolio-ready experience. Two students in a campus lab decided to do something about it.
              </p>
              <p class="text-gray-600 text-base leading-relaxed">
                We organized our first sprint with 12 people, 2 weeks, and zero budget. Three teams shipped real projects. Word spread. More universities joined. MOUs were signed. The community grew to 500+ members across 11 universities.
              </p>
              <p class="text-gray-600 text-base leading-relaxed">
                Today, every sprint cycle produces real-world projects, verified portfolio pieces, and most importantly — a network of people who actually build together.
              </p>
            </div>

            <div class="flex items-center gap-4 mt-8">
              <div class="flex -space-x-3">
                <img v-for="(face, i) in founderFaces" :key="i" :src="face" class="w-9 h-9 rounded-full border-2 border-white object-cover" />
              </div>
              <p class="text-sm font-semibold text-gray-600">
                <span class="text-gray-900 font-black">500+ students</span> across 11 universities
              </p>
            </div>
          </div>

          <!-- Right: Photo collage -->
          <div class="story-right">
            <div class="grid grid-cols-2 gap-3 h-full">
              <div class="space-y-3">
                <div class="rounded-2xl overflow-hidden shadow-xl aspect-[4/5] bg-gray-200">
                  <img src="/Long Group.jpg.jpeg" alt="Sprint community" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div class="rounded-2xl overflow-hidden shadow-lg aspect-square bg-gray-200">
                  <img src="/Speaker.jpg.jpeg" alt="Workshop speaker" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
              <div class="space-y-3 pt-6">
                <div class="rounded-2xl overflow-hidden shadow-lg aspect-square bg-gray-200">
                  <img src="/Short Group.jpg.jpeg" alt="Team formation" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div class="rounded-2xl overflow-hidden shadow-xl aspect-[4/5] bg-gray-200">
                  <img src="/Crowd.JPG.jpeg" alt="Sprint showcase" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── PHILOSOPHY TIMELINE (light) ─── -->
    <section class="bg-white py-20 sm:py-28 px-4 border-y border-gray-100">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-16 timeline-header">
          <p class="text-blue-600 text-xs font-black uppercase tracking-widest mb-3">Philosophy</p>
          <h2 class="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-gray-900">Our Core Philosophy</h2>
          <p class="text-gray-500 text-base font-medium max-w-sm mx-auto">
            Three pillars that direct every single sprint we run.
          </p>
        </div>

        <div class="relative border-l-2 border-blue-100 ml-4 sm:ml-32 md:ml-40 pl-8 sm:pl-12 space-y-14">
          <div
            v-for="(milestone, i) in milestones"
            :key="milestone.title"
            class="relative milestone-item"
          >
            <!-- Dot marker with icon -->
            <div class="absolute -left-[54px] sm:-left-[70px] top-6 w-10 h-10 rounded-full bg-blue-600 border-4 border-white shadow-lg ring-4 ring-blue-100 flex items-center justify-center text-lg">
              {{ milestone.icon }}
            </div>

            <div class="bg-[#F8FAFC] rounded-2xl p-7 sm:p-9 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.06)] hover:border-blue-100 transition-all duration-300 group">
              <span class="inline-block px-3.5 py-1 bg-blue-50 text-blue-600 text-[11px] font-black rounded-full mb-4 uppercase border border-blue-100 tracking-widest">
                Phase 0{{ i + 1 }} — {{ milestone.phase }}
              </span>
              <h3 class="text-xl sm:text-2xl font-extrabold text-gray-900 mb-3">{{ milestone.title }}</h3>
              <p class="text-gray-500 text-sm sm:text-base leading-relaxed font-medium">{{ milestone.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── RECOGNITION (dark) ─── -->
    <section class="bg-[#0B101B] py-16 sm:py-20 px-4 recognition-section">
      <div class="max-w-4xl mx-auto text-center">
        <p class="text-gray-500 text-xs font-black uppercase tracking-widest mb-8">University Partners & Recognition</p>
        <div class="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          <div
            v-for="partner in partners"
            :key="partner"
            class="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 font-bold text-sm hover:text-white hover:border-white/20 hover:bg-white/10 transition-all duration-300 partner-badge"
          >
            {{ partner }}
          </div>
        </div>
      </div>
    </section>

    <!-- ─── CTA BANNER (dark continues) ─── -->
    <section class="bg-[#0B101B] pb-20 sm:pb-28 px-4 text-center relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full"></div>
      </div>
      <div class="max-w-2xl mx-auto relative z-10 cta-block">
        <!-- Glowing border card -->
        <div class="bg-white/5 border border-blue-500/20 rounded-3xl p-10 sm:p-14 shadow-[0_0_80px_rgba(59,130,246,0.08)]">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">"We Learn. We Sprint. We Grow."</h2>
          <p class="text-gray-400 text-base mb-8 max-w-md mx-auto leading-relaxed">
            Ready to jumpstart your developer journey? Connect with a sprint group today.
          </p>
          <router-link to="/contact-us">
            <button class="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
              Get Started →
            </button>
          </router-link>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGSAP } from '../composables/useGSAP'

const aboutScope = ref(null)

const stats = [
  { value: '500+', label: 'Sprint Members', icon: '👥' },
  { value: '45+',  label: 'Projects Shipped', icon: '🚀' },
  { value: '12+',  label: 'Tech Workshops', icon: '⚡' },
  { value: '100%', label: 'Student-Driven', icon: '🏆' },
]

const milestones = [
  {
    icon: '📚',
    phase: 'We Learn',
    title: 'Acquire Practical, Industry Skills',
    desc: 'Through targeted, peer-led workshops we focus on technologies the industry actually uses. No outdated concepts — just modern engineering. From Vue 3 to system design, we cover it all.'
  },
  {
    icon: '⚡',
    phase: 'We Sprint',
    title: 'Build Under Tight Deadlines in Teams',
    desc: 'We group developers, designers, and project managers together to build functional apps over short focused sprints. You learn teamwork, Git collaboration, async communication, and execution speed.'
  },
  {
    icon: '🚀',
    phase: 'We Grow',
    title: 'Launch Portfolios & Launch Careers',
    desc: 'By building a verified portfolio of shipped products, students establish actual proof of expertise — making landing internships and jobs a natural outcome of the sprint journey.'
  }
]

const founderFaces = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
]

const partners = [
  'NUST', 'FAST-NUCES', 'COMSATS', 'UET Lahore', 'Bahria University',
  'UMT', 'ITU Punjab', 'LUMS', 'IBA Karachi', 'Air University', 'GIKI'
]

useGSAP((self) => {
  const { gsap } = self

  // Hero entrance timeline
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  tl.from('.about-title', { y: 80, opacity: 0, duration: 1.4, skewY: 2 })
    .from('.about-sub', { y: 30, opacity: 0, duration: 1.1 }, '-=1.0')
    .from('.about-ctas a, .about-ctas a + a', { scale: 0.85, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'back.out(1.8)' }, '-=0.8')

  // Floating annotation tags
  const tags = gsap.utils.toArray('.ann-tag')
  tags.forEach((tag, i) => {
    gsap.from(tag, { scale: 0, opacity: 0, duration: 1, delay: 0.7 + i * 0.12, ease: 'back.out(2)' })
    gsap.to(tag, { y: '+=10', x: i % 2 === 0 ? '+=4' : '-=4', rotation: i % 2 === 0 ? '+=2' : '-=2', duration: 2.2 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.2 })
  })

  // Stats section scroll reveal
  gsap.from('.stat-item', {
    scrollTrigger: { trigger: '.stats-section', start: 'top 95%', once: true },
    immediateRender: false, y: 50, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out'
  })

  // Story section
  gsap.from('.story-left', {
    scrollTrigger: { trigger: '.story-section', start: 'top 95%', once: true },
    immediateRender: false, x: -60, opacity: 0, duration: 1.3, ease: 'power3.out'
  })
  gsap.from('.story-right', {
    scrollTrigger: { trigger: '.story-section', start: 'top 95%', once: true },
    immediateRender: false, x: 60, opacity: 0, duration: 1.3, ease: 'power3.out', delay: 0.15
  })

  // Timeline header
  gsap.from('.timeline-header', {
    scrollTrigger: { trigger: '.timeline-header', start: 'top 95%', once: true },
    immediateRender: false, y: 40, opacity: 0, duration: 1, ease: 'power3.out'
  })

  // Timeline milestone items — alternate from left and right
  gsap.utils.toArray('.milestone-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 95%', once: true },
      immediateRender: false, x: -60, opacity: 0, duration: 1.1, ease: 'power3.out', delay: i * 0.05
    })
  })

  // Recognition partners
  gsap.from('.recognition-section', {
    scrollTrigger: { trigger: '.recognition-section', start: 'top 95%', once: true },
    immediateRender: false, y: 30, opacity: 0, duration: 0.9, ease: 'power3.out'
  })
  gsap.from('.partner-badge', {
    scrollTrigger: { trigger: '.recognition-section', start: 'top 95%', once: true },
    immediateRender: false, y: 20, opacity: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out', delay: 0.2
  })

  // CTA block
  gsap.from('.cta-block', {
    scrollTrigger: { trigger: '.cta-block', start: 'top 95%', once: true },
    immediateRender: false, y: 50, opacity: 0, scale: 0.97, duration: 1.1, ease: 'back.out(1.4)'
  })
}, aboutScope)
</script>
