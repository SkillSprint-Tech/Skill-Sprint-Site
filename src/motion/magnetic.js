import { gsap } from './gsap'
import { hasFinePointer, prefersReducedMotion } from './intro'

/**
 * v-magnetic — the element leans toward the cursor while hovered and springs back on leave.
 *
 *   <router-link v-magnetic to="/x">…</router-link>
 *   <a v-magnetic="0.5">…</a>           // strength 0–1 (default 0.35)
 *
 * Mouse-only and motion-safe: on touch devices or with reduced motion it does nothing.
 * Uses GSAP transforms (x/y), which compose with Tailwind v4's `scale` hover utilities.
 */
const STATE = Symbol('magnetic')

export const vMagnetic = {
  mounted(el, binding) {
    if (!hasFinePointer() || prefersReducedMotion()) return
    const strength = typeof binding.value === 'number' ? binding.value : 0.35
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)', overwrite: 'auto' })
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    el[STATE] = { onMove, onLeave }
  },
  unmounted(el) {
    const s = el[STATE]
    if (!s) return
    el.removeEventListener('pointermove', s.onMove)
    el.removeEventListener('pointerleave', s.onLeave)
    gsap.killTweensOf(el)
    delete el[STATE]
  },
}
