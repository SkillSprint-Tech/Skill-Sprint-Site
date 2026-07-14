import { onMounted, onBeforeUnmount, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Automatically register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

/**
 * Custom hook to safely run GSAP animations in Vue 3.
 * Automatically wraps animations in a gsap.context for scoping and memory-safe cleanup.
 *
 * @param {Function} animationCallback - Callback containing GSAP animations
 * @param {import('vue').Ref|HTMLElement} [scope] - Optional scope element to restrict selector targets
 */
export function useGSAP(animationCallback, scope) {
  let ctx

  onMounted(() => {
    const scopeEl = scope && 'value' in scope ? scope.value : scope
    ctx = gsap.context(animationCallback, scopeEl)
    
    // Refresh ScrollTrigger instances on DOM updates to prevent transition glitches
    nextTick(() => {
      setTimeout(() => {
        ScrollTrigger.refresh()
      }, 150)
    })
  })

  onBeforeUnmount(() => {
    if (ctx) {
      ctx.revert()
    }
  })

  return { gsap, ScrollTrigger }
}
