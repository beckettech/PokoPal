/**
 * Pokopia Serebii Scraper
 * Scrapes all Pokemon data from https://www.serebii.net/pokemonpokopia/
 * Output: src/data/scraped/pokemon-serebii.json
 * 
 * Run: node scrapers/scrape-serebii.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUT_FILE = path.join(__dirname, '../src/data/scraped/pokemon-serebii.json');
const DELAY_MS = 1200; // be polite - 1.2s between requests

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function scrapePokemonPage(page, slug) {
  try {
    await page.goto(`https://www.serebii.net/pokemonpokopia/pokedex/${slug}.shtml`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    await sleep(800);

    const data = await page.evaluate((slug) => {
      const result = { slug };

      // --- Name from title ---
      const titleEl = document.querySelector('h1') || document.querySelector('.dextable td h2');
      // Get from page title: "Bulbasaur - Poké Dex - Pokémon Pokopia"
      result.name = document.title.split(' - ')[0].trim();

      // --- Image ---
      const img = document.querySelector('img[src*="/pokemonpokopia/pokemon/"]');
      result.image = img ? img.src : null;

      // --- Pokopia Dex number from image URL ---
      if (result.image) {
        const m = result.image.match(/\/pokemon\/(\d+)\.png/);
        result.pokopiaId = m ? parseInt(m[1]) : null;
      }

      // --- National Dex from "#001" text ---
      const dexText = document.querySelector('.dextable td')?.innerText || '';
      const dexMatch = dexText.match(/#(\d+)/);
      result.nationalDex = dexMatch ? parseInt(dexMatch[1]) : null;

      // --- Specialties ---
      const specialtyLinks = Array.from(document.querySelectorAll('a[href*="/pokemonpokopia/pokedex/specialty/"]'));
      result.specialties = [...new Set(specialtyLinks.map(a => a.innerText.trim()).filter(Boolean))];

      // --- Ideal Habitat & Favorites from stats table ---
      const tables = Array.from(document.querySelectorAll('table.dextable'));
      result.idealHabitat = null;
      result.favorites = [];
      for (const t of tables) {
        const text = t.innerText;
        if (text.includes('Specialty') && text.includes('Ideal Habitat') && text.includes('Favorites')) {
          const rows = Array.from(t.querySelectorAll('tr'));
          for (const row of rows) {
            const cells = Array.from(row.querySelectorAll('td'));
            if (cells.length >= 3) {
              // Row with specialty, habitat, favorites
              const habCell = cells[1]?.innerText?.trim();
              const favCell = cells[2]?.innerText?.trim();
              if (habCell && habCell !== 'Ideal Habitat') result.idealHabitat = habCell;
              if (favCell && favCell !== 'Favorites') {
                result.favorites = favCell.split('\n').map(s => s.trim()).filter(Boolean);
              }
            }
          }
          break;
        }
      }

      // --- Habitats & Locations ---
      result.habitats = [];
      const habitatTable = Array.from(document.querySelectorAll('table.dextable')).find(t =>
        t.innerText.includes('Habitats & Locations')
      );

      if (habitatTable) {
        // Habitat names from links
        const habitatLinks = Array.from(habitatTable.querySelectorAll('a[href*="/pokemonpokopia/habitatdex/"]'));
        result.habitats = [...new Set(habitatLinks.map(a => a.innerText.trim()).filter(Boolean))];

        // Per-habitat time/weather (take first occurrence for now — each habitat has same conditions)
        const innerTimeTables = Array.from(habitatTable.querySelectorAll('table'));
        const timeWeatherPerHabitat = [];
        for (const t of innerTimeTables) {
          if (t.innerText.includes('Time') && t.innerText.includes('Weather')) {
            // Structure: <tr><td>Time</td><td>Weather</td></tr><tr><td>Morning\nDay...</td><td>Sun\nCloud...</td></tr>
            const rows = Array.from(t.querySelectorAll('tr'));
            let timeValues = [], weatherValues = [];
            for (const row of rows) {
              const cells = Array.from(row.querySelectorAll('td'));
              if (cells.length >= 2) {
                const c0 = cells[0].innerText.trim();
                const c1 = cells[1].innerText.trim();
                // Skip header row
                if (c0 === 'Time' && c1 === 'Weather') continue;
                // Data row
                if (c0 && c0 !== 'Time') {
                  timeValues = c0.split('\n').map(s => s.trim()).filter(Boolean);
                }
                if (c1 && c1 !== 'Weather') {
                  weatherValues = c1.split('\n').map(s => s.trim()).filter(Boolean);
                }
              }
            }
            timeWeatherPerHabitat.push({ times: timeValues, weathers: weatherValues });
          }
        }
        result.timeWeatherPerHabitat = timeWeatherPerHabitat;

        // Merged time/weather (union across all habitats for this Pokemon)
        const allTimes = new Set();
        const allWeathers = new Set();
        for (const tw of timeWeatherPerHabitat) {
          tw.times.forEach(t => allTimes.add(t));
          tw.weathers.forEach(w => allWeathers.add(w));
        }
        result.time = [...allTimes];   // ["Morning","Day","Evening","Night"] or subset
        result.weather = [...allWeathers]; // ["Sun","Cloud","Rain"] or subset

        // Locations (union across habitats)
        const locationLinks = Array.from(habitatTable.querySelectorAll('a[href*="/pokemonpokopia/locations/"]'));
        result.locations = [...new Set(locationLinks.map(a => a.innerText.trim()).filter(Boolean))];

        // Rarity (first occurrence)
        const rarityMatch = habitatTable.innerText.match(/Rarity:\s*(Common|Rare|Legendary)/);
        result.rarity = rarityMatch ? rarityMatch[1] : 'Common';
      }

      // --- Flavor text ---
      const flavorTable = Array.from(document.querySelectorAll('table.dextable')).find(t =>
        t.innerText.includes('Flavor Text')
      );
      if (flavorTable) {
        const rows = flavorTable.querySelectorAll('tr');
        let flavorText = '';
        for (const row of rows) {
          const text = row.innerText.trim();
          if (text && text !== 'Flavor Text') {
            flavorText += text + ' ';
          }
        }
        result.flavorText = flavorText.trim();
      }

      return result;
    }, slug);

    return data;
  } catch (err) {
    console.error(`  ERROR scraping ${slug}: ${err.message}`);
    return { slug, error: err.message };
  }
}

async function getAllPokemonSlugs(page) {
  await page.goto('https://www.serebii.net/pokemonpokopia/availablepokemon.shtml', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  await sleep(2000);

  const links = await page.evaluate(() => {
    const seen = new Set();
    const anchors = Array.from(document.querySelectorAll('a[href*="/pokemonpokopia/pokedex/"]'));
    const results = [];
    for (const a of anchors) {
      const href = a.href;
      const slug = href.split('/pokedex/')[1]?.replace('.shtml', '');
      if (slug && !slug.includes('/') && !seen.has(slug)) {
        seen.add(slug);
        results.push({ slug, name: a.innerText.trim() || slug });
      }
    }
    return results;
  });

  return links;
}

async function main() {
  console.log('🚀 Starting Serebii Pokopia scraper...');
  
  // Load existing progress if any
  let existing = {};
  if (fs.existsSync(OUT_FILE)) {
    try {
      const arr = JSON.parse(fs.readFileSync(OUT_FILE, 'utf8'));
      for (const p of arr) existing[p.slug] = p;
      console.log(`📂 Loaded ${arr.length} existing entries`);
    } catch(e) {}
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Step 1: Get all Pokemon slugs
  console.log('📋 Fetching Pokemon list from availablepokemon.shtml...');
  const pokemonList = await getAllPokemonSlugs(page);
  console.log(`✅ Found ${pokemonList.length} unique Pokemon`);

  // Step 2: Scrape each Pokemon page
  const results = { ...existing };
  let count = 0;
  let skipped = 0;

  for (const { slug, name } of pokemonList) {
    if (existing[slug]) {
      skipped++;
      continue;
    }

    count++;
    process.stdout.write(`[${count}/${pokemonList.length - skipped}] Scraping ${name} (${slug})...`);
    
    const data = await scrapePokemonPage(page, slug);
    results[slug] = data;
    
    if (data.error) {
      console.log(` ❌ ${data.error}`);
    } else {
      console.log(` ✅ time=[${(data.time||[]).join(',')}] weather=[${(data.weather||[]).join(',')}] habitats=${data.habitats?.length || 0}`);
    }

    // Save progress every 10 Pokemon
    if (count % 10 === 0) {
      fs.writeFileSync(OUT_FILE, JSON.stringify(Object.values(results), null, 2));
      console.log(`💾 Saved progress (${Object.keys(results).length} total)`);
    }

    await sleep(DELAY_MS);
  }

  // Final save
  const finalArr = Object.values(results);
  fs.writeFileSync(OUT_FILE, JSON.stringify(finalArr, null, 2));
  
  console.log(`\n✅ Done! Scraped ${count} Pokemon (${skipped} skipped/cached)`);
  console.log(`📄 Output: ${OUT_FILE}`);
  console.log(`📊 Total entries: ${finalArr.length}`);

  await browser.close();
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
