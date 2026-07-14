import { onMounted, onBeforeUnmount, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Automatically register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

/**
 * Custom hook to safely run GSAP animations in Vue 3.
 * Automatically wraps animations in a gsap.context for scoping and memory-safe cleanup.
 * Uses a nextTick + timeout delay to ensure asynchronous elements (like v-for items from local storage) are fully compiled.
 *
 * @param {Function} animationCallback - Callback containing GSAP animations
 * @param {import('vue').Ref|HTMLElement} [scope] - Optional scope element to restrict selector targets
 */
export function useGSAP(animationCallback, scope) {
  let ctx

  onMounted(() => {
    nextTick(() => {
      // 80ms delay guarantees that any dynamically rendered arrays (e.g. team lists) have resolved and are present in the DOM
      setTimeout(() => {
        const scopeEl = scope && 'value' in scope ? scope.value : scope
        ctx = gsap.context(animationCallback, scopeEl)
        ScrollTrigger.refresh()
      }, 80)
    })
  })

  onBeforeUnmount(() => {
    if (ctx) {
      ctx.revert()
    }
  })

  return { gsap, ScrollTrigger }
}
