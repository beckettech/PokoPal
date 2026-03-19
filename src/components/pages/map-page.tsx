'use client'

import { useAppStore } from "@/lib/store";
import { pokemonList } from "@/lib/pokemon-data";
import { ArrowLeft, MapPin, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import locationsData from "@/data/scraped/locations.json";

interface Region {
  id: number;
  name: string;
  image: string;
  description: string;
  pokemon: string[];
}

export function MapPage() {
  const { setCurrentPage, capturedPokemon } = useAppStore();
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  const regions = locationsData.regions as Region[];

  // Get Pokemon ID by name
  const getPokemonId = (name: string): number | undefined => {
    return pokemonList.find(p => p.name.toLowerCase() === name.toLowerCase())?.id;
  };

  // Get completion stats for a region
  const getRegionStats = (region: Region) => {
    const ids = region.pokemon.map(getPokemonId).filter((id): id is number => id !== undefined);
    const captured = ids.filter(id => capturedPokemon.includes(id)).length;
    return { captured, total: ids.length };
  };

  // Region colors
  const regionColors: Record<string, string> = {
    "Withered Wastelands": "from-amber-600 to-orange-700",
    "Bleak Beach": "from-slate-400 to-gray-600",
    "Rocky Ridges": "from-stone-500 to-stone-700",
    "Sparkling Skylands": "from-sky-400 to-indigo-500",
    "Palette Town": "from-green-400 to-emerald-600",
    "Cloud Island": "from-purple-400 to-violet-600"
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900">
      {/* Header */}
      <div className="pt-6 pb-2 px-4">
        <div className="flex items-center justify-between mb-2">
          <motion.button
            onClick={() => setCurrentPage("home")}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <h1 className="text-lg font-bold text-white">World Map</h1>
          <div className="w-9" />
        </div>
        <p className="text-center text-white/60 text-xs">
          Explore different regions and discover Pokemon
        </p>
      </div>

      {/* Content Card */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-hidden">
        <div className="h-full overflow-y-auto">
          {/* Region Cards */}
          <div className="p-3 space-y-3">
            {regions.map((region, index) => {
              const stats = getRegionStats(region);
              const gradientClass = regionColors[region.name] || "from-gray-400 to-gray-600";
              
              return (
                <motion.div
                  key={region.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedRegion(region)}
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradientClass} cursor-pointer shadow-lg`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Region Image */}
                  <div className="absolute inset-0 opacity-30">
                    <img 
                      src={region.image}
                      alt={region.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  
                  <div className="relative p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-white text-lg">{region.name}</h3>
                        <p className="text-white/70 text-xs">{region.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                          {stats.captured}/{stats.total}
                        </span>
                        <ChevronRight className="w-5 h-5 text-white/70" />
                      </div>
                    </div>

                    {/* Pokemon Preview */}
                    <div className="flex items-center gap-1.5 mt-3">
                      {region.pokemon.slice(0, 6).map((name, i) => {
                        const id = getPokemonId(name);
                        const isCaptured = id && capturedPokemon.includes(id);
                        const pokemon = pokemonList.find(p => p.name.toLowerCase() === name.toLowerCase());
                        
                        return (
                          <div 
                            key={i}
                            className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 ${
                              isCaptured 
                                ? 'border-yellow-400 bg-yellow-400/20' 
                                : 'border-white/30 bg-white/10'
                            }`}
                          >
                            {pokemon ? (
                              <img 
                                src={pokemon.image}
                                alt={name}
                                className="w-full h-full object-contain p-1"
                              />
                            ) : (
                              <span className="text-[8px] text-white font-bold">{name[0]}</span>
                            )}
                          </div>
                        );
                      })}
                      {region.pokemon.length > 6 && (
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                          <span className="text-xs text-white font-bold">+{region.pokemon.length - 6}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Region Detail Modal */}
      <AnimatePresence>
        {selectedRegion && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl overflow-hidden z-20"
            style={{ maxHeight: '85%' }}
          >
            <div className="p-4 overflow-y-auto max-h-full">
              {/* Handle */}
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
              
              {/* Region Image */}
              <div className={`w-full h-40 rounded-xl flex items-center justify-center mb-4 overflow-hidden bg-gradient-to-br ${regionColors[selectedRegion.name] || 'from-gray-400 to-gray-600'}`}>
                <img 
                  src={selectedRegion.image}
                  alt={selectedRegion.name}
                  className="w-full h-full object-cover opacity-80"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <MapPin className="absolute w-16 h-16 text-white/30" />
              </div>

              {/* Header */}
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800">{selectedRegion.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedRegion.description}</p>
                {(() => {
                  const stats = getRegionStats(selectedRegion);
                  return (
                    <span className="inline-block mt-2 text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {stats.captured}/{stats.total} Pokemon befriended
                    </span>
                  );
                })()}
              </div>

              {/* Pokemon List */}
              <div className="mb-4">
                <h3 className="font-bold text-gray-700 text-sm mb-2">Pokemon Found Here</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedRegion.pokemon.map((name, i) => {
                    const pokemonId = getPokemonId(name);
                    const isCaptured = pokemonId && capturedPokemon.includes(pokemonId);
                    const pokemon = pokemonList.find(p => p.name.toLowerCase() === name.toLowerCase());
                    
                    return (
                      <motion.button
                        key={i}
                        onClick={() => {
                          setSelectedRegion(null);
                          setCurrentPage("dex");
                        }}
                        className={`flex items-center gap-2 p-2 rounded-xl text-left ${
                          isCaptured 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-gray-50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {pokemon && (
                          <img 
                            src={pokemon.image}
                            alt={name}
                            className="w-10 h-10 object-contain"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <span className={`text-xs font-medium ${isCaptured ? 'text-green-700' : 'text-gray-700'}`}>
                              {name}
                            </span>
                            {isCaptured && <Check className="w-3 h-3 text-green-500" />}
                          </div>
                          {pokemon && (
                            <div className="flex gap-1 mt-0.5">
                              {pokemon.types.map((type, ti) => (
                                <span 
                                  key={ti}
                                  className="text-[8px] px-1.5 py-0.5 rounded bg-gray-200 text-gray-600"
                                >
                                  {type}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Close Button */}
              <motion.button
                onClick={() => setSelectedRegion(null)}
                className="w-full py-3 rounded-xl bg-blue-500 text-white font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
