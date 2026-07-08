"use client";

import { Star, MapPin, CalendarRange, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Location } from "@/app/types";

interface PromoCatalogProps {
  locations: Location[];
  selectedLocationId: string | null;
  onBookLocation: (id: string) => void;
  onShowDetails: (location: Location) => void;
}

export default function PromoCatalog({
  locations,
  selectedLocationId,
  onBookLocation,
  onShowDetails,
}: PromoCatalogProps) {
  // We only display the first three locations
  const promoLocations = locations.slice(0, 3);

  return (
    <section id="promo-locations" className="py-24 px-6 bg-background transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Nagłówek Sekcji */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-border-custom">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-brand-accent uppercase">
              NASZA OFERTA
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-light tracking-tight text-fg-custom">
              Wyjątkowe oazy na łonie natury
            </h2>
          </div>
          <p className="text-sm text-fg-custom/60 max-w-md font-light leading-relaxed">
            Prezentujemy wybrane kempingi z naszej oferty. Każdy z nich łączy dziką naturę z bezkompromisowym komfortem. Zobacz naszą pełną ofertę, aby znaleźć idealne miejsce na kolejną przygodę.
          </p>
        </div>

        {/* Grid 3 lokalizacji */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {promoLocations.map((loc) => (
            <div
              key={loc.id}
              className={`group bg-card-custom rounded-2xl border ${
                selectedLocationId === loc.id
                  ? "border-brand-accent ring-2 ring-brand-accent/30"
                  : "border-border-custom"
              } overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col h-full`}
            >
              {/* Zdjęcie */}
              <div className="relative h-[240px] w-full overflow-hidden">
                <Image
                  src={loc.image}
                  alt={loc.name}
                  fill
                  sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Rating */}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/95 dark:bg-[#0c0e0a]/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-border-custom text-xs font-bold text-fg-custom">
                  <Star className="w-3 h-3 fill-brand-accent stroke-brand-accent" />
                  <span>{loc.rating}</span>
                </div>
                {/* Tag geograficzny */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-medium">
                  <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                  <span>{loc.locationName}</span>
                </div>
              </div>

              {/* Treść */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-xl font-bold text-fg-custom group-hover:text-brand-accent transition-colors">
                    {loc.name}
                  </h3>
                  <p className="mt-2 text-sm text-fg-custom/70 font-light line-clamp-3">
                    {loc.description}
                  </p>
                  {/* Tagi */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {loc.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-brand-muted/10 text-brand-primary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dolny panel: cena i przyciski */}
                <div className="border-t border-border-custom mt-6 pt-6 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-fg-custom">PLN {loc.price}</span>
                    <span className="text-xs text-fg-custom/60"> / noc</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onShowDetails(loc)}
                      className="px-3.5 py-2 rounded-full border border-border-custom text-xs font-semibold text-fg-custom hover:bg-brand-muted/10 transition-colors cursor-pointer"
                    >
                      Odkryj
                    </button>
                    <button
                      onClick={() => onBookLocation(loc.id)}
                      className="flex items-center gap-1 bg-brand-primary text-brand-primary-fg hover:bg-brand-accent hover:text-brand-accent-fg px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer"
                    >
                      <CalendarRange className="w-3.5 h-3.5" />
                      Rezerwuj
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Kreatywny przycisk przejścia do pełnego katalogu */}
        <div className="mt-16 flex justify-center">
          <Link
            href="/locations"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-brand-primary text-brand-primary-fg font-bold tracking-[0.1em] text-xs rounded-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            {/* Animowany efekt poświaty/tła przy hoverze */}
            <span className="absolute inset-0 bg-brand-accent transition-transform duration-300 ease-out origin-left scale-x-0 group-hover:scale-x-100" />
            
            <span className="relative z-10 flex items-center gap-2 group-hover:text-brand-accent-fg transition-colors duration-300">
              POKAŻ PEŁNY KATALOG LOKALIZACJI
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
