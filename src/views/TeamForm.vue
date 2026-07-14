<template>
  <div ref="formScope" class="min-h-screen bg-[#070B16] text-white py-20 px-4 font-sans overflow-hidden">
    <div class="max-w-2xl mx-auto relative">
      
      <!-- Ambient Background Glows -->
      <div class="absolute -right-20 -top-20 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div class="absolute -left-20 bottom-20 w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <!-- Back Link -->
      <router-link to="/team" class="inline-flex items-center gap-2 text-gray-400 hover:text-blue-400 text-sm font-semibold mb-8 group transition relative z-10">
        <span>←</span> <span class="group-hover:translate-x-0.5 transition-transform duration-200">Back to Team Page</span>
      </router-link>

      <!-- Form Container Card -->
      <div class="bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-12 border border-white/5 shadow-2xl relative overflow-hidden form-container relative z-10 hover:border-blue-500/10 transition-all duration-500">
        <!-- Success State -->
        <Transition name="fade-slide" mode="out-in">
          <div v-if="saveSuccess" class="flex flex-col items-center justify-center text-center py-8 min-h-[400px]">
            <div class="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 class="text-2xl font-black text-white mb-2">Member Registered!</h2>
            <p class="text-gray-400 text-base leading-relaxed max-w-sm mb-8 font-medium">
              Excellent! <span class="font-bold text-slate-200">{{ newMember.name }}</span> has been added to the core team. You can view them on the team roster immediately.
            </p>
            <div class="flex flex-col sm:flex-row gap-3">
              <router-link to="/team">
                <button class="px-6 py-3 bg-[#0178FF] hover:bg-[#0168E0] text-white font-bold rounded-full transition shadow-lg shadow-blue-500/10 cursor-pointer">
                  View Team Roster
                </button>
              </router-link>
              <button 
                @click="resetForm"
                class="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold rounded-full transition cursor-pointer"
              >
                Add Another Member
              </button>
            </div>
          </div>

          <!-- Form Area -->
          <form v-else @submit.prevent="handleSubmit" class="space-y-6">
            
            <div>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">Register Member Details</h2>
              <p class="text-gray-400 text-sm font-medium">
                Enter your core team details and upload a clean headshot.
              </p>
            </div>

            <!-- Validation Error Alert -->
            <div v-if="errorMsg" class="p-4 bg-red-500/15 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-center gap-2">
              <span>⚠️</span>
              <span class="font-semibold">{{ errorMsg }}</span>
            </div>

            <!-- Full Name -->
            <div class="flex flex-col gap-2">
              <label for="memberName" class="text-xs font-black text-gray-400 uppercase tracking-widest">Full Name *</label>
              <input 
                id="memberName"
                v-model="newMember.name" 
                type="text" 
                placeholder="Enter member name"
                required
                class="w-full px-4 py-3.5 bg-slate-950/40 rounded-xl border border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm font-medium text-white placeholder-gray-500"
              />
            </div>

            <!-- Role -->
            <div class="flex flex-col gap-2">
              <label for="memberRole" class="text-xs font-black text-gray-400 uppercase tracking-widest">Role *</label>
              <input 
                id="memberRole"
                v-model="newMember.role" 
                type="text" 
                placeholder="e.g. Design Specialist, Writer, Special Projects Lead"
                required
                class="w-full px-4 py-3.5 bg-slate-950/40 rounded-xl border border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm font-medium text-white placeholder-gray-500"
              />
            </div>

            <!-- Bio -->
            <div class="flex flex-col gap-2">
              <label for="memberBio" class="text-xs font-black text-gray-400 uppercase tracking-widest">Short Bio *</label>
              <textarea 
                id="memberBio"
                v-model="newMember.bio" 
                rows="3" 
                placeholder="Write a brief (1-2 sentences) summary of your focus areas..."
                required
                maxlength="140"
                class="w-full px-4 py-3.5 bg-slate-950/40 rounded-xl border border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm font-medium text-white placeholder-gray-500 resize-none"
              ></textarea>
              <div class="text-right text-[11px] text-gray-500 font-semibold">{{ newMember.bio.length }}/140 chars</div>
            </div>

            <!-- File Upload -->
            <div class="flex flex-col gap-2">
              <label class="text-xs font-black text-gray-400 uppercase tracking-widest">Profile Photo *</label>
              <div 
                class="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-blue-500/30 hover:bg-blue-500/5 transition cursor-pointer relative"
                @click="triggerFileInput"
                @dragover.prevent="dragOver = true"
                @dragleave.prevent="dragOver = false"
                @drop.prevent="handleFileDrop"
                :class="{'border-blue-500 bg-blue-500/10': dragOver}"
              >
                <input 
                  type="file" 
                  ref="fileInput" 
                  accept="image/*" 
                  class="hidden" 
                  @change="handleFileSelect"
                />
                
                <!-- Upload State Info -->
                <div v-if="!imagePreview" class="space-y-2">
                  <div class="text-3xl text-gray-500">📷</div>
                  <p class="text-sm font-bold text-slate-300">Click to upload or drag &amp; drop</p>
                  <p class="text-xs text-gray-500">PNG, JPG, or JPEG format (Recommended square aspect ratio)</p>
                </div>
                
                <!-- Preview State Info -->
                <div v-else class="flex flex-col items-center gap-3">
                  <div class="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 bg-slate-950 relative group">
                    <img :src="imagePreview" alt="Profile Preview" class="w-full h-full object-cover" />
                  </div>
                  <p class="text-xs font-bold text-emerald-400">✓ Image selected successfully</p>
                  <button 
                    type="button" 
                    @click.stop="clearImage" 
                    class="text-xs text-red-400 hover:underline font-bold"
                  >
                    Remove Photo
                  </button>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              :disabled="isSaving"
              class="w-full py-4 bg-[#0178FF] hover:bg-[#0168E0] text-white font-bold rounded-full transition shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span v-if="isSaving">Registering...</span>
              <span v-else>Register Member</span>
            </button>

          </form>
        </Transition>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import gsap from 'gsap'
