#!/usr/bin/env python3
"""Scrape all Pokopia data from Serebii - fixed version"""
import urllib.request, re, json, time, os

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
BASE = 'https://www.serebii.net'

def fetch(url):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as r:
            return r.read().decode('latin-1')
    except Exception as e:
        print(f"  Error: {e}", flush=True)
        return ''

def scrape_habitats():
    print("=== Scraping Habitats ===", flush=True)
    html = fetch(f'{BASE}/pokemonpokopia/habitats.shtml')
    
    # Parse the table: #001, image, name, description
    rows = re.findall(
        r'#(\d+)</td>\s*<td[^>]*><a href="(habitatdex/[^"]+\.shtml)"><img src="(habitatdex/[^"]+\.png)"[^>]*alt="([^"]+)"',
        html
    )
    
    habitats = []
    for num, path, img_path, name in rows:
        hab_url = f'{BASE}/pokemonpokopia/{path}'
        img_url = f'{BASE}/pokemonpokopia/{img_path}'
        
        # Get description from same row
        desc_match = re.search(
            re.escape(f'#{num}') + r'.*?fooinfo">[^<]*<[^>]+>[^<]+</[^>]+></td>\s*<td[^>]*>([^<]+)',
            html, re.DOTALL
        )
        description = desc_match.group(1).strip() if desc_match else ''
        
        # Scrape individual habitat page for Pokemon list
        print(f"  #{num} {name}...", flush=True)
        hab_html = fetch(hab_url)
        time.sleep(0.25)
        
        # Get Pokemon in this habitat - they link to /pokemonpokopia/pokedex/NAME.shtml
        pokemon_links = re.findall(r'href="(?:\.\./)?pokedex/([^"]+)\.shtml"[^>]*>(?:<[^>]+>)*([^<]+)', hab_html)
        pokemon = []
        seen_p = set()
        for pslug, pname in pokemon_links:
            pname = pname.strip()
            if pname and pname not in seen_p and len(pname) > 1:
                seen_p.add(pname)
                pokemon.append({'name': pname, 'slug': pslug})
        
        # Get locations
        loc_match = re.search(r'<b>Location</b>:(.*?)</td>', hab_html, re.DOTALL)
        locations = re.findall(r'<u>(.*?)</u>', loc_match.group(1)) if loc_match else []
        
        # Get build items
        items_match = re.search(r'Build Items?(.*?)</table>', hab_html, re.DOTALL | re.IGNORECASE)
        build_items = []
        if items_match:
            items_text = re.sub(r'<[^>]+>', ' ', items_match.group(1))
            items_text = re.sub(r'\s+', ' ', items_text).strip()
            build_items = [i.strip() for i in items_text.split(',') if i.strip() and len(i.strip()) > 1]
        
        habitats.append({
            'id': int(num),
            'slug': path.replace('habitatdex/', '').replace('.shtml', ''),
            'name': name,
            'image': img_url,
            'description': description,
            'pokemon': pokemon,
            'locations': locations,
            'buildItems': build_items
        })
    
    print(f"Total habitats: {len(habitats)}", flush=True)
    return habitats

