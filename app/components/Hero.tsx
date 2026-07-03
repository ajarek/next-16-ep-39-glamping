"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Compass } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

interface HeroProps {
  onBookNow: () => void
}

const SLIDES = [
  {
    image: "/images/hero-bg.png",
    title: "Odłącz się,\nby połączyć się na nowo",
    subtitle:
      "Ręcznie wybrane miejsca, gdzie piękno natury łączy się ze zrównoważonym komfortem.",
  },
  {
    image: "/images/lakeside-retreat.png",
    title: "Obudź się\nnad brzegiem jeziora",
    subtitle:
      "Doświadcz luksusu pośród szczytów górskich i krystalicznie czystej wody.",
  },
  {
    image: "/images/meadow-vista.png",
    title: "Zasypiaj pod\ngwiaździstym niebem",
    subtitle:
      "Odkryj kopuły geodezyjne z panoramicznym widokiem na drogę mleczną.",
  },
]

export default function Hero({ onBookNow }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className='relative h-screen w-full overflow-hidden bg-black flex items-center'>
      {/* Karuzela teł z płynnym przenikaniem */}
      <div className='absolute inset-0 z-0'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className='absolute inset-0 bg-cover bg-center'
            style={{ backgroundImage: `url(${SLIDES[currentSlide].image})` }}
          />
        </AnimatePresence>
        {/* Gradienty rozjaśniające tło */}
        <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10 z-10' />
        <div className='absolute inset-0 bg-linear-to-r from-black/45 via-black/10 to-transparent z-10' />
      </div>

      {/* Treść sekcji Hero */}
      <div className='relative z-20 max-w-7xl mx-auto px-6 w-full pt-20'>
        <div className='max-w-2xl text-left'>
          {/* Ikonka choinki / listka */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='inline-flex items-center justify-center p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white mb-6'
          >
            <svg
              className='w-6 h-6 text-brand-accent'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M12 3v18M12 3L7 9h10L12 3zm0 5l-4 5h8l-4-5zm0 5l-5 6h10l-5-6z'
              />
            </svg>
          </motion.div>

          {/* Dynamiczne Hasło */}
          <div className='h-45 sm:h-55 md:h-65 overflow-hidden flex flex-col justify-end'>
            <AnimatePresence mode='wait'>
              <motion.h1
                key={currentSlide}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className='text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] whitespace-pre-line'
              >
                {SLIDES[currentSlide].title}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Opis */}
          <AnimatePresence mode='wait'>
            <motion.p
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='mt-6 text-base sm:text-lg text-white font-light tracking-wide max-w-lg'
            >
              {SLIDES[currentSlide].subtitle}
            </motion.p>
          </AnimatePresence>

          {/* Przycisk akcji */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className='mt-10 flex flex-wrap gap-4'
          >
            <button
              onClick={onBookNow}
              className='flex items-center gap-3 bg-white hover:bg-brand-accent hover:text-white text-black px-8 py-4 rounded-full font-bold text-xs tracking-widest shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95'
            >
              ZAREZERWUJ TERAZ
              <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
            </button>
            <Link
              href='/locations'
              className='flex items-center gap-2 border border-white/30 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold text-xs tracking-widest transition-all duration-300'
            >
              <Compass className='w-4 h-4' />
              ODKRYJ LOKACJE
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Dolne wskaźniki slajdów (zgodnie ze zrzutem ekranu Image 2) */}
      <div className='absolute bottom-12 left-0 right-0 z-25 max-w-7xl mx-auto px-6 flex justify-between items-center'>
        <div className='flex gap-4 w-full max-w-sm'>
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className='h-1 flex-1 relative rounded-full overflow-hidden focus:outline-none'
            >
              {/* Tło paska */}
              <div className='absolute inset-0 bg-white/20' />
              {/* Pasek postępu */}
              <motion.div
                initial={false}
                animate={{
                  width: currentSlide === index ? "100%" : "0%",
                }}
                transition={{
                  duration: currentSlide === index ? 6 : 0.3,
                  ease: "linear",
                }}
                className='absolute inset-0 bg-white'
              />
            </button>
          ))}
        </div>
        <div className='text-white/60 text-xs tracking-widest font-bold hidden sm:block'>
          0{currentSlide + 1} / 0{SLIDES.length}
        </div>
      </div>
    </div>
  )
}
