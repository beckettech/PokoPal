'use client'

// Dex Page - v2.0.1 (cache-bust)
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
  "Sparkling Skylands", "Palette Town",
];

const LOCATION_COLORS: Record<string, string> = {
  "Withered Wastelands": "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700",
  "Bleak Beach":         "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700",
  "Rocky Ridges":        "bg-stone-100 dark:bg-stone-900/40 text-stone-800 dark:text-stone-300 border-stone-300 dark:border-stone-700",
  "Sparkling Skylands":  "bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-700",
  "Palette Town":        "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700",
  "Cloud Island":        "bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700",
};

const rarities = ["Common", "Rare", "Legendary"] as const;

// ── Time / Weather display helpers ──
type TimeVal = "Any" | "Day" | "Night";
type WeatherVal = "Any" | "Sunny" | "Rainy" | "Snowy" | "Foggy" | "Cloudy";

function TimeIcon({ time }: { time: TimeVal }) {
  if (time === "Day")  return <Sun className="w-4 h-4 text-yellow-500" />;
  if (time === "Night") return <Moon className="w-4 h-4 text-indigo-400" />;
  return <Sun className="w-4 h-4 text-gray-400 dark:text-gray-500" />;
}

function WeatherIcon({ weather }: { weather: WeatherVal }) {
  if (weather === "Sunny")  return <Sun className="w-4 h-4 text-yellow-500" />;
  if (weather === "Rainy")  return <CloudRain className="w-4 h-4 text-blue-500" />;
  if (weather === "Snowy")  return <CloudSnow className="w-4 h-4 text-sky-400" />;
  if (weather === "Cloudy") return <Cloud className="w-4 h-4 text-gray-400 dark:text-gray-500" />;
  if (weather === "Foggy")  return <Cloud className="w-4 h-4 text-gray-300" />;
  return <Sun className="w-4 h-4 text-gray-400 dark:text-gray-500" />;
}

function ConditionsBlock({ pokemon }: { pokemon: Pokemon }) {
  const time: TimeVal = pokemon.time ?? "Any";
  const weather: WeatherVal = pokemon.weather ?? "Any";

  return (
    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 border border-orange-100 dark:border-orange-700">
      <h3 className="font-bold text-gray-700 dark:text-gray-300 text-sm mb-3">Conditions to Find</h3>
      <div className="grid grid-cols-2 gap-3">
        {/* Time */}
        <div className="flex flex-col items-center gap-1.5 bg-white dark:bg-gray-800 rounded-xl p-3 border border-orange-100 dark:border-orange-700">
          <TimeIcon time={time} />
          <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold">Time</span>
          <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{time}</span>
        </div>
        {/* Weather */}
        <div className="flex flex-col items-center gap-1.5 bg-white dark:bg-gray-800 rounded-xl p-3 border border-orange-100 dark:border-orange-700">
          <WeatherIcon weather={weather} />
          <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold">Weather</span>
          <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{weather}</span>
        </div>
      </div>
    </div>
  );
}

