/**
 * Scrape habitat locations from Serebii
 * For each habitat in habitats.json, fetches the habitat page and extracts
 * the union of all locations listed for Pokémon in that habitat.
 * 
 * Run: node scrapers/scrape-habitat-locations.js
 */

const fs = require('fs');
const path = require('path');

const HABITATS_FILE = path.join(__dirname, '../src/data/scraped/habitats.json');
const DELAY_MS = 800;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchHabitatPage(slug) {
  const url = `https://www.serebii.net/pokemonpokopia/habitatdex/${slug}.shtml`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PokopiaGuide/1.0)',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.warn(`  ${slug}: HTTP ${res.status}`);
      return null;
    }
    return await res.text();
  } catch (err) {
    console.warn(`  ${slug}: fetch error - ${err.message}`);
    return null;
  }
}

function extractLocations(html) {
  // Extract all location links from the page
  const locationMatches = html.matchAll(/href="\/pokemonpokopia\/locations\/([^"]+)\.shtml"[^>]*>([^<]+)</g);
  const locations = new Set();
  for (const m of locationMatches) {
    const name = m[2].trim();
    if (name) locations.add(name);
  }
  return [...locations];
}

async function main() {
  const habitats = JSON.parse(fs.readFileSync(HABITATS_FILE, 'utf8'));
  console.log(`Processing ${habitats.length} habitats...`);

  let updated = 0;
  let failed = 0;

  for (let i = 0; i < habitats.length; i++) {
    const habitat = habitats[i];
    const slug = habitat.slug;
    
    if (!slug) {
      console.warn(`  [${i+1}/${habitats.length}] Skipping (no slug): ${habitat.name}`);
      continue;
    }

    process.stdout.write(`  [${i+1}/${habitats.length}] ${habitat.name} (${slug})... `);
    
    const html = await fetchHabitatPage(slug);
    if (!html || html.includes('Page Not Found')) {
      console.log(`NOT FOUND`);
      failed++;
      await sleep(DELAY_MS);
      continue;
    }

    const locations = extractLocations(html);
    if (locations.length > 0) {
      habitat.locations = locations;
      console.log(`✓ [${locations.join(', ')}]`);
      updated++;
    } else {
      console.log(`no locations found`);
      failed++;
    }

    await sleep(DELAY_MS);

    // Save progress every 20 habitats
    if ((i + 1) % 20 === 0) {
      fs.writeFileSync(HABITATS_FILE, JSON.stringify(habitats, null, 2));
      console.log(`  💾 Progress saved (${i+1}/${habitats.length})`);
    }
  }

  // Final save
  fs.writeFileSync(HABITATS_FILE, JSON.stringify(habitats, null, 2));
  console.log(`\nDone! Updated: ${updated}, Failed/Not Found: ${failed}`);
}

main().catch(console.error);
