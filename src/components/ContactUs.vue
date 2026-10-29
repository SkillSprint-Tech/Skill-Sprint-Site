<template>
  <div ref="pageScope" class="relative min-h-screen bg-[#F8FAFC] font-sans overflow-x-hidden">
    
    <!-- Ambient Tech Grid Background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div class="absolute inset-0 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.12]"></div>
      <div class="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-blue-500/12 blur-[140px] rounded-full"></div>
      <div class="absolute top-1/2 right-10 w-[450px] h-[450px] bg-indigo-500/10 blur-[130px] rounded-full"></div>
    </div>

    <!-- ── CONTACT FORM SECTION ── -->
    <section class="px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 relative z-10">
      <div class="max-w-7xl mx-auto">
        
        <!-- Main Spatial Container -->
        <div class="bg-white/90 backdrop-blur-xl rounded-3xl md:rounded-[2.5rem] p-4 sm:p-8 md:p-10 shadow-[0_20px_70px_rgba(37,99,235,0.08)] border border-slate-200/80">
          <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            <!-- LEFT PANEL - Blue Spatial Info (Shown on Tablet & Desktop) -->
            <div class="contact-left-panel bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 rounded-3xl p-8 sm:p-10 md:p-12 text-white flex flex-col justify-between
                        w-full lg:w-[480px] min-h-[520px] lg:min-h-[740px] relative overflow-hidden shadow-xl shadow-blue-900/20">
              
              <!-- Subtle Background Light Conduits -->
              <div class="absolute -right-16 -bottom-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              <div class="absolute top-0 right-0 p-8 opacity-15 pointer-events-none select-none">
                <img src="/logo.png" alt="" class="w-36 h-auto" />
              </div>

              <!-- Title Section -->
              <div class="flex flex-col gap-3 relative z-10">
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-mono font-extrabold px-3.5 py-1.5 rounded-full border border-white/20 uppercase tracking-widest">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Direct Conduit
                  </span>
                </div>

                <h1 class="contact-heading text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.08] tracking-tight mt-2">
                  Let's Build<br />
                  Something<br />
                  <span class="text-blue-200">Together.</span>
                </h1>

                <p class="text-base sm:text-lg font-normal leading-relaxed text-blue-100/90 mt-2 max-w-sm">
                  Have an idea, track question, or partnership proposal? Drop us a transmission and our student leads will sprint on it.
                </p>
              </div>

              <!-- Live Status Pill -->
              <div class="my-6 p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md relative z-10">
                <div class="flex items-center gap-2.5 mb-1">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span class="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                    Transmission Channels Online
                  </span>
                </div>
                <p class="text-xs text-blue-100/80 leading-normal">
                  Average student triage response time: <span class="font-bold text-white">&lt; 24 hours</span>.
                </p>
              </div>

              <!-- Contact Conduits (Email & Phone) -->
              <div class="flex flex-col gap-3.5 relative z-10">
                
                <!-- Email Row -->
                <a href="mailto:skillsprint@gmail.com" class="flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 transition-all duration-200 group">
                  <div class="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                    <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-mono font-bold uppercase tracking-wider text-blue-200">Email Conduit</p>
                    <p class="text-sm font-semibold text-white truncate">skillsprint@gmail.com</p>
                  </div>
                </a>

                <!-- Phone Row -->
                <a href="tel:+923174444441" class="flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 transition-all duration-200 group">
                  <div class="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                    <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-mono font-bold uppercase tracking-wider text-blue-200">Direct Inquiries</p>
                    <p class="text-sm font-semibold text-white truncate">+92 317 444 4441</p>
                  </div>
                </a>

              </div>
            </div>

            <!-- RIGHT PANEL - Modern Spatial Form -->
            <div class="contact-form-panel flex-1 w-full relative">
              
              <Transition name="fade-slide" mode="out-in">
                <!-- Success Message Card -->
                <div v-if="submitSuccess" class="flex flex-col items-center justify-center text-center py-16 px-6 bg-slate-50/70 rounded-3xl border border-emerald-200/80 shadow-sm min-h-[500px]">
                  <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner ring-4 ring-emerald-50">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="inline-block bg-emerald-50 text-emerald-700 text-xs font-mono font-extrabold px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-widest mb-3">
                    Transmission Dispatched
                  </span>
                  <h3 class="text-gray-900 font-black text-2xl sm:text-3xl tracking-tight mb-3">Transmission Acknowledged!</h3>
                  <p class="text-gray-600 text-base leading-relaxed max-w-[420px] mb-8 font-normal">
                    Thank you for reaching out, <span class="font-bold text-gray-900">{{ form.fullName }}</span>. We've logged your message and a track lead will reach back shortly.
                  </p>
                  <button
                    type="button"
                    @click="resetForm"
                    v-magnetic
                    class="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg shadow-blue-500/25 transition-all duration-300"
                  >
                    Send Another Transmission
                  </button>
                </div>

                <!-- Form Inputs -->
                <form v-else @submit.prevent="handleSubmit" class="flex flex-col gap-5 w-full">
                  
                  <!-- Error banner -->
                  <div v-if="submitError" class="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    <span>{{ submitError }}</span>
                  </div>

                  <!-- Row 1: Full Name + Email -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                    <div class="flex flex-col gap-2">
                      <label class="text-sm font-bold text-gray-800 tracking-wide font-mono uppercase">
                        Full Name <span class="text-red-500">*</span>
                      </label>
                      <input 
                        v-model="form.fullName"
                        type="text"
                        placeholder="Ada Lovelace"
                        required
                        class="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 
                               text-sm text-gray-900 placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white
                               transition-all duration-200"
                      />
                    </div>
                    <div class="flex flex-col gap-2">
                      <label class="text-sm font-bold text-gray-800 tracking-wide font-mono uppercase">
                        Email Address <span class="text-red-500">*</span>
                      </label>
                      <input 
                        v-model="form.email"
                        type="email"
                        placeholder="ada@university.edu"
                        required
                        class="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 
                               text-sm text-gray-900 placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white
                               transition-all duration-200"
                      />
                    </div>
                  </div>

                  <!-- Row 2: Phone + University -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                    <div class="flex flex-col gap-2">
                      <label class="text-sm font-bold text-gray-800 tracking-wide font-mono uppercase">
                        Phone Number <span class="text-red-500">*</span>
                      </label>
                      <input 
                        v-model="form.phone"
                        type="tel"
                        placeholder="+92 300 0000000"
                        required
                        class="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 
                               text-sm text-gray-900 placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white
                               transition-all duration-200"
                      />
                    </div>
                    <div class="flex flex-col gap-2">
                      <label class="text-sm font-bold text-gray-800 tracking-wide font-mono uppercase">
                        University / Organization
                      </label>
                      <input 
                        v-model="form.organization"
                        type="text"
                        placeholder="e.g. FAST, NUST, Superior, ITU"
                        class="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 
                               text-sm text-gray-900 placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white
                               transition-all duration-200"
                      />
                    </div>
                  </div>

                  <!-- Purpose of Contact -->
                  <div class="flex flex-col gap-2 w-full">
                    <label class="text-sm font-bold text-gray-800 tracking-wide font-mono uppercase">
                      Purpose of Contact <span class="text-red-500">*</span>
                    </label>
                    <div class="relative w-full">
                      <select 
                        v-model="form.purpose"
                        required
                        class="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 
                               text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 
                               focus:border-blue-500 focus:bg-white transition-all duration-200 appearance-none font-medium cursor-pointer"
                      >
                        <option value="" disabled>Select Inquiry Purpose</option>
                        <option value="General Inquiry">General Inquiry / Question</option>
                        <option value="Student Programs">Student Engineering Tracks &amp; Sprints</option>
                        <option value="Partnerships">Academic MOU &amp; Campus Chapters</option>
                        <option value="Corporate">Corporate Sponsorship &amp; Hackathon Support</option>
                        <option value="Volunteer">Volunteer Mentor / Code Reviewer</option>
                        <option value="Hiring">Talent Acquisition &amp; Graduate Hiring</option>
                        <option value="Media">Media, Press &amp; Community Outreach</option>
                        <option value="Other">Other Collaboration</option>
                      </select>
                      <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <!-- Message -->
                  <div class="flex flex-col gap-2 w-full">
                    <label class="text-sm font-bold text-gray-800 tracking-wide font-mono uppercase">
                      Message <span class="text-red-500">*</span>
                    </label>
                    <textarea 
                      v-model="form.message"
                      rows="5"
                      placeholder="Tell us about your background, what track you're interested in, or how you'd like to collaborate..."
                      required
                      class="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 
                             text-sm text-gray-900 placeholder-gray-400 resize-none
                             focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white
                             transition-all duration-200 min-h-[160px]"
                    ></textarea>
                  </div>

                  <!-- Checkbox & Submit Button -->
                  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 pt-3">
                    <label class="flex items-start gap-3 cursor-pointer select-none">
                      <input type="checkbox" v-model="agreed" class="mt-1 w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span class="text-xs sm:text-sm text-gray-600 leading-snug">
                        I agree to SkillSprint's friendly 
                        <a href="#" class="text-blue-600 font-semibold underline underline-offset-2">community guidelines</a>.
                      </span>
                    </label>

                    <button 
                      type="submit"
                      :disabled="isSubmitting || !agreed"
                      v-magnetic
                      class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold 
                             py-3.5 px-8 rounded-full text-sm shadow-lg shadow-blue-500/25
                             transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg v-if="isSubmitting" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span v-if="isSubmitting">Transmitting...</span>
                      <span v-else>Send Message &rarr;</span>
                    </button>
                  </div>

                </form>
              </Transition>

              <!-- Mobile Contact Details (Shown below form on small screens) -->
              <div class="flex flex-col gap-3 mt-8 sm:hidden pt-6 border-t border-gray-200">
                <a href="mailto:skillsprint@gmail.com" class="flex items-center gap-3 p-3 rounded-2xl bg-slate-100 border border-slate-200">
                  <div class="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-[10px] font-mono font-bold text-gray-400 uppercase">Email Us</p>
                    <p class="text-xs font-bold text-gray-900">skillsprint@gmail.com</p>
                  </div>
                </a>
                <a href="tel:+923174444441" class="flex items-center gap-3 p-3 rounded-2xl bg-slate-100 border border-slate-200">
                  <div class="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-[10px] font-mono font-bold text-gray-400 uppercase">Call Us</p>
                    <p class="text-xs font-bold text-gray-900">+92 317 444 4441</p>
                  </div>
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── PARTNER CTA SECTION ── -->
    <section class="relative w-full bg-gradient-to-b from-[#F8FAFC] via-[#dceeff] to-[#b8d4f0] section overflow-hidden">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <div class="relative bg-white/95 backdrop-blur-md rounded-3xl md:rounded-[2.5rem] shadow-[0_25px_60px_rgba(37,99,235,0.12)] border border-white/60 px-6 sm:px-12 py-12 md:py-16 text-center overflow-hidden partner-cta-card">
          <div class="absolute right-0 bottom-0 pointer-events-none select-none opacity-80" aria-hidden="true">
            <img ref="ctaMascot" src="/sidelogo.png" alt="" class="w-40 sm:w-56 md:w-72 h-auto object-contain" style="transform: rotate(-12deg) translate(20%, 15%);" />
          </div>
          <div class="relative z-10">
            <span class="inline-block bg-blue-50 text-blue-600 text-xs font-mono font-extrabold px-4 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest mb-4">
              Institutional Alliances
            </span>
            <h2 class="h-sub text-gray-900 leading-snug mb-4">
              Partner with
              <span class="text-blue-600 relative inline-block ml-1">Skill Sprint
                <span class="absolute left-0 -bottom-1 w-full h-[3px] bg-blue-500 rotate-[-2deg]"></span>
              </span>
            </h2>
            <p class="text-gray-600 text-sm sm:text-base md:text-lg max-w-md mx-auto leading-relaxed mb-8">
              Collaborate with our campus leaders to empower student engineers and sponsor open-source initiatives.
            </p>
            <div class="flex flex-wrap gap-4 justify-center items-center">
              <router-link to="/community" v-magnetic>
                <button class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-8 py-3.5 rounded-full text-sm transition-all duration-200 shadow-lg shadow-blue-500/25">
                  Join the Sprint
                </button>
              </router-link>
              <router-link to="/about" v-magnetic>
                <button class="bg-white border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-700 font-bold px-8 py-3.5 rounded-full text-sm transition-all duration-200">
                  About Us
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
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGSAP } from '../composables/useGSAP'
import { SplitText } from '../motion/gsap'

