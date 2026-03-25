// pokemon-data.ts — Auto-generated from official Pokopia dex (sequential 1-300, Mew = #300)
// DO NOT EDIT: regenerate with scripts/rebuild-from-official-list.js

export type Specialty =
  | "Grow" | "Build" | "Chop" | "Burn" | "Water" | "Gather" | "Generate"
  | "Search" | "Fly" | "Trade" | "Crush" | "Bulldoze" | "Litter" | "Hype"
  | "Teleport" | "Transform" | "Recycle" | "Storage" | "Paint" | "Yawn"
  | "Explode" | "Eat" | "Gather Honey" | "Dream Island" | "Illuminate"
  | "DJ" | "Party" | "Collect" | "Rarify" | "Engineer" | "Appraise" | "???";

export interface Pokemon {
  id: number;           // Pokopia dex number (1-300)
  nationalDex: number | null;
  name: string;
  types: Specialty[];
  habitats: string[];
  image: string;
  rarity: "Common" | "Rare" | "Legendary";
  specialties: Specialty[];
  locations: string[];
  time: string;         // "Any" or "Morning,Day,Evening,Night" subset
  weather: string;      // "Any" or "Sun,Cloud,Rain" subset
}

export type RawPokemon = Pokemon;

// Rarity order for filtering
export const rarities = ["Common", "Rare", "Legendary"] as const;

