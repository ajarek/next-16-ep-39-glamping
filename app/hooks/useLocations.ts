"use client"

import { useEffect, useState } from "react"
import { getLocations } from "@/app/lib/firebase"
import locationsData from "@/public/data/locations.json"
import type { Location } from "@/app/types"

// Zbiór ID z pliku JSON — używamy ich do rozpoznawania nowych ofert
const jsonIds = new Set(locationsData.map((loc) => loc.id))

export function useLocations() {
  // Zawsze zaczynamy od danych z pliku JSON — to nasza stabilna baza
  const [locations, setLocations] = useState<Location[]>(locationsData as Location[])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadFromFirebase = async () => {
      try {
        const data = await getLocations()
        if (!isMounted) return

        if (!Array.isArray(data) || data.length === 0) {
          // Firebase nie zwróciło danych — zostajemy przy JSON
          return
        }

        // Sprawdzamy, czy Firebase zwróciło przynajmniej jedną lokalizację
        // z ID spoza pliku JSON (czyli nową ofertę dodaną przez użytkownika)
        const hasNewItems = data.some(
          (item) => item?.id && !jsonIds.has(item.id),
        )

        if (hasNewItems) {
          // Scalanie: JSON jako baza + nowe oferty z Firebase
          const existingIds = new Set(jsonIds)
          const newItems = (data as Location[]).filter(
            (item) => !existingIds.has(item.id),
          )
          setLocations([...locationsData, ...newItems] as Location[])
        }
        // Jeśli Firebase nie ma nowych ofert, nic nie robimy —
        // dane z JSON pozostają w stanie
      } catch (error) {
        console.error("Błąd podczas pobierania lokalizacji:", error)
        // W razie błędu dane z JSON pozostają nietknięte
      }
    }

    void loadFromFirebase()
    return () => {
      isMounted = false
    }
  }, [])

  return { locations, isLoading }
}
