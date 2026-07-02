'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'
import { REDUCED_MOTION_QUERY } from '@/lib/animation'
import { gsap, ScrollTrigger } from '@/lib/gsap'

/**
 * Lenis in root mode (native window scroll, no wrapper element) so
 * ScrollTrigger pinning keeps its default `pinType: 'fixed'`.
 * A single rAF — GSAP's ticker — drives both libraries to keep
 * scroll-scrubbed animations and smooth scrolling in lockstep.
 */
export const SmoothScroll = () => {
  useEffect(() => {
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return

    const lenis = new Lenis({ autoRaf: false, lerp: 0.1 })
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return null
}
