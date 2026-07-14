<template>
  <Navbar />
  <router-view />
  <Footer />
  <ChatBot />
</template>

<script setup>
import Navbar from './components/LandingPage/Navbar.vue'
import Footer from './components/LandingPage/Footer.vue'
import ChatBot from './components/ChatBot.vue'
</script>