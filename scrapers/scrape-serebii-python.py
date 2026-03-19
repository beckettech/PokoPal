#!/usr/bin/env python3
import urllib.request
import re
import json
import time

pokemon_list = [
    "geodude", "pikachu", "eevee", "bulbasaur", "charmander", "squirtle",
    "charizard", "venusaur", "blastoise", "gengar", "dragonite", "lucario",
    "greninja", "gyarados", "arcanine", "ninetales", "tyranitar", "metagross",
    "blaziken", "empoleon", "torchic", "piplup", "scorbunny", "sprigatito",
    "froakie", "cinderace", "meowscarada", "raichu", "vulpix", "growlithe",
    "slowpoke", "magikarp", "porygon", "riolu", "zorua", "mimikyu",
    "abra", "absol", "aerodactyl", "alakazam", "altaria", "amaura",
    "ampharos", "arbok", "ariados", "audino", "aurorus", "axew",
    "azumarill", "azurill", "bastiodon", "beldum", "bellossom", "bellsprout",
    "blissey", "bonsly", "cacnea", "cacturne", "carkol", "ceruledge",
    "chandelure", "chansey", "charcadet", "charjabug", "charmeleon", "chatot",
    "cinccino", "clefable", "clefairy", "cleffa", "clodsire", "coalossal",
    "combee", "combusken", "conkeldurr", "corviknight", "corvisquire", "cranidos",
    "crobat", "cubone", "cyndaquil", "dachsbun", "dartrix", "decidueye",
    "dedenne", "diglett", "dragapult", "dragonair", "drakloak", "dratini",
    "dreepy", "drifblim", "drifloon", "drilbur", "dugtrio", "dusclops",
    "dusknoir", "duskull", "ekans", "electabuzz", "electivire", "electrode",
    "elekid", "excadrill", "exeggcute", "exeggutor", "farigiraf", "fidough",
    "flaaffy", "floragato", "flygon", "fraxure", "frogadier", "gallade",
    "garbodor", "gardevoir", "gastly", "gastrodon", "gholdengo", "gimmighoul",
    "girafarig", "glimmet", "glimmora", "gloom", "golduck", "golem",
    "goodra", "goomy", "graveler", "greedent", "grimer", "grubbin",
    "gurdurr", "happiny", "hariyama", "haunter", "haxorus", "heracross",
    "hitmonchan", "hitmonlee", "hitmontop", "honchkrow", "hoothoot", "igglybuff",
    "illumise", "ivysaur", "jigglypuff", "kadabra", "kilowattrel", "kirlia",
    "kricketot", "kricketune", "lampent", "lapras", "larvesta", "larvitar",
    "litwick", "lombre", "lotad", "ludicolo", "machamp", "machoke",
    "magby", "magmar", "magmortar", "magnemite", "magneton", "magnezone",
    "makuhita", "mareep", "marill", "marowak", "meowth", "metang",
    "minccino", "minun", "misdreavus", "mismagius", "muk", "murkrow",
    "noctowl", "noibat", "oddish", "onix", "paras", "parasect",
    "pawmi", "pawmo", "pawmot", "persian", "pidgeot", "pidgeotto",
    "pidgey", "pinsir", "plusle", "politoed", "poliwag", "poliwhirl",
    "poliwrath", "prinplup", "psyduck", "pupitar", "quilava", "raboot",
    "ralts", "rampardos", "rattata", "raticate", "rolycoly", "rookidee",
    "rowlet", "sandshrew", "sandslash", "scizor", "scyther", "serperior",
    "servine", "shieldon", "shellos", "skwovet", "slowbro", "slowking",
    "sliggoo", "smeargle", "snivy", "spearow", "spinarak", "steelix",
    "sudowoodo", "swablu", "swalot", "timburr", "tinkatink", "tinkatuff",
    "tinkaton", "torkoal", "toxel", "trapinch", "trubbish", "typhlosion",
    "tyrantrum", "tyrogue", "tyrunt", "venomoth", "venonat", "vespiquen",
    "vibrava", "victreebel", "vileplume", "volbeat", "volcarona", "voltorb",
    "wartortle", "wattrel", "weepinbell", "wigglytuff", "wingull", "zubat",
    "pichu", "cleffa", "igglybuff", "tangrowth", "scizor", "munchlax",
    "mawile", "vikavolt", "machop", "koffing", "weezing", "gulpin",
    "cramorant", "skwovet", "geodude", "tangela",
    # Legendaries (likely no locations)
    "mewtwo", "mew", "entei", "raikou", "suicune", "articuno", "zapdos", "moltres",
    "lugia", "ho-oh", "celebi", "kyogre", "volcanion",
]

results = {}
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

for name in pokemon_list:
    url = f"https://www.serebii.net/pokemonpokopia/pokedex/{name}.shtml"
    print(f"Scraping {name}...", flush=True)
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('latin-1')
        
        # Extract only the Location section
        match = re.search(r'<b>Location</b>:(.*?)</td>', html, re.DOTALL)
        if match:
            section = match.group(1)
            locs = re.findall(r'<u>(.*?)</u>', section)
            results[name] = locs
            print(f"  -> {locs}", flush=True)
        else:
            results[name] = []
            print(f"  -> No location found", flush=True)
            
        time.sleep(0.3)  # Be nice to Serebii
        
    except Exception as e:
        print(f"  Error: {e}", flush=True)
        results[name] = []

# Save results
with open('serebii-scraped-locations.json', 'w') as f:
    json.dump({"pokemon_to_locations": results}, f, indent=2)

print(f"\nDone! Saved {len(results)} Pokemon to serebii-scraped-locations.json")
