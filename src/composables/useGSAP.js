import { onMounted, onBeforeUnmount, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Natural ("revealed") value for each transform/opacity property. Used to turn a `from`
// tween into an explicit `fromTo` — see wrapGsap below.
const NATURAL = {
  opacity: 1, autoAlpha: 1,
  x: 0, y: 0, z: 0, xPercent: 0, yPercent: 0,
  scale: 1, scaleX: 1, scaleY: 1,
  rotation: 0, rotationX: 0, rotationY: 0, rotationZ: 0,
  skewX: 0, skewY: 0,
}

/**
 * Return a gsap facade whose `.from()` is rewritten to `.fromTo()` with an explicit visible
 * end state. `gsap.from()` records its END values from the element's *current* state; when a
 * ScrollTrigger refresh re-inits the tween (which we need for correct positioning), it can
 * re-record the already-applied "from" values (e.g. opacity 0) as the end — so the reveal
 * "completes" to an invisible/half-visible state. `fromTo()` states the end explicitly, so a
 * refresh can never corrupt it. Everything else on gsap is delegated untouched.
 */
const wrapGsap = (g) =>
  new Proxy(g, {
    get(target, prop) {
      if (prop === 'from') {
        return (targets, vars) => {
          if (!vars || typeof vars !== 'object') return target.from(targets, vars)
          const fromVars = {}
          const toVars = {}
          for (const key in vars) {
            if (Object.prototype.hasOwnProperty.call(NATURAL, key)) {
              fromVars[key] = vars[key]
              toVars[key] = NATURAL[key]
            } else {
              toVars[key] = vars[key] // config: scrollTrigger, duration, ease, stagger, delay…
            }
          }
          return target.fromTo(targets, fromVars, toVars)
        }
      }
      const value = target[prop]
      return typeof value === 'function' ? value.bind(target) : value
    },
  })

/**
 * Custom hook to safely run GSAP animations in Vue 3.
 *
 * Reliability layers (a scroll-reveal must NEVER leave content permanently invisible):
 *   1. `from` → `fromTo` rewrite (wrapGsap): removes the refresh end-value corruption.
 *   2. Late, settled measurement: build after fonts are ready + two paint frames, then refresh
 *      again as async layout (fonts/images) settles, so trigger positions are correct.
 *   3. IntersectionObserver rescue: if an element is in view but a settled reveal left it not
 *      fully visible, detach the trigger and fade it in.
 *   4. prefers-reduced-motion: skip all GSAP setup so content shows statically (the two
 *      JS-positioned "fanned" decks get a CSS fallback in style.css).
 *
 * Teardown reverts ONLY this component's context, so it never kills another component's
 * triggers (which previously broke the three useGSAP calls in TeamView).
 *
 * @param {Function} animationCallback - receives { gsap, ScrollTrigger, selector }
 * @param {import('vue').Ref|HTMLElement} [scope] - Optional scope ref to restrict targets
 */
export function useGSAP(animationCallback, scope) {
  let ctx
  let cancelled = false
  const rafIds = []
  const timeoutIds = []
  const observers = []

  const refresh = () => {
    if (!cancelled) ScrollTrigger.refresh()
  }

  // Watch each animated element. If it is well into view but a *settled* (no longer animating)
  // reveal left it less than fully visible, restore it to a correct, visible state.
  const attachRescue = (triggers) => {
    if (typeof IntersectionObserver === 'undefined') return
    triggers.forEach((st) => {
      const anim = st.animation
      if (!anim || typeof anim.targets !== 'function') return
      anim.targets().forEach((el) => {
        if (!(el instanceof Element)) return
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            io.unobserve(entry.target)
            // Wait past the longest reveal so a still-animating element (a stagger stays
            // `isActive` until its last target finishes) isn't mistaken for a stuck one.
            timeoutIds.push(setTimeout(() => {
              if (cancelled) return
              if (!anim.isActive() && parseFloat(getComputedStyle(el).opacity) < 0.9) {
                st.disable(false)
                gsap.set(el, { clearProps: 'transform,visibility' })
                gsap.to(el, { opacity: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
              }
            }, 1200))
          })
        }, { rootMargin: '0px 0px -20% 0px' })
        io.observe(el)
        observers.push(io)
      })
    })
  }

  const build = () => {
    if (cancelled || prefersReducedMotion()) return

    const scopeEl = scope && 'value' in scope ? scope.value : scope
    const wrapped = wrapGsap(gsap)
    const before = new Set(ScrollTrigger.getAll())

    ctx = gsap.context((gCtx) => {
      const scopedSelector = (query) => {
        if (gCtx && typeof gCtx.selector === 'function') {
          return gCtx.selector(query)
        }
        return gsap.utils.toArray(query, scopeEl)
      }
      animationCallback({ gsap: wrapped, ScrollTrigger, selector: scopedSelector })
    }, scopeEl)

    const created = ScrollTrigger.getAll().filter((t) => !before.has(t))

    // One measurement, now — the layout is already settled (we waited for fonts + two paint
    // frames). We deliberately avoid later refreshes: a refresh that lands after a reveal has
    // played can re-toggle a `reverse` ScrollTrigger and hide the content again. The rescue
    // net below covers any residual late layout shift instead.
    refresh()

    attachRescue(created)
  }

  onMounted(() => {
    nextTick(() => {
      const afterPaint = () => {
        const r1 = requestAnimationFrame(() => {
          const r2 = requestAnimationFrame(build)
          rafIds.push(r2)
        })
        rafIds.push(r1)
      }
      // Build once fonts are ready (they shift text metrics, hence trigger positions). On SPA
      // navigation this promise is already resolved, so there's no extra delay.
      if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
        let started = false
        const go = () => { if (!started && !cancelled) { started = true; afterPaint() } }
        document.fonts.ready.then(go).catch(go)
        timeoutIds.push(setTimeout(go, 1000)) // fallback if fonts.ready stalls
      } else {
        afterPaint()
      }
    })
  })

  onBeforeUnmount(() => {
    cancelled = true
    rafIds.forEach((id) => cancelAnimationFrame(id))
    timeoutIds.forEach((id) => clearTimeout(id))
    observers.forEach((io) => io.disconnect())

    // Reverts every tween/set created in this context AND kills their ScrollTriggers,
    // restoring the DOM to its natural (visible) state. Scoped — never touches siblings'.
    if (ctx) ctx.revert()
  })

  return { gsap, ScrollTrigger }
}
