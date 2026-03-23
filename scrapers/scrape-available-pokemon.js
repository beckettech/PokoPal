#!/usr/bin/env node
/**
 * Scrape Serebii's Available Pokemon page for the official Pokopia dex
 * - Gets correct pokopia numbers (national dex based, with forms sharing numbers)
 * - Identifies legendaries (marked with ⭐)
 * - Updates the scraped data and pokemon-data.ts
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUT_FILE = path.join(__dirname, '../src/data/scraped/pokemon-serebii.json');
const DATA_FILE = path.join(__dirname, '../src/lib/pokemon-data.ts');

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function scrapeAvailablePokemon(page) {
  await page.goto('https://www.serebii.net/pokemonpokopia/availablepokemon.shtml', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });
  await sleep(2000);

  return page.evaluate(() => {
    const pokemon = [];
    // Serebii uses tables with pokemon entries
    // Each row: number | name (with optional ⭐ for legendary)
    const tables = [...document.querySelectorAll('table')];
    
    for (const table of tables) {
      const rows = [...table.querySelectorAll('tr')];
      for (const row of rows) {
        const cells = [...row.querySelectorAll('td')];
        if (cells.length >= 2) {
          const numText = cells[0]?.innerText?.trim() || '';
          const nameText = cells[1]?.innerText?.trim() || '';
          
          // Check if it's a numbered entry
          const numMatch = numText.match(/^(\d+)/);
          if (numMatch && nameText) {
            const num = parseInt(numMatch[1]);
            const name = nameText.replace(/[⭐☆]/g, '').trim();
            const isLegendary = row.innerText.includes('⭐') || row.innerText.includes('☆');
            
            pokemon.push({ num, name, isLegendary });
          }
        }
      }
    }
    
    // Also check for anchor-based structure (some Serebii pages use this)
    const anchors = [...document.querySelectorAll('a[href*="/pokedex/"]')];
    for (const a of anchors) {
      const text = a.textContent?.trim() || '';
      const match = text.match(/^(\d+)\s+(.+)$/);
      if (match) {
        const num = parseInt(match[1]);
        const name = match[2].replace(/[⭐☆]/g, '').trim();
        const isLegendary = a.closest('tr')?.innerText?.includes('⭐') || text.includes('⭐');
        
        // Avoid duplicates
        if (!pokemon.find(p => p.num === num && p.name === name)) {
          pokemon.push({ num, name, isLegendary });
        }
      }
    }
    
    // Sort by number
    pokemon.sort((a, b) => a.num - b.num);
    
    return pokemon;
  });
}

async function scrapePokemonDetails(page, slug) {
  try {
    await page.goto(`https://www.serebii.net/pokemonpokopia/pokedex/${slug}.shtml`, {
      waitUntil: 'networkidle2',
      timeout: 30000
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
      }

      // Times/weathers
      const allTimes = new Set();
      const allWeathers = new Set();
      const bodyText = document.body.innerText;
      ['Morning','Day','Evening','Night'].forEach(t => { if(bodyText.includes(t)) allTimes.add(t); });
      ['Sun','Cloud','Rain'].forEach(w => { if(bodyText.includes(w)) allWeathers.add(w); });
      
      result.time = [...allTimes];
      result.weather = [...allWeathers];

      // Locations
      const locationLinks = Array.from(document.querySelectorAll('a[href*="/pokemonpokopia/locationdex/"]'));
      result.locations = [...new Set(locationLinks.map(a => a.innerText.trim()).filter(Boolean))];

      // Rarity - default Common, will be updated from master list
      result.rarity = 'Common';

      return result;
    }, slug);
  } catch (e) {
    return { slug, error: e.message };
  }
}

(async () => {
  console.log('Starting scrape of Serebii Available Pokemon...');
  
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  // Step 1: Get the master list
  const masterList = await scrapeAvailablePokemon(page);
  console.log(`Found ${masterList.length} pokemon in master list`);
  
  // Count legendaries
  const legendaries = masterList.filter(p => p.isLegendary);
  console.log(`Legendaries found: ${legendaries.map(p => `#${p.num} ${p.name}`).join(', ')}`);
  
  // Step 2: Load existing scraped data
  const existingData = JSON.parse(fs.readFileSync(OUT_FILE, 'utf8'));
  
  // Step 3: Update rarity for legendaries
  const legendaryNames = new Set(legendaries.map(p => p.name.toLowerCase()));
  let updated = 0;
  
  for (const p of existingData) {
    if (p.name && legendaryNames.has(p.name.toLowerCase())) {
      if (p.rarity !== 'Legendary') {
        p.rarity = 'Legendary';
        updated++;
        console.log(`  Updated ${p.name} → Legendary`);
      }
    }
  }
  
  console.log(`Updated ${updated} pokemon to Legendary rarity`);
  
  // Save updated scraped data
  fs.writeFileSync(OUT_FILE, JSON.stringify(existingData, null, 2));
  console.log('Saved updated scraped data');
  
  await browser.close();
  
  // Step 4: Regenerate pokemon-data.ts
  console.log('\nRegenerating pokemon-data.ts...');
  require('../scripts/gen-pokemon-data.js');
  
  console.log('\nDone!');
  console.log(`Total legendaries: ${legendaries.length}`);
  console.log(`Master list count: ${masterList.length}`);
})().catch(e => { console.error(e); process.exit(1); });
