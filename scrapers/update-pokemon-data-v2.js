/**
 * Update pokemon-data.ts with real time/weather data from Serebii scraper
 */

const fs = require('fs');
const path = require('path');

const POKEMON_DATA_FILE = path.join(__dirname, '../src/lib/pokemon-data.ts');
const SCRAPED_FILE = path.join(__dirname, '../src/data/scraped/pokemon-serebii.json');

// Time type from Serebii array to type
function timeToType(timeArr) {
  if (!timeArr || timeArr.length === 0) return "Any";
  // If all times present, return Any
  if (timeArr.length >= 4 && timeArr.includes('Morning') && timeArr.includes('Day') && timeArr.includes('Night')) {
    return "Any";
  }
  if (timeArr.includes('Night') && !timeArr.includes('Morning') && !timeArr.includes('Day')) {
    return "Night";
  }
  // Morning/Day/Evening maps to Day
  if (timeArr.includes('Morning') || timeArr.includes('Day') || timeArr.includes('Evening')) {
    if (!timeArr.includes('Night')) return "Day";
  }
  return "Any";
}

// Weather type from Serebii array to type
function weatherToType(weatherArr) {
  if (!weatherArr || weatherArr.length === 0) return "Any";
  // If all weather present, return Any
  if (weatherArr.length >= 3 && weatherArr.includes('Sun') && weatherArr.includes('Cloud') && weatherArr.includes('Rain')) {
    return "Any";
  }
  if (weatherArr.includes('Rain')) return "Rainy";
  if (weatherArr.includes('Sun') && !weatherArr.includes('Cloud') && !weatherArr.includes('Rain')) return "Sunny";
  if (weatherArr.includes('Cloud')) return "Cloudy";
  return "Any";
}

async function main() {
  console.log('🔄 Updating pokemon-data.ts with scraped Serebii time/weather data...\n');

  // Load scraped data
  const serebiiData = JSON.parse(fs.readFileSync(SCRAPED_FILE, 'utf8'));
  const serebiiMap = new Map();
  serebiiData.forEach(p => {
    if (p && p.name) {
      serebiiMap.set(p.name.toLowerCase(), p);
    }
  });
  console.log(`✅ Loaded ${serebiiMap.size} Serebii entries\n`);

  // Read current pokemon-data.ts
  let content = fs.readFileSync(POKEMON_DATA_FILE, 'utf8');
  
  // Count Pokemon entries
  const beforeCount = (content.match(/^\s*\{\s*id:\s*\d+,/gm) || []).length;
  console.log(`📊 Found ${beforeCount} Pokemon entries in pokemon-data.ts\n`);

  let updatedCount = 0;
  let notFoundCount = 0;

  // Pattern to match Pokemon entries - capture the whole entry up to the closing brace
  // Match: { id: X, nationalDex: X, name: "...", ... },
  const entryPattern = /(\s*\{\s*id:\s*(\d+),\s*nationalDex:\s*(\d+|null),\s*name:\s*"([^"]+)",\s*types:\s*\[[^\]]*\],\s*habitats:\s*\[[^\]]*\],\s*image:\s*"[^"]*",\s*rarity:\s*"(Common|Rare|Legendary)",[^}]*\},)/g;

  content = content.replace(entryPattern, (fullMatch, entry, id, nationalDex, name, rarity) => {
    const serebiiEntry = serebiiMap.get(name.toLowerCase());
    
    if (!serebiiEntry) {
      notFoundCount++;
      if (notFoundCount <= 10) {
        console.log(`⚠️  No Serebii data for: ${name}`);
      }
      return fullMatch; // Keep original
    }

    const time = timeToType(serebiiEntry.time);
    const weather = weatherToType(serebiiEntry.weather);

    // Remove existing time/weather/conditions fields
    let cleanedEntry = entry
      .replace(/,?\s*conditions:\s*\[[^\]]*\]/g, '')
      .replace(/,?\s*time:\s*"[^"]*"/g, '')
      .replace(/,?\s*weather:\s*"[^"]*"/g, '');
    
    // Remove trailing comma before closing brace if present
    cleanedEntry = cleanedEntry.replace(/,\s*\},$/, ' },');

    // Add new time/weather before the closing brace
    const newEntry = cleanedEntry.replace(/\s*\},$/, `, time: "${time}", weather: "${weather}" },`);

    updatedCount++;
    if (updatedCount <= 10 || updatedCount % 50 === 0) {
      console.log(`✅ Updated #${id} ${name}: time=${time}, weather=${weather}`);
    }

    return newEntry;
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Updated: ${updatedCount} Pokemon`);
  console.log(`   Not found: ${notFoundCount} Pokemon`);

  // Write back
  fs.writeFileSync(POKEMON_DATA_FILE, content, 'utf8');
  console.log(`\n💾 Saved: ${POKEMON_DATA_FILE}`);

  console.log('\n✅ Done! Pokemon data now has real time/weather from Serebii');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
