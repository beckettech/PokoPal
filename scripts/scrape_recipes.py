#!/usr/bin/env python3
import json, re, os

with open('/tmp/crafting.html', 'r', encoding='latin1') as f:
    html = f.read()

# Category markers
cat_markers = [
    ("furniture", 'name="furniture"'),
    ("misc", 'name="misc."'),
    ("outdoor", 'name="outdoor"'),
    ("utilities", 'name="utilities"'),
    ("buildings", 'name="buildings"'),
    ("blocks", 'name="blocks"'),
    ("other", 'name="other"'),
]

recipes = []

for i, (cat, marker) in enumerate(cat_markers):
    start = html.index(marker)
    end = html.index(cat_markers[i+1][1]) if i+1 < len(cat_markers) else len(html)
    section = html[start:end]
    
    # Find all item name cells: </a></td><td class="cen"><a href="items/SLUG">NAME</u></a>
    name_pattern = re.compile(r'</a></td>\s*<td class="cen"><a href="items/([^"]+)">(.*?)</(?:u|a)></a>')
    
    for match in name_pattern.finditer(section):
        raw_name = match.group(2).strip()
        if '<' in raw_name or not raw_name:
            continue
        
        # Find surrounding <tr>...</tr>
        row_start = section.rfind('<tr>', 0, match.start())
        row_end = section.find('</tr>', match.end())
        if row_start == -1 or row_end == -1:
            continue
        row = section[row_start:row_end]
        
        # Locations: first <td class="fooinfo">
        locs = re.findall(r'<td class="fooinfo">(.*?)</td>', row, re.DOTALL)
        locations = ""
        if locs:
            locations = re.sub(r'<[^>]+>', ' ', locs[0]).strip()
            locations = re.sub(r'\s+', ' ', locations)
        
        # Requirements: <u>NAME</u></a> * QTY
        req_matches = re.findall(r'<u>([^<]+)</u></a>\s*\*\s*(\d+)', row)
        
        # Decode HTML entities
        def decode_entities(s):
            s = s.replace('&eacute;', 'é').replace('&Eacute;', 'É')
            s = s.replace('&eacute', 'é')
            s = s.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
            s = s.replace('&#39;', "'").replace('&quot;', '"')
            return s
        requirements = [{"name": decode_entities(m[0].strip()), "quantity": int(m[1])} for m in req_matches]
        
        if requirements:
            recipes.append({
                "name": decode_entities(raw_name),
                "category": cat,
                "slug": match.group(1).replace('.shtml', ''),
                "locations": decode_entities(locations),
                "requirements": requirements
            })

# Dedupe
seen = {}
for r in recipes:
    key = r["name"].lower()
    if key not in seen:
        seen[key] = r
recipes = list(seen.values())
print(f"Extracted {len(recipes)} recipes")
for r in recipes[:5]:
    print(f"  {r['name']}: {r['requirements']}")

os.makedirs('src/data/scraped', exist_ok=True)
with open('src/data/scraped/recipes.json', 'w') as f:
    json.dump(recipes, f, indent=2)
print("Done!")