def scrape_locations():
    print("\n=== Scraping Locations ===", flush=True)
    html = fetch(f'{BASE}/pokemonpokopia/locations.shtml')
    
    # Find location links
    loc_links = re.findall(r'href="(locations/[^"]+\.shtml)"', html)
    loc_links = list(dict.fromkeys(loc_links))  # deduplicate preserving order
    
    locations = []
    for path in loc_links:
        name_match = re.search(re.escape(path) + r'"[^>]*>([^<]+)<', html)
        name = name_match.group(1).strip() if name_match else path
        
        loc_url = f'{BASE}/pokemonpokopia/{path}'
        print(f"  {name}...", flush=True)
        loc_html = fetch(loc_url)
        time.sleep(0.25)
        
        # Get location image
        img_match = re.search(r'<img[^>]+src="(/pokemonpokopia/[^"]+(?:locations|maps)[^"]+\.(?:jpg|png))"', loc_html)
        image = f'{BASE}{img_match.group(1)}' if img_match else ''
        
        # Get description
        desc_match = re.search(r'<td class="fooinfo"[^>]*>\s*([^<]{20,})', loc_html)
        description = desc_match.group(1).strip() if desc_match else ''
        
        # Get Pokemon
        pokemon_links = re.findall(r'href="(?:\.\./)?pokedex/([^"]+)\.shtml"[^>]*>(?:<[^>]+>)*([^<]+)', loc_html)
        pokemon = []
        seen_p = set()
        for pslug, pname in pokemon_links:
            pname = pname.strip()
            if pname and pname not in seen_p and len(pname) > 1:
                seen_p.add(pname)
                pokemon.append({'name': pname, 'slug': pslug})
        
        locations.append({
            'id': path.replace('locations/', '').replace('.shtml', ''),
            'name': name,
            'image': image,
            'description': description,
            'pokemon': pokemon,
            'url': loc_url
        })
    
    print(f"Total locations: {len(locations)}", flush=True)
    return locations

def scrape_specialties():
    print("\n=== Scraping Specialties ===", flush=True)
    html = fetch(f'{BASE}/pokemonpokopia/specialty.shtml')
    
    specialties = []
    
    # Find specialty sections - each has an image and Pokemon table
    # Pattern: specialty name in header, icon image, Pokemon list
    sections = re.split(r'<tr>\s*<td[^>]*colspan[^>]*>', html)
    
    for section in sections:
        name_match = re.search(r'<b>([A-Za-z ]+)</b>', section)
        if not name_match:
            continue
        name = name_match.group(1).strip()
        if len(name) < 2 or name in ['Location', 'Time', 'Weather', 'Rarity']:
            continue
        
        # Get icon
        icon_match = re.search(r'src="(/pokemonpokopia/[^"]*specialty[^"]*\.(?:png|jpg|gif))"', section)
        icon = f'{BASE}{icon_match.group(1)}' if icon_match else ''
        
        # Get description
        desc_match = re.search(r'<td[^>]*>([A-Z][^<]{20,})<', section)
        description = desc_match.group(1).strip() if desc_match else ''
        
        # Get Pokemon
        pokemon_links = re.findall(r'href="(?:\.\./)?pokedex/([^"]+)\.shtml"[^>]*>(?:<[^>]+>)*([^<]+)', section)
        pokemon = []
        seen_p = set()
        for pslug, pname in pokemon_links:
            pname = pname.strip()
            if pname and pname not in seen_p and len(pname) > 1:
                seen_p.add(pname)
                pokemon.append({'name': pname, 'slug': pslug})
        
        if pokemon or icon:
            specialties.append({
                'name': name,
                'icon': icon,
                'description': description,
                'pokemon': pokemon
            })
            print(f"  {name}: {len(pokemon)} Pokemon, icon: {bool(icon)}", flush=True)
    
    print(f"Total specialties: {len(specialties)}", flush=True)
    return specialties

def main():
    os.makedirs('/home/beck/pokopia-guide/src/data/scraped', exist_ok=True)
    
    habitats = scrape_habitats()
    with open('/home/beck/pokopia-guide/src/data/scraped/habitats.json', 'w') as f:
        json.dump(habitats, f, indent=2)
    print(f"\nSaved {len(habitats)} habitats to src/data/scraped/habitats.json", flush=True)
    
    locations = scrape_locations()
    with open('/home/beck/pokopia-guide/src/data/scraped/locations.json', 'w') as f:
        json.dump(locations, f, indent=2)
    print(f"Saved {len(locations)} locations to src/data/scraped/locations.json", flush=True)
    
    specialties = scrape_specialties()
    with open('/home/beck/pokopia-guide/src/data/scraped/specialties.json', 'w') as f:
        json.dump(specialties, f, indent=2)
    print(f"Saved {len(specialties)} specialties to src/data/scraped/specialties.json", flush=True)

if __name__ == '__main__':
    main()
