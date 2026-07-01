"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Leniwa inicjalizacja stanu — odczyt z localStorage tylko raz, przed pierwszym renderem,
  // bez zbędnych efektów ubocznych powodujących kaskadowe re-rendery
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("theme") as Theme) ?? "dark";
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Synchronizujemy DOM i localStorage przy każdej zmianie motywu
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
    localStorage.setItem("theme", theme);
    setMounted(true);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Zawsze owijamy dzieci w Provider — zapobiega błędowi "useTheme poza ThemeProvider"
  // podczas pierwszego renderu (przed zamontowaniem) i po zamontowaniu
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme musi być używane wewnątrz ThemeProvider");
  }
  return context;
}
