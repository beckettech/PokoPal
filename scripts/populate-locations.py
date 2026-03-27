import json, re

with open('src/data/scraped/locations.json') as f:
    locations = json.load(f)

reverse = {}
for loc in locations:
    for p in loc['pokemon']:
        reverse.setdefault(p['name'].lower(), []).append(loc['name'])

with open('src/lib/pokemon-data.ts') as f:
    content = f.read()

count = 0
def replacer(m):
    global count
    pname = m.group(1).lower()
    if pname in reverse:
        count += 1
        locs = json.dumps(reverse[pname])
        return f'locations: {locs}'
    return m.group(0)

# Simpler: just replace locations: [] within each object line, but we need the name context
# Match name then later locations: []
pattern = r'(name: "([^"]+)".*?)locations: \[\]'

def replacer2(m):
    global count
    pname = m.group(2).lower()
    if pname in reverse:
        count += 1
        locs = json.dumps(reverse[pname])
        return f'{m.group(1)}locations: {locs}'
    return m.group(0)

content = re.sub(pattern, replacer2, content, flags=re.DOTALL)

with open('src/lib/pokemon-data.ts', 'w') as f:
    f.write(content)

print(f"Updated {count} Pokemon with location data")
