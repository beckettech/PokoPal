'use client'

import { useAppStore } from "@/lib/store";
import { pokemonList, typeColors, habitats, habitatColors } from "@/lib/pokemon-data";
import { ArrowLeft, Heart, Share2, Star, Weight, Ruler, Zap, Shield, Swords, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function PokemonDetailPage() {
  const { setCurrentPage, selectedPokemon, capturedPokemon, addCapturedPokemon } = useAppStore();
  const [isFavorite, setIsFavorite] = useState(false);

  if (!selectedPokemon) {
    setCurrentPage("pokedex");
    return null;
  }

  const pokemon = pokemonList.find(p => p.id === selectedPokemon.id);
  
  if (!pokemon) {
    setCurrentPage("pokedex");
    return null;
  }

  const isCaptured = capturedPokemon.includes(pokemon.id);
  const primaryType = pokemon.types[0];
  const bgColor = typeColors[primaryType] || '#888';

  const handleCapture = () => {
    if (!isCaptured) {
      addCapturedPokemon(pokemon.id);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Very Rare": return "bg-yellow-500";
      case "Rare": return "bg-purple-500";
      case "Uncommon": return "bg-blue-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: `linear-gradient(to bottom, ${bgColor}, ${bgColor}dd)` }}>
      {/* Header */}
      <div className="pt-4 pb-4 px-4 shrink-0">
        {/* Top row: back + actions */}
        <div className="flex items-center justify-between mb-3">
          <motion.button
            onClick={() => setCurrentPage("pokedex")}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <div className="flex gap-2">
            <motion.button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
              whileTap={{ scale: 0.9 }}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-400 text-red-400' : 'text-white'}`} />
            </motion.button>
          </div>
        </div>

        {/* Image + Name side by side */}
        <div className="flex items-center gap-4">
          <motion.div
            className="relative w-20 h-20 shrink-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="w-full h-full object-contain drop-shadow-2xl"
            />
            {isCaptured && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg"
              >
                <Star className="w-3 h-3 text-yellow-800 fill-yellow-800" />
              </motion.div>
            )}
          </motion.div>
          <div>
            <p className="text-white/60 text-xs font-mono">#{String(pokemon.id).padStart(3, '0')}</p>
            <h1 className="text-2xl font-bold text-white leading-tight">{pokemon.name}</h1>
            <div className="flex gap-1 mt-1 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-xs text-white ${getRarityColor(pokemon.rarity)}`}>
                {pokemon.rarity}
              </span>
              {pokemon.types.map(type => (
                <span key={type} className="px-2 py-0.5 rounded-full text-xs font-medium text-white bg-white/20">
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Card */}
      <motion.div 
        className="flex-1 bg-white rounded-t-[2rem] overflow-hidden"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="h-full overflow-y-auto">
          {/* Description */}
          <div className="px-6 py-4">
            <p className="text-gray-600 text-sm leading-relaxed">{pokemon.description}</p>
          </div>

          {/* Habitats Section */}
          <div className="px-6 py-4 border-t border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Habitats
            </h3>
            <div className="flex flex-wrap gap-2">
              {pokemon.habitats.map(h => {
                const habitat = habitats.find(hab => hab.id === h);
                return (
                  <motion.div
                    key={h}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ backgroundColor: `${habitat?.color}20` }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-lg">{habitat?.icon}</span>
                    <span className="text-sm font-medium" style={{ color: habitat?.color }}>
                      {habitat?.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Conditions */}
          {pokemon.conditions && pokemon.conditions.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Spawn Conditions
              </h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.conditions.map(condition => (
                  <span
                    key={condition}
                    className="px-3 py-1.5 bg-orange-100 text-orange-600 rounded-full text-sm font-medium"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Capture Status */}
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800">Capture Status</h3>
                <p className={`text-sm ${isCaptured ? 'text-green-600' : 'text-gray-500'}`}>
                  {isCaptured ? '✓ Already captured!' : 'Not yet captured'}
                </p>
              </div>
              {isCaptured && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center"
                >
                  <Star className="w-6 h-6 text-green-600 fill-green-600" />
                </motion.div>
              )}
            </div>
          </div>

          {/* Capture Button */}
          {!isCaptured && (
            <div className="px-6 py-4">
              <motion.button
                onClick={handleCapture}
                className="w-full py-4 rounded-2xl font-bold text-white shadow-lg flex items-center justify-center gap-2"
                style={{ backgroundColor: bgColor }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Star className="w-5 h-5" />
                Mark as Captured
              </motion.button>
            </div>
          )}

          {/* Tips */}
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-bold text-blue-800 mb-2">💡 Tip</h3>
              <p className="text-sm text-blue-600">
                {pokemon.rarity === "Very Rare" 
                  ? "This Pokémon is very rare! It may take multiple real-life days to appear in its habitat."
                  : pokemon.rarity === "Rare"
                  ? "This rare Pokémon requires patience. Make sure the habitat conditions are met!"
                  : "Check the habitat requirements to attract this Pokémon to your island."}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
