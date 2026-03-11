# Pokopia Guide App

A RAG-powered companion app for Pokémon Pokopia on Nintendo Switch 2.

## 🎯 Features

- **Map Tab** - Interactive maps for all 5 regions
- **Pokédex Tab** - All 300 Pokémon with details & sprites
- **Environment Dex Tab** - All 209 habitats with visual layouts
- **Chat Tab** - AI Q&A with images

## 🛠 Tech Stack

- **Frontend:** Next.js + Tailwind CSS
- **Scraping:** Puppeteer + Cheerio
- **RAG:** OpenAI embeddings + Supabase pgvector
- **LLM:** GPT-4o-mini

## 📁 Project Structure

```
pokopia-guide/
├── data/           # Scraped JSON data
├── scrapers/       # Scraping scripts
├── src/            # Next.js app
├── assets/         # Images & sprites
│   ├── sprites/    # Pokémon sprites
│   ├── habitats/   # Habitat diagrams
│   └── maps/       # Map screenshots
└── README.md
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run scrapers to collect data
npm run scrape:all

# Start dev server
npm run dev
```

## 📊 Data Sources

Primary: [Game8 Wiki](https://game8.co/games/Pokemon-Pokopia)
Backup: Serebii, Eurogamer, MapGenie

See `data/DATA-SOURCES.md` for full list.

## 📜 Legal

Unofficial fan app - not affiliated with Nintendo/Game Freak/The Pokémon Company.
Uses fair use for images and content.
