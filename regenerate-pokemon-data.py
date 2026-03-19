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
    residents = hab.get("pokemon", [])
    for res in residents:
        pokemon_name = res["name"]
        if pokemon_name not in processed:
            # Find locations for this Pokemon from location data
            locations = []
            for loc, poke_names in loc_data["pokemon_to_locations"].items():
                if pokemon_name in poke_names:
                    locations.append(loc)
            
            pokemon_list.append({
                "id": len(pokemon_list) + 1,
                "nationalDex": len(pokemon_list) + 1,
                "name": pokemon_name,
                "image": f"https://www.serebii.net/pokemongo/pokemon/" + str(len(pokemon_list) + 1).zfill(3, "0") + ".png",
                "habitats": [hab_name],
                "locations": locations,
                "specialties": [],
                "conditions": hab.get("conditions", ["Any time"]),
                "rarity": "Common"
            })
            processed.add(pokemon_name)

print(json.dumps({"pokemonList": pokemon_list}, indent=2))