// All Pokemon in Pokopia Dex order (1-300, Mew = #300)
// Forms sharing a number: Shellos #59, Gastrodon #60, Tatsugiri #145, Toxtricity #197, Pikachu/Peakychu #79, Snorlax/Mosslax #108
const _rawPokemonList: RawPokemon[] = [
  { id: 1, nationalDex: null, name: "Bulbasaur", types: ["Grow"], habitats: ["Tall Grass","Bench with greenery"], image: "/pokemon/001.png", rarity: "Common", specialties: ["Grow"], locations: [], time: "Any", weather: "Any" },
  { id: 2, nationalDex: null, name: "Ivysaur", types: ["Grow"], habitats: ["Field of Flowers","Bench with greenery"], image: "/pokemon/002.png", rarity: "Rare", specialties: ["Grow"], locations: [], time: "Any", weather: "Any" },
  { id: 3, nationalDex: null, name: "Venusaur", types: ["Grow","Litter"], habitats: ["Field of Flowers","Garden Terrace"], image: "/pokemon/003.png", rarity: "Rare", specialties: ["Grow","Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 4, nationalDex: null, name: "Charmander", types: ["Burn"], habitats: ["Tall Grass"], image: "/pokemon/004.png", rarity: "Common", specialties: ["Burn"], locations: [], time: "Any", weather: "Any" },
  { id: 5, nationalDex: null, name: "Charmeleon", types: ["Burn"], habitats: ["Campsite"], image: "/pokemon/005.png", rarity: "Common", specialties: ["Burn"], locations: [], time: "Any", weather: "Any" },
  { id: 6, nationalDex: null, name: "Charizard", types: ["Burn","Fly"], habitats: ["Tall Grass","Berry-feast Campsite"], image: "/pokemon/006.png", rarity: "Rare", specialties: ["Burn","Fly"], locations: [], time: "Any", weather: "Sun,Cloud" },
  { id: 7, nationalDex: null, name: "Squirtle", types: ["Water"], habitats: ["Tall Grass","Hydrated tall grass"], image: "/pokemon/007.png", rarity: "Common", specialties: ["Water"], locations: [], time: "Any", weather: "Any" },
  { id: 8, nationalDex: null, name: "Wartortle", types: ["Water"], habitats: ["Hydrated tall grass"], image: "/pokemon/008.png", rarity: "Rare", specialties: ["Water"], locations: [], time: "Any", weather: "Any" },
  { id: 9, nationalDex: null, name: "Blastoise", types: ["Water","Trade"], habitats: ["Hydrated tall grass","Floating in the shade"], image: "/pokemon/009.png", rarity: "Rare", specialties: ["Water","Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 10, nationalDex: null, name: "Pidgey", types: ["Fly","Search"], habitats: ["Elevated tall grass","Pretty flower bed"], image: "/pokemon/016.png", rarity: "Common", specialties: ["Fly","Search"], locations: [], time: "Any", weather: "Any" },
  { id: 11, nationalDex: null, name: "Pidgeotto", types: ["Fly","Search"], habitats: ["Elevated tall grass","Pretty flower bed"], image: "/pokemon/017.png", rarity: "Rare", specialties: ["Fly","Search"], locations: [], time: "Morning,Day,Evening", weather: "Any" },
  { id: 12, nationalDex: null, name: "Pidgeot", types: ["Fly","Chop"], habitats: ["Luxury chirp-chirp meal"], image: "/pokemon/018.png", rarity: "Common", specialties: ["Fly","Chop"], locations: [], time: "Morning,Day,Evening", weather: "Any" },
  { id: 13, nationalDex: null, name: "Oddish", types: ["Grow"], habitats: ["Tall Grass"], image: "/pokemon/043.png", rarity: "Common", specialties: ["Grow"], locations: [], time: "Night", weather: "Any" },
  { id: 14, nationalDex: null, name: "Gloom", types: ["Grow"], habitats: ["Tropical vibes"], image: "/pokemon/044.png", rarity: "Common", specialties: ["Grow"], locations: [], time: "Any", weather: "Any" },
  { id: 15, nationalDex: null, name: "Vileplume", types: ["Grow","Litter"], habitats: ["Chansey Resting area"], image: "/pokemon/045.png", rarity: "Rare", specialties: ["Grow","Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 16, nationalDex: null, name: "Bellossom", types: ["Grow","Hype"], habitats: ["Chansey Resting area"], image: "/pokemon/182.png", rarity: "Rare", specialties: ["Grow","Hype"], locations: [], time: "Any", weather: "Any" },
  { id: 17, nationalDex: null, name: "Paras", types: ["Search"], habitats: ["Elevated flower bed","Flower garden"], image: "/pokemon/046.png", rarity: "Common", specialties: ["Search"], locations: [], time: "Any", weather: "Any" },
  { id: 18, nationalDex: null, name: "Parasect", types: ["Search"], habitats: ["Elevated flower bed","Flower garden"], image: "/pokemon/047.png", rarity: "Rare", specialties: ["Search"], locations: [], time: "Any", weather: "Any" },
  { id: 19, nationalDex: null, name: "Venonat", types: ["Search"], habitats: ["Illuminated tall grass","Illuminated bench"], image: "/pokemon/048.png", rarity: "Common", specialties: ["Search"], locations: [], time: "Night", weather: "Any" },
  { id: 20, nationalDex: null, name: "Venomoth", types: ["Search"], habitats: ["Illuminated tall grass","Illuminated bench"], image: "/pokemon/049.png", rarity: "Rare", specialties: ["Search"], locations: [], time: "Night", weather: "Any" },
  { id: 21, nationalDex: null, name: "Bellsprout", types: ["Grow","Litter"], habitats: ["Tree-shaded tall grass"], image: "/pokemon/069.png", rarity: "Common", specialties: ["Grow","Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 22, nationalDex: null, name: "Weepinbell", types: ["Grow","Litter"], habitats: ["Flowery table","Irresistible scent and glow"], image: "/pokemon/070.png", rarity: "Rare", specialties: ["Grow","Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 23, nationalDex: null, name: "Victreebel", types: ["Grow","Chop"], habitats: ["Flowery table","Irresistible scent and glow"], image: "/pokemon/071.png", rarity: "Rare", specialties: ["Grow","Chop"], locations: [], time: "Any", weather: "Any" },
  { id: 24, nationalDex: null, name: "Slowpoke", types: ["Water","Yawn"], habitats: ["Seaside Tall Grass"], image: "/pokemon/079.png", rarity: "Common", specialties: ["Water","Yawn"], locations: [], time: "Any", weather: "Any" },
  { id: 25, nationalDex: null, name: "Slowbro", types: ["Water","Trade"], habitats: ["Seaside Tall Grass","Bed with a plush"], image: "/pokemon/080.png", rarity: "Rare", specialties: ["Water","Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 26, nationalDex: null, name: "Slowking", types: ["Water","Teleport"], habitats: ["Seaside Tall Grass","Bed with a plush","Fishing pond"], image: "/pokemon/199.png", rarity: "Rare", specialties: ["Water","Teleport"], locations: [], time: "Any", weather: "Any" },
  { id: 27, nationalDex: null, name: "Magnemite", types: ["Generate"], habitats: ["Factory Storage"], image: "/pokemon/081.png", rarity: "Common", specialties: ["Generate"], locations: [], time: "Any", weather: "Any" },
  { id: 28, nationalDex: null, name: "Magneton", types: ["Generate"], habitats: ["Trash can central","Mini Game Corner"], image: "/pokemon/082.png", rarity: "Rare", specialties: ["Generate"], locations: [], time: "Any", weather: "Any" },
  { id: 29, nationalDex: null, name: "Magnezone", types: ["Generate","Recycle"], habitats: [], image: "/pokemon/462.png", rarity: "Rare", specialties: ["Generate","Recycle"], locations: [], time: "Any", weather: "Any" },
  { id: 30, nationalDex: null, name: "Onix", types: ["Crush","Bulldoze"], habitats: ["Smooth tall grass"], image: "/pokemon/095.png", rarity: "Common", specialties: ["Crush","Bulldoze"], locations: [], time: "Any", weather: "Any" },
  { id: 31, nationalDex: null, name: "Steelix", types: ["Crush","Bulldoze"], habitats: ["Clink-clang iron construction"], image: "/pokemon/208.png", rarity: "Rare", specialties: ["Crush","Bulldoze"], locations: [], time: "Any", weather: "Any" },
  { id: 32, nationalDex: null, name: "Cubone", types: ["Build"], habitats: ["Grave with flowers"], image: "/pokemon/104.png", rarity: "Common", specialties: ["Build"], locations: [], time: "Any", weather: "Any" },
  { id: 33, nationalDex: null, name: "Marowak", types: ["Build"], habitats: ["Grave with flowers"], image: "/pokemon/105.png", rarity: "Rare", specialties: ["Build"], locations: [], time: "Any", weather: "Any" },
  { id: 34, nationalDex: null, name: "Tyrogue", types: ["Trade"], habitats: ["Training waterfall"], image: "/pokemon/236.png", rarity: "Common", specialties: ["Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 35, nationalDex: null, name: "Hitmonlee", types: ["Trade"], habitats: ["Urgent Care"], image: "/pokemon/106.png", rarity: "Common", specialties: ["Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 36, nationalDex: null, name: "Hitmonchan", types: ["Trade"], habitats: ["Exercise resting spot"], image: "/pokemon/107.png", rarity: "Common", specialties: ["Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 37, nationalDex: null, name: "Hitmontop", types: ["Trade"], habitats: ["Gym first aid"], image: "/pokemon/237.png", rarity: "Common", specialties: ["Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 38, nationalDex: null, name: "Koffing", types: ["Recycle"], habitats: ["Trash collection site"], image: "/pokemon/109.png", rarity: "Common", specialties: ["Recycle"], locations: [], time: "Any", weather: "Any" },
  { id: 39, nationalDex: null, name: "Weezing", types: ["Recycle"], habitats: ["Good old-fashioned antiques","Trash collection site"], image: "/pokemon/110.png", rarity: "Common", specialties: ["Recycle"], locations: [], time: "Any", weather: "Any" },
  { id: 40, nationalDex: null, name: "Tangela", types: ["Grow","Litter"], habitats: ["Nothin' but Poke Balls"], image: "/pokemon/114.png", rarity: "Common", specialties: ["Grow","Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 41, nationalDex: null, name: "Tangrowth", types: ["Grow","Litter"], habitats: [], image: "/pokemon/465.png", rarity: "Rare", specialties: ["Grow","Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 42, nationalDex: null, name: "Scyther", types: ["Chop"], habitats: ["Tree-shaded tall grass"], image: "/pokemon/123.png", rarity: "Common", specialties: ["Chop"], locations: [], time: "Any", weather: "Any" },
  { id: 43, nationalDex: null, name: "Scizor", types: ["Chop"], habitats: ["Tree-shaded tall grass"], image: "/pokemon/212.png", rarity: "Rare", specialties: ["Chop"], locations: [], time: "Any", weather: "Any" },
  { id: 44, nationalDex: null, name: "Pinsir", types: ["Chop","Build"], habitats: ["Tree-shaded tall grass"], image: "/pokemon/127.png", rarity: "Rare", specialties: ["Chop","Build"], locations: [], time: "Any", weather: "Any" },
  { id: 45, nationalDex: null, name: "Magikarp", types: ["???"], habitats: ["Ocean fishing spot"], image: "/pokemon/129.png", rarity: "Common", specialties: ["???"], locations: [], time: "Any", weather: "Any" },
  { id: 46, nationalDex: null, name: "Gyarados", types: ["Water"], habitats: ["Illuminated waterfall"], image: "/pokemon/130.png", rarity: "Rare", specialties: ["Water"], locations: [], time: "Any", weather: "Any" },
  { id: 47, nationalDex: null, name: "Ditto", types: ["Transform"], habitats: [], image: "/pokemon/132.png", rarity: "Common", specialties: ["Transform"], locations: [], time: "Any", weather: "Any" },
  { id: 48, nationalDex: null, name: "Hoothoot", types: ["Trade","Fly"], habitats: ["Elevated tall grass","Pretty flower bed","Gently lit bed"], image: "/pokemon/163.png", rarity: "Common", specialties: ["Trade","Fly"], locations: [], time: "Night", weather: "Any" },
  { id: 49, nationalDex: null, name: "Noctowl", types: ["Trade","Fly"], habitats: ["Elevated tall grass","Gently lit bed"], image: "/pokemon/164.png", rarity: "Rare", specialties: ["Trade","Fly"], locations: [], time: "Any", weather: "Any" },
  { id: 50, nationalDex: null, name: "Heracross", types: ["Chop","Build"], habitats: ["Tree-shaded tall grass"], image: "/pokemon/214.png", rarity: "Rare", specialties: ["Chop","Build"], locations: [], time: "Any", weather: "Any" },
  { id: 51, nationalDex: null, name: "Volbeat", types: ["Hype"], habitats: [], image: "/pokemon/313.png", rarity: "Common", specialties: ["Hype"], locations: [], time: "Any", weather: "Any" },
  { id: 52, nationalDex: null, name: "Illumise", types: ["Hype"], habitats: [], image: "/pokemon/314.png", rarity: "Common", specialties: ["Hype"], locations: [], time: "Any", weather: "Any" },
  { id: 53, nationalDex: null, name: "Gulpin", types: ["Storage"], habitats: [], image: "/pokemon/316.png", rarity: "Common", specialties: ["Storage"], locations: [], time: "Any", weather: "Any" },
  { id: 54, nationalDex: null, name: "Swalot", types: ["Storage"], habitats: [], image: "/pokemon/317.png", rarity: "Common", specialties: ["Storage"], locations: [], time: "Any", weather: "Any" },
  { id: 55, nationalDex: null, name: "Cacnea", types: ["Grow"], habitats: [], image: "/pokemon/331.png", rarity: "Common", specialties: ["Grow"], locations: [], time: "Any", weather: "Any" },
  { id: 56, nationalDex: null, name: "Cacturne", types: ["Grow","Litter"], habitats: [], image: "/pokemon/332.png", rarity: "Common", specialties: ["Grow","Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 57, nationalDex: null, name: "Combee", types: ["Litter"], habitats: [], image: "/pokemon/415.png", rarity: "Common", specialties: ["Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 58, nationalDex: null, name: "Vespiquen", types: ["Gather Honey","Search"], habitats: [], image: "/pokemon/416.png", rarity: "Common", specialties: ["Gather Honey","Search"], locations: [], time: "Any", weather: "Any" },
  { id: 59, nationalDex: null, name: "Shellos", types: ["Water"], habitats: [], image: "/pokemon/422.png", rarity: "Common", specialties: ["Water"], locations: [], time: "Any", weather: "Any" },
  { id: 59, nationalDex: null, name: "Shellos East Sea", types: ["Water"], habitats: [], image: "/pokemon/422-eastsea.png", rarity: "Common", specialties: ["Water"], locations: [], time: "Any", weather: "Any" },
  { id: 60, nationalDex: null, name: "Gastrodon", types: ["Water","Trade"], habitats: [], image: "/pokemon/423.png", rarity: "Common", specialties: ["Water","Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 60, nationalDex: null, name: "Gastrodon East Sea", types: ["Water","Trade"], habitats: [], image: "/pokemon/423-eastsea.png", rarity: "Common", specialties: ["Water","Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 61, nationalDex: null, name: "Drifloon", types: ["Dream Island"], habitats: [], image: "/pokemon/425.png", rarity: "Common", specialties: ["Dream Island"], locations: [], time: "Any", weather: "Any" },
  { id: 62, nationalDex: null, name: "Drifblim", types: ["Fly","Gather"], habitats: [], image: "/pokemon/426.png", rarity: "Common", specialties: ["Fly","Gather"], locations: [], time: "Any", weather: "Any" },
  { id: 63, nationalDex: null, name: "Drilbur", types: ["Search"], habitats: [], image: "/pokemon/529.png", rarity: "Common", specialties: ["Search"], locations: [], time: "Any", weather: "Any" },
  { id: 64, nationalDex: null, name: "Excadrill", types: ["Search","Chop"], habitats: [], image: "/pokemon/530.png", rarity: "Common", specialties: ["Search","Chop"], locations: [], time: "Any", weather: "Any" },
  { id: 65, nationalDex: null, name: "Timburr", types: ["Build"], habitats: [], image: "/pokemon/532.png", rarity: "Common", specialties: ["Build"], locations: [], time: "Any", weather: "Any" },
  { id: 66, nationalDex: null, name: "Gurdurr", types: ["Build"], habitats: [], image: "/pokemon/533.png", rarity: "Common", specialties: ["Build"], locations: [], time: "Any", weather: "Any" },
  { id: 67, nationalDex: null, name: "Conkeldurr", types: ["Build","Crush"], habitats: [], image: "/pokemon/534.png", rarity: "Common", specialties: ["Build","Crush"], locations: [], time: "Any", weather: "Any" },
  { id: 68, nationalDex: null, name: "Litwick", types: ["Burn"], habitats: [], image: "/pokemon/607.png", rarity: "Common", specialties: ["Burn"], locations: [], time: "Any", weather: "Any" },
  { id: 69, nationalDex: null, name: "Lampent", types: ["Burn"], habitats: [], image: "/pokemon/608.png", rarity: "Common", specialties: ["Burn"], locations: [], time: "Any", weather: "Any" },
  { id: 70, nationalDex: null, name: "Chandelure", types: ["Burn"], habitats: [], image: "/pokemon/609.png", rarity: "Common", specialties: ["Burn"], locations: [], time: "Any", weather: "Any" },
  { id: 71, nationalDex: null, name: "Axew", types: ["Chop"], habitats: [], image: "/pokemon/610.png", rarity: "Common", specialties: ["Chop"], locations: [], time: "Any", weather: "Any" },
  { id: 72, nationalDex: null, name: "Fraxure", types: ["Chop"], habitats: [], image: "/pokemon/611.png", rarity: "Common", specialties: ["Chop"], locations: [], time: "Any", weather: "Any" },
  { id: 73, nationalDex: null, name: "Haxorus", types: ["Chop","Litter"], habitats: [], image: "/pokemon/612.png", rarity: "Common", specialties: ["Chop","Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 74, nationalDex: null, name: "Goomy", types: ["Water"], habitats: [], image: "/pokemon/704.png", rarity: "Common", specialties: ["Water"], locations: [], time: "Any", weather: "Any" },
  { id: 75, nationalDex: null, name: "Sliggoo", types: ["Water"], habitats: [], image: "/pokemon/705.png", rarity: "Common", specialties: ["Water"], locations: [], time: "Any", weather: "Any" },
  { id: 76, nationalDex: null, name: "Goodra", types: ["Water","Trade"], habitats: [], image: "/pokemon/706.png", rarity: "Rare", specialties: ["Water","Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 77, nationalDex: null, name: "Cramorant", types: ["Fly","Water"], habitats: [], image: "/pokemon/845.png", rarity: "Common", specialties: ["Fly","Water"], locations: [], time: "Any", weather: "Any" },
  { id: 78, nationalDex: null, name: "Pichu", types: ["Generate"], habitats: ["Picnic Set"], image: "/pokemon/172.png", rarity: "Common", specialties: ["Generate"], locations: [], time: "Any", weather: "Any" },
  { id: 79, nationalDex: null, name: "Peakychu", types: ["Illuminate"], habitats: [], image: "/pokemon/025-peakychu.png", rarity: "Common", specialties: ["Illuminate"], locations: [], time: "Any", weather: "Any" },
  { id: 79, nationalDex: null, name: "Pikachu", types: ["Generate"], habitats: ["Picnic Set"], image: "/pokemon/025.png", rarity: "Rare", specialties: ["Generate"], locations: [], time: "Any", weather: "Any" },
  { id: 80, nationalDex: null, name: "Raichu", types: ["Generate","Hype"], habitats: ["Nature's market"], image: "/pokemon/026.png", rarity: "Common", specialties: ["Generate","Hype"], locations: [], time: "Any", weather: "Any" },
  { id: 81, nationalDex: null, name: "Zubat", types: ["Search"], habitats: ["Tree-shaded Yellow tall grass","Park bench"], image: "/pokemon/041.png", rarity: "Common", specialties: ["Search"], locations: [], time: "Night", weather: "Any" },
  { id: 82, nationalDex: null, name: "Golbat", types: ["Search"], habitats: ["Tree-shaded Yellow tall grass"], image: "/pokemon/042.png", rarity: "Rare", specialties: ["Search"], locations: [], time: "Night", weather: "Any" },
  { id: 83, nationalDex: null, name: "Crobat", types: ["Search","Chop"], habitats: ["Elevated yellow tall grass","Trash disposal site"], image: "/pokemon/169.png", rarity: "Rare", specialties: ["Search","Chop"], locations: [], time: "Night", weather: "Any" },
  { id: 84, nationalDex: null, name: "Meowth", types: ["Trade"], habitats: ["Resting spot","Working the register"], image: "/pokemon/052.png", rarity: "Common", specialties: ["Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 85, nationalDex: null, name: "Persian", types: ["Trade","Search"], habitats: ["Evil organization HQ"], image: "/pokemon/053.png", rarity: "Common", specialties: ["Trade","Search"], locations: [], time: "Any", weather: "Any" },
  { id: 86, nationalDex: null, name: "Psyduck", types: ["Search"], habitats: ["Hot-spring shower"], image: "/pokemon/054.png", rarity: "Common", specialties: ["Search"], locations: [], time: "Any", weather: "Any" },
  { id: 87, nationalDex: null, name: "Golduck", types: ["Search"], habitats: ["Hot-spring shower"], image: "/pokemon/055.png", rarity: "Rare", specialties: ["Search"], locations: [], time: "Any", weather: "Any" },
  { id: 88, nationalDex: null, name: "Growlithe", types: ["Burn","Search"], habitats: ["Perpetual mess","Resort meal prep"], image: "/pokemon/058.png", rarity: "Common", specialties: ["Burn","Search"], locations: [], time: "Any", weather: "Any" },
  { id: 89, nationalDex: null, name: "Arcanine", types: ["Burn","Search"], habitats: ["Mini museum","Magma fishing spot"], image: "/pokemon/059.png", rarity: "Rare", specialties: ["Burn","Search"], locations: [], time: "Any", weather: "Any" },
  { id: 90, nationalDex: null, name: "Farfetch'd", types: ["Chop","Build"], habitats: ["All packed up"], image: "/pokemon/083.png", rarity: "Common", specialties: ["Chop","Build"], locations: [], time: "Any", weather: "Any" },
  { id: 91, nationalDex: null, name: "Grimer", types: ["Litter"], habitats: ["Marsh fishing spot"], image: "/pokemon/088.png", rarity: "Common", specialties: ["Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 92, nationalDex: null, name: "Muk", types: ["Litter"], habitats: ["Marsh fishing spot"], image: "/pokemon/089.png", rarity: "Rare", specialties: ["Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 93, nationalDex: null, name: "Gastly", types: ["Gather","Trade"], habitats: ["Spooky study"], image: "/pokemon/092.png", rarity: "Common", specialties: ["Gather","Trade"], locations: [], time: "Night", weather: "Any" },
  { id: 94, nationalDex: null, name: "Haunter", types: ["Gather","Trade"], habitats: ["Surprise in store","Spooky study"], image: "/pokemon/093.png", rarity: "Common", specialties: ["Gather","Trade"], locations: [], time: "Night", weather: "Any" },
  { id: 95, nationalDex: null, name: "Gengar", types: ["Gather","Trade"], habitats: ["Surprise in store"], image: "/pokemon/094.png", rarity: "Rare", specialties: ["Gather","Trade"], locations: [], time: "Night", weather: "Any" },
  { id: 96, nationalDex: null, name: "Voltorb", types: ["Generate","Explode"], habitats: ["Park bench","Playing pirate"], image: "/pokemon/100.png", rarity: "Common", specialties: ["Generate","Explode"], locations: [], time: "Any", weather: "Any" },
  { id: 97, nationalDex: null, name: "Electrode", types: ["Generate","Explode"], habitats: ["Park bench","Playing pirate"], image: "/pokemon/101.png", rarity: "Common", specialties: ["Generate","Explode"], locations: [], time: "Any", weather: "Any" },
  { id: 98, nationalDex: null, name: "Exeggcute", types: ["Grow","Teleport"], habitats: ["Tropical vibes","Shaded beach","Red tall grass"], image: "/pokemon/102.png", rarity: "Common", specialties: ["Grow","Teleport"], locations: [], time: "Any", weather: "Any" },
  { id: 99, nationalDex: null, name: "Exeggutor", types: ["Grow","Teleport"], habitats: ["Tropical vibes","Shaded beach"], image: "/pokemon/103.png", rarity: "Rare", specialties: ["Grow","Teleport"], locations: [], time: "Any", weather: "Any" },
  { id: 100, nationalDex: null, name: "Happiny", types: ["Trade"], habitats: [], image: "/pokemon/440.png", rarity: "Common", specialties: ["Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 101, nationalDex: null, name: "Chansey", types: ["Trade"], habitats: ["Full recovery"], image: "/pokemon/113.png", rarity: "Common", specialties: ["Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 102, nationalDex: null, name: "Blissey", types: ["Trade","Litter"], habitats: ["Cuteness overload"], image: "/pokemon/242.png", rarity: "Rare", specialties: ["Trade","Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 103, nationalDex: null, name: "Elekid", types: ["Generate"], habitats: ["Vending machine set"], image: "/pokemon/239.png", rarity: "Common", specialties: ["Generate"], locations: [], time: "Any", weather: "Any" },
  { id: 104, nationalDex: null, name: "Electabuzz", types: ["Generate"], habitats: ["Trash can central","Light-up stage"], image: "/pokemon/125.png", rarity: "Rare", specialties: ["Generate"], locations: [], time: "Any", weather: "Any" },
  { id: 105, nationalDex: null, name: "Electivire", types: ["Generate","Crush"], habitats: [], image: "/pokemon/466.png", rarity: "Rare", specialties: ["Generate","Crush"], locations: [], time: "Any", weather: "Any" },
  { id: 106, nationalDex: null, name: "Lapras", types: ["Water"], habitats: ["Tropical seaside"], image: "/pokemon/131.png", rarity: "Common", specialties: ["Water"], locations: [], time: "Any", weather: "Any" },
  { id: 107, nationalDex: null, name: "Munchlax", types: ["Bulldoze"], habitats: [], image: "/pokemon/446.png", rarity: "Common", specialties: ["Bulldoze"], locations: [], time: "Any", weather: "Any" },
  { id: 108, nationalDex: null, name: "Mosslax", types: ["Eat"], habitats: ["Gourmet's altar"], image: "/pokemon/143-mosslax.png", rarity: "Common", specialties: ["Eat"], locations: [], time: "Any", weather: "Any" },
  { id: 108, nationalDex: null, name: "Snorlax", types: ["Trade","Bulldoze"], habitats: [], image: "/pokemon/143.png", rarity: "Rare", specialties: ["Trade","Bulldoze"], locations: [], time: "Any", weather: "Any" },
  { id: 109, nationalDex: null, name: "Spinarak", types: ["Litter"], habitats: ["Yellow tall grass"], image: "/pokemon/167.png", rarity: "Common", specialties: ["Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 110, nationalDex: null, name: "Ariados", types: ["Litter"], habitats: ["Yellow tall grass"], image: "/pokemon/168.png", rarity: "Rare", specialties: ["Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 111, nationalDex: null, name: "Mareep", types: ["Generate","Litter"], habitats: ["Overgrowth vending machine","Knitting station"], image: "/pokemon/179.png", rarity: "Rare", specialties: ["Generate","Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 112, nationalDex: null, name: "Flaaffy", types: ["Generate","Litter"], habitats: ["Night festival venue","Knitting station"], image: "/pokemon/180.png", rarity: "Common", specialties: ["Generate","Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 113, nationalDex: null, name: "Ampharos", types: ["Generate","Trade"], habitats: ["Plain life"], image: "/pokemon/181.png", rarity: "Rare", specialties: ["Generate","Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 114, nationalDex: null, name: "Azurill", types: ["Water","Hype"], habitats: ["Hydrated yellow tall grass","Perpetual mess"], image: "/pokemon/298.png", rarity: "Common", specialties: ["Water","Hype"], locations: [], time: "Any", weather: "Any" },
  { id: 115, nationalDex: null, name: "Marill", types: ["Water","Hype"], habitats: ["Hydrated yellow tall grass","Dock"], image: "/pokemon/183.png", rarity: "Rare", specialties: ["Water","Hype"], locations: [], time: "Any", weather: "Any" },
  { id: 116, nationalDex: null, name: "Azumarill", types: ["Water","Build"], habitats: ["Dock"], image: "/pokemon/184.png", rarity: "Rare", specialties: ["Water","Build"], locations: [], time: "Any", weather: "Rain" },
  { id: 117, nationalDex: null, name: "Paldean Wooper", types: ["Litter"], habitats: ["Marshy tall grass"], image: "/pokemon/194-paldean.png", rarity: "Common", specialties: ["Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 118, nationalDex: null, name: "Clodsire", types: ["Litter","Bulldoze"], habitats: [], image: "/pokemon/980.png", rarity: "Rare", specialties: ["Litter","Bulldoze"], locations: [], time: "Any", weather: "Any" },
  { id: 119, nationalDex: null, name: "Smeargle", types: ["Paint"], habitats: ["Tiny Atelier"], image: "/pokemon/235.png", rarity: "Common", specialties: ["Paint"], locations: [], time: "Any", weather: "Any" },
  { id: 120, nationalDex: null, name: "Torchic", types: ["Burn"], habitats: ["Chirp-chirp meal","Resort meal prep"], image: "/pokemon/255.png", rarity: "Common", specialties: ["Burn"], locations: [], time: "Any", weather: "Any" },
  { id: 121, nationalDex: null, name: "Combusken", types: ["Burn","Build"], habitats: ["Resort meal prep","Furnace Spot"], image: "/pokemon/256.png", rarity: "Rare", specialties: ["Burn","Build"], locations: [], time: "Any", weather: "Any" },
  { id: 122, nationalDex: null, name: "Blaziken", types: ["Burn","Build"], habitats: ["Chirp-chirp meal","Furnace Spot"], image: "/pokemon/257.png", rarity: "Rare", specialties: ["Burn","Build"], locations: [], time: "Any", weather: "Any" },
  { id: 123, nationalDex: null, name: "Wingull", types: ["Water","Fly"], habitats: ["Elevated yellow tall grass","Windy Flower Bed"], image: "/pokemon/278.png", rarity: "Common", specialties: ["Water","Fly"], locations: [], time: "Morning,Day,Evening", weather: "Any" },
  { id: 124, nationalDex: null, name: "Pelipper", types: ["Water","Fly"], habitats: ["Elevated yellow tall grass","Windy Flower Bed"], image: "/pokemon/279.png", rarity: "Rare", specialties: ["Water","Fly"], locations: [], time: "Morning,Day,Evening", weather: "Any" },
  { id: 125, nationalDex: null, name: "Makuhita", types: ["Build","Bulldoze"], habitats: ["Tree-shaded Yellow tall grass","All packed up"], image: "/pokemon/296.png", rarity: "Common", specialties: ["Build","Bulldoze"], locations: [], time: "Any", weather: "Any" },
  { id: 126, nationalDex: null, name: "Hariyama", types: ["Build","Bulldoze"], habitats: ["Tree-shaded Yellow tall grass","All packed up"], image: "/pokemon/297.png", rarity: "Rare", specialties: ["Build","Bulldoze"], locations: [], time: "Any", weather: "Any" },
  { id: 127, nationalDex: null, name: "Absol", types: ["Chop"], habitats: [], image: "/pokemon/359.png", rarity: "Common", specialties: ["Chop"], locations: [], time: "Any", weather: "Any" },
  { id: 128, nationalDex: null, name: "Piplup", types: ["Water"], habitats: [], image: "/pokemon/393.png", rarity: "Common", specialties: ["Water"], locations: [], time: "Any", weather: "Any" },
  { id: 129, nationalDex: null, name: "Prinplup", types: ["Water","Trade"], habitats: [], image: "/pokemon/394.png", rarity: "Common", specialties: ["Water","Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 130, nationalDex: null, name: "Empoleon", types: ["Water","Trade"], habitats: [], image: "/pokemon/395.png", rarity: "Rare", specialties: ["Water","Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 131, nationalDex: null, name: "Audino", types: ["Trade"], habitats: [], image: "/pokemon/531.png", rarity: "Common", specialties: ["Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 132, nationalDex: null, name: "Trubbish", types: ["Recycle"], habitats: [], image: "/pokemon/568.png", rarity: "Common", specialties: ["Recycle"], locations: [], time: "Any", weather: "Any" },
  { id: 133, nationalDex: null, name: "Garbodor", types: ["Recycle","Litter"], habitats: [], image: "/pokemon/569.png", rarity: "Common", specialties: ["Recycle","Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 134, nationalDex: null, name: "Zorua", types: ["Trade"], habitats: [], image: "/pokemon/570.png", rarity: "Common", specialties: ["Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 135, nationalDex: null, name: "Zoroark", types: ["Trade","Chop"], habitats: [], image: "/pokemon/571.png", rarity: "Common", specialties: ["Trade","Chop"], locations: [], time: "Any", weather: "Any" },
  { id: 136, nationalDex: null, name: "Minccino", types: ["Gather"], habitats: [], image: "/pokemon/572.png", rarity: "Common", specialties: ["Gather"], locations: [], time: "Any", weather: "Any" },
  { id: 137, nationalDex: null, name: "Cinccino", types: ["Gather","Recycle"], habitats: [], image: "/pokemon/573.png", rarity: "Common", specialties: ["Gather","Recycle"], locations: [], time: "Any", weather: "Any" },
  { id: 138, nationalDex: null, name: "Grubbin", types: ["Chop"], habitats: [], image: "/pokemon/736.png", rarity: "Common", specialties: ["Chop"], locations: [], time: "Any", weather: "Any" },
  { id: 139, nationalDex: null, name: "Charjabug", types: ["Generate","Chop"], habitats: [], image: "/pokemon/737.png", rarity: "Common", specialties: ["Generate","Chop"], locations: [], time: "Any", weather: "Any" },
  { id: 140, nationalDex: null, name: "Vikavolt", types: ["Generate","Chop"], habitats: [], image: "/pokemon/738.png", rarity: "Common", specialties: ["Generate","Chop"], locations: [], time: "Any", weather: "Any" },
  { id: 141, nationalDex: null, name: "Mimikyu", types: ["Trade"], habitats: [], image: "/pokemon/778.png", rarity: "Common", specialties: ["Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 142, nationalDex: null, name: "Pawmi", types: ["Generate"], habitats: [], image: "/pokemon/921.png", rarity: "Common", specialties: ["Generate"], locations: [], time: "Any", weather: "Any" },
  { id: 143, nationalDex: null, name: "Pawmo", types: ["Generate","Crush"], habitats: [], image: "/pokemon/922.png", rarity: "Common", specialties: ["Generate","Crush"], locations: [], time: "Any", weather: "Any" },
  { id: 144, nationalDex: null, name: "Pawmot", types: ["Generate","Crush"], habitats: [], image: "/pokemon/923.png", rarity: "Common", specialties: ["Generate","Crush"], locations: [], time: "Any", weather: "Any" },
  { id: 145, nationalDex: null, name: "Tatsugiri Curly Form", types: ["Trade"], habitats: [], image: "/pokemon/978-curly.png", rarity: "Common", specialties: ["Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 145, nationalDex: null, name: "Tatsugiri Droopy Form", types: ["Trade"], habitats: [], image: "/pokemon/978-droopy.png", rarity: "Common", specialties: ["Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 145, nationalDex: null, name: "Tatsugiri Stretchy Form", types: ["Trade"], habitats: [], image: "/pokemon/978-stretchy.png", rarity: "Common", specialties: ["Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 146, nationalDex: null, name: "Ekans", types: ["Search"], habitats: ["Hydrated graceful flower bed"], image: "/pokemon/023.png", rarity: "Common", specialties: ["Search"], locations: [], time: "Any", weather: "Any" },
  { id: 147, nationalDex: null, name: "Arbok", types: ["Search"], habitats: ["Hydrated graceful flower bed"], image: "/pokemon/024.png", rarity: "Rare", specialties: ["Search"], locations: [], time: "Any", weather: "Any" },
  { id: 148, nationalDex: null, name: "Cleffa", types: ["Hype"], habitats: ["Graceful flower bed"], image: "/pokemon/173.png", rarity: "Common", specialties: ["Hype"], locations: [], time: "Night", weather: "Any" },
  { id: 149, nationalDex: null, name: "Clefairy", types: ["Hype"], habitats: ["Graceful flower bed","Bronze landmark"], image: "/pokemon/035.png", rarity: "Common", specialties: ["Hype"], locations: [], time: "Night", weather: "Any" },
  { id: 150, nationalDex: null, name: "Clefable", types: ["Hype","Trade"], habitats: ["Graceful flower bed","Bronze landmark"], image: "/pokemon/036.png", rarity: "Rare", specialties: ["Hype","Trade"], locations: [], time: "Night", weather: "Any" },
  { id: 151, nationalDex: null, name: "Igglybuff", types: ["Hype"], habitats: ["Flower garden stump stage"], image: "/pokemon/174.png", rarity: "Common", specialties: ["Hype"], locations: [], time: "Any", weather: "Any" },
  { id: 152, nationalDex: null, name: "Jigglypuff", types: ["Hype"], habitats: ["Flower garden stump stage","Recital stage"], image: "/pokemon/039.png", rarity: "Common", specialties: ["Hype"], locations: [], time: "Any", weather: "Any" },
  { id: 153, nationalDex: null, name: "Wigglytuff", types: ["Hype","Trade"], habitats: ["Recital stage"], image: "/pokemon/040.png", rarity: "Rare", specialties: ["Hype","Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 154, nationalDex: null, name: "Diglett", types: ["Hype"], habitats: ["Tree-shaded red tall grass","Container snacking"], image: "/pokemon/050.png", rarity: "Common", specialties: ["Hype"], locations: [], time: "Any", weather: "Any" },
  { id: 155, nationalDex: null, name: "Dugtrio", types: ["Hype","Crush"], habitats: ["Tree-shaded red tall grass","House party"], image: "/pokemon/051.png", rarity: "Rare", specialties: ["Hype","Crush"], locations: [], time: "Any", weather: "Any" },
  { id: 156, nationalDex: null, name: "Machop", types: ["Build","Gather"], habitats: ["Boulder-shaded Tall Grass"], image: "/pokemon/066.png", rarity: "Common", specialties: ["Build","Gather"], locations: [], time: "Any", weather: "Any" },
  { id: 157, nationalDex: null, name: "Machoke", types: ["Build","Gather"], habitats: ["Grassy training field","Box to the rhythm"], image: "/pokemon/067.png", rarity: "Common", specialties: ["Build","Gather"], locations: [], time: "Any", weather: "Any" },
  { id: 158, nationalDex: null, name: "Machamp", types: ["Build","Gather"], habitats: ["Grassy training field","Clink-clang iron construction"], image: "/pokemon/068.png", rarity: "Rare", specialties: ["Build","Gather"], locations: [], time: "Any", weather: "Any" },
  { id: 159, nationalDex: null, name: "Geodude", types: ["Crush"], habitats: ["Tall Grass"], image: "/pokemon/074.png", rarity: "Common", specialties: ["Crush"], locations: [], time: "Any", weather: "Any" },
  { id: 160, nationalDex: null, name: "Graveler", types: ["Crush"], habitats: ["Mossy boulder"], image: "/pokemon/075.png", rarity: "Common", specialties: ["Crush"], locations: [], time: "Any", weather: "Any" },
  { id: 161, nationalDex: null, name: "Golem", types: ["Crush","Trade"], habitats: ["Mossy boulder"], image: "/pokemon/076.png", rarity: "Rare", specialties: ["Crush","Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 162, nationalDex: null, name: "Magby", types: ["Burn"], habitats: ["Pretty flower bed"], image: "/pokemon/240.png", rarity: "Common", specialties: ["Burn"], locations: [], time: "Any", weather: "Any" },
  { id: 163, nationalDex: null, name: "Magmar", types: ["Burn"], habitats: ["Digging and burning"], image: "/pokemon/126.png", rarity: "Common", specialties: ["Burn"], locations: [], time: "Any", weather: "Any" },
  { id: 164, nationalDex: null, name: "Magmortar", types: ["Burn","Crush"], habitats: [], image: "/pokemon/467.png", rarity: "Rare", specialties: ["Burn","Crush"], locations: [], time: "Any", weather: "Any" },
  { id: 165, nationalDex: null, name: "Bonsly", types: ["Bulldoze"], habitats: [], image: "/pokemon/438.png", rarity: "Common", specialties: ["Bulldoze"], locations: [], time: "Any", weather: "Any" },
  { id: 166, nationalDex: null, name: "Sudowoodo", types: ["Trade"], habitats: ["Tree-shaded red tall grass","House party"], image: "/pokemon/185.png", rarity: "Rare", specialties: ["Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 167, nationalDex: null, name: "Murkrow", types: ["Trade","Fly"], habitats: ["Elevated red tall grass","Tree-shaded graceful flower bed"], image: "/pokemon/198.png", rarity: "Common", specialties: ["Trade","Fly"], locations: [], time: "Night", weather: "Any" },
  { id: 168, nationalDex: null, name: "Honchkrow", types: ["Trade","Fly"], habitats: [], image: "/pokemon/430.png", rarity: "Rare", specialties: ["Trade","Fly"], locations: [], time: "Any", weather: "Any" },
  { id: 169, nationalDex: null, name: "Larvitar", types: ["Crush","Bulldoze"], habitats: ["Mossy rest spot"], image: "/pokemon/246.png", rarity: "Common", specialties: ["Crush","Bulldoze"], locations: [], time: "Any", weather: "Any" },
  { id: 170, nationalDex: null, name: "Pupitar", types: ["Crush","Bulldoze"], habitats: ["Tree-shaded pink tall grass"], image: "/pokemon/247.png", rarity: "Common", specialties: ["Crush","Bulldoze"], locations: [], time: "Any", weather: "Any" },
  { id: 171, nationalDex: null, name: "Tyranitar", types: ["Crush","Bulldoze"], habitats: ["Toil in the soil","Mossy rest spot"], image: "/pokemon/248.png", rarity: "Rare", specialties: ["Crush","Bulldoze"], locations: [], time: "Any", weather: "Any" },
  { id: 172, nationalDex: null, name: "Lotad", types: ["Water"], habitats: ["Hydrated red tall grass","Uplifting duckweed","Hot-spring Fishing Spot"], image: "/pokemon/270.png", rarity: "Common", specialties: ["Water"], locations: [], time: "Any", weather: "Any" },
  { id: 173, nationalDex: null, name: "Lombre", types: ["Water"], habitats: ["Hydrated red tall grass","Hot-spring Fishing Spot"], image: "/pokemon/271.png", rarity: "Rare", specialties: ["Water"], locations: [], time: "Any", weather: "Any" },
  { id: 174, nationalDex: null, name: "Ludicolo", types: ["Water","Hype"], habitats: ["Uplifting duckweed"], image: "/pokemon/272.png", rarity: "Rare", specialties: ["Water","Hype"], locations: [], time: "Any", weather: "Any" },
  { id: 175, nationalDex: null, name: "Mawile", types: ["Trade","Build"], habitats: [], image: "/pokemon/303.png", rarity: "Common", specialties: ["Trade","Build"], locations: [], time: "Any", weather: "Any" },
  { id: 176, nationalDex: null, name: "Torkoal", types: ["Burn"], habitats: [], image: "/pokemon/324.png", rarity: "Common", specialties: ["Burn"], locations: [], time: "Any", weather: "Any" },
  { id: 177, nationalDex: null, name: "Kricketot", types: ["Hype"], habitats: [], image: "/pokemon/401.png", rarity: "Common", specialties: ["Hype"], locations: [], time: "Any", weather: "Any" },
  { id: 178, nationalDex: null, name: "Kricketune", types: ["Hype"], habitats: [], image: "/pokemon/402.png", rarity: "Common", specialties: ["Hype"], locations: [], time: "Any", weather: "Any" },
  { id: 179, nationalDex: null, name: "Chatot", types: ["Hype","Fly"], habitats: [], image: "/pokemon/441.png", rarity: "Common", specialties: ["Hype","Fly"], locations: [], time: "Any", weather: "Any" },
  { id: 180, nationalDex: null, name: "Riolu", types: ["Build"], habitats: [], image: "/pokemon/447.png", rarity: "Common", specialties: ["Build"], locations: [], time: "Any", weather: "Any" },
  { id: 181, nationalDex: null, name: "Lucario", types: ["Build"], habitats: [], image: "/pokemon/448.png", rarity: "Common", specialties: ["Build"], locations: [], time: "Any", weather: "Any" },
  { id: 182, nationalDex: null, name: "Stereo Rotom", types: ["DJ"], habitats: [], image: "/pokemon/479-stereorotom.png", rarity: "Common", specialties: ["DJ"], locations: [], time: "Any", weather: "Any" },
  { id: 183, nationalDex: null, name: "Larvesta", types: ["Burn","Litter"], habitats: [], image: "/pokemon/636.png", rarity: "Common", specialties: ["Burn","Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 184, nationalDex: null, name: "Volcarona", types: ["Burn","Litter"], habitats: [], image: "/pokemon/637.png", rarity: "Common", specialties: ["Burn","Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 185, nationalDex: null, name: "Rowlet", types: ["Grow"], habitats: [], image: "/pokemon/722.png", rarity: "Common", specialties: ["Grow"], locations: [], time: "Any", weather: "Any" },
  { id: 186, nationalDex: null, name: "Dartrix", types: ["Grow","Chop"], habitats: [], image: "/pokemon/723.png", rarity: "Common", specialties: ["Grow","Chop"], locations: [], time: "Any", weather: "Any" },
  { id: 187, nationalDex: null, name: "Decidueye", types: ["Grow","Chop"], habitats: [], image: "/pokemon/724.png", rarity: "Rare", specialties: ["Grow","Chop"], locations: [], time: "Any", weather: "Any" },
  { id: 188, nationalDex: null, name: "Scorbunny", types: ["Burn"], habitats: [], image: "/pokemon/813.png", rarity: "Common", specialties: ["Burn"], locations: [], time: "Any", weather: "Any" },
  { id: 189, nationalDex: null, name: "Raboot", types: ["Burn"], habitats: [], image: "/pokemon/814.png", rarity: "Common", specialties: ["Burn"], locations: [], time: "Any", weather: "Any" },
  { id: 190, nationalDex: null, name: "Cinderace", types: ["Burn","Hype"], habitats: [], image: "/pokemon/815.png", rarity: "Rare", specialties: ["Burn","Hype"], locations: [], time: "Any", weather: "Any" },
  { id: 191, nationalDex: null, name: "Skwovet", types: ["Search","Hype"], habitats: [], image: "/pokemon/819.png", rarity: "Common", specialties: ["Search","Hype"], locations: [], time: "Any", weather: "Any" },
  { id: 192, nationalDex: null, name: "Greedent", types: ["Party"], habitats: [], image: "/pokemon/820.png", rarity: "Common", specialties: ["Party"], locations: [], time: "Any", weather: "Any" },
  { id: 193, nationalDex: null, name: "Rolycoly", types: ["Burn","Gather"], habitats: [], image: "/pokemon/840.png", rarity: "Common", specialties: ["Burn","Gather"], locations: [], time: "Any", weather: "Any" },
  { id: 194, nationalDex: null, name: "Carkol", types: ["Burn","Gather"], habitats: [], image: "/pokemon/841.png", rarity: "Common", specialties: ["Burn","Gather"], locations: [], time: "Any", weather: "Any" },
  { id: 195, nationalDex: null, name: "Coalossal", types: ["Burn","Gather"], habitats: [], image: "/pokemon/842.png", rarity: "Rare", specialties: ["Burn","Gather"], locations: [], time: "Any", weather: "Any" },
  { id: 196, nationalDex: null, name: "Toxel", types: ["Generate"], habitats: [], image: "/pokemon/848.png", rarity: "Common", specialties: ["Generate"], locations: [], time: "Any", weather: "Any" },
  { id: 197, nationalDex: null, name: "Toxtricity Amped Form", types: ["Generate","Hype"], habitats: [], image: "/pokemon/849-amped.png", rarity: "Common", specialties: ["Generate","Hype"], locations: [], time: "Any", weather: "Any" },
  { id: 197, nationalDex: null, name: "Toxtricity Low Key Form", types: ["Generate","Hype"], habitats: [], image: "/pokemon/849-lowkey.png", rarity: "Common", specialties: ["Generate","Hype"], locations: [], time: "Any", weather: "Any" },
  { id: 198, nationalDex: null, name: "Fidough", types: ["Search"], habitats: [], image: "/pokemon/926.png", rarity: "Common", specialties: ["Search"], locations: [], time: "Any", weather: "Any" },
  { id: 199, nationalDex: null, name: "Dachsbun", types: ["Search","Trade"], habitats: [], image: "/pokemon/927.png", rarity: "Common", specialties: ["Search","Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 200, nationalDex: null, name: "Charcadet", types: ["Burn"], habitats: [], image: "/pokemon/935.png", rarity: "Common", specialties: ["Burn"], locations: [], time: "Any", weather: "Any" },
  { id: 201, nationalDex: null, name: "Armarouge", types: ["Burn","Trade"], habitats: [], image: "/pokemon/936.png", rarity: "Rare", specialties: ["Burn","Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 202, nationalDex: null, name: "Ceruledge", types: ["Burn","Trade"], habitats: [], image: "/pokemon/937.png", rarity: "Rare", specialties: ["Burn","Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 203, nationalDex: null, name: "Glimmet", types: ["Litter"], habitats: [], image: "/pokemon/969.png", rarity: "Common", specialties: ["Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 204, nationalDex: null, name: "Glimmora", types: ["Litter"], habitats: [], image: "/pokemon/970.png", rarity: "Common", specialties: ["Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 205, nationalDex: null, name: "Gimmighoul", types: ["Collect"], habitats: [], image: "/pokemon/999.png", rarity: "Common", specialties: ["Collect"], locations: [], time: "Any", weather: "Any" },
  { id: 206, nationalDex: null, name: "Gholdengo", types: ["Collect"], habitats: [], image: "/pokemon/1000.png", rarity: "Rare", specialties: ["Collect"], locations: [], time: "Any", weather: "Any" },
  { id: 207, nationalDex: null, name: "Vulpix", types: ["Burn"], habitats: ["Fluffy flower bed"], image: "/pokemon/037.png", rarity: "Common", specialties: ["Burn"], locations: [], time: "Any", weather: "Any" },
  { id: 208, nationalDex: null, name: "Ninetales", types: ["Burn"], habitats: ["Fluffy flower bed","Nine flames"], image: "/pokemon/038.png", rarity: "Rare", specialties: ["Burn"], locations: [], time: "Any", weather: "Any" },
  { id: 209, nationalDex: null, name: "Poliwag", types: ["Water"], habitats: ["Squeaky clean"], image: "/pokemon/060.png", rarity: "Common", specialties: ["Water"], locations: [], time: "Any", weather: "Any" },
  { id: 210, nationalDex: null, name: "Poliwhirl", types: ["Water"], habitats: ["Hydrated fluffy flower bed"], image: "/pokemon/061.png", rarity: "Rare", specialties: ["Water"], locations: [], time: "Any", weather: "Any" },
  { id: 211, nationalDex: null, name: "Poliwrath", types: ["Water","Build"], habitats: ["Sewer hole inspection","Dojo training"], image: "/pokemon/062.png", rarity: "Common", specialties: ["Water","Build"], locations: [], time: "Any", weather: "Any" },
  { id: 212, nationalDex: null, name: "Politoed", types: ["Water","Hype"], habitats: ["Hydrated graceful flower bed","Flower garden stump stage","Harmonious hot spring"], image: "/pokemon/186.png", rarity: "Rare", specialties: ["Water","Hype"], locations: [], time: "Any", weather: "Any" },
  { id: 213, nationalDex: null, name: "Abra", types: ["Teleport"], habitats: ["Surging psychic power","Fortune-teller's table"], image: "/pokemon/063.png", rarity: "Common", specialties: ["Teleport"], locations: [], time: "Any", weather: "Any" },
  { id: 214, nationalDex: null, name: "Kadabra", types: ["Teleport"], habitats: ["Fortune-teller's table"], image: "/pokemon/064.png", rarity: "Rare", specialties: ["Teleport"], locations: [], time: "Any", weather: "Any" },
  { id: 215, nationalDex: null, name: "Alakazam", types: ["Teleport","Trade"], habitats: ["Surging psychic power","Experiment Space"], image: "/pokemon/065.png", rarity: "Rare", specialties: ["Teleport","Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 216, nationalDex: null, name: "Mime Jr.", types: ["Gather"], habitats: [], image: "/pokemon/439.png", rarity: "Common", specialties: ["Gather"], locations: [], time: "Any", weather: "Any" },
  { id: 217, nationalDex: null, name: "Mr. Mime", types: ["Gather","Build"], habitats: ["Spotless Washing station"], image: "/pokemon/122.png", rarity: "Common", specialties: ["Gather","Build"], locations: [], time: "Any", weather: "Any" },
  { id: 218, nationalDex: null, name: "Porygon", types: ["Recycle"], habitats: ["Researcher's desk"], image: "/pokemon/137.png", rarity: "Common", specialties: ["Recycle"], locations: [], time: "Any", weather: "Any" },
  { id: 219, nationalDex: null, name: "Porygon2", types: ["Recycle"], habitats: ["Work desk"], image: "/pokemon/233.png", rarity: "Rare", specialties: ["Recycle"], locations: [], time: "Any", weather: "Any" },
  { id: 220, nationalDex: null, name: "Porygon-Z", types: ["Rarify"], habitats: [], image: "/pokemon/474.png", rarity: "Rare", specialties: ["Rarify"], locations: [], time: "Any", weather: "Any" },
  { id: 221, nationalDex: null, name: "Dratini", types: ["Water"], habitats: ["Hydrated fluffy flower bed","Simple bathroom"], image: "/pokemon/147.png", rarity: "Common", specialties: ["Water"], locations: [], time: "Any", weather: "Any" },
  { id: 222, nationalDex: null, name: "Dragonair", types: ["Water"], habitats: ["Hydrated fluffy flower bed","Simple bathroom"], image: "/pokemon/148.png", rarity: "Rare", specialties: ["Water"], locations: [], time: "Any", weather: "Any" },
  { id: 223, nationalDex: null, name: "Dragonite", types: ["Water","Fly"], habitats: ["Waterside dinghy"], image: "/pokemon/149.png", rarity: "Rare", specialties: ["Water","Fly"], locations: [], time: "Any", weather: "Any" },
  { id: 224, nationalDex: null, name: "Cyndaquil", types: ["Burn"], habitats: ["Concrete pipe secret base"], image: "/pokemon/155.png", rarity: "Common", specialties: ["Burn"], locations: [], time: "Any", weather: "Any" },
  { id: 225, nationalDex: null, name: "Quilava", types: ["Burn"], habitats: ["Concrete pipe secret base","Fireplace nap spot"], image: "/pokemon/156.png", rarity: "Common", specialties: ["Burn"], locations: [], time: "Any", weather: "Any" },
  { id: 226, nationalDex: null, name: "Typhlosion", types: ["Burn","Trade"], habitats: ["Fireplace nap spot","Top pop"], image: "/pokemon/157.png", rarity: "Rare", specialties: ["Burn","Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 227, nationalDex: null, name: "Misdreavus", types: ["Trade"], habitats: ["Fluffy flower bed","Office storeroom"], image: "/pokemon/200.png", rarity: "Common", specialties: ["Trade"], locations: [], time: "Night", weather: "Any" },
  { id: 228, nationalDex: null, name: "Mismagius", types: ["Gather","Trade"], habitats: [], image: "/pokemon/429.png", rarity: "Rare", specialties: ["Gather","Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 229, nationalDex: null, name: "Girafarig", types: ["Gather"], habitats: ["Tree-shaded fluffy flower bed"], image: "/pokemon/203.png", rarity: "Common", specialties: ["Gather"], locations: [], time: "Any", weather: "Any" },
  { id: 230, nationalDex: null, name: "Farigiraf", types: ["Gather","Search"], habitats: [], image: "/pokemon/981.png", rarity: "Rare", specialties: ["Gather","Search"], locations: [], time: "Any", weather: "Any" },
  { id: 231, nationalDex: null, name: "Ralts", types: ["Teleport"], habitats: ["Study Area"], image: "/pokemon/280.png", rarity: "Common", specialties: ["Teleport"], locations: [], time: "Any", weather: "Any" },
  { id: 232, nationalDex: null, name: "Kirlia", types: ["Teleport"], habitats: ["Study Area","Moisturizing makeup stand"], image: "/pokemon/281.png", rarity: "Rare", specialties: ["Teleport"], locations: [], time: "Any", weather: "Any" },
  { id: 233, nationalDex: null, name: "Gardevoir", types: ["Teleport","Trade"], habitats: ["Moisturizing makeup stand","Mini library"], image: "/pokemon/282.png", rarity: "Rare", specialties: ["Teleport","Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 234, nationalDex: null, name: "Gallade", types: ["Teleport","Build"], habitats: [], image: "/pokemon/475.png", rarity: "Rare", specialties: ["Teleport","Build"], locations: [], time: "Any", weather: "Any" },
  { id: 235, nationalDex: null, name: "Plusle", types: ["Generate"], habitats: [], image: "/pokemon/311.png", rarity: "Common", specialties: ["Generate"], locations: [], time: "Any", weather: "Any" },
  { id: 236, nationalDex: null, name: "Minun", types: ["Generate"], habitats: [], image: "/pokemon/312.png", rarity: "Common", specialties: ["Generate"], locations: [], time: "Any", weather: "Any" },
  { id: 237, nationalDex: null, name: "Trapinch", types: ["Bulldoze","Litter"], habitats: [], image: "/pokemon/328.png", rarity: "Common", specialties: ["Bulldoze","Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 238, nationalDex: null, name: "Vibrava", types: ["Bulldoze","Fly"], habitats: [], image: "/pokemon/329.png", rarity: "Common", specialties: ["Bulldoze","Fly"], locations: [], time: "Any", weather: "Any" },
  { id: 239, nationalDex: null, name: "Flygon", types: ["Bulldoze","Fly"], habitats: [], image: "/pokemon/330.png", rarity: "Common", specialties: ["Bulldoze","Fly"], locations: [], time: "Any", weather: "Any" },
  { id: 240, nationalDex: null, name: "Swablu", types: ["Litter"], habitats: [], image: "/pokemon/333.png", rarity: "Common", specialties: ["Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 241, nationalDex: null, name: "Altaria", types: ["Litter","Fly"], habitats: [], image: "/pokemon/334.png", rarity: "Common", specialties: ["Litter","Fly"], locations: [], time: "Any", weather: "Any" },
  { id: 242, nationalDex: null, name: "Duskull", types: ["Gather"], habitats: [], image: "/pokemon/355.png", rarity: "Common", specialties: ["Gather"], locations: [], time: "Any", weather: "Any" },
  { id: 243, nationalDex: null, name: "Dusclops", types: ["Gather"], habitats: [], image: "/pokemon/356.png", rarity: "Common", specialties: ["Gather"], locations: [], time: "Any", weather: "Any" },
  { id: 244, nationalDex: null, name: "Dusknoir", types: ["Gather","Trade"], habitats: [], image: "/pokemon/477.png", rarity: "Rare", specialties: ["Gather","Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 245, nationalDex: null, name: "Beldum", types: ["Recycle"], habitats: [], image: "/pokemon/374.png", rarity: "Common", specialties: ["Recycle"], locations: [], time: "Any", weather: "Any" },
  { id: 246, nationalDex: null, name: "Metang", types: ["Recycle"], habitats: [], image: "/pokemon/375.png", rarity: "Common", specialties: ["Recycle"], locations: [], time: "Any", weather: "Any" },
  { id: 247, nationalDex: null, name: "Metagross", types: ["Recycle","Crush"], habitats: [], image: "/pokemon/376.png", rarity: "Rare", specialties: ["Recycle","Crush"], locations: [], time: "Any", weather: "Any" },
  { id: 248, nationalDex: null, name: "Snivy", types: ["Grow","Litter"], habitats: [], image: "/pokemon/495.png", rarity: "Common", specialties: ["Grow","Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 249, nationalDex: null, name: "Servine", types: ["Grow","Litter"], habitats: [], image: "/pokemon/496.png", rarity: "Common", specialties: ["Grow","Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 250, nationalDex: null, name: "Serperior", types: ["Grow","Litter"], habitats: [], image: "/pokemon/497.png", rarity: "Rare", specialties: ["Grow","Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 251, nationalDex: null, name: "Froakie", types: ["Water"], habitats: [], image: "/pokemon/656.png", rarity: "Common", specialties: ["Water"], locations: [], time: "Any", weather: "Any" },
  { id: 252, nationalDex: null, name: "Frogadier", types: ["Water"], habitats: [], image: "/pokemon/657.png", rarity: "Common", specialties: ["Water"], locations: [], time: "Any", weather: "Any" },
  { id: 253, nationalDex: null, name: "Greninja", types: ["Water","Chop"], habitats: [], image: "/pokemon/658.png", rarity: "Rare", specialties: ["Water","Chop"], locations: [], time: "Any", weather: "Any" },
  { id: 254, nationalDex: null, name: "Dedenne", types: ["Search"], habitats: [], image: "/pokemon/702.png", rarity: "Common", specialties: ["Search"], locations: [], time: "Any", weather: "Any" },
  { id: 255, nationalDex: null, name: "Noibat", types: ["Search"], habitats: [], image: "/pokemon/714.png", rarity: "Common", specialties: ["Search"], locations: [], time: "Any", weather: "Any" },
  { id: 256, nationalDex: null, name: "Noivern", types: ["Search","Fly"], habitats: [], image: "/pokemon/715.png", rarity: "Common", specialties: ["Search","Fly"], locations: [], time: "Any", weather: "Any" },
  { id: 257, nationalDex: null, name: "Rookidee", types: ["Chop"], habitats: [], image: "/pokemon/821.png", rarity: "Common", specialties: ["Chop"], locations: [], time: "Any", weather: "Any" },
  { id: 258, nationalDex: null, name: "Corvisquire", types: ["Chop"], habitats: [], image: "/pokemon/822.png", rarity: "Common", specialties: ["Chop"], locations: [], time: "Any", weather: "Any" },
  { id: 259, nationalDex: null, name: "Corviknight", types: ["Chop","Fly"], habitats: [], image: "/pokemon/823.png", rarity: "Rare", specialties: ["Chop","Fly"], locations: [], time: "Any", weather: "Any" },
  { id: 260, nationalDex: null, name: "Dreepy", types: ["Gather","Search"], habitats: [], image: "/pokemon/885.png", rarity: "Common", specialties: ["Gather","Search"], locations: [], time: "Any", weather: "Any" },
  { id: 261, nationalDex: null, name: "Drakloak", types: ["Gather","Search"], habitats: [], image: "/pokemon/886.png", rarity: "Common", specialties: ["Gather","Search"], locations: [], time: "Any", weather: "Any" },
  { id: 262, nationalDex: null, name: "Dragapult", types: ["Gather","Trade"], habitats: [], image: "/pokemon/887.png", rarity: "Rare", specialties: ["Gather","Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 263, nationalDex: null, name: "Sprigatito", types: ["Grow"], habitats: [], image: "/pokemon/906.png", rarity: "Common", specialties: ["Grow"], locations: [], time: "Any", weather: "Any" },
  { id: 264, nationalDex: null, name: "Floragato", types: ["Grow"], habitats: [], image: "/pokemon/907.png", rarity: "Common", specialties: ["Grow"], locations: [], time: "Any", weather: "Any" },
  { id: 265, nationalDex: null, name: "Meowscarada", types: ["Grow","Hype"], habitats: [], image: "/pokemon/908.png", rarity: "Rare", specialties: ["Grow","Hype"], locations: [], time: "Any", weather: "Any" },
  { id: 266, nationalDex: null, name: "Wattrel", types: ["Generate"], habitats: [], image: "/pokemon/940.png", rarity: "Common", specialties: ["Generate"], locations: [], time: "Any", weather: "Any" },
  { id: 267, nationalDex: null, name: "Kilowattrel", types: ["Generate","Fly"], habitats: [], image: "/pokemon/941.png", rarity: "Common", specialties: ["Generate","Fly"], locations: [], time: "Any", weather: "Any" },
  { id: 268, nationalDex: null, name: "Tinkatink", types: ["Build"], habitats: [], image: "/pokemon/957.png", rarity: "Common", specialties: ["Build"], locations: [], time: "Any", weather: "Any" },
  { id: 269, nationalDex: null, name: "Tinkatuff", types: ["Build"], habitats: [], image: "/pokemon/958.png", rarity: "Common", specialties: ["Build"], locations: [], time: "Any", weather: "Any" },
  { id: 270, nationalDex: null, name: "Tinkaton", types: ["Engineer"], habitats: [], image: "/pokemon/959.png", rarity: "Rare", specialties: ["Engineer"], locations: [], time: "Any", weather: "Any" },
  { id: 271, nationalDex: null, name: "Aerodactyl", types: ["Fly"], habitats: ["Wing Fossil Display"], image: "/pokemon/142.png", rarity: "Rare", specialties: ["Fly"], locations: [], time: "Any", weather: "Any" },
  { id: 272, nationalDex: null, name: "Cranidos", types: ["Crush"], habitats: [], image: "/pokemon/408.png", rarity: "Common", specialties: ["Crush"], locations: [], time: "Any", weather: "Any" },
  { id: 273, nationalDex: null, name: "Rampardos", types: ["Crush","Litter"], habitats: [], image: "/pokemon/409.png", rarity: "Rare", specialties: ["Crush","Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 274, nationalDex: null, name: "Shieldon", types: ["Crush"], habitats: [], image: "/pokemon/410.png", rarity: "Common", specialties: ["Crush"], locations: [], time: "Any", weather: "Any" },
  { id: 275, nationalDex: null, name: "Bastiodon", types: ["Crush","Litter"], habitats: [], image: "/pokemon/411.png", rarity: "Rare", specialties: ["Crush","Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 276, nationalDex: null, name: "Tyrunt", types: ["Crush"], habitats: [], image: "/pokemon/696.png", rarity: "Common", specialties: ["Crush"], locations: [], time: "Any", weather: "Any" },
  { id: 277, nationalDex: null, name: "Tyrantrum", types: ["Crush","Litter"], habitats: [], image: "/pokemon/697.png", rarity: "Rare", specialties: ["Crush","Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 278, nationalDex: null, name: "Amaura", types: ["Crush"], habitats: [], image: "/pokemon/698.png", rarity: "Common", specialties: ["Crush"], locations: [], time: "Any", weather: "Any" },
  { id: 279, nationalDex: null, name: "Aurorus", types: ["Crush","Litter"], habitats: [], image: "/pokemon/699.png", rarity: "Rare", specialties: ["Crush","Litter"], locations: [], time: "Any", weather: "Any" },
  { id: 280, nationalDex: null, name: "Eevee", types: ["Trade"], habitats: ["Pretty flower bed"], image: "/pokemon/133.png", rarity: "Common", specialties: ["Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 281, nationalDex: null, name: "Vaporeon", types: ["Water"], habitats: ["Boundless blue beverage"], image: "/pokemon/134.png", rarity: "Rare", specialties: ["Water"], locations: [], time: "Any", weather: "Any" },
  { id: 282, nationalDex: null, name: "Jolteon", types: ["Generate"], habitats: ["Electrifying potatoes"], image: "/pokemon/135.png", rarity: "Rare", specialties: ["Generate"], locations: [], time: "Any", weather: "Any" },
  { id: 283, nationalDex: null, name: "Flareon", types: ["Burn"], habitats: ["Burning-hot spice"], image: "/pokemon/136.png", rarity: "Rare", specialties: ["Burn"], locations: [], time: "Any", weather: "Any" },
  { id: 284, nationalDex: null, name: "Espeon", types: ["Gather"], habitats: ["Elegant daytime treats"], image: "/pokemon/196.png", rarity: "Rare", specialties: ["Gather"], locations: [], time: "Any", weather: "Any" },
  { id: 285, nationalDex: null, name: "Umbreon", types: ["Search"], habitats: ["Dark-chocolate cookies"], image: "/pokemon/197.png", rarity: "Rare", specialties: ["Search"], locations: [], time: "Any", weather: "Any" },
  { id: 286, nationalDex: null, name: "Leafeon", types: ["Grow"], habitats: [], image: "/pokemon/470.png", rarity: "Rare", specialties: ["Grow"], locations: [], time: "Any", weather: "Any" },
  { id: 287, nationalDex: null, name: "Glaceon", types: ["Trade"], habitats: [], image: "/pokemon/471.png", rarity: "Rare", specialties: ["Trade"], locations: [], time: "Any", weather: "Any" },
  { id: 288, nationalDex: null, name: "Sylveon", types: ["Hype"], habitats: [], image: "/pokemon/700.png", rarity: "Rare", specialties: ["Hype"], locations: [], time: "Any", weather: "Any" },
  { id: 289, nationalDex: null, name: "Kyogre", types: ["???"], habitats: [], image: "/pokemon/382.png", rarity: "Legendary", specialties: ["???"], locations: [], time: "Any", weather: "Any" },
  { id: 290, nationalDex: null, name: "Raikou", types: ["Generate"], habitats: [], image: "/pokemon/243.png", rarity: "Legendary", specialties: ["Generate"], locations: [], time: "Any", weather: "Any" },
  { id: 291, nationalDex: null, name: "Entei", types: ["Burn"], habitats: [], image: "/pokemon/244.png", rarity: "Legendary", specialties: ["Burn"], locations: [], time: "Any", weather: "Any" },
  { id: 292, nationalDex: null, name: "Suicune", types: ["Water"], habitats: [], image: "/pokemon/245.png", rarity: "Legendary", specialties: ["Water"], locations: [], time: "Any", weather: "Any" },
  { id: 293, nationalDex: null, name: "Volcanion", types: ["Burn"], habitats: [], image: "/pokemon/721.png", rarity: "Legendary", specialties: ["Burn"], locations: [], time: "Any", weather: "Any" },
  { id: 294, nationalDex: null, name: "Articuno", types: ["Fly"], habitats: [], image: "/pokemon/144.png", rarity: "Legendary", specialties: ["Fly"], locations: [], time: "Any", weather: "Any" },
  { id: 295, nationalDex: null, name: "Zapdos", types: ["Fly"], habitats: [], image: "/pokemon/145.png", rarity: "Legendary", specialties: ["Fly"], locations: [], time: "Any", weather: "Any" },
  { id: 296, nationalDex: null, name: "Moltres", types: ["Fly"], habitats: [], image: "/pokemon/146.png", rarity: "Legendary", specialties: ["Fly"], locations: [], time: "Any", weather: "Any" },
  { id: 297, nationalDex: null, name: "Lugia", types: ["???"], habitats: [], image: "/pokemon/249.png", rarity: "Legendary", specialties: ["???"], locations: [], time: "Any", weather: "Any" },
  { id: 298, nationalDex: null, name: "Ho-Oh", types: ["???"], habitats: [], image: "/pokemon/250.png", rarity: "Legendary", specialties: ["???"], locations: [], time: "Any", weather: "Any" },
  { id: 299, nationalDex: null, name: "Mewtwo", types: ["Teleport"], habitats: [], image: "/pokemon/150.png", rarity: "Legendary", specialties: ["Teleport"], locations: [], time: "Any", weather: "Any" },
  { id: 300, nationalDex: null, name: "Mew", types: ["Teleport"], habitats: [], image: "/pokemon/151.png", rarity: "Legendary", specialties: ["Teleport"], locations: [], time: "Any", weather: "Any" },
];

// Location → pokemon mapping (populated from habitats data)
function getLocationsForPokemon(_name: string): string[] {
  return [];
}

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
  isOfficial?: boolean;
  createdAt: string;
}

export const cloudIslandsPosts: CloudIslandPost[] = [
  // Featured community island
  { id: 0, islandCode: "PXQC-G03S", title: "Pokemon Info Board", description: "The ultimate resource island! Complete habitat guides, item locations, and rare Pokemon spawns all in one place. Updated weekly with new finds.", author: "InfoMaster", screenshots: [], likes: 2847, isDream: false, isFeatured: true, isOfficial: false, createdAt: "2026-03-01" },
  // Developer Islands (official)
  { id: 1, islandCode: "POKO-PIA", title: "Pokopia Dev Island", description: "Official developer showcase island with unique furniture, statues, fountains, and a special Ditto bathtub! Great for reference photos.", author: "Developer", screenshots: [], likes: 312, isDream: false, isFeatured: true, isOfficial: true, createdAt: "2026-03-05" },
  { id: 2, islandCode: "EIKO-CITY", title: "EIKO City", description: "Features rare Plusle & Minun habitats, urban design inspiration, and unique garden ornaments. Take reference photos for 3D printing!", author: "Developer", screenshots: [], likes: 248, isDream: false, isFeatured: true, isOfficial: true, createdAt: "2026-03-05" },
  { id: 3, islandCode: "TEST-DEVS", title: "Dev Test Island", description: "Experimental island with advanced terrain sculpting, water features, and elevated builds. Perfect for learning advanced techniques.", author: "Developer", screenshots: [], likes: 156, isDream: false, isFeatured: true, isOfficial: true, createdAt: "2026-03-05" },
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
