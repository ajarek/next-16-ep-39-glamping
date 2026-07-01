"use client";

import { useState } from "react";
import { Star, MapPin, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Location } from "../types";

interface LocationMapProps {
  locations: Location[];
  onSelectLocation: (id: string) => void;
  activeLocationId: string | null;
}

export default function LocationMap({
  locations,
  onSelectLocation,
  activeLocationId,
}: LocationMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="py-24 px-6 bg-zinc-50/50 dark:bg-[#070906] transition-colors border-t border-border-custom">
      <div className="max-w-7xl mx-auto">
        {/* Nagłówek Sekcji Mapy */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-[0.2em] text-brand-accent uppercase">
            MAPA PRZYGODY
          </span>
          <h2 className="mt-3 text-3xl font-light text-fg-custom tracking-tight">
            Interaktywna mapa rezydentów
          </h2>
          <p className="mt-4 text-sm text-fg-custom/60 font-light leading-relaxed">
            Kliknij pinezkę na naszej topograficznej mapie, aby zlokalizować obiekt, sprawdzić warunki i przejść do szczegółów.
          </p>
        </div>

        {/* Mapa SVG + Pinezki z nakładkami */}
        <div className="relative aspect-[16/9] w-full max-w-5xl mx-auto rounded-3xl border border-border-custom bg-card-custom overflow-hidden shadow-xl">
          {/* Tło Mapy (Stylizowana Topografia / Siatka) */}
          <div className="absolute inset-0 z-0 bg-[#e7ebde] dark:bg-[#0f140e] opacity-40 transition-colors" />
          
          {/* Renderowany Wektorowy Element Topograficzny */}
          <svg
            className="absolute inset-0 w-full h-full text-brand-primary/10 dark:text-brand-primary/5 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1000 562.5"
            fill="none"
          >
            {/* Siatka pomocnicza */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" opacity="0.4" />

            {/* Rzeka (Ścieżka) */}
            <path
              d="M 100 -20 Q 300 150 400 300 T 500 500 T 700 580"
              fill="none"
              stroke="#a9c2c7"
              strokeWidth="16"
              strokeLinecap="round"
              className="dark:opacity-30"
            />
            <path
              d="M 100 -20 Q 300 150 400 300 T 500 500 T 700 580"
              fill="none"
              stroke="#8baab1"
              strokeWidth="6"
              strokeLinecap="round"
              className="dark:opacity-40"
            />

            {/* Jezioro (Polygon) */}
            <path
              d="M 450 180 Q 520 120 600 200 T 580 320 T 480 300 Z"
              fill="#98b9bf"
              className="dark:opacity-35"
              stroke="#7ba2ab"
              strokeWidth="2"
            />
            
            {/* Góry (Elementy dekoracyjne) */}
            <polygon points="700,450 780,330 860,450" fill="currentColor" opacity="0.3" />
            <polygon points="750,450 810,360 870,450" fill="currentColor" opacity="0.4" />
            <polygon points="200,350 250,270 300,350" fill="currentColor" opacity="0.3" />
            <polygon points="240,350 280,290 320,350" fill="currentColor" opacity="0.4" />

            {/* Las (Drzewka) */}
            <g className="text-brand-primary/20 dark:text-brand-primary/10">
              <circle cx="150" cy="120" r="15" fill="currentColor" />
              <circle cx="170" cy="130" r="12" fill="currentColor" />
              <circle cx="140" cy="140" r="18" fill="currentColor" />
              
              <circle cx="680" cy="150" r="15" fill="currentColor" />
              <circle cx="710" cy="130" r="12" fill="currentColor" />
              
              <circle cx="480" cy="420" r="22" fill="currentColor" />
              <circle cx="510" cy="400" r="15" fill="currentColor" />
            </g>
          </svg>

          {/* Teksty opisujące regiony mapy */}
          <div className="absolute top-[15%] left-[10%] text-[10px] tracking-[0.3em] font-black text-fg-custom/30 select-none uppercase">
            Las Deszczowy
          </div>
          <div className="absolute top-[35%] left-[55%] text-[10px] tracking-[0.3em] font-black text-fg-custom/30 select-none uppercase">
            Jezioro Górskie
          </div>
          <div className="absolute top-[75%] left-[75%] text-[10px] tracking-[0.3em] font-black text-fg-custom/30 select-none uppercase">
            Pasmo Alpejskie
          </div>

          {/* Pinezki na mapie */}
          {locations.map((loc) => {
            const isActive = activeLocationId === loc.id;
            const isHovered = hoveredId === loc.id;

            return (
              <div
                key={loc.id}
                style={{ left: `${loc.coords.x}%`, top: `${loc.coords.y}%` }}
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2 group"
              >
                {/* Wskaźnik/Marker */}
                <button
                  onClick={() => {
                    onSelectLocation(loc.id);
                    // Przewiń do katalogu w estetyczny sposób
                    const element = document.getElementById("locations");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  onMouseEnter={() => setHoveredId(loc.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="relative flex items-center justify-center p-2 focus:outline-none transition-transform duration-300 transform group-hover:scale-110"
                  aria-label={`Pokaż ${loc.name}`}
                >
                  {/* Efekt tętniącego pulsu wokół pinezki */}
                  <span
                    className={`absolute inline-flex h-10 w-10 rounded-full opacity-40 animate-ping ${
                      isActive
                        ? "bg-brand-accent"
                        : "bg-brand-primary"
                    }`}
                  />
                  
                  {/* Ikona pinezki */}
                  <div
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-colors border duration-300 ${
                      isActive
                        ? "bg-brand-accent text-white border-brand-accent-fg"
                        : "bg-card-custom text-brand-primary border-border-custom group-hover:bg-brand-primary group-hover:text-brand-primary-fg"
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                </button>

                {/* Popover z szybkim podglądem (Glassmorphism, Framer Motion) */}
                <AnimatePresence>
                  {(isHovered || isActive) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 w-[240px] rounded-2xl overflow-hidden glass-effect-light border border-border-custom shadow-2xl p-3"
                    >
                      {/* Obrazek w popoverze */}
                      <div className="relative h-28 w-full rounded-lg overflow-hidden">
                        <Image
                          src={loc.image}
                          alt={loc.name}
                          fill
                          sizes="200px"
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-white/90 dark:bg-[#0c0e0a]/90 backdrop-blur-md px-1.5 py-0.5 rounded-full text-[10px] font-bold text-fg-custom">
                          <Star className="w-2.5 h-2.5 fill-brand-accent stroke-brand-accent" />
                          <span>{loc.rating}</span>
                        </div>
                      </div>

                      {/* Informacje w popoverze */}
                      <div className="mt-2.5 text-left">
                        <h4 className="text-xs font-bold text-fg-custom truncate">{loc.name}</h4>
                        <p className="text-[10px] text-fg-custom/60 flex items-center gap-0.5 mt-0.5 font-medium">
                          <Compass className="w-3 h-3 text-brand-accent" />
                          {loc.locationName}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-custom/50">
                          <div>
                            <span className="text-sm font-black text-fg-custom">${loc.price}</span>
                            <span className="text-[9px] text-fg-custom/60">/noc</span>
                          </div>
                          <span className="text-[9px] font-bold tracking-widest text-brand-accent uppercase">
                            KLIKNIJ
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
