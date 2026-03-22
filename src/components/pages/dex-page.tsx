'use client'

import { useAppStore } from "@/lib/store";
import { pokemonList as pokemonData, Pokemon, getSpecialtyIcon } from "@/lib/pokemon-data";
import { ArrowLeft, Search, Plus, Eye, EyeOff, Check, Zap, MapPin, Home, Sun, Moon, Cloud, CloudRain, CloudSnow } from "lucide-react";
import { useState, useEffect } from "react";
import specialtiesData from "@/data/scraped/specialties.json";
import habitatsData from "@/data/scraped/habitats.json";

// Build specialty lookup: name -> {description, icon}
const specialtyMap: Record<string, { description: string; icon: string }> = {};
for (const s of specialtiesData) {
  specialtyMap[s.name.toLowerCase()] = {
    description: s.description.replace(/Pok&eacute;mon/g, 'Pokémon').replace(/&eacute;/g, 'é'),
    icon: s.icon,
  };
}

// Habitat lookup: name -> {image, slug, id}
const habitatMap: Record<string, { image: string; slug: string; id: number }> = {};
for (const h of habitatsData) {
  habitatMap[h.name.toLowerCase()] = { image: h.image, slug: h.slug, id: h.id };
}

const LOCATION_ORDER = [
  "Withered Wastelands", "Bleak Beach", "Rocky Ridges",
  "Sparkling Skylands", "Palette Town", "Cloud Island",
];

const LOCATION_COLORS: Record<string, string> = {
  "Withered Wastelands": "bg-amber-100 text-amber-800 border-amber-300",
  "Bleak Beach":         "bg-blue-100 text-blue-800 border-blue-300",
  "Rocky Ridges":        "bg-stone-100 text-stone-800 border-stone-300",
  "Sparkling Skylands":  "bg-sky-100 text-sky-800 border-sky-300",
  "Palette Town":        "bg-red-100 text-red-800 border-red-300",
  "Cloud Island":        "bg-purple-100 text-purple-800 border-purple-300",
};

const rarities = ["Common", "Rare", "Legendary"] as const;

// ── Time / Weather display helpers ──
type TimeVal = "Any" | "Day" | "Night";
type WeatherVal = "Any" | "Sunny" | "Rainy" | "Snowy" | "Foggy" | "Cloudy";

function TimeIcon({ time }: { time: TimeVal }) {
  if (time === "Day")  return <Sun className="w-4 h-4 text-yellow-500" />;
  if (time === "Night") return <Moon className="w-4 h-4 text-indigo-400" />;
  return <Sun className="w-4 h-4 text-gray-400" />;
}

function WeatherIcon({ weather }: { weather: WeatherVal }) {
  if (weather === "Sunny")  return <Sun className="w-4 h-4 text-yellow-500" />;
  if (weather === "Rainy")  return <CloudRain className="w-4 h-4 text-blue-500" />;
  if (weather === "Snowy")  return <CloudSnow className="w-4 h-4 text-sky-400" />;
  if (weather === "Cloudy") return <Cloud className="w-4 h-4 text-gray-400" />;
  if (weather === "Foggy")  return <Cloud className="w-4 h-4 text-gray-300" />;
  return <Sun className="w-4 h-4 text-gray-400" />;
}

function ConditionsBlock({ pokemon }: { pokemon: Pokemon }) {
  const time: TimeVal = pokemon.time ?? "Any";
  const weather: WeatherVal = pokemon.weather ?? "Any";

  return (
    <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
      <h3 className="font-bold text-gray-700 text-sm mb-3">Conditions to Find</h3>
      <div className="grid grid-cols-2 gap-3">
        {/* Time */}
        <div className="flex flex-col items-center gap-1.5 bg-white rounded-xl p-3 border border-orange-100">
          <TimeIcon time={time} />
          <span className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Time</span>
          <span className="text-sm font-bold text-gray-800">{time}</span>
        </div>
        {/* Weather */}
        <div className="flex flex-col items-center gap-1.5 bg-white rounded-xl p-3 border border-orange-100">
          <WeatherIcon weather={weather} />
          <span className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Weather</span>
          <span className="text-sm font-bold text-gray-800">{weather}</span>
        </div>
      </div>
    </div>
  );
}