export function DexPage() {
  const { setCurrentPage, navigateToHabitat, navigateToHabitatWithPokemon, navigateToLocation, navigateBack, previousPage, capturedPokemon, toggleCapturedPokemon, focusedPokemonId, clearFocus } = useAppStore();
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
    if (rarity === "Legendary") return "text-amber-500 dark:text-amber-400";
    if (rarity === "Rare") return "text-purple-500 dark:text-purple-400";
    return "text-gray-400 dark:text-gray-500";
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
      <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
        {/* Clean white top bar */}
        <div className="shrink-0 bg-white dark:bg-gray-800 px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedPokemon(null)}
              className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center active:scale-90 transition-transform shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="flex-1">
              <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">#{String(selectedPokemon.id).padStart(3, '0')}</p>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{selectedPokemon.name}</h2>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${getRarityButtonStyle(selectedPokemon.rarity)}`}>
              {selectedPokemon.rarity}
            </span>
          </div>
        </div>

        {/* Legendary Obtain Method - special callout */}
        {(selectedPokemon as any).obtainMethod && (
          <div className="mx-4 mt-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-700 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">✨</span>
              <h3 className="font-bold text-amber-800 dark:text-amber-300 text-sm">How to Obtain</h3>
            </div>
            <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">{(selectedPokemon as any).obtainMethod}</p>
          </div>
        )}

        {/* Legendary Habitat - for Pokemon that can be housed */}
        {(selectedPokemon as any).habitatBuilt && (
          <div className="mx-4 mt-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200 dark:border-emerald-700 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🏠</span>
              <h3 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">Can Be Housed In</h3>
            </div>
            <button
              onClick={() => {
                const hab = habitatMap[(selectedPokemon as any).habitatBuilt.toLowerCase()];
                if (hab) navigateToHabitatWithPokemon(hab.id, selectedPokemon.id);
                else setCurrentPage("habitat-dex");
              }}
              className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl border border-emerald-200 dark:border-emerald-700 active:scale-95 transition-transform text-left w-full overflow-hidden mt-2"
            >
              {habitatMap[(selectedPokemon as any).habitatBuilt?.toLowerCase()]?.image && (
                <img
                  src={habitatMap[(selectedPokemon as any).habitatBuilt.toLowerCase()].image}
                  alt={(selectedPokemon as any).habitatBuilt}
                  className="w-14 h-14 object-cover shrink-0"
                />
              )}
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 leading-tight pr-3">{(selectedPokemon as any).habitatBuilt}</span>
            </button>
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="pt-4 px-4 pb-8 space-y-3">
            {/* Image card — image left, habitats right (no redundant specialty/type tags) */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
              <div className={`w-24 h-24 shrink-0 rounded-2xl ${getRarityBg(selectedPokemon.rarity)} p-2`}>
                <img
                  src={isFriend ? selectedPokemon.image.replace('/pokemon/', '/pokemon-original/') : selectedPokemon.image}
                  alt={selectedPokemon.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                {/* Habitats — name above image */}
                {selectedPokemon.habitats && selectedPokemon.habitats.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-1.5">Habitats</p>
                    <div className="flex flex-col gap-1.5">
                      {selectedPokemon.habitats.map((habitat: string, i: number) => {
                        const hab = habitatMap[habitat.toLowerCase()];
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              if (hab) navigateToHabitatWithPokemon(hab.id, selectedPokemon.id);
                              else setCurrentPage("habitat-dex");
                            }}
                            className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-100 dark:border-emerald-700 active:scale-95 transition-transform text-left w-full overflow-hidden"
                          >
                            {hab?.image && (
                              <img src={hab.image} alt={habitat} className="w-14 h-14 object-cover shrink-0"
                                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            )}
                            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 leading-tight pr-1">{habitat}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Friend button */}
            <button
              onClick={() => toggleCapturedPokemon(selectedPokemon.id)}
              className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-medium active:scale-95 transition-transform shadow-sm ${
                isFriend ? 'bg-yellow-400 dark:bg-yellow-500 text-yellow-900 dark:text-yellow-100' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-600'
              }`}
            >
              {isFriend ? <><Check className="w-5 h-5" /><span>Friend!</span></> : <><Plus className="w-5 h-5" /><span>Add as Friend</span></>}
            </button>



            {/* Specialties */}
            {selectedPokemon.specialties && selectedPokemon.specialties.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-700 dark:text-gray-300 text-sm mb-2 flex items-center gap-1">
                  <Zap className="w-4 h-4 text-yellow-500" /> Specialties
                </h3>
                <div className="space-y-2">
                  {selectedPokemon.specialties.map((specialty, i) => {
                    const info = specialtyMap[specialty.toLowerCase()];
                    return (
                      <div key={i} className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 rounded-xl p-3 border border-green-100 dark:border-green-700">
                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 flex items-center justify-center shrink-0">
                          {info?.icon ? (
                            <img src={info.icon} alt={specialty} className="w-8 h-8 object-contain"
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          ) : (
                            <Zap className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-green-800 dark:text-green-400 text-sm">{specialty}</p>
                          {info?.description && <p className="text-xs text-green-700 dark:text-green-400 mt-0.5 leading-relaxed">{info.description}</p>}
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
                <h3 className="font-bold text-gray-700 dark:text-gray-300 text-sm mb-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-blue-500" /> Map Locations
                </h3>
                <div className="space-y-1.5">
                  {LOCATION_ORDER
                    .filter(loc => selectedPokemon.locations!.includes(loc))
                    .map(location => (
                      <button
                        key={location}
                        onClick={() => { setSelectedPokemon(null); setCurrentPage("map"); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-left active:scale-95 transition-transform ${LOCATION_COLORS[location] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 border-gray-200'}`}
                      >
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-sm font-medium flex-1">{location}</span>
                        <span className="text-[10px] opacity-60">→ Map</span>
                      </button>
                    ))}
                </div>
              </div>
            )}



            {/* Notes */}
            {selectedPokemon.comfortNotes && (
              <div>
                <h3 className="font-bold text-gray-700 dark:text-gray-300 text-sm mb-2">Notes</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 rounded-xl p-3 border border-gray-100 dark:border-gray-700">{selectedPokemon.comfortNotes}</p>
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
            className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center active:scale-90 transition-transform"
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search Pokémon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white dark:bg-gray-800 shadow-lg text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
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
                  : "bg-white dark:bg-gray-800 text-red-600"
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
            className={`flex-1 px-2.5 py-1.5 rounded-full text-xs font-medium active:scale-95 transition-transform ${!selectedRarity ? "bg-white dark:bg-gray-800 text-red-600" : "bg-white/20 text-white"}`}
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
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-t-[2rem] overflow-y-auto">
        {filteredPokemon.map((pokemon, listIdx) => {
          const isFriend = capturedPokemon.includes(pokemon.id);
          const isEven = listIdx % 2 === 0;
          // Find habitat images from habitatsData
          const habitatImages = (pokemon.habitats || []).slice(0, 2).map(hName => {
            const found = habitatsData.find((h: any) => h.name === hName);
            return { name: hName, image: found?.image || null };
          });
          return (
            <div
              key={`${pokemon.id}-${pokemon.name}`}
              className={`flex items-center gap-3 px-3 py-2.5 border-b border-gray-100 dark:border-gray-700 active:brightness-95 ${isEven ? 'bg-white dark:bg-gray-800' : 'bg-slate-50 dark:bg-gray-900'}`}
              onClick={() => setSelectedPokemon(pokemon)}
            >
              {/* Pokemon Image */}
              <div className={`w-14 h-14 shrink-0 rounded-xl ${getRarityBg(pokemon.rarity)} p-1`}>
                <img
                  src={isFriend ? pokemon.image.replace('/pokemon/', '/pokemon-original/') : pokemon.image}
                  alt={pokemon.name}
                  className="w-full h-full object-contain drop-shadow-sm"
                  loading="lazy"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                {/* Name row */}
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 font-mono">#{String(pokemon.id).padStart(3, '0')}</span>
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm truncate">{pokemon.name}</h3>
                  <span className={`text-[9px] font-semibold shrink-0 ${getRarityColor(pokemon.rarity)}`}>{pokemon.rarity}</span>
                </div>



                {/* Habitats with images */}
                {habitatImages.length > 0 && (
                  <div className="flex items-center gap-1">
                    {habitatImages.map((h, idx) => (
                      <div key={idx} className="flex items-center gap-0.5">
                        {h.image && <img src={h.image} alt={h.name} className="w-3.5 h-3.5 object-cover rounded-sm"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                        <span className="text-[8px] text-blue-600 dark:text-blue-400 truncate max-w-[60px]">{h.name}</span>
                        {idx < habitatImages.length - 1 && <span className="text-gray-300 text-[8px]">·</span>}
                      </div>
                    ))}
                    {(pokemon.habitats || []).length > 2 && <span className="text-[8px] text-gray-400">+{(pokemon.habitats || []).length - 2}</span>}
                  </div>
                )}
              </div>

              {/* Friend Button */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleCapturedPokemon(pokemon.id); }}
                className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-transform ${
                  isFriend ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 border-2 border-dashed border-gray-300'
                }`}
              >
                {isFriend ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
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
// Sun Mar 22 01:20:49 PM EDT 2026
