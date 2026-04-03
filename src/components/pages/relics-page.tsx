'use client'

import { useState } from "react";
import { ArrowLeft, CheckCircle, Circle } from "lucide-react";
import { useAppStore } from "@/lib/store";


// Lost Relics from Pokopia
const RELICS = [
  { id: "r1",  name: "Broken Pot",         description: "A cracked clay pot. Someone treasured this once.", location: "Withered Wastelands" },
  { id: "r2",  name: "Old Coin",            description: "A weathered coin with an unfamiliar face.", location: "Bleak Beach" },
  { id: "r3",  name: "Tattered Flag",       description: "A faded flag, its symbol long worn away.", location: "Rocky Ridges" },
  { id: "r4",  name: "Stone Tablet",        description: "Ancient writing covers this flat stone.", location: "Rocky Ridges" },
  { id: "r5",  name: "Worn Compass",        description: "The needle still spins, pointing somewhere unknown.", location: "Sparkling Skylands" },
  { id: "r6",  name: "Faded Map",           description: "A map of a place that no longer exists.", location: "Palette Town" },
  { id: "r7",  name: "Cracked Orb",         description: "A glass sphere with something dark inside.", location: "Withered Wastelands" },
  { id: "r8",  name: "Rusted Key",          description: "Heavy iron key. What does it open?", location: "Bleak Beach" },
  { id: "r9",  name: "Ancient Lure",        description: "A fishing lure carved from bone.", location: "Bleak Beach" },
  { id: "r10", name: "Torn Journal",        description: "Most pages are missing. A few words remain.", location: "Palette Town" },
  { id: "r11", name: "Mystery Cog",         description: "A mechanical gear that fits nothing nearby.", location: "Rocky Ridges" },
  { id: "r12", name: "Bone Flute",          description: "Still produces a haunting tone.", location: "Withered Wastelands" },
];

// Fossil Pokémon in Pokopia (obtainable via relics/fossils)
const FOSSILS = [
  { id: "f1",  name: "Aerodactyl",    dex: 271, image: "/pokemon/142.png",  fossilItem: "Old Amber",          method: "Restore Old Amber" },
  { id: "f2",  name: "Cranidos",      dex: 272, image: "/pokemon/408.png",  fossilItem: "Skull Fossil",        method: "Restore Skull Fossil" },
  { id: "f3",  name: "Rampardos",     dex: 273, image: "/pokemon/409.png",  fossilItem: "Skull Fossil",        method: "Evolve Cranidos" },
  { id: "f4",  name: "Shieldon",      dex: 274, image: "/pokemon/410.png",  fossilItem: "Armor Fossil",        method: "Restore Armor Fossil" },
  { id: "f5",  name: "Bastiodon",     dex: 275, image: "/pokemon/411.png",  fossilItem: "Armor Fossil",        method: "Evolve Shieldon" },
  { id: "f6",  name: "Tyrunt",        dex: 276, image: "/pokemon/696.png",  fossilItem: "Jaw Fossil",          method: "Restore Jaw Fossil" },
  { id: "f7",  name: "Tyrantrum",     dex: 277, image: "/pokemon/697.png",  fossilItem: "Jaw Fossil",          method: "Evolve Tyrunt" },
  { id: "f8",  name: "Amaura",        dex: 278, image: "/pokemon/698.png",  fossilItem: "Sail Fossil",         method: "Restore Sail Fossil" },
  { id: "f9",  name: "Aurorus",       dex: 279, image: "/pokemon/699.png",  fossilItem: "Sail Fossil",         method: "Evolve Amaura" },
];

export function RelicsPage() {
  const { setCurrentPage, foundRelics, toggleFoundRelic, foundFossils, toggleFoundFossil } = useAppStore();
  const [activeTab, setActiveTab] = useState<"relics" | "fossils">("relics");

  const relicProgress = `${foundRelics.length}/${RELICS.length}`;
  const fossilProgress = `${foundFossils.length}/${FOSSILS.length}`;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-amber-700 to-amber-800 dark:from-amber-600 dark:to-amber-700 overflow-hidden">
      {/* Header */}
      <div className="pt-safe-top pt-6 pb-2 px-4 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setCurrentPage("home")}
            className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">Items</h1>
          <div className="bg-white/20 px-3 py-1 rounded-full">
            <span className="text-white text-xs font-bold">
              {activeTab === "relics" ? relicProgress : fossilProgress}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("relics")}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === "relics"
                ? "bg-white dark:bg-gray-800 text-amber-700"
                : "bg-white/20 text-white"
            }`}
          >
            🏺 Relics ({relicProgress})
          </button>
          <button
            onClick={() => setActiveTab("fossils")}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === "fossils"
                ? "bg-white dark:bg-gray-800 text-amber-700"
                : "bg-white/20 text-white"
            }`}
          >
            🦕 Fossils ({fossilProgress})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-t-[2rem] overflow-y-auto">
        <div className="p-4 space-y-2">
          {activeTab === "relics" && (
            <>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-3">Tap a relic to mark it as found</p>
              {RELICS.map(relic => {
                const found = foundRelics.includes(relic.id);
                return (
                  <button
                    key={relic.id}
                    onClick={() => toggleFoundRelic(relic.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all active:scale-[0.98] text-left ${
                      found
                        ? "bg-amber-50 border-amber-200"
                        : "bg-gray-50 dark:bg-gray-900 border-gray-100"
                    }`}
                  >
                    <div className={`text-2xl shrink-0 ${found ? "" : "grayscale opacity-40"}`}>🏺</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${found ? "text-amber-800" : "text-gray-500"}`}>
                          {relic.name}
                        </span>
                        {found && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Found!</span>}
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{relic.description}</p>
                      <p className="text-[10px] text-blue-500 font-medium mt-0.5">{relic.location}</p>
                    </div>
                    {found
                      ? <CheckCircle className="w-5 h-5 text-amber-500 shrink-0" />
                      : <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                    }
                  </button>
                );
              })}
            </>
          )}

          {activeTab === "fossils" && (
            <>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-3">Track fossil Pokémon you've restored</p>
              {FOSSILS.map(fossil => {
                const found = foundFossils.includes(fossil.id);
                return (
                  <button
                    key={fossil.id}
                    onClick={() => toggleFoundFossil(fossil.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all active:scale-[0.98] text-left ${
                      found
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 dark:bg-gray-900 border-gray-100"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center bg-gray-100 ${!found ? "grayscale opacity-50" : ""}`}>
                      <img src={fossil.image} alt={fossil.name} className="w-10 h-10 object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${found ? "text-gray-800 dark:text-gray-100" : "text-gray-400"}`}>
                          {fossil.name}
                        </span>
                        <span className="text-[9px] text-gray-400 dark:text-gray-500 font-mono">#{String(fossil.dex).padStart(3, '0')}</span>
                        {found && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Restored!</span>}
                      </div>
                      <p className="text-[11px] text-amber-600 font-medium">{fossil.fossilItem}</p>
                      <p className="text-[10px] text-gray-400">{fossil.method}</p>
                    </div>
                    {found
                      ? <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      : <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                    }
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
