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
      <div class="flex flex-col md:flex-row gap-0 bg-white rounded-[2.5rem] border border-gray-150 shadow-[0_30px_100px_rgba(0,0,0,0.05)] overflow-hidden form-card">

        <!-- ── LEFT PANEL (desktop only) ── -->
        <div class="hidden md:flex flex-col bg-[#0B101B] w-80 lg:w-96 shrink-0 p-10 relative overflow-hidden border-r border-white/5">
          <!-- Glowing orb inside panel -->
          <div class="absolute top-[-80px] left-[-60px] w-[300px] h-[300px] bg-blue-600/15 blur-[100px] rounded-full pointer-events-none"></div>
          <div class="absolute bottom-[-60px] right-[-40px] w-[200px] h-[200px] bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>

          <div class="relative z-10 flex flex-col h-full">
            <!-- Logo/brand -->
            <div class="mb-10">
              <div class="w-10 h-10 bg-blue-600 rounded-[1.25rem] flex items-center justify-center text-white font-black text-sm mb-4 shadow-lg shadow-blue-500/30">SS</div>
              <h3 class="text-white font-black text-2xl leading-tight">Join the<br/><span class="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Core Team</span></h3>
              <p class="text-gray-400 text-xs sm:text-sm mt-3 leading-relaxed font-medium">You'll be building alongside passionate student leaders.</p>
            </div>

            <!-- Stacked member avatars -->
            <div class="mb-8">
              <p class="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">You'll be joining</p>
              <div class="space-y-4">
                <div v-for="member in panelMembers" :key="member.name" class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-2xl overflow-hidden bg-gray-700 border-2 border-white/10 shrink-0 shadow-md">
                    <img :src="member.img" :alt="member.name" class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p class="text-white text-sm font-bold leading-none mb-0.5">{{ member.name }}</p>
                    <p class="text-gray-500 text-xs">{{ member.role }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-2xl bg-blue-600/20 border-2 border-blue-500/30 flex items-center justify-center text-blue-400 text-xs font-black shrink-0 shadow-md">YOU</div>
                  <p class="text-gray-400 text-sm font-semibold">Your spot is waiting</p>
                </div>
              </div>
            </div>

            <!-- Mini stats -->
            <div class="mt-auto">
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-white/[0.02] border border-white/10 rounded-2xl p-4 shadow-inner">
                  <p class="text-white font-black text-2xl leading-none mb-1">12+</p>
                  <p class="text-gray-500 text-[9px] font-black uppercase tracking-widest">Workshops</p>
                </div>
                <div class="bg-white/[0.02] border border-white/10 rounded-2xl p-4 shadow-inner">
                  <p class="text-white font-black text-2xl leading-none mb-1">45+</p>
                  <p class="text-gray-500 text-[9px] font-black uppercase tracking-widest">Projects</p>
                </div>
              </div>
              <p class="text-gray-600 text-[11px] mt-4 leading-relaxed font-medium">
                100% student-driven. No paywalls. Just people who show up.
              </p>
            </div>
          </div>
        </div>

        <!-- ── RIGHT: FORM ── -->
        <div class="flex-1 p-8 sm:p-12">

          <!-- Top accent bar -->
          <div class="h-2 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-400 rounded-full mb-8"></div>

          <Transition name="fade-slide">
            <!-- Success State -->
            <div v-if="saveSuccess" class="flex flex-col items-center justify-center text-center py-8 min-h-[400px]">
              <div class="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mb-6 border border-emerald-100 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-black px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
                🎉 Welcome to the Team!
              </div>
              <h2 class="text-2xl font-extrabold text-gray-900 mb-2 leading-none">Member Added!</h2>
              <p class="text-gray-500 text-sm sm:text-base leading-relaxed max-w-md mb-8 font-medium">
                <span class="font-bold text-gray-800">{{ newMember.name }}</span> has been saved to the database and now
                appears on the Team page for every visitor.
              </p>

              <div class="flex flex-col sm:flex-row gap-3">
                <router-link to="/team">
                  <button class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition shadow-md shadow-blue-200 cursor-pointer text-sm">
                    View Team Roster
                  </button>
                </router-link>
                <button @click="resetForm" class="px-6 py-3 bg-gray-150 hover:bg-gray-200 text-gray-700 font-bold rounded-full transition cursor-pointer text-sm">
                  Add Another Member
                </button>
              </div>
            </div>

            <!-- Form -->
            <form v-else @submit.prevent="handleSubmit" class="space-y-6">
              <div>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2 leading-none">Register Member Details</h2>
                <p class="text-gray-500 text-xs sm:text-sm font-medium">Enter core team details and upload a clean headshot.</p>
              </div>

              <!-- Error -->
              <div v-if="errorMsg" class="p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-2xl flex items-center gap-2 font-semibold">
                <span>⚠️</span> <span>{{ errorMsg }}</span>
              </div>

              <!-- Full Name -->
              <div class="flex flex-col gap-2 field-group">
                <label for="memberName" class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name *</label>
                <input
                  id="memberName" v-model="newMember.name" type="text"
                  placeholder="Enter member name" required
                  class="w-full px-4.5 py-4 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-sm font-semibold text-gray-900 placeholder-gray-400 shadow-sm"
                />
              </div>

              <!-- Role -->
              <div class="flex flex-col gap-2 field-group">
                <label for="memberRole" class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Role *</label>
                <input
                  id="memberRole" v-model="newMember.role" type="text"
                  placeholder="e.g. Design Specialist, Community Manager" required
                  class="w-full px-4.5 py-4 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-sm font-semibold text-gray-900 placeholder-gray-400 shadow-sm"
                />
              </div>

              <!-- Bio -->
              <div class="flex flex-col gap-2 field-group">
                <label for="memberBio" class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Short Bio *</label>
                <textarea
                  id="memberBio" v-model="newMember.bio" rows="3"
                  placeholder="Write a brief (1–2 sentences) summary of your focus areas…" required maxlength="140"
                  class="w-full px-4.5 py-4 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-sm font-semibold text-gray-900 placeholder-gray-400 resize-none shadow-sm"
                ></textarea>
                <div class="flex items-center justify-between">
                  <span class="text-[10px] text-gray-400 font-medium">Keep it punchy — one or two sentences</span>
                  <span class="text-right text-[10px] font-bold" :class="newMember.bio.length >= 120 ? 'text-orange-500' : 'text-gray-400'">{{ newMember.bio.length }}/140</span>
                </div>
              </div>

              <!-- Photo Upload -->
              <div class="flex flex-col gap-2 field-group">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Profile Photo *</label>
                <div
                  class="border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer shadow-sm"
                  :class="dragOver ? 'border-blue-500 bg-blue-50/40' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/10'"
                  @click="triggerFileInput"
                  @dragover.prevent="dragOver = true"
                  @dragleave.prevent="dragOver = false"
                  @drop.prevent="handleFileDrop"
                >
                  <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleFileSelect" />

                  <div v-if="!imagePreview" class="space-y-3">
                    <div class="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl mx-auto border border-gray-200 shadow-sm">📷</div>
                    <p class="text-sm font-bold text-gray-700">Click to upload or drag & drop</p>
                    <p class="text-xs text-gray-400 font-medium">PNG, JPG, JPEG — max 2MB · Square photos work best</p>
                  </div>

                  <div v-else class="flex flex-col items-center gap-3">
                    <div class="w-24 h-24 rounded-[1.5rem] overflow-hidden border-4 border-blue-100 bg-gray-50 shadow-xl">
                      <img :src="imagePreview" alt="Preview" class="w-full h-full object-cover" />
                    </div>
                    <p class="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                      <span class="w-4 h-4 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-250">✓</span>
                      Photo selected
                    </p>
                    <button type="button" @click.stop="clearImage" class="text-xs text-red-500 hover:text-red-650 font-bold hover:underline transition">
                      Remove Photo
                    </button>
                  </div>
                </div>
              </div>

              <!-- Submit -->
              <button
                type="submit" :disabled="isSaving"
                class="w-full py-4.5 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-750 text-white font-black rounded-full transition-all shadow-xl shadow-blue-500/10 cursor-pointer disabled:opacity-50 text-sm hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
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

      <!-- ── MANAGE EXISTING MEMBERS ── -->
      <div class="mt-10 relative z-10 manage-section">
        <button
          @click="showManagePanel = !showManagePanel"
          class="w-full flex items-center justify-between px-8 py-5 bg-white rounded-[2rem] border border-gray-150 shadow-[0_10px_40px_rgba(0,0,0,0.04)] cursor-pointer hover:shadow-[0_15px_50px_rgba(0,0,0,0.07)] transition-all group"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 border border-red-100 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div class="text-left">
              <p class="text-sm font-extrabold text-gray-900">Manage Existing Members</p>
              <p class="text-xs text-gray-400 font-medium">Remove a member if they were added by mistake</p>
            </div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400 transition-transform duration-300"
            :class="{ 'rotate-180': showManagePanel }"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <Transition name="panel-slide">
          <div v-if="showManagePanel" class="mt-4 bg-white rounded-[2rem] border border-gray-150 shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden">
            <!-- Loading state -->
            <div v-if="membersLoading" class="p-10 flex flex-col items-center justify-center gap-3">
              <svg class="w-7 h-7 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <p class="text-sm text-gray-400 font-semibold">Loading members…</p>
            </div>

            <!-- Error state -->
            <div v-else-if="membersError" class="p-8 text-center">
              <p class="text-sm text-red-500 font-semibold mb-3">{{ membersError }}</p>
              <button @click="loadAllMembers" class="text-xs font-bold text-blue-600 hover:text-blue-700 transition cursor-pointer">Try Again →</button>
            </div>

            <!-- Empty state -->
            <div v-else-if="allMembers.length === 0" class="p-10 text-center">
              <div class="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl mx-auto border border-gray-100 mb-4">👥</div>
              <p class="text-sm font-bold text-gray-700">No members yet</p>
              <p class="text-xs text-gray-400 font-medium mt-1">Members you add will appear here</p>
            </div>

            <!-- Member list -->
            <div v-else class="divide-y divide-gray-100">
              <div
                v-for="member in allMembers" :key="member.id"
                class="flex items-center gap-4 px-8 py-5 hover:bg-gray-50/50 transition-colors member-row"
              >
                <!-- Avatar -->
                <div class="w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 border-2 border-gray-150 shrink-0 shadow-sm">
                  <img v-if="member.image" :src="member.image" :alt="member.name" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-sm font-bold">{{ member.name?.charAt(0)?.toUpperCase() }}</div>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-extrabold text-gray-900 truncate">{{ member.name }}</p>
                  <p class="text-xs text-gray-400 font-medium truncate">{{ member.role }}</p>
                </div>

                <!-- Delete button -->
                <button
                  @click="confirmDelete(member)"
                  :disabled="deletingId === member.id"
                  class="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all cursor-pointer disabled:opacity-50"
                  :title="'Delete ' + member.name"
                >
                  <svg v-if="deletingId === member.id" class="w-4 h-4 animate-spin text-red-400" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- ── DELETE CONFIRMATION MODAL ── -->
      <Teleport to="body">
        <Transition name="modal-fade">
          <div v-if="deleteTarget" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="cancelDelete"></div>

            <!-- Modal -->
            <div class="relative bg-white rounded-[2rem] shadow-2xl max-w-sm w-full p-8 text-center modal-card">
              <div class="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-5 border border-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>

              <h3 class="text-lg font-extrabold text-gray-900 mb-2">Remove Member?</h3>
              <p class="text-sm text-gray-500 font-medium mb-6 leading-relaxed">
                Are you sure you want to delete <span class="font-bold text-gray-800">{{ deleteTarget?.name }}</span>?
                This action cannot be undone.
              </p>

              <div v-if="deleteError" class="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-semibold">
                {{ deleteError }}
              </div>

              <div class="flex gap-3">
                <button
                  @click="cancelDelete"
                  class="flex-1 py-3.5 bg-gray-100 hover:bg-gray-150 text-gray-700 font-bold rounded-full transition cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  @click="executeDelete"
                  :disabled="deletingId"
                  class="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full transition cursor-pointer text-sm shadow-lg shadow-red-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <svg v-if="deletingId" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  {{ deletingId ? 'Deleting…' : 'Yes, Delete' }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useGSAP } from '../composables/useGSAP'

const formScope = ref(null)
const fileInput = ref(null)

const newMember = reactive({ name: '', role: '', bio: '' })
const imagePreview = ref('')
const isSaving = ref(false)
const saveSuccess = ref(false)
const errorMsg = ref('')
const dragOver = ref(false)

// Existing roster, loaded from the database, for the side-panel preview.
const panelMembers = ref([])

// ── Manage / Delete members ──
const showManagePanel = ref(false)
const allMembers = ref([])
const membersLoading = ref(false)
const membersError = ref('')
const deleteTarget = ref(null)
const deletingId = ref(null)
const deleteError = ref('')

const loadAllMembers = async () => {
  membersLoading.value = true
  membersError.value = ''
  try {
    const res = await fetch('/api/team-members')
    if (res.ok) {
      const data = await res.json()
      allMembers.value = Array.isArray(data.members) ? data.members : []
    } else {
      membersError.value = 'Failed to load members. Please try again.'
    }
  } catch (e) {
    membersError.value = 'Could not reach the server. Please check the connection.'
  } finally {
    membersLoading.value = false
  }
}


watch(showManagePanel, (open) => {
  if (open) loadAllMembers()
})

const confirmDelete = (member) => {
  deleteTarget.value = member
  deleteError.value = ''
}

const cancelDelete = () => {
  deleteTarget.value = null
  deleteError.value = ''
}

const executeDelete = async () => {
  if (!deleteTarget.value) return
  deletingId.value = deleteTarget.value.id
  deleteError.value = ''
  try {
    const res = await fetch(`/api/team-members?id=${deleteTarget.value.id}`, {
      method: 'DELETE'
    })
    if (res.ok) {
      // Remove from local list
      allMembers.value = allMembers.value.filter(m => m.id !== deleteTarget.value.id)
      // Also update the side panel if needed
      panelMembers.value = panelMembers.value.filter(m => m.name !== deleteTarget.value.name)
      deleteTarget.value = null
    } else {
      const data = await res.json().catch(() => ({}))
      deleteError.value = data.message || `Server responded with ${res.status}`
    }
  } catch (e) {
    deleteError.value = 'Could not reach the server. Please try again.'
  } finally {
    deletingId.value = null
  }
}

onMounted(async () => {
  try {
    const res = await fetch('/api/team-members')
    if (res.ok) {
      const data = await res.json()
      const members = Array.isArray(data.members) ? data.members : []
      panelMembers.value = members.slice(0, 3).map(m => ({
        name: m.name,
        role: m.role,
        img: m.image
      }))
    }
  } catch (e) {
    // No existing roster available — panel just shows the "your spot is waiting" row.
  }
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

const handleSubmit = async () => {
  if (!imagePreview.value) { errorMsg.value = 'Please select a profile photo.'; return }
  isSaving.value = true
  errorMsg.value = ''
  try {
    // Save the new member straight to the database. It then appears on the Team page for everyone.
    const res = await fetch('/api/team-members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newMember.name.trim(),
        role: newMember.role.trim(),
        bio: newMember.bio.trim(),
        focus: ['Core Builder', 'Collaborator'],
        image: imagePreview.value
      })
    })
    // Decide on the status alone — we don't need (and don't read) the response body.
    if (res.ok) {
      saveSuccess.value = true
    } else {
      errorMsg.value = `Couldn't save the member (server responded ${res.status}). Please try again.`
    }
  } catch (e) {
    errorMsg.value = 'Could not reach the server. Please check the connection and try again.'
  } finally {
    isSaving.value = false
  }
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

/* Manage panel slide */
.panel-slide-enter-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.panel-slide-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.panel-slide-enter-from { opacity: 0; transform: translateY(-12px); max-height: 0; }
.panel-slide-enter-to { opacity: 1; transform: translateY(0); max-height: 800px; }
.panel-slide-leave-from { opacity: 1; transform: translateY(0); max-height: 800px; }
.panel-slide-leave-to { opacity: 0; transform: translateY(-12px); max-height: 0; }

/* Delete confirmation modal */
.modal-fade-enter-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-fade-leave-active { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
.modal-fade-enter-from { opacity: 0; }
.modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .modal-card { transform: scale(0.92) translateY(10px); }
.modal-fade-leave-to .modal-card { transform: scale(0.96) translateY(4px); }
</style>
