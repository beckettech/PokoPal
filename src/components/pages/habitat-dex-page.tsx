'use client'

import { useAppStore } from "@/lib/store";
import { detailedHabitatList, pokemonList } from "@/lib/pokemon-data";
import { ArrowLeft, Search, HelpCircle, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function HabitatDexPage() {
  const { setCurrentPage } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHabitat, setSelectedHabitat] = useState<typeof detailedHabitatList[0] | null>(null);

  const filteredHabitats = detailedHabitatList.filter(habitat =>
    habitat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getResidentsForHabitat = (habitatName: string) => {
    // Find Pokemon that have this habitat in their habitats array
    return pokemonList.filter(p => 
      p.habitats.some(h => h.toLowerCase().includes(habitatName.toLowerCase()))
    );
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-green-500 to-green-600">
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
          <h1 className="text-lg font-bold text-white">Habitat Dex</h1>
          <div className="w-9" />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search habitats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white shadow-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
          />
        </div>
      </div>

      {/* Content Card */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-hidden">
        <div className="h-full overflow-y-auto">
          {/* Habitat List */}
          <div className="p-3 space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredHabitats.map((habitat, index) => (
                <motion.div
                  key={habitat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedHabitat(habitat)}
                  className="bg-gray-50 rounded-xl p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">#{String(habitat.id).padStart(3, '0')}</span>
                        <h3 className="font-bold text-gray-800 text-sm">{habitat.name}</h3>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                        {habitat.category}
                      </span>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>

                  {/* Build Items */}
                  <div className="mb-2">
                    <p className="text-[10px] text-gray-500 mb-1">Build Items:</p>
                    <div className="flex flex-wrap gap-1">
                      {habitat.buildItems.map((item, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Residents */}
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-gray-500">
                      {habitat.residents.length} residents
                    </p>
                    <div className="flex -space-x-2">
                      {habitat.residents.slice(0, 3).map((name, i) => (
                        <div 
                          key={i}
                          className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-500 border-2 border-white flex items-center justify-center text-[8px] text-white font-bold"
                        >
                          {name[0]}
                        </div>
                      ))}
                      {habitat.residents.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-[8px] text-gray-600 font-bold">
                          +{habitat.residents.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Partial Data Warning */}
                  {habitat.residents.some(r => r === "???") && (
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-orange-600 bg-orange-50 rounded-lg px-2 py-1">
                      <HelpCircle className="w-3 h-3" />
                      <span>Some data still being discovered</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredHabitats.length === 0 && (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <Search className="w-12 h-12 mb-2" />
                <p className="text-sm">No habitats found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Habitat Detail Modal */}
      <AnimatePresence>
        {selectedHabitat && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl overflow-hidden z-20"
            style={{ maxHeight: '75%' }}
          >
            <div className="p-4 overflow-y-auto max-h-full">
              {/* Handle */}
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
              
              {/* Image Slot */}
              <div className="w-full h-32 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                <div className="text-center text-gray-400">
                  <ImageIcon className="w-10 h-10 mx-auto mb-1" />
                  <p className="text-xs">In-game screenshot slot</p>
                </div>
              </div>

              {/* Header */}
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">#{String(selectedHabitat.id).padStart(3, '0')}</span>
                  <h2 className="text-xl font-bold text-gray-800">{selectedHabitat.name}</h2>
                </div>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  {selectedHabitat.category}
                </span>
              </div>

              {/* Build Conditions */}
              <div className="mb-4">
                <h3 className="font-bold text-gray-700 text-sm mb-2">Build Conditions</h3>
                <div className="flex flex-wrap gap-1">
                  {selectedHabitat.buildConditions.map((cond, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                      {cond}
                    </span>
                  ))}
                </div>
              </div>

              {/* Build Items */}
              <div className="mb-4">
                <h3 className="font-bold text-gray-700 text-sm mb-2">Items Required</h3>
                <div className="flex flex-wrap gap-1">
                  {selectedHabitat.buildItems.map((item, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Residents */}
              <div className="mb-4">
                <h3 className="font-bold text-gray-700 text-sm mb-2">Residents Attracted</h3>
                <div className="grid grid-cols-3 gap-2">
                  {selectedHabitat.residents.map((name, i) => (
                    <div 
                      key={i}
                      className={`p-2 rounded-lg text-center text-xs ${
                        name === '???' 
                          ? 'bg-gray-100 text-gray-400' 
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedHabitat.notes && (
                <div className="mb-4">
                  <h3 className="font-bold text-gray-700 text-sm mb-2">Notes</h3>
                  <p className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2">
                    {selectedHabitat.notes}
                  </p>
                </div>
              )}

              {/* Close Button */}
              <motion.button
                onClick={() => setSelectedHabitat(null)}
                className="w-full py-3 rounded-xl bg-green-500 text-white font-medium"
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
