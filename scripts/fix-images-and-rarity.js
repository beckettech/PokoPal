#!/usr/bin/env node
/**
 * Fix missing images and verify rarity assignments
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const POKEMON_DIR = path.join(__dirname, '../public/pokemon');

// Pokemon that should be Legendary
const LEGENDARIES = new Set([
  "Kyogre", "Raikou", "Entei", "Suicune", "Volcanion",
  "Articuno", "Zapdos", "Moltres", "Lugia", "Ho-Oh",
  "Mewtwo", "Mew"
]);

// Pokemon that should be Rare (pseudos, starters, fossils, special evos)
const RARE_POKEMON = new Set([
  // Starters final evos
  "Venusaur", "Charizard", "Blastoise",
  "Typhlosion", "Feraligatr", "Meganium",
  "Blaziken", "Swampert", "Sceptile",
  "Infernape", "Empoleon", "Torterra",
  "Emboar", "Samurott", "Serperior",
  "Greninja", "Delphox", "Chesnaught",
  "Incineroar", "Primarina", "Decidueye",
  "Cinderace", "Inteleon", "Rillaboom",
  "Meowscarada", "Skeledirge", "Quaquaval",
  // Pseudos
  "Dragonite", "Tyranitar", "Salamence", "Metagross", "Garchomp",
  "Hydreigon", "Goodra", "Kommo-o", "Dragapult",
  // Fossils
  "Aerodactyl", "Rampardos", "Bastiodon", "Archeops", "Carracosta",
  "Tyrantrum", "Aurorus", "Dracozolt", "Arctozolt", "Dracovish", "Arctovish",
  // Eeveelutions
  "Vaporeon", "Jolteon", "Flareon", "Espeon", "Umbreon", "Leafeon", "Glaceon", "Sylveon",
  // Special
  "Snorlax", "Gengar", "Gyarados", "Arcanine", "Alakazam", "Golem", "Machamp",
  "Slowking", "Scizor", "Steelix", "Crobat", "Blissey", "Electivire", "Magmortar",
  "Togekiss", "Weavile", "Mamoswine", "Gallade", "Froslass", "Rhyperior", "Tangrowth",
  "Porygon-Z", "Dusknoir", "Honchkrow", "Mismagius", "Gliscor", "Yanmega", "Probopass",
  "Magnezone", "Lickilicky", "Ambipom", "Exeggutor",
  // Gen 9 specials
  "Clodsire", "Farigiraf", "Annihilape", "Sneasler", "Overqwil",
  "Tinkaton", "Gholdengo", "Armarouge", "Ceruledge", "Sandaconda",
  "Copperajah", "Coalossal", "Corviknight", "Orbeetle", "Centiskorch",
  "Hatterene", "Grimmsnarl", "Obstagoon", "Perrserker", "Mr. Rime",
  "Cursola", "Runerigus", "Basculegion", "Kleavor",
]);

// Images that are likely broken (from HTML error pages)
const MISSING_IMAGES = [
  { file: "382.png", name: "Kyogre", url: "https://img.pokemondb.net/sprites/scarlet-violet/normal/kyogre.png" },
  { file: "243.png", name: "Raikou", url: "https://img.pokemondb.net/sprites/scarlet-violet/normal/raikou.png" },
  { file: "244.png", name: "Entei", url: "https://img.pokemondb.net/sprites/scarlet-violet/normal/entei.png" },
  { file: "245.png", name: "Suicune", url: "https://img.pokemondb.net/sprites/scarlet-violet/normal/suicune.png" },
  { file: "721.png", name: "Volcanion", url: "https://img.pokemondb.net/sprites/scarlet-violet/normal/volcanion.png" },
  { file: "144.png", name: "Articuno", url: "https://img.pokemondb.net/sprites/scarlet-violet/normal/articuno.png" },
  { file: "145.png", name: "Zapdos", url: "https://img.pokemondb.net/sprites/scarlet-violet/normal/zapdos.png" },
  { file: "146.png", name: "Moltres", url: "https://img.pokemondb.net/sprites/scarlet-violet/normal/moltres.png" },
  { file: "249.png", name: "Lugia", url: "https://img.pokemondb.net/sprites/scarlet-violet/normal/lugia.png" },
  { file: "250.png", name: "Ho-Oh", url: "https://img.pokemondb.net/sprites/scarlet-violet/normal/ho-oh.png" },
  { file: "150.png", name: "Mewtwo", url: "https://img.pokemondb.net/sprites/scarlet-violet/normal/mewtwo.png" },
  { file: "151.png", name: "Mew", url: "https://img.pokemondb.net/sprites/scarlet-violet/normal/mew.png" },
];

async function downloadImage(file, url) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(POKEMON_DIR, file);
    
    // Check if file exists and is valid PNG
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath);
      if (data.length > 1000 && data[0] === 0x89 && data[1] === 0x50) {
        console.log(`✓ ${file} already exists (${data.length} bytes)`);
        return resolve(true);
      }
      console.log(`⚠ ${file} exists but invalid (${data.length} bytes), redownloading...`);
    }
    
    console.log(`↓ Downloading ${file} from ${url}`);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        console.log(`✗ ${file} failed: HTTP ${res.statusCode}`);
        return resolve(false);
      }
      
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const data = Buffer.concat(chunks);
        if (data.length < 1000 || data[0] !== 0x89 || data[1] !== 0x50) {
          console.log(`✗ ${file} invalid response (${data.length} bytes)`);
          return resolve(false);
        }
        fs.writeFileSync(filePath, data);
        console.log(`✓ ${file} downloaded (${data.length} bytes)`);
        resolve(true);
      });
    }).on('error', err => {
      console.log(`✗ ${file} error: ${err.message}`);
      resolve(false);
    });
  });
}

async function main() {
  // Download missing legendary images
  console.log("Checking legendary images...\n");
  for (const img of MISSING_IMAGES) {
    await downloadImage(img.file, img.url);
  }
  
  // Now fix rarity in pokemon-data.ts
  console.log("\n--- Checking rarity assignments ---");
  const dataPath = path.join(__dirname, '../src/lib/pokemon-data.ts');
  let data = fs.readFileSync(dataPath, 'utf8');
  
  // Count current rarities
  const legendaryCount = (data.match(/rarity: "Legendary"/g) || []).length;
  const rareCount = (data.match(/rarity: "Rare"/g) || []).length;
  const commonCount = (data.match(/rarity: "Common"/g) || []).length;
  
  console.log(`Current: ${legendaryCount} Legendary, ${rareCount} Rare, ${commonCount} Common`);
  
  // Fix rarities for specific Pokemon
  let fixed = 0;
  
  // Ensure all legendaries are marked correctly
  for (const name of LEGENDARIES) {
    const regex = new RegExp(`(name: "${name}".*?rarity: ")Common"`, 'g');
    if (regex.test(data)) {
      data = data.replace(regex, `$1Legendary"`);
      fixed++;
      console.log(`  Fixed ${name} → Legendary`);
    }
  }
  
  // Mark rare Pokemon
  for (const name of RARE_POKEMON) {
    const regex = new RegExp(`(name: "${name}".*?rarity: ")Common"`, 'g');
    if (regex.test(data)) {
      data = data.replace(regex, `$1Rare"`);
      fixed++;
      console.log(`  Fixed ${name} → Rare`);
    }
  }
  
  if (fixed > 0) {
    fs.writeFileSync(dataPath, data);
    console.log(`\n✓ Fixed ${fixed} rarity assignments`);
    
    const newLegendary = (data.match(/rarity: "Legendary"/g) || []).length;
    const newRare = (data.match(/rarity: "Rare"/g) || []).length;
    const newCommon = (data.match(/rarity: "Common"/g) || []).length;
    console.log(`New: ${newLegendary} Legendary, ${newRare} Rare, ${newCommon} Common`);
  } else {
    console.log("No rarity fixes needed");
  }
}

main().catch(console.error);
