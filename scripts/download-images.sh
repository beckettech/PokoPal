#!/bin/bash
# Download all Pokopia pokemon images from Serebii and save locally
# Run from project root: bash scripts/download-images.sh

mkdir -p public/pokemon

# Extract all image URLs from the generated pokemon-data.ts
grep -oP 'https://www\.serebii\.net/pokemonpokopia/pokemon/[^"]+' src/lib/pokemon-data.ts | sort -u | while read url; do
  filename=$(basename "$url")
  dest="public/pokemon/$filename"
  if [ ! -f "$dest" ]; then
    echo "Downloading $filename..."
    curl -s -o "$dest" "$url"
    sleep 0.1
  else
    echo "Already have $filename"
  fi
done

echo "Done! $(ls public/pokemon/*.png 2>/dev/null | wc -l) images downloaded"
