#!/usr/bin/env python3
"""Fix recipes.json based on pokopiahabitats.com data extracted from snapshot."""
import json

with open('public/recipes.json') as f:
    data = json.load(f)

# Format: our_slug -> corrected requirements list
# All data extracted from https://pokopiahabitats.com/recipe index page
fixes = {
    # === BLOCKS ===
    "archedtiling": [{"name": "Stone", "quantity": 2}],
    "asphaltroad": [{"name": "Concrete", "quantity": 2}],
    "brickflooring": [{"name": "Brick", "quantity": 2}],
    "bricksteps": [{"name": "Brick", "quantity": 2}],
    "brickwall": [{"name": "Brick", "quantity": 2}],
    "cobblestonewall": [{"name": "Stone", "quantity": 2}],
    "concretewall": [{"name": "Concrete", "quantity": 2}],
    "crystalwall": [{"name": "Crystal fragment", "quantity": 2}],
    "feltmat": [{"name": "Fluff", "quantity": 1}, {"name": "Twine", "quantity": 1}],
    "fishscaletiling": [{"name": "Squishy clay", "quantity": 2}],
    "fluffyflooring": [{"name": "Fluff", "quantity": 2}],
    "grateflooring": [{"name": "Iron ore", "quantity": 2}],
    "haypile": [{"name": "Leaf", "quantity": 2}],
    "linedstoneflooring": [{"name": "Stone", "quantity": 2}],
    "plasterwall": [{"name": "Seashell", "quantity": 1}],
    "puffytreepillar": [{"name": "Leaf", "quantity": 1}, {"name": "Twine", "quantity": 1}],
    "scrapcube": [{"name": "Nonburnable garbage", "quantity": 1}, {"name": "Iron ore", "quantity": 1}, {"name": "Copper ore", "quantity": 1}],
    "squaretiling": [{"name": "Stone", "quantity": 2}],
    "stonebrickwall": [{"name": "Brick", "quantity": 2}],
    "stoneflooring": [{"name": "Stone", "quantity": 2}],
    "stonetiling": [{"name": "Stone", "quantity": 2}],
    "stylishflooring": [{"name": "Squishy clay", "quantity": 2}],
    "walkway": [{"name": "Lumber", "quantity": 2}],
    "woodenflooring": [{"name": "Lumber", "quantity": 2}],
    "woodenwall": [{"name": "Lumber", "quantity": 2}],
    "wovencarpeting": [{"name": "Fluff", "quantity": 2}],

    # === FURNITURE ===
    "alarmclock": [{"name": "Iron ore", "quantity": 1}],
    "bell": [{"name": "Copper ingot", "quantity": 1}, {"name": "Gold ingot", "quantity": 1}],
    "bigstoragebox": [{"name": "Pokemetal", "quantity": 3}],
    "corkboard": [{"name": "Lumber", "quantity": 4}, {"name": "Paper", "quantity": 1}],
    "crystalball": [{"name": "Glass", "quantity": 3}, {"name": "Twine", "quantity": 1}],
    "exhibitionstand": [{"name": "Stone", "quantity": 1}, {"name": "Lumber", "quantity": 1}],
    "foodcounter": [{"name": "Lumber", "quantity": 2}, {"name": "Twine", "quantity": 2}],
    "industrialbed": [{"name": "Lumber", "quantity": 2}],
    "ironbench": [{"name": "Iron ingot", "quantity": 2}, {"name": "Lumber", "quantity": 1}],
    "ironstand": [{"name": "Iron ingot", "quantity": 2}],
    "logbed": [{"name": "Small log", "quantity": 2}, {"name": "Twine", "quantity": 2}],
    "logchair": [{"name": "Small log", "quantity": 1}],
    "logtable": [{"name": "Small log", "quantity": 1}],
    "minibookcase": [{"name": "Lumber", "quantity": 1}, {"name": "Paper", "quantity": 1}],
    "miniplainbed": [{"name": "Lumber", "quantity": 1}],
    "moderndoor": [{"name": "Glass", "quantity": 1}, {"name": "Iron ingot", "quantity": 2}],
    "officecabinet": [{"name": "Pokemetal", "quantity": 1}],
    "officechair": [{"name": "Pokemetal", "quantity": 1}, {"name": "Fluff", "quantity": 1}],
    "officedesk": [{"name": "Pokemetal", "quantity": 2}],
    "officetable": [{"name": "Pokemetal", "quantity": 2}, {"name": "Glass", "quantity": 2}],
    "plainbed": [{"name": "Lumber", "quantity": 2}, {"name": "Fluff", "quantity": 2}],
    "plainchair": [{"name": "Lumber", "quantity": 1}, {"name": "Twine", "quantity": 1}],
    "plaincloset": [{"name": "Lumber", "quantity": 2}, {"name": "Twine", "quantity": 1}],
    "plaintable": [{"name": "Lumber", "quantity": 1}, {"name": "Twine", "quantity": 2}],
    "plate": [{"name": "Squishy clay", "quantity": 1}],
    "resortlight": [{"name": "Iron ore", "quantity": 1}, {"name": "Vine rope", "quantity": 1}, {"name": "Sea glass fragments", "quantity": 1}],
    "sashwindow": [{"name": "Pokemetal", "quantity": 1}, {"name": "Glass", "quantity": 1}],
    "shelllamp": [{"name": "Seashell", "quantity": 1}, {"name": "Sea glass fragments", "quantity": 1}],
    "smallnarrowrug": [{"name": "Twine", "quantity": 1}, {"name": "Fluff", "quantity": 1}],
    "spotlight": [{"name": "Sea glass fragments", "quantity": 1}, {"name": "Iron ore", "quantity": 1}],
    "strawbed": [{"name": "Leaf", "quantity": 2}],
    "strawstool": [{"name": "Leaf", "quantity": 1}],
    "strawtable": [{"name": "Leaf", "quantity": 1}, {"name": "Stone", "quantity": 1}],
    "stylishstool": [{"name": "Pokemetal", "quantity": 1}, {"name": "Fluff", "quantity": 1}],
    "teaset": [{"name": "Squishy clay", "quantity": 2}],
    "wallmountedflowers": [{"name": "Lumber", "quantity": 1}, {"name": "Wildflowers", "quantity": 1}],
    "woodenbed": [{"name": "Lumber", "quantity": 2}, {"name": "Leaf", "quantity": 2}],
    "woodenbench": [{"name": "Lumber", "quantity": 2}],
    "woodenpartition": [{"name": "Lumber", "quantity": 2}],
    "woodenstool": [{"name": "Lumber", "quantity": 1}],
    "chicchair": [{"name": "Lumber", "quantity": 1}, {"name": "Fluff", "quantity": 1}],
    "plainchest": [{"name": "Lumber", "quantity": 1}, {"name": "Twine", "quantity": 1}],
    "plainstand": [{"name": "Lumber", "quantity": 2}, {"name": "Twine", "quantity": 1}],
    "plainstool": [{"name": "Lumber", "quantity": 1}, {"name": "Twine", "quantity": 1}],
    "shower": [{"name": "Iron ore", "quantity": 2}],
    "swingingdoors": [{"name": "Lumber", "quantity": 2}],
    "wreath": [{"name": "Vine rope", "quantity": 1}, {"name": "Wildflowers", "quantity": 1}],

    # === OUTDOOR ===
    "boatrailing": [{"name": "Lumber", "quantity": 2}, {"name": "Iron ore", "quantity": 2}],
    "campfire": [{"name": "Sturdy stick", "quantity": 1}, {"name": "Stone", "quantity": 1}],
    "cannon": [{"name": "Iron ingot", "quantity": 1}, {"name": "Lumber", "quantity": 1}, {"name": "Vine rope", "quantity": 1}],
    "cart": [{"name": "Lumber", "quantity": 3}],
    "concretepipe": [{"name": "Concrete", "quantity": 2}],
    "garbagebags": [{"name": "Nonburnable garbage", "quantity": 1}],
    "garbagebin": [{"name": "Iron ore", "quantity": 1}],
    "harborpole": [{"name": "Iron ore", "quantity": 2}, {"name": "Vine rope", "quantity": 2}],
    "harborstreetlight": [{"name": "Iron ore", "quantity": 1}, {"name": "Stone", "quantity": 1}, {"name": "Sea glass fragments", "quantity": 1}],
    "informationboard": [{"name": "Pokemetal", "quantity": 2}, {"name": "Lumber", "quantity": 1}],
    "perch": [{"name": "Small log", "quantity": 2}, {"name": "Leaf", "quantity": 1}],
    "planter": [{"name": "Brick", "quantity": 1}, {"name": "Stone", "quantity": 1}],
    "punchingbag": [{"name": "Twine", "quantity": 1}, {"name": "Vine rope", "quantity": 1}, {"name": "Iron ore", "quantity": 1}, {"name": "Beach sand", "quantity": 1}],
    "rope": [{"name": "Vine rope", "quantity": 2}],
    "sandbox": [{"name": "Beach sand", "quantity": 1}, {"name": "Lumber", "quantity": 1}],
    "sign": [{"name": "Lumber", "quantity": 1}],
    "slendercandle": [{"name": "Sturdy stick", "quantity": 1}, {"name": "Stone", "quantity": 1}],
    "torch": [{"name": "Sturdy stick", "quantity": 1}, {"name": "Leaf", "quantity": 1}],
    "waterbasin": [{"name": "Lumber", "quantity": 2}, {"name": "Vine rope", "quantity": 2}],
    "woodenbirdhouse": [{"name": "Lumber", "quantity": 2}, {"name": "Twine", "quantity": 1}],
    "woodencrate": [{"name": "Lumber", "quantity": 2}],
    "woodenenclosure": [{"name": "Lumber", "quantity": 3}],
    "woodenposts": [{"name": "Lumber", "quantity": 1}],
    "chanseyplant": [{"name": "Leaf", "quantity": 3}, {"name": "Sturdy stick", "quantity": 3}],

    # === UTILITIES ===
    "automaticdoors": [{"name": "Glass", "quantity": 1}, {"name": "Iron ingot", "quantity": 1}],
    "communitybox": [{"name": "Lumber", "quantity": 2}],
    "concretemixer": [{"name": "Iron ingot", "quantity": 2}],
    "cookingpot": [{"name": "Copper ingot", "quantity": 2}],
    "cuttingboard": [{"name": "Lumber", "quantity": 2}],
    "frame": [{"name": "Lumber", "quantity": 1}],
    "fryingpan": [{"name": "Copper ingot", "quantity": 2}],
    "handcar": [{"name": "Copper ingot", "quantity": 2}],
    "liftplatform": [{"name": "Iron ingot", "quantity": 5}, {"name": "Concrete", "quantity": 5}, {"name": "Tinkagear", "quantity": 1}],
    "metallicsmeltingfurnace": [{"name": "Iron ingot", "quantity": 10}, {"name": "Pokemetal", "quantity": 3}, {"name": "Tinkagear", "quantity": 3}],
    "mushroomlamp": [{"name": "Glowing mushrooms", "quantity": 1}, {"name": "Sturdy stick", "quantity": 1}],
    "mushroomstreetlight": [{"name": "Lumber", "quantity": 2}, {"name": "Glowing mushrooms", "quantity": 1}],
    "railwaytrack": [{"name": "Stone", "quantity": 1}],
    "smeltingfurnace": [{"name": "Iron ore", "quantity": 4}, {"name": "Stone", "quantity": 4}],
    "utilitypole": [{"name": "Lumber", "quantity": 2}, {"name": "Wire", "quantity": 1}],
    "workbench": [{"name": "Stone", "quantity": 2}],
    "crossinggate": [{"name": "Iron ingot", "quantity": 1}, {"name": "Lumber", "quantity": 1}],
    "plainlamp": [{"name": "Lumber", "quantity": 1}, {"name": "Twine", "quantity": 1}],

    # === BUILDINGS ===
    "archedbarrier": [{"name": "Iron ore", "quantity": 2}],
    "bridgeplanks": [{"name": "Lumber", "quantity": 1}],
    "flattiledroof": [{"name": "Squishy clay", "quantity": 2}],
    "glossyawning": [{"name": "Twine", "quantity": 2}],
    "hatchwindow": [{"name": "Lumber", "quantity": 2}],
    "housepartition": [{"name": "Twine", "quantity": 5}],
    "largewoodendoor": [{"name": "Lumber", "quantity": 2}],
    "magikarpdecoration": [{"name": "Squishy clay", "quantity": 1}],
    "roofsupport": [{"name": "Lumber", "quantity": 2}],
    "rusticdoor": [{"name": "Lumber", "quantity": 2}],
    "slopedtiledroof": [{"name": "Squishy clay", "quantity": 2}],
    "steppingstones": [{"name": "Stone", "quantity": 1}],
    "stonesteps": [{"name": "Stone", "quantity": 2}],
    "tiledhippedroof": [{"name": "Squishy clay", "quantity": 2}],
    "tiledroofdecoration": [{"name": "Squishy clay", "quantity": 2}],
    "tiledroofvalley": [{"name": "Squishy clay", "quantity": 2}],
    "undergroundhatch": [{"name": "Lumber", "quantity": 2}],
    "woodenfencing": [{"name": "Lumber", "quantity": 2}],
    "woodengate": [{"name": "Lumber", "quantity": 2}],
    "woodenladder": [{"name": "Lumber", "quantity": 2}],
    "woodenpath": [{"name": "Lumber", "quantity": 2}],
    "woodensteps": [{"name": "Lumber", "quantity": 2}],

    # === MISC ===
    "berrybasket": [{"name": "Chesto Berry", "quantity": 1}],  # website says "not yet documented" but ours has Chesto Berry
    "coolbassguitar": [{"name": "Strange strings", "quantity": 1}, {"name": "Lumber", "quantity": 1}, {"name": "Pokemetal", "quantity": 1}],
    "coolelectricguitar": [{"name": "Strange strings", "quantity": 1}, {"name": "Lumber", "quantity": 1}, {"name": "Pokemetal", "quantity": 1}],
    "extravagantflowers": [{"name": "Squishy clay", "quantity": 1}, {"name": "Wildflowers", "quantity": 1}],
    "mug": [{"name": "Squishy clay", "quantity": 1}],
    "partyplatter": [{"name": "Iron ingot", "quantity": 1}],
    "picnicbasket": [{"name": "Sturdy stick", "quantity": 1}, {"name": "Vine rope", "quantity": 1}],
    "pinwheels": [{"name": "Sturdy stick", "quantity": 1}, {"name": "Vine rope", "quantity": 1}, {"name": "Wastepaper", "quantity": 1}],
    "smallvase": [{"name": "Squishy clay", "quantity": 1}, {"name": "Wildflowers", "quantity": 1}],
    "toyblocks": [{"name": "Lumber", "quantity": 1}, {"name": "Twine", "quantity": 1}],
    "woodenplate": [{"name": "Lumber", "quantity": 1}],

    # === OTHER ===
    "fireworkblue": [{"name": "Pokemetal", "quantity": 1}, {"name": "Sturdy stick", "quantity": 1}, {"name": "Glowing stone", "quantity": 1}, {"name": "Blue paint", "quantity": 1}],
    "fireworkgreen": [{"name": "Pokemetal", "quantity": 1}, {"name": "Sturdy stick", "quantity": 1}, {"name": "Glowing stone", "quantity": 1}, {"name": "Green paint", "quantity": 1}],
    "fireworkred": [{"name": "Pokemetal", "quantity": 1}, {"name": "Sturdy stick", "quantity": 1}, {"name": "Glowing stone", "quantity": 1}, {"name": "Red paint", "quantity": 1}],
    "fireworkwhite": [{"name": "Pokemetal", "quantity": 1}, {"name": "Sturdy stick", "quantity": 1}, {"name": "Glowing stone", "quantity": 1}, {"name": "White paint", "quantity": 1}],
    "fireworkyellow": [{"name": "Pokemetal", "quantity": 1}, {"name": "Sturdy stick", "quantity": 1}, {"name": "Glowing stone", "quantity": 1}, {"name": "Yellow paint", "quantity": 1}],
    "partypopper": [{"name": "Paper", "quantity": 1}, {"name": "Vine rope", "quantity": 1}],
    "softmat": [{"name": "Twine", "quantity": 4}],
    "starpiece": [{"name": "Stardust", "quantity": 99}],
    "storagebox": [{"name": "Lumber", "quantity": 1}],

    # === COOKING RECIPES ===
    "simplesalad": [{"name": "Leaf", "quantity": 1}],
    "leppasalad": [{"name": "Leaf", "quantity": 1}, {"name": "Leppa Berry", "quantity": 1}],
    "seaweedsalad": [{"name": "Leaf", "quantity": 1}, {"name": "Seaweed", "quantity": 1}],
    "shreddedsalad": [{"name": "Leaf", "quantity": 1}],
    "crushedberrysalad": [{"name": "Leaf", "quantity": 1}, {"name": "Chesto Berry", "quantity": 1}],
    "croutonsalad": [{"name": "Leaf", "quantity": 1}, {"name": "Simple Bread", "quantity": 1}],
    "simplesoup": [{"name": "Fresh Water", "quantity": 1}],
    "seaweedsoup": [{"name": "Fresh Water", "quantity": 1}, {"name": "Seaweed", "quantity": 1}],
    "mushroomsoup": [{"name": "Fresh Water", "quantity": 1}, {"name": "Cave Mushrooms", "quantity": 1}],
    "electrifyingsoup": [{"name": "Fresh Water", "quantity": 1}],
    "healthysoup": [{"name": "Fresh Water", "quantity": 1}, {"name": "Bean", "quantity": 1}, {"name": "Leaf", "quantity": 1}],
    "flavorfulsoup": [{"name": "Fresh Water", "quantity": 1}, {"name": "Aspear Berry", "quantity": 1}, {"name": "Simple Hamburger Steak", "quantity": 1}],
    "simplebread": [{"name": "Wheat", "quantity": 1}],
    "leppabread": [{"name": "Wheat", "quantity": 1}, {"name": "Leppa Berry", "quantity": 1}],
    "carrotbread": [{"name": "Wheat", "quantity": 1}, {"name": "Fresh Carrot", "quantity": 1}],
    "breadbowl": [{"name": "Wheat", "quantity": 1}, {"name": "Simple Soup", "quantity": 1}],
    "simplehamburgersteak": [{"name": "Bean", "quantity": 1}],
    "mushroomhamburgersteak": [{"name": "Bean", "quantity": 1}, {"name": "Cave Mushrooms", "quantity": 1}],
    "tomatohamburgersteak": [{"name": "Bean", "quantity": 1}, {"name": "Tomato", "quantity": 1}],
    "potatohamburgersteak": [{"name": "Bean", "quantity": 1}, {"name": "Potato", "quantity": 1}],

    # === SMELTING RECIPES ===
    "copperingot": [{"name": "Copper ore", "quantity": 1}],
    "ironingot": [{"name": "Iron ore", "quantity": 1}],
    "goldingot": [{"name": "Gold ore", "quantity": 1}],
    "glassfromvolcanicash": [{"name": "Volcanic Ash", "quantity": 1}],
    "glassfromsand": [{"name": "Sand", "quantity": 1}],
    "glassfromsandstone": [{"name": "Sandstone", "quantity": 1}],
    "pokemetalrecipe": [{"name": "Pokemetal Fragment", "quantity": 1}],
}

