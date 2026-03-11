# Pokopia Habitat Dex - Raw Data
Source: Eurogamer (https://www.eurogamer.net/pokemon-pokopia-habitat-dex)
Scraped: 2026-03-10

Total Habitats: 209

---

## Data Structure

Each habitat has:
- **Number** (1-209)
- **Name**
- **Items Required** (with quantities)
- **Pokémon Attracted** (with location variants noted)

---

## Sample Habitats

### 1. Tall Grass
**Items:** x4 Tall Grass
**Pokémon:** Bulbasaur, Squirtle, Geodude (Palette Town), Charmander, Oddish

### 2. Tree-shaded Tall Grass
**Items:** x1 Large Tree (Any), x4 Tall Grass
**Pokémon:** Scyther, Scizor (Palette Town), Pinsir, Bellsprout, Skwovet (Palette Town), Heracross

### 7. Illuminated Tall Grass
**Items:** x4 Tall Grass, x1 Lighting (Any)
**Pokémon:** Venonat, Venomoth

### 8. Pretty Flower Bed
**Items:** x4 Wildflowers
**Pokémon:** Pidgey, Pidgeotto, Combee, Eevee, Magby, Hoothoot

### 15. Fresh Veggie Field
**Items:** x8 Vegetable Field (Any)
**Pokémon:** Drilbur, Excadrill, Rowlet (Palette Town)

### 40. Berry-feast Campsite
**Items:** x2 Castform Weather Charm (Sun), x1 Bonfire (Lit), x1 Berry Basket, x1 High-up Location
**Pokémon:** Charizard

### 137-145. Pink Tall Grass Series
Different color tall grass for different Pokémon

### 146, 154. TBA
Some habitats still being discovered

### 202-209. Eevee Evolution Habitats
Each Eeveelution has a food-themed habitat:
- **Vaporeon:** Boundless Blue Beverage (Soda Float)
- **Jolteon:** Electrifying Potatoes (Fried Potatoes)
- **Flareon:** Burning-hot Spice (Pizza)
- **Espeon:** Elegant Daytime Treats (Afternoon Tea Set)
- **Umbreon:** Dark-chocolate Cookies
- **Leafeon:** Leafy Greens Sandwich
- **Glaceon:** Chilly Shaved Ice
- **Sylveon:** Lovely Ribbon Cake

---

## Key Patterns

1. **Tall Grass Variants:** Tall, Yellow, Red, Pink — different Pokémon per color
2. **Flower Bed Variants:** Pretty, Tree-shaded, Hydrated, Field, Elevated, Graceful, Fluffy, Breezy, Windy
3. **Location Modifiers:** Tree-shaded, Boulder-shaded, Hydrated, Elevated, Illuminated
4. **Special Locations:** Palette Town exclusive variants noted
5. **Fishing Spots:** Different water types = different fish
6. **Fossil Displays:** 8 different fossil Pokémon with piece assembly

---

## Scraper Targets

### Primary Sources
1. **Eurogamer** - Complete habitat list (DONE - this file)
2. **Serebii** - Cross-reference, images, detailed mechanics
3. **MapGenie** - Interactive maps, spawn locations
4. **GameRant** - Regional maps

### Data Points Needed
- [ ] Habitat layout diagrams (visual grid)
- [ ] Item icons/sprites
- [ ] Time-of-day requirements
- [ ] Weather conditions
- [ ] Location restrictions (which regions)
- [ ] Pokémon sprites for each entry
