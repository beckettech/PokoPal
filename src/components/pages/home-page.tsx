'use client'

// Pokopia Guide - Main Home Page
import { useAppStore } from "@/lib/store";
import { 
  TreePine, 
  Map, 
  ClipboardList, 
  Cloud, 
  Star, 
  Package, 
  Gift, 
  MessageCircle,
  Coins
} from "lucide-react";

// Pokedex/Calculator icon for Dex
const PokedexIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8" cy="8" r="2" fill="currentColor" />
    <line x1="14" y1="7" x2="18" y2="7" />
    <line x1="14" y1="10" x2="18" y2="10" />
    <rect x="6" y="14" width="12" height="4" rx="1" />
  </svg>
);

const menuItems = [
  { 
    id: "dex", 
    icon: PokedexIcon, 
    label: "Dex",
    color: "bg-gradient-to-br from-red-500 to-red-600",
    shadowColor: "shadow-red-500/30",
    hasNotification: false 
  },
  { 
    id: "habitat-dex", 
    icon: TreePine, 
    label: "Habitat Dex",
    color: "bg-gradient-to-br from-green-400 to-green-500",
    shadowColor: "shadow-green-500/30",
    hasNotification: true 
  },
  { 
    id: "map", 
    icon: Map, 
    label: "Map",
    color: "bg-gradient-to-br from-blue-400 to-blue-500",
    shadowColor: "shadow-blue-500/30",
    hasNotification: false 
  },
  { 
    id: "requests", 
    icon: ClipboardList, 
    label: "Requests",
    color: "bg-gradient-to-br from-yellow-400 to-yellow-500",
    shadowColor: "shadow-yellow-500/30",
    hasNotification: true 
  },
  { 
    id: "cloud-islands", 
    icon: Cloud, 
    label: "Cloud Islands",
    color: "bg-gradient-to-br from-cyan-400 to-cyan-500",
    shadowColor: "shadow-cyan-500/30",
    hasNotification: false 
  },
  { 
    id: "dream-islands", 
    icon: Star, 
    label: "Dream Islands",
    color: "bg-gradient-to-br from-purple-400 to-purple-500",
    shadowColor: "shadow-purple-500/30",
    hasNotification: false 
  },
  { 
    id: "items", 
    icon: Package, 
    label: "Items",
    color: "bg-gradient-to-br from-orange-400 to-orange-500",
    shadowColor: "shadow-orange-500/30",
    hasNotification: false 
  },
  { 
    id: "mystery-gifts", 
    icon: Gift, 
    label: "Mystery Gifts",
    color: "bg-gradient-to-br from-pink-400 to-pink-500",
    shadowColor: "shadow-pink-500/30",
    hasNotification: true 
  },
];

const TOTAL_POKEMON = 300;
const TOTAL_HABITATS = 209; // total habitat dex entries
const TOTAL_ITEMS = 1511; // from scraped items.json
const TOTAL_LOCATIONS = 6;
const TOTAL = TOTAL_POKEMON + TOTAL_HABITATS + TOTAL_ITEMS + TOTAL_LOCATIONS;

export function HomePage() {
  const { setCurrentPage, coins, capturedPokemon, discoveredHabitats, ownedItems, visitedLocations } = useAppStore();

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-red-500 via-red-600 to-red-700">
      {/* Header Section */}
      <div className="pt-6 pb-2 px-4">
        {/* Top Row - Blue Button, Circles, and Coins */}
        <div className="flex items-start justify-between">
          {/* Left Side: Large Blue Button + Circles */}
          <div className="flex items-center gap-3">
            {/* Large Blue Indicator Button */}
            <button
              className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center border-4 border-white/50 bg-gradient-to-br from-sky-400 to-sky-500 active:scale-90 transition-transform"
            >
              <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white/60" />
              </div>
            </button>
            
            {/* Three Small Colored Circles */}
            <div className="flex gap-2">
              <div className="w-4 h-4 rounded-full bg-pink-400 shadow-md" />
              <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-md" />
              <div className="w-4 h-4 rounded-full bg-green-400 shadow-md" />
            </div>
          </div>
          
          {/* Right Side: Coins Display */}
          <button
            onClick={() => setCurrentPage("coin-shop")}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 px-3 py-1.5 rounded-full shadow-lg active:scale-95 transition-transform"
          >
            <Coins className="w-4 h-4 text-yellow-900" />
            <span className="font-bold text-yellow-900 text-sm">{coins}</span>
          </button>
        </div>
      </div>

      {/* Main Content Card - Apps fill space */}
      <div className="flex-1 bg-white rounded-t-[2rem] shadow-2xl overflow-hidden flex flex-col">
        {/* Grid Menu - 2x4 Grid - Square apps Filling Space */}
        <div className="flex-1 p-3 flex flex-col">
          <div className="grid grid-cols-2 gap-2 flex-1 auto-rows-fr">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id as any)}
                className={`relative rounded-xl ${item.color} ${item.shadowColor} shadow-lg flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform`}
              >
                {item.hasNotification && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
                <item.icon className="w-10 h-10 text-white drop-shadow-md" />
                <span className="text-xs font-semibold text-white/95">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Red Bottom Tab with Stats and Chat Button */}
      <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-500 pb-2">
        {/* Stats Row */}
        <div className="h-20 flex items-center relative">
          {/* Left stats — evenly spaced from left edge to center */}
          <div className="flex flex-1 justify-around pr-14">
            <button onClick={() => setCurrentPage("dex")} className="text-center active:scale-95 transition-transform">
              <p className="text-xl font-bold text-white">{capturedPokemon.length}</p>
              <p className="text-[9px] text-white/80">Friends</p>
            </button>
            <button onClick={() => setCurrentPage("habitat-dex")} className="text-center active:scale-95 transition-transform">
              <p className="text-xl font-bold text-white">{discoveredHabitats.length}</p>
              <p className="text-[9px] text-white/80">Habitats</p>
            </button>
          </div>

          {/* Chat Button - Center, floats up */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-8">
            <button
              onClick={() => setCurrentPage("chat")}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 shadow-2xl flex flex-col items-center justify-center border-4 border-white active:scale-95 transition-transform"
            >
              <MessageCircle className="w-9 h-9 text-white" />
              <span className="text-[9px] font-semibold text-white/90 mt-1">Ask Anything</span>
            </button>
          </div>

          {/* Right stats — evenly spaced from center to right edge */}
          <div className="flex flex-1 justify-around pl-14">
            <button onClick={() => setCurrentPage("items")} className="text-center active:scale-95 transition-transform">
              <p className="text-xl font-bold text-white">{ownedItems.length}</p>
              <p className="text-[9px] text-white/80">Items</p>
            </button>
            <button onClick={() => setCurrentPage("map")} className="text-center active:scale-95 transition-transform">
              <p className="text-xl font-bold text-white">{visitedLocations.length}</p>
              <p className="text-[9px] text-white/80">Locations</p>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {(() => {
          const done = capturedPokemon.length + discoveredHabitats.length + ownedItems.length + visitedLocations.length;
          const pct = Math.min(100, Math.round((done / TOTAL) * 100));
          return (
            <div className="mx-4 mb-1">
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-center text-[10px] text-white/70 mt-0.5 font-medium">{pct}% complete</p>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
