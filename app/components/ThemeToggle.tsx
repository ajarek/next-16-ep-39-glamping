"use client";

import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 rounded-full border border-border-custom bg-card-custom hover:bg-brand-muted/10 transition-all duration-300 focus:outline-none"
      aria-label="Przełącz motyw"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 0 : 180, scale: theme === "dark" ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute text-brand-primary"
      >
        <Moon className="w-5 h-5" />
      </motion.div>

      <motion.div
        initial={false}
        animate={{ rotate: theme === "light" ? 0 : -180, scale: theme === "light" ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute text-brand-accent"
      >
        <Sun className="w-5 h-5" />
      </motion.div>
    </button>
  );
}
