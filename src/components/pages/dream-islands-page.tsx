'use client'

import { useAppStore } from "@/lib/store";
import { ArrowLeft, Star, Sparkles, Info, CheckCircle, Circle, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const BASE = "https://www.serebii.net/pokemonpokopia";

const DREAM_ISLANDS = [
  {
    id: "ocean",
    name: "Ocean Dream Island",
    doll: { name: "Pikachu Doll", image: `${BASE}/items/pikachudoll.png` },
    items: [
      { name: "Twine", image: `${BASE}/items/twine.png` },
      { name: "Sea Glass Fragments", image: `${BASE}/items/seaglassfragments.png` },
      { name: "Seashell", image: `${BASE}/items/seashell.png` },
    ],
    legendaries: [
      { name: "Raikou", image: `${BASE}/pokemon/243.png`, note: "After Bleak Beach story encounter" },
    ],
    color: "from-yellow-400 to-yellow-600",
    textColor: "text-yellow-900",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
  {
    id: "wasteland",
    name: "Wasteland Dream Island",
    doll: { name: "Eevee Doll", image: `${BASE}/items/eeveedoll.png` },
    items: [
      { name: "Leppa Berry", image: `${BASE}/items/leppaberry.png` },
      { name: "Vine Rope", image: `${BASE}/items/vinerope.png` },
      { name: "Glowing Mushrooms", image: `${BASE}/items/glowingmushrooms.png` },
    ],
    legendaries: [
      { name: "Suicune", image: `${BASE}/pokemon/245.png`, note: "Random encounter" },
    ],
    color: "from-amber-400 to-amber-600",
    textColor: "text-amber-900",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    id: "rockpeak",
    name: "Rock Peak Dream Island",
    doll: { name: "Clefairy Doll", image: `${BASE}/items/clefairydoll.png` },
    items: [
      { name: "Cave Mushrooms", image: `${BASE}/items/cavemushrooms.png` },
      { name: "Copper Ore", image: `${BASE}/items/copperore.png` },
      { name: "Limestone", image: `${BASE}/items/limestone.png` },
    ],
    legendaries: [
      { name: "Volcanion", image: `${BASE}/pokemon/721.png`, note: "After Rocky Ridges story encounter" },
    ],
    color: "from-pink-400 to-pink-600",
    textColor: "text-pink-900",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
  },
  {
    id: "volcanic",
    name: "Volcanic Dream Island",
    doll: { name: "Arcanine Doll", image: `${BASE}/items/arcaninedoll.png` },
    items: [
      { name: "Iron Ore", image: `${BASE}/items/ironore.png` },
      { name: "Gold Ore", image: `${BASE}/items/goldore.png` },
      { name: "Glowing Stone", image: `${BASE}/items/glowingstone.png` },
    ],
    legendaries: [
      { name: "Entei", image: `${BASE}/pokemon/244.png`, note: "Random encounter" },
    ],
    color: "from-orange-400 to-orange-600",
    textColor: "text-orange-900",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  {
    id: "sky",
    name: "Sky Dream Island",
    doll: { name: "Dragonite Doll", image: `${BASE}/items/dragonitedoll.png` },
    items: [
      { name: "Wastepaper", image: `${BASE}/items/wastepaper.png` },
      { name: "Pokemetal", image: `${BASE}/items/pokemetal.png` },
      { name: "Crystal Fragment", image: `${BASE}/items/crystalfragment.png` },
    ],
    legendaries: [
      { name: "Mewtwo", image: `${BASE}/pokemon/150.png`, note: "After Sparkling Skylands story encounter" },
    ],
    color: "from-blue-400 to-blue-600",
    textColor: "text-blue-900",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    id: "ditto",
    name: "Random Island (Ditto)",
    doll: { name: "Ditto Doll", image: `${BASE}/items/dittodoll.png` },
    items: [
      { name: "Depends on Island", image: `${BASE}/items/random.png` },
    ],
    legendaries: [],
    note: "Takes you to a random Dream Island",
    color: "from-purple-400 to-purple-600",
    textColor: "text-purple-900",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    id: "substitute",
    name: "Random Island (Substitute)",
    doll: { name: "Substitute Doll", image: `${BASE}/items/substitutedoll.png` },
    items: [
      { name: "Depends on Island", image: `${BASE}/items/random.png` },
    ],
    legendaries: [],
    note: "Takes you to a random Dream Island",
    color: "from-gray-400 to-gray-600",
    textColor: "text-gray-900",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
  },
];

export function DreamIslandsPage() {
  const { setCurrentPage } = useAppStore();
  const [visitedIslands, setVisitedIslands] = useState<Set<string>>(new Set());
  const [expandedIsland, setExpandedIsland] = useState<string | null>(null);
  const [sortFilter, setSortFilter] = useState<"all" | "visited" | "unvisited">("all");

  const toggleVisited = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setVisitedIslands(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedIsland(prev => prev === id ? null : id);
  };

  const filteredIslands = DREAM_ISLANDS.filter(island => {
    const visited = visitedIslands.has(island.id);
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
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Dream Islands
          </h1>
          <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
            <span className="text-white text-xs font-bold">{visitedIslands.size}/{DREAM_ISLANDS.length}</span>
          </div>
        </div>
        {/* Sort filter */}
        <div className="flex gap-1.5 pb-1">
          {(["all", "visited", "unvisited"] as const).map(f => (
            <motion.button
              key={f}
              onClick={() => setSortFilter(f)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                sortFilter === f
                  ? "bg-white text-purple-700 shadow"
                  : "bg-white/20 text-white"
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
        {/* Intro info box */}
        <div className="m-3 p-3 bg-purple-50 border border-purple-200 rounded-xl">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
            <div className="text-xs text-purple-700 space-y-1">
              <p><b>Befriend Drifloon</b> to unlock Dream Islands. Visit once per day for rare items & ore.</p>
              <p>Each island resets daily — don't leave items behind!</p>
              <p className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500" />
                <span>Chance to meet Raikou, Entei, Suicune, or Mewtwo.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Island list */}
        <div className="px-3 pb-4 space-y-3">
          {filteredIslands.map((island, index) => {
            const visited = visitedIslands.has(island.id);
            const expanded = expandedIsland === island.id;
            return (
              <motion.div
                key={island.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl border overflow-hidden ${visited ? island.borderColor : 'border-gray-100'}`}
              >
                {/* Island header */}
                <div className="flex items-center gap-3 p-3 bg-white">
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
                    <p className="text-gray-500 text-xs">Use: {island.doll.name}</p>
                  </button>

                  {/* Mark visited — same style as habitat mark */}
                  <button
                    onClick={(e) => toggleVisited(island.id, e)}
                    className={`shrink-0 flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl border text-[10px] font-bold transition-all active:scale-95 ${
                      visited
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-white border-gray-200 text-gray-400'
                    }`}
                  >
                    {visited
                      ? <CheckCircle className="w-4 h-4" />
                      : <Circle className="w-4 h-4" />
                    }
                    {visited ? 'Visited' : 'Mark'}
                  </button>
                </div>

                {/* Expanded content */}
                {expanded && (
                  <div className={`${island.bgColor}`}>
                    {/* Items needed */}
                    <div className="px-4 pt-3 pb-2">
                      <p className={`text-[10px] font-semibold uppercase tracking-wide ${island.textColor} opacity-60 mb-2`}>
                        Items to Bring
                      </p>
                      <div className="flex gap-3 flex-wrap">
                        {island.items.map(item => (
                          <div key={item.name} className="flex flex-col items-center gap-1">
                            <div className="w-12 h-12 bg-white rounded-lg border border-white shadow flex items-center justify-center">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 object-contain"
                                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            </div>
                            <span className={`text-[9px] text-center ${island.textColor} opacity-80 font-medium max-w-[48px] leading-tight`}>
                              {item.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Legendaries */}
                    {island.legendaries.length > 0 && (
                      <div className="px-4 pt-2 pb-3 border-t border-black/5">
                        <p className={`text-[10px] font-semibold uppercase tracking-wide ${island.textColor} opacity-60 mb-2 flex items-center gap-1`}>
                          <Star className="w-3 h-3 text-amber-500" /> Legendary Encounters
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {island.legendaries.map(leg => (
                            <div key={leg.name} className="flex flex-col items-center gap-1">
                              <div className="w-14 h-14 bg-white rounded-xl border-2 border-amber-200 shadow flex items-center justify-center relative">
                                <img
                                  src={leg.image}
                                  alt={leg.name}
                                  className="w-12 h-12 object-contain"
                                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                  {leg.chance}%
                                </span>
                              </div>
                              <span className={`text-[9px] text-center ${island.textColor} opacity-80 font-medium mt-1 max-w-[56px] leading-tight`}>
                                {leg.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
