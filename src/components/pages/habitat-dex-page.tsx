'use client'

import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { pokemonList } from "@/lib/pokemon-data";
import { ArrowLeft, Search, CheckCircle, Clock, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import habitatsData from "@/data/scraped/habitats.json";

// Build pokemon slug -> image URL map for previews
const pokemonImageMap: Record<string, string> = {};
for (const p of pokemonList) {
  pokemonImageMap[p.name.toLowerCase()] = p.image;
}

const LOCATIONS = [
  "All",
  "Withered Wastelands",
  "Bleak Beach",
  "Rocky Ridges",
  "Sparkling Skylands",
  "Palette Town",
  "Cloud Island",
];

const LOCATION_COLORS: Record<string, string> = {
  "Withered Wastelands": "bg-amber-800 text-amber-100",
  "Bleak Beach": "bg-blue-500 text-white",
  "Rocky Ridges": "bg-stone-600 text-white",
  "Sparkling Skylands": "bg-sky-400 text-white",
  "Palette Town": "bg-red-500 text-white",
  "Cloud Island": "bg-purple-500 text-white",
};

export function HabitatDexPage() {
  const { setCurrentPage, capturedPokemon, setSelectedPokemon } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [expandedHabitat, setExpandedHabitat] = useState<number | null>(null);

  // Build a set of captured Pokemon names for quick lookup
  const capturedNames = useMemo(() => {
    const names = new Set<string>();
    pokemonList.forEach(p => {
      if (capturedPokemon.includes(p.id)) {
        names.add(p.name.toLowerCase());
      }
    });
    return names;
  }, [capturedPokemon]);

  const getCompletionStatus = (habitatPokemon: Array<{ name: string; slug: string }>) => {
    if (habitatPokemon.length === 0) return null;
    const total = habitatPokemon.length;
    const caught = habitatPokemon.filter(p => capturedNames.has(p.name.toLowerCase())).length;
    if (caught === 0) return { label: "Not Started", icon: <Circle className="w-3 h-3" />, color: "bg-gray-200 text-gray-600" };
    if (caught === total) return { label: "Complete!", icon: <CheckCircle className="w-3 h-3" />, color: "bg-green-100 text-green-700" };
    return { label: `${caught}/${total}`, icon: <Clock className="w-3 h-3" />, color: "bg-yellow-100 text-yellow-700" };
  };

  const filteredHabitats = useMemo(() => {
    return habitatsData.filter(hab => {
      const matchesSearch = hab.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = selectedLocation === "All" || hab.locations.includes(selectedLocation);
      return matchesSearch && matchesLocation;
    });
  }, [searchQuery, selectedLocation]);

  const handlePokemonClick = (slug: string, name: string) => {
    setCurrentPage("dex");
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-green-500 to-green-600 overflow-hidden">
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
          <h1 className="text-lg font-bold text-white">Habitat Dex</h1>
          <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
            <span className="text-white text-xs font-bold">{filteredHabitats.length}</span>
            <span className="text-white/70 text-xs">habitats</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search habitats..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white shadow text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
          />
        </div>

        {/* Location filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {LOCATIONS.map(loc => (
            <motion.button
              key={loc}
              onClick={() => setSelectedLocation(loc)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all ${
                selectedLocation === loc
                  ? "bg-white text-green-700 shadow"
                  : "bg-white/20 text-white"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {loc === "All" ? "All Locations" : loc}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-y-auto">
        <div className="p-3 space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredHabitats.map((habitat, index) => {
              const status = getCompletionStatus(habitat.pokemon);
              const isExpanded = expandedHabitat === habitat.id;

              return (
                <motion.div
                  key={habitat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: Math.min(index * 0.02, 0.3) }}
                  className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100"
                >
                  {/* Habitat header - always visible */}
                  <button
                    className="w-full flex items-center gap-3 p-3"
                    onClick={() => setExpandedHabitat(isExpanded ? null : habitat.id)}
                  >
                    {/* Habitat image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                      <img
                        src={habitat.image}
                        alt={habitat.name}
                        className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>

                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-gray-400">#{String(habitat.id).padStart(3,'0')}</span>
                        <h3 className="font-bold text-gray-800 text-sm truncate">{habitat.name}</h3>
                      </div>

                      {/* Pokemon count + completion badge */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{habitat.pokemon.length} Pokémon</span>
                        {status && (
                          <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${status.color}`}>
                            {status.icon}
                            {status.label}
                          </span>
                        )}
                      </div>

                      {/* Location tags */}
                      {habitat.locations.length > 0 && habitat.locations.length < 6 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {habitat.locations.map(loc => (
                            <span
                              key={loc}
                              className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${LOCATION_COLORS[loc] || 'bg-gray-200 text-gray-600'}`}
                            >
                              {loc}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Expanded: Pokemon list */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 border-t border-gray-100">
                          {habitat.description && (
                            <p className="text-xs text-gray-500 mt-2 mb-2 italic"
                              dangerouslySetInnerHTML={{ __html: habitat.description }}
                            />
                          )}
                          <p className="text-xs font-semibold text-gray-700 mb-2">Residents:</p>
                          <div className="flex flex-wrap gap-2">
                            {habitat.pokemon.map(poke => {
                              const isCaught = capturedNames.has(poke.name.toLowerCase());
                              const img = pokemonImageMap[poke.name.toLowerCase()];
                              return (
                                <motion.button
                                  key={poke.slug}
                                  onClick={() => handlePokemonClick(poke.slug, poke.name)}
                                  whileTap={{ scale: 0.95 }}
                                  className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl border transition-colors w-16 ${
                                    isCaught
                                      ? "bg-green-50 border-green-200"
                                      : "bg-white border-gray-200"
                                  }`}
                                >
                                  <div className="relative w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {img && (
                                      <img
                                        src={img}
                                        alt={poke.name}
                                        className="w-full h-full object-contain"
                                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                      />
                                    )}
                                    {isCaught && (
                                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-2.5 h-2.5 text-white" />
                                      </div>
                                    )}
                                  </div>
                                  <span className={`text-[9px] text-center leading-tight font-medium ${isCaught ? "text-green-700" : "text-gray-600"}`}>
                                    {poke.name}
                                  </span>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredHabitats.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <Search className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm">No habitats found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
