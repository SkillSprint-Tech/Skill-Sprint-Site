import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './intro'

gsap.registerPlugin(ScrollTrigger)

/**
 * Site-wide inertial smooth scrolling (Lenis), driven by GSAP's ticker so ScrollTrigger and
 * Lenis read the exact same frame — scrubbed timelines never lag a frame behind the scroll.
 *
 * Lenis smooths the *native* window scroll (no transformed wrapper), so `position: sticky`
 * (the navbar) and `position: fixed` (chatbot, countdown, popup) keep working untouched.
 *
 * Safety rails:
 *   - Never enabled for reduced-motion users.
 *   - Any code that locks the page with `overflow: hidden` on <html>/<body> (the LoopVerse
 *     popup, modals) pauses Lenis automatically, so a locked page can't be wheel-scrolled.
 *   - Nested scroll areas (chat window, modal bodies) scroll natively (allowNestedScroll).
 */

let lenis = null
let tickerFn = null
let lockObserver = null

const pageIsLocked = () => {
  const html = document.documentElement
  const body = document.body
  return html.style.overflow === 'hidden' || body?.style.overflow === 'hidden'
}

const syncLock = () => {
  if (!lenis) return
  if (pageIsLocked()) lenis.stop()
  else if (lenis.isStopped) lenis.start()
}

export function enableSmoothScroll() {
  if (lenis || typeof window === 'undefined' || prefersReducedMotion()) return lenis

  lenis = new Lenis({
    // Long, weighty glide — the "k72 / apple" feel — without feeling detached.
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
    allowNestedScroll: true,
    stopInertiaOnNavigate: true,
    autoRaf: false,
  })

  lenis.on('scroll', ScrollTrigger.update)
  tickerFn = (time) => lenis?.raf(time * 1000)
  gsap.ticker.add(tickerFn)
  gsap.ticker.lagSmoothing(0)

  lockObserver = new MutationObserver(syncLock)
  lockObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] })
  if (document.body) lockObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] })
  syncLock()

  return lenis
}

export function disableSmoothScroll() {
  if (!lenis) return
  lockObserver?.disconnect()
  lockObserver = null
  if (tickerFn) gsap.ticker.remove(tickerFn)
  tickerFn = null
  lenis.destroy()
  lenis = null
}

export const getLenis = () => lenis

/** Jump to the top instantly — used on route change so Lenis' target matches the page. */
export function resetScroll() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo({ left: 0, top: 0, behavior: 'instant' })
}
