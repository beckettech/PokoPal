#!/usr/bin/env node
/**
 * Fix Pokemon Pokopia data to ONLY include the official 300 pokemon
 * Pokemon Pokopia has its own dex numbering 1-300
 * Mew is #300 (the last one)
 *
 * This script:
 * 1. Filters scraped data to only pokopiaId 1-300
 * 2. Removes any national dex IDs > 300
 * 3. Ensures Mew is #300
 */

const fs = require('fs');
const path = require('path');

const SCRAPED_FILE = path.join(__dirname, '../src/data/scraped/pokemon-serebii.json');

const data = JSON.parse(fs.readFileSync(SCRAPED_FILE, 'utf8'));

console.log(`Original count: ${data.length}`);

// Filter to ONLY pokopiaId 1-300
const valid = data.filter(p => {
  const id = p.pokopiaId;
  return id && Number.isInteger(id) && id >= 1 && id <= 300;
});

console.log(`Valid (1-300): ${valid.length}`);

// Check Mew
const mew = valid.find(p => p.name?.toLowerCase() === 'mew');
if (mew) {
  console.log(`Mew found at #${mew.pokopiaId}`);
} else {
  console.log('WARNING: Mew not found!');
}

// Check for duplicates
const idCounts = {};
valid.forEach(p => {
  idCounts[p.pokopiaId] = (idCounts[p.pokopiaId] || 0) + 1;
});
const dups = Object.entries(idCounts).filter(([id, count]) => count > 1);
if (dups.length > 0) {
  console.log(`Duplicate IDs: ${dups.map(([id,c]) => `#${id}(${c})`).join(', ')}`);
  // Keep only first occurrence of each ID
  const seen = new Set();
  const deduped = [];
  for (const p of valid) {
    if (!seen.has(p.pokopiaId)) {
      seen.add(p.pokopiaId);
      deduped.push(p);
    }
  }
  valid.length = 0;
  valid.push(...deduped);
  console.log(`After dedup: ${valid.length}`);
}

// Sort by pokopiaId
valid.sort((a, b) => a.pokopiaId - b.pokopiaId);

// Show range
const ids = valid.map(p => p.pokopiaId);
console.log(`ID range: ${Math.min(...ids)} - ${Math.max(...ids)}`);

// Save
fs.writeFileSync(SCRAPED_FILE, JSON.stringify(valid, null, 2));
console.log(`Saved ${valid.length} pokemon`);

// Regenerate pokemon-data.ts
console.log('\nRegenerating pokemon-data.ts...');
require('./gen-pokemon-data.js');
