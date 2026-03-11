# Pokopia Guide App - Scraper Plan & Technical Spec

Created: 2026-03-10
Status: Planning

---

## Overview

Build a RAG-powered Pokopia guide app with 4 tabs:
1. **Map** - Interactive maps with spawn locations
2. **Pokédex** - All 300 Pokémon with details
3. **Environment Dex** - All 209 habitats with visual layouts
4. **Chat** - AI Q&A with images

---

## Data Sources to Scrape

### 1. Habitat Dex ✅ (PRIMARY SOURCE)
**Source:** Game8 (BEST - well structured wiki)
**URL:** https://game8.co/games/Pokemon-Pokopia/archives/582463
**Why Game8 wins:**
- Clean table format (habitat #, name, conditions, Pokémon)
- Individual habitat pages with more details
- Easy to scrape with consistent HTML structure
- TBD entries clearly marked for missing data

**Backup:** Eurogamer
**URL:** https://www.eurogamer.net/pokemon-pokopia-habitat-dex
**Status:** Raw data saved to `habitats-raw.md`

### 2. Pokédex Data ✅ (Game8 has this too!)
**Primary Source:** Game8
**URL:** https://game8.co/games/Pokemon-Pokopia/archives/578286
**Why:**
- All 300 Pokémon listed with individual pages
- Organized by generation, type, location
- Includes specialties, habitats, moves

**Backup Sources:**
- Serebii: https://www.serebii.net/pokemonpokopia/availablepokemon.shtml
- Bulbapedia: https://bulbapedia.bulbagarden.net/wiki/List_of_Pokémon_by_Pokédex_number_in_Pokémon_Pokopia

**Data per Pokémon:**
- Name, Number
- Type(s)
- Sprite image URL
- Rarity
- Utility moves (teaches Ditto)
- Specialty (builder, farmer, etc.)
- Habitat(s) where found
- Evolution chain

### 3. Interactive Maps
**Sources:**
- MapGenie: https://mapgenie.io/pokopia/maps/kanto
- GameRant: https://gamerant.com/map/pokemon-pokopia-*

**Regions:**
1. Withered Wastelands (Fuchsia City) - 240x240
2. Bleak Beach (Vermilion City) - 272x272
3. Rocky Ridges (Pewter City) - 272x272
4. Sparkling Skylands (Celadon/Saffron) - 352x352
5. Palette Town (Pallet Town) - 384x384

**Data per map:**
- Spawn locations (with coordinates)
- Collectible locations
- Recipe locations
- Material nodes
- NPC locations

### 4. Crafting/Recipes
**Primary Source:** Game8 (has dedicated sections)
- Cooking Guide: https://game8.co/games/Pokemon-Pokopia/archives/583158
- Crafting Guide: https://game8.co/games/Pokemon-Pokopia/archives/582475

**Backup Sources:**
- Serebii cooking: https://www.serebii.net/pokemonpokopia/cooking.shtml
- IGN DIY: https://www.ign.com/wikis/pokemon-pokopia/DIY_Recipes
- Pocket Tactics: https://www.pockettactics.com/pokemon-pokopia/crafting

**Data:**
- Cooking recipes (boost abilities)
- DIY crafting recipes (furniture, blocks, items)
- Required materials
- Unlocks/effects

### 5. Images/Assets
**Sources:**
- Serebii sprites
- Official Pokémon artwork (fair use)
- In-game screenshots (fair use)
- Habitat layout diagrams (need to create)

---

## Scraper Architecture

```
pokopia-guide/
├── scrapers/
│   ├── habitats.ts      # Eurogamer habitat scraper ✅
│   ├── pokedex.ts       # Serebii/Bulbapedia Pokémon scraper
│   ├── maps.ts          # MapGenie coordinate scraper
│   ├── recipes.ts       # Recipe/crafting scraper
│   └── images.ts        # Image downloader
├── data/
│   ├── habitats.json    # Structured habitat data
│   ├── pokemon.json     # Structured Pokédex data
│   ├── maps/            # Map data by region
│   └── recipes.json     # All recipes
├── assets/
│   ├── sprites/         # Pokémon sprites
│   ├── items/           # Item icons
│   └── habitats/        # Habitat layout diagrams
└── scripts/
    ├── build-vector-db.ts   # Generate embeddings
    └── seed-db.ts           # Import to vector DB
```

---

## Tech Stack

### Scraping
- **Puppeteer** - Dynamic pages (MapGenie, etc.)
- **Cheerio** - Static HTML parsing
- **Playwright** - Fallback for heavy JS sites

### Data Storage
- **JSON files** - Raw scraped data (version controlled)
- **PostgreSQL + pgvector** - Vector embeddings (via Supabase)
- **Cloudflare R2** - Image storage

### RAG Pipeline
- **Embeddings:** OpenAI text-embedding-3-small (cheap, fast)
- **Vector DB:** Supabase pgvector
- **LLM:** 
  - Primary: GPT-4o-mini (cheap, fast)
  - Alternative: Claude Haiku or Gemini Flash

### App (Next Phase)
- **Mobile:** React Native or PWA
- **Maps:** MapLibre GL (offline-capable)
- **Chat:** Stream-based AI responses

---

## Scraper Scripts

### 1. Habitat Scraper (Priority: HIGH)
```typescript
// Target: Eurogamer Habitat Dex
// Output: data/habitats.json

interface Habitat {
  id: number;
  name: string;
  items: { name: string; quantity: number }[];
  pokemon: { name: string; location?: string }[];
  timeOfDay?: string;
  weather?: string;
  region?: string;
  layoutImage?: string; // Generated later
}
```

### 2. Pokédex Scraper (Priority: HIGH)
```typescript
// Target: Serebii individual Pokémon pages
// Output: data/pokemon.json

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string;
  rarity: string;
  utilityMoves?: string[];
  specialty?: string;
  habitats: string[]; // Habitat names
  evolution?: {
    from?: string;
    to?: string;
    method?: string;
  };
}
```

### 3. Map Scraper (Priority: MEDIUM)
```typescript
// Target: MapGenie interactive maps
// Output: data/maps/{region}.json

interface MapLocation {
  id: string;
  type: 'pokemon' | 'item' | 'recipe' | 'collectible';
  name: string;
  coordinates: { x: number; y: number };
  region: string;
  details?: Record<string, any>;
}
```

### 4. Recipe Scraper (Priority: MEDIUM)
```typescript
// Target: Serebii cooking + IGN DIY
// Output: data/recipes.json

interface Recipe {
  id: string;
  name: string;
  type: 'cooking' | 'diy';
  ingredients: { name: string; quantity: number }[];
  effect?: string; // What it does
  unlock?: string; // How to get recipe
}
```

---

## Image Assets

### Download List
1. **Pokémon Sprites** - 300 images
   - Source: Serebii or PokeAPI
   - Format: PNG, 96x96 or 128x128

2. **Item Icons** - ~200 images
   - Blocks, furniture, materials
   - Source: In-game screenshots or wiki

3. **Habitat Layouts** - 209 diagrams (CREATE)
   - Grid-based visual showing item placement
   - Tool: Generate programmatically from data

4. **Map Screenshots** - 5 regions
   - Source: In-game or existing guides
   - High-res for zooming

---

## RAG Pipeline

### Chunking Strategy
```
Document Types:
1. Habitat entries → One chunk per habitat
2. Pokémon entries → One chunk per Pokémon
3. Recipe entries → One chunk per recipe
4. Map locations → Grouped by region

Metadata per chunk:
- type: habitat | pokemon | recipe | location
- name: string
- region?: string
- relatedIds: string[] (cross-references)
```

### Embedding Generation
```typescript
// Generate embeddings for each chunk
// Store in pgvector with metadata

const chunks = [
  { 
    id: 'habitat-1',
    text: 'Tall Grass Habitat requires 4 Tall Grass...',
    embedding: [...],
    metadata: { type: 'habitat', name: 'Tall Grass' }
  },
  // ...
];
```

### Query Flow
```
User Query → Embed → Vector Search → Top 5 Chunks
         → LLM with context → Response + Images
```

---

## MVP Timeline

### Week 1: Data Collection
- [ ] Complete habitat scraper ✅ (raw data done)
- [ ] Build Pokédex scraper
- [ ] Run scrapers, validate data
- [ ] Download sprites/images

### Week 2: RAG Setup
- [ ] Set up Supabase + pgvector
- [ ] Build embedding pipeline
- [ ] Test queries, tune chunking
- [ ] Create basic chat API

### Week 3: App Prototype
- [ ] Choose: PWA or React Native
- [ ] Build 4-tab navigation
- [ ] Integrate maps
- [ ] Connect chat to RAG

### Week 4: Polish
- [ ] Generate habitat layout images
- [ ] Add progress tracking
- [ ] Test with real users
- [ ] Prepare for App Store

---

## Monetization

### Freemium Model
- **Free:** 10 questions/day
- **Pro ($4.99 one-time):** Unlimited chat + offline maps
- **Alternative:** $2.99/mo subscription

### IAP Options
- Remove ads: $5.99 (match competitors)
- Pro unlock: $9.99 (unlimited + features)
- Starter pack: $1.99 (50 questions)

---

## Next Steps

1. **Build Pokédex scraper** - Serebii has structured data
2. **Set up Supabase project** - Free tier to start
3. **Prototype RAG queries** - Test with habitat data
4. **Choose app framework** - PWA is fastest to ship

---

## Legal Notes

- Unofficial fan app (like Pokopedia, Pokodex)
- Use fair use disclaimer
- Cite sources where appropriate
- Don't rip official assets directly - use screenshots/fair use
- Consider reaching out to Nintendo for licensing if successful
