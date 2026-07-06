"use client"

import { useState } from "react"
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
  const { locations } = useLocations()

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
