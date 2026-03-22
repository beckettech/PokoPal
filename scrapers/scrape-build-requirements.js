/**
 * Scrapes build requirements for all habitats from Serebii
 * Updates habitats.json with buildItems: [{name, slug, quantity, image}]
 */

const fs = require('fs');
const HABITATS_FILE = '/home/beck/pokopia-guide/src/data/scraped/habitats.json';
const DELAY = 500;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(12000)
    });
    if (!res.ok) return null;
    return await res.text();
  } catch { return null; }
}

function parseRequirements(html) {
  // Find Requirements section, stop at Available Pokemon
  const reqStart = html.indexOf('<h2>Requirements</h2>');
  const reqEnd = html.indexOf('<h2>Available', reqStart);
  if (reqStart === -1) return [];
  
  const section = html.slice(reqStart, reqEnd > -1 ? reqEnd : reqStart + 2000);
  const items = [];
  
  // Row pattern: img with item slug, then name link with <u>Name</u>, then quantity td
  // <img src="/pokemonpokopia/items/SLUG.png" ...>
  // <a href="..."><u>Name</u></a>
  // <td class="fooinfo">QUANTITY</td>
  const rowPattern = /<img src="\/pokemonpokopia\/items\/([^"]+)\.png"[^>]*>.*?<u>([^<]+)<\/u>.*?<td class="fooinfo">(\d+)<\/td>/gs;
  
  for (const m of section.matchAll(rowPattern)) {
    const slug = m[1];
    const name = m[2].trim();
    const quantity = parseInt(m[3]);
    const image = `https://www.serebii.net/pokemonpokopia/items/${slug}.png`;
    items.push({ name, slug, quantity, image });
  }
  
  return items;
}

async function main() {
  const habitats = JSON.parse(fs.readFileSync(HABITATS_FILE, 'utf8'));
  console.log(`Processing ${habitats.length} habitats...`);
  
  let updated = 0;
  let noItems = 0;
  let failed = 0;
  
  for (let i = 0; i < habitats.length; i++) {
    const hab = habitats[i];
    const url = `https://www.serebii.net/pokemonpokopia/habitatdex/${hab.slug}.shtml`;
    
    process.stdout.write(`[${i+1}/${habitats.length}] #${String(hab.id).padStart(3,'0')} ${hab.name}... `);
    await sleep(DELAY);
    
    const html = await fetchPage(url);
    if (!html) {
      console.log('FAILED');
      failed++;
      hab.buildItems = [];
      continue;
    }
    
    const items = parseRequirements(html);
    hab.buildItems = items;
    updated++;
    
    if (items.length > 0) {
      console.log(`✓ ${items.map(it => `${it.name} x${it.quantity}`).join(', ')}`);
    } else {
      console.log(`⚠ no items`);
      noItems++;
    }
    
    if ((i + 1) % 30 === 0) {
      fs.writeFileSync(HABITATS_FILE, JSON.stringify(habitats, null, 2));
      console.log('  💾 saved');
    }
  }
  
  fs.writeFileSync(HABITATS_FILE, JSON.stringify(habitats, null, 2));
  console.log(`\n✅ Done! Updated: ${updated}, No items: ${noItems}, Failed: ${failed}`);
}

main().catch(console.error);
