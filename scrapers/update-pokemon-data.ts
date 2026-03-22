/**
 * Update pokemon-data.ts with real time/weather data from Serebii scraper
 */

const fs = require('fs');
const path = require('path');

const POKEMON_DATA_FILE = path.join(__dirname, '../src/lib/pokemon-data.ts');
const SCRAPED_FILE = path.join(__dirname, '../src/data/scraped/pokemon-serebii.json');

// Time and weather parsing
function parseTimeWeather(serebiiEntry) {
  const { time, weather } = serebiiEntry;
  const result: { time: "Any" as "Any" | "Morning" | "Day" | "Night", weather: "Any" as "Any" | "Sunny" | "Cloudy" | "Rainy" | "Snowy" | "Foggy" } = {
    time: "Any",
    weather: "Any"
  };

  // Parse time: empty or all three = Any
  if (!time || time.length === 0 || (time.length === 3 && time.includes('Morning') && time.includes('Day') && time.includes('Evening') && time.includes('Night'))) {
    result.time = "Any";
  } else if (time.length === 1) {
    result.time = time[0];  // single time like "Night"
  }

  // Parse weather: empty or all three = Any
  if (!weather || weather.length === 0 || (weather.length === 3 && weather.includes('Sun') && weather.includes('Cloud') && weather.includes('Rain'))) {
    result.weather = "Any";
  } else if (weather.length === 1) {
    result.weather = weather[0];  // single weather like "Rain"
  } else if (weather.length === 2) {
    // Two weathers - pick the more specific one
    // Priority: Rain > Cloud > Sunny
    result.weather = weather.find(w => ['Rainy', 'Cloudy', 'Sunny'].includes(w)) || weather[0];
  }

  return result;
}

// Time type from Serebii string to type
function timeStringToType(timeStr: string[]): "Any" | "Morning" | "Day" | "Night" {
  if (!timeStr || timeStr.length === 0 || timeStr.includes('All') || timeStr.includes('Evening')) {
    return "Any";
  }
  if (timeStr.includes('Night')) return "Night";
  return "Day";  // Morning/Day maps to Day
}

// Weather type from Serebii string to type
function weatherStringToType(weatherStr: string[]): "Any" | "Sunny" | "Cloudy" | "Rainy" | "Snowy" | "Foggy" {
  if (!weatherStr || weatherStr.length === 0 || weatherStr.includes('All') || weatherStr.includes('Cloudy')) {
    return "Any";
  }
  if (weatherStr.includes('Rain')) return "Rainy";
  if (weatherStr.includes('Sun')) return "Sunny";
  return "Cloudy";  // Sun/Cloud maps to Cloudy
}

async function main() {
  console.log('🔄 Updating pokemon-data.ts with scraped Serebii time/weather data...');

  const serebiiData = JSON.parse(fs.readFileSync(SCRAPED_FILE, 'utf8'));
  const serebiiMap = new Map();
  serebiiData.forEach((p, idx) => {
    serebiiMap.set(p.slug, p);
    if ((idx + 1) % 50 === 0) console.log(`  Loaded ${idx + 1}: ${p.name}`);
  });
  console.log(`✅ Loaded ${serebiiMap.size} Serebii entries`);

  // Read current pokemon-data.ts
  let pokemonData = fs.readFileSync(POKEMON_DATA_FILE, 'utf8');

  // Count Pokemon before
  const beforeCount = (pokemonData.match(/id: \d+,/g) || []).length;
  console.log(`📊 Found ${beforeCount} Pokemon in pokemon-data.ts`);

  let updatedCount = 0;

  // Pattern to match Pokemon entry: id: X, name: "...", types: [...], image: "...", rarity: "...",
  // specialties?: [...], conditions?: [...], habitats?: [...], locations?: [...], notes?: "...",
  // pokopiaId: X, nationalDex: X,
  const pokemonEntryRegex = /  \{id:\s*?[^,}]*,\s*nationalDex:\s*?[^,}]*,\s*name:\s*?"([^"]+)"\s*,\s*types:\s*(\[[^\]]+\])\s*,\s*image:\s*"([^"]+)"\s*,\s*rarity:\s*"(Common|Rare|Legendary)"\s*,/);

  for (const serebiiEntry of serebiiData) {
    const pokemonEntry = serebiiMap.get(serebiiEntry.slug);

    if (!pokemonEntry) {
      console.log(`⚠️  No Pokemon found for Serebii entry: ${serebiiEntry.name} (${serebiiEntry.slug})`);
      continue;
    }

    const { time, weather } = parseTimeWeather(serebiiEntry);

    // Build the new entry with real time/weather
    const newEntry = `  { id: ${pokemonEntry.pokopiaId}, nationalDex: ${JSON.stringify(pokemonEntry.nationalDex || null)}, name: "${pokemonEntry.name.replace(/"/g, '"')}", types: ${JSON.stringify(pokemonEntry.specialties || [])}, image: "${pokemonEntry.image}", rarity: "${pokemonEntry.rarity || 'Common'}", pokopiaId: ${pokemonEntry.pokopiaId}`;

    // Add specialties if present
    if (pokemonEntry.specialties && pokemonEntry.specialties.length > 0) {
      newEntry += `, specialties: ${JSON.stringify(pokemonEntry.specialties)}`;
    }

    // Add habitats if present
    if (pokemonEntry.habitats && pokemonEntry.habitats.length > 0) {
      newEntry += `, habitats: ${JSON.stringify(pokemonEntry.habitats)}`;
    }

    // Add locations if present
    if (pokemonEntry.locations && pokemonEntry.locations.length > 0) {
      newEntry += `, locations: ${JSON.stringify(pokemonEntry.locations)}`;
    }

    // Add time/weather
    newEntry += `, time: "${timeStringToType(time)}", weather: "${weatherStringToType(weather)}"`;

    newEntry += ' }';

    // Replace the old entry
    const entryPattern = new RegExp(
      `  \\{id:\\s*${pokemonEntry.pokopiaId}\\s*,\\s*nationalDex:\\s*${JSON.stringify(pokemonEntry.nationalDex || null).replace(/"/g, '"')?.replace(/"/g, '\\"')}\\s*,\\s*name:\\s*"([^"]+)"\\s*,\\s*types:\\s*(\\[[^\\]]+\\])\\s*,\\s*image:\\s*"([^"]+)"\\s*,\\s*rarity:\\s*"(Common|Rare|Legendary)"\\s*`
    );

    if (!entryPattern.test(pokemonData)) {
      console.log(`❌ Pokemon ${pokemonEntry.pokopiaId} (${pokemonEntry.name}) not found in pokemon-data.ts`);
    } else {
      pokemonData = pokemonData.replace(entryPattern, newEntry);
      updatedCount++;
    }
  }

  // Count Pokemon after
  const afterCount = (pokemonData.match(/id: \d+,/g) || []).length;
  console.log(`✅ Updated ${updatedCount} Pokemon entries`);
  console.log(`📊 After: ${afterCount} Pokemon in pokemon-data.ts`);

  // Write back
  fs.writeFileSync(POKEMON_DATA_FILE, pokemonData, 'utf8');
  console.log(`💾 Saved: ${POKEMON_DATA_FILE}`);

  console.log('\n✅ Done! Pokemon data now has real time/weather from Serebii');
  console.log(`🔥 Next steps:`);
  console.log(`   1. Run: npm run build`);
  console.log(`   2. Run: npx vercel --prod --yes`);
  console.log('');
  console.log(`   3. Then test the app - conditions should show real time/weather`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
