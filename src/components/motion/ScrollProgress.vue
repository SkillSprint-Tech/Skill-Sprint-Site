<template>
  <div class="scroll-progress" aria-hidden="true">
    <span ref="bar"></span>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap, ScrollTrigger } from '../../motion/gsap'

const bar = ref(null)
let st = null

onMounted(() => {
  const setScale = gsap.quickSetter(bar.value, 'scaleX')
  setScale(0)
  // start/end are re-measured on every ScrollTrigger.refresh(), so it adapts per page.
  st = ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => setScale(self.progress),
    onRefresh: (self) => setScale(self.progress),
  })
})

onBeforeUnmount(() => st?.kill())
</script>

<style scoped>
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 60;
  pointer-events: none;
}
.scroll-progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #60a5fa 60%, #93c5fd);
  transform-origin: left center;
  box-shadow: 0 0 12px rgba(37, 99, 235, 0.6);
}
</style>
