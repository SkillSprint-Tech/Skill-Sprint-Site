<template>
  <div ref="formScope" class="bg-[#F8FAFC] min-h-screen py-16 px-4 font-sans overflow-hidden relative">

    <!-- Background glow orbs -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div class="absolute top-[-100px] left-[-100px] w-[500px] h-[400px] bg-blue-400/8 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[-80px] right-[-80px] w-[400px] h-[350px] bg-indigo-400/6 blur-[100px] rounded-full"></div>
    </div>

    <div class="max-w-5xl mx-auto relative z-10">
      <!-- Back link -->
      <router-link to="/team" class="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm font-semibold mb-8 group transition back-link">
        <span class="group-hover:-translate-x-1 transition-transform duration-200">←</span>
        <span>Back to Team</span>
      </router-link>

      <!-- Main card (2-col on md+) -->
      <div class="flex flex-col md:flex-row gap-0 bg-white rounded-3xl border border-gray-100 shadow-[0_20px_80px_rgba(0,0,0,0.08)] overflow-hidden form-card">

        <!-- ── LEFT PANEL (desktop only) ── -->
        <div class="hidden md:flex flex-col bg-[#0B101B] w-80 lg:w-96 shrink-0 p-10 relative overflow-hidden">
          <!-- Glowing orb inside panel -->
          <div class="absolute top-[-80px] left-[-60px] w-[300px] h-[300px] bg-blue-600/15 blur-[100px] rounded-full pointer-events-none"></div>
          <div class="absolute bottom-[-60px] right-[-40px] w-[200px] h-[200px] bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>

          <div class="relative z-10 flex flex-col h-full">
            <!-- Logo/brand -->
            <div class="mb-10">
              <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm mb-4 shadow-lg shadow-blue-500/30">SS</div>
              <h3 class="text-white font-extrabold text-xl leading-snug">Join the<br/>Core Team</h3>
              <p class="text-gray-400 text-sm mt-2 leading-relaxed">You'll be building alongside passionate student leaders.</p>
            </div>

            <!-- Stacked member avatars -->
            <div class="mb-8">
              <p class="text-gray-500 text-xs font-black uppercase tracking-widest mb-4">You'll be joining</p>
              <div class="space-y-3">
                <div v-for="member in panelMembers" :key="member.name" class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl overflow-hidden bg-gray-700 border-2 border-white/10 shrink-0">
                    <img :src="member.img" :alt="member.name" class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p class="text-white text-sm font-bold leading-none">{{ member.name }}</p>
                    <p class="text-gray-500 text-xs mt-0.5">{{ member.role }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-blue-600/20 border-2 border-blue-500/30 flex items-center justify-center text-blue-400 text-xs font-black shrink-0">YOU</div>
                  <p class="text-gray-400 text-sm">Your spot is waiting</p>
                </div>
              </div>
            </div>

            <!-- Mini stats -->
            <div class="mt-auto">
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p class="text-white font-black text-2xl">12+</p>
                  <p class="text-gray-500 text-xs uppercase tracking-widest mt-1">Workshops Run</p>
                </div>
                <div class="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p class="text-white font-black text-2xl">45+</p>
                  <p class="text-gray-500 text-xs uppercase tracking-widest mt-1">Projects Shipped</p>
                </div>
              </div>
              <p class="text-gray-600 text-xs mt-4 leading-relaxed">
                100% student-driven. No paywalls. Just people who show up.
              </p>
            </div>
          </div>
        </div>

        <!-- ── RIGHT: FORM ── -->
        <div class="flex-1 p-8 sm:p-12">

          <!-- Top accent bar -->
          <div class="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-400 rounded-full mb-8 -mx-0"></div>

          <Transition name="fade-slide" mode="out-in">
            <!-- Success State -->
            <div v-if="saveSuccess" class="flex flex-col items-center justify-center text-center py-8 min-h-[400px]">
              <div class="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-100 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-black px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
                🎉 Welcome to the Team!
              </div>
              <h2 class="text-2xl font-extrabold text-gray-900 mb-2">Member Registered!</h2>
              <p class="text-gray-500 text-base leading-relaxed max-w-sm mb-8 font-medium">
                <span class="font-bold text-gray-800">{{ newMember.name }}</span> has been added to the core team. They'll show up on the Team page shortly.
              </p>
              <div class="flex flex-col sm:flex-row gap-3">
                <router-link to="/team">
                  <button class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition shadow-md shadow-blue-200 cursor-pointer text-sm">
                    View Team Roster
                  </button>
                </router-link>
                <button @click="resetForm" class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-full transition cursor-pointer text-sm">
                  Add Another Member
                </button>
              </div>
            </div>

            <!-- Form -->
            <form v-else @submit.prevent="handleSubmit" class="space-y-6">
              <div>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-1.5">Register Member Details</h2>
                <p class="text-gray-500 text-sm font-medium">Enter core team details and upload a clean headshot.</p>
              </div>

              <!-- Error -->
              <div v-if="errorMsg" class="p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl flex items-center gap-2">
                <span>⚠️</span> <span class="font-semibold">{{ errorMsg }}</span>
              </div>

              <!-- Full Name -->
              <div class="flex flex-col gap-1.5 field-group">
                <label for="memberName" class="text-xs font-black text-gray-400 uppercase tracking-widest">Full Name *</label>
                <input
                  id="memberName" v-model="newMember.name" type="text"
                  placeholder="Enter member name" required
                  class="w-full px-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium text-gray-900 placeholder-gray-400"
                />
              </div>

              <!-- Role -->
              <div class="flex flex-col gap-1.5 field-group">
                <label for="memberRole" class="text-xs font-black text-gray-400 uppercase tracking-widest">Role *</label>
                <input
                  id="memberRole" v-model="newMember.role" type="text"
                  placeholder="e.g. Design Specialist, Community Manager" required
                  class="w-full px-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium text-gray-900 placeholder-gray-400"
                />
              </div>

              <!-- Bio -->
              <div class="flex flex-col gap-1.5 field-group">
                <label for="memberBio" class="text-xs font-black text-gray-400 uppercase tracking-widest">Short Bio *</label>
                <textarea
                  id="memberBio" v-model="newMember.bio" rows="3"
                  placeholder="Write a brief (1–2 sentences) summary of your focus areas…" required maxlength="140"
                  class="w-full px-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium text-gray-900 placeholder-gray-400 resize-none"
                ></textarea>
                <div class="flex items-center justify-between">
                  <span class="text-[11px] text-gray-400">Keep it punchy — one or two sentences</span>
                  <span class="text-right text-[11px] font-bold" :class="newMember.bio.length >= 120 ? 'text-orange-500' : 'text-gray-400'">{{ newMember.bio.length }}/140</span>
                </div>
              </div>

              <!-- Photo Upload -->
              <div class="flex flex-col gap-1.5 field-group">
                <label class="text-xs font-black text-gray-400 uppercase tracking-widest">Profile Photo *</label>
                <div
                  class="border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer"
                  :class="dragOver ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/10'"
                  @click="triggerFileInput"
                  @dragover.prevent="dragOver = true"
                  @dragleave.prevent="dragOver = false"
                  @drop.prevent="handleFileDrop"
                >
                  <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleFileSelect" />

                  <div v-if="!imagePreview" class="space-y-3">
                    <div class="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl mx-auto border border-gray-200">📷</div>
                    <p class="text-sm font-bold text-gray-700">Click to upload or drag & drop</p>
                    <p class="text-xs text-gray-400">PNG, JPG, JPEG — max 2MB · Square photos work best</p>
                  </div>

                  <div v-else class="flex flex-col items-center gap-3">
                    <div class="w-24 h-24 rounded-2xl overflow-hidden border-4 border-blue-100 bg-gray-50 shadow-lg">
                      <img :src="imagePreview" alt="Preview" class="w-full h-full object-cover" />
                    </div>
                    <p class="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                      <span class="w-4 h-4 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200">✓</span>
                      Photo selected
                    </p>
                    <button type="button" @click.stop="clearImage" class="text-xs text-red-500 hover:text-red-600 font-bold hover:underline transition">
                      Remove Photo
                    </button>
                  </div>
                </div>
              </div>

              <!-- Submit -->
              <button
                type="submit" :disabled="isSaving"
                class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all shadow-md shadow-blue-200 cursor-pointer disabled:opacity-50 text-sm hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                {{ isSaving ? 'Registering...' : 'Register Member →' }}
              </button>
            </form>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useGSAP } from '../composables/useGSAP'

