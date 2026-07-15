<template>
  <div ref="communityScope" class="bg-[#F8FAFC] overflow-hidden font-sans">

    <!-- ─── HERO (dark panel) ─── -->
    <section class="bg-[#0B101B] pt-16 sm:pt-24 pb-20 sm:pb-28 px-4 overflow-hidden relative">
      <!-- Glowing orbs -->
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div class="absolute bottom-0 left-[20%] w-[350px] h-[250px] bg-indigo-500/8 blur-[90px] rounded-full"></div>
        <div class="absolute top-[30%] right-[10%] w-[250px] h-[200px] bg-blue-400/6 blur-[80px] rounded-full"></div>
      </div>

      <!-- Floating annotation tags -->
      <div class="hidden sm:block pointer-events-none select-none" aria-hidden="true">
        <div class="absolute left-[10%] top-[20%] -rotate-6 bg-white/10 backdrop-blur-sm shadow-sm px-3 py-1.5 rounded-full border border-white/20 text-[11px] font-medium tracking-wide text-white/70 ann-tag" style="font-family:'Handlee',cursive;">
          🔥 500+ active members
        </div>
        <div class="absolute right-[8%] top-[15%] rotate-6 bg-white/10 backdrop-blur-sm shadow-sm px-3 py-1.5 rounded-full border border-white/20 text-[11px] font-medium tracking-wide text-white/70 ann-tag" style="font-family:'Handlee',cursive;">
          💬 discord never sleeps
        </div>
        <div class="absolute left-[6%] top-[55%] rotate-12 bg-white/10 backdrop-blur-sm shadow-sm px-3 py-1.5 rounded-full border border-white/20 text-[11px] font-medium tracking-wide text-white/70 ann-tag" style="font-family:'Handlee',cursive;">
          🤝 real teammates, real projects
        </div>
        <div class="absolute right-[7%] top-[55%] -rotate-9 bg-white/10 backdrop-blur-sm shadow-sm px-3 py-1.5 rounded-full border border-white/20 text-[11px] font-medium tracking-wide text-white/70 ann-tag" style="font-family:'Handlee',cursive;">
          🚀 build → ship → repeat
        </div>
      </div>

      <div class="max-w-4xl mx-auto relative z-10 text-center">
        <!-- Sprint streak badge -->
        <div class="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-black px-4 py-2 rounded-full mb-8 uppercase tracking-widest comm-badge">
          <span class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
          Community Sprint Season Active
        </div>

        <h1 class="text-[2.4rem] sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-5 comm-title">
          We Sprint<br />
          <span class="text-blue-400">Together.</span>
        </h1>
        <p class="max-w-sm sm:max-w-xl mx-auto text-gray-400 text-sm sm:text-base md:text-lg mb-10 leading-relaxed comm-sub">
          Join a vibrant ecosystem of student developers, designers, and creators who collaborate to build projects, hold workshops, and grow together — all peer-led, all free.
        </p>
        <div class="flex flex-row items-center justify-center gap-3 comm-ctas">
          <a href="https://discord.gg/invite" target="_blank">
            <button class="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-blue-600 text-white text-sm sm:text-base font-semibold hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-blue-500/30 cursor-pointer flex items-center gap-2">
              💬 Join Discord
            </button>
          </a>
          <router-link to="/sprints">
            <button class="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-white/10 border border-white/20 text-white text-sm sm:text-base font-semibold hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
              Browse Sprints →
            </button>
          </router-link>
        </div>

        <!-- Mini stats row -->
        <div class="flex items-center justify-center gap-8 sm:gap-14 mt-12 comm-stats">
          <div class="text-center">
            <p class="text-2xl sm:text-3xl font-black text-white">500+</p>
            <p class="text-gray-500 text-xs font-semibold uppercase tracking-widest mt-1">Members</p>
          </div>
          <div class="w-px h-10 bg-white/10"></div>
          <div class="text-center">
            <p class="text-2xl sm:text-3xl font-black text-white">45+</p>
            <p class="text-gray-500 text-xs font-semibold uppercase tracking-widest mt-1">Projects</p>
          </div>
          <div class="w-px h-10 bg-white/10"></div>
          <div class="text-center">
            <p class="text-2xl sm:text-3xl font-black text-white">12+</p>
            <p class="text-gray-500 text-xs font-semibold uppercase tracking-widest mt-1">Workshops</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── TECH MARQUEE ─── -->
    <div class="bg-white border-y border-gray-100 py-4 overflow-hidden">
      <div class="marquee-track flex gap-0 whitespace-nowrap">
        <div class="marquee-content flex items-center gap-6 px-6 shrink-0" v-for="n in 3" :key="n">
          <span v-for="tech in techStack" :key="tech.name + n" class="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 px-4 py-1.5 rounded-full bg-gray-50 border border-gray-200">
            <span>{{ tech.icon }}</span> {{ tech.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- ─── EVENTS + PILLARS GRID ─── -->
    <section class="bg-[#F8FAFC] py-20 sm:py-28 px-4">
      <div class="max-w-6xl mx-auto">

        <!-- Section header -->
        <div class="text-center mb-14 events-header">
          <p class="text-blue-600 text-xs font-black uppercase tracking-widest mb-3">Community Calendar</p>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Upcoming Events</h2>
          <p class="text-gray-500 text-base mt-3 max-w-md mx-auto">Real events, real deadlines, real people showing up.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <!-- Events (2 cols) -->
          <div class="lg:col-span-2 events-col">
            <div class="space-y-5">
              <div
                v-for="event in events"
                :key="event.title"
                class="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl bg-white hover:bg-blue-50/30 border border-gray-100 hover:border-blue-100 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.08)] group event-card cursor-pointer"
              >
                <!-- Date block -->
                <div class="bg-blue-600 text-white font-black w-full sm:w-20 h-16 rounded-xl flex flex-col items-center justify-center shrink-0 shadow-md shadow-blue-200 group-hover:scale-105 transition-transform duration-300">
                  <span class="text-base font-black leading-none">{{ event.date.split(' ')[0] }}</span>
                  <span class="text-[10px] uppercase tracking-widest">{{ event.date.split(' ')[1] }}</span>
                </div>
                <!-- Content -->
                <div class="flex-1">
                  <div class="flex items-start justify-between gap-2 mb-1.5">
                    <h3 class="text-base font-bold text-gray-900">{{ event.title }}</h3>
                    <span class="shrink-0 inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full" :class="event.type === 'Online' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-purple-50 text-purple-600 border border-purple-100'">
                      {{ event.type }}
                    </span>
                  </div>
                  <p class="text-gray-500 text-sm mb-3 leading-relaxed">{{ event.desc }}</p>
                  <div class="flex items-center gap-3 flex-wrap">
                    <span class="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100">
                      ⏰ {{ event.time }}
                    </span>
                    <span class="text-xs text-gray-400 font-medium">{{ event.host }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pillars (1 col) -->
          <div class="pillars-col">
            <div class="bg-[#0B101B] rounded-2xl p-6 sm:p-8 h-full shadow-2xl">
              <div class="flex items-center gap-2 mb-6">
                <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm">🚀</div>
                <h2 class="text-xl font-extrabold text-white">Core Pillars</h2>
              </div>
              <div class="space-y-5">
                <div
                  v-for="(pillar, idx) in pillars"
                  :key="pillar.title"
                  class="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-blue-600/5 transition duration-300 pillar-card"
                >
                  <div class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 text-base shadow-md shadow-blue-500/20">
                    {{ pillar.icon }}
                  </div>
                  <div>
                    <h4 class="font-bold text-white mb-1 text-sm">{{ pillar.title }}</h4>
                    <p class="text-gray-400 text-xs leading-relaxed">{{ pillar.desc }}</p>
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
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/8 blur-[120px] rounded-full"></div>
      </div>
      <div class="max-w-4xl mx-auto relative z-10">
        <div class="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <!-- Left -->
          <div class="flex-1 text-center md:text-left discord-left">
            <div class="inline-flex items-center gap-2 bg-[#5865F2]/20 border border-[#5865F2]/30 text-[#7289da] text-xs font-black px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
              💬 Open Community
            </div>
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-[1.1]">
              Your people are<br /><span class="text-[#7289da]">on Discord.</span>
            </h2>
            <p class="text-gray-400 text-base mb-8 max-w-md leading-relaxed">
              Get help at 2am, find a project partner, share wins, review code, and join live voice sessions — all in one place.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <a href="https://discord.gg/invite" target="_blank">
                <button class="px-8 py-3.5 bg-[#5865F2] hover:bg-[#4752c4] text-white font-semibold rounded-full transition shadow-lg shadow-[#5865F2]/20 hover:scale-105 active:scale-95 cursor-pointer text-sm">
                  💬 Join the Server
                </button>
              </a>
              <router-link to="/community">
                <button class="px-8 py-3.5 bg-white/10 border border-white/20 text-white hover:bg-white/20 font-semibold rounded-full transition cursor-pointer text-sm">
                  Learn More
                </button>
              </router-link>
            </div>
          </div>
          <!-- Right: Discord server preview card -->
          <div class="flex-shrink-0 w-full md:w-80 discord-card">
            <div class="bg-[#36393f] rounded-2xl p-5 shadow-2xl border border-white/5">
              <div class="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md">SS</div>
                <div>
                  <p class="text-white font-bold text-sm">Skill Sprint</p>
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 bg-emerald-400 rounded-full"></span>
                    <span class="text-gray-400 text-xs">512 online</span>
                  </div>
                </div>
              </div>
              <div class="space-y-2">
                <div v-for="channel in discordChannels" :key="channel.name" class="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition">
                  <span class="text-gray-500 text-base">#</span>
                  <span class="text-gray-300 text-sm font-medium">{{ channel.name }}</span>
                  <span v-if="channel.active" class="ml-auto w-2 h-2 bg-blue-500 rounded-full"></span>
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
        <div class="text-center mb-12 gallery-header">
          <p class="text-blue-600 text-xs font-black uppercase tracking-widest mb-3">Community Moments</p>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Sprint Life in Photos</h2>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 gallery-grid">
          <div
            v-for="(photo, i) in galleryPhotos"
            :key="i"
            class="relative overflow-hidden rounded-2xl bg-gray-200 gallery-item"
            :class="[i === 0 ? 'md:row-span-2 aspect-auto' : 'aspect-square']"
          >
            <img :src="photo.src" :alt="photo.alt" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
              <span class="text-white text-xs font-semibold">{{ photo.caption }}</span>
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
  const { gsap, ScrollTrigger } = self

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
