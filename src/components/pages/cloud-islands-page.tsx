'use client'

import { useAppStore } from "@/lib/store";
import { cloudIslandsPosts } from "@/lib/pokemon-data";
import { ArrowLeft, Copy, Check, Eye, Globe, Key, Info, BadgeCheck, MapPin, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function CloudIslandsPage() {
  const { setCurrentPage } = useAppStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [visitedIslands, setVisitedIslands] = useState<string[]>([]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleVisited = (code: string) => {
    setVisitedIslands(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const devIslands = cloudIslandsPosts.filter(p => p.isOfficial);
  const visitedCount = visitedIslands.length;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-cyan-500 to-blue-600">
      {/* Header */}
      <div className="pt-6 pb-3 px-4 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setCurrentPage("home")}
            className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">Cloud Islands</h1>
          <div className="w-11" />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{visitedCount}</p>
            <p className="text-[10px] text-white/70">Visited</p>
          </div>
          <div className="w-px h-8 bg-white/30" />
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{devIslands.length - visitedCount}</p>
            <p className="text-[10px] text-white/70">Unvisited</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* How to Visit Guide */}
          <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                <Info className="w-4 h-4 text-cyan-600" />
              </div>
              <h3 className="font-bold text-cyan-900">How to Visit</h3>
            </div>
            <ol className="space-y-2 text-xs text-cyan-800">
              <li className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-200 text-cyan-700 flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                <span>Buy <strong>Mysterious Goggles</strong> from PC Shop (unlocks at Environment Level 3)</span>
              </li>
              <li className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-200 text-cyan-700 flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                <span>Use Goggles from Inventory to view other players' islands</span>
              </li>
              <li className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-200 text-cyan-700 flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                <span>Enter the island code you want to visit</span>
              </li>
            </ol>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-amber-700 bg-amber-50 rounded-lg px-2.5 py-1.5">
              <Key className="w-3.5 h-3.5" />
              <span>Requires Nintendo Switch Online subscription</span>
            </div>
          </div>

          {/* Developer Islands */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BadgeCheck className="w-4 h-4 text-amber-500" />
              <h2 className="font-bold text-gray-800">Developer Islands</h2>
            </div>

            <div className="space-y-3">
              {devIslands.map((island, index) => {
                const isVisited = visitedIslands.includes(island.islandCode);
                return (
                  <motion.div
                    key={island.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`rounded-2xl border p-4 transition-all ${
                      isVisited ? "bg-green-50 border-green-200" : "bg-white border-gray-100 shadow-sm"
                    }`}
                  >
                    {/* Top row */}
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isVisited ? "bg-green-100" : "bg-gradient-to-br from-amber-400 to-orange-500"
                      }`}>
                        <MapPin className={`w-6 h-6 ${isVisited ? "text-green-500" : "text-white"}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-sm ${isVisited ? "text-gray-500" : "text-gray-800"}`}>
                          {island.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{island.description}</p>
                      </div>

                      {/* Visited button */}
                      <button
                        onClick={() => toggleVisited(island.islandCode)}
                        className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-all ${
                          isVisited ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Code row */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <code className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-mono text-gray-700">
                          {island.islandCode}
                        </code>
                        <button
                          onClick={() => handleCopy(island.islandCode)}
                          className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center active:scale-90 transition-transform"
                        >
                          {copiedCode === island.islandCode ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                      <span className="text-[10px] text-gray-400">by {island.author}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <h3 className="font-bold text-purple-900 text-sm">Tips</h3>
            </div>
            <ul className="space-y-1.5 text-xs text-purple-800">
              <li>• Take <strong>Reference Photos</strong> of furniture to 3D print at your own Pokémon Center</li>
              <li>• Dev islands have rare habitats like <strong>Plusle & Minun</strong> for your Habitat Dex</li>
              <li>• Look for unique items: Pokémon statues, fountains, the Ditto bathtub</li>
              <li>• Your items from main story don't carry over — it's a fresh start</li>
            </ul>
          </div>

          {/* What is Cloud Island */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
            <h3 className="font-bold text-gray-800 text-sm mb-2">What are Cloud Islands?</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Cloud Islands are online sandbox maps where you can sculpt your own island from scratch.
              All materials from every biome are available, and any Pokémon can be summoned.
              Items stay on the island even after friends visit. Your Pokédex and recipes carry over.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
