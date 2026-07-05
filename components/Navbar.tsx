"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  Menu,
  X,
  Compass,
  Info,
  Mail,
  Calendar,
  Plus,
  LogIn,
  User,
  LogOut,
  ShieldCheck,
  ChevronDown,
  Eye,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ThemeToggle from "./ThemeToggle"
import {
  subscribeToAuth,
  loginUser,
  registerUser,
  logoutUser,
  isAdminUser,
} from "@/app/lib/firebase"
import type { MockUser } from "@/app/lib/firebase"

interface NavbarProps {
  onBookNow: () => void
}

export default function Navbar({ onBookNow }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<MockUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const [isAdmin, setIsAdmin] = useState(false)

  // Subskrypcja stanu auth + sprawdzenie roli admina
  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (u) => {
      const mu = u as MockUser | null
      setUser(mu)
      if (mu) {
        const admin = await isAdminUser(mu.uid)
        setIsAdmin(admin)
      } else {
        setIsAdmin(false)
      }
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Zamknij menu użytkownika po kliknięciu poza nim
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logoutUser()
    setShowUserMenu(false)
  }

  const toggleMenu = () => setIsOpen(!isOpen)

  const menuItems = [
    { label: "LOKALIZACJE", href: "/locations", icon: Compass },
    { label: "O NAS", href: "/about", icon: Info },
    { label: "KONTAKT", href: "/contact", icon: Mail },
  ]

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
              href="/add-offer"
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

            {/* Auth: przycisk logowania lub ikona użytkownika */}
            {!authLoading && (
              <>
                {user ? (
                  /* Zalogowany — ikona użytkownika z dropdownem */
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 p-2.5 rounded-full border border-border-custom bg-card-custom hover:bg-brand-muted/10 transition-all duration-200"
                      aria-label="Menu użytkownika"
                    >
                      <User className="w-4 h-4 text-brand-accent" />
                      <ChevronDown
                        className={`w-3 h-3 text-fg-custom/50 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Dropdown menu */}
                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-64 bg-card-custom border border-border-custom rounded-2xl shadow-xl overflow-hidden"
                        >
                          {/* Info o użytkowniku */}
                          <div className="px-5 py-4 border-b border-border-custom">
                            <p className="text-xs text-fg-custom/50 font-light">
                              Zalogowano jako
                            </p>
                            <p className="text-sm font-semibold text-fg-custom mt-0.5 truncate">
                              {user.email}
                            </p>
                          </div>

                          {/* Link admin */}
                          {isAdmin && (
                            <Link
                              href="/admin"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-fg-custom hover:bg-brand-muted/10 transition-colors"
                            >
                              <ShieldCheck className="w-4 h-4 text-brand-accent" />
                              Panel admina
                            </Link>
                          )}

                          {/* Wyloguj */}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Wyloguj się
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  /* Niezalogowany — przycisk logowania */
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold tracking-widest border border-border-custom text-fg-custom hover:bg-brand-muted/10 transition-all duration-300"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    LOGUJ
                  </button>
                )}
              </>
            )}
          </div>

          {/* Przycisk hamburger dla mobile */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            {/* Ikona użytkownika mobilna */}
            {!authLoading && user && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 rounded-full border border-border-custom bg-card-custom text-brand-accent"
                  aria-label="Menu użytkownika"
                >
                  <User className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-card-custom border border-border-custom rounded-2xl shadow-xl overflow-hidden z-60"
                    >
                      <div className="px-4 py-3 border-b border-border-custom">
                        <p className="text-[10px] text-fg-custom/50 font-light">
                          Zalogowano jako
                        </p>
                        <p className="text-xs font-semibold text-fg-custom mt-0.5 truncate">
                          {user.email}
                        </p>
                      </div>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => {
                            setShowUserMenu(false)
                            setIsOpen(false)
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-fg-custom hover:bg-brand-muted/10 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-brand-accent" />
                          Panel admina
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Wyloguj się
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
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

      {/* ===== Modal logowania ===== */}
      <AnimatePresence>
        {showLoginModal && (
          <LoginFormModal onClose={() => setShowLoginModal(false)} />
        )}
      </AnimatePresence>

      {/* ===== Wysuwane menu mobilne z lewej strony ekranu ===== */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 z-50 w-[280px] bg-card-custom border-r border-border-custom shadow-2xl p-6 flex flex-col justify-between md:hidden"
            >
              <div>
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
                  <Link
                    href="/add-offer"
                    onClick={toggleMenu}
                    className="flex items-center gap-4 py-2 text-sm font-semibold tracking-wider text-brand-accent hover:text-brand-primary transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    DODAJ OFERTĘ
                  </Link>

                  {/* Auth w menu mobilnym */}
                  {!authLoading && user && isAdmin && (
                    <Link
                      href="/admin"
                      onClick={toggleMenu}
                      className="flex items-center gap-4 py-2 text-sm font-semibold tracking-wider text-brand-accent hover:text-brand-primary transition-colors"
                    >
                      <ShieldCheck className="w-5 h-5" />
                      PANEL ADMINA
                    </Link>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-border-custom flex flex-col gap-4">
                {/* Auth w dolnej sekcji mobilnego menu */}
                {!authLoading && (
                  <>
                    {user ? (
                      <button
                        onClick={() => {
                          toggleMenu()
                          handleLogout()
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold tracking-widest border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all duration-300"
                      >
                        <LogOut className="w-4 h-4" />
                        WYLOGUJ ({user.email})
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          toggleMenu()
                          setShowLoginModal(true)
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold tracking-widest bg-brand-primary text-brand-primary-fg hover:bg-brand-accent hover:text-brand-accent-fg transition-all duration-300"
                      >
                        <LogIn className="w-4 h-4" />
                        LOGUJ / REJESTRUJ
                      </button>
                    )}
                  </>
                )}
                <button
                  onClick={() => {
                    toggleMenu()
                    onBookNow()
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
  )
}

// --- Modal logowania w Navbarze ---
function LoginFormModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [mode, setMode] = useState<"login" | "register">("login")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAuthError(null)

    try {
      if (mode === "login") {
        await loginUser(email, password)
      } else {
        await registerUser(email, password)
      }
      onClose()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Nieznany błąd"
      if (msg.includes("auth/user-not-found")) {
        setAuthError("Nie znaleziono użytkownika o podanym adresie e-mail.")
      } else if (msg.includes("auth/wrong-password")) {
        setAuthError("Nieprawidłowe hasło.")
      } else if (msg.includes("auth/email-already-in-use")) {
        setAuthError("Konto o tym adresie e-mail już istnieje.")
      } else if (msg.includes("auth/weak-password")) {
        setAuthError("Hasło jest zbyt słabe — minimum 6 znaków.")
      } else if (msg.includes("auth/invalid-email")) {
        setAuthError("Nieprawidłowy format adresu e-mail.")
      } else {
        setAuthError("Wystąpił błąd logowania. Spróbuj ponownie.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-card-custom border border-border-custom rounded-3xl p-8 max-w-sm w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <LogIn className="w-8 h-8 text-brand-accent mx-auto mb-3" />
          <h2 className="text-xl font-light text-fg-custom tracking-tight">
            {mode === "login" ? "Zaloguj się" : "Utwórz konto"}
          </h2>
        </div>

        {/* Przełącznik trybu */}
        <div className="flex rounded-2xl bg-bg-custom border border-border-custom p-1 mb-5">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 ${
                mode === m
                  ? "bg-brand-primary text-brand-primary-fg shadow-sm"
                  : "text-fg-custom/50 hover:text-fg-custom"
              }`}
            >
              {m === "login" ? "LOGOWANIE" : "REJESTRACJA"}
            </button>
          ))}
        </div>

        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-medium text-center">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-fg-custom/70 mb-1.5 tracking-wider">
              E-MAIL
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="twoj@email.com"
              className="w-full px-4 py-3 rounded-xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-fg-custom/70 mb-1.5 tracking-wider">
              HASŁO
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 znaków"
                className="w-full px-4 py-3 pr-10 rounded-xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-custom/40 hover:text-fg-custom transition-colors"
              >
                {showPassword ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full text-xs font-bold tracking-widest bg-brand-primary text-brand-primary-fg hover:bg-brand-accent hover:text-brand-accent-fg transition-all duration-300 shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              />
            ) : mode === "login" ? (
              "ZALOGUJ SIĘ"
            ) : (
              "UTWÓRZ KONTO"
            )}
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-4 w-full text-center text-xs text-fg-custom/40 hover:text-fg-custom transition-colors"
        >
          Zamknij
        </button>
      </motion.div>
    </motion.div>
  )
}
