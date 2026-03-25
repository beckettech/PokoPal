'use client'

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { ArrowLeft, Search, MapPin, ChevronDown, ChevronUp, TreePine, Plus, Check, Bookmark } from "lucide-react";
import locationsData from "@/data/scraped/locations.json";
import habitatsData from "@/data/scraped/habitats.json";

const LOCATION_COLORS: Record<string, { bg: string; badge: string; text: string }> = {
  "Withered Wastelands": { bg: "from-amber-700 to-amber-900", badge: "bg-amber-700", text: "text-amber-100" },
  "Bleak Beach":         { bg: "from-blue-400 to-blue-600",   badge: "bg-blue-500",   text: "text-white" },
  "Rocky Ridges":        { bg: "from-stone-500 to-stone-700", badge: "bg-stone-600",  text: "text-white" },
  "Sparkling Skylands":  { bg: "from-sky-400 to-sky-600",     badge: "bg-sky-500",    text: "text-white" },
  "Palette Town":        { bg: "from-red-400 to-red-600",     badge: "bg-red-500",    text: "text-white" },
  "Cloud Island":        { bg: "from-purple-400 to-purple-600", badge: "bg-purple-500", text: "text-white" },
};

// Build a map from location name -> list of habitats in that location
const locationHabitats: Record<string, typeof habitatsData> = {};
for (const habitat of habitatsData) {
  for (const loc of (habitat.locations || [])) {
    if (!locationHabitats[loc]) locationHabitats[loc] = [];
    locationHabitats[loc].push(habitat);
  }
}

export function MapPage() {
  const { setCurrentPage, navigateToHabitat, visitedLocations = [], toggleVisitedLocation } = useAppStore() as any;
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);
  const [filterBy, setFilterBy] = useState<"all" | "visited">("all");

  // Filter locations
  const filteredLocations = locationsData.filter(loc => {
    const matchSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const isVisited = visitedLocations.includes(loc.id);
    if (filterBy === "visited") return matchSearch && isVisited;
    return matchSearch;
  });

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-500 to-blue-600 overflow-hidden">
      {/* Header */}
      <div className="pt-6 pb-2 px-4 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setCurrentPage("home")}
            className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">Map</h1>
          <div className="w-9" />
        </div>

        {/* Search */}
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white shadow text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex gap-1.5">
          <button
            onClick={() => setFilterBy("all")}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
              filterBy === "all" ? "bg-white text-blue-600" : "bg-white/20 text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterBy("visited")}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
              filterBy === "visited" ? "bg-yellow-400 text-yellow-900" : "bg-white/20 text-white"
            }`}
          >
            <Bookmark className="w-3 h-3" />
            Visited ({visitedLocations.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-y-auto">
        <div className="p-3 space-y-3">
          {filteredLocations.map((location) => {
            const colors = LOCATION_COLORS[location.name] || { bg: "from-gray-400 to-gray-600", badge: "bg-gray-500", text: "text-white" };
            const isExpanded = expandedLocation === location.id;
            const isVisited = visitedLocations.includes(location.id);
            const habitats = locationHabitats[location.name] || [];

            return (
              <div
                key={location.id}
                className={`rounded-xl overflow-hidden shadow-sm border ${
                  isVisited ? "border-yellow-200 bg-yellow-50/30" : "border-gray-100"
                }`}
              >
                {/* Location header */}
                <div className={`w-full bg-gradient-to-r ${colors.bg} p-4`}>
                  <div className="flex items-center justify-between">
                    <button
                      className="flex items-center gap-3 flex-1 text-left"
                      onClick={() => setExpandedLocation(isExpanded ? null : location.id)}
                    >
                      {/* Location image */}
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-white/20 shrink-0">
                        <img
                          src={location.image}
                          alt={location.name}
                          className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                      <div>
                        <h2 className="font-bold text-white text-base">{location.name}</h2>
                        <p className="text-white/70 text-xs">{location.description}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <TreePine className="w-3 h-3 text-white/70" />
                          <span className="text-white/70 text-xs">{habitats.length} Habitats</span>
                        </div>
                      </div>
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {isExpanded
                        ? <ChevronUp className="w-5 h-5 text-white/70" />
                        : <ChevronDown className="w-5 h-5 text-white/70" />
                      }
                    </div>
                  </div>
                </div>

                {/* Bottom row - mark visited button */}
                <div className="flex items-center justify-end px-3 py-2 bg-white border-t border-gray-100">
                  <button
                    onClick={() => toggleVisitedLocation(location.id)}
                    className={`w-11 h-11 rounded-full flex items-center justify-center active:scale-90 transition-all ${
                      isVisited ? "bg-yellow-400 text-yellow-900" : "bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300"
                    }`}
                  >
                    {isVisited ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </button>
                </div>

                {/* Expanded habitat list */}
                {isExpanded && (
                  <div className="bg-gray-50 p-3">
                    {habitats.length === 0 ? (
                      <p className="text-gray-400 text-xs text-center py-2">No habitats found</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {habitats.map(habitat => (
                          <button
                            key={habitat.id}
                            onClick={() => navigateToHabitat(habitat.id)}
                            className="flex flex-col overflow-hidden rounded-xl border border-emerald-100 bg-white text-left active:scale-95 transition-transform shadow-sm"
                          >
                            {habitat.image && (
                              <div className="w-full h-14 bg-gray-100 overflow-hidden">
                                <img
                                  src={habitat.image}
                                  alt={habitat.name}
                                  className="w-full h-full object-cover"
                                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                              </div>
                            )}
                            <div className="p-2">
                              <p className="text-xs font-semibold text-gray-800 leading-tight">{habitat.name}</p>
                              <p className="text-[9px] text-emerald-600 mt-0.5">{habitat.pokemon.length} Pokémon</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filteredLocations.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <MapPin className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No locations found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
