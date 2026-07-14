<template>
  <div class="overflow-x-hidden">
    <Hero />
    <AboutSection />
    <Whysection />
    <Testimonial />
    <Stats />
    <Partner />
  </div>
</template>

<script setup>
import Hero from '../components/LandingPage/Hero.vue'
import AboutSection from '../components/LandingPage/AboutSection.vue'
import Whysection from '../components/LandingPage/Whysection.vue'
import Testimonial from '../components/LandingPage/Testimonial.vue'
import Stats from '../components/LandingPage/Stats.vue'
import Partner from '../components/LandingPage/Partner.vue'
import { onMounted } from 'vue';

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.reveal-hidden').forEach((el) => {
    observer.observe(el);
  });
});
</script>

<style scoped>
.reveal-hidden {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.reveal-visible {
  opacity: 1;
  transform: translateY(0);
}
.reveal-delay-1 {
  transition-delay: 150ms;
}
.reveal-delay-2 {
  transition-delay: 300ms;
}
.reveal-delay-3 {
  transition-delay: 450ms;
}
</style>