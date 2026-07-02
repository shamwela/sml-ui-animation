import { Footer } from '@/common/Footer'
import { Header } from '@/common/Header'
import { Collection } from '@/sections/Collection'
import { Hero } from '@/sections/Hero'
import { Preloader } from '@/sections/Preloader'

export default function HomePage() {
  return (
    <>
      <Preloader />
      <Header />
      <main>
        <Hero />
        <Collection />
        {/* Breathing room after the pinned gallery releases. */}
        <div className='h-[15svh]' />
      </main>
      <Footer />
    </>
  )
}
