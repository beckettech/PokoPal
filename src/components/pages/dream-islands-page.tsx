'use client'

import { useAppStore } from "@/lib/store";
import { ArrowLeft, Star, Sparkles, Info } from "lucide-react";
import { motion } from "framer-motion";

const BASE = "https://www.serebii.net/pokemonpokopia";

const DREAM_ISLANDS = [
  {
    id: "pikachu",
    name: "Pikachu Island",
    doll: { name: "Pikachu Doll", image: `${BASE}/items/pikachudoll.png`, url: `${BASE}/dreamisland/pikachudoll.shtml` },
    items: [
      { name: "Twine", image: `${BASE}/items/twine.png` },
      { name: "Seaglass Fragments", image: `${BASE}/items/seaglassfragments.png` },
      { name: "Seashell", image: `${BASE}/items/seashell.png` },
    ],
    color: "from-yellow-400 to-yellow-600",
    textColor: "text-yellow-900",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
  {
    id: "eevee",
    name: "Eevee Island",
    doll: { name: "Eevee Doll", image: `${BASE}/items/eeveedoll.png`, url: `${BASE}/dreamisland/eeveedoll.shtml` },
    items: [
      { name: "Leppa Berry", image: `${BASE}/items/leppaberry.png` },
      { name: "Vine Rope", image: `${BASE}/items/vinerope.png` },
      { name: "Glowing Mushrooms", image: `${BASE}/items/glowingmushrooms.png` },
    ],
    color: "from-amber-400 to-amber-600",
    textColor: "text-amber-900",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    id: "clefairy",
    name: "Clefairy Island",
    doll: { name: "Clefairy Doll", image: `${BASE}/items/clefairydoll.png`, url: `${BASE}/dreamisland/clefairydoll.shtml` },
    items: [
      { name: "Cave Mushrooms", image: `${BASE}/items/cavemushrooms.png` },
      { name: "Copper Ore", image: `${BASE}/items/copperore.png` },
      { name: "Limestone", image: `${BASE}/items/limestone.png` },
    ],
    color: "from-pink-400 to-pink-600",
    textColor: "text-pink-900",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
  },
  {
    id: "arcanine",
    name: "Arcanine Island",
    doll: { name: "Arcanine Doll", image: `${BASE}/items/arcaninedoll.png`, url: `${BASE}/dreamisland/arcaninedoll.shtml` },
    items: [
      { name: "Iron Ore", image: `${BASE}/items/ironore.png` },
      { name: "Gold Ore", image: `${BASE}/items/goldore.png` },
      { name: "Glowing Stone", image: `${BASE}/items/glowingstone.png` },
    ],
    color: "from-orange-400 to-orange-600",
    textColor: "text-orange-900",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  {
    id: "dragonite",
    name: "Dragonite Island",
    doll: { name: "Dragonite Doll", image: `${BASE}/items/dragonitedoll.png`, url: `${BASE}/dreamisland/dragonitedoll.shtml` },
    items: [
      { name: "Wastepaper", image: `${BASE}/items/wastepaper.png` },
      { name: "Poké Metal", image: `${BASE}/items/pokemetal.png` },
      { name: "Crystal Fragment", image: `${BASE}/items/crystalfragment.png` },
    ],
    color: "from-blue-400 to-blue-600",
    textColor: "text-blue-900",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    id: "ditto",
    name: "Ditto Island",
    doll: { name: "Ditto Doll", image: `${BASE}/items/dittodoll.png`, url: null },
    items: [
      { name: "Random Items", image: `${BASE}/items/random.png` },
    ],
    color: "from-purple-400 to-purple-600",
    textColor: "text-purple-900",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    id: "substitute",
    name: "Substitute Island",
    doll: { name: "Substitute Doll", image: `${BASE}/items/substitutedoll.png`, url: null },
    items: [
      { name: "Random Items", image: `${BASE}/items/random.png` },
    ],
    color: "from-gray-400 to-gray-600",
    textColor: "text-gray-900",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
  },
];

export function DreamIslandsPage() {
  const { setCurrentPage } = useAppStore();

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
          <div className="w-9" />
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
          {DREAM_ISLANDS.map((island, index) => (
            <motion.div
              key={island.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className={`rounded-xl border ${island.borderColor} overflow-hidden`}
            >
              {/* Island header */}
              <div className={`bg-gradient-to-r ${island.color} px-4 py-2.5 flex items-center gap-3`}>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <img
                    src={island.doll.image}
                    alt={island.doll.name}
                    className="w-10 h-10 object-contain drop-shadow"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{island.name}</h3>
                  <p className="text-white/80 text-xs">Use: {island.doll.name}</p>
                </div>
              </div>

              {/* Items needed */}
              <div className={`${island.bgColor} px-4 py-3`}>
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
            </motion.div>
          ))}
        </div>

        {/* Source note */}
        <p className="text-center text-[10px] text-gray-400 pb-4">
          Source: Serebii.net — Unofficial fan guide
        </p>
      </div>
    </div>
  );
}
