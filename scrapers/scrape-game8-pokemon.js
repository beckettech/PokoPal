/**
 * Scrape per-Pokemon location data from Game8
 * Updates pokemon-serebii.json with accurate locations
 * 
 * Run: node scrapers/scrape-game8-pokemon.js
 */

const fs = require('fs');
const path = require('path');

const POKEMON_FILE = path.join(__dirname, '../src/data/scraped/pokemon-serebii.json');
const DELAY_MS = 1000;

const ALL_LOCATIONS = [
  'Withered Wastelands', 'Bleak Beach', 'Rocky Ridges',
  'Sparkling Skylands', 'Palette Town', 'Cloud Island'
];

// Known archive ID mappings from the pokemon list page
// We'll discover these from the pokedex index
const POKEDEX_URL = 'https://game8.co/games/Pokemon-Pokopia/archives/578286';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; research/1.0)' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch { return null; }
}

function parseLocationsFromPage(html) {
  // Use alt text of location images - these only appear in actual content tables
  const locAltPattern = /alt='([^']*(?:Wasteland|Beach|Ridges|Skylands|Town|Island|Any Area)[^']*)'/g;
  const found = new Set();
  
  for (const m of html.matchAll(locAltPattern)) {
    const loc = m[1].trim();
    if (loc === 'Any Area') return [...ALL_LOCATIONS]; // Any Area = all locations
    if (loc.includes('Wasteland')) found.add('Withered Wastelands');
    else if (loc.includes('Beach')) found.add('Bleak Beach');
    else if (loc.includes('Ridges')) found.add('Rocky Ridges');
    else if (loc.includes('Skylands')) found.add('Sparkling Skylands');
    else if (loc.includes('Town')) found.add('Palette Town');
    else if (loc.includes('Island')) found.add('Cloud Island');
  }
  
  return [...found];
}

async function main() {
  const pokemon = JSON.parse(fs.readFileSync(POKEMON_FILE, 'utf8'));
  
  console.log('Fetching Game8 Pokedex index...');
  const indexHtml = await fetchPage(POKEDEX_URL);
  if (!indexHtml) { console.error('Failed to fetch pokedex index'); process.exit(1); }
  
  // Extract pokemon archive IDs: links with pokemon names
  // Pattern: href=.../archives/NNNNNN>PokemonName</a>
  const pokemonLinkPattern = /href=(?:https:\/\/game8\.co)?\/games\/Pokemon-Pokopia\/archives\/(\d+)>([A-Z][a-zA-Zé''\-. ]+)<\/a>/g;
  const pokemonMap = new Map(); // name.toLowerCase() -> archiveId
  
  for (const m of indexHtml.matchAll(pokemonLinkPattern)) {
    const archiveId = m[1];
    const name = m[2].trim();
    // Filter out navigation links (too short or known nav items)
    if (name.length >= 3 && !name.includes('Guide') && !name.includes('How') && !name.includes('List') && !name.includes('Walkthrough')) {
      pokemonMap.set(name.toLowerCase(), archiveId);
    }
  }
  
  console.log(`Found ${pokemonMap.size} Pokemon in index`);
  
  // Match our pokemon with Game8 entries
  let matched = 0, updated = 0, failed = 0;
  
  for (let i = 0; i < pokemon.length; i++) {
    const p = pokemon[i];
    const nameKey = p.name.toLowerCase();
    const archiveId = pokemonMap.get(nameKey);
    
    if (!archiveId) {
      console.log(`[${i+1}/${pokemon.length}] ${p.name} - no Game8 page found`);
      failed++;
      continue;
    }
    
    matched++;
    process.stdout.write(`[${i+1}/${pokemon.length}] ${p.name} (${archiveId})... `);
    await sleep(DELAY_MS);
    
    const html = await fetchPage(`https://game8.co/games/Pokemon-Pokopia/archives/${archiveId}`);
    if (!html) {
      console.log('FAILED');
      failed++;
      continue;
    }
    
    const locations = parseLocationsFromPage(html);
    if (locations.length > 0) {
      p.locations = locations;
      updated++;
      console.log(`✓ [${locations.join(', ')}]`);
    } else {
      console.log('no locations found');
      failed++;
    }
    
    if ((i + 1) % 20 === 0) {
      fs.writeFileSync(POKEMON_FILE, JSON.stringify(pokemon, null, 2));
      console.log(`  💾 Progress saved (${i+1}/${pokemon.length})`);
    }
  }
  
  fs.writeFileSync(POKEMON_FILE, JSON.stringify(pokemon, null, 2));
  console.log(`\n✅ Done! Matched: ${matched}, Updated: ${updated}, Failed: ${failed}`);
}

main().catch(console.error);
