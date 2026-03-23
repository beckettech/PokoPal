#!/usr/bin/env node
/**
 * add-outline.js
 * Adds a thin black outline around each Pokémon silhouette.
 * Works by dilating the alpha mask by N pixels, filling that ring with black,
 * then compositing the colored silhouette on top.
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const POKEMON_DIR = path.join(__dirname, '..', 'public', 'pokemon');
const OUTLINE_PX = 2; // thickness in pixels

function dilateAlpha(alpha, width, height, radius) {
  const out = new Uint8Array(alpha.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let maxA = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (dx * dx + dy * dy > radius * radius) continue;
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
          maxA = Math.max(maxA, alpha[ny * width + nx]);
        }
      }
      out[y * width + x] = maxA;
    }
  }
  return out;
}

async function addOutline(filePath) {
  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const pixels = data.length / 4;

  // Extract alpha channel
  const alpha = new Uint8Array(pixels);
  for (let i = 0; i < pixels; i++) alpha[i] = data[i * 4 + 3];

  // Dilate alpha to get outline mask
  const dilated = dilateAlpha(alpha, width, height, OUTLINE_PX);

  // Build output: black where dilated but not original, original color where alpha > 0
  const out = Buffer.alloc(data.length, 0);
  for (let i = 0; i < pixels; i++) {
    const origA = alpha[i];
    const dilA = dilated[i];
    const base = i * 4;

    if (origA > 30) {
      // Original silhouette pixel — keep color
      out[base]     = data[base];
      out[base + 1] = data[base + 1];
      out[base + 2] = data[base + 2];
      out[base + 3] = origA;
    } else if (dilA > 30) {
      // Outline ring — black
      out[base]     = 0;
      out[base + 1] = 0;
      out[base + 2] = 0;
      out[base + 3] = Math.min(255, dilA + 80); // solid outline
    }
  }

  await sharp(out, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 7 })
    .toFile(filePath);
}

(async () => {
  const files = fs.readdirSync(POKEMON_DIR).filter(f => f.endsWith('.png')).sort();
  console.log(`Adding ${OUTLINE_PX}px outline to ${files.length} sprites...`);

  let ok = 0, errors = [];
  for (const fname of files) {
    try {
      await addOutline(path.join(POKEMON_DIR, fname));
      ok++;
      if (ok % 50 === 0) console.log(`  ${ok}/${files.length}...`);
    } catch (e) {
      errors.push(`${fname}: ${e.message}`);
    }
  }

  console.log(`\nDone! ${ok} outlined, ${errors.length} errors`);
  if (errors.length) errors.forEach(e => console.log('  ERROR:', e));
})();
