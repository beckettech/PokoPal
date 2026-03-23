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
  conditions?: string[]; // legacy - not used in UI
  time?: "Any" | "Day" | "Night"; // Time of day condition
  weather?: "Any" | "Sunny" | "Rainy" | "Snowy" | "Foggy" | "Cloudy"; // Weather condition
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
  conditions?: string[]; // legacy
  time?: "Any" | "Day" | "Night";
  weather?: "Any" | "Sunny" | "Rainy" | "Snowy" | "Foggy" | "Cloudy";
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
  { id: 1, nationalDex: null, name: "Bulbasaur", types: ["Grow"], habitats: ["Tall Grass","Bench with greenery"], image: "https://www.serebii.net/pokemonpokopia/pokemon/001.png", rarity: "Common", specialties: ["Grow"], locations: ["Withered Wastelands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 2, nationalDex: null, name: "Ivysaur", types: ["Grow"], habitats: ["Field of Flowers","Bench with greenery"], image: "https://www.serebii.net/pokemonpokopia/pokemon/002.png", rarity: "Rare", specialties: ["Grow"], locations: ["Withered Wastelands","Cloud Island"], time: "Any", weather: "Any" },
  { id: 3, nationalDex: null, name: "Venusaur", types: ["Grow","Litter"], habitats: ["Field of Flowers","Garden Terrace"], image: "https://www.serebii.net/pokemonpokopia/pokemon/003.png", rarity: "Rare", specialties: ["Grow","Litter"], locations: ["Withered Wastelands"], time: "Any", weather: "Any" },
  { id: 4, nationalDex: null, name: "Charmander", types: ["Burn"], habitats: ["Tall Grass"], image: "https://www.serebii.net/pokemonpokopia/pokemon/004.png", rarity: "Common", specialties: ["Burn"], locations: [], time: "Any", weather: "Any" },
  { id: 5, nationalDex: null, name: "Charmeleon", types: ["Burn"], habitats: ["Campsite"], image: "https://www.serebii.net/pokemonpokopia/pokemon/005.png", rarity: "Common", specialties: ["Burn"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 6, nationalDex: null, name: "Charizard", types: ["Burn","Fly"], habitats: ["Tall Grass","Berry-feast Campsite"], image: "https://www.serebii.net/pokemonpokopia/pokemon/006.png", rarity: "Rare", specialties: ["Burn","Fly"], locations: ["Withered Wastelands","Palette Town"], time: "Any", weather: "Sun,Cloud" },
  { id: 7, nationalDex: null, name: "Squirtle", types: ["Water"], habitats: ["Tall Grass","Hydrated tall grass"], image: "https://www.serebii.net/pokemonpokopia/pokemon/007.png", rarity: "Common", specialties: ["Water"], locations: ["Withered Wastelands","Palette Town"], time: "Any", weather: "Any" },
  { id: 8, nationalDex: null, name: "Wartortle", types: ["Water"], habitats: ["Hydrated tall grass"], image: "https://www.serebii.net/pokemonpokopia/pokemon/008.png", rarity: "Rare", specialties: ["Water"], locations: ["Withered Wastelands","Palette Town"], time: "Any", weather: "Any" },
  { id: 9, nationalDex: null, name: "Blastoise", types: ["Water","Trade"], habitats: ["Hydrated tall grass","Floating in the shade"], image: "https://www.serebii.net/pokemonpokopia/pokemon/009.png", rarity: "Rare", specialties: ["Water","Trade"], locations: ["Withered Wastelands","Palette Town"], time: "Any", weather: "Any" },
  { id: 16, nationalDex: null, name: "Pidgey", types: ["Fly","Search"], habitats: ["Elevated tall grass","Pretty flower bed"], image: "https://www.serebii.net/pokemonpokopia/pokemon/016.png", rarity: "Common", specialties: ["Fly","Search"], locations: ["Withered Wastelands","Palette Town"], time: "Any", weather: "Any" },
  { id: 17, nationalDex: null, name: "Pidgeotto", types: ["Fly","Search"], habitats: ["Elevated tall grass","Pretty flower bed"], image: "https://www.serebii.net/pokemonpokopia/pokemon/017.png", rarity: "Rare", specialties: ["Fly","Search"], locations: ["Withered Wastelands","Palette Town"], time: "Morning,Day,Evening", weather: "Any" },
  { id: 18, nationalDex: null, name: "Pidgeot", types: ["Fly","Chop"], habitats: ["Luxury chirp-chirp meal"], image: "https://www.serebii.net/pokemonpokopia/pokemon/018.png", rarity: "Common", specialties: ["Fly","Chop"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Morning,Day,Evening", weather: "Any" },
  { id: 23, nationalDex: null, name: "Ekans", types: ["Search"], habitats: ["Hydrated graceful flower bed"], image: "https://www.serebii.net/pokemonpokopia/pokemon/023.png", rarity: "Common", specialties: ["Search"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 24, nationalDex: null, name: "Arbok", types: ["Search"], habitats: ["Hydrated graceful flower bed"], image: "https://www.serebii.net/pokemonpokopia/pokemon/024.png", rarity: "Rare", specialties: ["Search"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 25, nationalDex: null, name: "Pikachu", types: ["Generate"], habitats: ["Picnic Set"], image: "https://www.serebii.net/pokemonpokopia/pokemon/025.png", rarity: "Rare", specialties: ["Generate"], locations: ["Palette Town"], time: "Any", weather: "Any" },
  { id: 26, nationalDex: null, name: "Raichu", types: ["Generate","Hype"], habitats: ["Nature's market"], image: "https://www.serebii.net/pokemonpokopia/pokemon/026.png", rarity: "Common", specialties: ["Generate","Hype"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 35, nationalDex: null, name: "Clefairy", types: ["Hype"], habitats: ["Graceful flower bed","Bronze landmark"], image: "https://www.serebii.net/pokemonpokopia/pokemon/035.png", rarity: "Common", specialties: ["Hype"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Night", weather: "Any" },
  { id: 36, nationalDex: null, name: "Clefable", types: ["Hype","Trade"], habitats: ["Graceful flower bed","Bronze landmark"], image: "https://www.serebii.net/pokemonpokopia/pokemon/036.png", rarity: "Rare", specialties: ["Hype","Trade"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Night", weather: "Any" },
  { id: 37, nationalDex: null, name: "Vulpix", types: ["Burn"], habitats: ["Fluffy flower bed"], image: "https://www.serebii.net/pokemonpokopia/pokemon/037.png", rarity: "Common", specialties: ["Burn"], locations: ["Sparkling Skylands"], time: "Any", weather: "Any" },
  { id: 38, nationalDex: null, name: "Ninetales", types: ["Burn"], habitats: ["Fluffy flower bed","Nine flames"], image: "https://www.serebii.net/pokemonpokopia/pokemon/038.png", rarity: "Rare", specialties: ["Burn"], locations: ["Sparkling Skylands"], time: "Any", weather: "Any" },
  { id: 39, nationalDex: null, name: "Jigglypuff", types: ["Hype"], habitats: ["Flower garden stump stage","Recital stage"], image: "https://www.serebii.net/pokemonpokopia/pokemon/039.png", rarity: "Common", specialties: ["Hype"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 40, nationalDex: null, name: "Wigglytuff", types: ["Hype","Trade"], habitats: ["Recital stage"], image: "https://www.serebii.net/pokemonpokopia/pokemon/040.png", rarity: "Rare", specialties: ["Hype","Trade"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 41, nationalDex: null, name: "Zubat", types: ["Search"], habitats: ["Tree-shaded Yellow tall grass","Park bench"], image: "https://www.serebii.net/pokemonpokopia/pokemon/041.png", rarity: "Common", specialties: ["Search"], locations: ["Bleak Beach"], time: "Night", weather: "Any" },
  { id: 42, nationalDex: null, name: "Golbat", types: ["Search"], habitats: ["Tree-shaded Yellow tall grass"], image: "https://www.serebii.net/pokemonpokopia/pokemon/042.png", rarity: "Rare", specialties: ["Search"], locations: ["Bleak Beach"], time: "Night", weather: "Any" },
  { id: 43, nationalDex: null, name: "Oddish", types: ["Grow"], habitats: ["Tall Grass"], image: "https://www.serebii.net/pokemonpokopia/pokemon/043.png", rarity: "Common", specialties: ["Grow"], locations: ["Withered Wastelands","Palette Town"], time: "Night", weather: "Any" },
  { id: 44, nationalDex: null, name: "Gloom", types: ["Grow"], habitats: ["Tropical vibes"], image: "https://www.serebii.net/pokemonpokopia/pokemon/044.png", rarity: "Common", specialties: ["Grow"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 45, nationalDex: null, name: "Vileplume", types: ["Grow","Litter"], habitats: ["Chansey Resting area"], image: "https://www.serebii.net/pokemonpokopia/pokemon/045.png", rarity: "Rare", specialties: ["Grow","Litter"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 46, nationalDex: null, name: "Paras", types: ["Search"], habitats: ["Elevated flower bed","Flower garden"], image: "https://www.serebii.net/pokemonpokopia/pokemon/046.png", rarity: "Common", specialties: ["Search"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 47, nationalDex: null, name: "Parasect", types: ["Search"], habitats: ["Elevated flower bed","Flower garden"], image: "https://www.serebii.net/pokemonpokopia/pokemon/047.png", rarity: "Rare", specialties: ["Search"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 48, nationalDex: null, name: "Venonat", types: ["Search"], habitats: ["Illuminated tall grass","Illuminated bench"], image: "https://www.serebii.net/pokemonpokopia/pokemon/048.png", rarity: "Common", specialties: ["Search"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Night", weather: "Any" },
  { id: 49, nationalDex: null, name: "Venomoth", types: ["Search"], habitats: ["Illuminated tall grass","Illuminated bench"], image: "https://www.serebii.net/pokemonpokopia/pokemon/049.png", rarity: "Rare", specialties: ["Search"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Night", weather: "Any" },
  { id: 50, nationalDex: null, name: "Diglett", types: ["Hype"], habitats: ["Tree-shaded red tall grass","Container snacking"], image: "https://www.serebii.net/pokemonpokopia/pokemon/050.png", rarity: "Common", specialties: ["Hype"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 51, nationalDex: null, name: "Dugtrio", types: ["Hype","Crush"], habitats: ["Tree-shaded red tall grass","House party"], image: "https://www.serebii.net/pokemonpokopia/pokemon/051.png", rarity: "Rare", specialties: ["Hype","Crush"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 52, nationalDex: null, name: "Meowth", types: ["Trade"], habitats: ["Resting spot","Working the register"], image: "https://www.serebii.net/pokemonpokopia/pokemon/052.png", rarity: "Common", specialties: ["Trade"], locations: ["Bleak Beach","Palette Town"], time: "Any", weather: "Any" },
  { id: 53, nationalDex: null, name: "Persian", types: ["Trade","Search"], habitats: ["Evil organization HQ"], image: "https://www.serebii.net/pokemonpokopia/pokemon/053.png", rarity: "Common", specialties: ["Trade","Search"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 54, nationalDex: null, name: "Psyduck", types: ["Search"], habitats: ["Hot-spring shower"], image: "https://www.serebii.net/pokemonpokopia/pokemon/054.png", rarity: "Common", specialties: ["Search"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 55, nationalDex: null, name: "Golduck", types: ["Search"], habitats: ["Hot-spring shower"], image: "https://www.serebii.net/pokemonpokopia/pokemon/055.png", rarity: "Rare", specialties: ["Search"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 58, nationalDex: null, name: "Growlithe", types: ["Burn","Search"], habitats: ["Perpetual mess","Resort meal prep"], image: "https://www.serebii.net/pokemonpokopia/pokemon/058.png", rarity: "Common", specialties: ["Burn","Search"], locations: ["Bleak Beach"], time: "Any", weather: "Any" },
  { id: 59, nationalDex: null, name: "Arcanine", types: ["Burn","Search"], habitats: ["Mini museum","Magma fishing spot"], image: "https://www.serebii.net/pokemonpokopia/pokemon/059.png", rarity: "Rare", specialties: ["Burn","Search"], locations: ["Rocky Ridges"], time: "Any", weather: "Any" },
  { id: 60, nationalDex: null, name: "Poliwag", types: ["Water"], habitats: ["Squeaky clean"], image: "https://www.serebii.net/pokemonpokopia/pokemon/060.png", rarity: "Common", specialties: ["Water"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 61, nationalDex: null, name: "Poliwhirl", types: ["Water"], habitats: ["Hydrated fluffy flower bed"], image: "https://www.serebii.net/pokemonpokopia/pokemon/061.png", rarity: "Rare", specialties: ["Water"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 62, nationalDex: null, name: "Poliwrath", types: ["Water","Build"], habitats: ["Sewer hole inspection","Dojo training"], image: "https://www.serebii.net/pokemonpokopia/pokemon/062.png", rarity: "Common", specialties: ["Water","Build"], locations: ["Palette Town"], time: "Any", weather: "Any" },
  { id: 63, nationalDex: null, name: "Abra", types: ["Teleport"], habitats: ["Surging psychic power","Fortune-teller's table"], image: "https://www.serebii.net/pokemonpokopia/pokemon/063.png", rarity: "Common", specialties: ["Teleport"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 64, nationalDex: null, name: "Kadabra", types: ["Teleport"], habitats: ["Fortune-teller's table"], image: "https://www.serebii.net/pokemonpokopia/pokemon/064.png", rarity: "Rare", specialties: ["Teleport"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 65, nationalDex: null, name: "Alakazam", types: ["Teleport","Trade"], habitats: ["Surging psychic power","Experiment Space"], image: "https://www.serebii.net/pokemonpokopia/pokemon/065.png", rarity: "Rare", specialties: ["Teleport","Trade"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 66, nationalDex: null, name: "Machop", types: ["Build","Gather"], habitats: ["Boulder-shaded Tall Grass"], image: "https://www.serebii.net/pokemonpokopia/pokemon/066.png", rarity: "Common", specialties: ["Build","Gather"], locations: ["Withered Wastelands","Palette Town"], time: "Any", weather: "Any" },
  { id: 67, nationalDex: null, name: "Machoke", types: ["Build","Gather"], habitats: ["Grassy training field","Box to the rhythm"], image: "https://www.serebii.net/pokemonpokopia/pokemon/067.png", rarity: "Common", specialties: ["Build","Gather"], locations: ["Rocky Ridges"], time: "Any", weather: "Any" },
  { id: 68, nationalDex: null, name: "Machamp", types: ["Build","Gather"], habitats: ["Grassy training field","Clink-clang iron construction"], image: "https://www.serebii.net/pokemonpokopia/pokemon/068.png", rarity: "Rare", specialties: ["Build","Gather"], locations: ["Rocky Ridges"], time: "Any", weather: "Any" },
  { id: 69, nationalDex: null, name: "Bellsprout", types: ["Grow","Litter"], habitats: ["Tree-shaded tall grass"], image: "https://www.serebii.net/pokemonpokopia/pokemon/069.png", rarity: "Common", specialties: ["Grow","Litter"], locations: ["Withered Wastelands","Palette Town"], time: "Any", weather: "Any" },
  { id: 70, nationalDex: null, name: "Weepinbell", types: ["Grow","Litter"], habitats: ["Flowery table","Irresistible scent and glow"], image: "https://www.serebii.net/pokemonpokopia/pokemon/070.png", rarity: "Rare", specialties: ["Grow","Litter"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 71, nationalDex: null, name: "Victreebel", types: ["Grow","Chop"], habitats: ["Flowery table","Irresistible scent and glow"], image: "https://www.serebii.net/pokemonpokopia/pokemon/071.png", rarity: "Rare", specialties: ["Grow","Chop"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 74, nationalDex: null, name: "Geodude", types: ["Crush"], habitats: ["Tall Grass"], image: "https://www.serebii.net/pokemonpokopia/pokemon/074.png", rarity: "Common", specialties: ["Crush"], locations: ["Withered Wastelands","Palette Town"], time: "Any", weather: "Any" },
  { id: 75, nationalDex: null, name: "Graveler", types: ["Crush"], habitats: ["Mossy boulder"], image: "https://www.serebii.net/pokemonpokopia/pokemon/075.png", rarity: "Common", specialties: ["Crush"], locations: ["Rocky Ridges"], time: "Any", weather: "Any" },
  { id: 76, nationalDex: null, name: "Golem", types: ["Crush","Trade"], habitats: ["Mossy boulder"], image: "https://www.serebii.net/pokemonpokopia/pokemon/076.png", rarity: "Rare", specialties: ["Crush","Trade"], locations: ["Rocky Ridges"], time: "Any", weather: "Any" },
  { id: 79, nationalDex: null, name: "Slowpoke", types: ["Water","Yawn"], habitats: ["Seaside Tall Grass"], image: "https://www.serebii.net/pokemonpokopia/pokemon/079.png", rarity: "Common", specialties: ["Water","Yawn"], locations: ["Withered Wastelands"], time: "Any", weather: "Any" },
  { id: 80, nationalDex: null, name: "Slowbro", types: ["Water","Trade"], habitats: ["Seaside Tall Grass","Bed with a plush"], image: "https://www.serebii.net/pokemonpokopia/pokemon/080.png", rarity: "Rare", specialties: ["Water","Trade"], locations: ["Withered Wastelands","Palette Town"], time: "Any", weather: "Any" },
  { id: 81, nationalDex: null, name: "Magnemite", types: ["Generate"], habitats: ["Factory Storage"], image: "https://www.serebii.net/pokemonpokopia/pokemon/081.png", rarity: "Common", specialties: ["Generate"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 82, nationalDex: null, name: "Magneton", types: ["Generate"], habitats: ["Trash can central","Mini Game Corner"], image: "https://www.serebii.net/pokemonpokopia/pokemon/082.png", rarity: "Rare", specialties: ["Generate"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 83, nationalDex: null, name: "Farfetch'd", types: ["Chop","Build"], habitats: ["All packed up"], image: "https://www.serebii.net/pokemonpokopia/pokemon/083.png", rarity: "Common", specialties: ["Chop","Build"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 88, nationalDex: null, name: "Grimer", types: ["Litter"], habitats: ["Marsh fishing spot"], image: "https://www.serebii.net/pokemonpokopia/pokemon/088.png", rarity: "Common", specialties: ["Litter"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 89, nationalDex: null, name: "Muk", types: ["Litter"], habitats: ["Marsh fishing spot"], image: "https://www.serebii.net/pokemonpokopia/pokemon/089.png", rarity: "Rare", specialties: ["Litter"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 92, nationalDex: null, name: "Gastly", types: ["Gather","Trade"], habitats: ["Spooky study"], image: "https://www.serebii.net/pokemonpokopia/pokemon/092.png", rarity: "Common", specialties: ["Gather","Trade"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Night", weather: "Any" },
  { id: 93, nationalDex: null, name: "Haunter", types: ["Gather","Trade"], habitats: ["Surprise in store","Spooky study"], image: "https://www.serebii.net/pokemonpokopia/pokemon/093.png", rarity: "Common", specialties: ["Gather","Trade"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Night", weather: "Any" },
  { id: 94, nationalDex: null, name: "Gengar", types: ["Gather","Trade"], habitats: ["Surprise in store"], image: "https://www.serebii.net/pokemonpokopia/pokemon/094.png", rarity: "Rare", specialties: ["Gather","Trade"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Night", weather: "Any" },
  { id: 95, nationalDex: null, name: "Onix", types: ["Crush","Bulldoze"], habitats: ["Smooth tall grass"], image: "https://www.serebii.net/pokemonpokopia/pokemon/095.png", rarity: "Common", specialties: ["Crush","Bulldoze"], locations: ["Withered Wastelands"], time: "Any", weather: "Any" },
  { id: 100, nationalDex: null, name: "Voltorb", types: ["Generate","Explode"], habitats: ["Park bench","Playing pirate"], image: "https://www.serebii.net/pokemonpokopia/pokemon/100.png", rarity: "Common", specialties: ["Generate","Explode"], locations: ["Bleak Beach"], time: "Any", weather: "Any" },
  { id: 101, nationalDex: null, name: "Electrode", types: ["Generate","Explode"], habitats: ["Park bench","Playing pirate"], image: "https://www.serebii.net/pokemonpokopia/pokemon/101.png", rarity: "Common", specialties: ["Generate","Explode"], locations: ["Bleak Beach"], time: "Any", weather: "Any" },
  { id: 102, nationalDex: null, name: "Exeggcute", types: ["Grow","Teleport"], habitats: ["Tropical vibes","Shaded beach","Red tall grass"], image: "https://www.serebii.net/pokemonpokopia/pokemon/102.png", rarity: "Common", specialties: ["Grow","Teleport"], locations: ["Rocky Ridges"], time: "Any", weather: "Any" },
  { id: 103, nationalDex: null, name: "Exeggutor", types: ["Grow","Teleport"], habitats: ["Tropical vibes","Shaded beach"], image: "https://www.serebii.net/pokemonpokopia/pokemon/103.png", rarity: "Rare", specialties: ["Grow","Teleport"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 104, nationalDex: null, name: "Cubone", types: ["Build"], habitats: ["Grave with flowers"], image: "https://www.serebii.net/pokemonpokopia/pokemon/104.png", rarity: "Common", specialties: ["Build"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 105, nationalDex: null, name: "Marowak", types: ["Build"], habitats: ["Grave with flowers"], image: "https://www.serebii.net/pokemonpokopia/pokemon/105.png", rarity: "Rare", specialties: ["Build"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 106, nationalDex: null, name: "Hitmonlee", types: ["Trade"], habitats: ["Urgent Care"], image: "https://www.serebii.net/pokemonpokopia/pokemon/106.png", rarity: "Common", specialties: ["Trade"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 107, nationalDex: null, name: "Hitmonchan", types: ["Trade"], habitats: ["Exercise resting spot"], image: "https://www.serebii.net/pokemonpokopia/pokemon/107.png", rarity: "Common", specialties: ["Trade"], locations: ["Withered Wastelands"], time: "Any", weather: "Any" },
  { id: 109, nationalDex: null, name: "Koffing", types: ["Recycle"], habitats: ["Trash collection site"], image: "https://www.serebii.net/pokemonpokopia/pokemon/109.png", rarity: "Common", specialties: ["Recycle"], locations: ["Palette Town","Bleak Beach"], time: "Any", weather: "Any" },
  { id: 110, nationalDex: null, name: "Weezing", types: ["Recycle"], habitats: ["Good old-fashioned antiques","Trash collection site"], image: "https://www.serebii.net/pokemonpokopia/pokemon/110.png", rarity: "Common", specialties: ["Recycle"], locations: ["Palette Town","Bleak Beach"], time: "Any", weather: "Any" },
  { id: 113, nationalDex: null, name: "Chansey", types: ["Trade"], habitats: ["Full recovery"], image: "https://www.serebii.net/pokemonpokopia/pokemon/113.png", rarity: "Common", specialties: ["Trade"], locations: ["Bleak Beach"], time: "Any", weather: "Any" },
  { id: 114, nationalDex: null, name: "Tangela", types: ["Grow","Litter"], habitats: ["Nothin' but Poke Balls"], image: "https://www.serebii.net/pokemonpokopia/pokemon/114.png", rarity: "Common", specialties: ["Grow","Litter"], locations: ["Palette Town"], time: "Any", weather: "Any" },
  { id: 122, nationalDex: null, name: "Mr. Mime", types: ["Gather","Build"], habitats: ["Spotless Washing station"], image: "https://www.serebii.net/pokemonpokopia/pokemon/122.png", rarity: "Common", specialties: ["Gather","Build"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 123, nationalDex: null, name: "Scyther", types: ["Chop"], habitats: ["Tree-shaded tall grass"], image: "https://www.serebii.net/pokemonpokopia/pokemon/123.png", rarity: "Common", specialties: ["Chop"], locations: ["Withered Wastelands","Palette Town"], time: "Any", weather: "Any" },
  { id: 125, nationalDex: null, name: "Electabuzz", types: ["Generate"], habitats: ["Trash can central","Light-up stage"], image: "https://www.serebii.net/pokemonpokopia/pokemon/125.png", rarity: "Rare", specialties: ["Generate"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 126, nationalDex: null, name: "Magmar", types: ["Burn"], habitats: ["Digging and burning"], image: "https://www.serebii.net/pokemonpokopia/pokemon/126.png", rarity: "Common", specialties: ["Burn"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 127, nationalDex: null, name: "Pinsir", types: ["Chop","Build"], habitats: ["Tree-shaded tall grass"], image: "https://www.serebii.net/pokemonpokopia/pokemon/127.png", rarity: "Rare", specialties: ["Chop","Build"], locations: ["Withered Wastelands","Palette Town"], time: "Any", weather: "Any" },
  { id: 129, nationalDex: null, name: "Magikarp", types: ["???"], habitats: ["Ocean fishing spot"], image: "https://www.serebii.net/pokemonpokopia/pokemon/129.png", rarity: "Common", specialties: ["???"], locations: ["Withered Wastelands"], time: "Any", weather: "Any" },
  { id: 130, nationalDex: null, name: "Gyarados", types: ["Water"], habitats: ["Illuminated waterfall"], image: "https://www.serebii.net/pokemonpokopia/pokemon/130.png", rarity: "Common", specialties: ["Water"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 131, nationalDex: null, name: "Lapras", types: ["Water"], habitats: ["Tropical seaside"], image: "https://www.serebii.net/pokemonpokopia/pokemon/131.png", rarity: "Common", specialties: ["Water"], locations: ["Bleak Beach"], time: "Any", weather: "Any" },
  { id: 132, nationalDex: null, name: "Ditto", types: ["Transform"], habitats: [], image: "https://www.serebii.net/pokemonpokopia/pokemon/132.png", rarity: "Common", specialties: ["Transform"], locations: [], time: "Any", weather: "Any" },
  { id: 133, nationalDex: null, name: "Eevee", types: ["Trade"], habitats: ["Pretty flower bed"], image: "https://www.serebii.net/pokemonpokopia/pokemon/133.png", rarity: "Common", specialties: ["Trade"], locations: ["Withered Wastelands","Palette Town"], time: "Any", weather: "Any" },
  { id: 134, nationalDex: null, name: "Vaporeon", types: ["Water"], habitats: ["Boundless blue beverage"], image: "https://www.serebii.net/pokemonpokopia/pokemon/134.png", rarity: "Common", specialties: ["Water"], locations: ["Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 135, nationalDex: null, name: "Jolteon", types: ["Generate"], habitats: ["Electrifying potatoes"], image: "https://www.serebii.net/pokemonpokopia/pokemon/135.png", rarity: "Common", specialties: ["Generate"], locations: ["Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 136, nationalDex: null, name: "Flareon", types: ["Burn"], habitats: ["Burning-hot spice"], image: "https://www.serebii.net/pokemonpokopia/pokemon/136.png", rarity: "Common", specialties: ["Burn"], locations: ["Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 137, nationalDex: null, name: "Porygon", types: ["Recycle"], habitats: ["Researcher's desk"], image: "https://www.serebii.net/pokemonpokopia/pokemon/137.png", rarity: "Common", specialties: ["Recycle"], locations: ["Sparkling Skylands"], time: "Any", weather: "Any" },
  { id: 142, nationalDex: null, name: "Aerodactyl", types: ["Fly"], habitats: ["Wing Fossil Display"], image: "https://www.serebii.net/pokemonpokopia/pokemon/142.png", rarity: "Common", specialties: ["Fly"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 143, nationalDex: null, name: "Mosslax", types: ["Eat"], habitats: ["Gourmet's altar"], image: "https://www.serebii.net/pokemonpokopia/pokemon/143-mosslax.png", rarity: "Common", specialties: ["Eat"], locations: [], time: "Any", weather: "Any" },
  { id: 144, nationalDex: null, name: "Articuno", types: ["Fly"], habitats: [], image: "https://www.serebii.net/pokemonpokopia/pokemon/144.png", rarity: "Legendary", specialties: ["Fly"], locations: [], time: "Any", weather: "Any" },
  { id: 145, nationalDex: null, name: "Zapdos", types: ["Fly"], habitats: [], image: "https://www.serebii.net/pokemonpokopia/pokemon/145.png", rarity: "Legendary", specialties: ["Fly"], locations: [], time: "Any", weather: "Any" },
  { id: 146, nationalDex: null, name: "Moltres", types: ["Fly"], habitats: [], image: "https://www.serebii.net/pokemonpokopia/pokemon/146.png", rarity: "Legendary", specialties: ["Fly"], locations: [], time: "Any", weather: "Any" },
  { id: 147, nationalDex: null, name: "Dratini", types: ["Water"], habitats: ["Hydrated fluffy flower bed","Simple bathroom"], image: "https://www.serebii.net/pokemonpokopia/pokemon/147.png", rarity: "Common", specialties: ["Water"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 148, nationalDex: null, name: "Dragonair", types: ["Water"], habitats: ["Hydrated fluffy flower bed","Simple bathroom"], image: "https://www.serebii.net/pokemonpokopia/pokemon/148.png", rarity: "Rare", specialties: ["Water"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 149, nationalDex: null, name: "Dragonite", types: ["Water","Fly"], habitats: ["Waterside dinghy"], image: "https://www.serebii.net/pokemonpokopia/pokemon/149.png", rarity: "Common", specialties: ["Water","Fly"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 150, nationalDex: null, name: "Mewtwo", types: ["Teleport"], habitats: [], image: "https://www.serebii.net/pokemonpokopia/pokemon/150.png", rarity: "Legendary", specialties: ["Teleport"], locations: [], time: "Any", weather: "Any" },
  { id: 151, nationalDex: null, name: "Mew", types: ["Teleport"], habitats: [], image: "https://www.serebii.net/pokemonpokopia/pokemon/151.png", rarity: "Legendary", specialties: ["Teleport"], locations: [], time: "Any", weather: "Any" },
  { id: 155, nationalDex: null, name: "Cyndaquil", types: ["Burn"], habitats: ["Concrete pipe secret base"], image: "https://www.serebii.net/pokemonpokopia/pokemon/155.png", rarity: "Common", specialties: ["Burn"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 156, nationalDex: null, name: "Quilava", types: ["Burn"], habitats: ["Concrete pipe secret base","Fireplace nap spot"], image: "https://www.serebii.net/pokemonpokopia/pokemon/156.png", rarity: "Common", specialties: ["Burn"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 157, nationalDex: null, name: "Typhlosion", types: ["Burn","Trade"], habitats: ["Fireplace nap spot","Top pop"], image: "https://www.serebii.net/pokemonpokopia/pokemon/157.png", rarity: "Rare", specialties: ["Burn","Trade"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 163, nationalDex: null, name: "Hoothoot", types: ["Trade","Fly"], habitats: ["Elevated tall grass","Pretty flower bed","Gently lit bed"], image: "https://www.serebii.net/pokemonpokopia/pokemon/163.png", rarity: "Common", specialties: ["Trade","Fly"], locations: ["Withered Wastelands","Palette Town"], time: "Night", weather: "Any" },
  { id: 164, nationalDex: null, name: "Noctowl", types: ["Trade","Fly"], habitats: ["Elevated tall grass","Gently lit bed"], image: "https://www.serebii.net/pokemonpokopia/pokemon/164.png", rarity: "Rare", specialties: ["Trade","Fly"], locations: ["Withered Wastelands"], time: "Any", weather: "Any" },
  { id: 167, nationalDex: null, name: "Spinarak", types: ["Litter"], habitats: ["Yellow tall grass"], image: "https://www.serebii.net/pokemonpokopia/pokemon/167.png", rarity: "Common", specialties: ["Litter"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 168, nationalDex: null, name: "Ariados", types: ["Litter"], habitats: ["Yellow tall grass"], image: "https://www.serebii.net/pokemonpokopia/pokemon/168.png", rarity: "Rare", specialties: ["Litter"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 169, nationalDex: null, name: "Crobat", types: ["Search","Chop"], habitats: ["Elevated yellow tall grass","Trash disposal site"], image: "https://www.serebii.net/pokemonpokopia/pokemon/169.png", rarity: "Rare", specialties: ["Search","Chop"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Night", weather: "Any" },
  { id: 172, nationalDex: null, name: "Pichu", types: ["Generate"], habitats: ["Picnic Set"], image: "https://www.serebii.net/pokemonpokopia/pokemon/172.png", rarity: "Common", specialties: ["Generate"], locations: ["Palette Town"], time: "Any", weather: "Any" },
  { id: 173, nationalDex: null, name: "Cleffa", types: ["Hype"], habitats: ["Graceful flower bed"], image: "https://www.serebii.net/pokemonpokopia/pokemon/173.png", rarity: "Common", specialties: ["Hype"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Night", weather: "Any" },
  { id: 174, nationalDex: null, name: "Igglybuff", types: ["Hype"], habitats: ["Flower garden stump stage"], image: "https://www.serebii.net/pokemonpokopia/pokemon/174.png", rarity: "Common", specialties: ["Hype"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 179, nationalDex: null, name: "Mareep", types: ["Generate","Litter"], habitats: ["Overgrowth vending machine","Knitting station"], image: "https://www.serebii.net/pokemonpokopia/pokemon/179.png", rarity: "Rare", specialties: ["Generate","Litter"], locations: ["Bleak Beach"], time: "Any", weather: "Any" },
  { id: 180, nationalDex: null, name: "Flaaffy", types: ["Generate","Litter"], habitats: ["Night festival venue","Knitting station"], image: "https://www.serebii.net/pokemonpokopia/pokemon/180.png", rarity: "Common", specialties: ["Generate","Litter"], locations: ["Bleak Beach"], time: "Any", weather: "Any" },
  { id: 181, nationalDex: null, name: "Ampharos", types: ["Generate","Trade"], habitats: ["Plain life"], image: "https://www.serebii.net/pokemonpokopia/pokemon/181.png", rarity: "Rare", specialties: ["Generate","Trade"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 182, nationalDex: null, name: "Bellossom", types: ["Grow","Hype"], habitats: ["Chansey Resting area"], image: "https://www.serebii.net/pokemonpokopia/pokemon/182.png", rarity: "Rare", specialties: ["Grow","Hype"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 183, nationalDex: null, name: "Marill", types: ["Water","Hype"], habitats: ["Hydrated yellow tall grass","Dock"], image: "https://www.serebii.net/pokemonpokopia/pokemon/183.png", rarity: "Rare", specialties: ["Water","Hype"], locations: ["Bleak Beach"], time: "Any", weather: "Any" },
  { id: 184, nationalDex: null, name: "Azumarill", types: ["Water","Build"], habitats: ["Dock"], image: "https://www.serebii.net/pokemonpokopia/pokemon/184.png", rarity: "Rare", specialties: ["Water","Build"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Rain" },
  { id: 185, nationalDex: null, name: "Sudowoodo", types: ["Trade"], habitats: ["Tree-shaded red tall grass","House party"], image: "https://www.serebii.net/pokemonpokopia/pokemon/185.png", rarity: "Rare", specialties: ["Trade"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 186, nationalDex: null, name: "Politoed", types: ["Water","Hype"], habitats: ["Hydrated graceful flower bed","Flower garden stump stage","Harmonious hot spring"], image: "https://www.serebii.net/pokemonpokopia/pokemon/186.png", rarity: "Rare", specialties: ["Water","Hype"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 194, nationalDex: null, name: "Paldean Wooper", types: ["Litter"], habitats: ["Marshy tall grass"], image: "https://www.serebii.net/pokemonpokopia/pokemon/194-p.png", rarity: "Common", specialties: ["Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 196, nationalDex: null, name: "Espeon", types: ["Gather"], habitats: ["Elegant daytime treats"], image: "https://www.serebii.net/pokemonpokopia/pokemon/196.png", rarity: "Common", specialties: ["Gather"], locations: ["Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 197, nationalDex: null, name: "Umbreon", types: ["Search"], habitats: ["Dark-chocolate cookies"], image: "https://www.serebii.net/pokemonpokopia/pokemon/197.png", rarity: "Common", specialties: ["Search"], locations: ["Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 198, nationalDex: null, name: "Murkrow", types: ["Trade","Fly"], habitats: ["Elevated red tall grass","Tree-shaded graceful flower bed"], image: "https://www.serebii.net/pokemonpokopia/pokemon/198.png", rarity: "Common", specialties: ["Trade","Fly"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Night", weather: "Any" },
  { id: 199, nationalDex: null, name: "Slowking", types: ["Water","Teleport"], habitats: ["Seaside Tall Grass","Bed with a plush","Fishing pond"], image: "https://www.serebii.net/pokemonpokopia/pokemon/199.png", rarity: "Rare", specialties: ["Water","Teleport"], locations: ["Withered Wastelands","Palette Town"], time: "Any", weather: "Any" },
  { id: 200, nationalDex: null, name: "Misdreavus", types: ["Trade"], habitats: ["Fluffy flower bed","Office storeroom"], image: "https://www.serebii.net/pokemonpokopia/pokemon/200.png", rarity: "Common", specialties: ["Trade"], locations: ["Sparkling Skylands"], time: "Night", weather: "Any" },
  { id: 203, nationalDex: null, name: "Girafarig", types: ["Gather"], habitats: ["Tree-shaded fluffy flower bed"], image: "https://www.serebii.net/pokemonpokopia/pokemon/203.png", rarity: "Common", specialties: ["Gather"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 208, nationalDex: null, name: "Steelix", types: ["Crush","Bulldoze"], habitats: ["Clink-clang iron construction"], image: "https://www.serebii.net/pokemonpokopia/pokemon/208.png", rarity: "Common", specialties: ["Crush","Bulldoze"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 212, nationalDex: null, name: "Scizor", types: ["Chop"], habitats: ["Tree-shaded tall grass"], image: "https://www.serebii.net/pokemonpokopia/pokemon/212.png", rarity: "Common", specialties: ["Chop"], locations: ["Withered Wastelands","Palette Town"], time: "Any", weather: "Any" },
  { id: 214, nationalDex: null, name: "Heracross", types: ["Chop","Build"], habitats: ["Tree-shaded tall grass"], image: "https://www.serebii.net/pokemonpokopia/pokemon/214.png", rarity: "Rare", specialties: ["Chop","Build"], locations: ["Withered Wastelands","Palette Town"], time: "Any", weather: "Any" },
  { id: 233, nationalDex: null, name: "Porygon2", types: ["Recycle"], habitats: ["Work desk"], image: "https://www.serebii.net/pokemonpokopia/pokemon/233.png", rarity: "Rare", specialties: ["Recycle"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 235, nationalDex: null, name: "Smeargle", types: ["Paint"], habitats: ["Tiny Atelier"], image: "https://www.serebii.net/pokemonpokopia/pokemon/235-smearguru.png", rarity: "Common", specialties: ["Paint"], locations: [], time: "Any", weather: "Any" },
  { id: 236, nationalDex: null, name: "Tyrogue", types: ["Trade"], habitats: ["Training waterfall"], image: "https://www.serebii.net/pokemonpokopia/pokemon/236.png", rarity: "Common", specialties: ["Trade"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 237, nationalDex: null, name: "Hitmontop", types: ["Trade"], habitats: ["Gym first aid"], image: "https://www.serebii.net/pokemonpokopia/pokemon/237.png", rarity: "Common", specialties: ["Trade"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 239, nationalDex: null, name: "Elekid", types: ["Generate"], habitats: ["Vending machine set"], image: "https://www.serebii.net/pokemonpokopia/pokemon/239.png", rarity: "Common", specialties: ["Generate"], locations: ["Bleak Beach"], time: "Any", weather: "Any" },
  { id: 240, nationalDex: null, name: "Magby", types: ["Burn"], habitats: ["Pretty flower bed"], image: "https://www.serebii.net/pokemonpokopia/pokemon/240.png", rarity: "Common", specialties: ["Burn"], locations: ["Withered Wastelands","Palette Town"], time: "Any", weather: "Any" },
  { id: 242, nationalDex: null, name: "Blissey", types: ["Trade","Litter"], habitats: ["Cuteness overload"], image: "https://www.serebii.net/pokemonpokopia/pokemon/242.png", rarity: "Rare", specialties: ["Trade","Litter"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 243, nationalDex: null, name: "Raikou", types: ["Generate"], habitats: [], image: "https://www.serebii.net/pokemonpokopia/pokemon/243.png", rarity: "Legendary", specialties: ["Generate"], locations: [], time: "Any", weather: "Any" },
  { id: 244, nationalDex: null, name: "Entei", types: ["Burn"], habitats: [], image: "https://www.serebii.net/pokemonpokopia/pokemon/244.png", rarity: "Legendary", specialties: ["Burn"], locations: [], time: "Any", weather: "Any" },
  { id: 245, nationalDex: null, name: "Suicune", types: ["Water"], habitats: [], image: "https://www.serebii.net/pokemonpokopia/pokemon/245.png", rarity: "Legendary", specialties: ["Water"], locations: [], time: "Any", weather: "Any" },
  { id: 246, nationalDex: null, name: "Larvitar", types: ["Crush","Bulldoze"], habitats: ["Mossy rest spot"], image: "https://www.serebii.net/pokemonpokopia/pokemon/246.png", rarity: "Common", specialties: ["Crush","Bulldoze"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 247, nationalDex: null, name: "Pupitar", types: ["Crush","Bulldoze"], habitats: ["Tree-shaded pink tall grass"], image: "https://www.serebii.net/pokemonpokopia/pokemon/247.png", rarity: "Common", specialties: ["Crush","Bulldoze"], locations: ["Sparkling Skylands"], time: "Any", weather: "Any" },
  { id: 248, nationalDex: null, name: "Tyranitar", types: ["Crush","Bulldoze"], habitats: ["Toil in the soil","Mossy rest spot"], image: "https://www.serebii.net/pokemonpokopia/pokemon/248.png", rarity: "Rare", specialties: ["Crush","Bulldoze"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 249, nationalDex: null, name: "Lugia", types: ["???"], habitats: [], image: "https://www.serebii.net/pokemonpokopia/pokemon/249.png", rarity: "Legendary", specialties: ["???"], locations: [], time: "Any", weather: "Any" },
  { id: 250, nationalDex: null, name: "Ho-Oh", types: ["???"], habitats: [], image: "https://www.serebii.net/pokemonpokopia/pokemon/250.png", rarity: "Legendary", specialties: ["???"], locations: [], time: "Any", weather: "Any" },
  { id: 255, nationalDex: null, name: "Torchic", types: ["Burn"], habitats: ["Chirp-chirp meal","Resort meal prep"], image: "https://www.serebii.net/pokemonpokopia/pokemon/255.png", rarity: "Common", specialties: ["Burn"], locations: ["Bleak Beach"], time: "Any", weather: "Any" },
  { id: 256, nationalDex: null, name: "Combusken", types: ["Burn","Build"], habitats: ["Resort meal prep","Furnace Spot"], image: "https://www.serebii.net/pokemonpokopia/pokemon/256.png", rarity: "Rare", specialties: ["Burn","Build"], locations: ["Bleak Beach"], time: "Any", weather: "Any" },
  { id: 257, nationalDex: null, name: "Blaziken", types: ["Burn","Build"], habitats: ["Chirp-chirp meal","Furnace Spot"], image: "https://www.serebii.net/pokemonpokopia/pokemon/257.png", rarity: "Rare", specialties: ["Burn","Build"], locations: ["Bleak Beach"], time: "Any", weather: "Any" },
  { id: 270, nationalDex: null, name: "Lotad", types: ["Water"], habitats: ["Hydrated red tall grass","Uplifting duckweed","Hot-spring Fishing Spot"], image: "https://www.serebii.net/pokemonpokopia/pokemon/270.png", rarity: "Common", specialties: ["Water"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 271, nationalDex: null, name: "Lombre", types: ["Water"], habitats: ["Hydrated red tall grass","Hot-spring Fishing Spot"], image: "https://www.serebii.net/pokemonpokopia/pokemon/271.png", rarity: "Rare", specialties: ["Water"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 272, nationalDex: null, name: "Ludicolo", types: ["Water","Hype"], habitats: ["Uplifting duckweed"], image: "https://www.serebii.net/pokemonpokopia/pokemon/272.png", rarity: "Rare", specialties: ["Water","Hype"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 278, nationalDex: null, name: "Wingull", types: ["Water","Fly"], habitats: ["Elevated yellow tall grass","Windy Flower Bed"], image: "https://www.serebii.net/pokemonpokopia/pokemon/278.png", rarity: "Common", specialties: ["Water","Fly"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Morning,Day,Evening", weather: "Any" },
  { id: 279, nationalDex: null, name: "Pelipper", types: ["Water","Fly"], habitats: ["Elevated yellow tall grass","Windy Flower Bed"], image: "https://www.serebii.net/pokemonpokopia/pokemon/279.png", rarity: "Rare", specialties: ["Water","Fly"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Morning,Day,Evening", weather: "Any" },
  { id: 280, nationalDex: null, name: "Ralts", types: ["Teleport"], habitats: ["Study Area"], image: "https://www.serebii.net/pokemonpokopia/pokemon/280.png", rarity: "Common", specialties: ["Teleport"], locations: ["Withered Wastelands","Bleak Beach","Rocky Ridges","Sparkling Skylands","Palette Town","Cloud Island"], time: "Any", weather: "Any" },
  { id: 281, nationalDex: null, name: "Kirlia", types: ["Teleport"], habitats: ["Study Area","Moisturizing makeup stand"], image: "https://www.serebii.net/pokemonpokopia/pokemon/281.png", rarity: "Rare", specialties: ["Teleport"], locations: ["Sparkling Skylands"], time: "Any", weather: "Any" },
  { id: 282, nationalDex: null, name: "Gardevoir", types: ["Teleport","Trade"], habitats: ["Moisturizing makeup stand","Mini library"], image: "https://www.serebii.net/pokemonpokopia/pokemon/282.png", rarity: "Rare", specialties: ["Teleport","Trade"], locations: ["Sparkling Skylands"], time: "Any", weather: "Any" },
  { id: 296, nationalDex: null, name: "Makuhita", types: ["Build","Bulldoze"], habitats: ["Tree-shaded Yellow tall grass","All packed up"], image: "https://www.serebii.net/pokemonpokopia/pokemon/296.png", rarity: "Common", specialties: ["Build","Bulldoze"], locations: ["Bleak Beach"], time: "Any", weather: "Any" },
  { id: 297, nationalDex: null, name: "Hariyama", types: ["Build","Bulldoze"], habitats: ["Tree-shaded Yellow tall grass","All packed up"], image: "https://www.serebii.net/pokemonpokopia/pokemon/297.png", rarity: "Rare", specialties: ["Build","Bulldoze"], locations: ["Bleak Beach"], time: "Any", weather: "Any" },
  { id: 298, nationalDex: null, name: "Azurill", types: ["Water","Hype"], habitats: ["Hydrated yellow tall grass","Perpetual mess"], image: "https://www.serebii.net/pokemonpokopia/pokemon/298.png", rarity: "Common", specialties: ["Water","Hype"], locations: ["Bleak Beach"], time: "Any", weather: "Any" },
];

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

/**
 * Get all specialty icon URLs for a list of specialties
 * @param specialties - Array of specialty names
 * @returns Array of icon URLs
 */
export function getSpecialtyIcons(specialties: string[]): string[] {
  return specialties
    .filter(s => s && s.trim().length > 0)
    .map(getSpecialtyIcon);
}
// Mon Mar 23 11:11:24 AM EDT 2026
