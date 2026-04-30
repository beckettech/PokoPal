#!/usr/bin/env python3
"""
Script to fetch Pokemon location data from Serebii for Pokemon Pokopia.
Continues from where we left off.
"""

import json
import subprocess
import re
import os
import time
from collections import defaultdict

# Configuration
INPUT_FILE = "/home/z/my-project/pokemon-locations.json"
OUTPUT_FILE = "/home/z/my-project/correct-locations.json"
BASE_URL = "https://www.serebii.net/pokemonpokopia/pokedex/{name}.shtml"
TEMP_OUTPUT = "/home/z/my-project/temp-pokemon-fetch.json"

KEY_LOCATIONS = [
    "Palette Town",
    "Cloud Island",
    "Withered Wastelands",
    "Bleak Beach",
    "Rocky Ridges",
    "Sparkling Skylands"
]

def fetch_pokemon_page(pokemon_name):
    url = BASE_URL.format(name=pokemon_name.lower())
    try:
        result = subprocess.run(
            ['z-ai', 'function', '-n', 'page_reader', '-a', f'{{"url": "{url}"}}', '-o', TEMP_OUTPUT],
            capture_output=True,
            text=True,
            timeout=30
        )
        if result.returncode != 0:
            return None
        with open(TEMP_OUTPUT, 'r') as f:
            data = json.load(f)
        if data.get('code') != 200:
            return None
        return data.get('data', {}).get('html', '')
    except:
        return None

def extract_locations(html):
    if not html:
        return []
    locations = []
    location_pattern = r'<b>Location</b>:(.*?)(?:</td>|<b>|$)'
    match = re.search(location_pattern, html, re.DOTALL | re.IGNORECASE)
    if match:
        location_section = match.group(1)
        link_pattern = r'<a href="/pokemonpokopia/locations/[^"]+"><u>([^<]+)</u></a>'
        location_matches = re.findall(link_pattern, location_section)
        for loc in location_matches:
            loc = loc.strip()
            if loc:
                locations.append(loc)
    return locations

def main():
    print("Pokemon Location Scraper - Continuing from previous run")
    
    # Load existing data
    with open(OUTPUT_FILE, 'r') as f:
        existing = json.load(f)
    pokemon_to_locations = existing.get('pokemon_to_locations', {})
    location_to_pokemon = defaultdict(list, existing.get('location_to_pokemon', {}))
    
    # Load all Pokemon names from input file
    with open(INPUT_FILE, 'r') as f:
        input_data = json.load(f)
    all_names = set()
    for location, pokemon_list in input_data.items():
        all_names.update(pokemon_list)
    
    # Pokemon to process next (not already processed)
    more_pokemon = [
        'Togepi', 'Togekiss', 'Grookey', 'Sobble', 'Fuecoco', 'Quaxly',
        'Inteleon', 'Rillaboom', 'Skeledirge', 'Quaquaval',
        'Clefairy', 'Clefable', 'Wigglytuff', 'Meowth', 'Persian',
        'Psyduck', 'Golduck', 'Geodude', 'Graveler', 'Golem'
    ]
    
    # Filter to names not yet processed
    to_process = [p for p in more_pokemon if p in all_names and p not in pokemon_to_locations]
    
    print(f"Processing {len(to_process)} more Pokemon...")
    print(f"Current count: {len(pokemon_to_locations)} Pokemon")
    
    for i, pokemon in enumerate(to_process):
        print(f"  [{i+1}] {pokemon}...", end=" ", flush=True)
        html = fetch_pokemon_page(pokemon)
        if html:
            locations = extract_locations(html)
            pokemon_to_locations[pokemon] = locations
            for loc in locations:
                if pokemon not in location_to_pokemon[loc]:
                    location_to_pokemon[loc].append(pokemon)
            print(f"-> {', '.join(locations) if locations else 'None'}")
        else:
            pokemon_to_locations[pokemon] = []
            print("-> FAILED")
        time.sleep(0.1)
    
    # Save results
    result = {
        "pokemon_to_locations": {k: sorted(v) for k, v in pokemon_to_locations.items()},
        "location_to_pokemon": {k: sorted(v) for k, v in dict(location_to_pokemon).items()}
    }
    
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(result, f, indent=2)
    
    print(f"\nSaved to {OUTPUT_FILE}")
    print(f"Total processed: {len(pokemon_to_locations)}, Locations: {len(location_to_pokemon)}")
    
    # Print location summary
    print("\nLocation summary:")
    for loc in sorted(location_to_pokemon.keys()):
        key_marker = " [KEY]" if loc in KEY_LOCATIONS else ""
        print(f"  - {loc}: {len(location_to_pokemon[loc])} Pokemon{key_marker}")
    
    if os.path.exists(TEMP_OUTPUT):
        os.remove(TEMP_OUTPUT)

if __name__ == "__main__":
    main()
