// remote-data.ts — Fetch live game data from server, fall back to bundled data
// App loads instantly with bundled data, checks for updates in background

import type { Pokemon, Request as RequestType } from './pokemon-data';

const CACHE_KEY = 'pokopia_data_version';
const CACHE_TS_KEY = 'pokopia_data_ts';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

interface RemoteGameData {
  version: string;
  pokemon?: Partial<Pokemon>[];
  requests?: Partial<RequestType>[];
  overrides?: Record<string, any>;
}

// Store overrides in memory
let overrides: Record<string, any> = {};
let lastFetch = 0;

/**
 * Check for remote data updates. Call on app startup.
 * Returns true if new data was loaded.
 */
export async function checkForUpdates(apiBaseUrl?: string): Promise<boolean> {
  // Don't fetch too often
  const now = Date.now();
  if (now - lastFetch < CACHE_DURATION) return false;

  const base = apiBaseUrl || (typeof window !== 'undefined' ? '' : '');
  if (!base) return false;

  try {
    const res = await fetch(`${base}/api/game-data`, {
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (!res.ok) return false;

    const data: RemoteGameData = await res.json();
    const storedVersion = typeof localStorage !== 'undefined' ? localStorage.getItem(CACHE_KEY) : null;

    if (data.version === storedVersion) {
      lastFetch = now;
      return false;
    }

    // Apply overrides
    if (data.overrides) {
      overrides = { ...overrides, ...data.overrides };
    }

    // Cache version
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(CACHE_KEY, data.version || '');
      localStorage.setItem(CACHE_TS_KEY, String(now));
    }

    lastFetch = now;
    return true;
  } catch {
    return false;
  }
}

/**
 * Get an override value for a data field.
 * Usage: getOverride('pokemon', 19, 'locations') → returns override or undefined
 */
export function getOverride(...path: string[]): any {
  let current = overrides;
  for (const key of path) {
    if (current == null) return undefined;
    current = current[key];
  }
  return current;
}

/**
 * Apply data overrides to bundled data.
 * Call this when rendering pokemon/request details.
 */
export function applyPokemonOverride(pokemon: Pokemon): Pokemon {
  const override = getOverride('pokemon', String(pokemon.id));
  if (!override) return pokemon;
  return { ...pokemon, ...override };
}

export function applyRequestOverride(request: any): any {
  const override = getOverride('requests', request.id);
  if (!override) return request;
  return { ...request, ...override };
}
