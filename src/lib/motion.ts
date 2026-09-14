import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Mobile browsers resize the viewport as the URL bar slides in and out; a full
// refresh on each of those makes pinned and scrubbed sections jump.
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger, useGSAP }

if (import.meta.env.DEV) {
  // Handle for driving animations from the console when rAF is throttled
  // (headless screenshots, background tabs).
  ;(window as unknown as Record<string, unknown>).__gsap = { gsap, ScrollTrigger }
}

export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  // ?still=1 renders every section in its settled state — used for visual QA.
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('still'))
    return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Reveal every `[data-reveal]` inside `scope` as it enters the viewport,
 * grouping elements that arrive together into one staggered run.
 */
export function revealIn(scope: Element) {
  if (prefersReducedMotion()) {
    gsap.set(scope.querySelectorAll('[data-reveal]'), { opacity: 1, y: 0 })
    return
  }

  return ScrollTrigger.batch(scope.querySelectorAll('[data-reveal]'), {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        overwrite: true,
      }),
  })
}

/** Repaint the page accent while `trigger` owns the viewport. */
export function paintAccent(trigger: Element, accent: string, ink: string) {
  const root = document.documentElement
  return ScrollTrigger.create({
    trigger,
    start: 'top 65%',
    end: 'bottom 35%',
    onToggle: (self) => {
      if (!self.isActive) return
      root.style.setProperty('--accent', accent)
      root.style.setProperty('--accent-ink', ink)
    },
  })
}
