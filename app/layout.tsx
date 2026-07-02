import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { Baloo_2, Zen_Maru_Gothic } from 'next/font/google'
import { LoadStateProvider } from '@/components/providers/LoadStateProvider'
import { SmoothScroll } from '@/components/providers/SmoothScroll'

const baloo = Baloo_2({
  subsets: ['latin'],
  variable: '--font-baloo',
  display: 'swap',
})

const zenMaru = Zen_Maru_Gothic({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-zen-maru',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Fluffy HUGS NFT',
  description:
    'Fluffy HUGS — 3,333 generative NFTs of cute fluffy animals. An animation-heavy landing page recreation.',
}

export const viewport: Viewport = {
  themeColor: '#fcf3e2',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className={`${baloo.variable} ${zenMaru.variable}`}>
      <body className='bg-cream font-jp text-ink antialiased'>
        <LoadStateProvider>
          <SmoothScroll />
          {children}
        </LoadStateProvider>
      </body>
    </html>
  )
}
