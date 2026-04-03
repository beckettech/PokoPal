// pokemon-data.ts — Types for Pokopia Guide
// Data is now lazy-loaded from public/*.json via src/lib/lazy-data.ts
// Inline data was extracted via scripts/extract-data.js

export type Specialty =
  | "Grow" | "Build" | "Chop" | "Burn" | "Water" | "Gather" | "Generate"
  | "Search" | "Fly" | "Trade" | "Crush" | "Bulldoze" | "Litter" | "Hype"
  | "Teleport" | "Transform" | "Recycle" | "Storage" | "Paint" | "Yawn"
  | "Explode" | "Eat" | "Gather Honey" | "Dream Island" | "Illuminate"
  | "DJ" | "Party" | "Collect" | "Rarify" | "Engineer" | "Appraise" | "???";

export interface Pokemon {
  id: number;
  nationalDex: number | null;
  name: string;
  types: Specialty[];
  habitats: string[];
  image: string;
  rarity: "Common" | "Rare" | "Legendary";
  specialties: Specialty[];
  locations: string[];
  time: string;
  weather: string;
  obtainMethod?: string;
  habitatBuilt?: string;
}

export type RawPokemon = Pokemon;

export const rarities = ["Common", "Rare", "Legendary"] as const;

export interface HabitatInfo {
  id: number;
  name: string;
  category: string;
  buildConditions: string[];
  buildItems: string[];
  residents: string[];
  notes?: string;
}

export interface Move {
  id: number;
  name: string;
  type: string;
  category: string;
  description: string;
  worldEffect: string;
  unlockCondition: string;
}

export interface Request {
  id: number;
  name: string;
  category: string;
  description: string;
  rewards: string[];
  unlocks: string[];
  status: "available" | "in_progress" | "completed";
  items?: string[];
}

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

export interface MysteryGift {
  id: number;
  name: string;
  description: string;
  type: "item" | "pokemon" | "currency" | "special";
  expiresAt: string;
  claimed: boolean;
  image?: string;
}

// Specialty icon lookup — lazy-loaded
let _specialtyIconMap: Record<string, string> | null = null;

export async function preloadSpecialtyIcons() {
  if (_specialtyIconMap) return;
  const res = await fetch("/specialties.json");
  const data = await res.json();
  _specialtyIconMap = {};
  for (const s of data as any[]) {
    _specialtyIconMap[s.name.toLowerCase()] = s.icon;
  }
}

export function getSpecialtyIcon(name: string): string {
  return _specialtyIconMap?.[name.toLowerCase()] || "";
}

export function getSpecialtyIcons(specialties: string[]): string[] {
  return specialties
    .filter(s => s && s.trim().length > 0)
    .map(getSpecialtyIcon);
}
