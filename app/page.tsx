"use client"

import { useState } from "react"
import FeaturedSpots from "./components/FeaturedSpots"
import Catalog from "./components/Catalog"
import LocationMap from "./components/LocationMap"
import BookingModal from "./components/BookingModal"
import DetailsModal from "./components/DetailsModal"
import Hero from "./components/Hero"
import locationsData from "../public/data/locations.json"
import { Location } from "./types"

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null,
  )

  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [detailsLocation, setDetailsLocation] = useState<Location | null>(null)

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

  // Wybieranie obiektu z mapy lub sekcji wyróżnionej
  const handleSelectLocation = (id: string) => {
    setSelectedLocationId(id)
    const location = locationsData.find((l) => l.id === id)
    if (location) {
      handleShowDetails(location)
    }
  }

  // Otwiera formularz rezerwacji bez wybranego obiektu
  const handleOpenGeneralBooking = () => {
    setSelectedLocationId(null)
    setIsBookingOpen(true)
  }

  return (
    <>
      {/* Karuzela Hero */}
      <Hero onBookNow={handleOpenGeneralBooking} />

      {/* Trójwymiarowy stos wyróżnionych kart */}
      <FeaturedSpots
        locations={locationsData}
        onSelectLocation={handleSelectLocation}
      />

      {/* Katalog wszystkich kempingów */}
      <Catalog
        locations={locationsData}
        selectedLocationId={selectedLocationId}
        onBookLocation={handleBookLocation}
        onShowDetails={handleShowDetails}
      />

      {/* Interaktywna mapa topograficzna */}
      <LocationMap
        locations={locationsData}
        onSelectLocation={handleSelectLocation}
        activeLocationId={selectedLocationId}
      />

      {/* Wieloetapowy modal rezerwacji (strona główna) */}
      <BookingModal
        key={
          isBookingOpen ? `open-${selectedLocationId || "general"}` : "closed"
        }
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        locations={locationsData}
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
