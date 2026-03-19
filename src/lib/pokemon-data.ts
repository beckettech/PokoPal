// Pokemon Pokopia data for the Pokopia Guide app
// Pokopia Dex has 300 Pokemon with unique Pokopia dex numbers
// Specialties from: https://www.serebii.net/pokemonpokopia/specialty.shtml
// Habitats from: https://www.serebii.net/pokemonpokopia/habitats.shtml
// Map locations from: https://www.serebii.net/pokemonpokopia/pokedex/

import correctLocationsData from '../../correct-locations.json';

// Get the correct Pokemon -> Locations mapping from the correct-locations.json
const _pokemonToLocations: Record<string, string[]> = correctLocationsData.pokemon_to_locations;

// Export the Pokemon -> Locations mapping
export const pokemonToLocations: Record<string, string[]> = _pokemonToLocations;

// Build the reverse mapping: Location -> Pokemon
export const locationToPokemon: Record<string, string[]> = {};

// All known locations
const allLocations = [
  "Withered Wastelands",
  "Bleak Beach", 
  "Rocky Ridges",
  "Sparkling Skylands",
  "Palette Town",
  "Cloud Island"
];

// Build location -> Pokemon mapping from the Pokemon -> Locations mapping
Object.entries(_pokemonToLocations).forEach(([pokemonName, locations]) => {
  locations.forEach(location => {
    if (!locationToPokemon[location]) {
      locationToPokemon[location] = [];
    }
    locationToPokemon[location].push(pokemonName);
  });
});

// Export list of all map locations
export const mapLocations = allLocations;

// Helper function to get locations for a Pokemon by name
export function getLocationsForPokemon(pokemonName: string): string[] {
  return _pokemonToLocations[pokemonName] || [];
}

export interface Pokemon {
  id: number; // Pokopia Dex number (1-300)
  nationalDex: number; // Official National Pokedex number for image lookup
  name: string;
  types: string[];
  habitats: string[]; // Habitats where this Pokemon can appear (player-built)
  locations: string[]; // Map locations where this Pokemon can spawn
  image: string;
  rarity: "Common" | "Rare" | "Legendary";
  specialties?: string[]; // From Serebii: Grow, Build, Chop, Burn, Water, etc.
  conditions?: string[];
  notes?: string;
}

// Internal interface for raw Pokemon data (before locations are added)
interface RawPokemon {
  id: number;
  nationalDex: number;
  name: string;
  types: string[];
  habitats: string[];
  image: string;
  rarity: "Common" | "Rare" | "Legendary";
  specialties?: string[];
  conditions?: string[];
  notes?: string;
}

// All habitat names from Serebii (for reference/filtering)
export const habitatNames = [
  "Tall Grass",
  "Tree-shaded Tall Grass", 
  "Boulder-shaded Tall Grass",
  "Hydrated Tall Grass",
  "Seaside Tall Grass",
  "Elevated Tall Grass",
  "Illuminated Tall Grass",
  "Pretty Flower Bed",
  "Tree-shaded Flower Bed",
  "Hydrated Flower Bed",
  "Field of Flowers",
  "Elevated Flower Bed",
  "Grave with Flowers",
  "Flower Garden",
  "Fresh Veggie Field",
  "Riding Warm Updrafts",
  "Campsite",
  "Training Waterfall",
  "Tantalizing Dining Set",
  "Picnic Set",
  "Flowery Table",
  "Bench with Greenery",
  "Illuminated Bench",
  "Exercise Resting Spot",
  "Urgent Care",
  "Gym First Aid",
  "Road Sign",
  "Large Luggage Carrier",
  "Lumberjack's Workplace",
  "Bed with Plush",
  "Gently Lit Bed",
  "Grave Offering",
  "Creepy Grave Offering",
  "Chansey Resting Area",
  "Irresistible Scent and Glow",
  "Floating in Shade",
  "Smooth Tall Grass",
  "Factory Storage",
  "Luxury Chirp-chirp Meal",
  "Berry-feast Campsite",
  "Rain Dance Site",
  "Sunny Day Site",
  "Professor's Treasure Trove",
  "Crazy Log Handicrafts",
  "Very-berry Space",
  "Garden Terrace",
  "Tree-shaded Snoozing Snorlax",
  "Good Old-fashioned Antiques",
  "Nothin' but Poke Balls",
  "Yellow Tall Grass",
  "Tree-shaded Yellow Tall Grass",
  "Elevated Yellow Tall Grass",
  "Hydrated Yellow Tall Grass",
  "Marshy Tall Grass",
  "Overgrowth Vending Machine",
  "Breezy Flower Bed",
  "Tropical Vibes",
  "Windy Flower Bed",
  "Shaded Beach",
  "Tropical Seaside",
];

// Specialties from Serebii with icon URLs
export const specialtyList = [
  "Appraise", "Build", "Bulldoze", "Burn", "Chop", "Collect", "Crush",
  "DJ", "Dream Island", "Eat", "Engineer", "Explode", "Fly", "Gather",
  "Gather Honey", "Generate", "Grow", "Hype", "Illuminate", "Litter",
  "Paint", "Party", "Rarify", "Recycle", "Search", "Storage", "Teleport",
  "Trade", "Transform", "Water", "Yawn"
];

// Specialty icon mapping
export const specialtyIcons: Record<string, string> = {
  "Appraise": "https://www.serebii.net/pokemonpokopia/specialty/appraise.png",
  "Build": "https://www.serebii.net/pokemonpokopia/specialty/build.png",
  "Bulldoze": "https://www.serebii.net/pokemonpokopia/specialty/bulldoze.png",
  "Burn": "https://www.serebii.net/pokemonpokopia/specialty/burn.png",
  "Chop": "https://www.serebii.net/pokemonpokopia/specialty/chop.png",
  "Collect": "https://www.serebii.net/pokemonpokopia/specialty/collect.png",
  "Crush": "https://www.serebii.net/pokemonpokopia/specialty/crush.png",
  "DJ": "https://www.serebii.net/pokemonpokopia/specialty/dj.png",
  "Dream Island": "https://www.serebii.net/pokemonpokopia/specialty/dreamisland.png",
  "Eat": "https://www.serebii.net/pokemonpokopia/specialty/eat.png",
  "Engineer": "https://www.serebii.net/pokemonpokopia/specialty/engineer.png",
  "Explode": "https://www.serebii.net/pokemonpokopia/specialty/explode.png",
  "Fly": "https://www.serebii.net/pokemonpokopia/specialty/fly.png",
  "Gather": "https://www.serebii.net/pokemonpokopia/specialty/gather.png",
  "Gather Honey": "https://www.serebii.net/pokemonpokopia/specialty/gatherhoney.png",
  "Generate": "https://www.serebii.net/pokemonpokopia/specialty/generate.png",
  "Grow": "https://www.serebii.net/pokemonpokopia/specialty/grow.png",
  "Hype": "https://www.serebii.net/pokemonpokopia/specialty/hype.png",
  "Illuminate": "https://www.serebii.net/pokemonpokopia/specialty/illuminate.png",
  "Litter": "https://www.serebii.net/pokemonpokopia/specialty/litter.png",
  "Paint": "https://www.serebii.net/pokemonpokopia/specialty/paint.png",
  "Party": "https://www.serebii.net/pokemonpokopia/specialty/party.png",
  "Rarify": "https://www.serebii.net/pokemonpokopia/specialty/rarify.png",
  "Recycle": "https://www.serebii.net/pokemonpokopia/specialty/recycle.png",
  "Search": "https://www.serebii.net/pokemonpokopia/specialty/search.png",
  "Storage": "https://www.serebii.net/pokemonpokopia/specialty/storage.png",
  "Teleport": "https://www.serebii.net/pokemonpokopia/specialty/teleport.png",
  "Trade": "https://www.serebii.net/pokemonpokopia/specialty/trade.png",
  "Transform": "https://www.serebii.net/pokemonpokopia/specialty/transform.png",
  "Water": "https://www.serebii.net/pokemonpokopia/specialty/water.png",
  "Yawn": "https://www.serebii.net/pokemonpokopia/specialty/yawn.png",
};

// Helper function to get specialty icon URL
export function getSpecialtyIcon(specialty: string): string {
  return specialtyIcons[specialty] || `https://www.serebii.net/pokemonpokopia/specialty/${specialty.toLowerCase().replace(' ', '')}.png`;
}

// Rarity order for filtering
export const rarities = ["Common", "Rare", "Legendary"] as const;

