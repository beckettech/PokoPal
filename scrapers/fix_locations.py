import json, re

# Load locations.json
with open('src/data/scraped/locations.json') as f:
    locations = json.load(f)

pokemon_loc_map = {}
for loc in locations:
    for p in loc.get('pokemon', []):
        slug = p['slug']
        if loc['name'] not in pokemon_loc_map.get(slug, []):
            pokemon_loc_map.setdefault(slug, []).append(loc['name'])

# Load habitats.json
with open('src/data/scraped/habitats.json') as f:
    habitats = json.load(f)

pokemon_habitat_loc_map = {}
for h in habitats:
    h_locs = h.get('locations', [])
    for p in h.get('pokemon', []):
        slug = p['slug'].lower()
        for loc_name in h_locs:
            if loc_name not in pokemon_habitat_loc_map.get(slug, []):
                pokemon_habitat_loc_map.setdefault(slug, []).append(loc_name)

# Merge
def get_locs(slug):
    return list(dict.fromkeys(pokemon_loc_map.get(slug, []) + pokemon_habitat_loc_map.get(slug, [])))

# Read file and do simple string replacements for known Pokemon
with open('src/lib/pokemon-data.ts') as f:
    content = f.read()

# Find Pokemon with empty locations by matching the pattern more carefully
# Each entry ends with }, so we need to handle nested braces
# Simpler: just find `name: "X"` followed eventually by `locations: []` and replace

updates = 0
no_data = []

# Parse entries properly - split by the top-level entries
# Each entry starts with { id: and ends with }
lines = content.split('\n')
i = 0
changes = []  # (name, new_locations_str)

# Collect all entries with their line ranges
entries = []
entry_start = None
brace_depth = 0
for i, line in enumerate(lines):
    if '{ id:' in line or (entry_start is None and line.strip().startswith('{ id:')):
        if entry_start is None:
            entry_start = i
            brace_depth = 0
    if entry_start is not None:
        brace_depth += line.count('{') - line.count('}')
        if brace_depth <= 0:
            entries.append((entry_start, i))
            entry_start = None

for start, end in entries:
    entry_text = '\n'.join(lines[start:end+1])
    
    if 'locations: []' not in entry_text:
        continue
    
    name_match = re.search(r'name:\s*"([^"]+)"', entry_text)
    if not name_match:
        continue
    name = name_match.group(1)
    
    slug = name.lower().replace(' ', '-').replace("'", '').replace('.', '')
    locs = get_locs(slug)
    
    if locs:
        locs_str = ', '.join(f'"{l}"' for l in locs)
        changes.append((start, end, name, locs_str))
        updates += 1
        print(f"  ✅ {name}: {locs}")
    else:
        no_data.append(name)
        print(f"  ❌ {name}: NO DATA")

# Apply changes in reverse order to preserve line numbers
for start, end, name, locs_str in reversed(changes):
    entry_text = '\n'.join(lines[start:end+1])
    new_text = entry_text.replace('locations: []', f'locations: [{locs_str}]', 1)
    lines[start:end+1] = new_text.split('\n')

content = '\n'.join(lines)

print(f"\nUpdated: {updates}, Still empty: {len(no_data)}")

with open('src/lib/pokemon-data.ts', 'w') as f:
    f.write(content)
