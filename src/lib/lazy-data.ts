// lazy-data.ts — Fetch JSON data on-demand with in-memory caching
// Keeps the app shell lightweight; data loads when pages are visited.

import React from "react";

const cache = new Map<string, Promise<any>>();

async function fetchJson<T>(path: string): Promise<T> {
  const cached = cache.get(path);
  if (cached) return cached as Promise<T>;

  const promise = fetch(path)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
      return res.json();
    })
    .then(data => data as T);

  cache.set(path, promise);
  return promise;
}

export const fetchPokemonList = () => fetchJson<import("./pokemon-data").Pokemon[]>("/pokemon-list.json");
export const fetchHabitats = () => fetchJson<any[]>("/habitats.json");
export const fetchItems = () => fetchJson<any[]>("/items.json");
export const fetchRequestsList = () => fetchJson<import("./pokemon-data").Request[]>("/requests-list.json");
export const fetchLocations = () => fetchJson<any[]>("/locations.json");
export const fetchRecipes = () => fetchJson<any[]>("/recipes.json");
export const fetchCookingRecipes = () => fetchJson<any[]>("/cooking-recipes.json");
export const fetchSpecialties = () => fetchJson<any[]>("/specialties.json");
export const fetchCloudIslands = () => fetchJson<import("./pokemon-data").CloudIslandPost[]>("/cloud-islands.json");

export function useLazyData<T>(fetcher: () => Promise<T>): { data: T | null; loading: boolean; error: string | null } {
  const [state, setState] = React.useState<{ data: T | null; loading: boolean; error: string | null }>({
    data: null, loading: true, error: null,
  });

  React.useEffect(() => {
    let cancelled = false;
    fetcher()
      .then(data => { if (!cancelled) setState({ data, loading: false, error: null }); })
      .catch(err => { if (!cancelled) setState({ data: null, loading: false, error: String(err) }); });
    return () => { cancelled = true; };
  }, [fetcher]);

  return state;
}
