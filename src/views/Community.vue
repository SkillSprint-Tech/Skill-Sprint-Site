<template>
  <div ref="communityScope" class="bg-[#F8FAFC] overflow-hidden font-sans">

    <!-- ─── HERO (dark panel) ─── -->
    <section class="bg-[#0B101B] pt-16 sm:pt-24 pb-20 sm:pb-28 px-4 overflow-hidden relative">
      <!-- High-tech grid texture -->
      <div class="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay" aria-hidden="true">
        <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="comm-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#comm-grid)" />
        </svg>
      </div>

      <!-- Map overlay for global community feel -->
      <img src="/mapremovebg.png" class="absolute right-0 top-0 h-full w-auto opacity-[0.03] select-none pointer-events-none" alt="" />

      <!-- Glowing orbs -->
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-blue-600/15 blur-[160px] rounded-full"></div>
        <div class="absolute bottom-0 left-[15%] w-[400px] h-[300px] bg-indigo-500/10 blur-[110px] rounded-full"></div>
        <div class="absolute top-[35%] right-[5%] w-[350px] h-[250px] bg-blue-400/8 blur-[100px] rounded-full"></div>
      </div>

      <!-- Floating annotation tags -->
      <div class="hidden sm:block pointer-events-none select-none" aria-hidden="true">
        <div class="absolute left-[10%] top-[20%] -rotate-6 bg-white/5 backdrop-blur-md shadow-2xl px-4 py-2 rounded-full border border-white/10 text-[11px] font-black tracking-widest text-blue-300 uppercase ann-tag" style="font-family:'Handlee',cursive;">
          🔥 500+ active members
        </div>
        <div class="absolute right-[8%] top-[15%] rotate-6 bg-white/5 backdrop-blur-md shadow-2xl px-4 py-2 rounded-full border border-white/10 text-[11px] font-black tracking-widest text-blue-300 uppercase ann-tag" style="font-family:'Handlee',cursive;">
          💬 discord never sleeps
        </div>
        <div class="absolute left-[6%] top-[55%] rotate-12 bg-white/5 backdrop-blur-md shadow-2xl px-4 py-2 rounded-full border border-white/10 text-[11px] font-black tracking-widest text-blue-300 uppercase ann-tag" style="font-family:'Handlee',cursive;">
          🤝 real teammates, real projects
        </div>
        <div class="absolute right-[7%] top-[55%] -rotate-9 bg-white/5 backdrop-blur-md shadow-2xl px-4 py-2 rounded-full border border-white/10 text-[11px] font-black tracking-widest text-blue-300 uppercase ann-tag" style="font-family:'Handlee',cursive;">
          🚀 build → ship → repeat
        </div>
      </div>

      <div class="max-w-4xl mx-auto relative z-10 text-center">
        <!-- Sprint streak badge -->
        <div class="inline-flex items-center gap-2.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-black px-5 py-2.5 rounded-full mb-8 uppercase tracking-widest comm-badge">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Community Sprint Season Active
        </div>

        <h1 class="text-[2.6rem] sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-6 comm-title">
          We Sprint<br />
          <span class="bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 bg-clip-text text-transparent">Together.</span>
        </h1>
        <p class="max-w-sm sm:max-w-2xl mx-auto text-gray-400 text-sm sm:text-base md:text-lg mb-10 leading-relaxed comm-sub">
          Join a vibrant ecosystem of student developers, designers, and creators who collaborate to build projects, hold workshops, and grow together — all peer-led, all free.
        </p>

        <!-- CTA and Handdrawn Arrow -->
        <div class="relative inline-flex flex-col sm:flex-row items-center justify-center gap-4 comm-ctas w-full">
          <a href="https://discord.gg/invite" target="_blank" class="w-full sm:w-auto">
            <button class="w-full sm:w-auto px-8 py-3.5 rounded-full bg-blue-600 text-white text-sm sm:text-base font-bold hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2">
              💬 Join Discord
            </button>
          </a>
          <router-link to="/sprints" class="w-full sm:w-auto">
            <button class="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/5 border border-white/15 text-white text-sm sm:text-base font-bold hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
              Browse Sprints →
            </button>
          </router-link>

          <!-- Handdrawn Arrow pointing to discord btn -->
          <img src="/arrow2.png" class="hidden lg:block absolute left-[22%] top-[100%] w-16 opacity-70 -rotate-12 pointer-events-none" alt="" />
        </div>

        <!-- Mini stats row with glowing background border -->
        <div class="inline-flex items-center justify-center gap-6 sm:gap-14 mt-16 px-8 sm:px-14 py-6 bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm rounded-3xl comm-stats">
          <div class="text-center">
            <p class="text-2xl sm:text-3.5xl font-black text-white">500+</p>
            <p class="text-gray-500 text-[10px] sm:text-xs font-black uppercase tracking-widest mt-1">Members</p>
          </div>
          <div class="w-px h-10 bg-white/10"></div>
          <div class="text-center">
            <p class="text-2xl sm:text-3.5xl font-black text-white">45+</p>
            <p class="text-gray-500 text-[10px] sm:text-xs font-black uppercase tracking-widest mt-1">Projects</p>
          </div>
          <div class="w-px h-10 bg-white/10"></div>
          <div class="text-center">
            <p class="text-2xl sm:text-3.5xl font-black text-white">12+</p>
            <p class="text-gray-500 text-[10px] sm:text-xs font-black uppercase tracking-widest mt-1">Workshops</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── TECH MARQUEE (Modernized) ─── -->
    <div class="bg-white border-y border-gray-100/80 py-5 overflow-hidden">
      <div class="marquee-track flex gap-0 whitespace-nowrap">
        <div class="marquee-content flex items-center gap-6 px-6 shrink-0" v-for="n in 3" :key="n">
          <span v-for="tech in techStack" :key="tech.name + n" class="inline-flex items-center gap-2.5 text-xs font-bold text-gray-600 px-5 py-2 rounded-full bg-[#F8FAFC] border border-gray-100 hover:border-blue-500/20 hover:bg-white transition duration-200">
            <span class="text-sm">{{ tech.icon }}</span> {{ tech.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- ─── EVENTS + PILLARS GRID ─── -->
    <section class="bg-[#F8FAFC] py-20 sm:py-28 px-4 relative">
      <div class="max-w-6xl mx-auto">

        <!-- Section header -->
        <div class="text-center mb-16 events-header">
          <p class="text-blue-600 text-xs font-black uppercase tracking-widest mb-3">Community Calendar</p>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-none">Upcoming Events</h2>
          <p class="text-gray-500 text-sm sm:text-base mt-4 max-w-md mx-auto font-medium">Real events, real deadlines, real people showing up.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <!-- Events (2 cols) -->
          <div class="lg:col-span-2 events-col">
            <div class="space-y-6">
              <div
                v-for="event in events"
                :key="event.title"
                class="flex flex-col sm:flex-row gap-5 p-6 rounded-3xl bg-white border border-gray-100/80 hover:border-blue-100 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.08)] group event-card cursor-pointer"
              >
                <!-- Date block with nice rounded square -->
                <div class="bg-blue-600 text-white font-black w-full sm:w-20 h-20 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform duration-300">
                  <span class="text-xl font-extrabold leading-none mb-0.5">{{ event.date.split(' ')[0] }}</span>
                  <span class="text-[9px] font-black uppercase tracking-widest opacity-80">{{ event.date.split(' ')[1] }}</span>
                </div>
                <!-- Content -->
                <div class="flex-1 flex flex-col justify-between">
                  <div>
                    <div class="flex items-start justify-between gap-3 mb-2">
                      <h3 class="text-base sm:text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{{ event.title }}</h3>
                      <span class="shrink-0 inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full" 
                            :class="event.type === 'Online' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-purple-50 text-purple-600 border border-purple-100'">
                        <span class="w-1.5 h-1.5 rounded-full" :class="event.type === 'Online' ? 'bg-emerald-500' : 'bg-purple-500'"></span>
                        {{ event.type }}
                      </span>
                    </div>
                    <p class="text-gray-500 text-sm mb-4 leading-relaxed font-medium">{{ event.desc }}</p>
                  </div>
                  <div class="flex items-center justify-between gap-3 flex-wrap border-t border-gray-50 pt-3">
                    <span class="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100/50">
                      ⏰ {{ event.time }}
                    </span>
                    <span class="text-xs text-gray-400 font-bold flex items-center gap-1">
                      👤 {{ event.host }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pillars (1 col) - Dark premium layout -->
          <div class="pillars-col">
            <div class="bg-[#0B101B] rounded-3xl p-6 sm:p-8 h-full shadow-2xl relative overflow-hidden border border-white/5">
              <!-- Glow behind pillars title -->
              <div class="absolute top-0 left-0 w-24 h-24 bg-blue-500/10 blur-xl rounded-full"></div>
              
              <div class="flex items-center gap-3.5 mb-8 relative z-10">
                <div class="w-9 h-9 bg-blue-600/10 border border-blue-500/30 rounded-xl flex items-center justify-center text-sm">🚀</div>
                <h2 class="text-xl font-extrabold text-white">Core Pillars</h2>
              </div>
              <div class="space-y-5 relative z-10">
                <div
                  v-for="pillar in pillars"
                  :key="pillar.title"
                  class="flex gap-4 p-4.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/20 hover:bg-blue-600/5 transition duration-300 pillar-card"
                >
                  <div class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 text-base shadow-md shadow-blue-500/20">
                    {{ pillar.icon }}
                  </div>
                  <div>
                    <h4 class="font-bold text-white mb-1.5 text-sm">{{ pillar.title }}</h4>
                    <p class="text-gray-400 text-xs leading-relaxed font-medium">{{ pillar.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── DISCORD CTA (dark) ─── -->
    <section class="bg-[#0B101B] py-20 sm:py-28 px-4 relative overflow-hidden discord-section">
      <!-- Background decoration -->
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-indigo-600/10 blur-[130px] rounded-full"></div>
      </div>
      <div class="max-w-4xl mx-auto relative z-10">
        <div class="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <!-- Left -->
          <div class="flex-1 text-center md:text-left discord-left">
            <div class="inline-flex items-center gap-2 bg-[#5865F2]/10 border border-[#5865F2]/20 text-[#8ea1e1] text-xs font-black px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
              💬 Open Community
            </div>
            <h2 class="text-3.5xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5 leading-[1.1]">
              Your people are<br /><span class="text-[#8ea1e1]">on Discord.</span>
            </h2>
            <p class="text-gray-400 text-sm sm:text-base mb-8 max-w-md leading-relaxed font-medium">
              Get help at 2am, find a project partner, share wins, review code, and join live voice sessions — all in one place.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start relative">
              <a href="https://discord.gg/invite" target="_blank" class="w-full sm:w-auto">
                <button class="w-full sm:w-auto px-8 py-3.5 bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold rounded-full transition shadow-xl shadow-[#5865F2]/20 hover:scale-105 active:scale-95 cursor-pointer text-sm">
                  💬 Join the Server
                </button>
              </a>
              <router-link to="/community" class="w-full sm:w-auto">
                <button class="w-full sm:w-auto px-8 py-3.5 bg-white/5 border border-white/15 text-white hover:bg-white/10 font-bold rounded-full transition cursor-pointer text-sm">
                  Learn More
                </button>
              </router-link>

              <!-- Arrow element pointing to CTA -->
              <img src="/arrow.png" class="hidden md:block absolute left-[56%] top-[100%] w-16 opacity-60 -rotate-12 pointer-events-none" alt="" />
            </div>
          </div>
          <!-- Right: Discord server preview card -->
          <div class="flex-shrink-0 w-full md:w-80 discord-card">
            <!-- Simulated Discord OS window -->
            <div class="bg-[#2f3136] rounded-2xl overflow-hidden shadow-2xl border border-white/5">
              <!-- Header window controls -->
              <div class="bg-[#202225] px-4 py-2 flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></span>
                <span class="text-gray-500 text-[10px] font-black uppercase tracking-widest ml-auto">VUE CLIENT</span>
              </div>
              <div class="p-5">
                <div class="flex items-center gap-3 mb-5 pb-4 border-b border-white/5">
                  <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md">SS</div>
                  <div>
                    <p class="text-white font-extrabold text-sm">Skill Sprint</p>
                    <div class="flex items-center gap-1.5">
                      <span class="relative flex h-1.5 w-1.5">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      <span class="text-gray-400 text-[11px] font-semibold">512 online</span>
                    </div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div v-for="channel in discordChannels" :key="channel.name" class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 cursor-pointer transition">
                    <span class="text-gray-500 text-lg font-medium">#</span>
                    <span class="text-gray-300 text-xs sm:text-sm font-bold">{{ channel.name }}</span>
                    <span v-if="channel.active" class="ml-auto w-2 h-2 bg-blue-500 rounded-full"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── IMPACT GALLERY (light) ─── -->
    <section class="bg-[#F8FAFC] py-20 sm:py-28 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16 gallery-header">
          <p class="text-blue-600 text-xs font-black uppercase tracking-widest mb-3">Community Moments</p>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-none">Sprint Life in Photos</h2>
        </div>
        
        <!-- Polaroid stack fanned layout -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 gallery-grid">
          <div
            v-for="(photo, i) in galleryPhotos"
            :key="i"
            class="bg-white p-3 rounded-2xl shadow-xl border border-gray-100/50 hover:shadow-2xl transition-all duration-300 gallery-item cursor-pointer"
            :class="[
              i === 0 ? 'md:row-span-2 md:rotate-2' : '',
              i === 1 ? 'md:-rotate-2' : '',
              i === 2 ? 'md:rotate-3 md:translate-y-4' : '',
              i === 3 ? 'md:-rotate-1' : ''
            ]"
          >
            <div class="overflow-hidden rounded-xl aspect-[4/5] md:aspect-auto h-full relative group bg-gray-50">
              <img :src="photo.src" :alt="photo.alt" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" loading="lazy" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span class="text-white text-xs font-bold leading-tight">{{ photo.caption }}</span>
              </div>
            </div>
            <div class="mt-3 text-center text-xs font-black text-gray-400 uppercase tracking-widest" style="font-family:'Handlee',cursive;">
              📷 moment {{ i + 1 }}
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGSAP } from '../composables/useGSAP'

const communityScope = ref(null)

const techStack = [
  { icon: '⚡', name: 'Vue 3' },
  { icon: '🎨', name: 'Figma' },
  { icon: '🔥', name: 'Firebase' },
  { icon: '🟢', name: 'Node.js' },
  { icon: '✨', name: 'GSAP' },
  { icon: '🧩', name: 'Supabase' },
  { icon: '📱', name: 'React Native' },
  { icon: '🛡️', name: 'TypeScript' },
  { icon: '🐙', name: 'GitHub' },
  { icon: '🌊', name: 'TailwindCSS' },
  { icon: '🤖', name: 'Python' },
  { icon: '🧪', name: 'Vitest' },
]

const events = [
  {
    date: '18 July',
    title: 'Intro to Vue 3 & GSAP Animations',
    desc: 'Learn how to construct reactive web applications and create complex scroll animations cleanly.',
    time: '6:00 PM – 7:30 PM',
    type: 'Online',
    host: 'Hosted by Bilal Ahmed'
  },
  {
    date: '25 July',
    title: 'Skill Sprint Project Kickoff',
    desc: 'Pitch your project ideas, form cross-functional groups, and align on goals for the next sprint cycle.',
    time: '4:00 PM – 6:00 PM',
    type: 'In-Person',
    host: 'Seminar Room 3'
  },
  {
    date: '02 Aug',
    title: 'Portfolio Review & Mentorship Hour',
    desc: 'Share your latest project dashboards and code repos with senior developers for targeted advice.',
    time: '5:30 PM – 7:00 PM',
    type: 'Online',
    host: 'Discord Voice Channel'
  },
  {
    date: '10 Aug',
    title: 'Design Systems Workshop',
    desc: 'Build a proper component library from scratch using Figma tokens and Vue composables.',
    time: '3:00 PM – 5:00 PM',
    type: 'Online',
    host: 'Hosted by Sarah Joseph'
  }
]

const pillars = [
  { icon: '🤝', title: 'Peer-to-Peer Help',       desc: 'We are all learning. No request is too simple. Ask questions and help others when stuck.' },
  { icon: '⚡', title: 'Speed & Execution',        desc: 'Progress beats perfection. Focus on building MVPs, ship quickly, and iterate on feedback.' },
  { icon: '🧩', title: 'Cross-Disciplinary Magic', desc: 'Teams succeed when designers, managers, and engineers mix. Respect all skills.' },
  { icon: '🌍', title: 'Open to Everyone',          desc: 'No paywalls. No gatekeeping. Just passionate students who want to build real things.' },
]

const discordChannels = [
  { name: 'general', active: true },
  { name: 'project-showcase', active: false },
  { name: 'help-me-please', active: true },
  { name: 'sprint-alpha', active: false },
  { name: 'design-feedback', active: false },
]

const galleryPhotos = [
  { src: '/Long Group.jpg.jpeg', alt: 'Large Skill Sprint community group', caption: 'Community Sprint Kickoff' },
  { src: '/Speaker.jpg.jpeg', alt: 'Speaker at Skill Sprint event', caption: 'Workshop Session' },
  { src: '/Short Group.jpg.jpeg', alt: 'Group of students', caption: 'Team Formation Night' },
  { src: '/Crowd.JPG.jpeg', alt: 'Skill Sprint crowd', caption: 'Sprint Showcase Day' },
]

useGSAP((self) => {
  const { gsap } = self

  // Hero entrance
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  tl.from('.comm-badge', { scale: 0, opacity: 0, duration: 0.8, ease: 'back.out(2)' })
    .from('.comm-title', { y: 80, opacity: 0, duration: 1.4, skewY: 2 }, '-=0.4')
    .from('.comm-sub',   { y: 30, opacity: 0, duration: 1.1 }, '-=1.0')
    .from('.comm-ctas a, .comm-ctas a + a', { scale: 0.85, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'back.out(1.8)' }, '-=0.8')
    .from('.comm-stats > *', { y: 20, opacity: 0, duration: 0.7, stagger: 0.12 }, '-=0.5')

  // Floating annotation tags
  const tags = gsap.utils.toArray('.ann-tag')
  tags.forEach((tag, i) => {
    gsap.from(tag, { scale: 0, opacity: 0, duration: 1, delay: 0.8 + i * 0.12, ease: 'back.out(2)' })
    gsap.to(tag, { y: '+=12', x: i % 2 === 0 ? '+=5' : '-=5', rotation: i % 2 === 0 ? '+=2' : '-=2', duration: 2.5 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.2 })
  })

  // Events section header
  gsap.from('.events-header', {
    scrollTrigger: { trigger: '.events-header', start: 'top 95%', once: true },
    immediateRender: false, y: 40, opacity: 0, duration: 1, ease: 'power3.out'
  })

  // Events column
  gsap.from('.events-col', {
    scrollTrigger: { trigger: '.events-col', start: 'top 95%', once: true },
    immediateRender: false, x: -50, opacity: 0, duration: 1.2, ease: 'power3.out'
  })

  // Event cards stagger
  gsap.from('.event-card', {
    scrollTrigger: { trigger: '.events-col', start: 'top 95%', once: true },
    immediateRender: false, y: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.2
  })

  // Pillars column
  gsap.from('.pillars-col', {
    scrollTrigger: { trigger: '.pillars-col', start: 'top 95%', once: true },
    immediateRender: false, x: 50, opacity: 0, duration: 1.2, ease: 'power3.out'
  })
  gsap.from('.pillar-card', {
    scrollTrigger: { trigger: '.pillars-col', start: 'top 95%', once: true },
    immediateRender: false, y: 30, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.3
  })

  // Discord section
  gsap.from('.discord-left', {
    scrollTrigger: { trigger: '.discord-section', start: 'top 95%', once: true },
    immediateRender: false, x: -60, opacity: 0, duration: 1.2, ease: 'power3.out'
  })
  gsap.from('.discord-card', {
    scrollTrigger: { trigger: '.discord-section', start: 'top 95%', once: true },
    immediateRender: false, x: 60, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.15
  })

  // Gallery
  gsap.from('.gallery-header', {
    scrollTrigger: { trigger: '.gallery-header', start: 'top 95%', once: true },
    immediateRender: false, y: 40, opacity: 0, duration: 1, ease: 'power3.out'
  })
  gsap.from('.gallery-item', {
    scrollTrigger: { trigger: '.gallery-grid', start: 'top 95%', once: true },
    immediateRender: false, y: 60, opacity: 0, scale: 0.95, duration: 1, stagger: 0.1, ease: 'back.out(1.4)'
  })
}, communityScope)
</script>

<style scoped>
/* Marquee animation */
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 30s linear infinite;
}
.marquee-track:hover {
  animation-play-state: paused;
}
@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-33.333%); }
}
</style>
