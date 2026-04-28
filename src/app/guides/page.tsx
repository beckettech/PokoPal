import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pokopia Guides – Tips, Walkthroughs & Strategies | PokoPal",
  description:
    "Complete guides for Pokémon Pokopia on Nintendo Switch. Learn how to befriend Pokémon, build habitats, craft items, explore Dream Islands, and master every game mechanic.",
};

const guides = [
  {
    slug: "beginners-guide",
    title: "Beginner's Guide to Pokopia",
    description:
      "Everything new players need to know about Pokémon Pokopia — controls, basics, and your first steps in building a Pokémon paradise.",
    icon: "🌟",
  },
  {
    slug: "befriend-pokemon",
    title: "How to Befriend Pokémon",
    description:
      "Master the friendship mechanics: habitats, items, time, weather, and strategies for attracting rare and legendary Pokémon.",
    icon: "🤝",
  },
  {
    slug: "habitats-guide",
    title: "Complete Habitat Guide",
    description:
      "All 215 habitat types, what Pokémon they attract, building costs, and placement strategies for every location in Pokopia.",
    icon: "🏡",
  },
  {
    slug: "items-crafting",
    title: "Items & Crafting Guide",
    description:
      "Every item in Pokopia organized by category: materials, food recipes, furniture, decorations, and crafting recipes.",
    icon: "🧪",
  },
  {
    slug: "dream-islands-guide",
    title: "Dream Islands Guide",
    description:
      "Explore Dream Islands and Cloud Islands — rare habitats, exclusive Pokémon, and the social features that make Pokopia unique.",
    icon: "☁️",
  },
];

export default function GuidesIndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 text-white">
      <nav className="bg-black/30 border-b border-purple-500/30 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="https://pokopal.com" className="text-purple-300 hover:text-white font-semibold">
            ← PokoPal Home
          </a>
          <span className="text-sm text-purple-400">Pokopia Guides</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Pokopia Guides
        </h1>
        <p className="text-lg text-purple-200 mb-10">
          Complete walkthroughs and strategy guides for Pokémon Pokopia on Nintendo Switch.
          Whether you're just starting out or hunting legendaries, we've got you covered.
        </p>

        <div className="grid gap-6">
          {guides.map((guide) => (
            <a
              key={guide.slug}
              href={`/guides/${guide.slug}/`}
              className="block bg-purple-800/50 p-6 rounded-xl border border-purple-500/30 hover:border-pink-500/50 hover:bg-purple-800/70 transition group"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{guide.icon}</span>
                <div>
                  <h2 className="text-xl font-semibold text-pink-400 group-hover:text-pink-300">
                    {guide.title} →
                  </h2>
                  <p className="text-purple-300 mt-1">{guide.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        <section className="mt-16 bg-purple-800/30 p-6 rounded-xl border border-purple-500/20">
          <h2 className="text-2xl font-semibold mb-3 text-purple-300">About PokoPal</h2>
          <p className="text-purple-100 leading-relaxed">
            PokoPal is the companion app for Pokémon Pokopia on Nintendo Switch. Track your
            collection of 159 Pokémon, discover all 215 habitat types, complete 60+ quests,
            chat with Dexter AI for gameplay help, and share your island creations with the
            Cloud Islands community. Download the free app or use it right here at pokopal.com.
          </p>
        </section>
      </main>

      <footer className="bg-black/30 border-t border-purple-500/30 p-6 text-center text-purple-400 text-sm">
        <p>PokoPal – Your Pokémon Pokopia Companion | <a href="https://pokopal.com" className="text-pink-400 hover:underline">pokopal.com</a></p>
      </footer>
    </div>
  );
}
