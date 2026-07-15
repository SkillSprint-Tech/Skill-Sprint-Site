<template>
  <div ref="aboutScope" class="bg-[#F8FAFC] overflow-hidden font-sans">

    <!-- ─── HERO (light) ─── -->
    <section class="relative bg-[#F8FAFC] pt-20 pb-20 px-4 text-center overflow-hidden">
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

      <!-- Floating annotation tags -->
      <div class="hidden sm:block pointer-events-none select-none" aria-hidden="true">
        <div class="absolute left-[12%] top-[18%] -rotate-6 bg-white shadow-lg px-4 py-2.5 rounded-2xl border border-gray-150 text-[11px] font-bold tracking-widest text-blue-600 uppercase ann-tag" style="font-family:'Handlee',cursive;">
          🏆 real projects, real growth
        </div>
        <div class="absolute right-[10%] top-[14%] rotate-6 bg-white shadow-lg px-4 py-2.5 rounded-2xl border border-gray-150 text-[11px] font-bold tracking-widest text-blue-600 uppercase ann-tag" style="font-family:'Handlee',cursive;">
          🌱 student-first always
        </div>
        <div class="absolute left-[8%] top-[38%] rotate-12 bg-white shadow-lg px-4 py-2.5 rounded-2xl border border-gray-150 text-[11px] font-bold tracking-widest text-blue-600 uppercase ann-tag" style="font-family:'Handlee',cursive;">
          💡 learn by doing
        </div>
        <div class="absolute right-[8%] top-[40%] -rotate-9 bg-white shadow-lg px-4 py-2.5 rounded-2xl border border-gray-150 text-[11px] font-bold tracking-widest text-blue-600 uppercase ann-tag" style="font-family:'Handlee',cursive;">
          🤝 community > competition
        </div>
      </div>

      <div class="relative z-10 max-w-4xl mx-auto">
        <h1 class="text-[2.4rem] sm:text-6xl md:text-7xl font-extrabold text-gray-900 leading-[1.05] tracking-tight mb-6 about-title">
          Bridging Classrooms<br/>
          <span class="bg-linear-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">and Careers</span>
        </h1>
        <p class="max-w-sm sm:max-w-xl mx-auto text-gray-500 text-sm sm:text-base md:text-lg mb-12 leading-relaxed about-sub font-medium">
          Skill Sprint is a student-first learning ecosystem. We build projects, share mentor guidance, and forge solid portfolios — entirely peer-led, entirely free, and entirely real.
        </p>

        <!-- CTA area -->
        <div class="relative inline-flex flex-col sm:flex-row items-center justify-center gap-4 about-ctas">
          <router-link to="/contact-us">
            <button class="px-9 py-4 rounded-full bg-blue-600 text-white text-sm sm:text-base font-black hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl shadow-blue-200 cursor-pointer">
              Join the Sprint
            </button>
          </router-link>
          <router-link to="/community">
            <button class="px-9 py-4 rounded-full bg-white border border-gray-200 text-gray-700 text-sm sm:text-base font-black hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
              Our Community →
            </button>
          </router-link>

          <!-- Handdrawn Arrow overlay pointing to join -->
          <img src="/arrow2.png" class="hidden lg:block absolute left-[96%] top-[60%] w-16 opacity-75 rotate-12 pointer-events-none" alt="" />
        </div>
      </div>
    </section>

    <!-- ─── STATS (dark) ─── -->
    <section class="bg-[#0B101B] py-20 sm:py-28 px-4 relative overflow-hidden stats-section">
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-blue-600/6 blur-[150px] rounded-full"></div>
      </div>
      <div class="max-w-5xl mx-auto relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
        <div v-for="stat in stats" :key="stat.label" class="text-center stat-item group">
          <!-- Pulsing ring -->
          <div class="relative inline-flex items-center justify-center mb-5">
            <div class="absolute w-20 h-20 rounded-full border-2 border-blue-500/20 animate-ping group-hover:animate-none" style="animation-duration: 3s;"></div>
            <div class="relative w-16 h-16 rounded-[1.25rem] bg-white/[0.02] border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 transition-colors duration-300">
              <span class="text-2xl">{{ stat.icon }}</span>
            </div>
          </div>
          <p class="text-4xl sm:text-5xl font-black text-white mb-2 leading-none bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">{{ stat.value }}</p>
          <p class="text-gray-400 text-[10px] sm:text-xs font-black uppercase tracking-widest mt-1">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- ─── OUR STORY (light) ─── -->
    <section class="bg-[#F8FAFC] py-24 sm:py-32 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center story-section">
          <!-- Left: Story text -->
          <div class="story-left">
            <p class="text-blue-600 text-xs font-black uppercase tracking-widest mb-4">Our Origin</p>
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 leading-none">
              Started by Students,<br/>Built for Students.
            </h2>
            <div class="space-y-5">
              <p class="text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
                Skill Sprint started with a simple frustration: students were spending thousands on bootcamps, but still graduating without portfolio-ready experience. Two students in a campus lab decided to do something about it.
              </p>
              <p class="text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
                We organized our first sprint with 12 people, 2 weeks, and zero budget. Three teams shipped real projects. Word spread. More universities joined. MOUs were signed. The community grew to 500+ members across 11 universities.
              </p>
              <p class="text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
                Today, every sprint cycle produces real-world projects, verified portfolio pieces, and most importantly — a network of people who actually build together.
              </p>
            </div>

            <div class="flex items-center gap-4 mt-8">
              <div class="flex -space-x-3">
                <img v-for="(face, i) in founderFaces" :key="i" :src="face" class="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" />
              </div>
              <p class="text-sm font-bold text-gray-600">
                <span class="text-gray-900 font-black">500+ students</span> across 11 universities
              </p>
            </div>
          </div>

          <!-- Right: Staggered photo collage -->
          <div class="story-right">
            <div class="grid grid-cols-2 gap-4 h-full relative">
              <div class="space-y-4">
                <div class="bg-white p-3 rounded-[1.5rem] shadow-xl border border-gray-150 hover:-rotate-1 duration-300 cursor-pointer -rotate-3">
                  <div class="rounded-xl overflow-hidden aspect-[4/5] bg-gray-50">
                    <img src="/Long Group.jpg.jpeg" alt="Sprint community" class="w-full h-full object-cover" />
                  </div>
                  <div class="text-center mt-3 text-xs font-black text-gray-400 uppercase tracking-widest" style="font-family:'Handlee',cursive;">📸 launch kickoff</div>
                </div>
                <div class="bg-white p-3 rounded-[1.5rem] shadow-xl border border-gray-150 hover:rotate-1 duration-300 cursor-pointer rotate-3">
                  <div class="rounded-xl overflow-hidden aspect-square bg-gray-50">
                    <img src="/Speaker.jpg.jpeg" alt="Workshop speaker" class="w-full h-full object-cover" />
                  </div>
                  <div class="text-center mt-3 text-xs font-black text-gray-400 uppercase tracking-widest" style="font-family:'Handlee',cursive;">📷 core training</div>
                </div>
              </div>
              <div class="space-y-4 pt-8">
                <div class="bg-white p-3 rounded-[1.5rem] shadow-xl border border-gray-150 hover:rotate-0 duration-300 cursor-pointer rotate-2">
                  <div class="rounded-xl overflow-hidden aspect-square bg-gray-50">
                    <img src="/Short Group.jpg.jpeg" alt="Team formation" class="w-full h-full object-cover" />
                  </div>
                  <div class="text-center mt-3 text-xs font-black text-gray-400 uppercase tracking-widest" style="font-family:'Handlee',cursive;">📷 peer review</div>
                </div>
                <div class="bg-white p-3 rounded-[1.5rem] shadow-xl border border-gray-150 hover:rotate-0 duration-300 cursor-pointer -rotate-2">
                  <div class="rounded-xl overflow-hidden aspect-[4/5] bg-gray-50">
                    <img src="/Crowd.JPG.jpeg" alt="Sprint showcase" class="w-full h-full object-cover" />
                  </div>
                  <div class="text-center mt-3 text-xs font-black text-gray-400 uppercase tracking-widest" style="font-family:'Handlee',cursive;">📸 showcase day</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── PHILOSOPHY TIMELINE (light) ─── -->
    <section class="bg-white py-24 sm:py-32 px-4 border-y border-gray-150/70">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-20 timeline-header">
          <p class="text-blue-600 text-xs font-black uppercase tracking-widest mb-3">Philosophy</p>
          <h2 class="text-3xl sm:text-5xl font-extrabold tracking-tight leading-none mb-4 text-gray-900">Our Core Philosophy</h2>
          <p class="text-gray-500 text-sm sm:text-base font-medium max-w-sm mx-auto">
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
            <div class="absolute -left-[54px] sm:-left-[70px] top-6 w-10 h-10 rounded-2xl bg-blue-600 border-4 border-white shadow-lg flex items-center justify-center text-lg">
              {{ milestone.icon }}
            </div>

            <div class="bg-[#F8FAFC] rounded-[2rem] p-8 sm:p-10 border border-gray-150/80 shadow-[0_12px_35px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-blue-150 transition-all duration-300 group">
              <span class="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full mb-4 uppercase border border-blue-100 tracking-widest">
                Phase 0{{ i + 1 }} — {{ milestone.phase }}
              </span>
              <h3 class="text-xl sm:text-2xl font-extrabold text-gray-900 mb-3.5 leading-snug">{{ milestone.title }}</h3>
              <p class="text-gray-500 text-xs sm:text-sm leading-relaxed font-medium">{{ milestone.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── RECOGNITION (dark) ─── -->
    <section class="bg-[#0B101B] py-20 sm:py-24 px-4 recognition-section relative overflow-hidden border-b border-white/5">
      <div class="max-w-5xl mx-auto text-center relative z-10">
        <p class="text-gray-500 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-8">University Partners & Recognition</p>
        <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <div
            v-for="partner in partners"
            :key="partner"
            class="px-5 py-3 bg-white/[0.02] border border-white/10 rounded-full text-gray-400 font-bold text-xs sm:text-sm hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-300 partner-badge cursor-default"
          >
            {{ partner }}
          </div>
        </div>
      </div>
    </section>

    <!-- ─── CTA BANNER (dark continues) ─── -->
    <section class="bg-[#0B101B] pb-24 sm:pb-32 px-4 text-center relative overflow-hidden">
      <!-- Glow background -->
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-blue-600/10 blur-[110px] rounded-full"></div>
      </div>
      <div class="max-w-3xl mx-auto relative z-10 cta-block">
        <!-- Premium glass glow card -->
        <div class="bg-white/[0.02] border border-white/[0.08] rounded-[2.5rem] p-10 sm:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <h2 class="text-3xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight leading-none">"We Learn. We Sprint. We Grow."</h2>
          <p class="text-gray-400 text-sm sm:text-base md:text-lg mb-10 max-w-lg mx-auto leading-relaxed font-medium">
            Ready to jumpstart your developer journey? Connect with a sprint group today.
          </p>
          <router-link to="/contact-us">
            <button class="px-9 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-full shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer text-sm sm:text-base">
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
    .from('.about-ctas a', { scale: 0.85, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'back.out(1.8)' }, '-=0.8')

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
