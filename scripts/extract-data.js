// Extract pokemon-data.ts inline data to JSON files for lazy loading
const fs = require('fs');

const src = fs.readFileSync('src/lib/pokemon-data.ts', 'utf8');

// Extract _rawPokemonList
const pokemonMatch = src.match(/const _rawPokemonList: RawPokemon\[\] = (\[[\s\S]*?\n\]);/);
if (pokemonMatch) {
  const arr = eval(pokemonMatch[1]);
  fs.writeFileSync('public/pokemon-list.json', JSON.stringify(arr));
  console.log(`Extracted ${arr.length} pokemon`);
}

// Extract cloudIslandsPosts
const cloudMatch = src.match(/export const cloudIslandsPosts: CloudIslandPost\[\] = (\[[\s\S]*?\n\]);/);
if (cloudMatch) {
  const arr = eval(cloudMatch[1]);
  fs.writeFileSync('public/cloud-islands.json', JSON.stringify(arr));
  console.log(`Extracted ${arr.length} cloud islands`);
}

// Extract mysteryGifts
const giftMatch = src.match(/export const mysteryGifts: MysteryGift\[\] = (\[[\s\S]*?\n\]);/);
if (giftMatch) {
  const arr = eval(giftMatch[1]);
  fs.writeFileSync('public/mystery-gifts.json', JSON.stringify(arr));
  console.log(`Extracted ${arr.length} mystery gifts`);
}

// Extract requests
const reqMatch = src.match(/export const requests: Request\[\] = (\[[\s\S]*?\n\]);/);
if (reqMatch) {
  const arr = eval(reqMatch[1]);
  fs.writeFileSync('public/requests-list.json', JSON.stringify(arr));
  console.log(`Extracted ${arr.length} requests`);
}

// Extract moves
const moveMatch = src.match(/export const moves: Move\[\] = (\[[\s\S]*?\n\]);/);
if (moveMatch) {
  const arr = eval(moveMatch[1]);
  fs.writeFileSync('public/moves.json', JSON.stringify(arr));
  console.log(`Extracted ${arr.length} moves`);
}

// Extract detailedHabitatList
const habMatch = src.match(/export const detailedHabitatList: HabitatInfo\[\] = (\[[\s\S]*?\n\]);/);
if (habMatch) {
  const arr = eval(habMatch[1]);
  fs.writeFileSync('public/detailed-habitats.json', JSON.stringify(arr));
  console.log(`Extracted ${arr.length} detailed habitats`);
}
