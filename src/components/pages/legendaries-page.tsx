'use client'

import { useAppStore } from "@/lib/store";
import { ArrowLeft, Star, MapPin, Hammer, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

// Legendary Pokemon data with how to find them
const LEGENDARIES = [
  {
    name: "Articuno",
    slug: "articuno",
    image: "/pokemon-original/144.png",
    types: ["Ice", "Flying"],
    habitat: "Freezing Chambers",
    obtainMethod: "Build the Freezing Chambers in Palette Town. Get the kit from the eastern island (Yellow Poké Ball on a plinth). Materials: Stone x50, Ice x50, Crystal Fragments x10, Pokémetal x10. Requires Build and Water specialty Pokémon. Articuno appears inside once built.",
    canHouse: true,
  },
  {
    name: "Zapdos",
    slug: "zapdos",
    image: "/pokemon-original/145.png",
    types: ["Electric", "Flying"],
    habitat: "Abandoned Power Plant",
    obtainMethod: "Build the Abandoned Power Plant in Palette Town. Get the kit from the southern island mountain top (Yellow Poké Ball on a plinth). Materials: Copper Ingots x50, Iron Ingots x50, Sealass Fragments x50, Bricks x50, Pokémetal x10. Requires Build, Crush, Fly, and Generate specialty Pokémon. Zapdos appears inside once built.",
    canHouse: true,
  },
  {
    name: "Moltres",
    slug: "moltres",
    image: "/pokemon-original/146.png",
    types: ["Fire", "Flying"],
    habitat: "Altar of Flame",
    obtainMethod: "Build the Altar of Flame in Palette Town. Get the kit from the northwestern island (Yellow Poké Ball on a plinth). Materials: Copper Ingots x50, Gold Ingots x50, Lava Rocks x50, Pokémetal x10. Requires Build specialty Pokémon. Moltres appears inside once built.",
    canHouse: true,
  },
  {
    name: "Lugia",
    slug: "lugia",
    image: "/pokemon-original/249.png",
    types: ["Psychic", "Flying"],
    habitat: null,
    obtainMethod: "Befriend Articuno, Zapdos, and Moltres first. This unlocks Tidal Bell recipe. Craft it with 5 Silver Feathers (dropped by Lugia flying overhead - use Cut to pick up) and 5 Rare Pokémetal. Ring the bell when Lugia flies overhead.",
    canHouse: false,
    prerequisite: "Articuno, Zapdos, Moltres",
  },
  {
    name: "Ho-Oh",
    slug: "ho-oh",
    image: "/pokemon-original/250.png",
    types: ["Fire", "Flying"],
    habitat: null,
    obtainMethod: "Befriend Raikou, Entei, and Suicune first. This unlocks Clear Bell recipe. Craft it with 5 Rainbow Feathers (dropped by Ho-Oh flying overhead - use Water Gun to pick up) and 5 Rare Pokémetal. Ring the bell when Ho-Oh flies overhead.",
    canHouse: false,
    prerequisite: "Raikou, Entei, Suicune",
  },
  {
    name: "Mewtwo",
    slug: "mewtwo",
    image: "/pokemon-original/150.png",
    types: ["Psychic"],
    habitat: null,
    obtainMethod: "Found in Sparkling Skylands. Complete Tinkatuff's storyline and restore the Skyland Building (one floor per day). First encounter adds to Pokédex. To befriend: find on a Dragonite Dream Island behind breakable walls.",
    canHouse: false,
  },
  {
    name: "Mew",
    slug: "mew",
    image: "/pokemon-original/151.png",
    types: ["Psychic"],
    habitat: null,
    obtainMethod: "Collect 27 Mysterious Slates (shiny ground spots, use Search specialty + Dowsing Machine). Find the Unown Mural in Withered Wastelands (break rocky wall right of path near Horsea Fountain, then left through another wall). Match slate symbols to mural slots. Mew appears from portal.",
    canHouse: false,
  },
  {
    name: "Raikou",
    slug: "raikou",
    image: "/pokemon-original/243.png",
    types: ["Electric"],
    habitat: "Tall Grass",
    obtainMethod: "Found on Ocean Dream Island (use Pikachu Doll). Check Pokédex filters to confirm presence (look for '?' entry). Break steel blocks in central caves to reach.",
    canHouse: true,
    dreamIsland: "Ocean Dream Island",
  },
  {
    name: "Entei",
    slug: "entei",
    image: "/pokemon-original/244.png",
    types: ["Fire"],
    habitat: "Tall Grass",
    obtainMethod: "Found on Volcanic Dream Island (use Arcanine Doll). Check Pokédex filters to confirm presence (look for '?' entry). Break Lava Blocks in central mountain caves to reach.",
    canHouse: true,
    dreamIsland: "Volcanic Dream Island",
  },
  {
    name: "Suicune",
    slug: "suicune",
    image: "/pokemon-original/245.png",
    types: ["Water"],
    habitat: "Tall Grass",
    obtainMethod: "Found on Wasteland Dream Island (use Eevee Doll). Check Pokédex filters to confirm presence (look for '?' entry). Break Ice blocks in central rocky caves to reach.",
    canHouse: true,
    dreamIsland: "Wasteland Dream Island",
  },
];

export function LegendariesPage() {
  const { setCurrentPage, navigateToHabitat } = useAppStore();
  const { discoveredHabitats = [] } = useAppStore() as any;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-purple-600 to-indigo-800">
      {/* Header */}
      <div className="pt-6 pb-3 px-4 shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setCurrentPage("home")}
            className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Legendaries
            </h1>
            <p className="text-xs text-white/70">How to find them all</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Info banner */}
          <div className="bg-purple-50 rounded-xl p-3 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <p className="text-xs text-purple-800">
              Legendaries require special methods to find and befriend. Some can be housed in habitats, others cannot.
            </p>
          </div>

          {/* Legendary cards */}
          {LEGENDARIES.map((legendary, index) => (
            <motion.div
              key={legendary.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-50 rounded-xl overflow-hidden"
            >
              {/* Header with image */}
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-100 to-indigo-100">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Image
                    src={legendary.image}
                    alt={legendary.name}
                    width={56}
                    height={56}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{legendary.name}</h3>
                  <div className="flex gap-1 mt-1">
                    {legendary.types.map(type => (
                      <span
                        key={type}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-purple-200 text-purple-800"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  {legendary.habitat && (
                    <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {legendary.habitat}
                    </p>
                  )}
                </div>
                {legendary.canHouse ? (
                  <span className="text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-700">
                    Can House
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-1 rounded-full bg-gray-200 text-gray-600">
                    No Habitat
                  </span>
                )}
              </div>

              {/* Prerequisites */}
              {legendary.prerequisite && (
                <div className="px-3 py-2 bg-yellow-50 border-t border-yellow-100">
                  <p className="text-xs text-yellow-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Requires: <strong>{legendary.prerequisite}</strong>
                  </p>
                </div>
              )}

              {/* Dream Island */}
              {legendary.dreamIsland && (
                <div className="px-3 py-2 bg-blue-50 border-t border-blue-100">
                  <p className="text-xs text-blue-800 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Found on: <strong>{legendary.dreamIsland}</strong>
                  </p>
                </div>
              )}

              {/* How to find */}
              <div className="p-3 border-t border-gray-100">
                <div className="flex items-start gap-2">
                  <Hammer className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {legendary.obtainMethod}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Bottom padding */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}
