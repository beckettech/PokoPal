"use client";

import { useState, useMemo } from "react";
import pokemonData from "@/data/pokedex.json";

const generations = ["All", "Gen 1", "Gen 2", "Gen 3", "Gen 4", "Gen 5", "Gen 6", "Gen 7", "Gen 8", "Gen 9"];
const types = ["All", "Fire", "Water", "Grass", "Electric", "Normal", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"];

export default function PokedexPage() {
  const [search, setSearch] = useState("");
  const [genFilter, setGenFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const filteredPokemon = useMemo(() => {
    return pokemonData.pokemon.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesGen = genFilter === "All" || p.generation === parseInt(genFilter.replace("Gen ", ""));
      const matchesType = typeFilter === "All" || p.types.includes(typeFilter);
      return matchesSearch && matchesGen && matchesType;
    });
  }, [search, genFilter, typeFilter]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📖 Pokédex</h1>
      <p className="text-gray-600 mb-4">
        {pokemonData.totalPokemon} Pokémon available
      </p>

      {/* Search */}
      <input
        type="text"
        placeholder="Search Pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border rounded-xl mb-4"
      />

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <select
          value={genFilter}
          onChange={(e) => setGenFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          {generations.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Pokemon Grid */}
      <div className="grid grid-cols-3 gap-2">
        {filteredPokemon.map((pokemon) => (
          <div
            key={pokemon.id}
            className="bg-white border rounded-xl p-3 text-center"
          >
            <div className="text-3xl mb-1">🔍</div>
            <div className="font-medium text-sm">{pokemon.name}</div>
            <div className="flex gap-1 justify-center mt-1">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredPokemon.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No Pokémon found
        </p>
      )}
    </div>
  );
}