# Apply fixes
fixed = 0
for slug, new_reqs in fixes.items():
    if slug in data:
        old_reqs = data[slug].get("requirements", [])
        if old_reqs != new_reqs:
            print(f"FIXED {slug}: {len(old_reqs)} reqs -> {len(new_reqs)} reqs")
            data[slug]["requirements"] = new_reqs
            fixed += 1
    else:
        print(f"SKIP {slug}: not in our file")

print(f"\nTotal fixed: {fixed}")

# New recipes to add from the website that are missing from our file
new_recipes = {
    "gamingfridge": {
        "name": "Gaming fridge",
        "category": "furniture",
        "locations": "Shop - Sparkling Skylands Lv. 10",
        "requirements": [{"name": "Pokemetal", "quantity": 1}]
    },
    "wallstoragebox": {
        "name": "Wall storage box",
        "category": "furniture",
        "locations": "Daily Shop Special Sparkling Water",
        "requirements": [{"name": "Pokemetal", "quantity": 2}]
    },
    "pokeballchest": {
        "name": "Poké Ball Chest",
        "category": "furniture",
        "locations": "Shop - Palette Town Lv. 10",
        "requirements": [{"name": "Pokemetal", "quantity": 1}]
    },
}

added = 0
for slug, recipe in new_recipes.items():
    if slug not in data:
        data[slug] = recipe
        print(f"ADDED {slug}")
        added += 1

print(f"\nTotal added: {added}")
print(f"Final total recipes: {len(data)}")

with open('public/recipes.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Written to public/recipes.json")
