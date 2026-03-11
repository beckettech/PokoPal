# Pokopia Guide App

A RAG-powered companion app for Pokémon Pokopia on Nintendo Switch 2.

## 🎯 Concept

Users can ask any question about the game and get instant, helpful answers with images:
- "How do I attract Eevee?"
- "Where can I find Charizard?"
- "What's the layout for the Berry-feast Campsite?"

## 📱 App Structure

### 4 Tabs

1. **Map** - Interactive maps for all 5 regions
   - Spawn locations
   - Collectibles
   - Materials
   - Recipes

2. **Pokédex** - All 300 Pokémon
   - Sprites + details
   - Habitat requirements
   - Evolution chains

3. **Environment Dex** - All 209 habitats
   - Visual layout diagrams
   - Required items
   - Pokémon attracted

4. **Chat** - AI Q&A
   - Natural language queries
   - Returns answer + images
   - Links to relevant tabs

## 📊 Data Collected

- ✅ **Habitat Dex** - All 209 habitats with items + Pokémon (see `habitats.json`)
- ✅ **Pokémon List** - All 300 Pokémon identified
- ⏳ **Map Data** - Interactive map coordinates (to scrape)
- ⏳ **Recipes** - Cooking + DIY (to scrape)
- ⏳ **Sprites** - Pokémon images (to download)

## 🛠 Tech Stack

### Scraping
- Puppeteer / Playwright
- Cheerio

### RAG Pipeline
- OpenAI text-embedding-3-small
- Supabase pgvector
- GPT-4o-mini

### App (Phase 2)
- React Native or PWA
- MapLibre GL

## 📁 Files

```
pokopia-guide/
├── README.md           # This file
├── SCRAPER-PLAN.md     # Detailed technical spec
├── habitats.json       # Structured habitat data (partial)
├── habitats-raw.md     # Raw scraped data
└── pokedex-list.md     # Pokémon list notes
```

## 🚀 Next Steps

1. Build Pokédex scraper (Serebii)
2. Set up Supabase + pgvector
3. Create embedding pipeline
4. Prototype chat API
5. Build app UI

## 💰 Monetization

- **Free:** 10 questions/day
- **Pro ($4.99):** Unlimited + offline maps
- Matches competitor pricing ($5.99 ad removal)

## 📜 Legal

Unofficial fan app - not affiliated with Nintendo/Game Freak/The Pokémon Company.
Uses fair use for images and content.
