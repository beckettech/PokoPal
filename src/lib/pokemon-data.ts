// Pokemon Pokopia data for Pokopia Guide app
// Pokopia Dex has 300 Pokemon with unique Pokopia dex numbers
// Specialties from: https://www.serebii.net/pokemonpokopia/specialty.shtml
// Habitats from: https://www.serebii.net/pokemonpokopia/habitats.shtml
// Map locations from: https://www.serebii.net/pokemonpokopia/pokedex/

import correctLocationsData from '../../correct-locations.json';

// Get the correct Pokemon -> Locations mapping from the correct-locations.json
const _pokemonToLocations: Record<string, string[]> = correctLocationsData.pokemon_to_locations;

// Build the reverse mapping: Location -> Pokemon
export const locationToPokemon: Record<string, string[]> = {};

Object.entries(_pokemonToLocations).forEach(([pokemonName, locations]) => {
  locations.forEach(location => {
    if (!locationToPokemon[location]) {
      locationToPokemon[location] = [];
    }
    locationToPokemon[location].push(pokemonName);
  });
});

// Export list of all map locations
export const mapLocations = Object.keys(locationToPokemon);

// Helper function to get locations for a Pokemon by name
export function getLocationsForPokemon(pokemonName: string): string[] {
  return _pokemonToLocations[pokemonName] || [];
}

// All 300 Pokemon
export const pokemonList = [
  { id: 1, nationalDex: 1, name: "Bulbasaur", types: ["Grass", "Poison"], habitats: ["Tall Grass", "Pretty Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/001.png", rarity: "Common", specialties: ["Grow"], conditions: ["Any time"] },
