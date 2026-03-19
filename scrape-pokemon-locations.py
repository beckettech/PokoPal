#!/usr/bin/env python3
"""
Scrape Pokemon location data from Serebii Pokopia pages.
"""
import re
import json
import subprocess
import time
from collections import defaultdict

# The 6 main locations
LOCATIONS = [
    "Withered Wastelands",
    "Bleak Beach",
    "Rocky Ridges",
    "Sparkling Skylands",
    "Palette Town",
    "Cloud Island"
]

# URL patterns for locations
LOCATION_URLS = {
    "Withered Wastelands": "witheredwastelands",
    "Bleak Beach": "bleakbeach",
    "Rocky Ridges": "rockyridges",
    "Sparkling Skylands": "sparklingskylands",
    "Palette Town": "palettetown",
    "Cloud Island": "cloudisland"
}

def fetch_page(url):
    """Fetch a page using curl and convert encoding."""
    try:
        result = subprocess.run(
            ['curl', '-sL', url],
            capture_output=True,
            timeout=30
        )
        # Try to decode with latin-1 and convert to UTF-8
        try:
            content = result.stdout.decode('utf-8')
        except:
            content = result.stdout.decode('latin-1')
        return content
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""

def extract_pokemon_urls():
    """Extract all Pokemon pokedex URLs from the main page."""
    url = "https://www.serebii.net/pokemonpokopia/availablepokemon.shtml"
    content = fetch_page(url)
    
    # Find all pokedex URLs (exclude specialty pages)
    pattern = r'href="/pokemonpokopia/pokedex/([a-z0-9\-]+)\.shtml"'
    matches = re.findall(pattern, content.lower())
    
    # Filter out specialty pages
    pokemon_urls = set()
    for match in matches:
        if not match.startswith('specialty'):
            pokemon_urls.add(match)
    
    return sorted(pokemon_urls)

def extract_pokemon_name(url_path):
    """Convert URL path to Pokemon name."""
    # Convert kebab-case to Title Case
    name = url_path.replace('-', ' ').title()
    # Fix some special cases
    name = name.replace('Mr Mime', 'Mr. Mime')
    name = name.replace('Mime Jr', 'Mime Jr.')
    name = name.replace('Farfetch D', "Farfetch'd")
    name = name.replace('Porygon Z', 'Porygon-Z')
    name = name.replace('Porygon2', 'Porygon2')
    name = name.replace('Ho Oh', 'Ho-Oh')
    name = name.replace('Professor Tangrowth', 'Professor Tangrowth')
    return name

def extract_locations_from_page(content):
    """Extract locations from a Pokemon's pokedex page."""
    locations = []
    
    # Look for location links
    for loc_name, loc_url in LOCATION_URLS.items():
        if f'locations/{loc_url}.shtml' in content.lower():
            locations.append(loc_name)
    
    return locations

def main():
    print("Extracting Pokemon URLs...")
    pokemon_urls = extract_pokemon_urls()
    print(f"Found {len(pokemon_urls)} Pokemon")
    
    # Initialize location mapping
    location_mapping = defaultdict(list)
    
    # Fetch each Pokemon's page and extract locations
    for i, pokemon_url in enumerate(pokemon_urls):
        url = f"https://www.serebii.net/pokemonpokopia/pokedex/{pokemon_url}.shtml"
        print(f"[{i+1}/{len(pokemon_urls)}] Fetching {pokemon_url}...")
        
        content = fetch_page(url)
        pokemon_name = extract_pokemon_name(pokemon_url)
        locations = extract_locations_from_page(content)
        
        if locations:
            print(f"  {pokemon_name}: {', '.join(locations)}")
            for loc in locations:
                location_mapping[loc].append(pokemon_name)
        else:
            print(f"  {pokemon_name}: No locations found")
        
        # Small delay to be polite
        time.sleep(0.1)
    
    # Sort the lists
    for loc in location_mapping:
        location_mapping[loc].sort()
    
    # Convert to regular dict for JSON
    result = dict(location_mapping)
    
    # Ensure all 6 locations are present
    for loc in LOCATIONS:
        if loc not in result:
            result[loc] = []
    
    # Write to file
    output_path = "/home/z/my-project/pokemon-locations.json"
    with open(output_path, 'w') as f:
        json.dump(result, f, indent=2)
    
    print(f"\nWrote results to {output_path}")
    
    # Print summary
    print("\nSummary:")
    for loc in LOCATIONS:
        count = len(result.get(loc, []))
        print(f"  {loc}: {count} Pokemon")

if __name__ == "__main__":
    main()
