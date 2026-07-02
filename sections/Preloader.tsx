'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { FluffyHugsLogo } from '@/common/FluffyHugsLogo'
import { useLoadState } from '@/components/providers/LoadStateProvider'
import {
  MAX_PRELOAD_MS,
  MIN_PRELOAD_MS,
  REDUCED_MOTION_QUERY,
  TRACKED_ASSET_COUNT,
} from '@/lib/animation'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import Bunny from '@/public/nfts/1.png'

/**
 * Full-screen overlay that covers the page until the hero's images have
 * loaded. Exit is gated on BOTH a minimum display time (fast connections
 * still get the branded moment) and either all assets or a hard timeout
 * (slow connections can never deadlock the reveal).
 */
export const Preloader = () => {
  const rootRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const proxyRef = useRef({ value: 0 })
  const { loadedCount, finishLoading } = useLoadState()
  const [minElapsed, setMinElapsed] = useState(false)
  const [timedOut, setTimedOut] = useState(false)

  const done = minElapsed && (loadedCount >= TRACKED_ASSET_COUNT || timedOut)

  useEffect(() => {
    const minTimer = setTimeout(() => setMinElapsed(true), MIN_PRELOAD_MS)
    const maxTimer = setTimeout(() => setTimedOut(true), MAX_PRELOAD_MS)
    return () => {
      clearTimeout(minTimer)
      clearTimeout(maxTimer)
    }
  }, [])

  const writeCounter = () => {
    if (counterRef.current) {
      counterRef.current.textContent = `${Math.round(proxyRef.current.value)}%`
    }
  }

  // The visible counter eases toward real progress and writes straight to
  // the DOM — no React state, no re-renders. It parks at 99 until the exit
  // timeline pushes it to 100.
  useEffect(() => {
    const target = Math.min(
      99,
      Math.round((loadedCount / TRACKED_ASSET_COUNT) * 100),
    )
    const tween = gsap.to(proxyRef.current, {
      value: target,
      duration: 0.6,
      ease: 'power1.out',
      onUpdate: writeCounter,
    })
    return () => {
      tween.kill()
    }
  }, [loadedCount])

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      const reduce = window.matchMedia(REDUCED_MOTION_QUERY).matches

      if (!done) {
        // Idle squash-and-stretch bounce while loading.
        if (reduce) return
        gsap
          .timeline({ repeat: -1, delay: 0.2 })
          .set('[data-mascot]', { transformOrigin: '50% 100%' })
          .to('[data-mascot]', {
            yPercent: -24,
            scaleX: 0.96,
            scaleY: 1.05,
            duration: 0.45,
            ease: 'power2.out',
          })
          .to('[data-mascot]', {
            yPercent: 0,
            scaleX: 1.08,
            scaleY: 0.92,
            duration: 0.45,
            ease: 'power2.in',
          })
          .to('[data-mascot]', {
            scaleX: 1,
            scaleY: 1,
            duration: 0.2,
            ease: 'power1.out',
          })
        return
      }

      const complete = () => {
        gsap.set(root, { display: 'none' })
        finishLoading()
        ScrollTrigger.refresh()
      }

      if (reduce) {
        gsap.to(root, { autoAlpha: 0, duration: 0.3, onComplete: complete })
        return
      }

      // Exit: counter lands on 100, the mascot leaps off, then a two-tone
      // curtain (cream over ink) wipes upward to reveal the page.
      gsap
        .timeline({ onComplete: complete })
        .to(proxyRef.current, {
          value: 100,
          duration: 0.5,
          ease: 'power1.inOut',
          overwrite: true,
          onUpdate: writeCounter,
        })
        .set('[data-mascot]', { transformOrigin: '50% 100%' }, 0)
        .to(
          '[data-mascot]',
          { scaleX: 1.15, scaleY: 0.82, duration: 0.22, ease: 'power2.in' },
          0.3,
        )
        .to('[data-mascot]', {
          yPercent: -280,
          scaleX: 0.94,
          scaleY: 1.12,
          autoAlpha: 0,
          duration: 0.55,
          ease: 'power2.in',
        })
        .to('[data-loader-content]', { autoAlpha: 0, duration: 0.3 }, '<0.2')
        .to(
          '[data-panel-front]',
          { yPercent: -100, duration: 0.7, ease: 'power4.inOut' },
          '-=0.25',
        )
        .to(
          '[data-panel-back]',
          { yPercent: -100, duration: 0.7, ease: 'power4.inOut' },
          '-=0.55',
        )
    },
    { scope: rootRef, dependencies: [done] },
  )

  return (
    <div
      ref={rootRef}
      data-preloader
      role='status'
      aria-label='Loading page'
      className='fixed inset-0 z-50'
    >
      <noscript>
        <style>{`[data-preloader]{display:none}`}</style>
      </noscript>
      <div data-panel-back className='absolute inset-0 bg-ink' />
      <div data-panel-front className='absolute inset-0 bg-cream' />
      <div
        data-loader-content
        className='absolute inset-0 flex flex-col items-center justify-center gap-6'
      >
        <div data-mascot className='w-24 md:w-32'>
          <Image
            src={Bunny}
            alt=''
            loading='eager'
            sizes='128px'
            className='h-auto w-full'
          />
        </div>
        <span
          ref={counterRef}
          className='font-display text-4xl font-bold tabular-nums md:text-5xl'
        >
          0%
        </span>
        <div className='absolute bottom-10 flex w-full justify-center'>
          <FluffyHugsLogo />
        </div>
      </div>
    </div>
  )
}
