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
  const result = { time: "Any", weather: "Any" };

  // Parse time: empty or all three = Any
  if (!time || time.length === 0 || (time.length === 3 && time.includes('Morning') && time.includes('Day') && time.includes('Night'))) {
    result.time = "Any";
  } else if (time.length === 1) {
    result.time = time[0]; // Night, Day, or Evening
  }

  // Parse weather: empty or all three = Any
  if (!weather || weather.length === 0 || (weather.length === 3 && weather.includes('Sun') && weather.includes('Cloud') && weather.includes('Rain'))) {
    result.weather = "Any";
  } else if (weather.length === 1) {
    result.weather = weather[0]; // Sun, Cloud, or Rain
  }

  return result;
}

// Time type from Serebii string to type
function timeStringToType(timeStr) {
  if (!timeStr || timeStr.length === 0 || timeStr.includes('Any')) {
    return "Any";
  }
  if (timeStr.includes('Night')) return "Night";
  return "Day"; // Morning/Day maps to Day
}

// Weather type from Serebii string to type
function weatherStringToType(weatherStr) {
  if (!weatherStr || weatherStr.length === 0 || weatherStr.includes('Any')) {
    return "Any";
  }
  if (weatherStr.includes('Rain')) return "Rainy";
  if (weatherStr.includes('Sun')) return "Sunny";
  return "Cloudy"; // Sun/Cloud maps to Cloudy
}

async function main() {
  console.log('🔄 Updating pokemon-data.ts with scraped Serebii time/weather data...');

  const scrapedData = JSON.parse(fs.readFileSync(SCRAPED_FILE, 'utf8'));
  const scrapedMap = new Map();
  scrapedData.forEach((p, idx) => {
    scrapedMap.set(p.slug, p);
    if ((idx + 1) % 50 === 0) console.log(`  Loaded ${idx + 1}: ${p.name}`);
  });
  console.log(`✅ Loaded ${scrapedMap.size} Serebii entries`);

  // Read current pokemon-data.ts
  let pokemonData = fs.readFileSync(POKEMON_DATA_FILE, 'utf8');

  // Count Pokemon before
  const beforeCount = (pokemonData.match(/\bid: \d+,/g) || []).length;
  console.log(`📊 Found ${beforeCount} Pokemon in pokemon-data.ts`);

  let updatedCount = 0;

  // Find and update each Pokemon entry by slug
  const lines = pokemonData.split('\n');
  const slugIndex = new Map();
  
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    if (!line.startsWith('{') && !line.includes('id:')) continue;
    
    // Extract slug from line (look for "name: "..." pattern)
    const slugMatch = line.match(/name:\s*"([^"]+)"\s*/);
    if (!slugMatch) continue;
    
    const slug = slugMatch[1].toLowerCase().replace(/\s+/g, '');
    if (!slug || slug.length < 3) continue;
    
    // Skip if we've seen this slug already
    if (slugIndex.has(slug)) continue;
    slugIndex.set(slug, lineIdx);

    // Get scraped data for this slug
    const scraped = scrapedMap.get(slug);
    if (!scraped) continue;

    const { time, weather } = parseTimeWeather(scraped);

    // Build the update pattern
    const timeStr = `time: "${timeStringToType([time])}"`;
    const weatherStr = `weather: "${weatherStringToType([weather])}"`;

    // Replace existing time/weather lines with new values
    let updatedLine = line;
    
    // Remove old time line if exists
    const timeLineMatch = line.match(/\b,\s*time:\s*"Any"|"Day"|"Night"}\s*/);
    if (timeLineMatch) {
      updatedLine = line.replace(timeLineMatch[0], timeStr);
    } else {
      // Find the closing brace of this Pokemon entry
      let braceCount = 0;
      let insertAfter = null;
      for (let i = lineIdx; i >= 0; i--) {
        if (lines[i].includes('},')) {
          braceCount++;
          if (braceCount === 2) {
            insertAfter = i;
            break;
          }
        }
      }
      
      if (insertAfter) {
        // Insert time and weather after the closing brace
        const lineEnd = lines[insertAfter].trimEnd();
        const indent = '  ';
        updatedLine = lineEnd + ',' + indent + timeStr + ',' + indent + weatherStr;
      }
    }

    if (updatedLine !== line) {
      lines[lineIdx] = updatedLine;
      updatedCount++;
    }
  }

  // Write back
  const updatedPokemonData = lines.join('\n');
  fs.writeFileSync(POKEMON_DATA_FILE, updatedPokemonData, 'utf8');

  // Count Pokemon after
  const afterCount = (updatedPokemonData.match(/\bid: \d+,/g) || []).length;
  console.log(`✅ Updated ${updatedCount} Pokemon entries`);
  console.log(`📊 After: ${afterCount} Pokemon in pokemon-data.ts`);
  console.log(`📄 Output: ${POKEMON_DATA_FILE}`);

  console.log('\n✅ Done! Pokemon data now has real time/weather from Serebii');
  console.log('🔥 Next steps:');
  console.log('   1. Run: npm run build');
  console.log('   2. Run: npx vercel --prod --yes');
  console.log('   3. Test: conditions should show real time/weather in dex detail page');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
