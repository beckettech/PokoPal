#!/usr/bin/env node
// download-serebii-assets.js
// Downloads all Serebii-hosted assets and rewrites JSON/TSX paths to local /assets/

const fs = require('fs');
const path = require('path');
const https = require('https');

const PROJECT = path.join(__dirname, '..');
const PUBLIC = path.join(PROJECT, 'public');

// Output directories
const DIRS = {
  habitats: path.join(PUBLIC, 'habitats'),
  specialties: path.join(PUBLIC, 'specialties'),
  locations: path.join(PUBLIC, 'locations'),
  items: path.join(PUBLIC, 'items'),
};

for (const d of Object.values(DIRS)) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve) => {
    if (fs.existsSync(dest)) {
      const size = fs.statSync(dest).size;
      if (size > 500) { resolve('skip'); return; }
    }
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'Referer': 'https://www.serebii.net/', 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) { file.close(); fs.unlinkSync(dest); resolve('fail:' + res.statusCode); return; }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve('ok'); });
    }).on('error', (e) => { file.close(); resolve('err:' + e.message); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function urlToLocal(url) {
  // https://www.serebii.net/pokemonpokopia/habitatdex/1.png -> /habitats/1.png
  // https://www.serebii.net/pokemonpokopia/pokedex/specialty/build.png -> /specialties/build.png
  // https://www.serebii.net/pokemonpokopia/locations/bleak.jpg -> /locations/bleak.jpg
  // https://www.serebii.net/pokemonpokopia/items/tree.png -> /items/tree.png
  const match = url.match(/serebii\.net\/pokemonpokopia\/(.+)/);
  if (!match) return null;
  const rel = match[1];
  if (rel.startsWith('habitatdex/')) return { localUrl: '/habitats/' + path.basename(rel), dest: path.join(DIRS.habitats, path.basename(rel)) };
  if (rel.startsWith('pokedex/specialty/')) return { localUrl: '/specialties/' + path.basename(rel), dest: path.join(DIRS.specialties, path.basename(rel)) };
  if (rel.startsWith('locations/')) return { localUrl: '/locations/' + path.basename(rel), dest: path.join(DIRS.locations, path.basename(rel)) };
  if (rel.startsWith('items/')) return { localUrl: '/items/' + path.basename(rel), dest: path.join(DIRS.items, path.basename(rel)) };
  if (rel.startsWith('pokemon/')) return { localUrl: '/pokemon/' + path.basename(rel), dest: path.join(PUBLIC, 'pokemon', path.basename(rel)) };
  return null;
}

async function processJson(filePath, imageKey) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = 0;
  const failed = [];

  const processObj = async (obj) => {
    if (typeof obj !== 'object' || !obj) return;
    if (Array.isArray(obj)) { for (const item of obj) await processObj(item); return; }
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if ((key === 'image' || key === 'icon') && typeof val === 'string' && val.includes('serebii.net')) {
        const mapped = urlToLocal(val);
        if (mapped) {
          const result = await download(val, mapped.dest);
          if (result === 'ok' || result === 'skip') {
            obj[key] = mapped.localUrl;
            if (result === 'ok') changed++;
          } else {
            failed.push({ url: val, result });
          }
          await sleep(80);
        }
      } else if (typeof val === 'object') {
        await processObj(val);
      }
    }
  };

  await processObj(data);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`${path.basename(filePath)}: ${changed} downloaded, ${failed.length} failed`);
  if (failed.length) failed.slice(0, 5).forEach(f => console.log('  FAIL:', f.url, f.result));
  return failed;
}

