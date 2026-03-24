#!/usr/bin/env node
/**
 * scrape-items.js — Scrapes all items from Serebii Pokopia items page
 * Outputs: src/data/scraped/items.json
 * Downloads images to: public/items/
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const OUT_JSON = path.join(__dirname, '..', 'src/data/scraped/items.json');
const IMG_DIR  = path.join(__dirname, '..', 'public/items');

if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.serebii.net/',
      }
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

function download(url, dest) {
  return new Promise((resolve) => {
    if (fs.existsSync(dest) && fs.statSync(dest).size > 200) { resolve('skip'); return; }
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.serebii.net/' } }, (res) => {
      if (res.statusCode !== 200) { file.close(); if (fs.existsSync(dest)) fs.unlinkSync(dest); resolve('fail:' + res.statusCode); return; }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve('ok'); });
    }).on('error', (e) => { file.close(); resolve('err:' + e.message); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function stripTags(s) {
  return s.replace(/<[^>]+>/g, ' ').replace(/&eacute;/g, 'é').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseItems(html) {
  const categories = [];
  let currentCat = null;

  // Split on <h2> to find category sections
  // Each h2 contains the category name as anchor: <h2><a id="materials">List of Materials</a></h2>
  const parts = html.split(/(?=<h2>)/i);

  for (const part of parts) {
    // Try to extract category name: <a id="..."></a>List of Materials</h2>
    const h2 = part.match(/<a[^>]*><\/a>(?:List of\s*)?([^<\r\n]+)<\/h2>/i);
    if (!h2) continue;

    const catName = h2[1].replace(/&amp;/g, '&').trim();
    currentCat = { name: catName, slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), items: [] };

    // Each item row: <tr><td class="cen"><a href="items/SLUG.shtml"><img src="items/SLUG.png" ...
    const rowRe = /<tr>\s*<td[^>]*>\s*<a href="items\/([^"]+)\.shtml">\s*<img[^>]*\/>\s*<\/a>\s*<\/td>\s*<td[^>]*>\s*<a href="[^"]+"><u>([^<]+)<\/u><\/a>\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/gi;
    let m;
    while ((m = rowRe.exec(part)) !== null) {
      const slug = m[1];
      const name = m[2].trim();
      const description = stripTags(m[3]);
      const tag = stripTags(m[4]).replace(/^\s*$/, '') || null;

      // Parse locations cell
      const locCell = m[5];
      const locations = [];
      const locRe = /<a href="(?:locations|dreamisland)\/([^"]+)\.shtml"[^>]*><u>([^<]+)<\/u><\/a>(?:\s*\(([^)]+)\))?/g;
      let lm;
      while ((lm = locRe.exec(locCell)) !== null) {
        locations.push({ slug: lm[1], name: lm[2].trim(), method: lm[3] ? lm[3].trim() : null });
      }

      // Free-text methods (Shop, Craft, Smelt, etc.) — text nodes not in anchors
      const methods = stripTags(locCell)
        .split(/\n|<br\s*\/?>/)
        .map(l => l.trim())
        .filter(l => l && !/^</.test(l) && l.length > 3 && l.length < 200 && !/^(Withered|Bleak|Rocky|Sparkling|Palette|Cloud|Pikachu|Eevee|Clefairy|Arcanine|Dragonite|Ditto|Substitute)/.test(l))
        .slice(0, 6);

      // Note
      const noteMatch = description.match(/Note:\s*(.+)/);
      const note = noteMatch ? noteMatch[1].trim() : null;
      const cleanDesc = description.replace(/Note:.*/, '').trim();

      currentCat.items.push({
        slug,
        name,
        description: cleanDesc,
        tag: tag && tag !== '\u00a0' ? tag : null,
        note,
        image: `/items/${slug}.png`,
        locations,
        methods,
      });
    }

    if (currentCat.items.length > 0) categories.push(currentCat);
  }

  return categories;
}

(async () => {
  console.log('Fetching items page...');
  const html = await get('https://www.serebii.net/pokemonpokopia/items.shtml');
  console.log(`Got ${html.length} bytes\n`);

  console.log('Parsing...');
  const categories = parseItems(html);
  const totalItems = categories.reduce((s, c) => s + c.items.length, 0);
  console.log(`Found ${categories.length} categories, ${totalItems} items`);
  categories.forEach(c => console.log(`  ${c.name}: ${c.items.length}`));

  fs.writeFileSync(OUT_JSON, JSON.stringify(categories, null, 2));
  console.log(`\nSaved JSON → ${path.basename(OUT_JSON)}`);

  // Download images — only ones we don't already have
  console.log('\nDownloading images...');
  let ok = 0, skip = 0, fail = 0;
  const allItems = categories.flatMap(c => c.items);

  for (const item of allItems) {
    const url = `https://www.serebii.net/pokemonpokopia/items/${item.slug}.png`;
    const dest = path.join(IMG_DIR, `${item.slug}.png`);
    const result = await download(url, dest);
    if (result === 'ok') ok++;
    else if (result === 'skip') skip++;
    else { fail++; console.log(`  ✗ ${item.slug}: ${result}`); }
    await sleep(60);
  }

  console.log(`\nImages: ${ok} new, ${skip} existing, ${fail} failed`);
  console.log('\n✅ Done!');
})();
