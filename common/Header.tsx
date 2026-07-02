import { FluffyHugsLogo } from './FluffyHugsLogo'

export const Header = () => {
  return (
    <header
      data-chrome
      className='fixed top-0 right-0 left-0 z-40 px-5 pt-[25px] md:px-10 md:pt-[50px]'
    >
      <a
        href='#'
        aria-label='Fluffy HUGS home'
        className='inline-block origin-top-left transition-transform duration-300 ease-out hover:scale-105'
      >
        <FluffyHugsLogo />
      </a>
    </header>
  )
}
