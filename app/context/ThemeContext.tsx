"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Inicjalizacja z "dark" zawsze — serwer i klient zaczynają tak samo
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  // Po zamontowaniu odczytujemy faktyczny motyw z localStorage
  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme) ?? "dark"
    setTheme(saved)
    setMounted(true)
  }, [])

  // Synchronizujemy DOM i localStorage przy każdej zmianie motywu
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
