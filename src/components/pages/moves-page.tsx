'use client'

import { useAppStore } from "@/lib/store";
import { moves } from "@/lib/pokemon-data";
import { ArrowLeft, Search, Zap, Lightbulb, Mountain, Wind, Droplets } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const categoryIcons: Record<string, typeof Zap> = {
  Terrain: Mountain,
  Weather: Wind,
  Light: Lightbulb,
  Travel: Droplets,
};

const categoryColors: Record<string, string> = {
  Terrain: "from-orange-400 to-orange-500",
  Weather: "from-blue-400 to-blue-500",
  Light: "from-yellow-400 to-yellow-500",
  Travel: "from-cyan-400 to-cyan-500",
};

export function MovesPage() {
  const { setCurrentPage } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(moves.map(m => m.category))];
  const filteredMoves = selectedCategory 
    ? moves.filter(m => m.category === selectedCategory)
    : moves;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-orange-500 to-orange-600">
      {/* Header */}
      <div className="pt-12 pb-3 px-4">
        <div className="flex items-center justify-between mb-3">
          <motion.button
            onClick={() => setCurrentPage("home")}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <h1 className="text-lg font-bold text-white">Moves</h1>
          <div className="w-9" />
        </div>

        <p className="text-center text-white/70 text-xs mb-2">
          Utility & world-shaping moves
        </p>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <motion.button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              !selectedCategory 
                ? "bg-white text-orange-600" 
                : "bg-white/20 text-white"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All
          </motion.button>
          {categories.map(category => {
            const Icon = categoryIcons[category] || Zap;
            return (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1 ${
                  selectedCategory === category 
                    ? "bg-white text-orange-600" 
                    : "bg-white/20 text-white"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-3.5 h-3.5" />
                {category}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Content Card */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-3 space-y-3">
            {filteredMoves.map((move, index) => {
              const Icon = categoryIcons[move.category] || Zap;
              const colorClass = categoryColors[move.category] || "from-gray-400 to-gray-500";

              return (
                <motion.div
                  key={move.id}
                  className="bg-gray-50 rounded-xl p-3 overflow-hidden"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Move Header */}
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-800">{move.name}</h3>
                        <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full text-gray-600">
                          {move.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{move.description}</p>
                    </div>
                  </div>

                  {/* World Effect */}
                  <div className="mt-3 bg-blue-50 rounded-lg p-2">
                    <p className="text-xs font-medium text-blue-800 mb-0.5">World Effect</p>
                    <p className="text-xs text-blue-600">{move.worldEffect}</p>
                  </div>

                  {/* Unlock Condition */}
                  <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Unlock: {move.unlockCondition}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
