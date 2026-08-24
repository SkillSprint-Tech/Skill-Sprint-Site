<template>
  <!-- Admin runs on a bare layout: no marketing nav, footer, or chatbot. -->
  <Navbar v-if="!bare" />
  <router-view />
  <template v-if="!bare">
    <Footer />
    <ChatBot />
  </template>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/LandingPage/Navbar.vue'
import Footer from './components/LandingPage/Footer.vue'
import ChatBot from './components/ChatBot.vue'

const route = useRoute()
const bare = computed(() => Boolean(route.meta?.bareLayout))
</script>
