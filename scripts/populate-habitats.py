#!/usr/bin/env python3
import json, re

# 1. Build reverse mapping from habitats.json
with open("src/data/scraped/habitats.json") as f:
    habitats = json.load(f)

reverse = {}  # lowercase pokemon name -> [habitat names]
for h in habitats:
    for p in h["pokemon"]:
        key = p["name"].lower()
        reverse.setdefault(key, []).append(h["name"])

print(f"Built mapping for {len(reverse)} pokemon")

# 2. Parse pokemon-data.ts
with open("src/lib/pokemon-data.ts") as f:
    content = f.read()

updated = 0
not_found = 0

# Match each pokemon entry line
pattern = re.compile(r'(name: "([^"]+)", types: \[[^\]]*\], habitats: )\[\](, image:)')

def replace_empty(match):
    global updated, not_found
    prefix = match.group(1)
    name = match.group(2)
    suffix = match.group(3)
    key = name.lower()
    if key in reverse:
        updated += 1
        habs = reverse[key]
        return f'{prefix}{json.dumps(habs)}{suffix}'
    else:
        not_found += 1
        return match.group(0)

content = pattern.sub(replace_empty, content)

print(f"Updated {updated} pokemon, {not_found} not found in habitats data")

with open("src/lib/pokemon-data.ts", "w") as f:
    f.write(content)

print("Done!")
