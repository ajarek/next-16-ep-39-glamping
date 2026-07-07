"use client"

import { useState, useEffect } from "react"
import { Star, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Location } from "@/app/types"

interface FeaturedSpotsProps {
  locations: Location[]
  isLoading: boolean
  onSelectLocation: (id: string) => void
}

export default function FeaturedSpots({
  locations,
  isLoading,
  onSelectLocation,
}: FeaturedSpotsProps) {
  // Wybieramy 3 główne lokalizacje do karuzeli wachlarzowej
  const featuredIds = ["forest-haven", "lakeside-retreat", "meadow-vista"]
  const featured = locations.filter((loc) => featuredIds.includes(loc.id))

  // Środkowa (aktywna) karta — domyślnie "lakeside-retreat",
  // ale jeśli jej brak w danych, ustawiamy pierwszy dostępny element
  const [activeId, setActiveId] = useState("")

  // Gdy dane się załadują, aktualizujemy activeId jeśli obecny nie pasuje
  useEffect(() => {
    if (featured.length === 0) return

    const targetId = featured.some((l) => l.id === "lakeside-retreat")
      ? "lakeside-retreat"
      : featured[0].id

    // Nie ustawiamy stanu synchronicznie w efekcie — wykonujemy to asynchronicznie,
    // aby uniknąć ostrzeżenia o kaskadowych renderach.
    if (activeId !== targetId) {
      const t = setTimeout(() => setActiveId(targetId), 0)
      return () => clearTimeout(t)
    }
  }, [featured, activeId])

  // Funkcja określająca pozycję i rotację karty w stosie 3D
  const getCardStyles = (id: string) => {
    const index = featured.findIndex((loc) => loc.id === id)
    const activeIndex = featured.findIndex((loc) => loc.id === activeId)

    // Jeśli nie ma aktywnej karty (np. tylko 1 element), wszystkie są neutralne
    if (activeIndex === -1) {
      const total = featured.length
      const offset = total === 1 ? 0 : (index - (total - 1) / 2) * 200
      return {
        zIndex: 5,
        x: offset,
        y: 0,
        rotate: 0,
        scale: total === 1 ? 1 : 0.9,
        opacity: 1,
      }
    }

    if (id === activeId) {
      return {
        zIndex: 10,
        x: 0,
        y: -15,
        rotate: 0,
        scale: 1.05,
        opacity: 1,
      }
    }

    // Karta po lewej od aktywnej lub pierwsza karta jeśli aktywna jest ostatnia
    const isLeft =
      index < activeIndex ||
      (activeIndex === 0 && index === featured.length - 1)

    return {
      zIndex: 5,
      x: isLeft ? -120 : 120,
      y: 10,
      rotate: isLeft ? -6 : 6,
      scale: 0.9,
      opacity: 0.85,
    }
  }

  return (
    <section
      id='about'
      className='py-24 px-6 bg-zinc-50/50 dark:bg-[#070906] transition-colors relative overflow-hidden'
    >
      {/* Ozdobne tła geometryczne */}
      <div className='absolute top-1/2 left-1/4 -translate-y-1/2 w-100 h-100 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute top-1/3 right-1/4 -translate-y-1/2 w-87 h-87 bg-brand-accent/20 rounded-full blur-3xl pointer-events-none' />

      <div className='max-w-7xl mx-auto text-center relative z-10'>
        {/* Nagłówek */}
        <span className='text-xs font-bold tracking-[0.2em] text-brand-accent uppercase'>
          WYRÓŻNIONE LOKALIZACJE
        </span>
        <h2 className='mt-3 text-2xl sm:text-3xl font-light text-fg-custom tracking-tight max-w-xl mx-auto leading-relaxed'>
          Ręcznie wyselekcjonowane miejsca, w których piękno natury łączy się z
          ekologicznym luksusem.
        </h2>

        {/* Wachlarzowy stos kart 3D (Struktura zrzutu ekranu nr 1) */}
        <div className='relative flex justify-center items-center h-145 mt-16 max-w-4xl mx-auto'>
          {featured.length === 0 ? (
            <div className='w-full rounded-3xl border border-border-custom bg-card-custom/80 px-8 py-12 text-fg-custom shadow-xl'>
              <p className='text-sm font-medium text-fg-custom/70'>
                {isLoading
                  ? "Ładowanie wyróżnionych lokalizacji..."
                  : "Brak wyróżnionych lokalizacji do wyświetlenia."}
              </p>
            </div>
          ) : (
            featured.map((spot) => {
              const styles = getCardStyles(spot.id)
              const isActive = spot.id === activeId
              // Rozdzielamy zIndex (style) od animowanych transformów
              const { zIndex, ...anim } = styles 

              return (
                <motion.div
                  key={spot.id}
                  animate={anim}
                  style={{ zIndex }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  onClick={() => {
                    if (!isActive) setActiveId(spot.id)
                  }}
                  className={`absolute w-72 sm:w-[320px] bg-card-custom rounded-2xl border border-border-custom shadow-xl hover:shadow-2xl overflow-hidden cursor-pointer select-none`}
                >
                {/* Zdjęcie kempingu */}
                <div className='relative h-55 w-full'>
                  <Image
                    src={spot.image}
                    alt={spot.name}
                    fill
                    sizes='(max-width: 700px) 100vw, 320px'
                    className='object-cover transition-transform duration-500 hover:scale-105'
                    priority
                  />
                  {/* Ocena kempingu (np. gwiazdka 5.0) */}
                  <div className='absolute top-4 right-4 flex items-center gap-1 bg-white/90 dark:bg-[#0c0e0a]/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-border-custom text-xs font-bold text-fg-custom'>
                    <Star className='w-3.5 h-3.5 fill-brand-accent stroke-brand-accent' />
                    <span>{spot.rating}</span>
                  </div>
                </div>

                {/* Zawartość karty */}
                <div className='p-6 text-left flex flex-col justify-between h-65'>
                  <div>
                    {/* Nazwa i lokalizacja */}
                    <h3 className='text-xl font-bold text-fg-custom leading-tight'>
                      {spot.name}
                    </h3>
                    <p className='text-xs text-fg-custom/60 flex items-center gap-1 mt-1.5 font-medium'>
                      <svg
                        className='w-3.5 h-3.5 text-brand-accent'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                        />
                      </svg>
                      {spot.locationName}
                    </p>

                    {/* Tagi / Udogodnienia */}
                    <div className='flex flex-wrap gap-2 mt-4'>
                      {spot.tags.map((tag) => (
                        <span
                          key={tag}
                          className='text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-brand-muted/10 text-brand-primary'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stopka karty z ceną i przyciskiem szczegółów */}
                  <div className='flex items-center justify-between border-t border-border-custom pt-4'>
                    <div>
                      <span className='text-xl font-black text-fg-custom'>
                        PLN {spot.price}
                      </span>
                      <span className='text-xs text-fg-custom/60'>/noc</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation() // Stop propagation to avoid activating parent div
                        onSelectLocation(spot.id)
                      }}
                      className='flex items-center gap-1.5 text-xs font-bold text-brand-accent hover:text-brand-primary tracking-widest transition-colors group'
                    >
                      SZCZEGÓŁY
                      <ArrowRight className='w-3.5 h-3.5 transition-transform group-hover:translate-x-1' />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          }))}
        </div>
      </div>
    </section>
  )
}
