"use client"

import { useState } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import BookingModal from "./BookingModal"
import { useLocations } from "@/app/hooks/useLocations"

// Kliencki wrapper layoutu — zarządza stanem modalu rezerwacji
// i renderuje wspólne elementy UI dla wszystkich stron
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const { locations } = useLocations()

  const handleOpenGeneralBooking = () => {
    setIsBookingOpen(true)
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar onBookNow={handleOpenGeneralBooking} />

      <main className='grow pt-20'>{children}</main>

      <Footer />

      {/* Wieloetapowy modal rezerwacji (globalny) */}
      <BookingModal
        key={isBookingOpen ? "open-general" : "closed"}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        locations={locations}
        preSelectedLocationId={null}
      />
    </div>
  )
}
