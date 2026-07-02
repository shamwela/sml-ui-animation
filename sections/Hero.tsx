'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { useLoadState } from '@/components/providers/LoadStateProvider'
import { SplitChars } from '@/components/SplitChars'
import { REDUCED_MOTION_QUERY } from '@/lib/animation'
import { gsap, useGSAP } from '@/lib/gsap'
import Bunny from '@/public/nfts/1.png'
import Bear from '@/public/nfts/2.png'
import Cat from '@/public/nfts/3.png'
import Chick from '@/public/nfts/4.png'
import Pup from '@/public/nfts/5.png'

const TAGLINE = 'ふわふわの動物たちに、囲まれて暮らしたい'

/**
 * Each character gets three transform layers that never fight:
 * outer div  — scroll-driven scatter (ScrollTrigger, `transform`)
 * inner div  — entrance pop + infinite idle float (GSAP, `transform`)
 * <Image>    — CSS hover scale (native `scale` property)
 * Scatter vectors are fractions of the viewport so characters always
 * clear the screen edge, on any display size.
 */
const characters = [
  {
    src: Bunny,
    alt: 'Fluffy bunny character',
    position: 'top-[16%] left-[6%] md:top-[18%] md:left-[12%]',
    size: 'w-24 md:w-32 lg:w-40',
    scatter: { fx: -0.55, fy: -0.5, rotation: -30 },
    main: true,
  },
  {
    src: Bear,
    alt: 'Fluffy bear character',
    position: 'top-[12%] right-[8%] md:top-[14%] md:right-[14%]',
    size: 'w-20 md:w-28 lg:w-36',
    scatter: { fx: 0.6, fy: -0.45, rotation: 25 },
  },
  {
    src: Cat,
    alt: 'Fluffy cat character',
    position: 'bottom-[24%] left-[10%] md:bottom-[26%] md:left-[18%]',
    size: 'w-20 md:w-28 lg:w-36',
    scatter: { fx: -0.6, fy: 0.5, rotation: -20 },
  },
  {
    src: Chick,
    alt: 'Fluffy chick character',
    position: 'right-[6%] bottom-[20%] md:right-[12%] md:bottom-[22%]',
    size: 'w-24 md:w-32 lg:w-40',
    scatter: { fx: 0.55, fy: 0.55, rotation: 35 },
  },
  {
    src: Pup,
    alt: 'Fluffy puppy character',
    position: 'bottom-[7%] left-[62%] md:bottom-[10%] md:left-[46%]',
    size: 'w-16 md:w-24 lg:w-28',
    scatter: { fx: 0.1, fy: 0.8, rotation: 15 },
  },
]

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const { assetLoaded, ready } = useLoadState()

  useGSAP(
    (_, contextSafe) => {
      const section = sectionRef.current
      if (!section) return

      const chars = gsap.utils.toArray<HTMLElement>('[data-char]', section)
      const floats = gsap.utils.toArray<HTMLElement>('[data-float]', section)
      const scatters = gsap.utils.toArray<HTMLElement>(
        '[data-scatter]',
        section,
      )
      const fades = gsap.utils.toArray<HTMLElement>('[data-fade]', section)
      const chrome = document.querySelectorAll('[data-chrome]')

      const mm = gsap.matchMedia()

      mm.add(
        {
          reduce: REDUCED_MOTION_QUERY,
          motion: '(prefers-reduced-motion: no-preference)',
        },
        (ctx) => {
          const { reduce } = ctx.conditions as { reduce: boolean }

          if (reduce) {
            gsap.set([section, ...chrome], { autoAlpha: 0 })
            if (ready) {
              gsap.to([section, ...chrome], { autoAlpha: 1, duration: 0.4 })
            }
            return
          }

          gsap.set(chars, { yPercent: 100, autoAlpha: 0 })
          gsap.set(floats, {
            scale: 0,
            y: 30,
            transformOrigin: '50% 100%',
          })
          gsap.set(fades, { autoAlpha: 0, y: 16 })
          gsap.set(chrome, { autoAlpha: 0 })

          if (!ready) return

          const startFloats = contextSafe!(() => {
            floats.forEach((el) => {
              gsap.to(el, {
                y: gsap.utils.random(-14, -26),
                duration: gsap.utils.random(1.4, 2.2),
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                delay: gsap.utils.random(0, 0.6),
              })
            })
          })

          gsap
            .timeline({ defaults: { ease: 'power3.out' } })
            .to(chars, {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.8,
              stagger: 0.03,
              ease: 'back.out(1.7)',
            })
            .to(
              floats,
              {
                scale: 1,
                y: 0,
                duration: 1.1,
                ease: 'elastic.out(1, 0.6)',
                stagger: 0.08,
              },
              '-=0.5',
            )
            .to(fades, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.9')
            .to(chrome, { autoAlpha: 1, duration: 0.6 }, '<')
            .call(startFloats)

          // pinSpacing: false lets the collection slide over the hero while
          // the characters scatter — no dead scroll gap between sections.
          const scatterTl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: '+=80%',
              scrub: 1,
              pin: true,
              pinSpacing: false,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })

          scatters.forEach((el, index) => {
            const { fx, fy, rotation } = characters[index].scatter
            scatterTl.to(
              el,
              {
                x: () => fx * window.innerWidth,
                y: () => fy * window.innerHeight,
                rotation,
                duration: 1,
                ease: 'none',
              },
              0,
            )
          })

          scatterTl.to(
            '[data-tagline]',
            { yPercent: -60, autoAlpha: 0, duration: 0.5, ease: 'none' },
            0,
          )

          scatterTl.to(
            '[data-hint]',
            { autoAlpha: 0, duration: 0.25, ease: 'none' },
            0,
          )
        },
      )
    },
    { scope: sectionRef, dependencies: [ready] },
  )

  return (
    <section
      ref={sectionRef}
      className='relative flex min-h-svh items-center justify-center overflow-hidden'
    >
      {characters.map(({ src, alt, position, size, main }) => (
        <div
          key={alt}
          data-scatter
          className={`absolute will-change-transform ${position} ${size}`}
        >
          <div data-float>
            <Image
              src={src}
              alt={alt}
              fetchPriority={main ? 'high' : 'auto'}
              onLoad={assetLoaded}
              onError={assetLoaded}
              sizes='(min-width: 1024px) 160px, (min-width: 768px) 128px, 96px'
              className='h-auto w-full transition-transform duration-300 ease-out hover:scale-110'
            />
          </div>
        </div>
      ))}

      <div data-tagline className='relative z-10 px-6 text-center'>
        <h1
          lang='ja'
          className='text-2xl leading-relaxed font-bold tracking-wider md:text-4xl lg:text-5xl'
        >
          <SplitChars text={TAGLINE} />
        </h1>
        <p
          data-fade
          className='font-display mt-5 text-xs tracking-[0.35em] uppercase opacity-70 md:text-sm'
        >
          Live surrounded by fluffy animal friends
        </p>
      </div>

      <div
        data-fade
        data-hint
        className='font-display absolute bottom-24 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase md:bottom-10 md:text-xs'
      >
        <span className='motion-safe:animate-bounce inline-block'>
          scroll ↓
        </span>
      </div>
    </section>
  )
}
