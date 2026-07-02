export const ViewCollection = () => {
  return (
    <a
      href='https://opensea.io/ja/collection/fluffy-hugs89'
      target='_blank'
      rel='noopener noreferrer'
      aria-label='View collection on OpenSea'
      className='absolute -right-2.5 bottom-[-45px] block h-[143px] w-[164px] transition-transform duration-300 ease-out hover:-rotate-6 hover:scale-110 md:bottom-[-65px] md:h-[207px] md:w-[238px]'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 254.73 221.92'
        preserveAspectRatio='xMaxYMax'
        className='h-full w-full'
      >
        <path
          className='fill-ink'
          d='m225.68,15.74c-25.47-21.39-54.72-22.72-79.62,6.86-24.91,29.57-40.17,54.92-72.67,49.26-32.5-5.66-62.08,14.2-71.32,44.78-9.24,30.58,13.36,75.03,52.18,90.3,38.81,15.27,72.91,24.12,122.72.19,49.81-23.93,68.79-79.19,75.51-108.95,6.71-29.76-1.32-61.04-26.79-82.44Z'
        />
        <text
          x='50%'
          y='55%'
          dominantBaseline='middle'
          textAnchor='middle'
          fill='white'
          className='md:text-lg'
          style={{ letterSpacing: '3px' }}
        >
          view collection
        </text>
      </svg>
    </a>
  )
}
