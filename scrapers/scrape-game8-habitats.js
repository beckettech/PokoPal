/**
 * Scrape habitat data from Game8
 * Fetches each habitat page and extracts per-Pokemon location data
 * Updates: src/data/scraped/habitats.json
 * 
 * Run: node scrapers/scrape-game8-habitats.js
 */

const fs = require('fs');
const path = require('path');

const HABITATS_FILE = path.join(__dirname, '../src/data/scraped/habitats.json');
const POKEMON_FILE = path.join(__dirname, '../src/data/scraped/pokemon-serebii.json');
const DELAY_MS = 1000;

// Game8 archive IDs for each habitat (from the habitat dex page)
// Format: { serebiiName: game8ArchiveId }
// We'll discover these by scraping the habitat dex index first
const HABITAT_DEX_URL = 'https://game8.co/games/Pokemon-Pokopia/archives/582463';

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    console.warn(`  fetch error: ${err.message}`);
    return null;
  }
}

function extractHabitatLinks(html) {
  // Find all habitat archive links with their names
  const matches = [...html.matchAll(/href="(https:\/\/game8\.co\/games\/Pokemon-Pokopia\/archives\/(\d+))"[^>]*>\s*([^<]+)/g)];
  const habitats = [];
  for (const m of matches) {
    const name = m[3].trim();
    const archiveId = m[2];
    const url = m[1];
    // Filter to habitat pages (not pokemon pages, not other pages)
    if (name && archiveId && !name.includes('▶') && !name.includes('◀') && name.length < 60) {
      habitats.push({ name, archiveId, url });
    }
  }
  return habitats;
}

function extractHabitatData(html, habitatName) {
  const result = {
    name: habitatName,
    pokemon: [],
    locations: new Set(),
  };

  // Extract Pokemon entries with their locations
  // Pattern: Pokemon name followed by location links
  const pokemonSection = html.match(/Pokemon\s+Time\s+Weather\s+Details([\s\S]*?)(?:Habitat No\.|$)/i);
  if (!pokemonSection) return result;

  const sectionHtml = pokemonSection[1];
  
  // Find all location references - "Withered Wasteland", "Bleak Beach", etc.
  const locationPattern = /\/(games\/Pokemon-Pokopia\/archives\/\d+)"[^>]*>([^<]+Area|[^<]+Wasteland|[^<]+Beach|[^<]+Ridges|[^<]+Skylands|[^<]+Town|[^<]+Island)[^<]*/g;
  const locationMatches = [...sectionHtml.matchAll(locationPattern)];
  
  // Also match "Any Area"
  const anyAreaMatches = [...sectionHtml.matchAll(/Any Area/g)];
  
  for (const m of locationMatches) {
    const loc = m[2].trim();
    if (loc) result.locations.add(loc);
  }
  
  if (anyAreaMatches.length > 0) {
    result.locations.add('Any Area');
  }

  return result;
}

function extractPokemonLocations(html) {
  // Extract each Pokemon's locations from a habitat page
  // Returns array of { pokemonName, locations[] }
  const entries = [];
  
  // Split by Pokemon entries - each starts with a link to a pokemon archive
  const rows = html.split(/(?=https:\/\/game8\.co\/games\/Pokemon-Pokopia\/archives\/\d+\n)/);
  
  // Better approach: find the table section
  const tableMatch = html.match(/Pokemon\s+Time\s+Weather\s+Details([\s\S]*?)(?:Habitat No\.|List of All Pokemon)/i);
  if (!tableMatch) return entries;
  
  const tableHtml = tableMatch[1];
  
  // Each row is a Pokemon with its location(s)
  // Pattern: pokemon name then location links
  const pokemonPattern = /\[([^\]]+)\]\(https:\/\/game8\.co\/games\/Pokemon-Pokopia\/archives\/\d+\)([\s\S]*?)(?=\[(?:[A-Z][^[\]]*)\]\(https:\/\/game8|$)/g;
  
  const allMatches = [...tableHtml.matchAll(pokemonPattern)];
  for (const m of allMatches) {
    const pokemonName = m[1].trim();
    const rowContent = m[2];
    
    const locs = [];
    // Find location links in this row
    const locMatches = [...rowContent.matchAll(/\[([^\]]+(?:Wasteland|Beach|Ridges|Skylands|Town|Island|Area)[^\]]*)\]/g)];
    for (const lm of locMatches) {
      locs.push(lm[1].trim());
    }
    if (locs.length > 0) {
      entries.push({ pokemonName, locations: locs });
    }
  }
  
  return entries;
}

