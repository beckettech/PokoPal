const fs = require('fs');
const path = require('path');

const POKEMON_DATA_FILE = path.join(__dirname, 'src/lib/pokemon-data.ts');
const SCRAPED_FILE = path.join(__dirname, 'src/data/scraped/pokemon-serebii.json');

console.log('=== POKEMON DATA CHECK ===');

// Try to read pokemon-data.ts properly
let pokemonData = null;
try {
  pokemonData = fs.readFileSync(POKEMON_DATA_FILE, 'utf8');
} catch (e) {
  console.log('❌ Could not read pokemon-data.ts:', e.message);
  process.exit(1);
}

// Parse pokemonList from it
const listMatch = pokemonData.match(/export const pokemonList[^:]*:\s*\[([^]]+)\]/);
if (!listMatch) {
  console.log('❌ Could not find pokemonList array');
  process.exit(1);
}

const arrayContent = listMatch[1];
console.log('Pokemon list found:', arrayContent.substring(0, 200));

// Count entries
const entryCount = (arrayContent.match(/id:\s*\d+/g) || []).length;
console.log(`Total Pokemon in pokemon-data.ts: ${entryCount}`);

// Count scraped data
let scrapedCount = 0;
try {
  const scrapedData = JSON.parse(fs.readFileSync(SCRAPED_FILE, 'utf8'));
  scrapedCount = Array.isArray(scrapedData) ? scrapedData.length : 0;
} catch (e) {
  console.log('❌ Could not read scraped data:', e.message);
  scrapedCount = 0;
}

console.log(`Scraped entries: ${scrapedCount}`);

console.log('\n=== SAMPLE ENTRIES FROM POKEMON DATA ===');
// Find and show first few Pokemon with their data
const sampleLines = pokemonData.split('\n').filter(line => line.includes('id:'));
for (let idx = 0; idx < Math.min(5, sampleLines.length); idx++) {
  console.log(sampleLines[idx]);
}

console.log('\n=== Serebii ENTRIES CHECK ===');
// Read and check scraped data
let serebiiData = null;
try {
  serebiiData = JSON.parse(fs.readFileSync(SCRAPED_FILE, 'utf8'));
} catch (e) {
  console.log('❌ Could not read scraped data:', e.message);
  serebiiData = null;
}

// Check for specific Pokemon Beck mentioned
const checkNames = ['skwovet', 'timburr'];
console.log('\nChecking for:', checkNames.join(', '));

for (const name of checkNames) {
  const foundInSerebii = serebiiData?.find(p => p.name.toLowerCase() === name.toLowerCase());
  if (foundInSerebii) {
    console.log(`✅ ${name} found in Serebii data`);
  } else {
    console.log(`❌ ${name} NOT found in Serebii data`);
  }
}

// Check Pokemon with time/weather set (should be from update)
const withTimeWeather = serebiiData?.filter(p => p.time || p.weather) || [];
console.log(`Pokemon with time/weather in scraped data: ${withTimeWeather.length}`);

// Check Pokemon missing image
const noImage = serebiiData?.filter(p => !p.image) || [];
console.log(`Pokemon missing images: ${noImage.length}`);
console.log(`  - Names:`, noImage.map(p => p.name).join(', '));
