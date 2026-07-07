"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  MapPin,
  DollarSign,
  Star,
  Tag,
  Building2,
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Calendar,
  User,
} from "lucide-react"
import Link from "next/link"
import {
  getLocations,
  getBookings,
  addLocation,
  updateLocation,
  deleteLocation,
  deleteBooking,
  subscribeToAuth,
  loginUser,
  registerUser,
  logoutUser,
  isAdminUser,
} from "@/app/lib/firebase"
import type { Location, Booking } from "@/app/types"
import type { MockUser } from "@/app/lib/firebase"
import Image from "next/image"

// --- Formularz edycji/dodawania ---
function LocationForm({
  initial,
  onSave,
  onCancel,
  isLoading,
}: {
  initial?: Location
  onSave: (data: Omit<Location, "id">) => void
  onCancel: () => void
  isLoading: boolean
}) {
  const [formData, setFormData] = useState({
    name: initial?.name || "",
    locationName: initial?.locationName || "",
    description: initial?.description || "",
    price: initial?.price?.toString() || "",
    rating: initial?.rating?.toString() || "5",
    tags: initial?.tags?.join(", ") || "",
    details: initial?.details || "",
    features: initial?.features?.join(", ") || "",
    image: initial?.image || "/images/forest-haven.png",
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name: formData.name,
      locationName: formData.locationName,
      description: formData.description,
      price: Number(formData.price) || 0,
      rating: Number(formData.rating) || 5,
      image: formData.image.trim() || initial?.image || "/images/forest-haven.png",
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      coords: initial?.coords || {
        x: 51.1 + Math.random() * 2,
        y: 17.0 + Math.random() * 2,
      },
      details: formData.details,
      features: formData.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nazwa obiektu */}
        <div>
          <label className="block text-xs font-semibold text-fg-custom/70 mb-1.5 tracking-wider">
            NAZWA OBIEKTU
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-custom/40" />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="np. Dolina Sosen"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>
        </div>

        {/* Lokalizacja */}
        <div>
          <label className="block text-xs font-semibold text-fg-custom/70 mb-1.5 tracking-wider">
            LOKALIZACJA
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-custom/40" />
            <input
              type="text"
              name="locationName"
              required
              value={formData.locationName}
              onChange={handleChange}
              placeholder="np. Dolny Śląsk"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>
        </div>

        {/* Cena */}
        <div>
          <label className="block text-xs font-semibold text-fg-custom/70 mb-1.5 tracking-wider">
            CENA (PLN/noc)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-custom/40" />
            <input
              type="number"
              name="price"
              required
              min="1"
              value={formData.price}
              onChange={handleChange}
              placeholder="350"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>
        </div>

        {/* Ocena */}
        <div>
          <label className="block text-xs font-semibold text-fg-custom/70 mb-1.5 tracking-wider">
            OCENA
          </label>
          <div className="relative">
            <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-custom/40" />
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-custom border border-border-custom text-sm text-fg-custom focus:outline-none focus:border-brand-accent transition-colors appearance-none"
            >
              {[5, 4.9, 4.8, 4.7, 4.5, 4.0].map((v) => (
                <option key={v} value={v}>
                  ⭐ {v}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tagi */}
      <div>
        <label className="block text-xs font-semibold text-fg-custom/70 mb-1.5 tracking-wider">
          TAGI (przecinek)
        </label>
        <div className="relative">
          <Tag className="absolute left-3 top-3 w-4 h-4 text-fg-custom/40" />
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Jurta, Sauna, Pet-friendly"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>
      </div>

      {/* Opis */}
      <div>
        <label className="block text-xs font-semibold text-fg-custom/70 mb-1.5 tracking-wider">
          OPIS
        </label>
        <textarea
          name="description"
          required
          rows={2}
          value={formData.description}
          onChange={handleChange}
          placeholder="Krótki opis oferty…"
          className="w-full px-4 py-2.5 rounded-xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors resize-none"
        />
      </div>

      {/* Ścieżka obrazu */}
      <div>
        <label className="block text-xs font-semibold text-fg-custom/70 mb-1.5 tracking-wider">
          ŚCIEŻKA DO ZDJĘCIA
        </label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="/images/forest-haven.png"
          className="w-full px-4 py-2.5 rounded-xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors"
        />
      </div>

      {/* Szczegóły */}
      <div>
        <label className="block text-xs font-semibold text-fg-custom/70 mb-1.5 tracking-wider">
          SZCZEGÓŁY
        </label>
        <textarea
          name="details"
          rows={2}
          value={formData.details}
          onChange={handleChange}
          placeholder="Szczegółowy opis…"
          className="w-full px-4 py-2.5 rounded-xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors resize-none"
        />
      </div>

      {/* Udogodnienia */}
      <div>
        <label className="block text-xs font-semibold text-fg-custom/70 mb-1.5 tracking-wider">
          UDOGODNIENIA (przecinek)
        </label>
        <input
          type="text"
          name="features"
          value={formData.features}
          onChange={handleChange}
          placeholder="Wi-Fi, Sauna, Parking"
          className="w-full px-4 py-2.5 rounded-xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors"
        />
      </div>

      {/* Przyciski */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 rounded-full text-xs font-bold tracking-widest bg-brand-accent text-brand-accent-fg hover:bg-brand-primary hover:text-brand-primary-fg transition-all duration-300 shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            />
          ) : (
            <Check className="w-4 h-4" />
          )}
          {initial ? "ZAPISZ ZMIANY" : "DODAJ OFERTĘ"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-full text-xs font-bold tracking-widest border border-border-custom text-fg-custom hover:bg-brand-muted/10 transition-all duration-300"
        >
          ANULUJ
        </button>
      </div>
    </form>
  )
}

// --- Karta oferty ---
function LocationCard({
  location,
  onEdit,
  onDelete,
}: {
  location: Location
  onEdit: (loc: Location) => void
  onDelete: (loc: Location) => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-card-custom border border-border-custom rounded-2xl p-5 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {location.image ? (
            <Image
              src={location.image}
              alt={location.name}
              className="h-28 w-full rounded-xl object-cover mb-3 border border-border-custom"
              width={300}
              height={112}
            />
          ) : (
            <div className="mb-3 flex h-28 items-center justify-center rounded-xl border border-dashed border-border-custom bg-bg-custom/70 text-[10px] uppercase tracking-wider text-fg-custom/40">
              Brak obrazu
            </div>
          )}
          <h3 className="text-sm font-bold text-fg-custom truncate">
            {location.name}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <MapPin className="w-3 h-3 text-brand-accent shrink-0" />
            <span className="text-xs text-fg-custom/60 truncate">
              {location.locationName}
            </span>
          </div>
          <p className="text-xs text-fg-custom/50 mt-2 line-clamp-2">
            {location.description}
          </p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs font-bold text-brand-accent">
              {location.price} PLN/noc
            </span>
            <span className="text-xs text-fg-custom/40">
              ⭐ {location.rating}
            </span>
            {location.tags?.length > 0 && (
              <span className="text-[10px] text-fg-custom/40 bg-bg-custom px-2 py-0.5 rounded-full">
                {location.tags.length} tagów
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={() => onEdit(location)}
            className="p-2 rounded-xl text-fg-custom/40 hover:text-brand-accent hover:bg-brand-accent/10 transition-all duration-200"
            title="Edytuj"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(location)}
            className="p-2 rounded-xl text-fg-custom/40 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200"
            title="Usuń"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// --- Modal potwierdzenia usunięcia ---
function DeleteConfirmModal({
  location,
  onConfirm,
  onCancel,
  isLoading,
}: {
  location: Location
  onConfirm: () => void
  onCancel: () => void
  isLoading: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-card-custom border border-border-custom rounded-3xl p-8 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-fg-custom">
            Usuń ofertę?
          </h3>
          <p className="text-sm text-fg-custom/60 mt-2">
            Czy na pewno chcesz usunąć{" "}
            <span className="font-semibold text-fg-custom">
              {location.name}
            </span>
            ? Tej operacji nie można cofnąć.
          </p>
        </div>
        <div className="flex gap-3 mt-8">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3 rounded-full text-xs font-bold tracking-widest bg-red-500 text-white hover:bg-red-600 transition-all duration-300 shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            USUŃ
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-full text-xs font-bold tracking-widest border border-border-custom text-fg-custom hover:bg-brand-muted/10 transition-all duration-300"
          >
            ANULUJ
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function BookingCard({
  booking,
  onDelete,
}: {
  booking: Booking
  onDelete: (booking: Booking) => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-card-custom border border-border-custom rounded-2xl p-5 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-fg-custom/50 mb-3">
            <span className="px-3 py-1 rounded-full bg-bg-custom border border-border-custom">
              {booking.bookingCode}
            </span>
            <span className="px-3 py-1 rounded-full bg-bg-custom border border-border-custom">
              {booking.locationName}
            </span>
          </div>

          <h3 className="text-sm font-bold text-fg-custom truncate">
            {booking.fullName}
          </h3>
          <p className="text-xs text-fg-custom/60 mt-1 truncate">{booking.email}</p>

          <div className="grid grid-cols-2 gap-3 mt-4 text-xs text-fg-custom/60">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-brand-accent shrink-0" />
              <span>{booking.startDate} → {booking.endDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-brand-accent shrink-0" />
              <span>{booking.guestsCount} gości</span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap text-xs text-fg-custom/50 mt-4">
            <span className="px-2 py-1 rounded-full bg-bg-custom border border-border-custom">
              {booking.phone}
            </span>
            <span className="px-2 py-1 rounded-full bg-bg-custom border border-border-custom">
              {booking.addons.length} dodatków
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 shrink-0">
          <span className="text-sm font-bold text-brand-accent">
            {booking.totalPrice} PLN
          </span>
          <button
            onClick={() => onDelete(booking)}
            className="p-2 rounded-xl text-fg-custom/40 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200"
            title="Usuń rezerwację"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function BookingDeleteConfirmModal({
  booking,
  onConfirm,
  onCancel,
  isLoading,
}: {
  booking: Booking
  onConfirm: () => void
  onCancel: () => void
  isLoading: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-card-custom border border-border-custom rounded-3xl p-8 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-fg-custom">
            Usuń rezerwację?
          </h3>
          <p className="text-sm text-fg-custom/60 mt-2">
            Czy na pewno chcesz usunąć rezerwację od
            <span className="font-semibold text-fg-custom">
              {" "}{booking.fullName}
            </span>
            za {booking.locationName}?
          </p>
        </div>
        <div className="flex gap-3 mt-8">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3 rounded-full text-xs font-bold tracking-widest bg-red-500 text-white hover:bg-red-600 transition-all duration-300 shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            USUŃ
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-full text-xs font-bold tracking-widest border border-border-custom text-fg-custom hover:bg-brand-muted/10 transition-all duration-300"
          >
            ANULUJ
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// --- Formularz logowania admina ---
function AdminLoginForm() {
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
      // Podążamy za stanem auth — onLogin zostanie wywołane przez subscribeToAuth
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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="text-center mb-10">
        <Lock className="w-10 h-10 text-brand-accent mx-auto mb-4" />
        <h1 className="text-3xl font-light text-fg-custom tracking-tight">
          Panel admina
        </h1>
        <p className="mt-3 text-sm text-fg-custom/60 font-light">
          Zaloguj się, aby zarządzać ofertami
        </p>
      </div>

      <div className="bg-card-custom border border-border-custom rounded-3xl p-8 shadow-xl">
        {/* Przełącznik trybu */}
        <div className="flex rounded-2xl bg-bg-custom border border-border-custom p-1 mb-6">
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
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-medium text-center">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-fg-custom/70 mb-2 tracking-wider">
              ADRES E-MAIL
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-custom/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="twoj@email.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-fg-custom/70 mb-2 tracking-wider">
              HASŁO
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-custom/40" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 znaków"
                className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-bg-custom border border-border-custom text-sm text-fg-custom placeholder:text-fg-custom/30 focus:outline-none focus:border-brand-accent transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-fg-custom/40 hover:text-fg-custom transition-colors"
                aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full text-xs font-bold tracking-widest bg-brand-primary text-brand-primary-fg hover:bg-brand-accent hover:text-brand-accent-fg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
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
      </div>

      <Link
        href="/"
        className="mt-6 flex items-center justify-center gap-2 text-xs text-fg-custom/50 hover:text-fg-custom transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Wróć do strony głównej
      </Link>
    </motion.div>
  )
}

// --- Główna strona admina ---
export default function AdminPage() {
  const [user, setUser] = useState<MockUser | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [deletingLocation, setDeletingLocation] = useState<Location | null>(
    null,
  )
  const [bookings, setBookings] = useState<Booking[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(true)
  const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Subskrypcja stanu autoryzacji + sprawdzenie roli admina
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

  const loadLocations = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getLocations()
      setLocations(data)
    } catch (err) {
      console.error("Błąd ładowania ofert:", err)
      setError("Nie udało się załadować ofert.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadBookings = useCallback(async () => {
    setBookingsLoading(true)
    setError(null)
    try {
      const data = await getBookings()
      setBookings(data)
    } catch (err) {
      console.error("Błąd ładowania rezerwacji:", err)
      setError("Nie udało się załadować rezerwacji.")
    } finally {
      setBookingsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!user) {
      return
    }

    const fetchAdminData = async () => {
      await loadLocations()
      await loadBookings()
    }

    void fetchAdminData()
  }, [user, loadLocations, loadBookings])

  // Wylogowanie
  const handleLogout = async () => {
    await logoutUser()
    setUser(null)
    setIsAdmin(false)
  }

  // --- Dodawanie ---
  const handleAdd = async (data: Omit<Location, "id">) => {
    setIsSaving(true)
    try {
      await addLocation(data)
      setShowForm(false)
      await loadLocations()
    } catch (err) {
      console.error("Błąd dodawania:", err)
      setError("Nie udało się dodać oferty.")
    } finally {
      setIsSaving(false)
    }
  }

  // --- Edycja ---
  const handleEdit = async (data: Omit<Location, "id">) => {
    if (!editingLocation) return
    setIsSaving(true)
    try {
      await updateLocation(editingLocation.id, data)
      setEditingLocation(null)
      await loadLocations()
    } catch (err) {
      console.error("Błąd edycji:", err)
      setError("Nie udało się zaktualizować oferty.")
    } finally {
      setIsSaving(false)
    }
  }

  // --- Usuwanie ---
  const handleDelete = async () => {
    if (!deletingLocation) return
    setIsSaving(true)
    try {
      await deleteLocation(deletingLocation.id)
      setDeletingLocation(null)
      await loadLocations()
    } catch (err) {
      console.error("Błąd usuwania:", err)
      setError("Nie udało się usunąć oferty.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteBooking = async () => {
    if (!deletingBooking) return
    setIsSaving(true)
    try {
      await deleteBooking(deletingBooking.id)
      setDeletingBooking(null)
      await loadBookings()
    } catch (err) {
      console.error("Błąd usuwania rezerwacji:", err)
      setError("Nie udało się usunąć rezerwacji.")
    } finally {
      setIsSaving(false)
    }
  }

  // Ekran ładowania auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-bg-custom flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full"
        />
      </div>
    )
  }

  // Zalogowany, ale brak roli admina
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-bg-custom flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-light text-fg-custom tracking-tight mb-2">
            Brak uprawnień
          </h1>
          <p className="text-sm text-fg-custom/60 mb-4">
            Twoje konto ({user.email}) nie posiada roli administratora.
          </p>
          <div className="bg-card-custom border border-border-custom rounded-2xl p-4 mb-6 text-left">
            <p className="text-[10px] font-semibold text-fg-custom/50 tracking-wider mb-1">TWOJ UID (do użycia w Firestore Console):</p>
            <code className="block text-xs text-brand-accent font-mono break-all bg-bg-custom rounded-xl px-3 py-2 border border-border-custom">
              {user.uid}
            </code>
            <p className="text-[10px] text-fg-custom/40 mt-2">
              Utwórz dokument w kolekcji <span className="font-semibold">users</span> z ID = powyższemu UID,<br/>z polami: uid, email, role = &quot;admin&quot;
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold tracking-widest bg-brand-primary text-brand-primary-fg hover:bg-brand-accent transition-all duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Strona główna
          </Link>
        </div>
      </div>
    )
  }

  // Brak logowania — formularz logowania
  if (!user) {
    return (
      <div className="min-h-screen bg-bg-custom">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-125 h-125 bg-brand-accent/3 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-100 h-100 bg-brand-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-12">
          <AdminLoginForm />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-custom">
      {/* Dekoracyjne tło */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-125 h-125 bg-brand-accent/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-100 h-100 bg-brand-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Nagłówek */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-fg-custom/40 hover:text-fg-custom transition-colors mb-3"
            >
              <ArrowLeft className="w-3 h-3" />
              Strona główna
            </Link>
            <h1 className="text-3xl font-light text-fg-custom tracking-tight">
              Panel admina
            </h1>
            <p className="text-sm text-fg-custom/50 mt-1 font-light">
              {user?.email} · Zarządzaj ofertami i rezerwacjami w Firestore
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadLocations}
              disabled={isLoading}
              className="p-2.5 rounded-xl text-fg-custom/40 hover:text-fg-custom hover:bg-brand-muted/10 transition-all duration-200"
              title="Odśwież"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-accent text-brand-accent-fg text-xs font-bold tracking-widest hover:bg-brand-primary hover:text-brand-primary-fg transition-all duration-300 shadow-md"
            >
              <Plus className="w-4 h-4" />
              DODAJ
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl text-fg-custom/40 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200"
              title="Wyloguj"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Błąd */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-medium text-center">
            {error}
          </div>
        )}

        {/* Formularz dodawania */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-card-custom border border-brand-accent/30 rounded-3xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-bold text-fg-custom tracking-wider">
                    NOWA OFERTA
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-1.5 rounded-lg text-fg-custom/40 hover:text-fg-custom transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <LocationForm
                  onSave={handleAdd}
                  onCancel={() => setShowForm(false)}
                  isLoading={isSaving}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista ofert */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full"
            />
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-12 h-12 text-fg-custom/20 mx-auto mb-4" />
            <p className="text-sm text-fg-custom/40 font-light">
              Brak ofert w bazie danych.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-xs text-brand-accent font-semibold hover:underline"
            >
              Dodaj pierwszą ofertę →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {locations.map((loc) => (
                <LocationCard
                  key={loc.id}
                  location={loc}
                  onEdit={setEditingLocation}
                  onDelete={setDeletingLocation}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Statystyki */}
        {locations.length > 0 && (
          <div className="mt-10 text-center text-xs text-fg-custom/30 tracking-wider">
            Łącznie {locations.length} ofert w Firestore
          </div>
        )}

        {/* Zarządzanie rezerwacjami */}
        <div className="mt-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-fg-custom">
                Rezerwacje
              </h2>
              <p className="mt-2 text-sm text-fg-custom/60 max-w-2xl">
                Lista rezerwacji pobieranych z kolekcji bookings.
              </p>
            </div>
            <button
              onClick={loadBookings}
              disabled={bookingsLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-accent text-brand-accent-fg text-xs font-bold tracking-widest hover:bg-brand-primary hover:text-brand-primary-fg transition-all duration-300 shadow-md"
            >
              <RefreshCw className={`w-4 h-4 ${bookingsLoading ? "animate-spin" : ""}`} />
              Odśwież rezerwacje
            </button>
          </div>

          {bookingsLoading ? (
            <div className="flex items-center justify-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full"
              />
            </div>
          ) : bookings.length === 0 ? (
            <div className="rounded-3xl border border-border-custom bg-card-custom p-8 text-center text-sm text-fg-custom/60">
              Brak rezerwacji w kolekcji bookings.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onDelete={setDeletingBooking}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {bookings.length > 0 && (
            <div className="mt-6 text-center text-xs text-fg-custom/30 tracking-wider">
              Łącznie {bookings.length} rezerwacji w Firestore
            </div>
          )}
        </div>
      </div>

      {/* Modal edycji */}
      <AnimatePresence>
        {editingLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setEditingLocation(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-card-custom border border-border-custom rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold text-fg-custom tracking-wider">
                  EDYTUJ OFERTĘ
                </h2>
                <button
                  onClick={() => setEditingLocation(null)}
                  className="p-1.5 rounded-lg text-fg-custom/40 hover:text-fg-custom transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <LocationForm
                initial={editingLocation}
                onSave={handleEdit}
                onCancel={() => setEditingLocation(null)}
                isLoading={isSaving}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal usuwania */}
      <AnimatePresence>
        {deletingLocation && (
          <DeleteConfirmModal
            location={deletingLocation}
            onConfirm={handleDelete}
            onCancel={() => setDeletingLocation(null)}
            isLoading={isSaving}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletingBooking && (
          <BookingDeleteConfirmModal
            booking={deletingBooking}
            onConfirm={handleDeleteBooking}
            onCancel={() => setDeletingBooking(null)}
            isLoading={isSaving}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