// Collect all unique item URLs from dream-islands-page.tsx
function extractItemUrls(tsxPath) {
  const content = fs.readFileSync(tsxPath, 'utf8');
  const urls = new Set();
  const re = /https:\/\/www\.serebii\.net\/pokemonpokopia\/[^\s"'`]+/g;
  let m;
  while ((m = re.exec(content)) !== null) urls.add(m[0]);
  return [...urls];
}

async function downloadItemUrls(urls) {
  let ok = 0, fail = 0;
  for (const url of urls) {
    const mapped = urlToLocal(url);
    if (!mapped) { console.log('  unmapped:', url); continue; }
    const result = await download(url, mapped.dest);
    if (result === 'ok') { ok++; console.log('  ✓', path.basename(mapped.dest)); }
    else if (result === 'skip') ok++;
    else { fail++; console.log('  ✗', url, result); }
    await sleep(80);
  }
  console.log(`dream-islands items: ${ok} ok, ${fail} failed`);
}

async function patchTsx(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const re = /https:\/\/www\.serebii\.net\/pokemonpokopia\/([^\s"'`]+)/g;
  let patched = 0;
  content = content.replace(re, (match) => {
    const mapped = urlToLocal(match);
    if (mapped) { patched++; return mapped.localUrl; }
    return match;
  });
  // Remove the BASE const line
  content = content.replace(/^const BASE = "https:\/\/www\.serebii\.net\/pokemonpokopia";\n/m, '');
  fs.writeFileSync(filePath, content);
  console.log(`Patched ${path.basename(filePath)}: ${patched} URLs replaced`);
}

async function patchHabitatDex() {
  const filePath = path.join(PROJECT, 'src/components/pages/habitat-dex-page.tsx');
  let content = fs.readFileSync(filePath, 'utf8');
  const re = /https:\/\/www\.serebii\.net\/pokemonpokopia\/([^\s"'`]+)/g;
  let patched = 0;
  const urlsToDl = [];
  content = content.replace(re, (match) => {
    const mapped = urlToLocal(match);
    if (mapped) { patched++; urlsToDl.push({ url: match, dest: mapped.dest }); return mapped.localUrl; }
    return match;
  });
  fs.writeFileSync(filePath, content);
  // Download the items
  let ok = 0;
  for (const { url, dest } of urlsToDl) {
    const result = await download(url, dest);
    if (result === 'ok' || result === 'skip') ok++;
    else console.log('  item fail:', url, result);
    await sleep(80);
  }
  console.log(`habitat-dex-page.tsx: ${patched} URLs replaced, ${ok} assets downloaded`);
}

async function patchLayout() {
  const filePath = path.join(PROJECT, 'src/app/layout.tsx');
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/<link rel="preconnect" href="https:\/\/www\.serebii\.net" \/>\n?\s*/g, '');
  content = content.replace(/<link rel="dns-prefetch" href="https:\/\/www\.serebii\.net" \/>\n?\s*/g, '');
  fs.writeFileSync(filePath, content);
  console.log('layout.tsx: removed Serebii preconnect links');
}

(async () => {
  console.log('=== Downloading Serebii assets ===\n');

  console.log('1. Habitats JSON...');
  await processJson(path.join(PROJECT, 'src/data/scraped/habitats.json'), 'image');

  console.log('\n2. Specialties JSON...');
  await processJson(path.join(PROJECT, 'src/data/scraped/specialties.json'), 'icon');

  console.log('\n3. Locations JSON...');
  await processJson(path.join(PROJECT, 'src/data/scraped/locations.json'), 'image');

  console.log('\n4. Dream Islands item assets...');
  const dreamPath = path.join(PROJECT, 'src/components/pages/dream-islands-page.tsx');
  const itemUrls = extractItemUrls(dreamPath);
  console.log(`  Found ${itemUrls.length} unique URLs`);
  await downloadItemUrls(itemUrls);

  console.log('\n5. Patching dream-islands-page.tsx...');
  await patchTsx(dreamPath);

  console.log('\n6. Patching habitat-dex-page.tsx...');
  await patchHabitatDex();

  console.log('\n7. Patching layout.tsx...');
  await patchLayout();

  console.log('\n=== Done! ===');
})();
