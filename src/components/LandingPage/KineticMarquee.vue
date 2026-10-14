<template>
  <!-- Kinetic type band (k72-style): two oversized marquee rows that run in opposite
       directions, accelerate and skew with scroll velocity, and flip with scroll direction. -->
  <section ref="scope" class="mq-band" aria-label="Learn by doing. Build by collaborating. Join the Sprint.">
    <div class="mq-row mq-row--solid" aria-hidden="true">
      <div class="mq-shift">
        <div class="mq-track">
          <template v-for="pass in 2" :key="`a${pass}`">
            <span v-for="(word, i) in words" :key="`a${pass}-${i}`" class="mq-item">
              {{ word }}
              <svg class="mq-star" viewBox="0 0 24 24"><path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" /></svg>
            </span>
          </template>
        </div>
      </div>
    </div>

    <div class="mq-row mq-row--outline" aria-hidden="true">
      <div class="mq-shift">
        <div class="mq-track">
          <template v-for="pass in 2" :key="`b${pass}`">
            <span v-for="(word, i) in wordsAlt" :key="`b${pass}-${i}`" class="mq-item">
              {{ word }}
              <svg class="mq-star" viewBox="0 0 24 24"><path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" /></svg>
            </span>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useGSAP } from '../../composables/useGSAP'

const scope = ref(null)
const words = ['Learn by doing', 'Build by collaborating', 'Join the Sprint']
const wordsAlt = ['Student-powered', 'Real projects', 'Free & open', 'Community-driven']

useGSAP(({ gsap, ScrollTrigger, selector }) => {
  const tracks = selector('.mq-track')
  const shifts = selector('.mq-shift')

  // Infinite loops — each track holds two identical passes, so -50% is a seamless wrap.
  const loops = tracks.map((track, i) =>
    gsap.fromTo(track,
      { xPercent: i === 0 ? 0 : -50 },
      { xPercent: i === 0 ? -50 : 0, duration: i === 0 ? 38 : 46, ease: 'none', repeat: -1 })
  )

  // Scrubbed drift on top of the loop, opposite per row — the band "shears" as you pass.
  gsap.timeline({
    scrollTrigger: { trigger: scope.value, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
  })
    .fromTo(shifts[0], { xPercent: 6 }, { xPercent: -10, ease: 'none' }, 0)
    .fromTo(shifts[1], { xPercent: -10 }, { xPercent: 6, ease: 'none' }, 0)

  // Velocity: speed up + skew with scroll speed, reverse with scroll direction.
  const skewTo = gsap.quickTo(tracks, 'skewX', { duration: 0.5, ease: 'power3.out' })
  let direction = 1
  ScrollTrigger.create({
    trigger: scope.value,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      const v = self.getVelocity()
      if (self.direction !== direction) direction = self.direction
      const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(v) / 350)
      loops.forEach((loop) => {
        gsap.to(loop, { timeScale: direction * boost, duration: 0.2, overwrite: true })
        gsap.to(loop, { timeScale: direction, duration: 1.2, delay: 0.2, ease: 'power2.out' })
      })
      skewTo(gsap.utils.clamp(-14, 14, v / -250))
    },
    onLeave: () => skewTo(0),
    onLeaveBack: () => skewTo(0),
  })
}, scope)
</script>

<style scoped>
.mq-band {
  position: relative;
  overflow: hidden;
  background: #f8fafc;
  padding-block: clamp(3rem, 8vw, 7rem);
}
.mq-row {
  width: 112%;
  margin-left: -6%;
  overflow: hidden;
}
.mq-row--solid {
  background: #2563eb;
  color: #fff;
  transform: rotate(-2.5deg);
  box-shadow: 0 30px 60px -30px rgba(37, 99, 235, 0.55);
  position: relative;
  z-index: 2;
}
.mq-row--outline {
  color: transparent;
  -webkit-text-stroke: 1.5px #0b101b;
  transform: rotate(1.5deg);
  margin-top: -0.5rem;
}
.mq-track {
  display: flex;
  width: max-content;
  will-change: transform;
}
.mq-item {
  display: inline-flex;
  align-items: center;
  gap: clamp(1rem, 3vw, 2.5rem);
  padding-right: clamp(1rem, 3vw, 2.5rem);
  white-space: nowrap;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.04em;
  line-height: 1;
  font-size: clamp(2.5rem, 8vw, 7.5rem);
  padding-block: 0.18em;
}
.mq-star {
  width: 0.45em;
  height: 0.45em;
  flex-shrink: 0;
  fill: currentColor;
}
.mq-row--solid .mq-star { fill: #bfdbfe; }
.mq-row--outline .mq-star {
  fill: #2563eb;
  -webkit-text-stroke: 0;
}
</style>
