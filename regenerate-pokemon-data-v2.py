// Rebuild Pokemon data with all 300 entries from correct-locations.json
import json

# Read correct location data
with open("correct-locations.json") as f:
    loc_data = json.load(f)

# Read scraped habitat data
with open("src/data/scraped/habitats.json") as f:
    hab_data = json.load(f)

# Build full Pokemon list
pokemon_list = []
processed = set()

# Add Pokemon from habitats (with their actual habitat name)
for hab in hab_data:
    hab_name = hab["name"]
    if hab_name not in processed:
        # Pokemon from habitats have no locations initially
        residents = hab.get("pokemon", [])
        if residents:
            for res in residents:
                pokemon_name = res["name"]
                if pokemon_name not in processed:
                    # Add new Pokemon
                    pokemon_list.append({
                        "id": len(pokemon_list) + 1,
                        "nationalDex": len(pokemon_list) + 1,
                        "name": pokemon_name,
                        "image": f"https://www.serebii.net/pokemongo/pokemon/{str(len(pokemon_list) + 1):03d}.png",
                        "habitats": [hab_name],
                        "locations": [],
                        "specialties": [],
                        "conditions": hab.get("conditions", ["Any time"]),
                        "rarity": "Common"
                    })
                    processed.add(pokemon_name)

# Add Pokemon and their locations from location data
for loc, poke_names in loc_data["location_to_pokemon"].items():
    if loc not in processed:
        for pokemon_name in poke_names:
            pokemon_list.append({
                "id": len(pokemon_list) + 1,
                "nationalDex": len(pokemon_list) + 1,
                "name": pokemon_name,
                "image": f"https://www.serebii.net/pokemongo/pokemon/{str(len(pokemon_list) + 1):03d}.png",
                "habitats": [],
                "locations": [loc],
                "specialties": [],
                "conditions": [],
                "rarity": "Common"
            })
            processed.add(pokemon_name)

print(json.dumps({"pokemonList": pokemon_list}, indent=2))
