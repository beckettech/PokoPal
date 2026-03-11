# Pokopia Data Sources

## 🥇 PRIMARY: Game8 Wiki
https://game8.co/games/Pokemon-Pokopia

**Why Game8 is the best source:**
- Proper wiki structure with consistent formatting
- All guides in one place
- Individual pages for each Pokémon, habitat, item
- Tables are easy to scrape
- Active updates (game is only 5 days old)
- Clear TBD markers for missing data

### Game8 Pages to Scrape:

| Category | URL | Status |
|----------|-----|--------|
| **Pokédex** | /archives/578286 | ⏳ TODO |
| **Habitat Dex** | /archives/582463 | ⏳ TODO |
| **All Moves** | /archives/582658 | ⏳ TODO |
| **Materials** | /archives/583145 | ⏳ TODO |
| **All Items** | /archives/584741 | ⏳ TODO |
| **Crafting Guide** | /archives/582475 | ⏳ TODO |
| **NPCs** | /archives/582421 | ⏳ TODO |
| **Areas & Biomes** | /archives/583261 | ⏳ TODO |
| **Requests** | /archives/583451 | ⏳ TODO |
| **Specialties** | /archives/582704 | ⏳ TODO |
| **Ancient Artifacts** | /archives/584647 | ⏳ TODO |
| **Human Records** | /archives/584648 | ⏳ TODO |
| **Walkthrough** | /archives/583158 | ⏳ TODO |
| **Tips & Tricks** | /archives/582568 | ⏳ TODO |

### Individual Pages (Pattern):
- **Pokémon:** `/archives/{pokemon-name}` (e.g., /archives/585523 for Venusaur)
- **Habitats:** Listed in habitat dex table
- **Items:** Listed in items table

---

## 🥈 BACKUP SOURCES

### Serebii
https://www.serebii.net/pokemonpokopia/

**Good for:**
- Sprites (standardized URLs)
- Mechanics explanations
- Cross-reference data

### Eurogamer
https://www.eurogamer.net/pokemon-pokopia-habitat-dex

**Good for:**
- Habitat data (already scraped)
- Text explanations

### MapGenie
https://mapgenie.io/pokopia/maps/kanto

**Good for:**
- Interactive map coordinates
- Collectible locations
- Spawn points

---

## 📊 Data Completeness Status

| Data Type | Game8 | Eurogamer | Serebii | Notes |
|-----------|-------|-----------|---------|-------|
| All 300 Pokémon | ✅ Full | ❌ | ✅ Full | Game8 has individual pages |
| All 209 Habitats | ✅ Full | ✅ Full | ⏳ Partial | Some have TBD items |
| Moves | ✅ Full | ❌ | ✅ Full | |
| Materials | ✅ Full | ❌ | ✅ Partial | |
| Items | ✅ Full | ❌ | ✅ Partial | |
| Crafting Recipes | ✅ Full | ❌ | ✅ Partial | |
| Map Coordinates | ❌ | ❌ | ❌ | Need MapGenie |
| Sprites | ❌ | ❌ | ✅ Full | Serebii has standardized URLs |

---

## 🎯 Scraping Priority

1. **HIGH: Pokédex** (Game8) - Core app data
2. **HIGH: Habitat Dex** (Game8) - Better formatted than Eurogamer
3. **MEDIUM: Crafting/Recipes** (Game8)
4. **MEDIUM: Moves** (Game8)
5. **MEDIUM: Materials & Items** (Game8)
6. **LOW: Map Coordinates** (MapGenie - complex scraping)
7. **LOW: Sprites** (Serebii - easy URLs)

---

## 🔗 URL Patterns for Scraping

### Game8 Pokémon Pages
```
Base: https://game8.co/games/Pokemon-Pokopia/archives/
Pattern: {id} or {pokemon-name}
Example: https://game8.co/games/Pokemon-Pokopia/archives/585523 (Venusaur)
```

### Serebii Sprites
```
Base: https://www.serebii.net/pokemonpokopia/pokemon/
Pattern: {number}.png
Example: https://www.serebii.net/pokemonpokopia/pokemon/001.png (Bulbasaur)
```

### MapGenie Regions
```
Base: https://mapgenie.io/pokopia/maps/
Regions: kanto, withered-wasteland, bleak-beach, rocky-ridges, sparkling-skylands, palette-town
```

---

## ⚠️ Known Missing Data

Some habitats have **Tbd** for conditions/Pokémon:
- Game8 marks these clearly
- Community is still discovering some spawns
- May need manual updates or crowdsourcing

---

## 📝 Notes

- Game8 requires sign-in for some features (but public pages are accessible)
- Some pages are "work in progress" - good to re-scrape periodically
- Game is only 5 days old - expect ongoing updates
