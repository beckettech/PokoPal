// Pokopia Store - State management for the app
import { create } from "zustand";

export type Page = 
  | "home" 
  | "dex" 
  | "habitat-dex" 
  | "map" 
  | "requests" 
  | "cloud-islands" 
  | "dream-islands" 
  | "moves" 
  | "mystery-gifts" 
  | "chat"
  | "coin-shop";

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  image: string;
}

interface AppState {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  // Deep-link: navigate to a page and open a specific item
  navigateToPokemon: (pokemonId: number) => void;
  navigateToHabitat: (habitatId: number) => void;
  navigateToLocation: (locationId: string) => void;
  focusedPokemonId: number | null;
  focusedHabitatId: number | null;
  focusedLocationId: string | null;
  clearFocus: () => void;
  coins: number;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  selectedPokemon: Pokemon | null;
  setSelectedPokemon: (pokemon: Pokemon | null) => void;
  capturedPokemon: number[];
  addCapturedPokemon: (id: number) => void;
  toggleCapturedPokemon: (id: number) => void;
  isPokemonCaptured: (id: number) => boolean;
  visitedIslands: string[];
  toggleVisitedIsland: (id: string) => void;
}

export const useAppStore = create<AppState>()((set, get) => ({
  currentPage: "home",
  setCurrentPage: (page) => set({ currentPage: page }),
  focusedPokemonId: null,
  focusedHabitatId: null,
  focusedLocationId: null,
  navigateToPokemon: (pokemonId) => set({ currentPage: "dex", focusedPokemonId: pokemonId, focusedHabitatId: null, focusedLocationId: null }),
  navigateToHabitat: (habitatId) => set({ currentPage: "habitat-dex", focusedHabitatId: habitatId, focusedPokemonId: null, focusedLocationId: null }),
  navigateToLocation: (locationId) => set({ currentPage: "map", focusedLocationId: locationId, focusedPokemonId: null, focusedHabitatId: null }),
  clearFocus: () => set({ focusedPokemonId: null, focusedHabitatId: null, focusedLocationId: null }),
  coins: 100,
  addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
  spendCoins: (amount) => {
    const current = get().coins;
    if (current >= amount) {
      set({ coins: current - amount });
      return true;
    }
    return false;
  },
  selectedPokemon: null,
  setSelectedPokemon: (pokemon) => set({ selectedPokemon: pokemon }),
  capturedPokemon: [1, 4, 7, 25, 133],
  addCapturedPokemon: (id) => set((state) => ({ 
    capturedPokemon: state.capturedPokemon.includes(id) 
      ? state.capturedPokemon 
      : [...state.capturedPokemon, id] 
  })),
  toggleCapturedPokemon: (id) => set((state) => ({ 
    capturedPokemon: state.capturedPokemon.includes(id) 
      ? state.capturedPokemon.filter(pid => pid !== id)
      : [...state.capturedPokemon, id] 
  })),
  isPokemonCaptured: (id) => get().capturedPokemon.includes(id),
  visitedIslands: [],
  toggleVisitedIsland: (id) => set((state) => ({
    visitedIslands: state.visitedIslands.includes(id)
      ? state.visitedIslands.filter(i => i !== id)
      : [...state.visitedIslands, id]
  })),
}));
