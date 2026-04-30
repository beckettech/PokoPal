<p align="center">
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Web-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Pok%C3%A9mon-159%20Collected-ff69b4?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Habitats-215%20Discovered-9cf?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Framework-Next.js%20%2B%20Capacitor-black?style=for-the-badge" />
</p>

<h1 align="center">PokoPal 🧢</h1>
<p align="center"><strong>The companion app for Pokémon Pokopia on Nintendo Switch</strong></p>
<p align="center">Track your collection • Build habitats • Chat with AI • Share your island</p>

---

## ✨ Features

### 🏠 Home Dashboard
Track your progress at a glance — friends collected, habitats discovered, requests completed, and locations explored.

<img src="screenshots/home.png" width="300" />

### 📖 Pokédex
All 159 Pokémon with stats, rarity, specialties, locations, and befriending requirements. Filter by rarity, search by name, and track your collection in real-time.

<img src="screenshots/dex.png" width="300" />

### 🏡 Habitat Dex
Discover all 215 habitat types — what Pokémon they attract, building costs, and where to place them. Essential for completing your collection.

<img src="screenshots/habitat.png" width="300" />

### 🤖 Dexter AI Chat
Ask Dexter anything about Pokopia gameplay. "How do I befriend Entei?" "What habitats attract Bulbasaur?" — get instant, accurate answers powered by AI.

<img src="screenshots/chat.png" width="300" />

### ☁️ Cloud Islands
Share your island creations with the community. Browse other players' islands for inspiration and show off your designs.

<img src="screenshots/cloud.png" width="300" />

### 🌙 Dream Islands
Explore mystical Dream Islands with exclusive Pokémon, rare habitats, and unique rewards.

<img src="screenshots/dream.png" width="300" />

### 🧪 Items & Crafting
Browse 500+ items across 16 categories. Crafting recipes, cooking guides, and material locations — everything you need in one place.

<img src="screenshots/items.png" width="300" />

---

## 📊 By the Numbers

| Feature | Count |
|---------|-------|
| Pokémon | 159 (90 Common, 58 Rare, 10 Legendary) |
| Habitat Types | 215 |
| Items | 500+ |
| Crafting Recipes | 24 cooking + building recipes |
| Quests | 60+ |
| Locations | 6 regions |
| AI Chat Specialties | 23 unique Pokémon skills |

---

## 🛠 Tech Stack

- **Frontend:** Next.js 15 + React 19 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Mobile:** Capacitor (iOS native wrapper)
- **AI Chat:** OpenAI GPT-4o-mini with game-specific context
- **Data:** Custom Puppeteer scrapers (Pokopia Wiki)
- **Hosting:** Vercel (web) + App Store (iOS)
- **Monetization:** RevenueCat (subscriptions) + Google AdSense

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/beckettech/pokopia-guide.git
cd pokopia-guide

# Install dependencies
npm install

# Run the dev server
npm run dev

# Open http://localhost:3000
```

### iOS Build

```bash
# Build for iOS (static export)
BUILD_TARGET=ios npx next build && npx cap sync ios

# Open in Xcode
npx cap open ios
```

---

## 📁 Project Structure

```
pokopia-guide/
├── src/
│   ├── app/              # Next.js routes & pages
│   │   ├── guides/       # SEO-friendly guide articles
│   │   ├── api/          # API routes (game data, AI chat)
│   │   └── privacy/      # Privacy policy
│   ├── components/       # React components
│   │   └── pages/        # Page-level components
│   ├── lib/              # Utilities, store, AI, scrapers
│   └── data/             # Game data JSON files
├── public/               # Static assets (sprites, habitats, maps)
├── screenshots/          # App screenshots for README
└── ios/                  # Capacitor iOS project
```

---

## 💰 Monetization Plan

- **Free tier:** Full app with ads (Google AdSense)
- **Premium:** Remove ads via subscription or one-time purchase (RevenueCat)
- **Coin Shop:** In-app currency for cosmetic items

---

## 🔮 Roadmap

- [ ] Android release (Capacitor)
- [ ] Push notifications for quest reminders
- [ ] Community challenges & leaderboards
- [ ] Offline mode with cached game data
- [ ] AR mode for habitat previews

---

## 📄 License

This project is proprietary. All game data and assets are sourced from the Pokopia Wiki and are used for reference purposes.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/beckettech">Beckett Hoefling</a>
</p>
