'use client'

import { useAppStore } from "@/lib/store";
import { habitatColors, pokemonList, habitats } from "@/lib/pokemon-data";
import { ArrowLeft, Leaf, Droplets, Flame, Mountain, Waves, TreePine, Sparkles, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const habitatIcons: Record<string, typeof Leaf> = {
  "tall-grass": Leaf,
  "flower-bed": Heart,
  "yellow-grass": Flame,
  "seaside": Waves,
  "red-grass": Flame,
  "mossy": Mountain,
  "hot-spring": Droplets,
  "rocky": Mountain,
  "pink-grass": Sparkles,
  "special": Star,
};

export function TypesPage() {
  const { setCurrentPage, setSelectedPokemon } = useAppStore();
  const [selectedHabitat, setSelectedHabitat] = useState<string | null>(null);

  const filteredPokemon = selectedHabitat
    ? pokemonList.filter(p => p.habitats.includes(selectedHabitat))
    : [];

  const handlePokemonClick = (pokemon: typeof pokemonList[0]) => {
    setSelectedPokemon({
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types,
      image: pokemon.image
    });
    setCurrentPage("pokemon-detail");
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-green-500 to-green-600">
      {/* Header */}
      <div className="pt-12 pb-4 px-4">
        <div className="flex items-center gap-4 mb-4">
          <motion.button
            onClick={() => setCurrentPage("home")}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <h1 className="text-xl font-bold text-white">Habitat Dex</h1>
        </div>
        <p className="text-white/80 text-sm">
          Browse Pokémon by their natural habitats
        </p>
      </div>

      {/* Content Card */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-hidden">
        <div className="h-full overflow-y-auto">
          {/* Habitat Grid */}
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">All Habitats</h2>
            <div className="grid grid-cols-2 gap-3">
              {habitats.map((habitat, index) => {
                const Icon = habitatIcons[habitat.id] || Leaf;
                const count = pokemonList.filter(p => p.habitats.includes(habitat.id)).length;
                
                return (
                  <motion.button
                    key={habitat.id}
                    onClick={() => setSelectedHabitat(selectedHabitat === habitat.id ? null : habitat.id)}
                    className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${
                      selectedHabitat === habitat.id 
                        ? 'ring-2 ring-offset-2 shadow-lg' 
                        : 'shadow'
                    }`}
                    style={{ 
                      backgroundColor: `${habitat.color}20`,
                      borderColor: habitat.color,
                      ringColor: selectedHabitat === habitat.id ? habitat.color : 'transparent'
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-3xl">{habitat.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{habitat.name}</span>
                    <span className="text-xs text-gray-400">{count} Pokémon</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Filtered Pokemon */}
          {selectedHabitat && (
            <motion.div 
              className="border-t border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  {habitats.find(h => h.id === selectedHabitat)?.name} Pokémon
                </h2>
                <div className="space-y-3">
                  {filteredPokemon.map((pokemon, index) => (
                    <motion.div
                      key={pokemon.id}
                      onClick={() => handlePokemonClick(pokemon)}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, backgroundColor: '#f3f4f6' }}
                    >
                      <img
                        src={pokemon.image}
                        alt={pokemon.name}
                        className="w-12 h-12"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-800">{pokemon.name}</h3>
                          <span className="text-xs text-gray-400">#{String(pokemon.id).padStart(3, '0')}</span>
                        </div>
                        <p className="text-xs text-gray-500">{pokemon.rarity}</p>
                        {pokemon.conditions && (
                          <p className="text-xs text-orange-500 mt-0.5">
                            {pokemon.conditions.join(' • ')}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {filteredPokemon.length === 0 && (
                    <p className="text-center text-gray-400 py-4">
                      No Pokémon found in this habitat
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Habitat Tips */}
          <div className="p-4 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Habitat Tips</h2>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">
                🌿 <strong>Tall Grass</strong> is home to Grass and Bug types.<br/>
                🏖️ <strong>Seaside</strong> habitats attract Water types.<br/>
                ♨️ <strong>Hot Springs</strong> are perfect for Fire types.<br/>
                ✨ <strong>Special</strong> habitats have rare Pokémon!
              </p>
            </div>
          </div>

          {/* Rarity Guide */}
          <div className="p-4 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Rarity Guide</h2>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <span className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="text-sm text-gray-600">Common</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-600">Uncommon</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <span className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm text-gray-600">Rare</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm text-gray-600">Very Rare</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
