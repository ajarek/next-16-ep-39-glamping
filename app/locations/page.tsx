"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Compass } from "lucide-react"
import Catalog from "@/components/Catalog"
import BookingModal from "@/components/BookingModal"
import DetailsModal from "@/components/DetailsModal"
import { useLocations } from "@/app/hooks/useLocations"
import { Location } from "@/app/types"

export default function LocationsPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null,
  )

  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [detailsLocation, setDetailsLocation] = useState<Location | null>(null)
  const { locations, isLoading } = useLocations()

  // Funkcja otwierająca rezerwację dla konkretnego obiektu
  const handleBookLocation = (id: string) => {
    setSelectedLocationId(id)
    setIsBookingOpen(true)
  }

  // Pokazywanie szczegółów obiektu
  const handleShowDetails = (location: Location) => {
    setDetailsLocation(location)
    setIsDetailsOpen(true)
  }

  // Loader na czas pobierania danych
  if (isLoading) {
    return (
      <div className='min-h-[80vh] bg-bg-custom flex flex-col items-center justify-center px-6 relative overflow-hidden'>
        {/* Dekoracyjne tło */}
        <div className='absolute top-1/2 left-1/4 -translate-y-1/2 w-100 h-100 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none' />
        <div className='absolute top-1/3 right-1/4 -translate-y-1/2 w-87 h-87 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none' />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className='relative z-10'
        >
          <Compass className='w-12 h-12 text-brand-accent' />
        </motion.div>

        <div className='relative z-10 mt-8 flex flex-col items-center gap-2'>
          <div className='flex gap-1.5'>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
                className='w-2 h-2 rounded-full bg-brand-accent'
              />
            ))}
          </div>
          <p className='text-sm text-fg-custom/50 font-light tracking-wider mt-2'>
            Ładowanie ofert…
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Katalog wszystkich kempingów z filtrowaniem i sortowaniem */}
      <Catalog
        locations={locations}
        selectedLocationId={selectedLocationId}
        onBookLocation={handleBookLocation}
        onShowDetails={handleShowDetails}
      />

      {/* Wieloetapowy modal rezerwacji */}
      <BookingModal
        key={
          isBookingOpen ? `locations-open-${selectedLocationId || "general"}` : "locations-closed"
        }
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        locations={locations}
        preSelectedLocationId={selectedLocationId}
      />

      {/* Modal szczegółów obiektu */}
      <DetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false)
          setDetailsLocation(null)
        }}
        location={detailsLocation}
        onBook={handleBookLocation}
      />
    </>
  )
}
