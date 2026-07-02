import Image from 'next/image'
import DiscordLogo from '@/public/social-icons/discord.svg'
import OpenSeaLogo from '@/public/social-icons/opensea.svg'
import TwitterLogo from '@/public/social-icons/twitter.svg'

const socialLinks = [
  {
    href: 'https://discord.com/invite/PmWf27cY6p',
    label: 'Discord',
    icon: DiscordLogo,
  },
  {
    href: 'https://opensea.io/ja/collection/fluffy-hugs89',
    label: 'OpenSea',
    icon: OpenSeaLogo,
  },
  {
    href: 'https://x.com/FluffyHUGS_prj',
    label: 'Twitter',
    icon: TwitterLogo,
  },
]

export const SocialLinks = () => {
  return (
    <div className='flex gap-x-5'>
      {socialLinks.map(({ href, label, icon }) => (
        <a
          key={label}
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          className='flex size-10 items-center justify-center transition-transform duration-300 ease-in-out hover:scale-90'
        >
          <Image src={icon} alt={label} className='size-10' />
        </a>
      ))}
    </div>
  )
}