async function scrapeHabitatPage(url, habitatName) {
  const html = await fetchPage(url);
  if (!html) return null;

  // Extract all location mentions in the Pokemon section
  const locations = new Set();
  
  // Look for the content between "Pokemon Time Weather Details" and "Habitat No."
  // Using a simpler text extraction since readability strips structure
  
  // Location names to look for
  const locationNames = [
    'Withered Wasteland', 'Bleak Beach', 'Rocky Ridges', 
    'Sparkling Skylands', 'Palette Town', 'Cloud Island', 'Any Area'
  ];
  
  // Find the section with Pokemon spawns
  // Game8 pages have the Pokemon table with location links
  const archiveMatches = [...html.matchAll(/archives\/\d+[^"]*"[^>]*>([^<]+(?:Wasteland|Beach|Ridges|Skylands|Town|Island))[^<]*/g)];
  for (const m of archiveMatches) {
    const loc = m[1].trim();
    // Normalize location names
    if (loc.includes('Wasteland') || loc.includes('Withered')) locations.add('Withered Wastelands');
    else if (loc.includes('Bleak') || loc.includes('Beach')) locations.add('Bleak Beach');
    else if (loc.includes('Rocky') || loc.includes('Ridges')) locations.add('Rocky Ridges');
    else if (loc.includes('Sparkling') || loc.includes('Skylands')) locations.add('Sparkling Skylands');
    else if (loc.includes('Palette') || loc.includes('Town')) locations.add('Palette Town');
    else if (loc.includes('Cloud') || loc.includes('Island')) locations.add('Cloud Island');
  }
  
  // Also check for "Any Area" 
  if (html.includes('Any Area')) {
    locationNames.forEach(l => locations.add(l === 'Any Area' ? null : l));
    // If any area, all locations apply
    return {
      locations: ['Withered Wastelands', 'Bleak Beach', 'Rocky Ridges', 'Sparkling Skylands', 'Palette Town', 'Cloud Island'],
      anyArea: true
    };
  }
  
  return {
    locations: [...locations],
    anyArea: false
  };
}

async function main() {
  const habitats = JSON.parse(fs.readFileSync(HABITATS_FILE, 'utf8'));
  const pokemon = JSON.parse(fs.readFileSync(POKEMON_FILE, 'utf8'));
  
  console.log(`Fetching habitat index from Game8...`);
  const indexHtml = await fetchPage(HABITAT_DEX_URL);
  if (!indexHtml) {
    console.error('Failed to fetch habitat index');
    process.exit(1);
  }
  
  // Extract all habitat archive links
  const habitatLinks = extractHabitatLinks(indexHtml);
  console.log(`Found ${habitatLinks.length} habitat links`);
  
  // Filter to ones that look like actual habitats (not navigation)
  const uniqueLinks = [];
  const seen = new Set();
  for (const h of habitatLinks) {
    if (!seen.has(h.archiveId) && h.archiveId > '584000') continue; // Skip non-habitat archive IDs
    if (!seen.has(h.archiveId)) {
      seen.add(h.archiveId);
      uniqueLinks.push(h);
    }
  }
  
  // Actually let's just use the direct approach - fetch each habitat page we know about
  // Map habitat names from our JSON to Game8 pages
  const game8HabitatMap = new Map();
  
  // Extract archive IDs for habitats from index HTML
  const linkPattern = /\[([^\]]+)\]\(https:\/\/game8\.co\/games\/Pokemon-Pokopia\/archives\/(\d+)\)\s*\n\n\(#(\d+)\)/g;
  const habitatMatches = [...indexHtml.matchAll(linkPattern)];
  
  console.log(`Found ${habitatMatches.length} habitat entries with archive IDs`);
  
  for (const m of habitatMatches) {
    const name = m[1].trim().toLowerCase();
    const archiveId = m[2];
    const habitatNum = parseInt(m[3]);
    game8HabitatMap.set(habitatNum, { name: m[1].trim(), archiveId, url: `https://game8.co/games/Pokemon-Pokopia/archives/${archiveId}` });
  }
  
  console.log(`Mapped ${game8HabitatMap.size} habitats by number`);
  
  // Now fetch each habitat page
  let updated = 0;
  const entries = [...game8HabitatMap.entries()].sort((a, b) => a[0] - b[0]);
  
  for (const [habitatNum, habitatInfo] of entries) {
    console.log(`\n[${habitatNum}] ${habitatInfo.name}`);
    
    await sleep(DELAY_MS);
    const html = await fetchPage(habitatInfo.url);
    if (!html) {
      console.log(`  FAILED to fetch`);
      continue;
    }
    
    // Extract location data
    const locationSet = new Set();
    let hasAnyArea = html.includes('Any Area');
    
    // Match location links in the spawns table
    const locPattern = /\/(games\/Pokemon-Pokopia\/archives\/\d+)"[^>]*>((?:[^<]*(?:Wasteland|Beach|Ridges|Skylands|Town|Island))[^<]*)</g;
    const locMatches = [...html.matchAll(locPattern)];
    for (const lm of locMatches) {
      const loc = lm[2].trim();
      if (loc.includes('Wasteland')) locationSet.add('Withered Wastelands');
      else if (loc.includes('Beach')) locationSet.add('Bleak Beach');
      else if (loc.includes('Ridges')) locationSet.add('Rocky Ridges');
      else if (loc.includes('Skylands')) locationSet.add('Sparkling Skylands');
      else if (loc.includes('Town')) locationSet.add('Palette Town');
      else if (loc.includes('Island')) locationSet.add('Cloud Island');
    }
    
    const allLocations = ['Withered Wastelands', 'Bleak Beach', 'Rocky Ridges', 'Sparkling Skylands', 'Palette Town', 'Cloud Island'];
    const finalLocations = hasAnyArea ? allLocations : [...locationSet];
    
    console.log(`  Locations: ${finalLocations.join(', ') || 'none found'}`);
    
    // Find matching habitat in our data by habitat number
    const matchingHabitat = habitats.find(h => h.id === habitatNum);
    if (matchingHabitat) {
      matchingHabitat.locations = finalLocations;
      matchingHabitat.game8Url = habitatInfo.url;
      updated++;
    } else {
      console.log(`  No matching habitat found for id ${habitatNum}`);
    }
    
    // Save progress every 10
    if (updated % 10 === 0) {
      fs.writeFileSync(HABITATS_FILE, JSON.stringify(habitats, null, 2));
      console.log(`  💾 Progress saved`);
    }
  }
  
  // Final save
  fs.writeFileSync(HABITATS_FILE, JSON.stringify(habitats, null, 2));
  console.log(`\n✅ Done! Updated ${updated} habitats`);
}

main().catch(console.error);
