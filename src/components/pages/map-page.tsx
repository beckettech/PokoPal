'use client'

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { ArrowLeft, Search, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import locationsData from "@/data/scraped/locations.json";

const LOCATION_COLORS: Record<string, { bg: string; badge: string; text: string }> = {
  "Withered Wastelands": { bg: "from-amber-700 to-amber-900", badge: "bg-amber-700", text: "text-amber-100" },
  "Bleak Beach":         { bg: "from-blue-400 to-blue-600",   badge: "bg-blue-500",   text: "text-white" },
  "Rocky Ridges":        { bg: "from-stone-500 to-stone-700", badge: "bg-stone-600",  text: "text-white" },
  "Sparkling Skylands":  { bg: "from-sky-400 to-sky-600",     badge: "bg-sky-500",    text: "text-white" },
  "Palette Town":        { bg: "from-red-400 to-red-600",     badge: "bg-red-500",    text: "text-white" },
  "Cloud Island":        { bg: "from-purple-400 to-purple-600", badge: "bg-purple-500", text: "text-white" },
};

export function MapPage() {
  const { setCurrentPage } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);
  const [pokemonSearch, setPokemonSearch] = useState<Record<string, string>>({});

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-500 to-blue-600 overflow-hidden">
      {/* Header */}
      <div className="pt-6 pb-2 px-4 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <motion.button
            onClick={() => setCurrentPage("home")}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <h1 className="text-lg font-bold text-white">Map</h1>
          <div className="w-9" />
        </div>

        {/* Search locations */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white shadow text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-y-auto">
        <div className="p-3 space-y-3">
          {locationsData
            .filter(loc => loc.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((location, index) => {
              const colors = LOCATION_COLORS[location.name] || { bg: "from-gray-400 to-gray-600", badge: "bg-gray-500", text: "text-white" };
              const isExpanded = expandedLocation === location.id;
              const pSearch = pokemonSearch[location.id] || "";
              const filteredPokemon = location.pokemon.filter(p =>
                p.name.toLowerCase().includes(pSearch.toLowerCase())
              );

              return (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-xl overflow-hidden shadow-sm border border-gray-100"
                >
                  {/* Location header */}
                  <button
                    className={`w-full bg-gradient-to-r ${colors.bg} p-4`}
                    onClick={() => setExpandedLocation(isExpanded ? null : location.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Location image */}
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-white/20">
                          <img
                            src={location.image}
                            alt={location.name}
                            className="w-full h-full object-cover"
                            onError={e => { (e.target as HTMLImageElement).src = ''; }}
                          />
                        </div>
                        <div className="text-left">
                          <h2 className="font-bold text-white text-base">{location.name}</h2>
                          <p className="text-white/70 text-xs">{location.description}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-white/70" />
                            <span className="text-white/70 text-xs">{location.pokemon.length} Pokémon</span>
                          </div>
                        </div>
                      </div>
                      {isExpanded
                        ? <ChevronUp className="w-5 h-5 text-white/70" />
                        : <ChevronDown className="w-5 h-5 text-white/70" />
                      }
                    </div>
                  </button>

                  {/* Expanded Pokemon list */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-gray-50"
                      >
                        {/* Pokemon search */}
                        <div className="px-3 pt-3">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                            <input
                              type="text"
                              placeholder={`Search ${location.name} Pokémon...`}
                              value={pSearch}
                              onChange={e => setPokemonSearch(prev => ({...prev, [location.id]: e.target.value}))}
                              className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none text-xs"
                            />
                          </div>
                        </div>

                        <div className="p-3 flex flex-wrap gap-1.5">
                          {filteredPokemon.map(pokemon => (
                            <motion.button
                              key={pokemon.slug}
                              onClick={() => setCurrentPage("dex")}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center gap-1 px-2 py-1 rounded-full bg-white border border-gray-200 text-xs text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                            >
                              {pokemon.name}
                            </motion.button>
                          ))}
                          {filteredPokemon.length === 0 && (
                            <p className="text-gray-400 text-xs w-full text-center py-2">No Pokémon found</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
