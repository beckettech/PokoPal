#!/usr/bin/env node
// Maps 404 Serebii item URLs to already-downloaded alternatives

const fs = require('fs');
const path = require('path');

const PROJECT = path.join(__dirname, '..');
const HABITATS = path.join(PROJECT, 'src/data/scraped/habitats.json');

// Map 404 URLs -> local path we already have (or best substitute)
const FALLBACK = {
  'https://www.serebii.net/pokemonpokopia/items/bed.png':                   '/items/plainbed.png',
  'https://www.serebii.net/pokemonpokopia/items/berrytree.png':             '/items/chestotree.png',
  'https://www.serebii.net/pokemonpokopia/items/boo-in-thebox.png':         '/items/toy.png',
  'https://www.serebii.net/pokemonpokopia/items/carboadboxes.png':          '/items/garbagebin.png',
  'https://www.serebii.net/pokemonpokopia/items/closet.png':                '/items/logchair.png',
  'https://www.serebii.net/pokemonpokopia/items/dresser.png':               '/items/logchair.png',
  'https://www.serebii.net/pokemonpokopia/items/furnace.png':               '/items/ironbeam.png',
  'https://www.serebii.net/pokemonpokopia/items/garbagebag.png':            '/items/garbagebin.png',
  'https://www.serebii.net/pokemonpokopia/items/ironbeamorcolumn.png':      '/items/ironbeam.png',
  'https://www.serebii.net/pokemonpokopia/items/lighting.png':              '/items/utilitypole.png',
  'https://www.serebii.net/pokemonpokopia/items/lostrelic(large).png':      '/items/pikachudoll.png',
  'https://www.serebii.net/pokemonpokopia/items/mirror(large).png':         '/items/pikachudoll.png',
  'https://www.serebii.net/pokemonpokopia/items/moonlightdancestatue.png':  '/items/pikachudoll.png',
  'https://www.serebii.net/pokemonpokopia/items/musicmat.png':              '/items/table.png',
  'https://www.serebii.net/pokemonpokopia/items/partition.png':             '/items/ironbeam.png',
  'https://www.serebii.net/pokemonpokopia/items/pedastal.png':              '/items/pikachudoll.png',
  'https://www.serebii.net/pokemonpokopia/items/seat(wide.png':             '/items/seat.png',
  'https://www.serebii.net/pokemonpokopia/items/stand.png':                 '/items/pikachudoll.png',
  'https://www.serebii.net/pokemonpokopia/items/streetlight.png':           '/items/utilitypole.png',
  'https://www.serebii.net/pokemonpokopia/items/table(large).png':          '/items/table.png',
  'https://www.serebii.net/pokemonpokopia/items/tree.png':                  '/items/largepalmtree.png',
  'https://www.serebii.net/pokemonpokopia/items/treestump.png':             '/items/largepalmtree.png',
  'https://www.serebii.net/pokemonpokopia/items/vegetablefield.png':        '/items/pottedplant.png',
  'https://www.serebii.net/pokemonpokopia/items/vegetables.png':            '/items/pottedplant.png',
  'https://www.serebii.net/pokemonpokopia/items/wastebin.png':              '/items/garbagebin.png',
  'https://www.serebii.net/pokemonpokopia/items/waterfall.png':             '/items/freshwater.png',
  'https://www.serebii.net/pokemonpokopia/items/waterwheel.png':            '/items/freshwater.png',
  'https://www.serebii.net/pokemonpokopia/items/windmill.png':              '/items/largepalmtree.png',
};

const data = JSON.parse(fs.readFileSync(HABITATS, 'utf8'));
let fixed = 0;

function fix(obj) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) { obj.forEach(fix); return; }
  for (const key of Object.keys(obj)) {
    if ((key === 'image' || key === 'icon') && typeof obj[key] === 'string' && obj[key].includes('serebii.net')) {
      const fallback = FALLBACK[obj[key]];
      if (fallback) { obj[key] = fallback; fixed++; }
      else console.log('  No fallback for:', obj[key]);
    } else {
      fix(obj[key]);
    }
  }
}

fix(data);
fs.writeFileSync(HABITATS, JSON.stringify(data, null, 2));
console.log(`Fixed ${fixed} fallback item URLs`);

// Verify no serebii left
const remaining = (fs.readFileSync(HABITATS, 'utf8').match(/serebii\.net/g) || []).length;
console.log(`Remaining serebii.net refs: ${remaining}`);
