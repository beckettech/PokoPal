#!/usr/bin/env node
/**
 * Fix: Remove all pokemon with pokopiaId > 300
 * Pokemon Pokopia has exactly 300 pokemon, Mew is #300
 * 
 * Forms/variants with national dex IDs (Tatsugiri #978, etc.) are NOT in Pokopia's 1-300 dex
 */

const fs = require('fs');
const path = require('path');

const SCRAPED_FILE = path.join(__dirname, '../src/data/scraped/pokemon-serebii.json');
const data = JSON.parse(fs.readFileSync(SCRAPED_FILE, 'utf8'));

console.log(`Original count: ${data.length}`);

// Find and remove pokemon with ID > 300
const over300 = data.filter(p => p.pokopiaId > 300);
console.log(`Pokemon with ID > 300: ${over300.length}`);
over300.forEach(p => console.log(`  #${p.pokopiaId} ${p.name}`));

// Keep only 1-300
const valid = data.filter(p => p.pokopiaId >= 1 && p.pokopiaId <= 300);
console.log(`Valid (1-300): ${valid.length}`);

// Dedupe by pokopiaId
const seen = new Set();
const deduped = [];
for (const p of valid) {
  if (!seen.has(p.pokopiaId)) {
    seen.add(p.pokopiaId);
    deduped.push(p);
  }
}
console.log(`After dedup: ${deduped.length}`);

// Sort by ID
deduped.sort((a, b) => a.pokopiaId - b.pokopiaId);

// Save
fs.writeFileSync(SCRAPED_FILE, JSON.stringify(deduped, null, 2));
console.log(`Saved ${deduped.length} pokemon`);

// Show range
const ids = deduped.map(p => p.pokopiaId);
console.log(`ID range: ${Math.min(...ids)} - ${Math.max(...ids)}`);

// Regenerate
console.log('\nRegenerating pokemon-data.ts...');
require('./gen-pokemon-data.js');
