<template>
  <Preloader v-if="!bare" />
  <PageTransition />
  <CustomCursor v-if="!bare" />
  <ScrollProgress v-if="!bare" />

  <!-- Admin runs on a bare layout: no marketing nav, footer, or chatbot. -->
  <Navbar v-if="!bare" />
  <router-view />
  <template v-if="!bare">
    <Footer />
    <ChatBot />
  </template>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/LandingPage/Navbar.vue'
import Footer from './components/LandingPage/Footer.vue'
import ChatBot from './components/ChatBot.vue'
import Preloader from './components/motion/Preloader.vue'
import PageTransition from './components/motion/PageTransition.vue'
import CustomCursor from './components/motion/CustomCursor.vue'
import ScrollProgress from './components/motion/ScrollProgress.vue'
import { enableSmoothScroll, disableSmoothScroll } from './motion/smoothScroll'

const route = useRoute()
const bare = computed(() => Boolean(route.meta?.bareLayout))

onMounted(() => {
  enableSmoothScroll()
})

onBeforeUnmount(() => {
  disableSmoothScroll()
})
</script>