const route = useRoute()
const pageScope = ref(null)
const ctaMascot = ref(null)

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  organization: '',
  purpose: '',
  message: ''
})

onMounted(() => {
  if (route.query.track) {
    form.purpose = 'Student Programs'
    form.message = `I took the 2-Min Track Matchmaker Quiz and matched with: ${route.query.track}. I would love to participate in this track!`
  }
})

const agreed = ref(false)
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')

const handleSubmit = async () => {
  if (!agreed.value || isSubmitting.value) return
  
  isSubmitting.value = true
  submitError.value = ''
  
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
    
    const result = await response.json()
    
    if (result.success) {
      submitSuccess.value = true
    } else {
      submitError.value = result.message || 'Failed to submit form.'
    }
  } catch (err) {
    submitError.value = err.message || 'Connection error. Please try again later.'
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  submitSuccess.value = false
  submitError.value = ''
  agreed.value = false
  Object.assign(form, {
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    purpose: '',
    message: ''
  })
}

// Unified GSAP Animations
useGSAP(({ gsap, selector }) => {
  // SplitText heading on left panel
  const headingEl = selector('.contact-heading')[0]
  if (headingEl) {
    const split = SplitText.create(headingEl, { type: 'lines,words', wordsClass: 'cw' })
    gsap.from(split.words, {
      y: 40,
      opacity: 0,
      stagger: 0.04,
      duration: 1,
      ease: 'power3.out',
    })
  }

  gsap.from(selector('.contact-left-panel'), {
    x: -50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  })

  gsap.from(selector('.contact-form-panel'), {
    x: 50,
    opacity: 0,
    duration: 1,
    delay: 0.15,
    ease: 'power3.out'
  })

  if (ctaMascot.value) {
    gsap.from(ctaMascot.value, {
      scrollTrigger: { trigger: '.partner-cta-card', start: 'top 85%', toggleActions: 'play none none reverse' },
      xPercent: 30,
      yPercent: 30,
      opacity: 0,
      duration: 1.2,
      ease: 'back.out(1.5)'
    })
  }
}, pageScope)
</script>

<style scoped>
.contact-heading :deep(.cw) {
  display: inline-block;
  overflow: clip;
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>