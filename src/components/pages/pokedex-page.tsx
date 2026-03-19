'use client'

import { useAppStore } from "@/lib/store";
import { pokemonList, habitatColors, typeColors, habitats } from "@/lib/pokemon-data";
import { ArrowLeft, Search, Star, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function PokedexPage() {
  const { setCurrentPage, setSelectedPokemon, capturedPokemon } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHabitat, setSelectedHabitat] = useState<string | null>(null);

  const filteredPokemon = pokemonList.filter(pokemon => {
    const matchesSearch = pokemon.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHabitat = !selectedHabitat || pokemon.habitats.includes(selectedHabitat);
    return matchesSearch && matchesHabitat;
  });

  const handlePokemonClick = (pokemon: typeof pokemonList[0]) => {
    setSelectedPokemon({
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types,
      image: pokemon.image
    });
    setCurrentPage("pokemon-detail");
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Very Rare": return "text-yellow-500";
      case "Rare": return "text-purple-500";
      case "Uncommon": return "text-blue-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-red-500 to-red-600">
      {/* Header */}
      <div className="pt-12 pb-4 px-4">
        <div className="flex items-center justify-between mb-4">
          <motion.button
            onClick={() => setCurrentPage("home")}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <h1 className="text-xl font-bold text-white">Pokédex</h1>
          <motion.button
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Volume2 className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search Pokémon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white shadow-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Habitat Filter */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
          <motion.button
            onClick={() => setSelectedHabitat(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1 ${
              !selectedHabitat 
                ? "bg-white text-red-600" 
                : "bg-white/20 text-white"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>📋</span>
            All
          </motion.button>
          {habitats.map(habitat => (
            <motion.button
              key={habitat.id}
              onClick={() => setSelectedHabitat(habitat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1 ${
                selectedHabitat === habitat.id 
                  ? "bg-white text-gray-800" 
                  : "bg-white/20 text-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{habitat.icon}</span>
              {habitat.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Pokemon List */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-hidden">
        <div className="h-full overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {filteredPokemon.map((pokemon, index) => (
              <motion.div
                key={pokemon.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handlePokemonClick(pokemon)}
                className="flex items-center gap-4 p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {/* Pokemon Number */}
                <span className="text-sm font-bold text-gray-400 w-8">
                  #{String(pokemon.id).padStart(3, '0')}
                </span>

                {/* Pokemon Image */}
                <motion.div 
                  className="relative w-16 h-16"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="w-full h-full object-contain"
                  />
                  {capturedPokemon.includes(pokemon.id) && (
                    <Star className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500 fill-yellow-500" />
                  )}
                </motion.div>

                {/* Pokemon Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-800">{pokemon.name}</h3>
                    <span className={`text-xs ${getRarityColor(pokemon.rarity)}`}>
                      {pokemon.rarity}
                    </span>
                  </div>
                  {/* Types */}
                  <div className="flex gap-1 mt-1">
                    {pokemon.types.map(type => (
                      <span
                        key={type}
                        className="px-2 py-0.5 rounded-full text-xs text-white"
                        style={{ backgroundColor: typeColors[type] || '#888' }}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  {/* Conditions */}
                  {pokemon.conditions && (
                    <p className="text-xs text-gray-400 mt-1">
                      {pokemon.conditions.join(' • ')}
                    </p>
                  )}
                </div>

                {/* Habitat Icons */}
                <div className="flex gap-1">
                  {pokemon.habitats.slice(0, 2).map(h => {
                    const habitat = habitats.find(hab => hab.id === h);
                    return (
                      <span key={h} className="text-lg" title={habitat?.name}>
                        {habitat?.icon}
                      </span>
                    );
                  })}
                </div>

                {/* Arrow */}
                <ArrowLeft className="w-5 h-5 text-gray-300 rotate-180" />
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredPokemon.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <Search className="w-12 h-12 mb-2" />
              <p>No Pokémon found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
