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
  coins: number;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  selectedPokemon: Pokemon | null;
  setSelectedPokemon: (pokemon: Pokemon | null) => void;
  capturedPokemon: number[];
  addCapturedPokemon: (id: number) => void;
  toggleCapturedPokemon: (id: number) => void;
  isPokemonCaptured: (id: number) => boolean;
}

export const useAppStore = create<AppState>()((set, get) => ({
  currentPage: "home",
  setCurrentPage: (page) => set({ currentPage: page }),
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
}));
