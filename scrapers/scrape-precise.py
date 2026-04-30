#!/usr/bin/env python3
"""
Scrape Pokemon location data from Serebii Pokopia pages - optimized version.
Only extracts locations from the main content area, not the navigation sidebar.
"""
import re
import json
import subprocess
import sys
from collections import defaultdict

# The 6 main locations with their URL patterns
LOCATIONS = {
    "Withered Wastelands": "witheredwastelands",
    "Bleak Beach": "bleakbeach",
    "Rocky Ridges": "rockyridges",
    "Sparkling Skylands": "sparklingskylands",
    "Palette Town": "palettetown",
    "Cloud Island": "cloudisland"
}

def fetch_page(url):
    """Fetch a page using curl."""
    try:
        result = subprocess.run(
            ['curl', '-sL', '-m', '15', url],
            capture_output=True,
            timeout=20
        )
        try:
            return result.stdout.decode('utf-8')
        except:
            return result.stdout.decode('latin-1')
    except:
        return ""

def extract_locations_from_content(content):
    """Extract locations only from the Habitats & Locations section."""
    # Find the Habitats & Locations section
    # The section contains <u>Location Name</u> patterns
    locations = []
    
    # Extract content between "Habitats & Locations" and the end of that table
    # or use a more specific pattern
    pattern = r'<a href="/pokemonpokopia/locations/([a-z]+)\.shtml"><u>([^<]+)</u></a>'
    
    # Find all matches
    for match in re.finditer(pattern, content, re.IGNORECASE):
        loc_url = match.group(1).lower()
        loc_name = match.group(2).strip()
        
        # Map URL to our location names
        for name, url in LOCATIONS.items():
            if url == loc_url:
                if name not in locations:
                    locations.append(name)
                break
    
    return locations

def main():
    # Get list of Pokemon URLs
    print("Fetching Pokemon list...", flush=True)
    content = fetch_page("https://www.serebii.net/pokemonpokopia/availablepokemon.shtml")
    
    # Find all Pokemon pokedex URLs (exclude specialty)
    pattern = r'href="/pokemonpokopia/pokedex/([a-z0-9\-]+)\.shtml"'
    all_urls = re.findall(pattern, content.lower())
    pokemon_urls = sorted(set(u for u in all_urls if not u.startswith('specialty')))
    
    print(f"Found {len(pokemon_urls)} Pokemon to process", flush=True)
    
    # Initialize mapping
    location_mapping = {loc: [] for loc in LOCATIONS}
    
    # Process each Pokemon
    for i, pokemon_url in enumerate(pokemon_urls):
        # Convert URL to name
        name = pokemon_url.replace('-', ' ').title()
        # Fix special cases
        name = name.replace('Mr Mime', 'Mr. Mime')
        name = name.replace('Mime Jr', 'Mime Jr.')
        name = name.replace('Farfetch D', "Farfetch'd")
        name = name.replace('Ho Oh', 'Ho-Oh')
        
        # Fetch Pokemon page
        url = f"https://www.serebii.net/pokemonpokopia/pokedex/{pokemon_url}.shtml"
        page = fetch_page(url)
        
        # Extract locations from content
        found_locs = extract_locations_from_content(page)
        
        # Add to mapping
        for loc in found_locs:
            location_mapping[loc].append(name)
        
        print(f"[{i+1}/{len(pokemon_urls)}] {name}: {', '.join(found_locs) if found_locs else 'None'}", flush=True)
    
    # Sort lists
    for loc in location_mapping:
        location_mapping[loc].sort()
    
    # Write to file
    output_path = "/home/z/my-project/pokemon-locations.json"
    with open(output_path, 'w') as f:
        json.dump(location_mapping, f, indent=2)
    
    print(f"\nWrote results to {output_path}")
    print("\nSummary:")
    for loc in LOCATIONS:
        print(f"  {loc}: {len(location_mapping[loc])} Pokemon")

if __name__ == "__main__":
    main()
