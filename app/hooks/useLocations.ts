"use client"

import { useEffect, useState } from "react"
import { getLocations } from "@/app/lib/firebase"
import type { Location } from "@/app/types"

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadLocations = async () => {
      try {
        const data = await getLocations()

        if (!isMounted) return

        if (Array.isArray(data)) {
          setLocations(data as Location[])
        }
      } catch (error) {
        console.error("Błąd podczas pobierania lokalizacji:", error)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void loadLocations()
    return () => {
      isMounted = false
    }
  }, [])

  return { locations, isLoading }
}
