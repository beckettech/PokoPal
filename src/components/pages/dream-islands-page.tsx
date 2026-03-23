'use client'

import { useAppStore } from "@/lib/store";
import { ArrowLeft, Star, Sparkles, Info, Eye, EyeOff, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";

const BASE = "https://www.serebii.net/pokemonpokopia";

const DREAM_ISLANDS = [
  {
    id: "pikachu",
    name: "Pikachu Island",
    doll: { name: "Pikachu Doll", image: `${BASE}/items/pikachudoll.png` },
    materials: [
      { name: "Leppa Berry", image: `${BASE}/items/leppaberry.png` },
      { name: "Vine Rope", image: `${BASE}/items/vinerope.png` },
      { name: "Copper Ore", image: `${BASE}/items/copperore.png` },
      { name: "Gold Ore", image: `${BASE}/items/goldore.png` },
      { name: "Glowing Mushrooms", image: `${BASE}/items/glowingmushrooms.png` },
      { name: "Pokémetal Fragment", image: `${BASE}/items/pokemetalfragment.png` },
    ],
    rareItems: [
      { name: "Twine", image: `${BASE}/items/twine.png` },
      { name: "Seaglass Fragments", image: `${BASE}/items/seaglassfragments.png` },
      { name: "Seashell", image: `${BASE}/items/seashell.png` },
    ],
    legendaries: [
      { name: "Raikou", image: `${BASE}/pokemon/243.png`, chance: 25, tip: "Search in the 2 separate caves to look for small rooms with walls made from different materials than the surrounding area." },
    ],
    note: "First met during the Bleak Beach main story. Register it there first, then return here.",
    color: "from-yellow-400 to-yellow-600",
    textColor: "text-yellow-900",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-300",
    chipColor: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "eevee",
    name: "Eevee Island",
    doll: { name: "Eevee Doll", image: `${BASE}/items/eeveedoll.png` },
    materials: [
      { name: "Leppa Berry", image: `${BASE}/items/leppaberry.png` },
      { name: "Vine Rope", image: `${BASE}/items/vinerope.png` },
      { name: "Glowing Mushrooms", image: `${BASE}/items/glowingmushrooms.png` },
      { name: "Copper Ore", image: `${BASE}/items/copperore.png` },
      { name: "Gold Ore", image: `${BASE}/items/goldore.png` },
    ],
    rareItems: [
      { name: "Mossy Stone", image: `${BASE}/items/mossystone.png` },
      { name: "Squishy Clay", image: `${BASE}/items/squishyclay.png` },
    ],
    legendaries: [
      { name: "Suicune", image: `${BASE}/pokemon/245.png`, chance: 25, tip: "Search in the 2 separate caves to look for small rooms with walls made from different materials than the surrounding area." },
    ],
    note: "Suicune appears randomly. Collect all 3 Legendary Dogs to unlock Ho-oh's Transparent Bell recipe.",
    color: "from-amber-400 to-amber-600",
    textColor: "text-amber-900",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-300",
    chipColor: "bg-amber-100 text-amber-800",
  },
  {
    id: "clefairy",
    name: "Clefairy Island",
    doll: { name: "Clefairy Doll", image: `${BASE}/items/clefairydoll.png` },
    materials: [
      { name: "Cave Mushrooms", image: `${BASE}/items/cavemushrooms.png` },
      { name: "Copper Ore", image: `${BASE}/items/copperore.png` },
      { name: "Limestone", image: `${BASE}/items/limestone.png` },
      { name: "Stone", image: `${BASE}/items/stone.png` },
    ],
    rareItems: [
      { name: "Glowing Stone", image: `${BASE}/items/glowingstone.png` },
      { name: "Crystal Fragment", image: `${BASE}/items/crystalfragment.png` },
    ],
    legendaries: [
      { name: "Volcanion", image: `${BASE}/pokemon/721.png`, chance: 25, tip: "First encountered during the Rocky Ridges main quest. Register it there — then it may appear here." },
    ],
    note: "Complete the Rocky Ridges story quest to first register Volcanion, then visit here.",
    color: "from-pink-400 to-pink-600",
    textColor: "text-pink-900",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-300",
    chipColor: "bg-pink-100 text-pink-800",
  },
  {
    id: "arcanine",
    name: "Arcanine Island",
    doll: { name: "Arcanine Doll", image: `${BASE}/items/arcaninedoll.png` },
    materials: [
      { name: "Iron Ore", image: `${BASE}/items/ironore.png` },
      { name: "Gold Ore", image: `${BASE}/items/goldore.png` },
      { name: "Glowing Stone", image: `${BASE}/items/glowingstone.png` },
      { name: "Stone", image: `${BASE}/items/stone.png` },
    ],
    rareItems: [
      { name: "Pokémetal Fragment", image: `${BASE}/items/pokemetalfragment.png` },
      { name: "Copper Ore", image: `${BASE}/items/copperore.png` },
    ],
    legendaries: [
      { name: "Entei", image: `${BASE}/pokemon/244.png`, chance: 25, tip: "Search in the 2 separate caves to look for small rooms with walls made from different materials than the surrounding area." },
    ],
    note: "Entei appears randomly. Collect all 3 Legendary Dogs to unlock Ho-oh's Transparent Bell recipe.",
    color: "from-orange-400 to-orange-600",
    textColor: "text-orange-900",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-300",
    chipColor: "bg-orange-100 text-orange-800",
  },
  {
    id: "dragonite",
    name: "Dragonite Island",
    doll: { name: "Dragonite Doll", image: `${BASE}/items/dragonitedoll.png` },
    materials: [
      { name: "Wastepaper", image: `${BASE}/items/wastepaper.png` },
      { name: "Pokémetal Fragment", image: `${BASE}/items/pokemetalfragment.png` },
      { name: "Crystal Fragment", image: `${BASE}/items/crystalfragment.png` },
      { name: "Iron Ore", image: `${BASE}/items/ironore.png` },
    ],
    rareItems: [
      { name: "Gold Ore", image: `${BASE}/items/goldore.png` },
    ],
    legendaries: [
      { name: "Mewtwo", image: `${BASE}/pokemon/150.png`, chance: 10, tip: "Complete the 'Rebuild the huge building!' quest in Sparkling Skylands (build floors 2F→3F→4F), then meet Mewtwo on the roof to unlock this encounter." },
    ],
    note: "Sparkling Skylands main quest required first. Build the Skyland building to the rooftop.",
    color: "from-blue-400 to-blue-600",
    textColor: "text-blue-900",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
    chipColor: "bg-blue-100 text-blue-800",
  },
  {
    id: "ditto",
    name: "Ditto Island",
    doll: { name: "Ditto Doll", image: `${BASE}/items/dittodoll.png` },
    materials: [
      { name: "Random Materials", image: `${BASE}/items/random.png` },
    ],
    rareItems: [],
    legendaries: [],
    note: "Ditto Island gives random materials — contents vary each visit.",
    color: "from-purple-400 to-purple-600",
    textColor: "text-purple-900",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-300",
    chipColor: "bg-purple-100 text-purple-800",
  },
  {
    id: "substitute",
    name: "Substitute Island",
    doll: { name: "Substitute Doll", image: `${BASE}/items/substitutedoll.png` },
    materials: [
      { name: "Random Materials", image: `${BASE}/items/random.png` },
    ],
    rareItems: [],
    legendaries: [],
    note: "Substitute Island gives random materials — contents vary each visit.",
    color: "from-gray-400 to-gray-600",
    textColor: "text-gray-900",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-300",
    chipColor: "bg-gray-100 text-gray-700",
  },
];

export function DreamIslandsPage() {
  const { setCurrentPage, visitedIslands, toggleVisitedIsland } = useAppStore();
  const [expandedIsland, setExpandedIsland] = useState<string | null>(null);
  const [sortFilter, setSortFilter] = useState<"all" | "visited" | "unvisited">("all");

  // Convert array to Set for quick lookup
  const visitedSet = useMemo(() => new Set(visitedIslands), [visitedIslands]);

  const toggleExpand = (id: string) => {
    setExpandedIsland(prev => prev === id ? null : id);
  };

  const filteredIslands = DREAM_ISLANDS.filter(island => {
    const visited = visitedSet.has(island.id);
    if (sortFilter === "visited") return visited;
    if (sortFilter === "unvisited") return !visited;
    return true;
  });

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-purple-600 via-purple-500 to-indigo-500 overflow-hidden">
      {/* Header */}
      <div className="pt-6 pb-2 px-4 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <motion.button
            onClick={() => setCurrentPage("home")}
            className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </motion.button>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Dream Islands
          </h1>
          <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
            <span className="text-white text-xs font-bold">{visitedSet.size}/{DREAM_ISLANDS.length}</span>
          </div>
        </div>
        {/* Filter pills */}
        <div className="flex gap-1.5 pb-1">
          {(["all", "visited", "unvisited"] as const).map(f => (
            <motion.button
              key={f}
              onClick={() => setSortFilter(f)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap flex items-center gap-1 transition-all ${
                sortFilter === f ? "bg-white text-purple-700 shadow" : "bg-white/20 text-white"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {f === "all" && "All"}
              {f === "visited" && <><Eye className="w-3 h-3" />Visited</>}
              {f === "unvisited" && <><EyeOff className="w-3 h-3" />Unvisited</>}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-y-auto">
        {/* Intro */}
        <div className="mx-3 mt-3 mb-2 p-3 bg-purple-50 border border-purple-200 rounded-xl">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
            <p className="text-xs text-purple-700">
              <b>Befriend Drifloon</b> to unlock Dream Islands. Visit once per day for materials & rare finds. Resets daily — don't leave items behind!
            </p>
          </div>
        </div>

        {/* Island list */}
        <div className="px-3 pb-4 space-y-2">
          {filteredIslands.map((island, index) => {
            const visited = visitedSet.has(island.id);
            const expanded = expandedIsland === island.id;

            return (
              <motion.div
                key={island.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl border overflow-hidden bg-white ${visited ? island.borderColor : 'border-gray-100'}`}
              >
                {/* Row — always visible */}
                <div className="flex items-center gap-3 p-3">
                  {/* Doll image — tap to expand */}
                  <button
                    onClick={() => toggleExpand(island.id)}
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${island.color} flex items-center justify-center shrink-0`}
                  >
                    <img
                      src={island.doll.image}
                      alt={island.doll.name}
                      className="w-11 h-11 object-contain drop-shadow"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </button>

                  <button className="flex-1 text-left min-w-0" onClick={() => toggleExpand(island.id)}>
                    <h3 className="font-bold text-gray-800 text-sm">{island.name}</h3>
                    <p className="text-gray-400 text-xs">Use: {island.doll.name}</p>
                    {/* Legendary previews in list */}
                    {island.legendaries.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                        <div className="flex gap-1">
                          {island.legendaries.map(leg => (
                            <img
                              key={leg.name}
                              src={leg.image}
                              alt={leg.name}
                              className="w-6 h-6 object-contain"
                              title={leg.name}
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          ))}
                          <span className="text-[10px] text-amber-600 font-semibold self-center">
                            {island.legendaries.map(l => `${l.name} (~${l.chance}%)`).join(", ")}
                          </span>
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Mark visited — dex friend button style */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleVisitedIsland(island.id); }}
                    className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center active:scale-90 transition-transform ${
                      visited
                        ? 'bg-yellow-400 text-yellow-900'
                        : 'bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300'
                    }`}
                  >
                    {visited ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className={`${island.bgColor} border-t border-gray-100 px-4 py-3 space-y-3`}>

                        {/* Note */}
                        {island.note && (
                          <p className="text-xs text-gray-500 italic">{island.note}</p>
                        )}

                        {/* Legendary encounters */}
                        {island.legendaries.length > 0 && (
                          <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wide mb-2 flex items-center gap-1 ${island.textColor} opacity-70`}>
                              <Star className="w-3 h-3 text-amber-500" /> Legendary Encounter
                            </p>
                            <div className="space-y-2">
                              {island.legendaries.map(leg => (
                                <div key={leg.name} className="flex items-start gap-3">
                                  <div className="shrink-0 flex flex-col items-center gap-1">
                                    <div className="w-16 h-16 bg-white rounded-xl border-2 border-amber-200 shadow flex items-center justify-center">
                                      <img src={leg.image} alt={leg.name} className="w-14 h-14 object-contain"
                                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                    </div>
                                    <span className={`text-[9px] font-bold ${island.textColor}`}>{leg.name}</span>
                                    <span className="text-[8px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">~{leg.chance}%</span>
                                  </div>
                                  {(leg as any).tip && (
                                    <div className="flex-1 bg-white/60 rounded-xl p-2.5 border border-amber-100">
                                      <p className="text-[10px] text-amber-800 leading-relaxed">💡 {(leg as any).tip}</p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Materials found here */}
                        <div>
                          <p className={`text-[10px] font-bold uppercase tracking-wide mb-2 ${island.textColor} opacity-70`}>
                            Materials Found Here
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {island.materials.map(item => (
                              <div key={item.name} className="flex flex-col items-center gap-1">
                                <div className="w-11 h-11 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-center">
                                  <img src={item.image} alt={item.name} className="w-9 h-9 object-contain"
                                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                </div>
                                <span className={`text-[8px] text-center max-w-[44px] leading-tight ${island.textColor} opacity-80`}>{item.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Rare items */}
                        {island.rareItems.length > 0 && (
                          <div>
                            <p className={`text-[10px] font-bold uppercase tracking-wide mb-2 ${island.textColor} opacity-70`}>
                              ✨ Rare Finds
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              {island.rareItems.map(item => (
                                <div key={item.name} className="flex flex-col items-center gap-1">
                                  <div className="w-11 h-11 bg-white rounded-lg border-2 border-amber-200 shadow-sm flex items-center justify-center">
                                    <img src={item.image} alt={item.name} className="w-9 h-9 object-contain"
                                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                  </div>
                                  <span className={`text-[8px] text-center max-w-[44px] leading-tight ${island.textColor} opacity-80`}>{item.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-[10px] text-gray-400 pb-4">
          Tap an island to see details · Mark as visited to track progress
        </p>
      </div>
    </div>
  );
}
