"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Star, ArrowUpDown, CalendarRange, MapPin } from "lucide-react";
import Image from "next/image";
import { Location } from "@/app/types";

interface CatalogProps {
  locations: Location[];
  selectedLocationId: string | null;
  onBookLocation: (id: string) => void;
  onShowDetails: (location: Location) => void;
}

type SortOption = "price-asc" | "price-desc" | "rating-desc" | "default";

export default function Catalog({
  locations,
  selectedLocationId,
  onBookLocation,
  onShowDetails,
}: CatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("default");

  // Pobranie wszystkich unikalnych tagów z lokalizacji
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    locations.forEach((loc) => loc.tags.forEach((tag) => tagsSet.add(tag)));
    return Array.from(tagsSet);
  }, [locations]);

  // Filtrowanie i sortowanie danych
  const filteredLocations = useMemo(() => {
    let result = [...locations];

    // Szukanie tekstowe
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (loc) =>
          loc.name.toLowerCase().includes(q) ||
          loc.locationName.toLowerCase().includes(q) ||
          loc.description.toLowerCase().includes(q)
      );
    }

    // Filtrowanie po tagu
    if (selectedTag) {
      result = result.filter((loc) => loc.tags.includes(selectedTag));
    }

    // Sortowanie
    if (sortOption === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "rating-desc") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [locations, searchQuery, selectedTag, sortOption]);

  return (
    <section id="locations" className="py-24 px-6 bg-background transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Nagłówek Katalogu */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-border-custom">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-brand-accent uppercase">
              NASZA OFERTA
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-light tracking-tight text-fg-custom">
              Odkryj luksusowe oazy na łonie natury
            </h2>
          </div>
          <p className="text-sm text-fg-custom/60 max-w-md font-light leading-relaxed">
            Filtruj, sortuj i znajdź idealne schronienie dopasowane do Twoich potrzeb. Każdy obiekt oferuje niepowtarzalne doświadczenia i bliskość z naturą.
          </p>
        </div>

        {/* Wyszukiwarka, Filtry i Sortowanie */}
        <div className="mt-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Szukaj */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-custom/40" />
            <input
              type="text"
              placeholder="Szukaj lokalizacji, nazwy lub udogodnienia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-border-custom bg-card-custom text-sm focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-300"
            />
          </div>

          {/* Opcje sortowania i filtrów */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Przycisk sortowania */}
            <div className="relative flex items-center gap-2 border border-border-custom rounded-full px-4 py-2.5 bg-card-custom text-xs font-semibold text-fg-custom">
              <ArrowUpDown className="w-4 h-4 text-brand-accent" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="bg-transparent focus:outline-none cursor-pointer pr-4 font-bold"
              >
                <option value="default">Sortowanie domyślne</option>
                <option value="price-asc">Cena: od najniższej</option>
                <option value="price-desc">Cena: od najwyższej</option>
                <option value="rating-desc">Ocena: od najwyższej</option>
              </select>
            </div>

            {/* Resetuj filtry */}
            {(selectedTag || searchQuery || sortOption !== "default") && (
              <button
                onClick={() => {
                  setSelectedTag(null);
                  setSearchQuery("");
                  setSortOption("default");
                }}
                className="text-xs font-semibold text-brand-accent hover:text-brand-primary underline transition-colors cursor-pointer"
              >
                Resetuj filtry
              </button>
            )}
          </div>
        </div>

        {/* Tagi Udogodnień */}
        <div className="flex flex-wrap gap-2 mt-6">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
              selectedTag === null
                ? "bg-brand-primary text-brand-primary-fg"
                : "border border-border-custom hover:bg-brand-muted/10 text-fg-custom"
            }`}
          >
            Wszystkie
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                selectedTag === tag
                  ? "bg-brand-primary text-brand-primary-fg"
                  : "border border-border-custom hover:bg-brand-muted/10 text-fg-custom"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Grid Lokalizacji */}
        {filteredLocations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {filteredLocations.map((loc) => (
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
                        className="px-3.5 py-2 rounded-full border border-border-custom text-xs font-semibold text-fg-custom hover:bg-brand-muted/10 transition-colors"
                      >
                        Odkryj
                      </button>
                      <button
                        onClick={() => onBookLocation(loc.id)}
                        className="flex items-center gap-1 bg-brand-primary text-brand-primary-fg hover:bg-brand-accent hover:text-brand-accent-fg px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300"
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
        ) : (
          <div className="text-center py-20 border border-dashed border-border-custom rounded-2xl mt-12 bg-card-custom">
            <SlidersHorizontal className="w-10 h-10 mx-auto text-fg-custom/30" />
            <h3 className="mt-4 text-lg font-bold text-fg-custom">Brak wyników</h3>
            <p className="mt-2 text-sm text-fg-custom/60">
              Spróbuj zmienić parametry wyszukiwania lub zresetować filtry.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
