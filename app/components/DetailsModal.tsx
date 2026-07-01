"use client";

import { X, Star, Check, CalendarRange } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Location } from "../types";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: Location | null;
  onBook: (id: string) => void;
}

export default function DetailsModal({
  isOpen,
  onClose,
  location,
  onBook,
}: DetailsModalProps) {
  if (!location) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Nakładka przyciemniająca */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Okno Szczegółów */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-2xl bg-card-custom border border-border-custom rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Przycisk zamknięcia */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/10 transition-colors"
              aria-label="Zamknij podgląd"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Zdjęcie na górze */}
            <div className="relative h-[280px] w-full shrink-0">
              <Image
                src={location.image}
                alt={location.name}
                fill
                sizes="(max-w-700px) 100vw, 600px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Ocena i Kategoria */}
              <div className="absolute bottom-6 left-6 text-white space-y-1.5 text-left">
                <span className="bg-brand-accent text-brand-accent-fg text-[9px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
                  {location.locationName}
                </span>
                <h3 className="text-3xl font-extrabold tracking-tight mt-1">
                  {location.name}
                </h3>
              </div>
            </div>

            {/* Treść (Przewijana) */}
            <div className="p-8 overflow-y-auto space-y-6 text-left flex-1">
              {/* Ocena i Cena */}
              <div className="flex justify-between items-center border-b border-border-custom pb-5">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-brand-accent">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-fg-custom">
                    {location.rating} / 5.0 (Opinia Gości)
                  </span>
                </div>
                <div>
                  <span className="text-3xl font-black text-fg-custom">${location.price}</span>
                  <span className="text-xs text-fg-custom/60"> / noc</span>
                </div>
              </div>

              {/* Długi Opis */}
              <div>
                <h4 className="text-xs font-bold tracking-widest text-fg-custom/60 uppercase mb-2">
                  O LOKALIZACJI
                </h4>
                <p className="text-sm text-fg-custom/80 font-light leading-relaxed whitespace-pre-line">
                  {location.details}
                </p>
              </div>

              {/* Cechy Udogodnień */}
              <div>
                <h4 className="text-xs font-bold tracking-widest text-fg-custom/60 uppercase mb-3">
                  UDOGODNIENIA W CENIE
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {location.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-fg-custom/80 font-light">
                      <Check className="w-4 h-4 text-brand-accent shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stopka Modala z przyciskiem rezerwacji */}
            <div className="p-6 border-t border-border-custom flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/20 shrink-0">
              <div>
                <span className="text-[10px] font-bold text-fg-custom/40 tracking-widest block">SZACUNKOWY KOSZT</span>
                <span className="text-base font-extrabold text-fg-custom">${location.price} za nocleg</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onBook(location.id);
                }}
                className="flex items-center gap-2 bg-brand-primary text-brand-primary-fg hover:bg-brand-accent hover:text-brand-accent-fg px-8 py-3.5 rounded-full font-bold text-xs tracking-widest transition-all duration-300 shadow-md"
              >
                <CalendarRange className="w-4 h-4" />
                REZERWUJ POBYT
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
