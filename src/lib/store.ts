// Pokopia Store - State management for the app
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Page = 
  | "home" 
  | "dex" 
  | "habitat-dex" 
  | "map" 
  | "requests" 
  | "cloud-islands" 
  | "dream-islands" 
  | "relics" 
  | "items"
  | "mystery-gifts" 
  | "chat"
  | "coin-shop";

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  image: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
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
  // Login streak
  loginStreak: number;
  lastLoginDate: string | null;
  checkLoginStreak: () => number | null; // Returns coins earned or null if already claimed today
  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  clearChatMessages: () => void;
  selectedPokemon: Pokemon | null;
  setSelectedPokemon: (pokemon: Pokemon | null) => void;
  capturedPokemon: number[];
  addCapturedPokemon: (id: number) => void;
  toggleCapturedPokemon: (id: number) => void;
  isPokemonCaptured: (id: number) => boolean;
  visitedIslands: string[];
  toggleVisitedIsland: (id: string) => void;
  savedIslands: string[];
  toggleSavedIsland: (id: string) => void;
  discoveredHabitats: number[];
  toggleDiscoveredHabitat: (id: number) => void;
  visitedLocations: string[];
  toggleVisitedLocation: (id: string) => void;
  foundRelics: string[];
  toggleFoundRelic: (id: string) => void;
  foundFossils: string[];
  toggleFoundFossil: (id: string) => void;
  ownedItems: string[];
  toggleOwnedItem: (slug: string) => void;
  completedRequests: string[];
  toggleCompletedRequest: (id: string) => void;
  inProgressRequests: string[];
  toggleInProgressRequest: (id: string) => void;
  claimedGifts: string[];
  toggleClaimedGift: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentPage: "home",
      setCurrentPage: (page) => set({ currentPage: page }),
      focusedPokemonId: null,
      focusedHabitatId: null,
      focusedLocationId: null,
      navigateToPokemon: (pokemonId) => set({ currentPage: "dex", focusedPokemonId: pokemonId, focusedHabitatId: null, focusedLocationId: null }),
      navigateToHabitat: (habitatId) => set({ currentPage: "habitat-dex", focusedHabitatId: habitatId, focusedPokemonId: null, focusedLocationId: null }),
      navigateToLocation: (locationId) => set({ currentPage: "map", focusedLocationId: locationId, focusedPokemonId: null, focusedHabitatId: null }),
      clearFocus: () => set({ focusedPokemonId: null, focusedHabitatId: null, focusedLocationId: null }),
      coins: 1000, // Start with 1000 coins
      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
      spendCoins: (amount) => {
        const current = get().coins;
        if (current >= amount) {
          set({ coins: current - amount });
          return true;
        }
        return false;
      },
      // Login streak rewards: Day 1=100, Day 2=150, Day 3=200, Day 4=250, Day 5=300, Day 6=400, Day 7=500
      loginStreak: 0,
      lastLoginDate: null,
      checkLoginStreak: () => {
        const today = new Date().toDateString();
        const { lastLoginDate, loginStreak } = get();
        
        // Already claimed today
        if (lastLoginDate === today) return null;
        
        // Calculate streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isConsecutive = lastLoginDate === yesterday.toDateString();
        
        const newStreak = isConsecutive ? loginStreak + 1 : 1;
        const streakDay = ((newStreak - 1) % 7) + 1; // Cycle every 7 days
        
        const rewards = [100, 150, 200, 250, 300, 400, 500];
        const reward = rewards[streakDay - 1];
        
        set({ loginStreak: newStreak, lastLoginDate: today, coins: get().coins + reward });
        return reward;
      },
      // Chat messages
      chatMessages: [],
      addChatMessage: (message) => set((state) => ({
        chatMessages: [...state.chatMessages, {
          ...message,
          id: crypto.randomUUID(),
          timestamp: Date.now()
        }]
      })),
      clearChatMessages: () => set({ chatMessages: [] }),
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
      savedIslands: [],
      toggleSavedIsland: (id) => set((state) => ({
        savedIslands: state.savedIslands.includes(id)
          ? state.savedIslands.filter(i => i !== id)
          : [...state.savedIslands, id]
      })),
      discoveredHabitats: [],
      toggleDiscoveredHabitat: (id) => set((state) => ({
        discoveredHabitats: state.discoveredHabitats.includes(id)
          ? state.discoveredHabitats.filter(h => h !== id)
          : [...state.discoveredHabitats, id]
      })),
      visitedLocations: [],
      toggleVisitedLocation: (id) => set((state) => ({
        visitedLocations: state.visitedLocations.includes(id)
          ? state.visitedLocations.filter(l => l !== id)
          : [...state.visitedLocations, id]
      })),
      foundRelics: [],
      toggleFoundRelic: (id) => set((state) => ({
        foundRelics: state.foundRelics.includes(id)
          ? state.foundRelics.filter(r => r !== id)
          : [...state.foundRelics, id]
      })),
      foundFossils: [],
      toggleFoundFossil: (id) => set((state) => ({
        foundFossils: state.foundFossils.includes(id)
          ? state.foundFossils.filter(f => f !== id)
          : [...state.foundFossils, id]
      })),
      ownedItems: [],
      toggleOwnedItem: (slug) => set((state) => ({
        ownedItems: state.ownedItems.includes(slug)
          ? state.ownedItems.filter(s => s !== slug)
          : [...state.ownedItems, slug]
      })),
      claimedGifts: [],
      toggleClaimedGift: (id) => set((state) => ({
        claimedGifts: state.claimedGifts.includes(id)
          ? state.claimedGifts.filter(g => g !== id)
          : [...state.claimedGifts, id]
      })),
      completedRequests: [],
      toggleCompletedRequest: (id) => set((state) => ({
        completedRequests: state.completedRequests.includes(id)
          ? state.completedRequests.filter(r => r !== id)
          : [...state.completedRequests, id],
        // Remove from in-progress when marking complete
        inProgressRequests: state.completedRequests.includes(id)
          ? state.inProgressRequests
          : state.inProgressRequests.filter(r => r !== id),
      })),
      inProgressRequests: [],
      toggleInProgressRequest: (id) => set((state) => ({
        inProgressRequests: state.inProgressRequests.includes(id)
          ? state.inProgressRequests.filter(r => r !== id)
          : [...state.inProgressRequests, id]
      })),
    }),
    {
      name: "pokopia-storage",
      version: 2,
      migrate: (persistedState: any, version: number) => {
        // Migrate: give users 1000 coins if they have less than 100 (old default was 0 or 100)
        if (persistedState.coins < 100) {
          persistedState.coins = 1000;
        }
        return persistedState;
      },
      partialize: (state) => ({
        capturedPokemon: state.capturedPokemon,
        visitedIslands: state.visitedIslands,
        savedIslands: state.savedIslands,
        discoveredHabitats: state.discoveredHabitats,
        visitedLocations: state.visitedLocations,
        foundRelics: state.foundRelics,
        foundFossils: state.foundFossils,
        ownedItems: state.ownedItems,
        coins: state.coins,
        loginStreak: state.loginStreak,
        lastLoginDate: state.lastLoginDate,
        chatMessages: state.chatMessages,
        completedRequests: state.completedRequests,
        inProgressRequests: state.inProgressRequests,
        claimedGifts: state.claimedGifts,
      }),
    }
  )
);
