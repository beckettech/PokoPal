import { readFileSync, writeFileSync } from 'fs';

const habitats = JSON.parse(readFileSync('./src/data/scraped/habitats.json', 'utf8'));

let fixed = 0;
for (const h of habitats) {
  if (h.locations) {
    const before = JSON.stringify(h.locations);
    h.locations = h.locations.map(l => l.startsWith('-') ? l.slice(1) : l);
    if (JSON.stringify(h.locations) !== before) fixed++;
  }
}

writeFileSync('./src/data/scraped/habitats.json', JSON.stringify(habitats, null, 2));
console.log(`Fixed ${fixed} habitats with prefixed locations`);

// Show sample
const tall = habitats.find(h => h.name === 'Tall Grass');
console.log('Tall Grass locations:', tall?.locations);
