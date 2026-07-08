"use client";

import { useState } from "react";
import { X, Calendar, User, CheckCircle, ChevronRight, ChevronLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createBooking } from "@/app/actions/booking";
import { firebaseDb } from "@/app/lib/firebase";
import { Location } from "@/app/types";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: Location[];
  preSelectedLocationId: string | null;
}

const ADDONS = [
  { id: "kayak", name: "Dwuosobowy kajak", price: 75, description: "Dostęp do kajaka na czas całego pobytu (PLN 75/dzień)", perDay: true },
  { id: "food", name: "Lokalne wyżywienie", price: 131, description: "Kosz delikatesowy z lokalnymi produktami dostarczany rano (PLN 131/dzień/osobę)", perPerson: true, perDay: true },
  { id: "sauna", name: "Dostęp do sauny leśnej", price: 188, description: "Jednorazowy nielimitowany seans w saunie opalanej drewnem (PLN 188/pobyt)", perDay: false },
  { id: "stargazing", name: "Zestaw do obserwacji gwiazd", price: 56, description: "Profesjonalna lornetka i teleskop astronomiczny z mapą nieba (PLN 56/pobyt)", perDay: false },
];

export default function BookingModal({
  isOpen,
  onClose,
  locations,
  preSelectedLocationId,
}: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState("");

  // Formularz stan
  const [locationId, setLocationId] = useState(preSelectedLocationId || locations[0]?.id || "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guestsCount, setGuestsCount] = useState(2);
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Kalkulacja liczby dni
  const daysCount = useMemoDays();
  function useMemoDays() {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  }

  // Kalkulacja ceny
  const selectedLocation = locations.find((l) => l.id === locationId);
  const basePrice = selectedLocation ? selectedLocation.price * daysCount : 0;
  
  const addonsPrice = selectedAddons.reduce((sum, addonId) => {
    const addon = ADDONS.find((a) => a.id === addonId);
    if (!addon) return sum;
    let price = addon.price;
    if (addon.perDay) price *= daysCount || 1;
    if (addon.perPerson) price *= guestsCount;
    return sum + price;
  }, 0);

  const totalPrice = basePrice + addonsPrice;

  // Funkcja walidacji pojedynczych kroków
  const validateStep = () => {
    const stepErrors: Record<string, string> = {};

    if (step === 1) {
      if (!locationId) stepErrors.locationId = "Musisz wybrać lokalizację";
      if (!startDate) stepErrors.startDate = "Data rozpoczęcia jest wymagana";
      if (!endDate) stepErrors.endDate = "Data zakończenia jest wymagana";
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end <= start) stepErrors.endDate = "Data zakończenia musi być po dacie rozpoczęcia";
        if (start < new Date(new Date().setHours(0, 0, 0, 0))) stepErrors.startDate = "Data nie może być z przeszłości";
      }
    }

    if (step === 2) {
      if (!fullName.trim() || fullName.trim().length < 3) {
        stepErrors.fullName = "Imię i nazwisko musi mieć co najmniej 3 znaki";
      }
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        stepErrors.email = "Podaj poprawny adres e-mail";
      }
      if (!phone.trim() || phone.replace(/\D/g, "").length < 9) {
        stepErrors.phone = "Podaj poprawny numer telefonu (min. 9 cyfr)";
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  const handleAddonToggle = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);

    const bookingData = {
      locationId,
      startDate,
      endDate,
      guestsCount,
      fullName,
      email,
      phone,
      addons: selectedAddons,
      totalPrice,
    };

    try {
      // Wywołanie Server Action
      const result = await createBooking(bookingData);

      if (result.success && result.bookingId) {
        const bookingRecord = {
          bookingCode: result.bookingId,
          ...bookingData,
          locationName: selectedLocation?.name || "",
          createdAt: new Date().toISOString(),
        };

        // Zapis do Firebase (lub Mock)
        if ("addDoc" in firebaseDb) {
          await firebaseDb.addDoc("bookings", bookingRecord);
        } else {
          const { collection, addDoc } = await import("firebase/firestore");
          await addDoc(collection(firebaseDb, "bookings"), bookingRecord);
        }

        setBookingCode(result.bookingId);
        setSuccess(true);
      } else {
        const formattedErrors: Record<string, string> = {};
        if (result.errors) {
          Object.entries(result.errors).forEach(([key, val]) => {
            if (val && Array.isArray(val) && val.length > 0) {
              formattedErrors[key] = val[0];
            }
          });
        } else {
          formattedErrors.general = result.message || "Błąd zapisu";
        }
        setErrors(formattedErrors);
      }
    } catch (error) {
      console.error("Błąd rezerwacji:", error);
      setErrors({ general: "Wystąpił nieoczekiwany błąd sieci. Spróbuj ponownie." });
    } finally {
      setLoading(false);
    }
  };

  // Reset formularza
  const handleReset = () => {
    setStep(1);
    setSuccess(false);
    setBookingCode("");
    setStartDate("");
    setEndDate("");
    setGuestsCount(2);
    setFullName("");
    setEmail("");
    setPhone("");
    setSelectedAddons([]);
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Tło przyciemnione */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleReset}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Okno Modala */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-2xl bg-card-custom border border-border-custom rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Nagłówek Modala */}
            <div className="px-8 py-5 border-b border-border-custom flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/20">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-full bg-brand-primary text-brand-primary-fg">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="text-sm font-bold tracking-widest text-brand-primary">
                  REZERWACJA POBYTU
                </span>
              </div>
              <button
                onClick={handleReset}
                className="p-1.5 rounded-full border border-border-custom hover:bg-brand-muted/10 text-fg-custom cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Wskaźnik postępu (Kroki) */}
            {!success && (
              <div className="px-8 py-4 bg-brand-muted/5 border-b border-border-custom flex items-center justify-between text-xs font-semibold text-fg-custom/40">
                <div className="flex items-center gap-4 w-full">
                  {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold border transition-colors ${
                          step >= s
                            ? "bg-brand-primary border-brand-primary text-brand-primary-fg"
                            : "border-border-custom"
                        }`}
                      >
                        {s}
                      </span>
                      <span className={`hidden sm:inline ${step === s ? "text-fg-custom font-bold" : ""}`}>
                        {s === 1 && "Termin"}
                        {s === 2 && "Dane gościa"}
                        {s === 3 && "Dodatki"}
                        {s === 4 && "Podsumowanie"}
                      </span>
                      {s < 4 && <div className="h-px bg-border-custom flex-1 hidden sm:block" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Treść Modala (Przewijana) */}
            <div className="p-8 overflow-y-auto flex-1">
              {errors.general && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-500">
                  {errors.general}
                </div>
              )}

              {success ? (
                /* Widok Sukcesu */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 flex flex-col items-center"
                >
                  <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-green-500 mb-6">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-light text-fg-custom">Rezerwacja potwierdzona!</h3>
                  <p className="mt-2 text-sm text-fg-custom/60 max-w-sm mx-auto font-light">
                    Twój pobyt w **{selectedLocation?.name}** został pomyślnie zarezerwowany. Szczegóły wysłaliśmy na podany adres e-mail.
                  </p>
                  
                  {/* Kod Rezerwacji */}
                  <div className="mt-8 p-6 rounded-2xl border border-dashed border-border-custom bg-brand-muted/5 max-w-xs w-full">
                    <span className="text-[10px] font-bold tracking-widest text-fg-custom/40 uppercase block">
                      Kod Rezerwacji
                    </span>
                    <span className="text-2xl font-black text-brand-accent mt-1 block tracking-wider">
                      {bookingCode}
                    </span>
                  </div>

                  <button
                    onClick={handleReset}
                    className="mt-10 bg-brand-primary text-brand-primary-fg hover:bg-brand-accent hover:text-brand-accent-fg px-8 py-3.5 rounded-full font-bold text-xs tracking-widest shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    ZAMKNIJ OKNO
                  </button>
                </motion.div>
              ) : (
                /* Kroki formularza */
                <div>
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      {/* Wybór Lokalizacji */}
                      <div>
                        <label className="block text-xs font-bold tracking-widest text-fg-custom/60 uppercase mb-2">
                          Wybierz obiekt
                        </label>
                        <select
                          value={locationId}
                          onChange={(e) => setLocationId(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border-custom bg-card-custom text-sm focus:outline-none focus:border-brand-accent text-fg-custom font-bold"
                        >
                          {locations.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                              {loc.name} (PLN {loc.price}/noc)
                            </option>
                          ))}
                        </select>
                        {errors.locationId && (
                          <span className="text-xs text-red-500 mt-1 block">{errors.locationId}</span>
                        )}
                      </div>

                      {/* Daty */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold tracking-widest text-fg-custom/60 uppercase mb-2">
                            Zameldowanie
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-custom/40" />
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border-custom bg-card-custom text-sm focus:outline-none focus:border-brand-accent text-fg-custom"
                            />
                          </div>
                          {errors.startDate && (
                            <span className="text-xs text-red-500 mt-1 block">{errors.startDate}</span>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold tracking-widest text-fg-custom/60 uppercase mb-2">
                            Wymeldowanie
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-custom/40" />
                            <input
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border-custom bg-card-custom text-sm focus:outline-none focus:border-brand-accent text-fg-custom"
                            />
                          </div>
                          {errors.endDate && (
                            <span className="text-xs text-red-500 mt-1 block">{errors.endDate}</span>
                          )}
                        </div>
                      </div>

                      {/* Liczba Gości */}
                      <div>
                        <label className="block text-xs font-bold tracking-widest text-fg-custom/60 uppercase mb-2">
                          Liczba gości (max 10)
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setGuestsCount((g) => Math.max(1, g - 1))}
                            className="w-10 h-10 border border-border-custom rounded-lg bg-card-custom flex items-center justify-center font-bold text-fg-custom hover:bg-brand-muted/10 focus:outline-none cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-sm font-bold w-8 text-center text-fg-custom">
                            {guestsCount}
                          </span>
                          <button
                            type="button"
                            onClick={() => setGuestsCount((g) => Math.min(10, g + 1))}
                            className="w-10 h-10 border border-border-custom rounded-lg bg-card-custom flex items-center justify-center font-bold text-fg-custom hover:bg-brand-muted/10 focus:outline-none cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        {errors.guestsCount && (
                          <span className="text-xs text-red-500 mt-1 block">{errors.guestsCount}</span>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      {/* Imię i Nazwisko */}
                      <div>
                        <label className="block text-xs font-bold tracking-widest text-fg-custom/60 uppercase mb-2">
                          Imię i Nazwisko
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-custom/40" />
                          <input
                            type="text"
                            placeholder="np. Jan Kowalski"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-border-custom bg-card-custom text-sm focus:outline-none focus:border-brand-accent text-fg-custom"
                          />
                        </div>
                        {errors.fullName && (
                          <span className="text-xs text-red-500 mt-1 block">{errors.fullName}</span>
                        )}
                      </div>

                      {/* E-mail */}
                      <div>
                        <label className="block text-xs font-bold tracking-widest text-fg-custom/60 uppercase mb-2">
                          Adres e-mail
                        </label>
                        <input
                          type="email"
                          placeholder="jan.kowalski@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border-custom bg-card-custom text-sm focus:outline-none focus:border-brand-accent text-fg-custom"
                        />
                        {errors.email && (
                          <span className="text-xs text-red-500 mt-1 block">{errors.email}</span>
                        )}
                      </div>

                      {/* Telefon */}
                      <div>
                        <label className="block text-xs font-bold tracking-widest text-fg-custom/60 uppercase mb-2">
                          Numer telefonu
                        </label>
                        <input
                          type="tel"
                          placeholder="np. 500 600 700"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border-custom bg-card-custom text-sm focus:outline-none focus:border-brand-accent text-fg-custom"
                        />
                        {errors.phone && (
                          <span className="text-xs text-red-500 mt-1 block">{errors.phone}</span>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <h4 className="text-sm font-bold text-fg-custom tracking-wider">
                        Udogodnienia opcjonalne (dodatkowe płatne)
                      </h4>
                      <p className="text-xs text-fg-custom/60 font-light">
                        Wzbogać swój wypoczynek o unikalne usługi, które przygotujemy dla Ciebie na miejscu.
                      </p>

                      <div className="space-y-3 mt-4">
                        {ADDONS.map((addon) => {
                          const isSelected = selectedAddons.includes(addon.id);

                          return (
                            <button
                              key={addon.id}
                              type="button"
                              onClick={() => handleAddonToggle(addon.id)}
                              className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                                isSelected
                                  ? "border-brand-accent bg-brand-accent/5 ring-1 ring-brand-accent/30"
                                  : "border-border-custom bg-card-custom hover:bg-brand-muted/5"
                              }`}
                            >
                              <div className="max-w-[75%]">
                                <span className="block text-sm font-bold text-fg-custom">
                                  {addon.name}
                                </span>
                                <span className="block text-xs text-fg-custom/60 mt-1 font-light">
                                  {addon.description}
                                </span>
                              </div>
                              <span className="text-sm font-black text-brand-primary">
                                +PLN {addon.price}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <h4 className="text-sm font-bold text-fg-custom tracking-wider">
                        Podsumowanie rezerwacji
                      </h4>

                      {/* Karta podsumowania */}
                      <div className="p-6 rounded-2xl border border-border-custom bg-brand-muted/5 space-y-4 text-sm text-fg-custom">
                        <div className="flex justify-between border-b border-border-custom/50 pb-3">
                          <span className="font-light text-fg-custom/60">Obiekt:</span>
                          <span className="font-bold">{selectedLocation?.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-border-custom/50 pb-3">
                          <span className="font-light text-fg-custom/60">Lokalizacja:</span>
                          <span className="font-medium text-xs tracking-wider">{selectedLocation?.locationName}</span>
                        </div>
                        <div className="flex justify-between border-b border-border-custom/50 pb-3">
                          <span className="font-light text-fg-custom/60">Termin:</span>
                          <span className="font-medium">
                            {startDate} do {endDate} ({daysCount} dni)
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-border-custom/50 pb-3">
                          <span className="font-light text-fg-custom/60">Goście:</span>
                          <span className="font-bold">{guestsCount} os.</span>
                        </div>

                        {selectedAddons.length > 0 && (
                          <div className="border-b border-border-custom/50 pb-3 space-y-1">
                            <span className="font-light text-fg-custom/60 text-xs block mb-1">Wybrane dodatki:</span>
                            {selectedAddons.map((addonId) => {
                              const addon = ADDONS.find((a) => a.id === addonId);
                              return (
                                <div key={addonId} className="flex justify-between text-xs">
                                  <span className="text-fg-custom/80 font-medium">• {addon?.name}</span>
                                  <span className="font-bold text-fg-custom/60">+PLN {addon?.price}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Podsumowanie finansowe */}
                        <div className="pt-2 flex justify-between items-end">
                          <div>
                            <span className="text-xs text-fg-custom/60 block font-light">Łączny koszt:</span>
                            <span className="text-xs font-semibold text-fg-custom/40">
                              (baza: PLN {basePrice} + dodatki: PLN {addonsPrice})
                            </span>
                          </div>
                          <span className="text-3xl font-black text-brand-accent">
                            PLN {totalPrice}
                          </span>
                        </div>
                      </div>

                      {/* Zgoda marketingowo-regulaminowa */}
                      <p className="text-[10px] text-fg-custom/40 text-center font-light leading-relaxed max-w-sm mx-auto">
                        Klikając przycisk potwierdzenia rezerwacji akceptujesz Regulamin portalu Wild Haven oraz politykę ochrony danych osobowych.
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Stopka Modala (Przyciski nawigacji) */}
            {!success && (
              <div className="px-8 py-5 border-t border-border-custom flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/20">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-border-custom hover:bg-brand-muted/10 text-xs font-bold tracking-widest text-fg-custom transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    WSTECZ
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-1.5 bg-brand-primary text-brand-primary-fg hover:bg-brand-accent hover:text-brand-accent-fg px-6 py-2.5 rounded-full text-xs font-bold tracking-widest transition-all duration-300 ml-auto cursor-pointer"
                  >
                    DALEJ
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 bg-brand-accent text-brand-accent-fg hover:bg-brand-primary hover:text-brand-primary-fg px-8 py-3 rounded-full text-xs font-bold tracking-widest transition-all duration-300 ml-auto shadow-lg disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        PRZETWARZANIE...
                      </>
                    ) : (
                      <>
                        POTWIERDZAM REZERWACJĘ
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
