#!/usr/bin/env node
// Regenerate src/lib/pokemon-data.ts from scraped JSON
// Uses pokopiaId as the id field, correct time/weather display

const fs = require('fs');
const path = require('path');

const scraped = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/scraped/pokemon-serebii.json'), 'utf8'));

console.log(`Generating from ${scraped.length} pokemon...`);

// Build the time/weather display value:
// All 4 times = "Any" (display as Any Time)
// All 3 weathers = "Any" (display as Any Weather)
// Otherwise comma-join the specific values
function timeVal(times) {
  if (!times || times.length === 0) return "Any";
  const all = ["Morning","Day","Evening","Night"];
  if (all.every(t => times.includes(t))) return "Any";
  return times.join(",");
}
function weatherVal(weathers) {
  if (!weathers || weathers.length === 0) return "Any";
  const all = ["Sun","Cloud","Rain"];
  if (all.every(w => weathers.includes(w))) return "Any";
  return weathers.join(",");
}

const lines = scraped.filter(p => p && p.name && p.pokopiaId).map(p => {
  const id = p.pokopiaId;
  const name = p.name.replace(/'/g, "\\'");
  const types = JSON.stringify(p.specialties || []);
  const habitats = JSON.stringify(p.habitats || []);
  const image = p.image || `https://www.serebii.net/pokemonpokopia/pokemon/${String(id).padStart(3,'0')}.png`;
  const rarity = p.rarity || "Common";
  const specialties = JSON.stringify(p.specialties || []);
  const locations = JSON.stringify(p.locations || []);
  const time = timeVal(p.time);
  const weather = weatherVal(p.weather);

  return `  { id: ${id}, nationalDex: null, name: "${p.name}", types: ${types}, habitats: ${habitats}, image: "${image}", rarity: "${rarity}", specialties: ${specialties}, locations: ${locations}, time: "${time}", weather: "${weather}" },`;
});

// Read existing file to preserve header/footer
const existingFile = fs.readFileSync(path.join(__dirname, '../src/lib/pokemon-data.ts'), 'utf8');
const startMarker = 'const _rawPokemonList: RawPokemon[] = [';
const endMarker = '];';
const startIdx = existingFile.indexOf(startMarker);
// Find the matching closing bracket
let depth = 0;
let endIdx = -1;
for (let i = startIdx + startMarker.length; i < existingFile.length; i++) {
  if (existingFile[i] === '[') depth++;
  else if (existingFile[i] === ']') {
    if (depth === 0) { endIdx = i; break; }
    depth--;
  }
}

const header = existingFile.slice(0, startIdx);
const footer = existingFile.slice(endIdx + 1);

const newContent = header +
  startMarker + '\n' +
  lines.join('\n') + '\n' +
  ']' + footer;

fs.writeFileSync(path.join(__dirname, '../src/lib/pokemon-data.ts'), newContent);
console.log(`Done! Wrote ${scraped.length} pokemon with pokopiaIds.`);

// Show a few samples
const sample = scraped.slice(0, 5);
sample.forEach(p => {
  console.log(`  #${p.pokopiaId} ${p.name}: time=${timeVal(p.time)} weather=${weatherVal(p.weather)}`);
});
// Show some with non-Any time
const specific = scraped.filter(p => timeVal(p.time) !== "Any").slice(0, 3);
console.log("Examples with specific time:");
specific.forEach(p => console.log(`  #${p.pokopiaId} ${p.name}: time=${timeVal(p.time)} weather=${weatherVal(p.weather)}`));