import { useGSAP } from '../composables/useGSAP'

const formScope = ref(null)
const fileInput = ref(null)

const newMember = reactive({
  name: '',
  role: '',
  bio: ''
})

const imagePreview = ref('')
const isSaving = ref(false)
const saveSuccess = ref(false)
const errorMsg = ref('')
const dragOver = ref(false)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const processFile = (file) => {
  if (!file) return
  if (!file.type.startsWith('image/')) {
    errorMsg.value = 'Please select a valid image file.'
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    errorMsg.value = 'Image size should be less than 2MB.'
    return
  }

  errorMsg.value = ''
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const handleFileSelect = (e) => {
  const file = e.target.files[0]
  processFile(file)
}

const handleFileDrop = (e) => {
  dragOver.value = false
  const file = e.dataTransfer.files[0]
  processFile(file)
}

const clearImage = () => {
  imagePreview.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleSubmit = () => {
  if (!imagePreview.value) {
    errorMsg.value = 'Please select a profile photo.'
    return
  }
  
  isSaving.value = true
  errorMsg.value = ''

  setTimeout(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('team_members') || '[]')
      const memberRecord = {
        name: newMember.name,
        role: newMember.role,
        bio: newMember.bio,
        image: imagePreview.value
      }
      
      stored.push(memberRecord)
      localStorage.setItem('team_members', JSON.stringify(stored))
      
      saveSuccess.value = true
    } catch (e) {
      errorMsg.value = 'Failed to save member details. Local storage might be full.'
    } finally {
      isSaving.value = false
    }
  }, 1000)
}

const resetForm = () => {
  saveSuccess.value = false
  newMember.name = ''
  newMember.role = ''
  newMember.bio = ''
  imagePreview.value = ''
  errorMsg.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

useGSAP(() => {
  gsap.from('.form-container', {
    y: 50,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out'
  })
}, formScope)
</script>

<style scoped>
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
