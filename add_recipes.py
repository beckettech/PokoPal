#!/usr/bin/env python3
"""Add missing recipes from pokopiahabitats.com to recipes.json"""
import json

with open('public/recipes.json') as f:
    data = json.load(f)

# All recipes from pokopiahabitats.com that are missing from our file
# Format: slug -> recipe data
new_recipes = {
    # === BLOCKS ===
    "archedtiling": {"name": "Arched tiling", "category": "blocks", "locations": "PC Shop", "requirements": [{"name": "Stone", "quantity": 2}]},
    "asphaltroad": {"name": "Asphalt road", "category": "blocks", "locations": "", "requirements": [{"name": "Concrete", "quantity": 2}]},
    "brickflooring": {"name": "Brick flooring", "category": "blocks", "locations": "", "requirements": [{"name": "Brick", "quantity": 2}]},
    "brickwall": {"name": "Brick wall", "category": "blocks", "locations": "", "requirements": [{"name": "Brick", "quantity": 2}]},
    "cobblestonewall": {"name": "Cobblestone wall", "category": "blocks", "locations": "PC Shop: Rocky Ridges (Mountain house recipe set)", "requirements": [{"name": "Stone", "quantity": 2}]},
    "concretewall": {"name": "Concrete wall", "category": "blocks", "locations": "", "requirements": [{"name": "Concrete", "quantity": 2}]},
    "crystalwall": {"name": "Crystal wall", "category": "blocks", "locations": "Inspect shiny water ripples", "requirements": [{"name": "Crystal fragment", "quantity": 2}]},
    "fishscaletiling": {"name": "Fish-scale tiling", "category": "blocks", "locations": "", "requirements": [{"name": "Squishy clay", "quantity": 2}]},
    "grateflooring": {"name": "Grate flooring", "category": "blocks", "locations": "", "requirements": [{"name": "Iron ore", "quantity": 2}]},
    "haypile": {"name": "Hay pile", "category": "blocks", "locations": "PC Shop", "requirements": [{"name": "Leaf", "quantity": 2}]},
    "linedstoneflooring": {"name": "Lined-stone flooring", "category": "blocks", "locations": "Golden Pokeball in construction site across from blue roofed house in Rocky Ridges", "requirements": [{"name": "Stone", "quantity": 2}]},
    "marble": {"name": "Marble", "category": "blocks", "locations": "Pick up Limestone for the first time", "requirements": []},  # not yet documented
    "plasterwall": {"name": "Plaster wall", "category": "blocks", "locations": "", "requirements": [{"name": "Seashell", "quantity": 1}]},
    "scrapcube": {"name": "Scrap cube", "category": "blocks", "locations": "", "requirements": [{"name": "Nonburnable garbage", "quantity": 1}, {"name": "Iron ore", "quantity": 1}, {"name": "Copper ore", "quantity": 1}]},
    "squaretiling": {"name": "Square tiling", "category": "blocks", "locations": "", "requirements": [{"name": "Stone", "quantity": 2}]},
    "stonebrickwall": {"name": "Stone brick wall", "category": "blocks", "locations": "", "requirements": [{"name": "Brick", "quantity": 2}]},
    "stoneflooring": {"name": "Stone flooring", "category": "blocks", "locations": "PC Shop: Rocky Ridges; Mountain house recipe set", "requirements": [{"name": "Stone", "quantity": 2}]},
    "stonetiling": {"name": "Stone tiling", "category": "blocks", "locations": "Register 20 Pokemon to Pokedex", "requirements": [{"name": "Stone", "quantity": 2}]},
    "stylishflooring": {"name": "Stylish tiling", "category": "blocks", "locations": "", "requirements": [{"name": "Squishy clay", "quantity": 2}]},
    "walkway": {"name": "Walkway", "category": "blocks", "locations": "", "requirements": [{"name": "Lumber", "quantity": 2}]},
    "woodenflooring": {"name": "Wooden flooring", "category": "blocks", "locations": "PC Shop: Withered Wasteland (Wasteland house recipe set)", "requirements": [{"name": "Lumber", "quantity": 2}]},
    "woodenpillarlower": {"name": "Wooden pillar (lower)", "category": "blocks", "locations": "Wooden pillar recipe set (found in water shiny spot)", "requirements": [{"name": "Lumber", "quantity": 2}]},
    "woodenpillarmiddle": {"name": "Wooden pillar (middle)", "category": "blocks", "locations": "Wooden pillar recipe set (found in water shiny spot)", "requirements": [{"name": "Lumber", "quantity": 2}]},
    "woodenpillarupper": {"name": "Wooden pillar (upper)", "category": "blocks", "locations": "Wooden pillar recipe set (found in water shiny spot)", "requirements": [{"name": "Lumber", "quantity": 2}]},
    "woodensidingcorner": {"name": "Wooden siding (corner)", "category": "blocks", "locations": "", "requirements": [{"name": "Lumber", "quantity": 2}]},
    "woodensidingpanel": {"name": "Wooden siding (panel)", "category": "blocks", "locations": "", "requirements": [{"name": "Lumber", "quantity": 2}]},
    "wovencarpeting": {"name": "Woven carpeting", "category": "blocks", "locations": "", "requirements": [{"name": "Fluff", "quantity": 2}]},

    # === FURNITURE ===
    "corkboard": {"name": "Corkboard", "category": "furniture", "locations": "", "requirements": [{"name": "Lumber", "quantity": 4}, {"name": "Paper", "quantity": 1}]},
    "exhibitionstand": {"name": "Exhibition stand", "category": "furniture", "locations": "Pick up fossil for the first time", "requirements": [{"name": "Stone", "quantity": 1}, {"name": "Lumber", "quantity": 1}]},
    "ironbed": {"name": "Iron bed", "category": "furniture", "locations": "PC Shop: Rocky Ridges", "requirements": []},  # not yet documented
    "ironchair": {"name": "Iron chair", "category": "furniture", "locations": "Golden Pokeball near chef's kitchen in Rocky Ridges", "requirements": []},  # not yet documented
    "irontable": {"name": "Iron table", "category": "furniture", "locations": "Golden Pokeball near grates on the way to mines in Rocky Ridges", "requirements": []},  # not yet documented
    "minibookcase": {"name": "Mini bookcase", "category": "furniture", "locations": "", "requirements": [{"name": "Lumber", "quantity": 1}, {"name": "Paper", "quantity": 1}]},
    "moderndoor": {"name": "Modern door", "category": "furniture", "locations": "", "requirements": [{"name": "Glass", "quantity": 1}, {"name": "Iron ingot", "quantity": 2}]},
    "officecabinet": {"name": "Office cabinet", "category": "furniture", "locations": "", "requirements": [{"name": "Pokemetal", "quantity": 1}]},
    "officechair": {"name": "Office chair", "category": "furniture", "locations": "", "requirements": [{"name": "Pokemetal", "quantity": 1}, {"name": "Fluff", "quantity": 1}]},
    "officedesk": {"name": "Office desk", "category": "furniture", "locations": "", "requirements": [{"name": "Pokemetal", "quantity": 2}]},
    "officetable": {"name": "Office table", "category": "furniture", "locations": "", "requirements": [{"name": "Pokemetal", "quantity": 2}, {"name": "Glass", "quantity": 2}]},
    "plainbed": {"name": "Plain bed", "category": "furniture", "locations": "", "requirements": [{"name": "Lumber", "quantity": 2}, {"name": "Fluff", "quantity": 2}]},
    "plainchair": {"name": "Plain chair", "category": "furniture", "locations": "", "requirements": [{"name": "Lumber", "quantity": 1}, {"name": "Twine", "quantity": 1}]},
    "plaincloset": {"name": "Plain closet", "category": "furniture", "locations": "PC Shop", "requirements": [{"name": "Lumber", "quantity": 2}, {"name": "Twine", "quantity": 1}]},
    "plaintable": {"name": "Plain table", "category": "furniture", "locations": "", "requirements": [{"name": "Lumber", "quantity": 1}, {"name": "Twine", "quantity": 2}]},
    "plate": {"name": "Plate", "category": "furniture", "locations": "", "requirements": [{"name": "Squishy clay", "quantity": 1}]},
    "shelllamp": {"name": "Shell lamp", "category": "furniture", "locations": "", "requirements": [{"name": "Seashell", "quantity": 1}, {"name": "Sea glass fragments", "quantity": 1}]},
    "spotlight": {"name": "Spotlight", "category": "furniture", "locations": "", "requirements": [{"name": "Sea glass fragments", "quantity": 1}, {"name": "Iron ore", "quantity": 1}]},
    "storagebox": {"name": "Storage box", "category": "furniture", "locations": "Register 7 Pokemon to Pokedex", "requirements": [{"name": "Lumber", "quantity": 1}]},
    "strawbed": {"name": "Straw bed", "category": "furniture", "locations": "Bulbasaur", "requirements": [{"name": "Leaf", "quantity": 2}]},
    "stylishstool": {"name": "Stylish stool", "category": "furniture", "locations": "", "requirements": [{"name": "Pokemetal", "quantity": 1}, {"name": "Fluff", "quantity": 1}]},
    "teaset": {"name": "Tea set", "category": "furniture", "locations": "", "requirements": [{"name": "Squishy clay", "quantity": 2}]},
    "wallmountedflowers": {"name": "Wall-mounted flowers", "category": "furniture", "locations": "", "requirements": [{"name": "Lumber", "quantity": 1}, {"name": "Wildflowers", "quantity": 1}]},
    "woodenbench": {"name": "Wooden bench", "category": "furniture", "locations": "Golden Pokeball near workbench high up on southeast hill in Withered Wasteland", "requirements": [{"name": "Lumber", "quantity": 2}]},
    "woodenpartition": {"name": "Wooden partition", "category": "furniture", "locations": "", "requirements": [{"name": "Lumber", "quantity": 2}]},
    "woodenstool": {"name": "Wooden stool", "category": "furniture", "locations": "", "requirements": [{"name": "Lumber", "quantity": 1}]},
    "woodentable": {"name": "Wooden table", "category": "furniture", "locations": "", "requirements": []},  # not yet documented
    "chicchair": {"name": "Chic chair", "category": "furniture", "locations": "", "requirements": [{"name": "Lumber", "quantity": 1}, {"name": "Fluff", "quantity": 1}]},
    "plainchest": {"name": "Plain chest", "category": "furniture", "locations": "", "requirements": [{"name": "Lumber", "quantity": 1}, {"name": "Twine", "quantity": 1}]},
    "plainstool": {"name": "Plain stool", "category": "furniture", "locations": "", "requirements": [{"name": "Lumber", "quantity": 1}, {"name": "Twine", "quantity": 1}]},
    "shower": {"name": "Shower", "category": "furniture", "locations": "", "requirements": [{"name": "Iron ore", "quantity": 2}]},
    "swingingdoors": {"name": "Swinging doors", "category": "furniture", "locations": "", "requirements": [{"name": "Lumber", "quantity": 2}]},

    # === OUTDOOR ===
    "boatrailing": {"name": "Boat railing", "category": "outdoor", "locations": "", "requirements": [{"name": "Lumber", "quantity": 2}, {"name": "Iron ore", "quantity": 2}]},
    "campfire": {"name": "Campfire", "category": "outdoor", "locations": "", "requirements": [{"name": "Sturdy stick", "quantity": 1}, {"name": "Stone", "quantity": 1}]},
    "cart": {"name": "Cart", "category": "outdoor", "locations": "", "requirements": [{"name": "Lumber", "quantity": 3}]},
    "garbagebags": {"name": "Garbage bags", "category": "outdoor", "locations": "Pick up Nonburnable garbage for the first time", "requirements": [{"name": "Nonburnable garbage", "quantity": 1}]},
    "garbagebin": {"name": "Garbage bin", "category": "outdoor", "locations": "", "requirements": [{"name": "Iron ore", "quantity": 1}]},
    "harborpole": {"name": "Harbor pole", "category": "outdoor", "locations": "", "requirements": [{"name": "Iron ore", "quantity": 2}, {"name": "Vine rope", "quantity": 2}]},
    "harborstreetlight": {"name": "Harbor streetlight", "category": "outdoor", "locations": "", "requirements": [{"name": "Iron ore", "quantity": 1}, {"name": "Stone", "quantity": 1}, {"name": "Sea glass fragments", "quantity": 1}]},
    "planter": {"name": "Planter", "category": "outdoor", "locations": "", "requirements": [{"name": "Brick", "quantity": 1}, {"name": "Stone", "quantity": 1}]},
    "punchingbag": {"name": "Punching bag", "category": "outdoor", "locations": "", "requirements": [{"name": "Twine", "quantity": 1}, {"name": "Vine rope", "quantity": 1}, {"name": "Iron ore", "quantity": 1}, {"name": "Beach sand", "quantity": 1}]},
    "rope": {"name": "Rope", "category": "outdoor", "locations": "", "requirements": [{"name": "Vine rope", "quantity": 2}]},
    "sign": {"name": "Sign", "category": "outdoor", "locations": "Register 25 Pokemon to Pokedex", "requirements": [{"name": "Lumber", "quantity": 1}]},
    "torch": {"name": "Torch", "category": "outdoor", "locations": "Inspect extra shiny water ripples", "requirements": [{"name": "Sturdy stick", "quantity": 1}, {"name": "Leaf", "quantity": 1}]},
    "waterbasin": {"name": "Water basin", "category": "outdoor", "locations": "Golden Pokeball east of Wasteland Pokemon Center near Drilbur", "requirements": [{"name": "Lumber", "quantity": 2}, {"name": "Vine rope", "quantity": 2}]},
    "woodencrate": {"name": "Wooden crate", "category": "outdoor", "locations": "", "requirements": [{"name": "Lumber", "quantity": 2}]},
    "woodenenclosure": {"name": "Wooden enclosure", "category": "outdoor", "locations": "", "requirements": [{"name": "Lumber", "quantity": 3}]},
    "woodenposts": {"name": "Wooden posts", "category": "outdoor", "locations": "", "requirements": [{"name": "Lumber", "quantity": 1}]},

    # === UTILITIES ===
    "breadoven": {"name": "Bread oven", "category": "utilities", "locations": "", "requirements": []},  # not yet documented
    "concretemixer": {"name": "Concrete mixer", "category": "utilities", "locations": "", "requirements": [{"name": "Iron ingot", "quantity": 2}]},
    "cuttingboard": {"name": "Cutting board", "category": "utilities", "locations": "Dartrix after placing Perch", "requirements": [{"name": "Lumber", "quantity": 2}]},
    "fryingpan": {"name": "Frying pan", "category": "utilities", "locations": "Tangrowth after saving Chef Dente", "requirements": [{"name": "Copper ingot", "quantity": 2}]},
    "handcar": {"name": "Handcar", "category": "utilities", "locations": "Get Copper ingot for the first time", "requirements": [{"name": "Copper ingot", "quantity": 2}]},
    "liftplatform": {"name": "Lift platform", "category": "utilities", "locations": "", "requirements": [{"name": "Iron ingot", "quantity": 5}, {"name": "Concrete", "quantity": 5}, {"name": "Tinkagear", "quantity": 1}]},
    "metallicsmeltingfurnace": {"name": "Metallic smelting furnace", "category": "utilities", "locations": "", "requirements": [{"name": "Iron ingot", "quantity": 10}, {"name": "Pokemetal", "quantity": 3}, {"name": "Tinkagear", "quantity": 3}]},
    "mushroomstreetlight": {"name": "Mushroom Streetlight", "category": "utilities", "locations": "Golden Pokeball below North Area Gate in Withered Wasteland", "requirements": [{"name": "Lumber", "quantity": 2}, {"name": "Glowing mushrooms", "quantity": 1}]},
    "railwaytrack": {"name": "Railway track", "category": "utilities", "locations": "Golden Pokeball in front of gates heading into Rocky Ridges mine", "requirements": [{"name": "Stone", "quantity": 1}]},
    "smeltingfurnace": {"name": "Smelting furnace", "category": "utilities", "locations": "Pick up Iron ingot for first time", "requirements": [{"name": "Iron ore", "quantity": 4}, {"name": "Stone", "quantity": 4}]},
    "utilitypole": {"name": "Utility pole", "category": "utilities", "locations": "", "requirements": [{"name": "Lumber", "quantity": 2}, {"name": "Wire", "quantity": 1}]},
    "workbench": {"name": "Workbench", "category": "utilities", "locations": "PC Shop", "requirements": [{"name": "Stone", "quantity": 2}]},
    "crossinggate": {"name": "Crossing gate", "category": "utilities", "locations": "", "requirements": [{"name": "Iron ingot", "quantity": 1}, {"name": "Lumber", "quantity": 1}]},

    # === BUILDINGS ===
    "archedbarrier": {"name": "Arched barrier", "category": "buildings", "locations": "", "requirements": [{"name": "Iron ore", "quantity": 2}]},
    "bridgeplanks": {"name": "Bridge planks", "category": "buildings", "locations": "Golden Pokeball on south coast of Withered Wasteland", "requirements": [{"name": "Lumber", "quantity": 1}]},
    "flattiledroof": {"name": "Flat tiled roof", "category": "buildings", "locations": "PC Shop: Withered Wasteland (Tiled roof recipe set)", "requirements": [{"name": "Squishy clay", "quantity": 2}]},
    "glossyawning": {"name": "Glossy awning", "category": "buildings", "locations": "Pick up Twine for the first time", "requirements": [{"name": "Twine", "quantity": 2}]},
    "hatchwindow": {"name": "Hatch window", "category": "buildings", "locations": "PC Shop: Withered Wasteland", "requirements": [{"name": "Lumber", "quantity": 2}]},
    "largewoodendoor": {"name": "Large wooden door", "category": "buildings", "locations": "PC Shop: Withered Wasteland (Wasteland house recipe set)", "requirements": [{"name": "Lumber", "quantity": 2}]},
    "roofsupport": {"name": "Roof support", "category": "buildings", "locations": "PC Shop", "requirements": [{"name": "Lumber", "quantity": 2}]},
    "slopedtiledroof": {"name": "Sloped tiled roof", "category": "buildings", "locations": "PC Shop: Withered Wasteland (Tiled roof recipe set)", "requirements": [{"name": "Squishy clay", "quantity": 2}]},
    "steppingstones": {"name": "Stepping stones", "category": "buildings", "locations": "PC Shop: Rocky Ridges", "requirements": [{"name": "Stone", "quantity": 1}]},
    "stonesteps": {"name": "Stone steps", "category": "buildings", "locations": "Golden Pokeball near workbench in hot spring area in Rocky Ridges", "requirements": [{"name": "Stone", "quantity": 2}]},
    "tiledhippedroof": {"name": "Tiled hipped roof", "category": "buildings", "locations": "PC Shop: Withered Wasteland (Tiled roof recipe set)", "requirements": [{"name": "Squishy clay", "quantity": 2}]},
    "woodenfencing": {"name": "Wooden fencing", "category": "buildings", "locations": "PC Shop: Withered Wasteland (Wooden construction recipe set)", "requirements": [{"name": "Lumber", "quantity": 2}]},
    "woodengate": {"name": "Wooden gate", "category": "buildings", "locations": "PC Shop: Withered Wasteland (Wooden construction recipe set)", "requirements": [{"name": "Lumber", "quantity": 2}]},
    "woodenladder": {"name": "Wooden ladder", "category": "buildings", "locations": "PC Shop", "requirements": [{"name": "Lumber", "quantity": 2}]},
    "woodenpath": {"name": "Wooden path", "category": "buildings", "locations": "PC Shop: Withered Wasteland (Wooden construction recipe set)", "requirements": [{"name": "Lumber", "quantity": 2}]},
    "woodensteps": {"name": "Wooden steps", "category": "buildings", "locations": "Slowpoke", "requirements": [{"name": "Lumber", "quantity": 2}]},

    # === MISC ===
    "extravagantflowers": {"name": "Extravagant flowers", "category": "misc", "locations": "Inspect water", "requirements": [{"name": "Squishy clay", "quantity": 1}, {"name": "Wildflowers", "quantity": 1}]},
    "mug": {"name": "Mug", "category": "misc", "locations": "Register 35 Pokemon to Pokedex", "requirements": [{"name": "Squishy clay", "quantity": 1}]},
    "smallvase": {"name": "Small vase", "category": "misc", "locations": "PC Shop", "requirements": [{"name": "Squishy clay", "quantity": 1}, {"name": "Wildflowers", "quantity": 1}]},
    "toyblocks": {"name": "Toy blocks", "category": "misc", "locations": "", "requirements": [{"name": "Lumber", "quantity": 1}, {"name": "Twine", "quantity": 1}]},
    "woodenplate": {"name": "Wooden plate", "category": "misc", "locations": "Register 15 Pokemon to Pokedex", "requirements": [{"name": "Lumber", "quantity": 1}]},

    # === COOKING ===
    "simplesalad": {"name": "Simple Salad", "category": "food", "locations": "", "requirements": [{"name": "Leaf", "quantity": 1}]},
    "leppasalad": {"name": "Leppa Salad", "category": "food", "locations": "", "requirements": [{"name": "Leaf", "quantity": 1}, {"name": "Leppa Berry", "quantity": 1}]},
    "seaweedsalad": {"name": "Seaweed Salad", "category": "food", "locations": "", "requirements": [{"name": "Leaf", "quantity": 1}, {"name": "Seaweed", "quantity": 1}]},
    "shreddedsalad": {"name": "Shredded Salad", "category": "food", "locations": "", "requirements": [{"name": "Leaf", "quantity": 1}]},
    "crushedberrysalad": {"name": "Crushed-Berry Salad", "category": "food", "locations": "", "requirements": [{"name": "Leaf", "quantity": 1}, {"name": "Chesto Berry", "quantity": 1}]},
    "croutonsalad": {"name": "Crouton Salad", "category": "food", "locations": "", "requirements": [{"name": "Leaf", "quantity": 1}, {"name": "Simple Bread", "quantity": 1}]},
    "simplesoup": {"name": "Simple Soup", "category": "food", "locations": "", "requirements": [{"name": "Fresh Water", "quantity": 1}]},
    "seaweedsoup": {"name": "Seaweed Soup", "category": "food", "locations": "", "requirements": [{"name": "Fresh Water", "quantity": 1}, {"name": "Seaweed", "quantity": 1}]},
    "mushroomsoup": {"name": "Mushroom Soup", "category": "food", "locations": "", "requirements": [{"name": "Fresh Water", "quantity": 1}, {"name": "Cave Mushrooms", "quantity": 1}]},
    "electrifyingsoup": {"name": "Electrifying Soup", "category": "food", "locations": "", "requirements": [{"name": "Fresh Water", "quantity": 1}]},
    "healthysoup": {"name": "Healthy Soup", "category": "food", "locations": "", "requirements": [{"name": "Fresh Water", "quantity": 1}, {"name": "Bean", "quantity": 1}, {"name": "Leaf", "quantity": 1}]},
    "flavorfulsoup": {"name": "Flavorful Soup", "category": "food", "locations": "", "requirements": [{"name": "Fresh Water", "quantity": 1}, {"name": "Aspear Berry", "quantity": 1}, {"name": "Simple Hamburger Steak", "quantity": 1}]},
    "simplebread": {"name": "Simple Bread", "category": "food", "locations": "", "requirements": [{"name": "Wheat", "quantity": 1}]},
    "leppabread": {"name": "Leppa Bread", "category": "food", "locations": "", "requirements": [{"name": "Wheat", "quantity": 1}, {"name": "Leppa Berry", "quantity": 1}]},
    "carrotbread": {"name": "Carrot Bread", "category": "food", "locations": "", "requirements": [{"name": "Wheat", "quantity": 1}, {"name": "Fresh Carrot", "quantity": 1}]},
    "breadbowl": {"name": "Bread Bowl", "category": "food", "locations": "", "requirements": [{"name": "Wheat", "quantity": 1}, {"name": "Simple Soup", "quantity": 1}]},
    "simplehamburgersteak": {"name": "Simple Hamburger Steak", "category": "food", "locations": "", "requirements": [{"name": "Bean", "quantity": 1}]},
    "mushroomhamburgersteak": {"name": "Mushroom Hamburger Steak", "category": "food", "locations": "", "requirements": [{"name": "Bean", "quantity": 1}, {"name": "Cave Mushrooms", "quantity": 1}]},
    "tomatohamburgersteak": {"name": "Tomato Hamburger Steak", "category": "food", "locations": "", "requirements": [{"name": "Bean", "quantity": 1}, {"name": "Tomato", "quantity": 1}]},
    "potatohamburgersteak": {"name": "Potato Hamburger Steak", "category": "food", "locations": "", "requirements": [{"name": "Bean", "quantity": 1}, {"name": "Potato", "quantity": 1}]},

    # === SMELTING ===
    "copperingot": {"name": "Copper Ingot", "category": "utilities", "locations": "", "requirements": [{"name": "Copper ore", "quantity": 1}]},
    "ironingot": {"name": "Iron Ingot", "category": "utilities", "locations": "", "requirements": [{"name": "Iron ore", "quantity": 1}]},
    "goldingot": {"name": "Gold Ingot", "category": "utilities", "locations": "", "requirements": [{"name": "Gold ore", "quantity": 1}]},
    "glassvolcanicash": {"name": "Glass (from Volcanic Ash)", "category": "utilities", "locations": "", "requirements": [{"name": "Volcanic Ash", "quantity": 1}]},
    "glasssand": {"name": "Glass (from Sand)", "category": "utilities", "locations": "", "requirements": [{"name": "Sand", "quantity": 1}]},
    "glasssandstone": {"name": "Glass (from Sandstone)", "category": "utilities", "locations": "", "requirements": [{"name": "Sandstone", "quantity": 1}]},
    "pokemetalrecipe": {"name": "Pokemetal", "category": "utilities", "locations": "", "requirements": [{"name": "Pokemetal Fragment", "quantity": 1}]},
}

added = 0
for slug, recipe in new_recipes.items():
    if slug not in data:
        data[slug] = recipe
        added += 1
        print(f"ADDED {slug}: {recipe['name']}")

print(f"\nTotal added: {added}")
print(f"Final total recipes: {len(data)}")

with open('public/recipes.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Written to public/recipes.json")
