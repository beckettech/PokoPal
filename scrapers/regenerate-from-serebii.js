/**
 * Regenerate _rawPokemonList from scraped Serebii data
 * This replaces the entire Pokemon list with authoritative Serebii data
 */

const fs = require('fs');
const path = require('path');

const POKEMON_DATA_FILE = path.join(__dirname, '../src/lib/pokemon-data.ts');
const SCRAPED_FILE = path.join(__dirname, '../src/data/scraped/pokemon-serebii.json');

// Type mappings
function timeToType(timeArr) {
  if (!timeArr || timeArr.length === 0) return "Any";
  if (timeArr.length >= 4 && timeArr.includes('Morning') && timeArr.includes('Day') && timeArr.includes('Night')) {
    return "Any";
  }
  if (timeArr.includes('Night') && !timeArr.includes('Morning') && !timeArr.includes('Day')) {
    return "Night";
  }
  if (timeArr.includes('Morning') || timeArr.includes('Day') || timeArr.includes('Evening')) {
    if (!timeArr.includes('Night')) return "Day";
  }
  return "Any";
}

function weatherToType(weatherArr) {
  if (!weatherArr || weatherArr.length === 0) return "Any";
  if (weatherArr.length >= 3 && weatherArr.includes('Sun') && weatherArr.includes('Cloud') && weatherArr.includes('Rain')) {
    return "Any";
  }
  if (weatherArr.includes('Rain')) return "Rainy";
  if (weatherArr.includes('Sun') && !weatherArr.includes('Cloud') && !weatherArr.includes('Rain')) return "Sunny";
  if (weatherArr.includes('Cloud')) return "Cloudy";
  return "Any";
}

async function main() {
  console.log('🔄 Regenerating _rawPokemonList from Serebii data...\n');

  // Load scraped data
  const serebiiData = JSON.parse(fs.readFileSync(SCRAPED_FILE, 'utf8'));
  console.log(`✅ Loaded ${serebiiData.length} Serebii entries\n`);

  // Read current file
  let content = fs.readFileSync(POKEMON_DATA_FILE, 'utf8');

  // Generate new _rawPokemonList entries
  const entries = [];
  for (const p of serebiiData) {
    if (!p || !p.name) continue;
    
    const time = timeToType(p.time);
    const weather = weatherToType(p.weather);
    const rarity = p.rarity || 'Common';
    
    // Extract types from specialties (or default to empty)
    const types = p.specialties || [];
    
    // Build entry
    const entry = `  { id: ${p.pokopiaId}, nationalDex: ${p.nationalDex || 'null'}, name: "${p.name}", types: ${JSON.stringify(types)}, habitats: ${JSON.stringify(p.habitats || [])}, image: "${p.image}", rarity: "${rarity}", specialties: ${JSON.stringify(p.specialties || [])}, time: "${time}", weather: "${weather}" }`;
    entries.push(entry);
  }

  console.log(`📝 Generated ${entries.length} Pokemon entries`);

  // Create the new _rawPokemonList
  const newList = `const _rawPokemonList: RawPokemon[] = [
${entries.join(',\n')}
];`;

  // Find and replace the _rawPokemonList in the file
  const pattern = /const _rawPokemonList: RawPokemon\[\] = \[[\s\S]*?\];/;
  if (pattern.test(content)) {
    content = content.replace(pattern, newList);
    console.log('✅ Replaced _rawPokemonList in pokemon-data.ts');
  } else {
    console.error('❌ Could not find _rawPokemonList pattern in file');
    process.exit(1);
  }

  // Write back
  fs.writeFileSync(POKEMON_DATA_FILE, content, 'utf8');
  console.log(`💾 Saved: ${POKEMON_DATA_FILE}`);

  console.log('\n✅ Done! _rawPokemonList now has all Pokemon from Serebii');
  console.log('\n🔥 Next steps:');
  console.log('   1. Run: npm run build');
  console.log('   2. Run: npx vercel --prod --yes');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
