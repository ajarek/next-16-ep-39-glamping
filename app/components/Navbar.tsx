"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Compass, Info, Mail, Calendar, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  onBookNow: () => void;
}

export default function Navbar({ onBookNow }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { label: "LOKALIZACJE", href: "/locations", icon: Compass },
    { label: "O NAS", href: "/#about", icon: Info },
    { label: "KONTAKT", href: "/contact", icon: Mail },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-border-custom bg-background/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-widest text-brand-primary dark:text-brand-primary transition-colors">
              WILD HAVEN
            </span>
          </Link>

          {/* Linki desktopowe */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs font-semibold tracking-widest text-fg-custom/80 hover:text-brand-accent transition-colors duration-250"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Przyciski i przełącznik trybu */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {/* Przycisk Dodaj Ofertę */}
            <Link
              href="/dodaj-oferte"
              className="px-5 py-2.5 rounded-full text-xs font-semibold tracking-widest border border-border-custom text-fg-custom hover:bg-brand-muted/10 transition-all duration-300 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              DODAJ OFERTĘ
            </Link>
            <button
              onClick={onBookNow}
              className="px-6 py-2.5 rounded-full text-xs font-semibold tracking-widest bg-brand-primary text-brand-primary-fg hover:bg-brand-accent hover:text-brand-accent-fg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              ZAREZERWUJ TERAZ
            </button>
          </div>

          {/* Przycisk hamburger dla mobile */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full border border-border-custom bg-card-custom text-fg-custom"
              aria-label="Otwórz menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Wysuwane menu mobilne z lewej strony ekranu (zgodnie z wytycznymi) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Tło nakładki (overlay) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
            />

            {/* Panel menu wysuwany z lewej (left) */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 z-50 w-[280px] bg-card-custom border-r border-border-custom shadow-2xl p-6 flex flex-col justify-between md:hidden"
            >
              <div>
                {/* Nagłówek menu */}
                <div className="flex items-center justify-between pb-6 border-b border-border-custom">
                  <span className="text-lg font-bold tracking-widest text-brand-primary">
                    WILD HAVEN
                  </span>
                  <button
                    onClick={toggleMenu}
                    className="p-1.5 rounded-full border border-border-custom hover:bg-brand-muted/10 text-fg-custom"
                    aria-label="Zamknij menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Linki nawigacyjne */}
                <div className="flex flex-col gap-5 mt-8">
                  {menuItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={toggleMenu}
                      className="flex items-center gap-4 py-2 text-sm font-semibold tracking-wider text-fg-custom/80 hover:text-brand-accent transition-colors"
                    >
                      <item.icon className="w-5 h-5 text-brand-primary" />
                      {item.label}
                    </Link>
                  ))}
                  {/* Dodaj ofertę link mobilny */}
                  <Link
                    href="/dodaj-oferte"
                    onClick={toggleMenu}
                    className="flex items-center gap-4 py-2 text-sm font-semibold tracking-wider text-brand-accent hover:text-brand-primary transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    DODAJ OFERTĘ
                  </Link>
                </div>
              </div>

              {/* Dolna sekcja z przyciskiem rezerwacji */}
              <div className="pt-6 border-t border-border-custom flex flex-col gap-4">
                <button
                  onClick={() => {
                    toggleMenu();
                    onBookNow();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold tracking-widest bg-brand-primary text-brand-primary-fg hover:bg-brand-accent hover:text-brand-accent-fg transition-all duration-300"
                >
                  <Calendar className="w-4 h-4" />
                  ZAREZERWUJ TERAZ
                </button>
                <div className="text-center text-[10px] text-fg-custom/40 tracking-wider">
                  © 2026 WILD HAVEN. WSZELKIE PRAWA ZASTRZEŻONE.
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
