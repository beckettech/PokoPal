const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./src/data/scraped/pokemon-serebii.json', 'utf8'));

console.log('=== Checking for Vespiquen ===');
console.log(`Total entries: ${data.length}`);

// Search for Vespiquen in all fields
const vespiquenEntries = [];
for (const p of data) {
  const name = p.name.toLowerCase();
  if (name.includes('vespiquen')) {
    console.log(`Found: "${p.name}" (slug: ${p.slug})`);
    vespiquenEntries.push({ id: p.pokopiaId, name: p.name, slug: p.slug, time: p.time, weather: p.weather });
  }
}

if (vespiquenEntries.length === 0) {
  console.log('❌ NOT FOUND');
} else if (vespiquenEntries.length === 1) {
  console.log(`✅ Found ${vespiquenEntries.length} entry`);
  vespiquenEntries.forEach(e => {
    console.log(`  - Pokopia ID: ${e.id}, Time: [${e.time?.join(',') || 'null'}], Weather: [${e.weather?.join(',') || 'null'}]`);
  });
} else {
  console.log(`✅ Found ${vespiquenEntries.length} entries (possible variations):`);
  vespiquenEntries.forEach(e => console.log(`  - ${e.name} (ID ${e.id})`));
}

// Also check duplicates with same name but different slug
const dupes = {};
for (const p of data) {
  const lower = p.name.toLowerCase();
  if (!dupes[lower]) dupes[lower] = [];
  dupes[lower].push({ name: p.name, slug: p.slug, id: p.pokopiaId });
  if (dupes[lower].length > 1) {
    console.log(`⚠️ Duplicate name: ${p.name}`);
    dupes[lower].forEach(e => console.log(`  - ${e.slug} (ID: ${e.id})`));
  }
}
