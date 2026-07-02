import { SocialLinks } from './SocialLinks'
import { ViewCollection } from './ViewCollection'

export const Footer = () => {
  return (
    <footer
      data-chrome
      className='fixed right-0 bottom-0 left-0 z-40 flex items-end justify-between px-5 pb-[20px] md:px-10 md:pb-[30px]'
    >
      <SocialLinks />
      <ViewCollection />
    </footer>
  )
}
