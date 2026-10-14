import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'

/**
 * One place that registers every GSAP plugin the motion layer uses, plus the site's
 * signature eases. Import from here (not 'gsap' directly) in motion code so the plugins
 * are guaranteed to be registered before anything runs.
 */
gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)

// "Cinematic" — fast attack, very long settle. The k72 / Apple curtain-and-reveal feel.
CustomEase.create('cinematic', 'M0,0 C0.16,1 0.3,1 1,1')
// "Curtain" — symmetrical, heavy in/out for wipes and stair transitions.
CustomEase.create('curtain', 'M0,0 C0.76,0 0.24,1 1,1')
// "Pop" — a soft overshoot for chips, tags and buttons.
CustomEase.create('pop', 'M0,0 C0.34,1.56 0.64,1 1,1')

// Mobile address-bar show/hide fires resize events; don't recompute every pin for it.
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger, SplitText, CustomEase }