const formScope = ref(null)
const fileInput = ref(null)

const newMember = reactive({ name: '', role: '', bio: '' })
const imagePreview = ref('')
const isSaving = ref(false)
const saveSuccess = ref(false)
const errorMsg = ref('')
const dragOver = ref(false)

const panelMembers = ref([])

onMounted(() => {
  const stored = JSON.parse(localStorage.getItem('team_members') || '[]')
  // Show max 3 existing members in the panel preview
  panelMembers.value = stored.slice(0, 3).map(m => ({
    name: m.name,
    role: m.role,
    img: m.image
  }))
})

const triggerFileInput = () => fileInput.value?.click()

const processFile = (file) => {
  if (!file) return
  if (!file.type.startsWith('image/')) { errorMsg.value = 'Please select a valid image file.'; return }
  if (file.size > 2 * 1024 * 1024) { errorMsg.value = 'Image must be under 2MB.'; return }
  errorMsg.value = ''
  const reader = new FileReader()
  reader.onload = (e) => { imagePreview.value = e.target.result }
  reader.readAsDataURL(file)
}

const handleFileSelect = (e) => processFile(e.target.files[0])
const handleFileDrop = (e) => { dragOver.value = false; processFile(e.dataTransfer.files[0]) }
const clearImage = () => { imagePreview.value = ''; if (fileInput.value) fileInput.value.value = '' }

const handleSubmit = () => {
  if (!imagePreview.value) { errorMsg.value = 'Please select a profile photo.'; return }
  isSaving.value = true; errorMsg.value = ''
  setTimeout(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('team_members') || '[]')
      stored.push({ name: newMember.name, role: newMember.role, bio: newMember.bio, image: imagePreview.value })
      localStorage.setItem('team_members', JSON.stringify(stored))
      saveSuccess.value = true
    } catch (e) {
      errorMsg.value = 'Failed to save. Local storage may be full.'
    } finally {
      isSaving.value = false
    }
  }, 1000)
}

const resetForm = () => {
  saveSuccess.value = false; newMember.name = ''; newMember.role = ''; newMember.bio = ''
  imagePreview.value = ''; errorMsg.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

useGSAP((self) => {
  const { gsap } = self

  gsap.from('.back-link', { x: -20, opacity: 0, duration: 0.7, ease: 'power3.out' })

  // Left panel from left, form card from right — simultaneous
  gsap.from('.form-card', {
    y: 60, opacity: 0, duration: 1.3, ease: 'power3.out', delay: 0.1
  })

  // Field groups stagger in
  gsap.from('.field-group', {
    y: 20, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.5
  })
}, formScope)
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.fade-slide-enter-from { opacity: 0; transform: translateY(20px); }
.fade-slide-leave-to   { opacity: 0; transform: translateY(-20px); }
</style>
