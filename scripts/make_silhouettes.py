#!/usr/bin/env python3
"""
make_silhouettes.py
Converts Pokemon sprites → colored silhouettes (average color fill, preserving alpha).
Run: python3 scripts/make_silhouettes.py
"""

import os
import sys

try:
    from PIL import Image
    import numpy as np
except ImportError:
    print("Installing Pillow and numpy...")
    os.system(f"{sys.executable} -m pip install Pillow numpy --quiet")
    from PIL import Image
    import numpy as np

POKEMON_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'pokemon')
OUT_DIR = POKEMON_DIR  # overwrite in-place (originals already committed to git)

files = sorted([f for f in os.listdir(POKEMON_DIR) if f.endswith('.png')])
print(f"Processing {len(files)} sprites...")

ok = 0
skip = 0
errors = []

for fname in files:
    src = os.path.join(POKEMON_DIR, fname)
    try:
        img = Image.open(src).convert('RGBA')
        data = np.array(img, dtype=np.float32)  # H x W x 4

        alpha = data[:, :, 3]
        mask = alpha > 30  # non-transparent pixels

        if mask.sum() == 0:
            skip += 1
            continue

        # Compute average color of visible pixels
        r = data[:, :, 0][mask].mean()
        g = data[:, :, 1][mask].mean()
        b = data[:, :, 2][mask].mean()

        # Build output: fill visible pixels with avg color, keep alpha
        out = np.zeros_like(data)
        out[:, :, 0] = np.where(mask, r, 0)
        out[:, :, 1] = np.where(mask, g, 0)
        out[:, :, 2] = np.where(mask, b, 0)
        out[:, :, 3] = data[:, :, 3]  # preserve original alpha

        result = Image.fromarray(out.astype(np.uint8), 'RGBA')
        result.save(src, 'PNG', optimize=True)
        ok += 1

        if ok % 50 == 0:
            print(f"  {ok}/{len(files)} done...")

    except Exception as e:
        errors.append((fname, str(e)))

print(f"\nDone: {ok} converted, {skip} skipped (empty), {len(errors)} errors")
if errors:
    for f, e in errors:
        print(f"  ERROR {f}: {e}")
