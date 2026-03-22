/**
 * Scrape accurate Pokemon location data from Game8 habitat pages
 * Splits HTML by </tr> to get per-Pokemon location data correctly
 * 
 * Run: node scrapers/scrape-game8-final.js
 */

const fs = require('fs');
const path = require('path');

const POKEMON_FILE = path.join(__dirname, '../src/data/scraped/pokemon-serebii.json');
const HABITATS_FILE = path.join(__dirname, '../src/data/scraped/habitats.json');
const DELAY_MS = 900;

const ALL_LOCATIONS = [
  'Withered Wastelands', 'Bleak Beach', 'Rocky Ridges',
  'Sparkling Skylands', 'Palette Town', 'Cloud Island'
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; research/1.0)' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch (e) { return null; }
}

function normalizeLocation(raw) {
  if (/Withered|Wasteland/i.test(raw)) return 'Withered Wastelands';
  if (/Bleak.*Beach/i.test(raw)) return 'Bleak Beach';
  if (/Rocky.*Ridge/i.test(raw)) return 'Rocky Ridges';
  if (/Sparkling|Skyland/i.test(raw)) return 'Sparkling Skylands';
  if (/Palette.*Town/i.test(raw)) return 'Palette Town';
  if (/Cloud.*Island/i.test(raw)) return 'Cloud Island';
  if (/Any.*Area/i.test(raw)) return 'ANY';
  return null;
}

function parseHabitatPage(html) {
  // Returns array of { pokemonName, locations[] }
  // Strategy: split table by </tr> to isolate each pokemon row
  
  const tableStart = html.indexOf('>Time</th>');
  const tableEnd = html.indexOf('Habitat No.');
  if (tableStart === -1) return [];
  
  const section = html.substring(tableStart, tableEnd > -1 ? tableEnd : tableStart + 20000);
  
  // Split into rows
  const rows = section.split('</tr>');
  const entries = [];
  
  for (const row of rows) {
    // Check if this row has a pokemon image (identified by game8 pokemon image URL pattern)
    const pokemonMatch = row.match(/alt='([A-Z][a-zA-Zé''\-. ]+)'\s+data-src='https:\/\/img\.game8\.co\/[^']+\/show'/);
    if (!pokemonMatch) continue;
    
    const pokemonName = pokemonMatch[1].trim();
    
    // Skip if it's actually a location/item name
    if (/Wasteland|Beach|Ridges|Skylands|Town|Island|Area|Grass|Flower|Sand/i.test(pokemonName) && pokemonName.length > 15) continue;
    if (pokemonName.length > 30) continue;
    
    // Check for "Any Area" as link text (not alt attribute)
    const anyAreaText = />Any Area<\/a>/i.test(row);
    
    // Find location alt texts in THIS row only
    const locAltMatches = [...row.matchAll(/alt='([^']*(?:Wasteland|Beach|Ridges?|Skylands|Town|Island)[^']*)'/g)];
    
    const locations = new Set();
    let anyArea = anyAreaText;
    
    if (!anyArea) {
      for (const lm of locAltMatches) {
        const loc = normalizeLocation(lm[1]);
        if (loc === 'ANY') { anyArea = true; break; }
        if (loc) locations.add(loc);
      }
    }
    
    entries.push({
      pokemonName,
      locations: anyArea ? [...ALL_LOCATIONS] : [...locations]
    });
  }
  
  return entries;
}

async function main() {
  const pokemon = JSON.parse(fs.readFileSync(POKEMON_FILE, 'utf8'));
  const habitats = JSON.parse(fs.readFileSync(HABITATS_FILE, 'utf8'));

  console.log('Fetching Game8 habitat index...');
  const indexHtml = await fetchPage('https://game8.co/games/Pokemon-Pokopia/archives/582463');
  if (!indexHtml) { console.error('Failed to fetch index'); process.exit(1); }

  // Parse habitat index: href=.../archives/NNNNNN>Name</a> ... (#<b>NNN</b>)
  const entryPattern = /href=https:\/\/game8\.co\/games\/Pokemon-Pokopia\/archives\/(\d+)>([^<]+)<\/a>\s*(?:<br>)?\s*\(#<b[^>]*>(\d+)<\/b>\)/g;
  const habitatIndex = [];
  for (const m of indexHtml.matchAll(entryPattern)) {
    habitatIndex.push({
      archiveId: m[1],
      name: m[2].trim(),
      habitatId: parseInt(m[3]),
      url: `https://game8.co/games/Pokemon-Pokopia/archives/${m[1]}`
    });
  }
  console.log(`Found ${habitatIndex.length} habitats`);

  // Build pokemon name -> locations map
  const pokemonLocationMap = new Map(); // name.toLowerCase() -> Set<location>

  for (let i = 0; i < habitatIndex.length; i++) {
    const hab = habitatIndex[i];
    process.stdout.write(`[${i+1}/${habitatIndex.length}] #${String(hab.habitatId).padStart(3,'0')} ${hab.name}... `);

    await sleep(DELAY_MS);
    const html = await fetchPage(hab.url);
    if (!html) { console.log('FAILED'); continue; }

    const entries = parseHabitatPage(html);

    for (const entry of entries) {
      const key = entry.pokemonName.toLowerCase();
      if (!pokemonLocationMap.has(key)) pokemonLocationMap.set(key, new Set());
      entry.locations.forEach(l => pokemonLocationMap.get(key).add(l));
    }

    // Update habitat locations = union of all pokemon locations in this habitat
    const habitatEntry = habitats.find(h => h.id === hab.habitatId);
    if (habitatEntry) {
      const allLocs = new Set();
      entries.forEach(e => e.locations.forEach(l => allLocs.add(l)));
      habitatEntry.locations = [...allLocs];
      habitatEntry.game8Url = hab.url;
    }

    console.log(`${entries.length} pokemon, locs: ${[...new Set(entries.flatMap(e => e.locations))].join(', ') || 'none'}`);

    if ((i + 1) % 20 === 0) {
      fs.writeFileSync(POKEMON_FILE, JSON.stringify(pokemon, null, 2));
      fs.writeFileSync(HABITATS_FILE, JSON.stringify(habitats, null, 2));
      console.log(`  💾 Saved (${pokemonLocationMap.size} unique pokemon)`);
    }
  }

  // Update pokemon-serebii.json
  let updated = 0;
  for (const p of pokemon) {
    if (!p.name) continue;
    const key = p.name.toLowerCase();
    const locs = pokemonLocationMap.get(key);
    if (locs && locs.size > 0) {
      p.locations = [...locs];
      updated++;
    }
  }

  fs.writeFileSync(POKEMON_FILE, JSON.stringify(pokemon, null, 2));
  fs.writeFileSync(HABITATS_FILE, JSON.stringify(habitats, null, 2));

  console.log(`\n✅ Done! Updated ${updated}/${pokemon.length} pokemon`);
  console.log('Sample checks:');
  ['bulbasaur', 'geodude', 'pikachu', 'charizard'].forEach(name => {
    const locs = pokemonLocationMap.get(name);
    console.log(`  ${name}: ${locs ? [...locs].join(', ') : 'NOT FOUND'}`);
  });
}

main().catch(console.error);
