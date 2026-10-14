<template>
  <div class="landing-page overflow-x-hidden">
    <Hero />
    <KineticMarquee />
    <AboutSection />
    <Whysection />
    <Testimonial />
    <Stats />
    <Partner />
    <PartnerEventPopup />
    <PartnerEventCountdown />
  </div>
</template>

<script setup>
import Hero from '../components/LandingPage/Hero.vue'
import KineticMarquee from '../components/LandingPage/KineticMarquee.vue'
import AboutSection from '../components/LandingPage/AboutSection.vue'
import Whysection from '../components/LandingPage/Whysection.vue'
import Testimonial from '../components/LandingPage/Testimonial.vue'
import Stats from '../components/LandingPage/Stats.vue'
import Partner from '../components/LandingPage/Partner.vue'
import PartnerEventPopup from '../components/LandingPage/PartnerEventPopup.vue'
import PartnerEventCountdown from '../components/LandingPage/PartnerEventCountdown.vue'
</script>

<style scoped>
.landing-page {
  position: relative;
  width: 100%;
}
</style>