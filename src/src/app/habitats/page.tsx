"use client";

import { useState, useMemo } from "react";
import habitatData from "@/data/habitats-full.json";

const categories = [
  "All",
  "Tall Grass",
  "Flower Bed",
  "Fishing",
  "Fossil",
  "Eeveelution",
  "Other",
];

export default function HabitatsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredHabitats = useMemo(() => {
    return habitatData.habitats.filter((h) => {
      const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase());
      
      let matchesCategory = category === "All";
      if (category === "Tall Grass") matchesCategory = h.name.includes("Tall Grass");
      else if (category === "Flower Bed") matchesCategory = h.name.includes("Flower") || h.name.includes("Garden");
      else if (category === "Fishing") matchesCategory = h.name.includes("Fishing");
      else if (category === "Fossil") matchesCategory = h.name.includes("Fossil");
      else if (category === "Eeveelution") matchesCategory = h.id >= 202 && h.id <= 209;
      else if (category === "Other") {
        matchesCategory = !h.name.includes("Tall Grass") && 
                         !h.name.includes("Flower") && 
                         !h.name.includes("Garden") &&
                         !h.name.includes("Fishing") &&
                         !h.name.includes("Fossil") &&
                         !(h.id >= 202 && h.id <= 209);
      }

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">🏠 Environment Dex</h1>
      <p className="text-gray-600 mb-4">
        {habitatData.totalHabitats} habitats to build
      </p>

      {/* Search */}
      <input
        type="text"
        placeholder="Search habitats..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border rounded-xl mb-4"
      />

      {/* Category Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
              category === cat
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Habitat List */}
      <div className="space-y-3">
        {filteredHabitats.map((habitat) => (
          <div
            key={habitat.id}
            className="bg-white border rounded-xl p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-xs text-gray-400">#{habitat.id}</span>
                <h3 className="font-bold">{habitat.name}</h3>
              </div>
            </div>

            {/* Items */}
            <div className="mb-2">
              <p className="text-xs font-medium text-gray-500 mb-1">Required Items:</p>
              <div className="flex flex-wrap gap-1">
                {habitat.items.map((item, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full"
                  >
                    {item.quantity}x {item.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Pokemon */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Attracts:</p>
              <div className="flex flex-wrap gap-1">
                {habitat.pokemon.map((p, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full"
                  >
                    {p.name}
                    {p.location && (
                      <span className="text-green-500 ml-1">({p.location})</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHabitats.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No habitats found
        </p>
      )}
    </div>
  );
}
