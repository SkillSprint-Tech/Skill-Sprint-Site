<template>
  <div ref="aboutScope" class="bg-[#F8FAFC] overflow-hidden font-sans">

    <!-- ─── HERO ─── -->
    <section class="relative bg-[#F8FAFC] pt-14 pb-16 px-4 text-center overflow-hidden">
      <!-- Floating annotation tags (same style as Hero.vue) -->
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
          Skill Sprint is a student-first learning ecosystem. We build projects, share mentor guidance, and forge solid portfolios — entirely peer-led and free.
        </p>
        <div class="flex flex-row items-center justify-center gap-3 about-ctas">
          <router-link to="/contact-us">
            <button class="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-blue-600 text-white text-sm sm:text-base font-semibold hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-blue-200 cursor-pointer">
              Join the Sprint
            </button>
          </router-link>
          <router-link to="/community">
            <button class="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-white border border-gray-300 text-gray-700 text-sm sm:text-base font-semibold hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
              Our Community
            </button>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ─── STATS ─── -->
    <section class="bg-[#0B101B] py-14 sm:py-20 px-4">
      <div class="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        <div v-for="stat in stats" :key="stat.label" class="text-center stat-item">
          <p class="text-4xl sm:text-5xl font-black text-blue-400 mb-2">{{ stat.value }}</p>
          <p class="text-gray-400 text-xs sm:text-sm font-semibold uppercase tracking-widest">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- ─── PHILOSOPHY TIMELINE ─── -->
    <section class="bg-[#F8FAFC] py-20 sm:py-28 px-4">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-16 timeline-header">
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
            <!-- Dot marker -->
            <div class="absolute -left-[49px] sm:-left-[65px] top-2 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow ring-4 ring-blue-100 flex items-center justify-center">
            </div>

            <div class="bg-white rounded-2xl p-7 sm:p-9 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-shadow duration-300">
              <span class="inline-block px-3.5 py-1 bg-blue-50 text-blue-600 text-[11px] font-black rounded-full mb-4 uppercase border border-blue-100 tracking-widest">
                Phase 0{{ i + 1 }} — {{ milestone.phase }}
              </span>
              <h3 class="text-xl sm:text-2xl font-extrabold text-gray-900 mb-3">{{ milestone.title }}</h3>
              <p class="text-gray-500 text-sm sm:text-base leading-relaxed font-medium">
                {{ milestone.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── CTA BANNER (dark, matching Whysection palette) ─── -->
    <section class="bg-[#0B101B] py-20 px-4 text-center">
      <div class="max-w-2xl mx-auto cta-block">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">"We Learn. We Sprint. We Grow."</h2>
        <p class="text-gray-400 text-base mb-8 max-w-md mx-auto leading-relaxed">
          Ready to jumpstart your developer journey? Connect with a sprint group today.
        </p>
        <router-link to="/contact-us">
          <button class="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
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
  { value: '45+',  label: 'Projects Completed' },
  { value: '12+',  label: 'Tech Workshops' },
  { value: '100%', label: 'Student-Driven' },
]

const milestones = [
  {
    phase: 'We Learn',
    title: 'Acquire Practical, Industry Skills',
    desc: 'Through targeted, peer-led workshops we focus on technologies the industry actually uses. No outdated concepts — just modern engineering.'
  },
  {
    phase: 'We Sprint',
    title: 'Build Under Tight Deadlines in Teams',
    desc: 'We group developers, designers, and project managers together to build functional apps over short focused sprints. You learn teamwork, Git collaboration, and speed.'
  },
  {
    phase: 'We Grow',
    title: 'Launch Portfolios & Launch Careers',
    desc: 'By building a verified portfolio of shipped products, students establish actual proof of expertise — making landing internships and jobs a natural outcome.'
  }
]

useGSAP((self) => {
  const { gsap } = self

  // Hero entrance timeline
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  tl.from('.about-title', { y: 80, opacity: 0, duration: 1.4, skewY: 2 })
    .from('.about-sub',   { y: 30, opacity: 0, duration: 1.1 }, '-=1.0')
    .from('.about-ctas a', { scale: 0.85, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'back.out(1.8)' }, '-=0.8')

  // Floating annotation tags
  const tags = gsap.utils.toArray('.ann-tag')
  tags.forEach((tag, i) => {
    gsap.from(tag, { scale: 0, opacity: 0, duration: 1, delay: 0.7 + i * 0.12, ease: 'back.out(2)' })
    gsap.to(tag, { y: '+=10', x: i % 2 === 0 ? '+=4' : '-=4', rotation: i % 2 === 0 ? '+=2' : '-=2', duration: 2.2 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.2 })
  })

  // Stats section scroll reveal
  gsap.from('.stat-item', {
    scrollTrigger: { trigger: '.stat-item', start: 'top 80%', toggleActions: 'play none none reverse' },
    y: 50, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out'
  })

  // Timeline header
  gsap.from('.timeline-header', {
    scrollTrigger: { trigger: '.timeline-header', start: 'top 80%', toggleActions: 'play none none reverse' },
    y: 40, opacity: 0, duration: 1, ease: 'power3.out'
  })

  // Timeline milestone items
  gsap.utils.toArray('.milestone-item').forEach((item) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 82%', toggleActions: 'play none none reverse' },
      x: -60, opacity: 0, duration: 1.1, ease: 'power3.out'
    })
  })

  // CTA block
  gsap.from('.cta-block', {
    scrollTrigger: { trigger: '.cta-block', start: 'top 80%', toggleActions: 'play none none reverse' },
    y: 50, opacity: 0, duration: 1, ease: 'power3.out'
  })
}, aboutScope)
</script>
