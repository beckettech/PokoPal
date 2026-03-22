/**
 * Simple Game8 habitat location scraper
 * Run: node scrapers/scrape-game8-simple.js
 */

const fs = require('fs');
const path = require('path');

const HABITATS_FILE = path.join(__dirname, '../src/data/scraped/habitats.json');
const DELAY_MS = 1000;

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
  } catch { return null; }
}

function parseLocations(html) {
  if (html.includes('Any Area')) return [...ALL_LOCATIONS];
  const found = new Set();
  if (/Withered Wasteland/.test(html)) found.add('Withered Wastelands');
  if (/Bleak Beach/.test(html)) found.add('Bleak Beach');
  if (/Rocky Ridges/.test(html)) found.add('Rocky Ridges');
  if (/Sparkling Skylands/.test(html)) found.add('Sparkling Skylands');
  if (/Palette Town/.test(html)) found.add('Palette Town');
  if (/Cloud Island/.test(html)) found.add('Cloud Island');
  return [...found];
}

async function main() {
  const habitats = JSON.parse(fs.readFileSync(HABITATS_FILE, 'utf8'));

  console.log('Fetching Game8 habitat index...');
  const indexHtml = await fetchPage('https://game8.co/games/Pokemon-Pokopia/archives/582463');
  if (!indexHtml) { console.error('Failed to fetch index'); process.exit(1); }

  // Parse: href=https://game8.co/.../archives/NNNNNN>Name</a>\n(#<b>NNN</b>)
  const entryPattern = /href=https:\/\/game8\.co\/games\/Pokemon-Pokopia\/archives\/(\d+)>([^<]+)<\/a>\s*<br>\s*\(#<b[^>]*>(\d+)<\/b>\)/g;
  const habitatEntries = new Map(); // habitatId (int) -> { name, archiveId, url }

  for (const m of indexHtml.matchAll(entryPattern)) {
    const archiveId = m[1];
    const name = m[2].trim();
    const habitatId = parseInt(m[3]);
    habitatEntries.set(habitatId, {
      name,
      archiveId,
      url: `https://game8.co/games/Pokemon-Pokopia/archives/${archiveId}`
    });
  }

  console.log(`Found ${habitatEntries.size} habitats in index`);

  let updated = 0;
  const sortedEntries = [...habitatEntries.entries()].sort((a, b) => a[0] - b[0]);

  for (const [habitatId, info] of sortedEntries) {
    const habitat = habitats.find(h => h.id === habitatId);
    if (!habitat) {
      console.log(`[#${habitatId}] ${info.name} - not in habitats.json`);
      continue;
    }

    process.stdout.write(`[#${String(habitatId).padStart(3,'0')}] ${habitat.name}... `);
    await sleep(DELAY_MS);

    const html = await fetchPage(info.url);
    if (!html) { console.log('FAILED'); continue; }

    const locations = parseLocations(html);
    habitat.locations = locations;
    habitat.game8Url = info.url;
    updated++;

    console.log(locations.length > 0 ? `✓ [${locations.join(', ')}]` : 'no locations found');

    if (updated % 20 === 0) {
      fs.writeFileSync(HABITATS_FILE, JSON.stringify(habitats, null, 2));
      console.log('  💾 saved');
    }
  }

  fs.writeFileSync(HABITATS_FILE, JSON.stringify(habitats, null, 2));
  console.log(`\n✅ Done! Updated ${updated}/${habitats.length} habitats`);
}

main().catch(console.error);
