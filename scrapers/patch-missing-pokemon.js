#!/usr/bin/env node
// Patch missing/broken pokemon entries in pokemon-serebii.json
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUT_FILE = path.join(__dirname, '../src/data/scraped/pokemon-serebii.json');

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function scrapePokemon(page, slug) {
  await page.goto(`https://www.serebii.net/pokemonpokopia/pokedex/${slug}.shtml`, {
    waitUntil: 'networkidle2', timeout: 30000
  });
  await sleep(800);

  return page.evaluate((slug) => {
    const result = { slug };

    result.name = document.title.split(' - ')[0].trim();
    const img = document.querySelector('img[src*="/pokemonpokopia/pokemon/"]');
    result.image = img ? img.src : null;
    if (result.image) {
      const m = result.image.match(/\/pokemon\/(\d+)[^.]*\.png/);
      result.pokopiaId = m ? parseInt(m[1]) : null;
    }
    result.nationalDex = null;

    const specialtyLinks = Array.from(document.querySelectorAll('a[href*="/pokemonpokopia/pokedex/specialty/"]'));
    result.specialties = [...new Set(specialtyLinks.map(a => a.innerText.trim()).filter(Boolean))];
    result.idealHabitat = null;
    result.favorites = [];

    result.habitats = [];
    result.timeWeatherPerHabitat = [];
    const habitatTable = Array.from(document.querySelectorAll('table.dextable')).find(t =>
      t.innerText.includes('Habitats & Locations')
    );

    if (habitatTable) {
      const habitatLinks = Array.from(habitatTable.querySelectorAll('a[href*="/pokemonpokopia/habitatdex/"]'));
      result.habitats = [...new Set(habitatLinks.map(a => a.innerText.trim()).filter(Boolean))];

      const innerTimeTables = Array.from(habitatTable.querySelectorAll('table'));
      for (const t of innerTimeTables) {
        if (t.innerText.includes('Time') && t.innerText.includes('Weather')) {
          const rows = Array.from(t.querySelectorAll('tr'));
          let timeValues = [], weatherValues = [];
          for (const row of rows) {
            const cells = Array.from(row.querySelectorAll('td'));
            if (cells.length >= 2) {
              const c0 = cells[0].innerText.trim();
              const c1 = cells[1].innerText.trim();
              if (c0 !== 'Time' && c0.length > 0) {
                timeValues = c0.split('\n').map(s=>s.trim()).filter(Boolean);
                weatherValues = c1.split('\n').map(s=>s.trim()).filter(Boolean);
              }
            }
          }
          if (timeValues.length > 0) {
            result.timeWeatherPerHabitat.push({ times: timeValues, weathers: weatherValues });
          }
        }
      }
    }

    // Flatten time/weather
    const allTimes = new Set();
    const allWeathers = new Set();
    result.timeWeatherPerHabitat.forEach(h => {
      h.times.forEach(t => allTimes.add(t));
      h.weathers.forEach(w => allWeathers.add(w));
    });
    result.time = [...allTimes];
    result.weather = [...allWeathers];

    // Locations
    const locationLinks = Array.from(document.querySelectorAll('a[href*="/pokemonpokopia/locationdex/"]'));
    result.locations = [...new Set(locationLinks.map(a => a.innerText.trim()).filter(Boolean))];

    // Rarity
    const bodyText = document.body.innerText;
    result.rarity = bodyText.includes('Legendary') ? 'Legendary' :
                    bodyText.includes('Rare') ? 'Rare' : 'Common';

    return result;
  }, slug);
}

(async () => {
  const data = JSON.parse(fs.readFileSync(OUT_FILE));
  
  const toScrape = data
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => p.error || (!p.pokopiaId && p.name));
  
  console.log(`Patching ${toScrape.length} entries: ${toScrape.map(x=>x.p.slug).join(', ')}`);

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  for (const { p, i } of toScrape) {
    console.log(`Scraping ${p.slug}...`);
    try {
      const scraped = await scrapePokemon(page, p.slug);
      console.log(`  → #${scraped.pokopiaId} ${scraped.name}, habitats: ${scraped.habitats.join(', ')}`);
      data[i] = scraped;
    } catch (e) {
      console.error(`  ERROR: ${e.message}`);
    }
    await sleep(1200);
  }

  await browser.close();
  fs.writeFileSync(OUT_FILE, JSON.stringify(data, null, 2));
  console.log('Done! Saved patched data.');
})().catch(e => { console.error(e); process.exit(1); });
