#!/usr/bin/env node
/**
 * Scrape the CORRECT Pokemon Pokopia dex from Serebii's Available Pokemon page
 * This gives us the proper 1-300 ordering where Mew = #300
 *
 * https://www.serebii.net/pokemonpokopia/availablepokemon.shtml
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUT_FILE = path.join(__dirname, '../src/data/scraped/pokemon-serebii.json');

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  console.log('Scraping Serebii Available Pokemon page...');

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  await page.goto('https://www.serebii.net/pokemonpokopia/availablepokemon.shtml', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });
  await sleep(2000);

  // Extract the pokemon list from the page
  const list = await page.evaluate(() => {
    const results = [];

    // Serebii uses tables with rows: number | name (with link to pokedex)
    const tables = [...document.querySelectorAll('table')];

    for (const table of tables) {
      const rows = [...table.querySelectorAll('tr')];
      for (const row of rows) {
        const cells = [...row.querySelectorAll('td')];
        if (cells.length >= 2) {
          const numText = cells[0]?.innerText?.trim() || '';
          const nameCell = cells[1];
          const name = nameCell?.innerText?.trim() || '';

          // Check for numbered entry
          const numMatch = numText.match(/^(\d+)/);
          if (numMatch && name) {
            const num = parseInt(numMatch[1]);
            const isLegendary = row.innerText.includes('⭐') || row.innerText.includes('☆');

            // Get the slug from the link
            const link = nameCell.querySelector('a[href*="/pokedex/"]');
            const href = link?.href || '';
            const slugMatch = href.match(/\/pokedex\/([^.]+)\.shtml/);
            const slug = slugMatch ? slugMatch[1] : name.toLowerCase().replace(/[^a-z0-9]/g, '');

            results.push({ num, name, slug, isLegendary });
          }
        }
      }
    }

    // Dedupe by num, keep first occurrence
    const seen = new Set();
    return results.filter(p => {
      if (seen.has(p.num)) return false;
      seen.add(p.num);
      return true;
    });
  });

  console.log(`Found ${list.length} pokemon on the page`);

  // Show first and last few
  console.log('First 5:', list.slice(0, 5).map(p => `#${p.num} ${p.name}`).join(', '));
  console.log('Last 5:', list.slice(-5).map(p => `#${p.num} ${p.name}`).join(', '));

  // Find Mew
  const mew = list.find(p => p.name.toLowerCase() === 'mew');
  if (mew) {
    console.log(`Mew is at #${mew.num}`);
  } else {
    console.log('WARNING: Mew not found!');
  }

  // Count legendaries
  const legendaries = list.filter(p => p.isLegendary);
  console.log(`Legendaries (${legendaries.length}): ${legendaries.map(p => `#${p.num} ${p.name}`).join(', ')}`);

  await browser.close();

  // Now scrape details for each pokemon
  console.log('\nScraping details for each pokemon...');

  const browser2 = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page2 = await browser2.newPage();

  const detailed = [];
  let idx = 0;

  for (const entry of list) {
    idx++;
    if (idx % 20 === 0) console.log(`  ${idx}/${list.length}...`);

    try {
      await page2.goto(`https://www.serebii.net/pokemonpokopia/pokedex/${entry.slug}.shtml`, {
        waitUntil: 'networkidle2',
        timeout: 20000
      });
      await sleep(400);

      const data = await page2.evaluate((entry) => {
        const result = {
          slug: entry.slug,
          name: entry.name,
          pokopiaId: entry.num,
          rarity: entry.isLegendary ? 'Legendary' : 'Common'
        };

        // Image
        const img = document.querySelector('img[src*="/pokemonpokopia/pokemon/"]');
        result.image = img ? img.src : `https://www.serebii.net/pokemonpokopia/pokemon/${String(entry.num).padStart(3,'0')}.png`;

        // Specialties
        const specLinks = [...document.querySelectorAll('a[href*="/pokedex/specialty/"]')];
        result.specialties = [...new Set(specLinks.map(a => a.innerText.trim()).filter(Boolean))];

        // Habitats
        const habitatTable = [...document.querySelectorAll('table.dextable')].find(t =>
          t.innerText.includes('Habitats & Locations')
        );
        result.habitats = habitatTable
          ? [...new Set([...habitatTable.querySelectorAll('a[href*="/habitatdex/"]')].map(a => a.innerText.trim()).filter(Boolean))]
          : [];

        // Time/Weather
        const bodyText = document.body.innerText;
        result.time = ['Morning', 'Day', 'Evening', 'Night'].filter(t => bodyText.includes(t));
        result.weather = ['Sun', 'Cloud', 'Rain'].filter(w => bodyText.includes(w));

        // Locations
        const locLinks = [...document.querySelectorAll('a[href*="/locationdex/"]')];
        result.locations = [...new Set(locLinks.map(a => a.innerText.trim()).filter(Boolean))];

        // Determine rarity from page content if not legendary
        if (!entry.isLegendary) {
          result.rarity = bodyText.includes('Rare') ? 'Rare' : 'Common';
        }

        return result;
      }, entry);

      detailed.push(data);

    } catch (e) {
      console.error(`  ERROR ${entry.slug}: ${e.message}`);
      // Add minimal entry
      detailed.push({
        slug: entry.slug,
        name: entry.name,
        pokopiaId: entry.num,
        image: `https://www.serebii.net/pokemonpokopia/pokemon/${String(entry.num).padStart(3,'0')}.png`,
        specialties: [],
        habitats: [],
        time: [],
        weather: [],
        locations: [],
        rarity: entry.isLegendary ? 'Legendary' : 'Common'
      });
    }

    await sleep(300);
  }

  await browser2.close();

  // Save
  fs.writeFileSync(OUT_FILE, JSON.stringify(detailed, null, 2));
  console.log(`\nSaved ${detailed.length} pokemon to ${OUT_FILE}`);

  // Regenerate pokemon-data.ts
  console.log('\nRegenerating pokemon-data.ts...');
  require('../scripts/gen-pokemon-data.js');

})().catch(e => { console.error(e); process.exit(1); });
