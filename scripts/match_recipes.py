#!/usr/bin/env python3
"""Match scraped recipes to items.json and create public/recipes.json"""
import json, re, html

with open('public/items.json') as f:
    items_data = json.load(f)

def normalize(s):
    """Normalize for matching: lowercase, decode entities, strip extra spaces"""
    s = html.unescape(s).lower().strip()
    s = re.sub(r'\s+', ' ', s)
    return s

with open('src/data/scraped/recipes.json') as f:
    recipes = json.load(f)

# Build lookup by normalized name
recipe_lookup = {}
for r in recipes:
    key = normalize(r["name"])
    recipe_lookup[key] = r

# Match items to recipes
matched = 0
unmatched = []
recipes_map = {}  # slug -> recipe

for cat in items_data:
    for item in cat.get('items', []):
        methods = item.get('methods', [])
        if not any('Craft from recipe' in m for m in methods):
            continue
        
        item_key = normalize(item['name'])
        recipe = recipe_lookup.get(item_key)
        
        # Fuzzy: try removing parentheticals
        if not recipe:
            base = re.sub(r'\s*\(.*?\)\s*', ' ', item_key).strip()
            if base in recipe_lookup:
                recipe = recipe_lookup[base]
        
        if recipe:
            matched += 1
            recipes_map[item['slug']] = {
                "name": recipe['name'],
                "category": recipe['category'],
                "locations": recipe['locations'],
                "requirements": recipe['requirements']
            }
        else:
            unmatched.append(item['name'])

print(f"Matched: {matched}/370")
if unmatched:
    print(f"Unmatched ({len(unmatched)}):")
    for u in unmatched[:20]:
        print(f"  {u}")

with open('public/recipes.json', 'w') as f:
    json.dump(recipes_map, f, indent=2)

print(f"Wrote {len(recipes_map)} entries to public/recipes.json")
