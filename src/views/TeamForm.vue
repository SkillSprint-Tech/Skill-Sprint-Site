<template>
  <div ref="formScope" class="bg-[#F8FAFC] min-h-screen py-16 px-4 font-sans overflow-hidden">
    <div class="max-w-2xl mx-auto">

      <!-- Back link -->
      <router-link to="/team" class="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm font-semibold mb-8 group transition">
        <span class="group-hover:-translate-x-1 transition-transform duration-200">←</span>
        <span>Back to Team</span>
      </router-link>

      <!-- Card -->
      <div class="bg-white rounded-2xl p-8 sm:p-12 border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.06)] form-card">

        <!-- Success State -->
        <Transition name="fade-slide" mode="out-in">
          <div v-if="saveSuccess" class="flex flex-col items-center justify-center text-center py-8 min-h-[400px]">
            <div class="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-100 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 class="text-2xl font-extrabold text-gray-900 mb-2">Member Registered!</h2>
            <p class="text-gray-500 text-base leading-relaxed max-w-sm mb-8 font-medium">
              <span class="font-bold text-gray-800">{{ newMember.name }}</span> has been added to the core team.
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
            <div class="flex flex-col gap-1.5">
              <label for="memberName" class="text-xs font-black text-gray-400 uppercase tracking-widest">Full Name *</label>
              <input
                id="memberName" v-model="newMember.name" type="text"
                placeholder="Enter member name" required
                class="w-full px-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm font-medium text-gray-900 placeholder-gray-400"
              />
            </div>

            <!-- Role -->
            <div class="flex flex-col gap-1.5">
              <label for="memberRole" class="text-xs font-black text-gray-400 uppercase tracking-widest">Role *</label>
              <input
                id="memberRole" v-model="newMember.role" type="text"
                placeholder="e.g. Design Specialist, Community Manager" required
                class="w-full px-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm font-medium text-gray-900 placeholder-gray-400"
              />
            </div>

            <!-- Bio -->
            <div class="flex flex-col gap-1.5">
              <label for="memberBio" class="text-xs font-black text-gray-400 uppercase tracking-widest">Short Bio *</label>
              <textarea
                id="memberBio" v-model="newMember.bio" rows="3"
                placeholder="Write a brief (1–2 sentences) summary of your focus areas…" required maxlength="140"
                class="w-full px-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm font-medium text-gray-900 placeholder-gray-400 resize-none"
              ></textarea>
              <div class="text-right text-[11px] text-gray-400 font-semibold">{{ newMember.bio.length }}/140</div>
            </div>

            <!-- Photo Upload -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-black text-gray-400 uppercase tracking-widest">Profile Photo *</label>
              <div
                class="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-blue-400 hover:bg-blue-50/10 transition cursor-pointer"
                @click="triggerFileInput"
                @dragover.prevent="dragOver = true"
                @dragleave.prevent="dragOver = false"
                @drop.prevent="handleFileDrop"
                :class="{ 'border-blue-400 bg-blue-50/10': dragOver }"
              >
                <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleFileSelect" />

                <div v-if="!imagePreview" class="space-y-2">
                  <div class="text-3xl text-gray-400">📷</div>
                  <p class="text-sm font-bold text-gray-700">Click to upload or drag &amp; drop</p>
                  <p class="text-xs text-gray-400">PNG, JPG, JPEG — max 2MB</p>
                </div>

                <div v-else class="flex flex-col items-center gap-3">
                  <div class="w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                    <img :src="imagePreview" alt="Preview" class="w-full h-full object-cover" />
                  </div>
                  <p class="text-xs font-bold text-emerald-600">✓ Image selected</p>
                  <button type="button" @click.stop="clearImage" class="text-xs text-red-500 hover:underline font-bold">
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <!-- Submit -->
            <button
              type="submit" :disabled="isSaving"
              class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition shadow-md shadow-blue-200 cursor-pointer disabled:opacity-50 text-sm"
            >
              {{ isSaving ? 'Registering...' : 'Register Member' }}
            </button>
          </form>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useGSAP } from '../composables/useGSAP'

const formScope = ref(null)
const fileInput = ref(null)

const newMember = reactive({ name: '', role: '', bio: '' })
const imagePreview = ref('')
const isSaving = ref(false)
const saveSuccess = ref(false)
const errorMsg = ref('')
const dragOver = ref(false)

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
  gsap.from('.form-card', { y: 60, opacity: 0, duration: 1.2, ease: 'power3.out' })
}, formScope)
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.fade-slide-enter-from { opacity: 0; transform: translateY(20px); }
.fade-slide-leave-to   { opacity: 0; transform: translateY(-20px); }
</style>