export function DexPage() {
  const { setCurrentPage, navigateToHabitat, capturedPokemon, toggleCapturedPokemon, focusedPokemonId, clearFocus } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [friendFilter, setFriendFilter] = useState<"all" | "friends" | "unseen">("all");
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  // Auto-open a Pokemon if navigated to via deep-link
  useEffect(() => {
    if (focusedPokemonId) {
      const p = pokemonData.find(p => p.id === focusedPokemonId);
      if (p) setSelectedPokemon(p);
      clearFocus();
    }
  }, [focusedPokemonId]);

  const filteredPokemon = pokemonData.filter(pokemon => {
    const matchesSearch = pokemon.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = !selectedRarity || pokemon.rarity === selectedRarity;
    let matchesFriendFilter = true;
    if (friendFilter === "friends") matchesFriendFilter = capturedPokemon.includes(pokemon.id);
    else if (friendFilter === "unseen") matchesFriendFilter = !capturedPokemon.includes(pokemon.id);
    return matchesSearch && matchesRarity && matchesFriendFilter;
  });

  const getRarityColor = (rarity: string) => {
    if (rarity === "Legendary") return "text-amber-500";
    if (rarity === "Rare") return "text-purple-500";
    return "text-gray-400";
  };

  const getRarityBg = (rarity: string) => {
    if (rarity === "Legendary") return "bg-gradient-to-br from-amber-100 to-amber-200";
    if (rarity === "Rare") return "bg-gradient-to-br from-purple-100 to-purple-200";
    return "bg-gradient-to-br from-gray-100 to-gray-200";
  };

  const getRarityButtonStyle = (rarity: string) => {
    if (rarity === "Legendary") return "bg-gradient-to-r from-amber-400 to-orange-400 text-white";
    if (rarity === "Rare") return "bg-gradient-to-r from-purple-400 to-violet-400 text-white";
    return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700";
  };

  // ── Full-screen Pokemon Detail ──
  if (selectedPokemon) {
    const isFriend = capturedPokemon.includes(selectedPokemon.id);
    return (
      <div className="h-full flex flex-col bg-white overflow-hidden">
        {/* Gradient header */}
        <div className={`shrink-0 bg-gradient-to-br ${
          selectedPokemon.rarity === "Legendary" ? "from-amber-500 to-orange-500" :
          selectedPokemon.rarity === "Rare" ? "from-purple-500 to-violet-500" :
          "from-gray-400 to-gray-500"
        } pt-6 pb-4 px-4 relative`}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedPokemon(null)}
              className="w-9 h-9 rounded-full bg-black/20 flex items-center justify-center active:scale-90 transition-transform"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              selectedPokemon.rarity === 'Legendary' ? 'bg-white text-amber-600' : 'bg-black/30 text-white'
            }`}>
              {selectedPokemon.rarity}
            </span>
          </div>
          {/* Name + number in header */}
          <div className="text-center mt-2 mb-2">
            <p className="text-xs text-white/60 font-mono">#{String(selectedPokemon.id).padStart(3, '0')}</p>
            <h2 className="text-2xl font-bold text-white">{selectedPokemon.name}</h2>
          </div>
          <div className="flex justify-center">
            <div className={`w-28 h-28 rounded-2xl ${getRarityBg(selectedPokemon.rarity)} p-2 shadow-xl`}>
              <img
                src={selectedPokemon.image}
                alt={selectedPokemon.name}
                className="w-full h-full object-contain"
                style={{ filter: 'drop-shadow(0 0 2px black)' }}
              />
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto -mt-4">
          <div className="bg-white rounded-t-3xl pt-4 px-4 pb-8 space-y-5">
            {/* Types */}
            <div className="text-center">
              <p className="text-xs text-gray-400 font-mono sr-only">#{String(selectedPokemon.id).padStart(3, '0')}</p>
              <h2 className="text-2xl font-bold text-gray-800 sr-only">{selectedPokemon.name}</h2>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                {selectedPokemon.types.map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{t}</span>
                ))}
              </div>
            </div>

            {/* Friend button */}
            <button
              onClick={() => toggleCapturedPokemon(selectedPokemon.id)}
              className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium active:scale-95 transition-transform ${
                isFriend ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-100 text-gray-600 border-2 border-dashed border-gray-300'
              }`}
            >
              {isFriend ? <><Check className="w-5 h-5" /><span>Friend!</span></> : <><Plus className="w-5 h-5" /><span>Add as Friend</span></>}
            </button>

            {/* Specialties */}
            {selectedPokemon.specialties && selectedPokemon.specialties.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-700 text-sm mb-2 flex items-center gap-1">
                  <Zap className="w-4 h-4 text-yellow-500" /> Specialties
                </h3>
                <div className="space-y-2">
                  {selectedPokemon.specialties.map((specialty, i) => {
                    const info = specialtyMap[specialty.toLowerCase()];
                    return (
                      <div key={i} className="flex items-start gap-3 bg-green-50 rounded-xl p-3 border border-green-100">
                        <div className="w-10 h-10 rounded-lg bg-white border border-green-200 flex items-center justify-center shrink-0">
                          {info?.icon ? (
                            <img src={info.icon} alt={specialty} className="w-8 h-8 object-contain"
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          ) : (
                            <Zap className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-green-800 text-sm">{specialty}</p>
                          {info?.description && <p className="text-xs text-green-700 mt-0.5 leading-relaxed">{info.description}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Map Locations */}
            {selectedPokemon.locations && selectedPokemon.locations.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-700 text-sm mb-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-blue-500" /> Map Locations
                </h3>
                <div className="space-y-1.5">
                  {LOCATION_ORDER
                    .filter(loc => selectedPokemon.locations!.includes(loc))
                    .map(location => (
                      <button
                        key={location}
                        onClick={() => { setSelectedPokemon(null); setCurrentPage("map"); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-left active:scale-95 transition-transform ${LOCATION_COLORS[location] || 'bg-gray-100 text-gray-700 border-gray-200'}`}
                      >
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-sm font-medium flex-1">{location}</span>
                        <span className="text-[10px] opacity-60">→ Map</span>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Habitats */}
            {selectedPokemon.habitats && selectedPokemon.habitats.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-700 text-sm mb-2 flex items-center gap-1">
                  <Home className="w-4 h-4 text-emerald-500" /> Habitats
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedPokemon.habitats.map((habitat, i) => {
                    const hab = habitatMap[habitat.toLowerCase()];
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedPokemon(null);
                          if (hab) navigateToHabitat(hab.id);
                          else setCurrentPage("habitat-dex");
                        }}
                        className="flex flex-col overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50 text-left active:scale-95 transition-transform"
                      >
                        {hab?.image && (
                          <div className="w-full h-16 bg-gray-100 overflow-hidden">
                            <img src={hab.image} alt={habitat} className="w-full h-full object-cover"
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          </div>
                        )}
                        <div className="p-2">
                          <p className="text-xs font-semibold text-emerald-800 leading-tight">{habitat}</p>
                          {hab && <p className="text-[9px] text-emerald-600 mt-0.5">→ Habitat Dex</p>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedPokemon.comfortNotes && (
              <div>
                <h3 className="font-bold text-gray-700 text-sm mb-2">Notes</h3>
                <p className="text-xs text-gray-600 bg-gray-50 rounded-xl p-3 border border-gray-100">{selectedPokemon.comfortNotes}</p>
              </div>
            )}

            {/* ── Conditions to Find (time + weather) — always shown, at bottom ── */}
            <ConditionsBlock pokemon={selectedPokemon} />
          </div>
        </div>
      </div>
    );
  }

  // ── Pokemon List ──
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-red-500 to-red-600">
      {/* Header */}
      <div className="pt-6 pb-2 px-4 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setCurrentPage("home")}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">Dex</h1>
          <div className="w-9" />
        </div>

        <p className="text-white/70 text-xs mb-3 text-center">
          {capturedPokemon.length} Friends / 300 Pokémon
        </p>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Pokémon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white shadow-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
          />
        </div>

        {/* Friend Filter */}
        <div className="flex gap-1.5 mt-2">
          {([
            ["all",     "All",                                        Eye   ],
            ["friends", `Friends (${capturedPokemon.length})`,        Check ],
            ["unseen",  `Unseen (${300 - capturedPokemon.length})`,   EyeOff],
          ] as const).map(([val, label, Icon]) => (
            <button
              key={val}
              onClick={() => setFriendFilter(val)}
              className={`flex-1 px-2 py-1.5 rounded-full text-xs font-medium flex items-center justify-center gap-1 active:scale-95 transition-transform ${
                friendFilter === val
                  ? val === "friends" ? "bg-yellow-400 text-yellow-900"
                  : val === "unseen"  ? "bg-gray-600 text-white"
                  : "bg-white text-red-600"
                  : "bg-white/20 text-white"
              }`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>

        {/* Rarity Filter */}
        <div className="flex gap-1.5 mt-2">
          <button
            onClick={() => setSelectedRarity(null)}
            className={`flex-1 px-2.5 py-1.5 rounded-full text-xs font-medium active:scale-95 transition-transform ${!selectedRarity ? "bg-white text-red-600" : "bg-white/20 text-white"}`}
          >
            All
          </button>
          {rarities.map(rarity => (
            <button
              key={rarity}
              onClick={() => setSelectedRarity(rarity)}
              className={`flex-1 px-2.5 py-1.5 rounded-full text-xs font-medium active:scale-95 transition-transform ${selectedRarity === rarity ? getRarityButtonStyle(rarity) : "bg-white/20 text-white"}`}
            >
              {rarity}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-y-auto">
        {filteredPokemon.map((pokemon) => {
          const isFriend = capturedPokemon.includes(pokemon.id);
          return (
            <div
              key={pokemon.id}
              className="flex items-center gap-3 p-3 border-b border-gray-100 active:bg-gray-50"
              onClick={() => setSelectedPokemon(pokemon)}
            >
              {/* Image */}
              <div className={`w-16 h-16 shrink-0 rounded-xl ${getRarityBg(pokemon.rarity)} p-1.5`}>
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="w-full h-full object-contain drop-shadow-sm"
                  style={{ filter: 'drop-shadow(0 0 1px black)' }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 font-mono">#{String(pokemon.id).padStart(3, '0')}</span>
                  <h3 className="font-bold text-gray-800 text-sm">{pokemon.name}</h3>
                  <span className={`text-[10px] ${getRarityColor(pokemon.rarity)}`}>{pokemon.rarity}</span>
                </div>

                {/* Specialties only */}
                {pokemon.specialties && pokemon.specialties.length > 0 && (
                  <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                    <Zap className="w-2.5 h-2.5 text-yellow-500 shrink-0" />
                    {pokemon.specialties.slice(0, 2).map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-0.5">
                        <img src={getSpecialtyIcon(spec)} alt={spec} className="w-3 h-3 object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        <span className="text-[9px] text-green-600">{spec}</span>
                        {idx < Math.min(pokemon.specialties!.length, 2) - 1 && <span className="text-green-300 text-[9px]">·</span>}
                      </div>
                    ))}
                    {pokemon.specialties.length > 2 && <span className="text-[9px] text-gray-400">+{pokemon.specialties.length - 2}</span>}
                  </div>
                )}
              </div>

              {/* Friend Button */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleCapturedPokemon(pokemon.id); }}
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-transform ${
                  isFriend ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300'
                }`}
              >
                {isFriend ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </button>
            </div>
          );
        })}

        {filteredPokemon.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <Search className="w-12 h-12 mb-2" />
            <p className="text-sm">No Pokémon found</p>
          </div>
        )}
      </div>
    </div>
  );
}
