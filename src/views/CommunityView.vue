<template>
  <div ref="pageScope" class="overflow-x-hidden">

    <!-- ═══════════════════════════════════════ -->
    <!-- HERO -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="heroScope" class="relative bg-[#F8FAFC] pt-10 sm:pt-14 md:pt-20 pb-10 md:pb-16 text-center px-4 overflow-hidden">

      <!-- Floating Annotations -->
      <div class="hidden sm:block pointer-events-none select-none" aria-hidden="true">
        <div class="absolute left-4 md:left-[10%] lg:left-[16%] top-[16%] -rotate-6
                    bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" style="font-family: 'Handlee', cursive;">
          🏆 student builders
        </div>
        <div class="absolute right-4 md:right-[10%] lg:right-[16%] top-[12%] rotate-6
                    bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" style="font-family: 'Handlee', cursive;">
          🌍 11 universities
        </div>
        <div class="absolute left-2 md:left-[7%] lg:left-[12%] top-[30%] rotate-8
                    bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" style="font-family: 'Handlee', cursive;">
          💪🏼 flex but deserved
        </div>
        <div class="absolute right-2 md:right-[7%] lg:right-[12%] top-[28%] -rotate-4
                    bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200
                    text-[11px] font-medium tracking-wide text-gray-600 floating-tag" style="font-family: 'Handlee', cursive;">
          🔥 1500+ strong
        </div>
      </div>

      <div class="relative z-10">
        <h1 class="hero-heading text-[2.4rem] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-4">
          Built by Students,<br/>
          <span class="text-blue-600">For Students.</span>
        </h1>
        <p class="hero-sub max-w-xs sm:max-w-sm md:max-w-2xl mx-auto text-gray-500 text-sm sm:text-base md:text-lg mb-8 leading-relaxed px-2">
          A growing network of student engineers, mentors, and community builders shipping real code across 11 universities.
        </p>
        <div class="flex justify-center">
          <span class="inline-block bg-blue-50 text-blue-600 text-xs font-extrabold px-4 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest">
            Community
          </span>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- COMMUNITY STATS (Light Section) -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="statsScope" class="bg-slate-50 py-16 sm:py-20 md:py-28 px-4 sm:px-6 overflow-hidden border-y border-gray-100">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-start gap-6 mb-10 md:mb-14">
          <div>
            <h2 class="stats-heading text-gray-900 text-3xl sm:text-4xl font-extrabold tracking-tight">
              Our Damage So Far
            </h2>
            <p class="stats-sub text-gray-500 text-base sm:text-lg mt-2 font-medium">
              Proof we're not just talking
            </p>
          </div>
          <div class="flex flex-row gap-8 sm:gap-12 md:gap-16 w-full md:w-auto">
            <div v-for="stat in stats" :key="stat.label" class="flex flex-col stat-item">
              <span class="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 leading-none">
                {{ animatedValues[stat.label] }}+
              </span>
              <span class="text-sm sm:text-base md:text-lg font-extrabold text-gray-900 mt-1 uppercase">
                {{ stat.label }}
              </span>
              <span class="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-0.5">
                {{ stat.subtext }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- WALL OF FAME (Testimonials) -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="testimonialScope" class="bg-[#F8FAFC] py-16 sm:py-20 md:py-28 px-4 sm:px-6 overflow-hidden">
      <div class="max-w-3xl mx-auto text-center mb-12 md:mb-20 relative">
        <h2 class="wall-heading text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3">
          Student Receipts
        </h2>
        <p class="wall-sub text-gray-500 text-base sm:text-lg font-medium">
          Students said this. We didn't make it up.
        </p>
        <img src="/rightarrow.png" alt="" aria-hidden="true"
             class="hidden md:block absolute left-[20%] top-[80%] w-24 opacity-80 -rotate-12 pointer-events-none" />
      </div>

      <!-- Mobile: card list -->
      <div class="flex flex-col gap-4 max-w-sm mx-auto md:hidden w-full px-4">
        <div v-for="(t, i) in testimonials" :key="i"
             class="bg-white border border-gray-100 shadow-md p-6 rounded-2xl w-full testimonial-mobile">
          <p class="text-gray-600 text-[15px] leading-relaxed mb-5 italic">"{{ t.quote }}"</p>
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0" :class="t.avatarClass">
              {{ t.initials }}
            </div>
            <span class="text-sm font-bold text-gray-900">{{ t.name }}</span>
          </div>
        </div>
      </div>

      <!-- Desktop: fanned layout -->
      <div class="hidden md:block relative max-w-4xl mx-auto h-[580px] lg:h-[520px]">
        <div v-for="(t, i) in testimonials" :key="i"
             class="absolute bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.07)] p-7 rounded-[1.75rem]
                    transition-all duration-300 hover:scale-105 hover:z-50 hover:shadow-xl cursor-default testimonial-desktop"
             :style="t.desktopStyle">
          <p class="text-gray-600 text-[14px] leading-relaxed mb-5 italic">"{{ t.quote }}"</p>
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0" :class="t.avatarClass">
              {{ t.initials }}
            </div>
            <span class="text-sm font-bold text-gray-900">{{ t.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- EVENT GALLERY -->
    <!-- ═══════════════════════════════════════ -->
    <section ref="galleryScope" class="bg-[#F8FAFC] py-10 md:py-16 px-4 sm:px-6">
      <div class="max-w-3xl mx-auto text-center mb-10">
        <h2 class="gallery-heading text-gray-900 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
          Sprint Highlights
        </h2>
        <p class="gallery-sub text-gray-500 text-base sm:text-lg font-medium">
          Real events. Real people. Real code being written.
        </p>
      </div>

      <div class="w-full overflow-x-auto pb-3 -mx-4 px-4" style="-webkit-overflow-scrolling: touch; scrollbar-width: none;">
        <div class="flex gap-3 sm:gap-4 md:justify-center md:flex-wrap w-max md:w-full mx-auto flex-wrap">
          <div v-for="(img, i) in images" :key="i"
               class="gallery-card flex-shrink-0 w-[140px] sm:w-[180px] md:w-[260px] h-[100px] sm:h-[130px] md:h-[200px]
                      rounded-2xl md:rounded-3xl overflow-hidden bg-gray-200 border-2 border-white
                      shadow-lg transition-transform duration-300 hover:scale-[1.05]"
               :class="[
                 i === 0 ? 'md:rotate-2 md:translate-y-3' : '',
                 i === 1 ? 'md:-rotate-2' : '',
                 i === 2 ? 'md:rotate-3 md:translate-y-4' : '',
                 i === 3 ? 'md:-rotate-1' : '',
               ]">
            <img :src="img.src" :alt="img.alt" class="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!-- CTA -->
    <!-- ═══════════════════════════════════════ -->
    <section class="relative w-full bg-gradient-to-b from-[#F8FAFC] via-[#dceeff] to-[#b8d4f0] py-16 sm:py-20 overflow-hidden">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <div class="relative bg-white rounded-3xl shadow-lg px-6 sm:px-10 py-12 sm:py-16 text-center overflow-hidden cta-card">
          <div class="absolute right-0 bottom-0 pointer-events-none select-none" aria-hidden="true">
            <img src="/sidelogo.png" alt="" class="w-32 sm:w-48 md:w-64 h-auto object-contain opacity-90" style="transform: rotate(-15deg) translate(20%, 15%);" />
          </div>
          <div class="relative z-10">
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug mb-3">
              Become Part of the
              <span class="text-blue-600 relative inline-block ml-1">Network
                <span class="absolute left-0 -bottom-1 w-full h-[2px] bg-blue-500 rotate-[-2deg]"></span>
              </span>
            </h2>
            <p class="text-gray-500 mt-3 text-sm sm:text-base max-w-sm mx-auto leading-relaxed mb-6">
              Connect with student engineers building the future.
            </p>
            <div class="flex flex-wrap gap-3 sm:gap-4 justify-center items-center">
              <router-link to="/contact-us">
                <button class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold px-8 py-3 rounded-full text-sm transition-all duration-200 shadow-md shadow-blue-200 cursor-pointer">
                  Join the Sprint
                </button>
              </router-link>
              <router-link to="/contact-us">
                <button class="bg-white border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-700 font-semibold px-8 py-3 rounded-full text-sm transition-all duration-200 cursor-pointer">
                  Contact us
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useGSAP } from '../composables/useGSAP'

const pageScope = ref(null)
const heroScope = ref(null)
const statsScope = ref(null)
const testimonialScope = ref(null)
const galleryScope = ref(null)

// Stats data with animated counters
const stats = [
  { value: 1500, label: 'Students', subtext: 'Squad Expanding' },
  { value: 11,   label: 'Universities', subtext: 'MOUs Signed' },
  { value: 20,   label: 'Mentors', subtext: 'Grownups Who Help' },
]

const animatedValues = reactive({ Students: 0, Universities: 0, Mentors: 0 })
const statsSection = ref(null)
let hasAnimated = false

const animateCount = (label, target) => {
  let current = 0
  const steps = 80
  const increment = target / steps
  const interval = setInterval(() => {
    current += increment
    if (current >= target) {
      animatedValues[label] = target
      clearInterval(interval)
    } else {
      animatedValues[label] = Math.floor(current)
    }
  }, 18)
}

const handleScroll = () => {
  if (hasAnimated || !statsScope.value) return
  const rect = statsScope.value.getBoundingClientRect()
  if (rect.top < window.innerHeight - 80) {
    hasAnimated = true
    stats.forEach(s => animateCount(s.label, s.value))
    window.removeEventListener('scroll', handleScroll)
  }
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

// Testimonials data
const testimonials = [
  { quote: 'SkillSprint gave me my first real pull request experience. No classroom can replicate that feeling of shipping code.', name: 'Aisha K.', initials: 'AK', avatarClass: 'bg-blue-100 text-blue-600', desktopStyle: 'width:280px; top:30px; left:0; z-index:20; transform:rotate(-6deg);' },
  { quote: 'I went from watching tutorials to actually building and deploying. The mentorship framework changed everything for me.', name: 'Omar R.', initials: 'OR', avatarClass: 'bg-indigo-100 text-indigo-600', desktopStyle: 'width:310px; top:0; left:280px; z-index:30; transform:rotate(2deg);' },
  { quote: 'The bootcamps are intense but that\'s why they work. You come out actually knowing how to structure a real project.', name: 'Sara M.', initials: 'SM', avatarClass: 'bg-pink-100 text-pink-600', desktopStyle: 'width:280px; top:25px; right:0; z-index:20; transform:rotate(6deg);' },
  { quote: 'Being part of an open-source track as a freshman was intimidating but the peer reviews taught me more than any course ever did.', name: 'Hassan A.', initials: 'HA', avatarClass: 'bg-green-100 text-green-600', desktopStyle: 'width:285px; bottom:20px; left:50px; z-index:15; transform:rotate(-3deg);' },
  { quote: 'No paywalls, no gatekeeping. Just students helping students get better at engineering. That\'s rare.', name: 'Fatima Z.', initials: 'FZ', avatarClass: 'bg-orange-100 text-orange-600', desktopStyle: 'width:285px; bottom:20px; right:60px; z-index:15; transform:rotate(3deg);' },
]

// Event images
const images = [
  { src: '/Speaker.jpg.jpeg', alt: 'Speaker at Skill Sprint event' },
  { src: '/Short Group.jpg.jpeg', alt: 'Group of Skill Sprint students' },
  { src: '/Long Group.jpg.jpeg', alt: 'Large Skill Sprint community group' },
  { src: '/Crowd.JPG.jpeg', alt: 'Skill Sprint event crowd' },
]

// Unified Page Animations
useGSAP((self) => {
  const { gsap } = self

  // Hero animations
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  tl.from('.hero-heading', { y: 80, opacity: 0, duration: 1.4, skewY: 2 })
    .from('.hero-sub', { y: 30, opacity: 0, duration: 1.1 }, '-=1.0')

  const labels = self.selector('.floating-tag')
  labels.forEach((label, i) => {
    gsap.from(label, { scale: 0, opacity: 0, duration: 1, delay: 0.7 + i * 0.12, ease: 'back.out(2)' })
    gsap.to(label, { y: '+=10', x: i % 2 === 0 ? '+=4' : '-=4', rotation: i % 2 === 0 ? '+=2' : '-=2', duration: 2.2 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.2 })
  })

  // Stats animations
  gsap.from('.stats-heading', { scrollTrigger: { trigger: statsScope.value, start: 'top 80%', toggleActions: 'play none none reverse' }, y: 50, opacity: 0, duration: 1, ease: 'power3.out' })
  gsap.from('.stats-sub', { scrollTrigger: { trigger: statsScope.value, start: 'top 77%', toggleActions: 'play none none reverse' }, y: 35, opacity: 0, duration: 1, ease: 'power3.out' })
  
  const statItems = self.selector('.stat-item')
  if (statItems.length > 0) {
    gsap.from(statItems, { scrollTrigger: { trigger: statsScope.value, start: 'top 85%', toggleActions: 'play none none reverse' }, y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' })
  }

  // Testimonial animations
  gsap.from('.wall-heading', { scrollTrigger: { trigger: testimonialScope.value, start: 'top 80%', toggleActions: 'play none none reverse' }, y: 50, opacity: 0, duration: 1, ease: 'power3.out' })
  gsap.from('.wall-sub', { scrollTrigger: { trigger: testimonialScope.value, start: 'top 77%', toggleActions: 'play none none reverse' }, y: 35, opacity: 0, duration: 1, ease: 'power3.out' })

  const mobileTestimonials = self.selector('.testimonial-mobile')
  if (mobileTestimonials.length > 0) {
    gsap.from(mobileTestimonials, { scrollTrigger: { trigger: testimonialScope.value, start: 'top 85%', toggleActions: 'play none none reverse' }, y: 60, opacity: 0, scale: 0.92, duration: 0.9, stagger: 0.15, ease: 'power3.out' })
  }

  const desktopTestimonials = self.selector('.testimonial-desktop')
  if (desktopTestimonials.length > 0) {
    gsap.from(desktopTestimonials, { scrollTrigger: { trigger: testimonialScope.value, start: 'top 80%', toggleActions: 'play none none reverse' }, y: 80, opacity: 0, scale: 0.85, duration: 1.2, stagger: 0.12, ease: 'back.out(1.3)' })
  }

  // Gallery animations
  gsap.from('.gallery-heading', { scrollTrigger: { trigger: galleryScope.value, start: 'top 80%', toggleActions: 'play none none reverse' }, y: 50, opacity: 0, duration: 1, ease: 'power3.out' })
  gsap.from('.gallery-sub', { scrollTrigger: { trigger: galleryScope.value, start: 'top 77%', toggleActions: 'play none none reverse' }, y: 35, opacity: 0, duration: 1, ease: 'power3.out' })

  const galleryCards = self.selector('.gallery-card')
  if (galleryCards.length > 0) {
    gsap.from(galleryCards, {
      scrollTrigger: { trigger: galleryScope.value, start: 'top 85%', toggleActions: 'play none none reverse' },
      y: 120, rotation: (i) => [15, -15, 20, -10][i] || 0, opacity: 0, duration: 1.2, stagger: 0.12, ease: 'back.out(1.3)'
    })
  }
}, pageScope)
</script>

<style scoped>
div::-webkit-scrollbar { display: none; }
</style>
