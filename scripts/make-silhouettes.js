#!/usr/bin/env node
/**
 * make-silhouettes.js
 * Converts Pokémon sprites → colored silhouettes using the average color of visible pixels.
 * Uses Sharp (already installed). Overwrites files in public/pokemon/.
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const POKEMON_DIR = path.join(__dirname, '..', 'public', 'pokemon');

async function avgColorSilhouette(filePath) {
  const img = sharp(filePath).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info; // channels = 4 (RGBA)

  let rSum = 0, gSum = 0, bSum = 0, count = 0;
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a > 30) {
      rSum += data[i];
      gSum += data[i + 1];
      bSum += data[i + 2];
      count++;
    }
  }

  if (count === 0) return null; // fully transparent

  const r = Math.round(rSum / count);
  const g = Math.round(gSum / count);
  const b = Math.round(bSum / count);

  // Build new pixel buffer: fill visible pixels with avg color, keep alpha
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a > 30) {
      out[i]     = r;
      out[i + 1] = g;
      out[i + 2] = b;
      out[i + 3] = a;
    }
    // transparent pixels stay 0
  }

  await sharp(out, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 7 })
    .toFile(filePath);

  return [r, g, b];
}

(async () => {
  const files = fs.readdirSync(POKEMON_DIR).filter(f => f.endsWith('.png')).sort();
  console.log(`Processing ${files.length} sprites...\n`);

  let ok = 0, skipped = 0, errors = [];

  for (const fname of files) {
    const fp = path.join(POKEMON_DIR, fname);
    try {
      const color = await avgColorSilhouette(fp);
      if (!color) { skipped++; continue; }
      ok++;
      if (ok % 50 === 0) console.log(`  ${ok}/${files.length}...`);
    } catch (e) {
      errors.push(`${fname}: ${e.message}`);
    }
  }

  console.log(`\nDone! ${ok} silhouettes generated, ${skipped} skipped, ${errors.length} errors`);
  if (errors.length) errors.forEach(e => console.log('  ERROR:', e));
})();
