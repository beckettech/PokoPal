'use client'

import { useAppStore } from "@/lib/store";
import { pokemonList as pokemonData, Pokemon, getSpecialtyIcon } from "@/lib/pokemon-data";
import { ArrowLeft, Search, Plus, X, Eye, EyeOff, Check, Bolt } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const rarities = ["Common", "Rare", "Legendary"] as const;

export function DexPage() {
  const { setCurrentPage, capturedPokemon, toggleCapturedPokemon } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [friendFilter, setFriendFilter] = useState<"all" | "friends" | "unseen">("all");
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const filteredPokemon = pokemonData.filter(pokemon => {
    const matchesSearch = pokemon.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = !selectedRarity || pokemon.rarity === selectedRarity;
    
    // Friend filter
    let matchesFriendFilter = true;
    if (friendFilter === "friends") {
      matchesFriendFilter = capturedPokemon.includes(pokemon.id);
    } else if (friendFilter === "unseen") {
      matchesFriendFilter = !capturedPokemon.includes(pokemon.id);
    }
    
    return matchesSearch && matchesRarity && matchesFriendFilter;
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary": return "text-amber-500";
      case "Rare": return "text-purple-500";
      default: return "text-gray-500";
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case "Legendary": return "bg-gradient-to-br from-amber-100 to-amber-200";
      case "Rare": return "bg-gradient-to-br from-purple-100 to-purple-200";
      default: return "bg-gradient-to-br from-gray-100 to-gray-200";
    }
  };

  const getRarityButtonStyle = (rarity: string) => {
    switch (rarity) {
      case "Legendary": return "bg-gradient-to-r from-amber-400 to-orange-400 text-white";
      case "Rare": return "bg-gradient-to-r from-purple-400 to-violet-400 text-white";
      default: return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700";
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-red-500 to-red-600">
      {/* Header */}
      <div className="pt-6 pb-2 px-4">
        <div className="flex items-center justify-between mb-2">
          <motion.button
            onClick={() => setCurrentPage("home")}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <h1 className="text-lg font-bold text-white">Dex</h1>
          <div className="w-9" />
        </div>

        <p className="text-white/70 text-xs mb-3 text-center">
          {capturedPokemon.length} Friends / 300 Pokemon
        </p>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Pokemon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white shadow-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
          />
        </div>

        {/* Friend Filter */}
        <div className="flex gap-1.5 mt-2">
          <motion.button
            onClick={() => setFriendFilter("all")}
            className={`flex-1 px-2.5 py-1.5 rounded-full text-xs font-medium flex items-center justify-center gap-1 ${
              friendFilter === "all" 
                ? "bg-white text-red-600" 
                : "bg-white/20 text-white"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Eye className="w-3 h-3" />
            All
          </motion.button>
          <motion.button
            onClick={() => setFriendFilter("friends")}
            className={`flex-1 px-2.5 py-1.5 rounded-full text-xs font-medium flex items-center justify-center gap-1 ${
              friendFilter === "friends" 
                ? "bg-yellow-400 text-yellow-900" 
                : "bg-white/20 text-white"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Check className="w-3 h-3" />
            Friends ({capturedPokemon.length})
          </motion.button>
          <motion.button
            onClick={() => setFriendFilter("unseen")}
            className={`flex-1 px-2.5 py-1.5 rounded-full text-xs font-medium flex items-center justify-center gap-1 ${
              friendFilter === "unseen" 
                ? "bg-gray-600 text-white" 
                : "bg-white/20 text-white"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <EyeOff className="w-3 h-3" />
            Unseen ({300 - capturedPokemon.length})
          </motion.button>
        </div>

        {/* Rarity Filter */}
        <div className="flex gap-1.5 mt-2">
          <motion.button
            onClick={() => setSelectedRarity(null)}
            className={`flex-1 px-2.5 py-1.5 rounded-full text-xs font-medium ${
              !selectedRarity 
                ? "bg-white text-red-600" 
                : "bg-white/20 text-white"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            All
          </motion.button>
          {rarities.map(rarity => (
            <motion.button
              key={rarity}
              onClick={() => setSelectedRarity(rarity)}
              className={`flex-1 px-2.5 py-1.5 rounded-full text-xs font-medium ${
                selectedRarity === rarity 
                  ? getRarityButtonStyle(rarity)
                  : "bg-white/20 text-white"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {rarity}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Pokemon List */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-hidden">
        <div className="h-full overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {filteredPokemon.map((pokemon, index) => {
              const isFriend = capturedPokemon.includes(pokemon.id);
              return (
                <motion.div
                  key={pokemon.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.02 }}
                  className="flex items-center gap-3 p-3 border-b border-gray-100"
                >
                  {/* Pokemon Image */}
                  <motion.div 
                    className={`relative w-16 h-16 shrink-0 rounded-xl ${getRarityBg(pokemon.rarity)} p-1.5 cursor-pointer`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    onClick={() => setSelectedPokemon(pokemon)}
                  >
                    <img
                      src={pokemon.image}
                      alt={pokemon.name}
                      className="w-full h-full object-contain drop-shadow-sm"
                      style={{ filter: 'drop-shadow(0 0 1px black) drop-shadow(0 0 1px black)' }}
                    />
                  </motion.div>

                  {/* Pokemon Info */}
                  <div className="flex-1 min-w-0" onClick={() => setSelectedPokemon(pokemon)}>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 font-mono">#{String(pokemon.nationalDex).padStart(3, '0')}</span>
                      <h3 className="font-bold text-gray-800 text-sm">{pokemon.name}</h3>
                      <span className={`text-[10px] ${getRarityColor(pokemon.rarity)}`}>
                        {pokemon.rarity}
                      </span>
                    </div>
                    
                    {/* Specialties */}
                    {pokemon.specialties && pokemon.specialties.length > 0 && (
                      <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                        <Bolt className="w-2.5 h-2.5 text-yellow-500 shrink-0" />
                        <div className="flex items-center gap-0.5 flex-wrap">
                          {pokemon.specialties.slice(0, 2).map((spec, idx) => (
                            <div key={idx} className="flex items-center gap-0.5">
                              <img
                                src={getSpecialtyIcon(spec)}
                                alt={spec}
                                className="w-3 h-3 object-contain"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                              <span className="text-[9px] text-green-600">{spec}</span>
                              {idx < pokemon.specialties.length - 1 && idx < 1 && <span className="text-green-300">•</span>}
                            </div>
                          ))}
                          {pokemon.specialties.length > 2 && (
                            <span className="text-[9px] text-gray-400">+{pokemon.specialties.length - 2}</span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Habitats */}
                    {pokemon.habitats && pokemon.habitats.length > 0 && (
                      <p className="text-[9px] text-blue-600 mt-0.5 truncate">
                        🏠 {pokemon.habitats[0]}
                        {pokemon.habitats.length > 1 && ` +${pokemon.habitats.length - 1}`}
                      </p>
                    )}
                    
                    {/* Map Locations */}
                    {pokemon.locations && pokemon.locations.length > 0 && (
                      <p className="text-[9px] text-cyan-600 mt-0.5 truncate">
                        🗺️ {pokemon.locations[0]}
                        {pokemon.locations.length > 1 && ` +${pokemon.locations.length - 1}`}
                      </p>
                    )}
                  </div>

                  {/* Friend Toggle Button */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCapturedPokemon(pokemon.id);
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isFriend 
                        ? 'bg-yellow-400 text-yellow-900' 
                        : 'bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isFriend ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </motion.button>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredPokemon.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <Search className="w-12 h-12 mb-2" />
              <p className="text-sm">No Pokemon found</p>
            </div>
          )}
        </div>
      </div>

      {/* Pokemon Detail Modal */}
      <AnimatePresence>
        {selectedPokemon && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPokemon(null)}
              className="absolute inset-0 bg-black/50 z-10"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl overflow-hidden z-20"
              style={{ maxHeight: '90%' }}
            >
              {/* Header with gradient */}
              <div className={`h-40 bg-gradient-to-br ${
                selectedPokemon.rarity === "Legendary" ? "from-amber-500 to-orange-500" :
                selectedPokemon.rarity === "Rare" ? "from-purple-500 to-violet-500" :
                "from-gray-400 to-gray-500"
              } relative`}>
                {/* X Close Button */}
                <motion.button
                  onClick={() => setSelectedPokemon(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>

                {/* Pokemon Image */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4">
                  <div className={`w-28 h-28 rounded-2xl ${getRarityBg(selectedPokemon.rarity)} p-2 shadow-xl`}>
                    <img
                      src={selectedPokemon.image}
                      alt={selectedPokemon.name}
                      className="w-full h-full object-contain"
                      style={{ filter: 'drop-shadow(0 0 2px black)' }}
                    />
                  </div>
                </div>
                
                {/* Rarity badge */}
                <div className="absolute top-3 left-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    selectedPokemon.rarity === 'Legendary'
                      ? 'bg-white text-amber-600'
                      : 'bg-black/30 text-white'
                  }`}>
                    {selectedPokemon.rarity}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="pt-16 p-4 overflow-y-auto max-h-[calc(90vh-10rem)]">
                {/* Name and Number */}
                <div className="text-center mb-4">
                  <p className="text-xs text-gray-400 font-mono">#{String(selectedPokemon.nationalDex).padStart(3, '0')}</p>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedPokemon.name}</h2>
                </div>

                {/* Friend Toggle Button */}
                <div className="mb-4">
                  <motion.button
                    onClick={() => toggleCapturedPokemon(selectedPokemon.id)}
                    className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium ${
                      capturedPokemon.includes(selectedPokemon.id)
                        ? 'bg-yellow-400 text-yellow-900'
                        : 'bg-gray-100 text-gray-600 border-2 border-dashed border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {capturedPokemon.includes(selectedPokemon.id) ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Friend!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        <span>Add as Friend</span>
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Specialties */}
                {selectedPokemon.specialties && selectedPokemon.specialties.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-700 text-sm mb-2">Specialties</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {selectedPokemon.specialties.map((specialty, i) => (
                        <span 
                          key={i}
                          className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-green-100 text-green-700"
                        >
                          ⚡ {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conditions */}
                {selectedPokemon.conditions && selectedPokemon.conditions.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-700 text-sm mb-2">Conditions</h3>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {selectedPokemon.conditions.map((condition, i) => (
                        <span key={i} className="text-xs px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Habitats */}
                {selectedPokemon.habitats && selectedPokemon.habitats.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-700 text-sm mb-2 flex items-center gap-1">
                      🏠 Habitats
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedPokemon.habitats.map((habitat, i) => (
                        <span key={i} className="text-xs px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-full border border-green-200">
                          {habitat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Map Locations */}
                {selectedPokemon.locations && selectedPokemon.locations.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-700 text-sm mb-2 flex items-center gap-1">
                      🗺️ Map Locations
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedPokemon.locations.map((location, i) => (
                        <span key={i} className="text-xs px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-full border border-blue-200">
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedPokemon.comfortNotes && (
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-700 text-sm mb-2">Notes</h3>
                    <p className="text-xs text-gray-600 bg-gray-50 rounded-xl p-3">
                      {selectedPokemon.comfortNotes}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
