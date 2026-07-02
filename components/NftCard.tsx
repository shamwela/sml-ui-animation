import Image, { type StaticImageData } from 'next/image'

/**
 * Hover motion is pure CSS on compositor-friendly properties:
 * the card lifts via `translate`, the shadow is a pre-rendered
 * pseudo-layer whose opacity fades in (box-shadow itself never animates),
 * and the artwork zooms via `scale`. GSAP only ever touches the
 * [data-card] / [data-card-img] wrappers, so the two never conflict.
 */
export const NftCard = ({
  src,
  number,
}: {
  src: StaticImageData
  number: number
}) => {
  const id = `#${String(number).padStart(4, '0')}`

  return (
    <a
      href='https://opensea.io/ja/collection/fluffy-hugs89'
      target='_blank'
      rel='noopener noreferrer'
      data-card
      className='group relative block shrink-0 rounded-3xl bg-white/60 p-3 pb-4 transition-transform duration-300 ease-out hover:-translate-y-2 lg:w-72 xl:w-80'
    >
      <span
        aria-hidden='true'
        className='absolute inset-0 rounded-3xl opacity-0 shadow-[0_18px_40px_rgba(32,61,154,0.22)] transition-opacity duration-300 group-hover:opacity-100'
      />
      <span className='relative block overflow-hidden rounded-2xl'>
        <span data-card-img className='block will-change-transform'>
          <Image
            src={src}
            alt={`Fluffy HUGS ${id}`}
            sizes='(min-width: 1280px) 320px, (min-width: 1024px) 288px, (min-width: 768px) 30vw, 45vw'
            className='h-auto w-full scale-110 transition-transform duration-500 ease-out group-hover:scale-125'
          />
        </span>
      </span>
      <span className='font-display mt-3 flex items-baseline justify-between px-1 text-sm font-semibold md:text-base'>
        Fluffy HUGS {id}
        <span className='hidden text-xs tracking-widest uppercase opacity-50 md:inline'>
          hug me
        </span>
      </span>
    </a>
  )
}