// All 300 Pokemon in Pokopia Dex order
// Specialties from Serebii: Grow, Build, Chop, Burn, Water, Gather, Generate, etc.
// Note: locations are added dynamically from the pokemonToLocations mapping
const _rawPokemonList: RawPokemon[] = [
  // #001-010: Kanto Starters and early bugs
  { id: 1, nationalDex: 1, name: "Bulbasaur", types: ["Grass", "Poison"], habitats: ["Tall Grass", "Pretty Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/001.png", rarity: "Common", specialties: ["Grow"], conditions: ["Any time"] },
  { id: 2, nationalDex: 2, name: "Ivysaur", types: ["Grass", "Poison"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/002.png", rarity: "Common", specialties: ["Grow"], conditions: ["Tall grass habitat"] },
  { id: 3, nationalDex: 3, name: "Venusaur", types: ["Grass", "Poison"], habitats: ["Pretty Flower Bed", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/003.png", rarity: "Rare", specialties: ["Grow"], conditions: ["Flower bed habitat"] },
  { id: 4, nationalDex: 4, name: "Charmander", types: ["Fire"], habitats: ["Tall Grass", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/004.png", rarity: "Common", specialties: ["Burn"], conditions: ["Sunny weather"] },
  { id: 5, nationalDex: 5, name: "Charmeleon", types: ["Fire"], habitats: ["Boulder-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/005.png", rarity: "Common", specialties: ["Burn", "Chop"], conditions: ["Red grass habitat"] },
  { id: 6, nationalDex: 6, name: "Charizard", types: ["Fire", "Flying"], habitats: ["Elevated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/006.png", rarity: "Rare", specialties: ["Burn", "Fly"], conditions: ["High altitude"] },
  { id: 7, nationalDex: 7, name: "Squirtle", types: ["Water"], habitats: ["Seaside Tall Grass", "Hydrated Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/007.png", rarity: "Common", specialties: ["Water"], conditions: ["Any time"] },
  { id: 8, nationalDex: 8, name: "Wartortle", types: ["Water"], habitats: ["Seaside Tall Grass", "Hydrated Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/008.png", rarity: "Common", specialties: ["Water"], conditions: ["Coastal habitat"] },
  { id: 9, nationalDex: 9, name: "Blastoise", types: ["Water"], habitats: ["Seaside Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/009.png", rarity: "Rare", specialties: ["Water"], conditions: ["Large water body"] },
  { id: 10, nationalDex: 10, name: "Caterpie", types: ["Bug"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/010.png", rarity: "Common", specialties: ["Gather"], conditions: ["Flower areas"] },
  
  // #011-020
  { id: 11, nationalDex: 11, name: "Metapod", types: ["Bug"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/011.png", rarity: "Common", specialties: [], conditions: ["Sheltered areas"] },
  { id: 12, nationalDex: 12, name: "Butterfree", types: ["Bug", "Flying"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/012.png", rarity: "Common", specialties: ["Gather", "Fly"], conditions: ["Flower beds"] },
  { id: 13, nationalDex: 13, name: "Weedle", types: ["Bug", "Poison"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/013.png", rarity: "Common", specialties: ["Gather Honey"], conditions: ["Forest areas"] },
  { id: 14, nationalDex: 14, name: "Kakuna", types: ["Bug", "Poison"], habitats: ["Tree-shaded Tall Grass", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/014.png", rarity: "Common", specialties: [], conditions: ["Tree areas"] },
  { id: 15, nationalDex: 15, name: "Beedrill", types: ["Bug", "Poison"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/015.png", rarity: "Common", specialties: ["Gather Honey", "Chop"], conditions: ["Flower habitats"] },
  { id: 16, nationalDex: 16, name: "Pidgey", types: ["Normal", "Flying"], habitats: ["Field of Flowers", "Pretty Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/016.png", rarity: "Common", specialties: ["Fly"], conditions: ["Any area"] },
  { id: 17, nationalDex: 17, name: "Pidgeotto", types: ["Normal", "Flying"], habitats: ["Boulder-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/017.png", rarity: "Common", specialties: ["Fly"], conditions: ["Open areas"] },
  { id: 18, nationalDex: 18, name: "Pidgeot", types: ["Normal", "Flying"], habitats: ["Elevated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/018.png", rarity: "Rare", specialties: ["Fly"], conditions: ["High altitude"] },
  { id: 19, nationalDex: 19, name: "Rattata", types: ["Normal"], habitats: ["Field of Flowers", "Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/019.png", rarity: "Common", specialties: ["Gather"], conditions: ["Any area"] },
  { id: 20, nationalDex: 20, name: "Raticate", types: ["Normal"], habitats: ["Tall Grass", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/020.png", rarity: "Common", specialties: ["Chop", "Gather"], conditions: ["Sheltered areas"] },
  
  // #021-030
  { id: 21, nationalDex: 21, name: "Spearow", types: ["Normal", "Flying"], habitats: ["Tall Grass", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/021.png", rarity: "Common", specialties: ["Fly"], conditions: ["Open fields"] },
  { id: 22, nationalDex: 22, name: "Fearow", types: ["Normal", "Flying"], habitats: ["Boulder-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/022.png", rarity: "Common", specialties: ["Fly"], conditions: ["High places"] },
  { id: 23, nationalDex: 23, name: "Ekans", types: ["Poison"], habitats: ["Tall Grass", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/023.png", rarity: "Common", specialties: ["Gather"], conditions: ["Grass areas"] },
  { id: 24, nationalDex: 24, name: "Arbok", types: ["Poison"], habitats: ["Boulder-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/024.png", rarity: "Common", specialties: ["Gather"], conditions: ["Rocky terrain"] },
  { id: 25, nationalDex: 25, name: "Pikachu", types: ["Electric"], habitats: ["Campsite", "Field of Flowers"], image: "https://www.serebii.net/pokemongo/pokemon/025.png", rarity: "Common", specialties: ["Generate", "Illuminate"], conditions: ["Special habitat"] },
  { id: 26, nationalDex: 26, name: "Raichu", types: ["Electric"], habitats: ["Campsite", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/026.png", rarity: "Rare", specialties: ["Generate"], conditions: ["Special habitat"] },
  { id: 27, nationalDex: 27, name: "Sandshrew", types: ["Ground"], habitats: ["Shaded Beach", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/027.png", rarity: "Common", specialties: ["Bulldoze"], conditions: ["Sandy areas"] },
  { id: 28, nationalDex: 28, name: "Sandslash", types: ["Ground"], habitats: ["Boulder-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/028.png", rarity: "Common", specialties: ["Bulldoze", "Chop"], conditions: ["Rocky terrain"] },
  { id: 29, nationalDex: 29, name: "Nidoran♀", types: ["Poison"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/029.png", rarity: "Common", specialties: ["Gather"], conditions: ["Flower gardens"] },
  { id: 30, nationalDex: 30, name: "Nidorina", types: ["Poison"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/030.png", rarity: "Common", specialties: ["Gather"], conditions: ["Sheltered areas"] },
  
  // #031-040
  { id: 31, nationalDex: 31, name: "Nidoqueen", types: ["Poison", "Ground"], habitats: ["Boulder-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/031.png", rarity: "Rare", specialties: ["Build", "Bulldoze"], conditions: ["Rocky terrain"] },
  { id: 32, nationalDex: 32, name: "Nidoran♂", types: ["Poison"], habitats: ["Pretty Flower Bed", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/032.png", rarity: "Common", specialties: ["Gather"], conditions: ["Grass areas"] },
  { id: 33, nationalDex: 33, name: "Nidorino", types: ["Poison"], habitats: ["Boulder-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/033.png", rarity: "Common", specialties: ["Gather"], conditions: ["Rocky areas"] },
  { id: 34, nationalDex: 34, name: "Nidoking", types: ["Poison", "Ground"], habitats: ["Elevated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/034.png", rarity: "Rare", specialties: ["Build", "Bulldoze"], conditions: ["Mountain habitat"] },
  { id: 35, nationalDex: 35, name: "Clefairy", types: ["Fairy"], habitats: ["Pretty Flower Bed", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/035.png", rarity: "Common", specialties: ["Gather"], conditions: ["Full moon nights"] },
  { id: 36, nationalDex: 36, name: "Clefable", types: ["Fairy"], habitats: ["Elevated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/036.png", rarity: "Rare", specialties: ["Gather"], conditions: ["Special habitat"] },
  { id: 37, nationalDex: 37, name: "Vulpix", types: ["Fire"], habitats: ["Pretty Flower Bed", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/037.png", rarity: "Common", specialties: ["Burn"], conditions: ["Warm areas"] },
  { id: 38, nationalDex: 38, name: "Ninetales", types: ["Fire"], habitats: ["Elevated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/038.png", rarity: "Rare", specialties: ["Burn"], conditions: ["Mountain peaks"] },
  { id: 39, nationalDex: 39, name: "Jigglypuff", types: ["Normal", "Fairy"], habitats: ["Pretty Flower Bed", "Field of Flowers"], image: "https://www.serebii.net/pokemongo/pokemon/039.png", rarity: "Common", specialties: ["Hype"], conditions: ["Stage areas"] },
  { id: 40, nationalDex: 40, name: "Wigglytuff", types: ["Normal", "Fairy"], habitats: ["Pretty Flower Bed", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/040.png", rarity: "Common", specialties: ["Hype"], conditions: ["Social spaces"] },
  
  // #041-050
  { id: 41, nationalDex: 41, name: "Zubat", types: ["Poison", "Flying"], habitats: ["Illuminated Tall Grass", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/041.png", rarity: "Common", specialties: ["Fly"], conditions: ["Dark areas"] },
  { id: 42, nationalDex: 42, name: "Golbat", types: ["Poison", "Flying"], habitats: ["Illuminated Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/042.png", rarity: "Common", specialties: ["Fly"], conditions: ["Cave habitats"] },
  { id: 43, nationalDex: 43, name: "Oddish", types: ["Grass", "Poison"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/043.png", rarity: "Common", specialties: ["Grow"], conditions: ["Grass areas"] },
  { id: 44, nationalDex: 44, name: "Gloom", types: ["Grass", "Poison"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/044.png", rarity: "Common", specialties: ["Grow"], conditions: ["Flower gardens"] },
  { id: 45, nationalDex: 45, name: "Vileplume", types: ["Grass", "Poison"], habitats: ["Pretty Flower Bed", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/045.png", rarity: "Rare", specialties: ["Grow"], conditions: ["Large flower bed"] },
  { id: 46, nationalDex: 46, name: "Paras", types: ["Bug", "Grass"], habitats: ["Tree-shaded Tall Grass", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/046.png", rarity: "Common", specialties: ["Gather"], conditions: ["Mossy areas"] },
  { id: 47, nationalDex: 47, name: "Parasect", types: ["Bug", "Grass"], habitats: ["Tree-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/047.png", rarity: "Common", specialties: ["Gather", "Chop"], conditions: ["Damp caves"] },
  { id: 48, nationalDex: 48, name: "Venonat", types: ["Bug", "Poison"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/048.png", rarity: "Common", specialties: ["Search"], conditions: ["Nighttime"] },
  { id: 49, nationalDex: 49, name: "Venomoth", types: ["Bug", "Poison"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/049.png", rarity: "Common", specialties: ["Search"], conditions: ["Flower gardens"] },
  { id: 50, nationalDex: 50, name: "Diglett", types: ["Ground"], habitats: ["Tall Grass", "Shaded Beach"], image: "https://www.serebii.net/pokemongo/pokemon/050.png", rarity: "Common", specialties: ["Bulldoze"], conditions: ["Soft soil"] },
  
  // #051-060
  { id: 51, nationalDex: 51, name: "Dugtrio", types: ["Ground"], habitats: ["Boulder-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/051.png", rarity: "Common", specialties: ["Bulldoze"], conditions: ["Deep soil"] },
  { id: 52, nationalDex: 52, name: "Meowth", types: ["Normal"], habitats: ["Field of Flowers", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/052.png", rarity: "Common", specialties: ["Gather", "Trade"], conditions: ["Urban areas"] },
  { id: 53, nationalDex: 53, name: "Persian", types: ["Normal"], habitats: ["Campsite", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/053.png", rarity: "Common", specialties: ["Gather", "Trade"], conditions: ["Luxurious areas"] },
  { id: 54, nationalDex: 54, name: "Psyduck", types: ["Water"], habitats: ["Hydrated Tall Grass", "Hydrated Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/054.png", rarity: "Common", specialties: ["Water"], conditions: ["Hot spring habitat"] },
  { id: 55, nationalDex: 55, name: "Golduck", types: ["Water"], habitats: ["Hydrated Tall Grass", "Seaside Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/055.png", rarity: "Common", specialties: ["Water", "Search"], conditions: ["Deep water"] },
  { id: 56, nationalDex: 56, name: "Mankey", types: ["Fighting"], habitats: ["Boulder-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/056.png", rarity: "Common", specialties: ["Build"], conditions: ["Mountain areas"] },
  { id: 57, nationalDex: 57, name: "Primeape", types: ["Fighting"], habitats: ["Boulder-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/057.png", rarity: "Common", specialties: ["Build"], conditions: ["Training grounds"] },
  { id: 58, nationalDex: 58, name: "Growlithe", types: ["Fire"], habitats: ["Tall Grass", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/058.png", rarity: "Common", specialties: ["Burn", "Search"], conditions: ["Warm areas"] },
  { id: 59, nationalDex: 59, name: "Arcanine", types: ["Fire"], habitats: ["Campsite", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/059.png", rarity: "Rare", specialties: ["Burn", "Search"], conditions: ["Large territory"] },
  { id: 60, nationalDex: 60, name: "Poliwag", types: ["Water"], habitats: ["Hydrated Flower Bed", "Seaside Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/060.png", rarity: "Common", specialties: ["Water"], conditions: ["Ponds"] },
  
  // #061-070
  { id: 61, nationalDex: 61, name: "Poliwhirl", types: ["Water"], habitats: ["Hydrated Flower Bed", "Hydrated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/061.png", rarity: "Common", specialties: ["Water"], conditions: ["Deep water"] },
  { id: 62, nationalDex: 62, name: "Poliwrath", types: ["Water", "Fighting"], habitats: ["Hydrated Flower Bed", "Hydrated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/062.png", rarity: "Rare", specialties: ["Water", "Build"], conditions: ["Large water body"] },
  { id: 63, nationalDex: 63, name: "Abra", types: ["Psychic"], habitats: ["Campsite", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/063.png", rarity: "Common", specialties: ["Teleport"], conditions: ["Quiet areas"] },
  { id: 64, nationalDex: 64, name: "Kadabra", types: ["Psychic"], habitats: ["Elevated Tall Grass", "Illuminated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/064.png", rarity: "Common", specialties: ["Teleport"], conditions: ["Quiet areas"] },
  { id: 65, nationalDex: 65, name: "Alakazam", types: ["Psychic"], habitats: ["Campsite", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/065.png", rarity: "Rare", specialties: ["Teleport", "Search"], conditions: ["Special habitat"] },
  { id: 66, nationalDex: 66, name: "Machop", types: ["Fighting"], habitats: ["Boulder-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/066.png", rarity: "Common", specialties: ["Build", "Chop"], conditions: ["Training grounds"] },
  { id: 67, nationalDex: 67, name: "Machoke", types: ["Fighting"], habitats: ["Boulder-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/067.png", rarity: "Common", specialties: ["Build", "Chop"], conditions: ["Training areas"] },
  { id: 68, nationalDex: 68, name: "Machamp", types: ["Fighting"], habitats: ["Campsite", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/068.png", rarity: "Rare", specialties: ["Build", "Chop", "Bulldoze"], conditions: ["Large training area"] },
  { id: 69, nationalDex: 69, name: "Bellsprout", types: ["Grass", "Poison"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/069.png", rarity: "Common", specialties: ["Grow"], conditions: ["Flower gardens"] },
  { id: 70, nationalDex: 70, name: "Weepinbell", types: ["Grass", "Poison"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/070.png", rarity: "Common", specialties: ["Grow", "Chop"], conditions: ["Flower beds"] },
  
  // #071-080
  { id: 71, nationalDex: 71, name: "Victreebel", types: ["Grass", "Poison"], habitats: ["Pretty Flower Bed", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/071.png", rarity: "Rare", specialties: ["Grow", "Chop"], conditions: ["Large flower bed"] },
  { id: 72, nationalDex: 72, name: "Tentacool", types: ["Water", "Poison"], habitats: ["Seaside Tall Grass", "Shaded Beach"], image: "https://www.serebii.net/pokemongo/pokemon/072.png", rarity: "Common", specialties: ["Water"], conditions: ["Ocean areas"] },
  { id: 73, nationalDex: 73, name: "Tentacruel", types: ["Water", "Poison"], habitats: ["Seaside Tall Grass", "Shaded Beach"], image: "https://www.serebii.net/pokemongo/pokemon/073.png", rarity: "Common", specialties: ["Water"], conditions: ["Deep ocean"] },
  { id: 74, nationalDex: 74, name: "Geodude", types: ["Rock", "Ground"], habitats: ["Boulder-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/074.png", rarity: "Common", specialties: ["Bulldoze", "Crush"], conditions: ["Rocky terrain"] },
  { id: 75, nationalDex: 75, name: "Graveler", types: ["Rock", "Ground"], habitats: ["Boulder-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/075.png", rarity: "Common", specialties: ["Bulldoze", "Crush"], conditions: ["Mountain slopes"] },
  { id: 76, nationalDex: 76, name: "Golem", types: ["Rock", "Ground"], habitats: ["Elevated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/076.png", rarity: "Rare", specialties: ["Bulldoze", "Crush", "Explode"], conditions: ["Mountain habitat"] },
  { id: 77, nationalDex: 77, name: "Ponyta", types: ["Fire"], habitats: ["Tall Grass", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/077.png", rarity: "Common", specialties: ["Burn"], conditions: ["Open fields"] },
  { id: 78, nationalDex: 78, name: "Rapidash", types: ["Fire"], habitats: ["Campsite", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/078.png", rarity: "Rare", specialties: ["Burn"], conditions: ["Racing tracks"] },
  { id: 79, nationalDex: 79, name: "Slowpoke", types: ["Water", "Psychic"], habitats: ["Seaside Tall Grass", "Hydrated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/079.png", rarity: "Common", specialties: ["Water", "Yawn"], conditions: ["Water edge"] },
  { id: 80, nationalDex: 80, name: "Slowbro", types: ["Water", "Psychic"], habitats: ["Seaside Tall Grass", "Hydrated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/080.png", rarity: "Common", specialties: ["Water", "Yawn"], conditions: ["Beach areas"] },
  
  // #081-090
  { id: 81, nationalDex: 81, name: "Magnemite", types: ["Electric", "Steel"], habitats: ["Campsite", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/081.png", rarity: "Common", specialties: ["Generate"], conditions: ["Near electronics"] },
  { id: 82, nationalDex: 82, name: "Magneton", types: ["Electric", "Steel"], habitats: ["Elevated Tall Grass", "Illuminated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/082.png", rarity: "Rare", specialties: ["Generate"], conditions: ["Magnetic fields"] },
  { id: 83, nationalDex: 83, name: "Farfetch'd", types: ["Normal", "Flying"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/083.png", rarity: "Common", specialties: ["Chop"], conditions: ["Grass areas"] },
  { id: 84, nationalDex: 84, name: "Doduo", types: ["Normal", "Flying"], habitats: ["Shaded Beach", "Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/084.png", rarity: "Common", specialties: ["Fly", "Gather"], conditions: ["Open plains"] },
  { id: 85, nationalDex: 85, name: "Dodrio", types: ["Normal", "Flying"], habitats: ["Shaded Beach", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/085.png", rarity: "Common", specialties: ["Fly", "Gather"], conditions: ["Large plains"] },
  { id: 86, nationalDex: 86, name: "Seel", types: ["Water"], habitats: ["Seaside Tall Grass", "Hydrated Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/086.png", rarity: "Common", specialties: ["Water"], conditions: ["Cold water"] },
  { id: 87, nationalDex: 87, name: "Dewgong", types: ["Water", "Ice"], habitats: ["Seaside Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/087.png", rarity: "Common", specialties: ["Water"], conditions: ["Cold climate"] },
  { id: 88, nationalDex: 88, name: "Grimer", types: ["Poison"], habitats: ["Boulder-shaded Tall Grass", "Illuminated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/088.png", rarity: "Common", specialties: ["Recycle"], conditions: ["Polluted areas"] },
  { id: 89, nationalDex: 89, name: "Muk", types: ["Poison"], habitats: ["Illuminated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/089.png", rarity: "Common", specialties: ["Recycle"], conditions: ["Containment area"] },
  { id: 90, nationalDex: 90, name: "Shellder", types: ["Water"], habitats: ["Seaside Tall Grass", "Shaded Beach"], image: "https://www.serebii.net/pokemongo/pokemon/090.png", rarity: "Common", specialties: ["Water"], conditions: ["Ocean floor"] },
  
  // #091-100
  { id: 91, nationalDex: 91, name: "Cloyster", types: ["Water", "Ice"], habitats: ["Seaside Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/091.png", rarity: "Rare", specialties: ["Water"], conditions: ["Deep ocean"] },
  { id: 92, nationalDex: 92, name: "Gastly", types: ["Ghost", "Poison"], habitats: ["Illuminated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/092.png", rarity: "Common", specialties: ["Teleport"], conditions: ["Dark areas"] },
  { id: 93, nationalDex: 93, name: "Haunter", types: ["Ghost", "Poison"], habitats: ["Illuminated Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/093.png", rarity: "Common", specialties: ["Teleport"], conditions: ["Dark areas"] },
  { id: 94, nationalDex: 94, name: "Gengar", types: ["Ghost", "Poison"], habitats: ["Campsite", "Illuminated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/094.png", rarity: "Rare", specialties: ["Teleport", "Hype"], conditions: ["Special summoning"] },
  { id: 95, nationalDex: 95, name: "Onix", types: ["Rock", "Ground"], habitats: ["Elevated Tall Grass", "Illuminated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/095.png", rarity: "Common", specialties: ["Bulldoze", "Build"], conditions: ["Underground"] },
  { id: 96, nationalDex: 96, name: "Drowzee", types: ["Psychic"], habitats: ["Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/096.png", rarity: "Common", specialties: ["Teleport", "Yawn"], conditions: ["Near bedrooms"] },
  { id: 97, nationalDex: 97, name: "Hypno", types: ["Psychic"], habitats: ["Campsite", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/097.png", rarity: "Common", specialties: ["Teleport", "Yawn"], conditions: ["Quiet areas"] },
  { id: 98, nationalDex: 98, name: "Krabby", types: ["Water"], habitats: ["Seaside Tall Grass", "Shaded Beach"], image: "https://www.serebii.net/pokemongo/pokemon/098.png", rarity: "Common", specialties: ["Water", "Chop"], conditions: ["Sandy beaches"] },
  { id: 99, nationalDex: 99, name: "Kingler", types: ["Water"], habitats: ["Seaside Tall Grass", "Shaded Beach"], image: "https://www.serebii.net/pokemongo/pokemon/099.png", rarity: "Common", specialties: ["Water", "Chop", "Crush"], conditions: ["Rocky beaches"] },
  { id: 100, nationalDex: 100, name: "Voltorb", types: ["Electric"], habitats: ["Campsite", "Illuminated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/100.png", rarity: "Common", specialties: ["Generate", "Explode"], conditions: ["Near electronics"] },
  
  // #101-110
  { id: 101, nationalDex: 101, name: "Electrode", types: ["Electric"], habitats: ["Illuminated Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/101.png", rarity: "Common", specialties: ["Generate", "Explode"], conditions: ["Containment area"] },
  { id: 102, nationalDex: 102, name: "Exeggcute", types: ["Grass", "Psychic"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/102.png", rarity: "Common", specialties: ["Gather"], conditions: ["Warm areas"] },
  { id: 103, nationalDex: 103, name: "Exeggutor", types: ["Grass", "Psychic"], habitats: ["Shaded Beach", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/103.png", rarity: "Rare", specialties: ["Grow", "Chop"], conditions: ["Tropical areas"] },
  { id: 104, nationalDex: 104, name: "Cubone", types: ["Ground"], habitats: ["Boulder-shaded Tall Grass", "Illuminated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/104.png", rarity: "Common", specialties: ["Bulldoze"], conditions: ["Quiet areas"] },
  { id: 105, nationalDex: 105, name: "Marowak", types: ["Ground"], habitats: ["Elevated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/105.png", rarity: "Common", specialties: ["Bulldoze", "Chop"], conditions: ["Training grounds"] },
  { id: 106, nationalDex: 106, name: "Hitmonlee", types: ["Fighting"], habitats: ["Campsite", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/106.png", rarity: "Common", specialties: ["Build"], conditions: ["Training dojo"] },
  { id: 107, nationalDex: 107, name: "Hitmonchan", types: ["Fighting"], habitats: ["Campsite", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/107.png", rarity: "Common", specialties: ["Build"], conditions: ["Training dojo"] },
  { id: 108, nationalDex: 108, name: "Lickitung", types: ["Normal"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/108.png", rarity: "Common", specialties: ["Gather"], conditions: ["Food areas"] },
  { id: 109, nationalDex: 109, name: "Koffing", types: ["Poison"], habitats: ["Illuminated Tall Grass", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/109.png", rarity: "Common", specialties: ["Recycle"], conditions: ["Enclosed areas"] },
  { id: 110, nationalDex: 110, name: "Weezing", types: ["Poison"], habitats: ["Illuminated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/110.png", rarity: "Common", specialties: ["Recycle"], conditions: ["Containment areas"] },
  
  // #111-120
  { id: 111, nationalDex: 111, name: "Rhyhorn", types: ["Ground", "Rock"], habitats: ["Boulder-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/111.png", rarity: "Common", specialties: ["Bulldoze", "Crush"], conditions: ["Rocky terrain"] },
  { id: 112, nationalDex: 112, name: "Rhydon", types: ["Ground", "Rock"], habitats: ["Elevated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/112.png", rarity: "Rare", specialties: ["Bulldoze", "Crush", "Build"], conditions: ["Mountain habitat"] },
  { id: 113, nationalDex: 113, name: "Chansey", types: ["Normal"], habitats: ["Campsite", "Pretty Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/113.png", rarity: "Rare", specialties: ["Storage"], conditions: ["Peaceful areas"] },
  { id: 114, nationalDex: 114, name: "Tangela", types: ["Grass"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/114.png", rarity: "Common", specialties: ["Grow"], conditions: ["Grass areas"] },
  { id: 115, nationalDex: 115, name: "Kangaskhan", types: ["Normal"], habitats: ["Campsite", "Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/115.png", rarity: "Rare", specialties: ["Build"], conditions: ["Safe areas"] },
  { id: 116, nationalDex: 116, name: "Horsea", types: ["Water"], habitats: ["Seaside Tall Grass", "Hydrated Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/116.png", rarity: "Common", specialties: ["Water"], conditions: ["Clean water"] },
  { id: 117, nationalDex: 117, name: "Seadra", types: ["Water"], habitats: ["Seaside Tall Grass", "Shaded Beach"], image: "https://www.serebii.net/pokemongo/pokemon/117.png", rarity: "Common", specialties: ["Water"], conditions: ["Deep ocean"] },
  { id: 118, nationalDex: 118, name: "Goldeen", types: ["Water"], habitats: ["Hydrated Flower Bed", "Seaside Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/118.png", rarity: "Common", specialties: ["Water"], conditions: ["Clear water"] },
  { id: 119, nationalDex: 119, name: "Seaking", types: ["Water"], habitats: ["Hydrated Flower Bed", "Hydrated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/119.png", rarity: "Common", specialties: ["Water"], conditions: ["Flowing water"] },
  { id: 120, nationalDex: 120, name: "Staryu", types: ["Water"], habitats: ["Seaside Tall Grass", "Shaded Beach"], image: "https://www.serebii.net/pokemongo/pokemon/120.png", rarity: "Common", specialties: ["Water", "Illuminate"], conditions: ["Ocean areas"] },
  
  // #121-130
  { id: 121, nationalDex: 121, name: "Starmie", types: ["Water", "Psychic"], habitats: ["Seaside Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/121.png", rarity: "Rare", specialties: ["Water", "Illuminate", "Teleport"], conditions: ["Deep ocean"] },
  { id: 122, nationalDex: 122, name: "Mr. Mime", types: ["Psychic", "Fairy"], habitats: ["Campsite", "Pretty Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/122.png", rarity: "Common", specialties: ["Hype", "Build"], conditions: ["Performance areas"] },
  { id: 123, nationalDex: 123, name: "Scyther", types: ["Bug", "Flying"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/123.png", rarity: "Common", specialties: ["Chop", "Fly"], conditions: ["Forest areas"] },
  { id: 124, nationalDex: 124, name: "Jynx", types: ["Ice", "Psychic"], habitats: ["Campsite", "Hydrated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/124.png", rarity: "Common", specialties: ["Hype"], conditions: ["Cold areas"] },
  { id: 125, nationalDex: 125, name: "Electabuzz", types: ["Electric"], habitats: ["Campsite", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/125.png", rarity: "Common", specialties: ["Generate"], conditions: ["Power sources"] },
  { id: 126, nationalDex: 126, name: "Magmar", types: ["Fire"], habitats: ["Hydrated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/126.png", rarity: "Common", specialties: ["Burn"], conditions: ["Hot areas"] },
  { id: 127, nationalDex: 127, name: "Pinsir", types: ["Bug"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/127.png", rarity: "Common", specialties: ["Chop", "Crush"], conditions: ["Forest areas"] },
  { id: 128, nationalDex: 128, name: "Tauros", types: ["Normal"], habitats: ["Tall Grass", "Shaded Beach"], image: "https://www.serebii.net/pokemongo/pokemon/128.png", rarity: "Common", specialties: ["Bulldoze"], conditions: ["Open plains"] },
  { id: 129, nationalDex: 129, name: "Magikarp", types: ["Water"], habitats: ["Seaside Tall Grass", "Hydrated Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/129.png", rarity: "Common", specialties: ["Water"], conditions: ["Any water"] },
  { id: 130, nationalDex: 130, name: "Gyarados", types: ["Water", "Flying"], habitats: ["Seaside Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/130.png", rarity: "Rare", specialties: ["Water", "Fly"], conditions: ["Large water body"] },
  
  // #131-140
  { id: 131, nationalDex: 131, name: "Lapras", types: ["Water", "Ice"], habitats: ["Seaside Tall Grass", "Shaded Beach"], image: "https://www.serebii.net/pokemongo/pokemon/131.png", rarity: "Rare", specialties: ["Water", "Fly"], conditions: ["Tropical seaside"] },
  { id: 132, nationalDex: 132, name: "Ditto", types: ["Normal"], habitats: ["Campsite", "Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/132.png", rarity: "Common", specialties: ["Transform"], conditions: ["Any area"] },
  { id: 133, nationalDex: 133, name: "Eevee", types: ["Normal"], habitats: ["Pretty Flower Bed", "Field of Flowers"], image: "https://www.serebii.net/pokemongo/pokemon/133.png", rarity: "Common", specialties: ["Gather"], conditions: ["Field of Flowers"] },
  { id: 134, nationalDex: 134, name: "Vaporeon", types: ["Water"], habitats: ["Hydrated Flower Bed", "Seaside Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/134.png", rarity: "Rare", specialties: ["Water"], conditions: ["Water habitat"] },
  { id: 135, nationalDex: 135, name: "Jolteon", types: ["Electric"], habitats: ["Campsite", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/135.png", rarity: "Rare", specialties: ["Generate"], conditions: ["Stormy areas"] },
  { id: 136, nationalDex: 136, name: "Flareon", types: ["Fire"], habitats: ["Hydrated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/136.png", rarity: "Rare", specialties: ["Burn"], conditions: ["Warm areas"] },
  { id: 137, nationalDex: 137, name: "Porygon", types: ["Normal"], habitats: ["Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/137.png", rarity: "Common", specialties: ["Storage"], conditions: ["Digital area"] },
  { id: 138, nationalDex: 138, name: "Omanyte", types: ["Rock", "Water"], habitats: ["Seaside Tall Grass", "Illuminated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/138.png", rarity: "Common", specialties: ["Water"], conditions: ["Revived from fossil"] },
  { id: 139, nationalDex: 139, name: "Omastar", types: ["Rock", "Water"], habitats: ["Seaside Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/139.png", rarity: "Rare", specialties: ["Water", "Crush"], conditions: ["Deep ocean"] },
  { id: 140, nationalDex: 140, name: "Kabuto", types: ["Rock", "Water"], habitats: ["Seaside Tall Grass", "Illuminated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/140.png", rarity: "Common", specialties: ["Water"], conditions: ["Revived from fossil"] },
  
  // #141-150
  { id: 141, nationalDex: 141, name: "Kabutops", types: ["Rock", "Water"], habitats: ["Seaside Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/141.png", rarity: "Rare", specialties: ["Water", "Chop"], conditions: ["Deep ocean"] },
  { id: 142, nationalDex: 142, name: "Aerodactyl", types: ["Rock", "Flying"], habitats: ["Elevated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/142.png", rarity: "Rare", specialties: ["Fly", "Bulldoze"], conditions: ["High altitude"] },
  { id: 143, nationalDex: 143, name: "Snorlax", types: ["Normal"], habitats: ["Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/143.png", rarity: "Rare", specialties: ["Yawn", "Eat"], conditions: ["Large comfortable spaces"] },
  { id: 144, nationalDex: 144, name: "Articuno", types: ["Ice", "Flying"], habitats: ["Elevated Tall Grass", "Illuminated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/144.png", rarity: "Legendary", specialties: ["Fly"], conditions: ["Special summoning"] },
  { id: 145, nationalDex: 145, name: "Zapdos", types: ["Electric", "Flying"], habitats: ["Elevated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/145.png", rarity: "Legendary", specialties: ["Fly", "Generate"], conditions: ["Special summoning"] },
  { id: 146, nationalDex: 146, name: "Moltres", types: ["Fire", "Flying"], habitats: ["Elevated Tall Grass", "Hydrated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/146.png", rarity: "Legendary", specialties: ["Fly", "Burn"], conditions: ["Special summoning"] },
  { id: 147, nationalDex: 147, name: "Dratini", types: ["Dragon"], habitats: ["Hydrated Flower Bed", "Hydrated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/147.png", rarity: "Rare", specialties: ["Gather"], conditions: ["Clean water"] },
  { id: 148, nationalDex: 148, name: "Dragonair", types: ["Dragon"], habitats: ["Hydrated Flower Bed", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/148.png", rarity: "Rare", specialties: ["Gather", "Fly"], conditions: ["Deep water"] },
  { id: 149, nationalDex: 149, name: "Dragonite", types: ["Dragon", "Flying"], habitats: ["Campsite", "Seaside Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/149.png", rarity: "Rare", specialties: ["Fly", "Search"], conditions: ["Large territory"] },
  { id: 150, nationalDex: 150, name: "Mewtwo", types: ["Psychic"], habitats: ["Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/150.png", rarity: "Legendary", specialties: ["Teleport", "Fly"], conditions: ["Special summoning"] },
  
  // #151-160
  { id: 151, nationalDex: 151, name: "Mew", types: ["Psychic"], habitats: ["Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/151.png", rarity: "Legendary", specialties: ["Transform", "Teleport", "Fly"], conditions: ["Special event"] },
  { id: 152, nationalDex: 152, name: "Chikorita", types: ["Grass"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/152.png", rarity: "Common", specialties: ["Grow"], conditions: ["Sunny areas"] },
  { id: 153, nationalDex: 153, name: "Bayleef", types: ["Grass"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/153.png", rarity: "Common", specialties: ["Grow"], conditions: ["Forest areas"] },
  { id: 154, nationalDex: 154, name: "Meganium", types: ["Grass"], habitats: ["Pretty Flower Bed", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/154.png", rarity: "Rare", specialties: ["Grow"], conditions: ["Forest habitat"] },
  { id: 155, nationalDex: 155, name: "Cyndaquil", types: ["Fire"], habitats: ["Tall Grass", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/155.png", rarity: "Common", specialties: ["Burn"], conditions: ["Warm areas"] },
  { id: 156, nationalDex: 156, name: "Quilava", types: ["Fire"], habitats: ["Boulder-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/156.png", rarity: "Common", specialties: ["Burn"], conditions: ["Training grounds"] },
  { id: 157, nationalDex: 157, name: "Typhlosion", types: ["Fire"], habitats: ["Campsite", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/157.png", rarity: "Rare", specialties: ["Burn"], conditions: ["Special habitat"] },
  { id: 158, nationalDex: 158, name: "Totodile", types: ["Water"], habitats: ["Tall Grass", "Seaside Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/158.png", rarity: "Common", specialties: ["Water"], conditions: ["Water access"] },
  { id: 159, nationalDex: 159, name: "Croconaw", types: ["Water"], habitats: ["Seaside Tall Grass", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/159.png", rarity: "Common", specialties: ["Water"], conditions: ["Muddy areas"] },
  { id: 160, nationalDex: 160, name: "Feraligatr", types: ["Water"], habitats: ["Seaside Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/160.png", rarity: "Rare", specialties: ["Water", "Crush"], conditions: ["Large water body"] },
  
  // #161-170
  { id: 161, nationalDex: 161, name: "Sentret", types: ["Normal"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/161.png", rarity: "Common", specialties: ["Gather", "Search"], conditions: ["Open areas"] },
  { id: 162, nationalDex: 162, name: "Furret", types: ["Normal"], habitats: ["Pretty Flower Bed", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/162.png", rarity: "Common", specialties: ["Gather", "Search"], conditions: ["Underground areas"] },
  { id: 163, nationalDex: 163, name: "Hoothoot", types: ["Normal", "Flying"], habitats: ["Tree-shaded Tall Grass", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/163.png", rarity: "Common", specialties: ["Fly"], conditions: ["Trees"] },
  { id: 164, nationalDex: 164, name: "Noctowl", types: ["Normal", "Flying"], habitats: ["Elevated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/164.png", rarity: "Common", specialties: ["Fly", "Search"], conditions: ["Nighttime"] },
  { id: 165, nationalDex: 165, name: "Ledyba", types: ["Bug", "Flying"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/165.png", rarity: "Common", specialties: ["Gather", "Fly"], conditions: ["Flower gardens"] },
  { id: 166, nationalDex: 166, name: "Ledian", types: ["Bug", "Flying"], habitats: ["Pretty Flower Bed", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/166.png", rarity: "Common", specialties: ["Gather", "Fly"], conditions: ["Clear night skies"] },
  { id: 167, nationalDex: 167, name: "Spinarak", types: ["Bug", "Poison"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/167.png", rarity: "Common", specialties: ["Gather"], conditions: ["Corners"] },
  { id: 168, nationalDex: 168, name: "Ariados", types: ["Bug", "Poison"], habitats: ["Tree-shaded Tall Grass", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/168.png", rarity: "Common", specialties: ["Gather"], conditions: ["Dark corners"] },
  { id: 169, nationalDex: 169, name: "Crobat", types: ["Poison", "Flying"], habitats: ["Illuminated Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/169.png", rarity: "Common", specialties: ["Fly"], conditions: ["Caves"] },
  { id: 170, nationalDex: 170, name: "Chinchou", types: ["Water", "Electric"], habitats: ["Seaside Tall Grass", "Hydrated Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/170.png", rarity: "Common", specialties: ["Water", "Illuminate"], conditions: ["Deep water"] },
  
  // #171-180
  { id: 171, nationalDex: 171, name: "Lanturn", types: ["Water", "Electric"], habitats: ["Seaside Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/171.png", rarity: "Common", specialties: ["Water", "Illuminate"], conditions: ["Deep ocean"] },
  { id: 172, nationalDex: 172, name: "Pichu", types: ["Electric"], habitats: ["Campsite", "Field of Flowers"], image: "https://www.serebii.net/pokemongo/pokemon/172.png", rarity: "Common", specialties: ["Generate"], conditions: ["Near Pikachu"] },
  { id: 173, nationalDex: 173, name: "Cleffa", types: ["Fairy"], habitats: ["Pretty Flower Bed", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/173.png", rarity: "Common", specialties: ["Gather"], conditions: ["Near Clefairy"] },
  { id: 174, nationalDex: 174, name: "Igglybuff", types: ["Normal", "Fairy"], habitats: ["Pretty Flower Bed", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/174.png", rarity: "Common", specialties: ["Hype"], conditions: ["Near Jigglypuff"] },
  { id: 175, nationalDex: 175, name: "Togepi", types: ["Fairy"], habitats: ["Campsite", "Pretty Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/175.png", rarity: "Common", specialties: ["Gather"], conditions: ["Caring trainer"] },
  { id: 176, nationalDex: 176, name: "Togetic", types: ["Fairy", "Flying"], habitats: ["Campsite", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/176.png", rarity: "Rare", specialties: ["Fly", "Gather"], conditions: ["Pure heart area"] },
  { id: 177, nationalDex: 177, name: "Natu", types: ["Psychic", "Flying"], habitats: ["Boulder-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/177.png", rarity: "Common", specialties: ["Teleport", "Fly"], conditions: ["Trees"] },
  { id: 178, nationalDex: 178, name: "Xatu", types: ["Psychic", "Flying"], habitats: ["Elevated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/178.png", rarity: "Rare", specialties: ["Teleport", "Fly"], conditions: ["Sunny perches"] },
  { id: 179, nationalDex: 179, name: "Mareep", types: ["Electric"], habitats: ["Pretty Flower Bed", "Shaded Beach"], image: "https://www.serebii.net/pokemongo/pokemon/179.png", rarity: "Common", specialties: ["Generate"], conditions: ["Grass areas"] },
  { id: 180, nationalDex: 180, name: "Flaaffy", types: ["Electric"], habitats: ["Shaded Beach", "Pretty Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/180.png", rarity: "Common", specialties: ["Generate"], conditions: ["Open fields"] },
  
  // #181-190
  { id: 181, nationalDex: 181, name: "Ampharos", types: ["Electric"], habitats: ["Campsite", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/181.png", rarity: "Rare", specialties: ["Generate", "Illuminate"], conditions: ["High places"] },
  { id: 182, nationalDex: 182, name: "Bellossom", types: ["Grass"], habitats: ["Pretty Flower Bed", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/182.png", rarity: "Rare", specialties: ["Grow", "Hype"], conditions: ["Flower gardens"] },
  { id: 183, nationalDex: 183, name: "Marill", types: ["Water", "Fairy"], habitats: ["Hydrated Flower Bed", "Hydrated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/183.png", rarity: "Common", specialties: ["Water"], conditions: ["Water areas"] },
  { id: 184, nationalDex: 184, name: "Azumarill", types: ["Water", "Fairy"], habitats: ["Hydrated Flower Bed", "Seaside Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/184.png", rarity: "Common", specialties: ["Water"], conditions: ["Water habitat"] },
  { id: 185, nationalDex: 185, name: "Sudowoodo", types: ["Rock"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/185.png", rarity: "Common", specialties: ["Build"], conditions: ["Dry areas"] },
  { id: 186, nationalDex: 186, name: "Politoed", types: ["Water"], habitats: ["Hydrated Flower Bed", "Hydrated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/186.png", rarity: "Rare", specialties: ["Water", "Hype"], conditions: ["Water habitat"] },
  { id: 187, nationalDex: 187, name: "Hoppip", types: ["Grass", "Flying"], habitats: ["Pretty Flower Bed", "Shaded Beach"], image: "https://www.serebii.net/pokemongo/pokemon/187.png", rarity: "Common", specialties: ["Grow", "Fly"], conditions: ["Open fields"] },
  { id: 188, nationalDex: 188, name: "Skiploom", types: ["Grass", "Flying"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/188.png", rarity: "Common", specialties: ["Grow", "Fly"], conditions: ["Sunny areas"] },
  { id: 189, nationalDex: 189, name: "Jumpluff", types: ["Grass", "Flying"], habitats: ["Campsite", "Pretty Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/189.png", rarity: "Rare", specialties: ["Grow", "Fly"], conditions: ["Open sky"] },
  { id: 190, nationalDex: 190, name: "Aipom", types: ["Normal"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/190.png", rarity: "Common", specialties: ["Gather"], conditions: ["Trees"] },
  
  // #191-200
  { id: 191, nationalDex: 191, name: "Sunkern", types: ["Grass"], habitats: ["Pretty Flower Bed", "Shaded Beach"], image: "https://www.serebii.net/pokemongo/pokemon/191.png", rarity: "Common", specialties: ["Grow"], conditions: ["Sunny areas"] },
  { id: 192, nationalDex: 192, name: "Sunflora", types: ["Grass"], habitats: ["Pretty Flower Bed", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/192.png", rarity: "Common", specialties: ["Grow"], conditions: ["Sunny areas"] },
  { id: 193, nationalDex: 193, name: "Yanma", types: ["Bug", "Flying"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/193.png", rarity: "Common", specialties: ["Fly", "Search"], conditions: ["Open areas"] },
  { id: 194, nationalDex: 194, name: "Wooper", types: ["Water", "Ground"], habitats: ["Hydrated Flower Bed", "Hydrated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/194.png", rarity: "Common", specialties: ["Water"], conditions: ["Cold water"] },
  { id: 195, nationalDex: 195, name: "Quagsire", types: ["Water", "Ground"], habitats: ["Hydrated Flower Bed", "Seaside Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/195.png", rarity: "Common", specialties: ["Water"], conditions: ["Calm waters"] },
  { id: 196, nationalDex: 196, name: "Espeon", types: ["Psychic"], habitats: ["Campsite", "Pretty Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/196.png", rarity: "Rare", specialties: ["Teleport", "Search"], conditions: ["Daytime evolution"] },
  { id: 197, nationalDex: 197, name: "Umbreon", types: ["Dark"], habitats: ["Campsite", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/197.png", rarity: "Rare", specialties: ["Search"], conditions: ["Nighttime evolution"] },
  { id: 198, nationalDex: 198, name: "Murkrow", types: ["Dark", "Flying"], habitats: ["Illuminated Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/198.png", rarity: "Common", specialties: ["Fly", "Search"], conditions: ["Dark areas"] },
  { id: 199, nationalDex: 199, name: "Slowking", types: ["Water", "Psychic"], habitats: ["Seaside Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/199.png", rarity: "Rare", specialties: ["Water", "Search"], conditions: ["Water habitat"] },
  { id: 200, nationalDex: 200, name: "Misdreavus", types: ["Ghost"], habitats: ["Illuminated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/200.png", rarity: "Common", specialties: ["Teleport", "Hype"], conditions: ["Dark areas"] },
  
  // #201-210
  { id: 201, nationalDex: 201, name: "Unown", types: ["Psychic"], habitats: ["Illuminated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/201.png", rarity: "Rare", specialties: ["Search"], conditions: ["Special ruins"] },
  { id: 202, nationalDex: 202, name: "Wobbuffet", types: ["Psychic"], habitats: ["Campsite", "Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/202.png", rarity: "Common", specialties: ["Storage"], conditions: ["Calm areas"] },
  { id: 203, nationalDex: 203, name: "Girafarig", types: ["Normal", "Psychic"], habitats: ["Shaded Beach", "Pretty Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/203.png", rarity: "Common", specialties: ["Search"], conditions: ["Open areas"] },
  { id: 204, nationalDex: 204, name: "Pineco", types: ["Bug"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/204.png", rarity: "Common", specialties: ["Build"], conditions: ["Trees"] },
  { id: 205, nationalDex: 205, name: "Forretress", types: ["Bug", "Steel"], habitats: ["Boulder-shaded Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/205.png", rarity: "Common", specialties: ["Build", "Explode"], conditions: ["Metal-rich areas"] },
  { id: 206, nationalDex: 206, name: "Dunsparce", types: ["Normal"], habitats: ["Tree-shaded Tall Grass", "Illuminated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/206.png", rarity: "Common", specialties: ["Bulldoze"], conditions: ["Underground"] },
  { id: 207, nationalDex: 207, name: "Gligar", types: ["Ground", "Flying"], habitats: ["Boulder-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/207.png", rarity: "Common", specialties: ["Fly"], conditions: ["High places"] },
  { id: 208, nationalDex: 208, name: "Steelix", types: ["Steel", "Ground"], habitats: ["Elevated Tall Grass", "Illuminated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/208.png", rarity: "Rare", specialties: ["Build", "Bulldoze"], conditions: ["Deep underground"] },
  { id: 209, nationalDex: 209, name: "Snubbull", types: ["Fairy"], habitats: ["Pretty Flower Bed", "Field of Flowers"], image: "https://www.serebii.net/pokemongo/pokemon/209.png", rarity: "Common", specialties: ["Gather"], conditions: ["Urban areas"] },
  { id: 210, nationalDex: 210, name: "Granbull", types: ["Fairy"], habitats: ["Campsite", "Pretty Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/210.png", rarity: "Common", specialties: ["Gather", "Build"], conditions: ["Safe environment"] },
  
  // #211-220
  { id: 211, nationalDex: 211, name: "Qwilfish", types: ["Water", "Poison"], habitats: ["Seaside Tall Grass", "Hydrated Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/211.png", rarity: "Common", specialties: ["Water"], conditions: ["Clean water"] },
  { id: 212, nationalDex: 212, name: "Scizor", types: ["Bug", "Steel"], habitats: ["Campsite", "Pretty Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/212.png", rarity: "Rare", specialties: ["Chop", "Build"], conditions: ["Training grounds"] },
  { id: 213, nationalDex: 213, name: "Shuckle", types: ["Bug", "Rock"], habitats: ["Boulder-shaded Tall Grass", "Illuminated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/213.png", rarity: "Common", specialties: ["Storage", "Gather"], conditions: ["Rocky areas"] },
  { id: 214, nationalDex: 214, name: "Heracross", types: ["Bug", "Fighting"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/214.png", rarity: "Common", specialties: ["Chop", "Build"], conditions: ["Forest areas"] },
  { id: 215, nationalDex: 215, name: "Sneasel", types: ["Dark", "Ice"], habitats: ["Illuminated Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/215.png", rarity: "Common", specialties: ["Search"], conditions: ["Cold areas"] },
  { id: 216, nationalDex: 216, name: "Teddiursa", types: ["Normal"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/216.png", rarity: "Common", specialties: ["Gather Honey"], conditions: ["Forest areas"] },
  { id: 217, nationalDex: 217, name: "Ursaring", types: ["Normal"], habitats: ["Tree-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/217.png", rarity: "Common", specialties: ["Gather Honey", "Chop"], conditions: ["Forest territory"] },
  { id: 218, nationalDex: 218, name: "Slugma", types: ["Fire"], habitats: ["Hydrated Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/218.png", rarity: "Common", specialties: ["Burn"], conditions: ["Hot areas"] },
  { id: 219, nationalDex: 219, name: "Magcargo", types: ["Fire", "Rock"], habitats: ["Hydrated Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/219.png", rarity: "Common", specialties: ["Burn"], conditions: ["Volcanic areas"] },
  { id: 220, nationalDex: 220, name: "Swinub", types: ["Ice", "Ground"], habitats: ["Elevated Tall Grass", "Illuminated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/220.png", rarity: "Common", specialties: ["Search"], conditions: ["Cold areas"] },
  
  // #221-230
  { id: 221, nationalDex: 221, name: "Piloswine", types: ["Ice", "Ground"], habitats: ["Elevated Tall Grass", "Illuminated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/221.png", rarity: "Common", specialties: ["Search", "Bulldoze"], conditions: ["Cold open areas"] },
  { id: 222, nationalDex: 222, name: "Corsola", types: ["Water", "Rock"], habitats: ["Seaside Tall Grass", "Shaded Beach"], image: "https://www.serebii.net/pokemongo/pokemon/222.png", rarity: "Common", specialties: ["Build"], conditions: ["Warm ocean"] },
  { id: 223, nationalDex: 223, name: "Remoraid", types: ["Water"], habitats: ["Seaside Tall Grass", "Hydrated Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/223.png", rarity: "Common", specialties: ["Water"], conditions: ["Open water"] },
  { id: 224, nationalDex: 224, name: "Octillery", types: ["Water"], habitats: ["Seaside Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/224.png", rarity: "Common", specialties: ["Water", "Crush"], conditions: ["Rocky waters"] },
  { id: 225, nationalDex: 225, name: "Delibird", types: ["Ice", "Flying"], habitats: ["Elevated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/225.png", rarity: "Common", specialties: ["Fly", "Storage"], conditions: ["Cold areas"] },
  { id: 226, nationalDex: 226, name: "Mantine", types: ["Water", "Flying"], habitats: ["Seaside Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/226.png", rarity: "Common", specialties: ["Water", "Fly"], conditions: ["Open ocean"] },
  { id: 227, nationalDex: 227, name: "Skarmory", types: ["Steel", "Flying"], habitats: ["Elevated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/227.png", rarity: "Common", specialties: ["Fly", "Build"], conditions: ["High perches"] },
  { id: 228, nationalDex: 228, name: "Houndour", types: ["Dark", "Fire"], habitats: ["Boulder-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/228.png", rarity: "Common", specialties: ["Burn", "Search"], conditions: ["Dark areas"] },
  { id: 229, nationalDex: 229, name: "Houndoom", types: ["Dark", "Fire"], habitats: ["Campsite", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/229.png", rarity: "Rare", specialties: ["Burn", "Search"], conditions: ["Fire habitat"] },
  { id: 230, nationalDex: 230, name: "Kingdra", types: ["Water", "Dragon"], habitats: ["Seaside Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/230.png", rarity: "Rare", specialties: ["Water"], conditions: ["Deep ocean"] },
  
  // #231-240
  { id: 231, nationalDex: 231, name: "Phanpy", types: ["Ground"], habitats: ["Shaded Beach", "Pretty Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/231.png", rarity: "Common", specialties: ["Bulldoze", "Gather"], conditions: ["Open areas"] },
  { id: 232, nationalDex: 232, name: "Donphan", types: ["Ground"], habitats: ["Boulder-shaded Tall Grass", "Shaded Beach"], image: "https://www.serebii.net/pokemongo/pokemon/232.png", rarity: "Common", specialties: ["Bulldoze", "Gather"], conditions: ["Open plains"] },
  { id: 233, nationalDex: 233, name: "Porygon2", types: ["Normal"], habitats: ["Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/233.png", rarity: "Rare", specialties: ["Storage"], conditions: ["Digital area"] },
  { id: 234, nationalDex: 234, name: "Stantler", types: ["Normal"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/234.png", rarity: "Common", specialties: ["Search"], conditions: ["Forest areas"] },
  { id: 235, nationalDex: 235, name: "Smeargle", types: ["Normal"], habitats: ["Campsite", "Pretty Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/235.png", rarity: "Common", specialties: ["Paint"], conditions: ["Artistic spaces"] },
  { id: 236, nationalDex: 236, name: "Tyrogue", types: ["Fighting"], habitats: ["Campsite", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/236.png", rarity: "Common", specialties: ["Build"], conditions: ["Training dojo"] },
  { id: 237, nationalDex: 237, name: "Hitmontop", types: ["Fighting"], habitats: ["Campsite", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/237.png", rarity: "Common", specialties: ["Build"], conditions: ["Training dojo"] },
  { id: 238, nationalDex: 238, name: "Smoochum", types: ["Ice", "Psychic"], habitats: ["Campsite", "Hydrated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/238.png", rarity: "Common", specialties: ["Hype"], conditions: ["Cold areas"] },
  { id: 239, nationalDex: 239, name: "Elekid", types: ["Electric"], habitats: ["Campsite", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/239.png", rarity: "Common", specialties: ["Generate"], conditions: ["Near Electabuzz"] },
  { id: 240, nationalDex: 240, name: "Magby", types: ["Fire"], habitats: ["Hydrated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/240.png", rarity: "Common", specialties: ["Burn"], conditions: ["Hot areas"] },
  
  // #241-250
  { id: 241, nationalDex: 241, name: "Miltank", types: ["Normal"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/241.png", rarity: "Common", specialties: ["Gather", "Storage"], conditions: ["Grass areas"] },
  { id: 242, nationalDex: 242, name: "Blissey", types: ["Normal"], habitats: ["Campsite", "Pretty Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/242.png", rarity: "Rare", specialties: ["Storage"], conditions: ["Peaceful areas"] },
  { id: 243, nationalDex: 243, name: "Raikou", types: ["Electric"], habitats: ["Elevated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/243.png", rarity: "Legendary", specialties: ["Generate"], conditions: ["Special summoning"] },
  { id: 244, nationalDex: 244, name: "Entei", types: ["Fire"], habitats: ["Elevated Tall Grass", "Hydrated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/244.png", rarity: "Legendary", specialties: ["Burn"], conditions: ["Special summoning"] },
  { id: 245, nationalDex: 245, name: "Suicune", types: ["Water"], habitats: ["Hydrated Flower Bed", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/245.png", rarity: "Legendary", specialties: ["Water"], conditions: ["Special summoning"] },
  { id: 246, nationalDex: 246, name: "Larvitar", types: ["Rock", "Ground"], habitats: ["Boulder-shaded Tall Grass", "Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/246.png", rarity: "Common", specialties: ["Bulldoze", "Crush"], conditions: ["Mossy habitat"] },
  { id: 247, nationalDex: 247, name: "Pupitar", types: ["Rock", "Ground"], habitats: ["Boulder-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/247.png", rarity: "Common", specialties: ["Bulldoze", "Crush"], conditions: ["Rocky terrain"] },
  { id: 248, nationalDex: 248, name: "Tyranitar", types: ["Rock", "Dark"], habitats: ["Boulder-shaded Tall Grass", "Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/248.png", rarity: "Rare", specialties: ["Bulldoze", "Crush", "Build"], conditions: ["Large territory"] },
  { id: 249, nationalDex: 249, name: "Lugia", types: ["Psychic", "Flying"], habitats: ["Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/249.png", rarity: "Legendary", specialties: ["Fly", "Teleport"], conditions: ["Special summoning"] },
  { id: 250, nationalDex: 250, name: "Ho-Oh", types: ["Fire", "Flying"], habitats: ["Campsite", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/250.png", rarity: "Legendary", specialties: ["Fly", "Burn"], conditions: ["Special summoning"] },
  
  // #251-260
  { id: 251, nationalDex: 251, name: "Celebi", types: ["Psychic", "Grass"], habitats: ["Campsite", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/251.png", rarity: "Legendary", specialties: ["Teleport", "Grow"], conditions: ["Special event"] },
  { id: 252, nationalDex: 252, name: "Treecko", types: ["Grass"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/252.png", rarity: "Common", specialties: ["Grow"], conditions: ["Trees"] },
  { id: 253, nationalDex: 253, name: "Grovyle", types: ["Grass"], habitats: ["Tree-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/253.png", rarity: "Common", specialties: ["Grow", "Chop"], conditions: ["Forest areas"] },
  { id: 254, nationalDex: 254, name: "Sceptile", types: ["Grass"], habitats: ["Elevated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/254.png", rarity: "Rare", specialties: ["Grow", "Chop"], conditions: ["Forest habitat"] },
  { id: 255, nationalDex: 255, name: "Torchic", types: ["Fire"], habitats: ["Tall Grass", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/255.png", rarity: "Common", specialties: ["Burn"], conditions: ["Warm areas"] },
  { id: 256, nationalDex: 256, name: "Combusken", types: ["Fire", "Fighting"], habitats: ["Boulder-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/256.png", rarity: "Common", specialties: ["Burn", "Build"], conditions: ["Running space"] },
  { id: 257, nationalDex: 257, name: "Blaziken", types: ["Fire", "Fighting"], habitats: ["Campsite", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/257.png", rarity: "Rare", specialties: ["Burn", "Build"], conditions: ["Special habitat"] },
  { id: 258, nationalDex: 258, name: "Mudkip", types: ["Water"], habitats: ["Tall Grass", "Seaside Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/258.png", rarity: "Common", specialties: ["Water"], conditions: ["Water access"] },
  { id: 259, nationalDex: 259, name: "Marshtomp", types: ["Water", "Ground"], habitats: ["Seaside Tall Grass", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/259.png", rarity: "Common", specialties: ["Water", "Bulldoze"], conditions: ["Muddy areas"] },
  { id: 260, nationalDex: 260, name: "Swampert", types: ["Water", "Ground"], habitats: ["Seaside Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/260.png", rarity: "Rare", specialties: ["Water", "Bulldoze"], conditions: ["Large water body"] },
  
  // #261-270
  { id: 261, nationalDex: 261, name: "Poochyena", types: ["Dark"], habitats: ["Tall Grass", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/261.png", rarity: "Common", specialties: ["Search"], conditions: ["Open areas"] },
  { id: 262, nationalDex: 262, name: "Mightyena", types: ["Dark"], habitats: ["Boulder-shaded Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/262.png", rarity: "Common", specialties: ["Search"], conditions: ["Pack members"] },
  { id: 263, nationalDex: 263, name: "Zigzagoon", types: ["Normal"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/263.png", rarity: "Common", specialties: ["Gather", "Search"], conditions: ["Exploration areas"] },
  { id: 264, nationalDex: 264, name: "Linoone", types: ["Normal"], habitats: ["Pretty Flower Bed", "Shaded Beach"], image: "https://www.serebii.net/pokemongo/pokemon/264.png", rarity: "Common", specialties: ["Gather", "Search"], conditions: ["Straight paths"] },
  { id: 265, nationalDex: 265, name: "Wurmple", types: ["Bug"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/265.png", rarity: "Common", specialties: ["Gather"], conditions: ["Trees"] },
  { id: 266, nationalDex: 266, name: "Silcoon", types: ["Bug"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/266.png", rarity: "Common", specialties: [], conditions: ["Tree branches"] },
  { id: 267, nationalDex: 267, name: "Beautifly", types: ["Bug", "Flying"], habitats: ["Pretty Flower Bed", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/267.png", rarity: "Common", specialties: ["Gather", "Fly"], conditions: ["Flower gardens"] },
  { id: 268, nationalDex: 268, name: "Cascoon", types: ["Bug"], habitats: ["Tree-shaded Tall Grass", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/268.png", rarity: "Common", specialties: [], conditions: ["Sheltered areas"] },
  { id: 269, nationalDex: 269, name: "Dustox", types: ["Bug", "Poison"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/269.png", rarity: "Common", specialties: ["Gather"], conditions: ["Nighttime"] },
  { id: 270, nationalDex: 270, name: "Lotad", types: ["Water", "Grass"], habitats: ["Seaside Tall Grass", "Pretty Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/270.png", rarity: "Common", specialties: ["Water", "Grow"], conditions: ["Ponds"] },
  
  // #271-280
  { id: 271, nationalDex: 271, name: "Lombre", types: ["Water", "Grass"], habitats: ["Seaside Tall Grass", "Pretty Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/271.png", rarity: "Common", specialties: ["Water", "Grow"], conditions: ["Nighttime"] },
  { id: 272, nationalDex: 272, name: "Ludicolo", types: ["Water", "Grass"], habitats: ["Seaside Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/272.png", rarity: "Rare", specialties: ["Water", "Grow", "Hype"], conditions: ["Music"] },
  { id: 273, nationalDex: 273, name: "Seedot", types: ["Grass"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/273.png", rarity: "Common", specialties: ["Grow"], conditions: ["Oak trees"] },
  { id: 274, nationalDex: 274, name: "Nuzleaf", types: ["Grass", "Dark"], habitats: ["Pretty Flower Bed", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/274.png", rarity: "Common", specialties: ["Grow", "Chop"], conditions: ["Forest areas"] },
  { id: 275, nationalDex: 275, name: "Shiftry", types: ["Grass", "Dark"], habitats: ["Elevated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/275.png", rarity: "Rare", specialties: ["Grow", "Chop", "Fly"], conditions: ["Ancient trees"] },
  { id: 276, nationalDex: 276, name: "Taillow", types: ["Normal", "Flying"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/276.png", rarity: "Common", specialties: ["Fly"], conditions: ["Open sky"] },
  { id: 277, nationalDex: 277, name: "Swellow", types: ["Normal", "Flying"], habitats: ["Elevated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/277.png", rarity: "Common", specialties: ["Fly"], conditions: ["High places"] },
  { id: 278, nationalDex: 278, name: "Wingull", types: ["Water", "Flying"], habitats: ["Seaside Tall Grass", "Shaded Beach"], image: "https://www.serebii.net/pokemongo/pokemon/278.png", rarity: "Common", specialties: ["Water", "Fly"], conditions: ["Ocean areas"] },
  { id: 279, nationalDex: 279, name: "Pelipper", types: ["Water", "Flying"], habitats: ["Seaside Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/279.png", rarity: "Common", specialties: ["Water", "Fly"], conditions: ["Coastal areas"] },
  { id: 280, nationalDex: 280, name: "Ralts", types: ["Psychic", "Fairy"], habitats: ["Pretty Flower Bed", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/280.png", rarity: "Common", specialties: ["Teleport"], conditions: ["Positive atmosphere"] },
  
  // #281-290
  { id: 281, nationalDex: 281, name: "Kirlia", types: ["Psychic", "Fairy"], habitats: ["Pretty Flower Bed", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/281.png", rarity: "Common", specialties: ["Teleport", "Hype"], conditions: ["Sunny days"] },
  { id: 282, nationalDex: 282, name: "Gardevoir", types: ["Psychic", "Fairy"], habitats: ["Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/282.png", rarity: "Rare", specialties: ["Teleport"], conditions: ["High friendship"] },
  { id: 283, nationalDex: 283, name: "Surskit", types: ["Bug", "Water"], habitats: ["Hydrated Flower Bed", "Hydrated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/283.png", rarity: "Common", specialties: ["Water"], conditions: ["Still water"] },
  { id: 284, nationalDex: 284, name: "Masquerain", types: ["Bug", "Flying"], habitats: ["Seaside Tall Grass", "Pretty Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/284.png", rarity: "Common", specialties: ["Fly"], conditions: ["Water areas"] },
  { id: 285, nationalDex: 285, name: "Shroomish", types: ["Grass"], habitats: ["Tree-shaded Tall Grass", "Pretty Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/285.png", rarity: "Common", specialties: ["Grow"], conditions: ["Damp areas"] },
  { id: 286, nationalDex: 286, name: "Breloom", types: ["Grass", "Fighting"], habitats: ["Tree-shaded Tall Grass", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/286.png", rarity: "Common", specialties: ["Grow", "Build"], conditions: ["Training grounds"] },
  { id: 287, nationalDex: 287, name: "Slakoth", types: ["Normal"], habitats: ["Pretty Flower Bed", "Tree-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/287.png", rarity: "Common", specialties: ["Yawn"], conditions: ["Trees"] },
  { id: 288, nationalDex: 288, name: "Vigoroth", types: ["Normal"], habitats: ["Pretty Flower Bed", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/288.png", rarity: "Common", specialties: ["Build"], conditions: ["Exercise areas"] },
  { id: 289, nationalDex: 289, name: "Slaking", types: ["Normal"], habitats: ["Campsite", "Pretty Flower Bed"], image: "https://www.serebii.net/pokemongo/pokemon/289.png", rarity: "Rare", specialties: ["Yawn"], conditions: ["Large comfort zones"] },
  { id: 290, nationalDex: 290, name: "Nincada", types: ["Bug", "Ground"], habitats: ["Tree-shaded Tall Grass", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/290.png", rarity: "Common", specialties: ["Bulldoze"], conditions: ["Underground"] },
  
  // #291-300
  { id: 291, nationalDex: 291, name: "Ninjask", types: ["Bug", "Flying"], habitats: ["Pretty Flower Bed", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/291.png", rarity: "Common", specialties: ["Fly"], conditions: ["Open areas"] },
  { id: 292, nationalDex: 292, name: "Shedinja", types: ["Bug", "Ghost"], habitats: ["Campsite", "Illuminated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/292.png", rarity: "Rare", specialties: ["Search"], conditions: ["Special conditions"] },
  { id: 293, nationalDex: 293, name: "Whismur", types: ["Normal"], habitats: ["Illuminated Tall Grass", "Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/293.png", rarity: "Common", specialties: ["Hype"], conditions: ["Quiet areas"] },
  { id: 294, nationalDex: 294, name: "Loudred", types: ["Normal"], habitats: ["Boulder-shaded Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/294.png", rarity: "Common", specialties: ["Hype"], conditions: ["Open areas"] },
  { id: 295, nationalDex: 295, name: "Exploud", types: ["Normal"], habitats: ["Campsite", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/295.png", rarity: "Rare", specialties: ["Hype"], conditions: ["Isolated areas"] },
  { id: 296, nationalDex: 296, name: "Makuhita", types: ["Fighting"], habitats: ["Boulder-shaded Tall Grass", "Elevated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/296.png", rarity: "Common", specialties: ["Build"], conditions: ["Training grounds"] },
  { id: 297, nationalDex: 297, name: "Hariyama", types: ["Fighting"], habitats: ["Elevated Tall Grass", "Campsite"], image: "https://www.serebii.net/pokemongo/pokemon/297.png", rarity: "Rare", specialties: ["Build"], conditions: ["Sumo ring"] },
  { id: 298, nationalDex: 298, name: "Azurill", types: ["Normal", "Fairy"], habitats: ["Hydrated Flower Bed", "Hydrated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/298.png", rarity: "Common", specialties: ["Water"], conditions: ["Water areas"] },
  { id: 299, nationalDex: 299, name: "Nosepass", types: ["Rock"], habitats: ["Elevated Tall Grass", "Illuminated Tall Grass"], image: "https://www.serebii.net/pokemongo/pokemon/299.png", rarity: "Common", specialties: ["Search"], conditions: ["Magnetic areas"] },
  { id: 300, nationalDex: 300, name: "Skitty", types: ["Normal"], habitats: ["Pretty Flower Bed", "Field of Flowers"], image: "https://www.serebii.net/pokemongo/pokemon/300.png", rarity: "Common", specialties: ["Gather", "Search"], conditions: ["Garden areas"] },
];

// Enrich each Pokemon with map locations from the location data
// This uses the pokemonToLocations mapping built from pokemon-locations.json
export const pokemonList: Pokemon[] = _rawPokemonList.map(pokemon => ({
  ...pokemon,
  locations: getLocationsForPokemon(pokemon.name),
}));

// Habitat detailed info (simplified - no icons)
export interface HabitatInfo {
  id: number;
  name: string;
  category: string;
  buildConditions: string[];
  buildItems: string[];
  residents: string[];
  notes?: string;
}

export const detailedHabitatList: HabitatInfo[] = [
  { id: 1, name: "Tall Grass", category: "Basic", buildConditions: ["Any time", "Any weather"], buildItems: ["4x Tall Grass"], residents: ["Bulbasaur", "Charmander", "Squirtle", "Oddish"], notes: "The most basic habitat. Good for starter Pokémon." },
  { id: 2, name: "Tree-Shaded Tall Grass", category: "Basic", buildConditions: ["Tree nearby"], buildItems: ["1x Large Tree", "4x Tall Grass"], residents: ["Scyther", "Bellsprout", "Pinsir", "Heracross"], notes: "Adds shade for grass-dwelling Pokémon." },
  { id: 3, name: "Hydrated Tall Grass", category: "Water", buildConditions: ["Water source"], buildItems: ["4x Tall Grass", "2x Water"], residents: ["Squirtle", "Wartortle", "Blastoise", "Sliggoo"], notes: "Attracts Water-type Pokémon to grassy areas." },
  { id: 4, name: "Seaside Tall Grass", category: "Water", buildConditions: ["Near ocean"], buildItems: ["4x Tall Grass", "2x Ocean Water"], residents: ["Slowpoke", "Slowbro", "Slowking"], notes: "Perfect for coastal Pokémon." },
  { id: 5, name: "Pretty Flower Bed", category: "Garden", buildConditions: ["Any time"], buildItems: ["4x Wildflowers"], residents: ["Pidgey", "Combee", "Eevee", "Magby"], notes: "Beautiful habitat that attracts flying and fairy types." },
  { id: 6, name: "Mossy Rest Spot", category: "Rocky", buildConditions: ["Moss terrain"], buildItems: ["4x Moss"], residents: ["Larvitar", "Tyranitar"], notes: "Very rare Tyranitar may appear after several days!" },
  { id: 7, name: "Hot Spring", category: "Water", buildConditions: ["Hot spring source"], buildItems: ["2x Hot Spring Water", "1x Shower", "1x Seat"], residents: ["Psyduck", "Golduck", "Torkoal"], notes: "Relaxing habitat for water-loving Pokémon." },
  { id: 8, name: "Tropical Vibes", category: "Beach", buildConditions: ["Beach area"], buildItems: ["1x Large Palm Tree", "4x Seashore Flowers"], residents: ["Gloom", "Exeggcute", "Exeggutor"], notes: "Tropical paradise habitat." },
];

// Move data
export interface Move {
  id: number;
  name: string;
  type: string;
  category: string;
  description: string;
  worldEffect: string;
  unlockCondition: string;
}

export const moves: Move[] = [
  { id: 1, name: "Rototiller", type: "Ground", category: "Terrain", description: "Tills the soil to prepare for planting.", worldEffect: "Creates fertile soil for crops and flowers.", unlockCondition: "Starting move" },
  { id: 2, name: "Sunny Day", type: "Fire", category: "Weather", description: "Changes the weather to sunny.", worldEffect: "Increases temperature, helps fire types, dries wet areas.", unlockCondition: "Obtain Castform weather charm" },
  { id: 3, name: "Rain Dance", type: "Water", category: "Weather", description: "Changes the weather to rainy.", worldEffect: "Increases humidity, waters crops, helps water types.", unlockCondition: "Obtain Castform weather charm" },
  { id: 4, name: "Rock Smash", type: "Fighting", category: "Terrain", description: "Breaks rocks blocking paths.", worldEffect: "Destroys small boulders, creates gravel paths.", unlockCondition: "Complete Rocky Ridges quest" },
  { id: 5, name: "Cut", type: "Normal", category: "Terrain", description: "Cuts through tall grass and small trees.", worldEffect: "Clears overgrown areas, gathers lumber.", unlockCondition: "Starting move" },
  { id: 6, name: "Strength", type: "Normal", category: "Terrain", description: "Moves heavy boulders.", worldEffect: "Push large rocks to create new paths or habitats.", unlockCondition: "Gym Badge reward" },
  { id: 7, name: "Flash", type: "Electric", category: "Light", description: "Illuminates dark areas.", worldEffect: "Lights up caves, powers streetlights at night.", unlockCondition: "Explore first cave" },
  { id: 8, name: "Surf", type: "Water", category: "Travel", description: "Travel across water.", worldEffect: "Access new islands, discover hidden areas.", unlockCondition: "Complete ocean quest" },
];

// Request/Quest data
export interface Request {
  id: number;
  name: string;
  category: string;
  description: string;
  rewards: string[];
  unlocks: string[];
  status: "available" | "in_progress" | "completed";
}

export const requests: Request[] = [
  { id: 1, name: "Yawn up a Storm!", category: "Story", description: "Help the sleepy Snorlax wake up the town.", rewards: ["Snorlax Habitat Blueprint", "500 PokéCoins"], unlocks: ["Naptime Bed recipe"], status: "available" },
  { id: 2, name: "Brighten Things Up!", category: "Story", description: "Bring light to the dark caves of Pokopia.", rewards: ["Flash ability", "Lantern recipe"], unlocks: ["Cave exploration"], status: "available" },
  { id: 3, name: "Time to Party!", category: "Event", description: "Set up the perfect party for the Pokémon celebration.", rewards: ["Party items", "Special Pikachu"], unlocks: ["Party habitat decorations"], status: "in_progress" },
  { id: 4, name: "Rebuild the Huge Building!", category: "Story", description: "Help restore the abandoned building to its former glory.", rewards: ["New shop", "Gym access"], unlocks: ["Urban habitat types"], status: "available" },
  { id: 5, name: "Do the Team Initiation Challenge?", category: "Battle", description: "Prove your worth to join the exploration team.", rewards: ["Team membership", "Special badge"], unlocks: ["Boulder-shaded Tall Grass", "Seaside Tall Grass"], status: "completed" },
];

// Cloud Islands posts
export interface CloudIslandPost {
  id: number;
  islandCode: string;
  title: string;
  description: string;
  author: string;
  screenshots: string[];
  likes: number;
  isDream: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export const cloudIslandsPosts: CloudIslandPost[] = [
  { id: 1, islandCode: "PKOP-DEV-001", title: "Developer's Paradise", description: "The official Pokopia developer showcase island. Featuring all habitat types and hidden secrets!", author: "Pokopia Team", screenshots: [], likes: 9999, isDream: true, isFeatured: true, createdAt: "2026-03-01" },
  { id: 2, islandCode: "LAPR-2024", title: "Lapras Lagoon", description: "A beautiful tropical paradise with waterfalls and hot springs. Perfect for water types!", author: "TrainerBlue", screenshots: [], likes: 342, isDream: true, isFeatured: false, createdAt: "2026-03-10" },
  { id: 3, islandCode: "ROCK-8888", title: "Rocky Mountain High", description: "Mountain-themed island with caves, boulders, and rare Tyranitar sightings!", author: "RockMaster", screenshots: [], likes: 156, isDream: false, isFeatured: false, createdAt: "2026-03-12" },
];

// Mystery Gifts
export interface MysteryGift {
  id: number;
  name: string;
  description: string;
  type: "item" | "pokemon" | "currency" | "special";
  expiresAt: string;
  claimed: boolean;
  image?: string;
}

export const mysteryGifts: MysteryGift[] = [
  { id: 1, name: "Spring Celebration Gift", description: "Celebrate spring with 500 Dexter Coins and a special flower crown!", type: "special", expiresAt: "March 31, 2026", claimed: false },
  { id: 2, name: "Daily Login Bonus", description: "50 Dexter Coins for logging in today!", type: "currency", expiresAt: "Daily reset", claimed: false },
  { id: 3, name: "Rare Habitat Pack", description: "Contains materials for building a Mossy Rest Spot habitat.", type: "item", expiresAt: "March 20, 2026", claimed: true },
];
