'use client'

import { useRef } from 'react'
import { NftCard } from '@/components/NftCard'
import { SplitChars } from '@/components/SplitChars'
import { DESKTOP_QUERY, REDUCED_MOTION_QUERY } from '@/lib/animation'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import Bunny from '@/public/nfts/1.png'
import Bear from '@/public/nfts/2.png'
import Cat from '@/public/nfts/3.png'
import Chick from '@/public/nfts/4.png'
import Pup from '@/public/nfts/5.png'

const artworks = [Bunny, Bear, Cat, Chick, Pup]

/** 10 cards from the 5 artworks — enough width for the pinned gallery. */
const cards = Array.from({ length: 10 }, (_, index) => ({
  src: artworks[index % artworks.length],
  number: index + 1,
}))

export const Collection = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      const track = trackRef.current
      if (!section || !track) return

      const headingChars = gsap.utils.toArray<HTMLElement>(
        '[data-char]',
        section,
      )
      const cardEls = gsap.utils.toArray<HTMLElement>('[data-card]', section)
      const cardImgs = gsap.utils.toArray<HTMLElement>(
        '[data-card-img]',
        section,
      )

      const mm = gsap.matchMedia()

      mm.add(
        {
          desktop: DESKTOP_QUERY,
          reduce: REDUCED_MOTION_QUERY,
        },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions as {
            desktop: boolean
            reduce: boolean
          }

          // Reduced motion: static layout, everything visible.
          if (reduce) return

          gsap.set(headingChars, { yPercent: 100, autoAlpha: 0 })
          gsap.to(headingChars, {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.7,
            stagger: 0.04,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
            },
          })

          if (desktop) {
            // Pinned horizontal gallery: vertical scroll scrubs the track
            // sideways, with a subtle counter-drift on each artwork for depth.
            const distance = () => track.scrollWidth - window.innerWidth

            const pinTl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: () => `+=${distance()}`,
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            })

            pinTl.to(track, { x: () => -distance(), ease: 'none' }, 0)
            pinTl.fromTo(
              cardImgs,
              { xPercent: -4 },
              { xPercent: 4, ease: 'none' },
              0,
            )
          } else {
            // Tablet / mobile: staggered rise-in as cards enter the viewport.
            gsap.set(cardEls, { y: 48, autoAlpha: 0 })
            ScrollTrigger.batch(cardEls, {
              start: 'top 92%',
              once: true,
              onEnter: (batch) =>
                gsap.to(batch, {
                  y: 0,
                  autoAlpha: 1,
                  duration: 0.7,
                  stagger: 0.08,
                  ease: 'power3.out',
                }),
            })
          }
        },
      )
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className='bg-cream relative z-10 flex flex-col justify-center py-24 pb-44 lg:min-h-svh lg:py-0'
    >
      <div className='px-5 md:px-10 lg:px-12'>
        <p className='font-display text-xs tracking-[0.35em] uppercase opacity-60 md:text-sm'>
          3,333 generative fluffy friends
        </p>
        <h2 className='font-display mt-2 overflow-hidden text-4xl font-bold tracking-wide md:text-6xl lg:text-7xl'>
          <SplitChars text='COLLECTION' />
        </h2>
        <p
          lang='ja'
          className='mt-4 max-w-xl text-sm leading-relaxed md:text-base'
        >
          可愛い動物達を描いた3,333体のジェネラティブNFT。ブロックチェーンで、世界中の動物好きにお届けします。
        </p>
      </div>

      <div className='mt-12 motion-safe:lg:overflow-x-clip motion-reduce:lg:overflow-x-auto'>
        <div
          ref={trackRef}
          className='grid grid-cols-2 gap-4 px-5 will-change-transform sm:gap-6 md:grid-cols-3 md:px-10 lg:flex lg:w-max lg:gap-10 lg:px-12'
        >
          {cards.map(({ src, number }) => (
            <NftCard key={number} src={src} number={number} />
          ))}
        </div>
      </div>
    </section>
  )
}
