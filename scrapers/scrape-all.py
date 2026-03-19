#!/usr/bin/env python3
"""
Scrape all Pokopia data from Serebii:
- Habitats with images and Pokemon lists
- Map locations with Pokemon lists  
- Pokemon specialties
- Dream Island items
"""
import urllib.request, re, json, time, os

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
BASE = 'https://www.serebii.net'

def fetch(url):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as r:
            return r.read().decode('latin-1')
    except Exception as e:
        print(f"  Error fetching {url}: {e}")
        return ''

def scrape_habitats():
    print("=== Scraping Habitats ===")
    html = fetch(f'{BASE}/pokemonpokopia/habitats.shtml')
    
    habitats = []
    # Find habitat links - they follow pattern /pokemonpokopia/habitatdex/NAME.shtml
    habitat_links = re.findall(r'href="(/pokemonpokopia/habitatdex/[^"]+\.shtml)"[^>]*>([^<]+)<', html)
    
    seen = set()
    for path, name in habitat_links:
        if path in seen or 'habitatdex' not in path:
            continue
        seen.add(path)
        name = name.strip()
        if not name:
            continue
        
        # Scrape individual habitat page
        hab_html = fetch(f'{BASE}{path}')
        time.sleep(0.3)
        
        # Get image
        img_match = re.search(r'<img[^>]+src="(/pokemonpokopia/habitatdex/\d+\.png)"', hab_html)
        image = f'{BASE}{img_match.group(1)}' if img_match else ''
        
        # Get description
        desc_match = re.search(r'<td class="fooinfo"[^>]*>\s*([^<]+)', hab_html)
        description = desc_match.group(1).strip() if desc_match else ''
        
        # Get Pokemon in this habitat
        pokemon_matches = re.findall(r'/pokemonpokopia/pokedex/(\w+)\.shtml"[^>]*>[^<]*<[^>]+>([^<]+)<', hab_html)
        pokemon = list(dict.fromkeys([name.strip() for _, name in pokemon_matches if name.strip()]))
        
        # Get build items
        items_section = re.search(r'Build Items(.*?)</table>', hab_html, re.DOTALL)
        items = []
        if items_section:
            items = re.findall(r'<td[^>]*>([^<]+)</td>', items_section.group(1))
            items = [i.strip() for i in items if i.strip() and len(i.strip()) > 1]
        
        # Get location
        loc_match = re.search(r'<b>Location</b>:(.*?)</td>', hab_html, re.DOTALL)
        locations = []
        if loc_match:
            locations = re.findall(r'<u>(.*?)</u>', loc_match.group(1))
        
        habitat_id = path.split('/')[-1].replace('.shtml', '')
        
        habitats.append({
            'id': habitat_id,
            'name': name,
            'image': image,
            'description': description,
            'pokemon': pokemon,
            'buildItems': items,
            'locations': locations,
            'url': f'{BASE}{path}'
        })
        print(f"  {name}: {len(pokemon)} Pokemon, image: {bool(image)}")
    
    return habitats

def scrape_locations():
    print("\n=== Scraping Locations ===")
    html = fetch(f'{BASE}/pokemonpokopia/locations.shtml')
    
    locations = []
    # Find location links
    loc_links = re.findall(r'href="(/pokemonpokopia/locations/[^"]+\.shtml)"[^>]*>([^<]+)<', html)
    
    seen = set()
    for path, name in loc_links:
        if path in seen:
            continue
        seen.add(path)
        name = name.strip()
        if not name or name.startswith('-'):
            continue
        
        loc_html = fetch(f'{BASE}{path}')
        time.sleep(0.3)
        
        # Get image
        img_match = re.search(r'<img[^>]+src="(/pokemonpokopia/locations/[^"]+\.jpg)"', loc_html)
        image = f'{BASE}{img_match.group(1)}' if img_match else ''
        
        # Get Pokemon
        pokemon_matches = re.findall(r'/pokemonpokopia/pokedex/(\w+)\.shtml"[^>]*>.*?<b>([^<]+)</b>', loc_html, re.DOTALL)
        pokemon = list(dict.fromkeys([name.strip() for _, name in pokemon_matches if name.strip()]))
        
        locations.append({
            'id': path.split('/')[-1].replace('.shtml', ''),
            'name': name,
            'image': image,
            'pokemon': pokemon,
            'url': f'{BASE}{path}'
        })
        print(f"  {name}: {len(pokemon)} Pokemon")
    
    return locations

def scrape_specialties():
    print("\n=== Scraping Specialties ===")
    html = fetch(f'{BASE}/pokemonpokopia/specialty.shtml')
    
    specialties = {}
    # Find all specialty sections
    sections = re.findall(r'<h2>([^<]+)</h2>(.*?)(?=<h2>|$)', html, re.DOTALL)
    
    for specialty_name, section_html in sections:
        specialty_name = specialty_name.strip()
        
        # Get icon image
        icon_match = re.search(r'<img[^>]+src="(/pokemonpokopia/specialty/[^"]+)"', section_html)
        icon = f'{BASE}{icon_match.group(1)}' if icon_match else ''
        
        # Get description  
        desc_match = re.search(r'<td[^>]*>([^<]{20,})</td>', section_html)
        description = desc_match.group(1).strip() if desc_match else ''
        
        # Get Pokemon with this specialty
        pokemon_matches = re.findall(r'/pokemonpokopia/pokedex/(\w+)\.shtml"[^>]*>.*?<b>([^<]+)</b>', section_html, re.DOTALL)
        pokemon = list(dict.fromkeys([name.strip() for _, name in pokemon_matches if name.strip()]))
        
        specialties[specialty_name] = {
            'name': specialty_name,
            'icon': icon,
            'description': description,
            'pokemon': pokemon
        }
        print(f"  {specialty_name}: {len(pokemon)} Pokemon")
    
    return specialties

def main():
    os.makedirs('src/data/scraped', exist_ok=True)
    
    # Scrape all data
    habitats = scrape_habitats()
    locations = scrape_locations()
    specialties = scrape_specialties()
    
    # Save
    with open('src/data/scraped/habitats.json', 'w') as f:
        json.dump(habitats, f, indent=2)
    print(f"\nSaved {len(habitats)} habitats")
    
    with open('src/data/scraped/locations.json', 'w') as f:
        json.dump(locations, f, indent=2)
    print(f"Saved {len(locations)} locations")
    
    with open('src/data/scraped/specialties.json', 'w') as f:
        json.dump(specialties, f, indent=2)
    print(f"Saved {len(specialties)} specialties")
    
    print("\nDone!")

if __name__ == '__main__':
    main()
