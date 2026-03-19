#!/usr/bin/env python3
"""
Script to scrape Pokemon locations from Serebii and build correct mappings.
"""

import json
import re
import subprocess
import time
from pathlib import Path

# Pokemon names to fetch (lowercase for URL)
POKEMON_NAMES = [
    "bulbasaur", "ivysaur", "venusaur", "charmander", "charmeleon", "charizard",
    "squirtle", "wartortle", "blastoise", "caterpie", "metapod", "butterfree",
    "weedle", "kakuna", "beedrill", "pidgey", "pidgeotto", "pidgeot",
    "rattata", "raticate", "spearow", "fearow", "ekans", "arbok",
    "pikachu", "raichu", "sandshrew", "sandslash", "nidoranf", "nidorina",
    "nidoqueen", "nidoranm", "nidorino", "nidoking", "clefairy", "clefable",
    "vulpix", "ninetales", "jigglypuff", "wigglytuff", "zubat", "golbat",
    "oddish", "gloom", "vileplume", "paras", "parasect", "venonat",
    "venomoth", "diglett", "dugtrio", "meowth", "persian", "psyduck",
    "golduck", "mankey", "primeape", "growlithe", "arcanine", "poliwag",
    "poliwhirl", "poliwrath", "abra", "kadabra", "alakazam", "machop",
    "machoke", "machamp", "bellsprout", "weepinbell", "victreebel", "tentacool",
    "tentacruel", "geodude", "graveler", "golem", "ponyta", "rapidash",
    "slowpoke", "slowbro", "magnemite", "magneton", "farfetchd", "doduo",
    "dodrio", "seel", "dewgong", "grimer", "muk", "shellder", "cloyster",
    "gastly", "haunter", "gengar", "onix", "drowzee", "hypno",
    "krabby", "kingler", "voltorb", "electrode", "exeggcute", "exeggutor",
    "cubone", "marowak", "hitmonlee", "hitmonchan", "lickitung", "koffing",
    "weezing", "rhyhorn", "rhydon", "chansey", "tangela", "kangaskhan",
    "horsea", "seadra", "goldeen", "seaking", "staryu", "starmie",
    "mrmime", "scyther", "jynx", "electabuzz", "magmar", "pinsir",
    "tauros", "magikarp", "gyarados", "lapras", "ditto", "eevee",
    "vaporeon", "jolteon", "flareon", "porygon", "omanyte", "omastar",
    "kabuto", "kabutops", "aerodactyl", "snorlax", "articuno", "zapdos",
    "moltres", "dratini", "dragonair", "dragonite", "mewtwo", "mew"
]

def extract_locations_from_html(html):
    """Extract location names from Serebii Pokemon page HTML."""
    locations = []
    
    # Pattern: <a href="/pokemonpokopia/locations/LOCATION.shtml"><u>Location Name</u></a>
    # Or: <b>Location</b>:<br>...<a href="..."><u>Location Name</u></a>
    
    # Find the Location section
    loc_pattern = r'<b>Location</b>.*?<td class="foo'
    loc_match = re.search(loc_pattern, html, re.DOTALL)
    
    if loc_match:
        loc_section = html[loc_match.start():loc_match.start()+2000]  # Get enough context
        
        # Extract all location links from this section
        link_pattern = r'<a href="/pokemonpokopia/locations/[^"]+\.shtml"><u>([^<]+)</u></a>'
        links = re.findall(link_pattern, loc_section)
        locations.extend(links)
    
    # Alternative pattern - look for location names directly
    if not locations:
        # Look for common location names in the HTML
        known_locations = [
            "Palette Town", "Cloud Island", "Withered Wasteland", "Withered Wastelands",
            "Bleak Beach", "Rocky Ridges", "Sparkling Skylands", "Hot Spring Area"
        ]
        for loc in known_locations:
            if loc in html:
                locations.append(loc)
    
    return locations

def main():
    # Dictionary to store Pokemon -> locations mapping
    pokemon_locations = {}
    # Dictionary to store Location -> Pokemon mapping
    location_pokemon = {}
    
    print("Starting location extraction...")
    
    # First, let's test with the Geodude file we already have
    test_file = Path("/home/z/my-project/geodude-test.json")
    if test_file.exists():
        with open(test_file) as f:
            data = json.load(f)
        html = data.get('data', {}).get('html', '')
        locations = extract_locations_from_html(html)
        print(f"Geodude locations: {locations}")
        pokemon_locations['Geodude'] = locations
    
    # Now fetch a few more to verify the pattern
    test_pokemon = ['pikachu', 'bulbasaur', 'charmander', 'squirtle', 'eevee']
    
    for name in test_pokemon:
        print(f"\nFetching {name}...")
        try:
            result = subprocess.run([
                'z-ai', 'function', '-n', 'page_reader',
                '-a', json.dumps({"url": f"https://www.serebii.net/pokemonpokopia/pokedex/{name}.shtml"}),
                '-o', f'/home/z/my-project/pokemon-temp-{name}.json'
            ], capture_output=True, text=True, timeout=90)
            
            if result.returncode == 0:
                time.sleep(1)  # Rate limiting
                with open(f'/home/z/my-project/pokemon-temp-{name}.json') as f:
                    data = json.load(f)
                html = data.get('data', {}).get('html', '')
                locations = extract_locations_from_html(html)
                pokemon_locations[name.capitalize()] = locations
                print(f"{name.capitalize()} locations: {locations}")
            else:
                print(f"Failed to fetch {name}: {result.stderr}")
        except Exception as e:
            print(f"Error fetching {name}: {e}")
    
    # Print summary
    print("\n=== Pokemon Locations Mapping ===")
    for pokemon, locs in pokemon_locations.items():
        print(f"{pokemon}: {locs}")
    
    # Build reverse mapping
    for pokemon, locs in pokemon_locations.items():
        for loc in locs:
            if loc not in location_pokemon:
                location_pokemon[loc] = []
            location_pokemon[loc].append(pokemon)
    
    print("\n=== Location -> Pokemon Mapping ===")
    for loc, pokemons in location_pokemon.items():
        print(f"{loc}: {pokemons}")
    
    # Save to JSON
    output = {
        "pokemon_locations": pokemon_locations,
        "location_pokemon": location_pokemon
    }
    
    with open('/home/z/my-project/extracted-locations.json', 'w') as f:
        json.dump(output, f, indent=2)
    
    print("\nSaved to extracted-locations.json")

if __name__ == '__main__':
    main()
