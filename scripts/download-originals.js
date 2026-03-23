#!/usr/bin/env node
/**
 * download-originals.js
 * Downloads original Pokémon sprites from PokemonDB into public/pokemon-original/
 * Maps filenames from pokemon-data.ts to PokémonDB names.
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'public', 'pokemon-original');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

// Read pokemon-data.ts and extract all image paths
const dataFile = fs.readFileSync(path.join(__dirname, '..', 'src/lib/pokemon-data.ts'), 'utf8');
const imageRe = /image: "\/pokemon\/([^"]+)"/g;
const names = new Set();
let m;
while ((m = imageRe.exec(dataFile)) !== null) names.add(m[1]);

// Map filename -> PokémonDB name
// e.g. "025.png" -> "pikachu", "025-peakychu.png" -> skip (custom), "422-eastsea.png" -> "shellos-east-sea"
const NATIONAL_DEX_TO_NAME = {};

// We'll use the PokeAPI to get names by national dex number
const customMap = {
  '025-peakychu.png': null, // custom variant, skip
  '422-eastsea.png': 'shellos-east-sea',
  '423-eastsea.png': 'gastrodon-east-sea',
  '194-paldean.png': 'wooper-paldea',
  '978-curly.png': 'tatsugiri-curly',
  '978-droopy.png': 'tatsugiri-droopy',
  '978-stretchy.png': 'tatsugiri-stretchy',
  '849-amped.png': 'toxtricity-amped',
  '849-lowkey.png': 'toxtricity-low-key',
  '143-mosslax.png': null, // custom, skip
};

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function download(url, dest) {
  return new Promise((resolve) => {
    if (fs.existsSync(dest) && fs.statSync(dest).size > 500) { resolve('skip'); return; }
    const proto = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    proto.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.existsSync(dest) && fs.unlinkSync(dest);
        resolve(download(res.headers.location, dest));
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.existsSync(dest) && fs.unlinkSync(dest);
        resolve('fail:' + res.statusCode);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve('ok'); });
    }).on('error', (e) => { file.close(); resolve('err:' + e.message); });
  });
}

async function fetchPokeApiName(dexNum) {
  return new Promise((resolve) => {
    https.get(`https://pokeapi.co/api/v2/pokemon/${dexNum}`, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try { resolve(JSON.parse(body).name); } catch { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

(async () => {
  console.log(`Found ${names.size} unique image files\n`);
  let ok = 0, skipped = 0, failed = [];

  for (const fname of [...names].sort()) {
    const dest = path.join(OUT, fname);

    // Handle custom maps
    if (fname in customMap) {
      if (customMap[fname] === null) {
        console.log(`  skip (custom): ${fname}`);
        skipped++;
        continue;
      }
      // Use pokemondb with mapped name
      const url = `https://img.pokemondb.net/sprites/scarlet-violet/normal/${customMap[fname]}.png`;
      const result = await download(url, dest);
      if (result === 'ok') { ok++; console.log(`  ✓ ${fname} (custom map)`); }
      else if (result === 'skip') ok++;
      else { failed.push(`${fname}: ${result}`); console.log(`  ✗ ${fname}: ${result}`); }
      await sleep(120);
      continue;
    }

    // Standard: extract dex number from filename like "025.png" or "003.png"
    const numMatch = fname.match(/^(\d+)\.png$/);
    if (!numMatch) {
      console.log(`  skip (no match): ${fname}`);
      skipped++;
      continue;
    }

    const dexNum = parseInt(numMatch[1], 10);
    // Try PokemonDB by dex number lookup via PokeAPI for the name
    let name = NATIONAL_DEX_TO_NAME[dexNum];
    if (!name) {
      name = await fetchPokeApiName(dexNum);
      if (name) NATIONAL_DEX_TO_NAME[dexNum] = name;
      await sleep(80);
    }

    if (!name) {
      failed.push(`${fname}: no name found for dex ${dexNum}`);
      continue;
    }

    const url = `https://img.pokemondb.net/sprites/scarlet-violet/normal/${name}.png`;
    const result = await download(url, dest);
    if (result === 'ok') { ok++; if (ok % 30 === 0) console.log(`  ${ok} done...`); }
    else if (result === 'skip') ok++;
    else {
      // fallback: try home artwork
      const url2 = `https://img.pokemondb.net/artwork/large/${name}.jpg`;
      const dest2 = path.join(OUT, fname.replace('.png', '.jpg'));
      const r2 = await download(url2, dest2);
      if (r2 === 'ok' || r2 === 'skip') {
        // rename to .png
        if (r2 === 'ok') fs.renameSync(dest2, dest);
        ok++;
      } else {
        failed.push(`${fname}: ${result}`);
        console.log(`  ✗ ${fname}: ${result}`);
      }
    }
    await sleep(120);
  }

  console.log(`\nDone! ${ok} downloaded, ${skipped} skipped, ${failed.length} failed`);
  if (failed.length) failed.slice(0, 10).forEach(f => console.log('  FAIL:', f));
})();
