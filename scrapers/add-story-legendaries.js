#!/usr/bin/env node
// Add Gen 2-3 legendaries that are story-based (no Serebii page yet)
// These appear in game but don't have habitat pages
const fs = require('fs');
const path = require('path');

const OUT_FILE = path.join(__dirname, '../src/data/scraped/pokemon-serebii.json');
const data = JSON.parse(fs.readFileSync(OUT_FILE));

// Remove bad 404 entries we just added (no pokopiaId, name="404 Error")
const cleaned = data.filter(p => !(p.name === '404 Error' || p.name === 'User-Sync'));
console.log(`Removed ${data.length - cleaned.length} bad entries`);

// Known story legendaries not yet on Serebii
// pokopiaId = national dex number (Pokopia uses national dex IDs for images)
const storyLegendaries = [
  { slug: 'celebi',     name: 'Celebi',     pokopiaId: 251, specialties: ['???'], notes: 'Story-based legendary' },
  { slug: 'regirock',   name: 'Regirock',   pokopiaId: 377, specialties: ['Build'], notes: 'Story-based legendary' },
  { slug: 'regice',     name: 'Regice',     pokopiaId: 378, specialties: ['Water'], notes: 'Story-based legendary' },
  { slug: 'registeel',  name: 'Registeel',  pokopiaId: 379, specialties: ['Build'], notes: 'Story-based legendary' },
  { slug: 'latias',     name: 'Latias',     pokopiaId: 380, specialties: ['Fly'], notes: 'Story-based legendary' },
  { slug: 'latios',     name: 'Latios',     pokopiaId: 381, specialties: ['Fly'], notes: 'Story-based legendary' },
  { slug: 'groudon',    name: 'Groudon',    pokopiaId: 383, specialties: ['Build'], notes: 'Story-based legendary' },
  { slug: 'rayquaza',   name: 'Rayquaza',   pokopiaId: 384, specialties: ['Fly'], notes: 'Story-based legendary' },
  { slug: 'jirachi',    name: 'Jirachi',    pokopiaId: 385, specialties: ['???'], notes: 'Story-based legendary' },
  { slug: 'deoxys',     name: 'Deoxys',     pokopiaId: 386, specialties: ['???'], notes: 'Story-based legendary' },
];

// Check which are already present
const existingNames = new Set(cleaned.map(p => p.slug?.toLowerCase()).filter(Boolean));

for (const leg of storyLegendaries) {
  if (!existingNames.has(leg.slug)) {
    cleaned.push({
      slug: leg.slug,
      name: leg.name,
      image: `https://www.serebii.net/pokemonpokopia/pokemon/${String(leg.pokopiaId).padStart(3,'0')}.png`,
      pokopiaId: leg.pokopiaId,
      nationalDex: null,
      specialties: leg.specialties,
      idealHabitat: null,
      favorites: [],
      habitats: [], // story-based, no player-built habitat
      timeWeatherPerHabitat: [],
      time: ['Morning','Day','Evening','Night'],
      weather: ['Sun','Cloud','Rain'],
      locations: [],
      rarity: 'Legendary',
      notes: leg.notes,
    });
    console.log(`Added ${leg.name} (#${leg.pokopiaId})`);
  } else {
    // Update rarity if already present
    const existing = cleaned.find(p => p.slug === leg.slug);
    if (existing) {
      existing.rarity = 'Legendary';
      console.log(`Updated ${leg.name} → Legendary`);
    }
  }
}

fs.writeFileSync(OUT_FILE, JSON.stringify(cleaned, null, 2));
console.log(`\nTotal pokemon: ${cleaned.length}`);

// Regenerate
console.log('\nRegenerating pokemon-data.ts...');
require('../scripts/gen-pokemon-data.js');
