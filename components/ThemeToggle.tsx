"use client"

import { useTheme } from "@/app/context/ThemeContext"
import { Sun, Moon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()

  // Nie renderuj ikony przed zamontowaniem — zapobiega hydration mismatch
  if (!mounted) {
    return (
      <button
        suppressHydrationWarning
        className='relative flex items-center justify-center w-10 h-10 rounded-full border border-border-custom bg-card-custom'
        aria-label='Przełącz motyw'
      />
    )
  }

  return (
    <button
      suppressHydrationWarning
      onClick={toggleTheme}
      className='relative flex items-center justify-center w-10 h-10 rounded-full border border-border-custom bg-card-custom hover:bg-brand-muted/10 transition-all duration-300 focus:outline-none'
      aria-label='Przełącz motyw'
    >
      <AnimatePresence mode='wait' initial={false}>
        {theme === "dark" ? (
          <motion.div
            key='moon'
            initial={{ rotate: 180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: -180, scale: 0 }}
            transition={{ duration: 0.3 }}
            className='absolute text-brand-primary'
          >
            <Moon className='w-5 h-5' />
          </motion.div>
        ) : (
          <motion.div
            key='sun'
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: 180, scale: 0 }}
            transition={{ duration: 0.3 }}
            className='absolute text-brand-accent'
          >
            <Sun className='w-5 h-5' />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}
