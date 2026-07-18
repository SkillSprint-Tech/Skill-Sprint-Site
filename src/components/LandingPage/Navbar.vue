<template>
  <nav class="bg-[#F8FAFC] px-3 md:px-8 sticky top-0 z-50 border-b border-gray-100/80 backdrop-blur-sm">
    
    <div class="max-w-7xl mx-auto flex items-center justify-between py-2 md:py-3">
      
      <!-- Mobile: Logo + Hamburger (Visible on mobile only) -->
      <div class="flex items-center justify-between w-full md:hidden">
        <router-link to="/" class="flex-shrink-0">
          <img src="/navlogo.png" alt="Skill Sprint Robot" class="w-[100px] h-auto" />
        </router-link>
        <button
          @click="toggleMenu"
          class="p-2 -mr-1 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          aria-label="Toggle navigation menu"
          :aria-expanded="menuOpen"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <Transition name="icon-fade" mode="out-in">
              <path v-if="!menuOpen" key="open" stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              <path v-else key="close" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </Transition>
          </svg>
        </button>
      </div>
      
      <!-- Desktop: Logo + Menu + Button (All together centered) -->
      <div class="hidden md:flex items-center justify-center w-full gap-6 lg:gap-8">
        
        <!-- Logo -->
        <router-link to="/" class="flex-shrink-0">
          <img src="/navlogo.png" alt="Skill Sprint Robot" class="w-[130px] h-auto" />
        </router-link>

        <!-- Menu + Button Container -->
        <div class="flex items-center gap-[15px]">
          
          <!-- Menu -->
          <div class="flex flex-nowrap items-center gap-4 lg:gap-6
                      bg-gray-200 px-6 lg:px-8 py-3 lg:py-4 
                      rounded-full text-sm lg:text-base font-medium text-gray-500">
            <router-link to="/" class="transition cursor-pointer hover:text-blue-600 text-gray-500" exact-active-class="text-blue-600 font-bold">Home</router-link>
            <router-link to="/about" class="transition cursor-pointer hover:text-blue-600 text-gray-500" exact-active-class="text-blue-600 font-bold">About</router-link>
            <router-link to="/initiatives" class="transition cursor-pointer hover:text-blue-600 text-gray-500" exact-active-class="text-blue-600 font-bold">Initiatives</router-link>
            <router-link to="/sprints" class="transition cursor-pointer hover:text-blue-600 text-gray-500" exact-active-class="text-blue-600 font-bold">Sprints</router-link>
            <router-link to="/community" class="transition cursor-pointer hover:text-blue-600 text-gray-500" exact-active-class="text-blue-600 font-bold">Community</router-link>
            <router-link to="/team" class="transition cursor-pointer hover:text-blue-600 text-gray-500" exact-active-class="text-blue-600 font-bold">Team</router-link>
          </div>

          <!-- Button -->
          <router-link to="/contact-us">
            <button class="bg-blue-600 text-white px-6 lg:px-8 py-3 lg:py-4 
                           text-sm lg:text-base rounded-full font-medium 
                           hover:bg-blue-700 transition shadow-sm shadow-blue-100 cursor-pointer">
              Join the Sprint
            </button>
          </router-link>
          
        </div>
      </div>

    </div>

    <!-- Mobile Menu (Visible on mobile when menuOpen is true) -->
    <Transition name="slide-down">
      <div v-if="menuOpen" class="md:hidden bg-white border-t border-gray-100 shadow-lg pb-4">
        <div class="px-4 py-4 space-y-1">
          <router-link to="/" @click="closeMenu" class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-blue-600 text-sm transition-colors duration-150" exact-active-class="text-blue-600 font-bold bg-blue-50">
            Home
          </router-link>
          <router-link to="/about" @click="closeMenu" class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-blue-600 text-sm transition-colors duration-150" exact-active-class="text-blue-600 font-bold bg-blue-50">
            About
          </router-link>
          <router-link to="/initiatives" @click="closeMenu" class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-blue-600 text-sm transition-colors duration-150" exact-active-class="text-blue-600 font-bold bg-blue-50">
            Initiatives
          </router-link>
          <router-link to="/sprints" @click="closeMenu" class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-blue-600 text-sm transition-colors duration-150" exact-active-class="text-blue-600 font-bold bg-blue-50">
            Sprints
          </router-link>
          <router-link to="/community" @click="closeMenu" class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-blue-600 text-sm transition-colors duration-150" exact-active-class="text-blue-600 font-bold bg-blue-50">
            Community
          </router-link>
          <router-link to="/team" @click="closeMenu" class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-blue-600 text-sm transition-colors duration-150" exact-active-class="text-blue-600 font-bold bg-blue-50">
            Team
          </router-link>
          <div class="pt-3 pb-1">
            <router-link to="/contact-us" @click="closeMenu" class="block">
              <button class="w-full bg-blue-600 text-white py-3 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors duration-200 cursor-pointer">
                Join the Sprint
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </Transition>

  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const menuOpen = ref(false)
const route = useRoute()

const toggleMenu = () => { menuOpen.value = !menuOpen.value }
const closeMenu = () => { menuOpen.value = false }

// Close menu on route change
const handleKeydown = (e) => { if (e.key === 'Escape') closeMenu() }
onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.slide-down-enter-active {
  animation: slideDown 0.25s ease-out;
}
.slide-down-leave-active {
  animation: slideDown 0.2s ease-in reverse;
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: opacity 0.15s ease;
}
.icon-fade-enter-from,
.icon-fade-leave-to {
  opacity: 0;
}
</style>