"use client"

/* eslint-disable react-hooks/set-state-in-effect */

import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react"

type Theme = "dark" | "light"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Zawsze zaczynaj z "dark" — serwer i klient muszą renderować dokładnie to samo
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState<boolean>(false)

  // Przywróć zapisany motyw synchronicznie przed renderem (unika hydration mismatch)
  useLayoutEffect(() => {
    const saved = localStorage.getItem("theme")
    const savedTheme: Theme = saved === "light" ? "light" : "dark"
    if (savedTheme !== "dark") {
      setTheme(savedTheme)
    }
  }, [])

  // Sygnalizuj koniec hydratacji po pierwszym renderze
  useEffect(() => {
    setMounted(true)
  }, [])

  // Synchronizujemy zmiany motywu z DOM i localStorage
  useEffect(() => {
    if (!mounted) return
    const root = window.document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
      root.style.colorScheme = "dark"
    } else {
      root.classList.remove("dark")
      root.style.colorScheme = "light"
    }
    localStorage.setItem("theme", theme)
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme musi być używane wewnątrz ThemeProvider")
  }
  return context
}
