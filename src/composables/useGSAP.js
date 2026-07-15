import { onMounted, onBeforeUnmount, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Custom hook to safely run GSAP animations in Vue 3.
 * The animationCallback receives { gsap, ScrollTrigger } as its first argument,
 * matching the usage pattern in Hero.vue and Whysection.vue:
 *   useGSAP((self) => { const { gsap } = self; ... }, scopeRef)
 *
 * @param {Function} animationCallback - receives { gsap, ScrollTrigger }
 * @param {import('vue').Ref|HTMLElement} [scope] - Optional scope ref to restrict targets
 */
export function useGSAP(animationCallback, scope) {
  let ctx

  onMounted(() => {
    nextTick(() => {
      setTimeout(() => {
        const scopeEl = scope && 'value' in scope ? scope.value : scope

        // Wrap callback in gsap.context for scoped selector support + easy cleanup
        ctx = gsap.context(() => {
          animationCallback({ gsap, ScrollTrigger })
        }, scopeEl)

        ScrollTrigger.refresh()

        // Second refresh after images / async content has settled
        setTimeout(() => ScrollTrigger.refresh(), 400)
      }, 300)
    })
  })

  onBeforeUnmount(() => {
    if (ctx) ctx.revert()
  })

  return { gsap, ScrollTrigger }
}
