#!/usr/bin/env node
// Update legendary rarities based on Serebii's Available Pokemon page
// Legendaries are marked with ⭐ on https://www.serebii.net/pokemonpokopia/availablepokemon.shtml

const fs = require('fs');
const path = require('path');

const OUT_FILE = path.join(__dirname, '../src/data/scraped/pokemon-serebii.json');

// Known legendaries from Serebii's Available Pokemon page
const LEGENDARY_NAMES = new Set([
  // Gen 1
  'articuno', 'zapdos', 'moltres', 'mewtwo', 'mew',
  // Gen 2
  'raikou', 'entei', 'suicune', 'lugia', 'ho-oh', 'celebi',
  // Gen 3
  'regirock', 'regice', 'registeel', 'latias', 'latios',
  'kyogre', 'groudon', 'rayquaza', 'jirachi', 'deoxys',
  // Gen 4
  'uxie', 'mesprit', 'azelf', 'dialga', 'palkia', 'heatran',
  'regigigas', 'giratina', 'cresselia', 'phione', 'manaphy',
  'darkrai', 'shaymin', 'arceus',
  // Gen 5
  'victini', 'cobalion', 'terrakion', 'virizion', 'tornadus',
  'thundurus', 'reshiram', 'zekrom', 'landorus', 'kyurem',
  'keldeo', 'meloetta', 'genesect',
  // Gen 6
  'xerneas', 'yveltal', 'zygarde', 'diancie', 'hoopa', 'volcanion',
  // Gen 7
  'tapu koko', 'tapu lele', 'tapu bulu', 'tapu fini',
  'cosmog', 'cosmoem', 'solgaleo', 'lunala', 'nihilego',
  'buzzwole', 'pheromosa', 'xurkitree', 'celesteela', 'kartana',
  'guzzlord', 'necrozma', 'magearna', 'marshadow', 'poipole',
  'naganadel', 'stakataka', 'blacephalon', 'zeraora',
  // Gen 8
  'zacian', 'zamazenta', 'eternatus', 'kubfu', 'urshifu',
  'zarude', 'regieleki', 'regidrago', 'glastrier', 'spectrier',
  'calyrex', 'enamorus',
  // Gen 9
  'koraidon', 'miraidon', 'ting-lu', 'chien-pao', 'wo-chien',
  'chi-yu', 'great tusk', 'scream tail', 'brute bonnet', 'flutter mane',
  'slither wing', 'sandy shocks', 'iron treads', 'iron bundle',
  'iron hands', 'iron jugulis', 'iron moth', 'iron thorns',
  'roaring moon', 'iron valiant', 'walking wake', 'iron leaves',
  'gouging fire', 'raging bolt', 'iron boulder', 'iron crown',
  'terapagos', 'pecharunt'
]);

const data = JSON.parse(fs.readFileSync(OUT_FILE, 'utf8'));

let updated = 0;
const foundLegendaries = [];

for (const p of data) {
  if (p.name) {
    const nameLower = p.name.toLowerCase();
    if (LEGENDARY_NAMES.has(nameLower)) {
      if (p.rarity !== 'Legendary') {
        p.rarity = 'Legendary';
        updated++;
        foundLegendaries.push(`#${p.pokopiaId} ${p.name}`);
      }
    }
  }
}

console.log(`Updated ${updated} pokemon to Legendary rarity`);
console.log(`Legendaries found: ${foundLegendaries.length}`);
foundLegendaries.forEach(p => console.log(`  ${p}`));

fs.writeFileSync(OUT_FILE, JSON.stringify(data, null, 2));
console.log('Saved updated data');

// Now regenerate pokemon-data.ts
console.log('\nRegenerating pokemon-data.ts...');
require('../scripts/gen-pokemon-data.js');
