# Game8 Scrapers

These scrapers update the Pokopia Guide app data from the official Game8 database.

## scrape-game8-final.js

Scrapes all 209 habitats from Game8 to extract per-Pokémon location data.

**What it does:**
- Fetches the Game8 habitat dex index (208 habitats)
- For each habitat, extracts all Pokemon spawn entries
- For each Pokemon, finds their specific locations from the spawn table
- Builds a `pokemon -> locations[]` map
- Updates `habitats.json` with the union of all Pokemon locations in each habitat

**Run:** `node scrapers/scrape-game8-final.js`

**Results:**
- Bulbasaur: All 6 locations (Oddish spawns Any Area → all locations)
- Geodude: Palette Town + Cloud Island only
- Pikachu: Palette Town + Cloud Island only

## Usage

After scraping, commit the updated JSON files:

```bash
git add src/data/scraped/pokemon-serebii.json src/data/scraped/habitats.json
git commit -m "fix: update locations from Game8"
git push
```

## Data Accuracy

Game8 provides per-Pokémon location data by habitat:
- Each habitat lists which Pokemon can spawn there
- Each Pokemon entry shows at which specific locations they spawn
- When a Pokemon spawns "Any Area", that habitat appears at all 6 locations

This is more accurate than the previous Serebii-based data which had incorrect/missing locations.
