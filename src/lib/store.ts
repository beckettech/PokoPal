// Pokopia Store - State management for the app
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getApiUrl } from "./api-config";

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
  | "coin-shop"
  | "account";

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

// User/Account system
interface UserState {
  userId: string;
  isPremium: boolean;
  premiumPurchaseDate: string | null;
  adsRemoved: boolean;
  lastPurchaseRestore: string | null;
  email: string | null;
  isLoggedIn: boolean;
  authToken: string | null;
}

// Admin state
interface AdminConfig {
  broadcastMessage: string | null;
  dataVersion: number;
}

interface AppState {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  // Deep-link: navigate to a page and open a specific item
  navigateToPokemon: (pokemonId: number) => void;
  navigateToHabitat: (habitatId: number) => void;
  navigateToLocation: (locationId: string) => void;
  navigateToItem: (slug: string) => void;
  focusedPokemonId: number | null;
  focusedHabitatId: number | null;
  focusedLocationId: string | null;
  focusedItemSlug: string | null;
  clearFocus: () => void;
  coins: number;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  // Daily Stamp Rewards
  coinStamps: number[];
  coinLastStampDate: string | null;
  claimCoinStamp: (totalDays: number, coinsPerDay: number[]) => { day: number; coins: number } | null;
  dexterStamps: number[];
  dexterLastStampDate: string | null;
  claimDexterStamp: (totalDays: number, coinsPerDay: number[]) => { day: number; coins: number } | null;
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
  // User/Account
  user: UserState;
  darkMode: boolean;
  handle: string; // User's @handle for community features
  visitedPages: string[];
  markPageVisited: (page: string) => void;
  setPremium: (isPremium: boolean) => void;
  setAdsRemoved: (removed: boolean) => void;
  restorePurchases: () => void;
  toggleDarkMode: () => void;
  setHandle: (handle: string) => void;
  signUp: (email: string, password: string, handle: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  // Admin (not persisted)
  isAdmin: boolean;
  adminConfig: AdminConfig;
  godMode: boolean;
  adminForceAds: "default" | "show" | "hide";
  setAdminConfig: (config: Partial<AdminConfig>) => void;
  setIsAdmin: (val: boolean) => void;
  setGodMode: (val: boolean) => void;
  setAdminForceAds: (val: "default" | "show" | "hide") => void;
  fetchAdminConfig: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentPage: "home",
      setCurrentPage: (page) => set({ currentPage: page }),
      focusedPokemonId: null,
      focusedHabitatId: null,
      focusedLocationId: null,
      focusedItemSlug: null,
      navigateToPokemon: (pokemonId) => set({ currentPage: "dex", focusedPokemonId: pokemonId, focusedHabitatId: null, focusedLocationId: null }),
      navigateToHabitat: (habitatId) => set({ currentPage: "habitat-dex", focusedHabitatId: habitatId, focusedPokemonId: null, focusedLocationId: null }),
      navigateToLocation: (locationId) => set({ currentPage: "map", focusedLocationId: locationId, focusedPokemonId: null, focusedHabitatId: null, focusedItemSlug: null }),
      navigateToItem: (slug) => set({ currentPage: "items", focusedItemSlug: slug, focusedPokemonId: null, focusedHabitatId: null }),
      clearFocus: () => set({ focusedPokemonId: null, focusedHabitatId: null, focusedLocationId: null, focusedItemSlug: null }),
      coins: 250, // Start with 250 coins
      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
      spendCoins: (amount) => {
        const current = get().coins;
        if (current >= amount) {
          set({ coins: current - amount });
          return true;
        }
        return false;
      },
      // Daily Stamp Rewards (per shop)
      coinStamps: [] as number[],
      coinLastStampDate: null as string | null,
      claimCoinStamp: (totalDays: number, coinsPerDay: number[]) => {
        const today = new Date().toDateString();
        const { coinStamps, coinLastStampDate, coins } = get();
        if (coinLastStampDate === today) return null; // already stamped today
        if (coinStamps.length >= totalDays) {
          // reset cycle
          set({ coinStamps: [], coinLastStampDate: null });
          return null;
        }
        const nextDay = coinStamps.length + 1;
        const reward = coinsPerDay[nextDay - 1];
        set({ coinStamps: [...coinStamps, nextDay], coinLastStampDate: today, coins: coins + reward });
        return { day: nextDay, coins: reward };
      },
      dexterStamps: [] as number[],
      dexterLastStampDate: null as string | null,
      claimDexterStamp: (totalDays: number, coinsPerDay: number[]) => {
        const today = new Date().toDateString();
        const { dexterStamps, dexterLastStampDate } = get();
        if (dexterLastStampDate === today) return null;
        if (dexterStamps.length >= totalDays) {
          set({ dexterStamps: [], dexterLastStampDate: null });
          return null;
        }
        const nextDay = dexterStamps.length + 1;
        const reward = coinsPerDay[nextDay - 1];
        // We need addDexterCoins from the store — but it's in a different store slice.
        // We'll just return the reward and let the component handle adding coins.
        set({ dexterStamps: [...dexterStamps, nextDay], dexterLastStampDate: today });
        return { day: nextDay, coins: reward };
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
      // User/Account state
      user: {
        userId: typeof window !== 'undefined' ? (localStorage.getItem('pokopia_user_id') || crypto.randomUUID()) : crypto.randomUUID(),
        isPremium: false,
        premiumPurchaseDate: null,
        adsRemoved: false,
        lastPurchaseRestore: null,
        email: null,
        isLoggedIn: false,
        authToken: null,
      },
      darkMode: false,
      handle: "",
      visitedPages: [],
      markPageVisited: (page) => set((state) => ({
        visitedPages: state.visitedPages.includes(page)
          ? state.visitedPages
          : [...state.visitedPages, page]
      })),
      setHandle: (handle) => set({ handle }),
      toggleDarkMode: () => set((state) => {
        const next = !state.darkMode;
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', next);
        }
        return { darkMode: next };
      }),
      setPremium: (isPremium) => set((state) => ({
        user: {
          ...state.user,
          isPremium,
          premiumPurchaseDate: isPremium ? new Date().toISOString() : null,
          adsRemoved: isPremium,
        }
      })),
      setAdsRemoved: (removed) => set((state) => ({
        user: {
          ...state.user,
          adsRemoved: removed,
        }
      })),
      restorePurchases: () => set((state) => ({
        user: {
          ...state.user,
          lastPurchaseRestore: new Date().toISOString(),
        }
      })),
      signUp: async (email, password, handle) => {
        if (!email || !password || !handle) return false;
        const state = get();
        set({
          user: { ...state.user, email: email.toLowerCase(), isLoggedIn: true, authToken: crypto.randomUUID() },
          handle: handle.toLowerCase().replace("@", ""),
          isAdmin: email.toLowerCase() === "becketthoefling@gmail.com",
        });
        return true;
      },
      signIn: async (email, password) => {
        if (!email || !password) return false;
        const state = get();
        set({
          user: { ...state.user, email: email.toLowerCase(), isLoggedIn: true, authToken: crypto.randomUUID() },
          isAdmin: email.toLowerCase() === "becketthoefling@gmail.com",
        });
        if (isAdmin) {
          // Fetch admin config in background
          try {
            const res = await fetch(getApiUrl("/api/admin/config"), {
              headers: { Authorization: `Bearer ${get().user.authToken}` },
            });
            if (res.ok) {
              const config = await res.json();
              set({ adminConfig: { broadcastMessage: config.broadcastMessage, dataVersion: config.dataVersion } });
            }
          } catch { /* ignore */ }
        }
        return true;
      },
      signOut: () => set((state) => ({
        user: { ...state.user, email: null, isLoggedIn: false, authToken: null },
        chatMessages: [],
        handle: "",
        isAdmin: false,
        godMode: false,
      })),
      // Admin
      isAdmin: false,
      adminConfig: { broadcastMessage: null, dataVersion: 1 },
      godMode: false,
      adminForceAds: "default",
      setAdminConfig: (config) => set((state) => ({
        adminConfig: { ...state.adminConfig, ...config },
      })),
      setIsAdmin: (val) => set({ isAdmin: val }),
      setGodMode: (val) => set({ godMode: val }),
      setAdminForceAds: (val) => set({ adminForceAds: val }),
      fetchAdminConfig: async () => {
        try {
          const token = get().user.authToken;
          if (!token) return;
          const res = await fetch(getApiUrl("/api/admin/config"), {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            set({ adminConfig: { broadcastMessage: data.broadcastMessage, dataVersion: data.dataVersion } });
          }
        } catch { /* ignore */ }
      },
    }),
    {
      name: "pokopia-storage",
      version: 4,
      migrate: (persistedState: any, version: number) => {
        // v3: give users coins if they have less than 150
        if (persistedState.coins < 150) {
          persistedState.coins = 250;
        }
        // v4: ensure user state exists
        if (!persistedState.user) {
          persistedState.user = { userId: null, isLoggedIn: false, isPremium: false, adsRemoved: false };
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
        coinStamps: state.coinStamps,
        coinLastStampDate: state.coinLastStampDate,
        dexterStamps: state.dexterStamps,
        dexterLastStampDate: state.dexterLastStampDate,
        chatMessages: state.chatMessages,
        completedRequests: state.completedRequests,
        inProgressRequests: state.inProgressRequests,
        claimedGifts: state.claimedGifts,
        user: state.user,
        darkMode: state.darkMode,
        handle: state.handle,
        visitedPages: state.visitedPages,
        adminForceAds: state.adminForceAds,
      }),
      merge: (persisted: any, current: any) => {
        // If current state has an active login session, always preserve it
        if (current.user?.isLoggedIn && !persisted.user?.isLoggedIn) {
          // User just logged in — keep current login, merge everything else from persisted
          const { user: _ignoredUser, ...restPersisted } = persisted;
          return { ...current, ...restPersisted };
        }
        return { ...current, ...persisted };
      },
      onRehydrateStorage: () => (state) => {
        // After rehydration, ensure login state isn't lost
        // This handles the case where persist overwrites a fresh login
      },
    }
  )
);
