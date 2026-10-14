/**
 * Intro signal — a single promise every "first paint" animation can wait on.
 *
 * The preloader resolves it as its curtain lifts, so the hero's entrance, the LoopVerse
 * popup and the countdown all start *after* the intro instead of playing hidden underneath
 * it. When there's no preloader (reduced motion, bare-layout routes) it is resolved straight
 * away, so nothing ever waits on an intro that will never come.
 */
let resolveIntro
const introPromise = new Promise((resolve) => { resolveIntro = resolve })
let done = false

export const markIntroDone = () => {
  if (done) return
  done = true
  resolveIntro()
}

export const isIntroDone = () => done

export const whenIntroDone = () => introPromise

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Fine pointer + hover = a real mouse. Cursor and magnetic effects are mouse-only. */
export const hasFinePointer = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches
