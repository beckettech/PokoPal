import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support – PokoPal",
  description: "Get help with PokoPal, the companion app for Pokémon Pokopia on Nintendo Switch.",
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indo-900 text-white">
      <nav className="bg-black/30 border-b border-purple-500/30 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="https://pokopal.com" className="text-purple-300 hover:text-white font-semibold">
            ← Back to PokoPal
          </a>
          <span className="text-sm text-purple-400">Support</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          PokoPal Support
        </h1>

        <p className="text-lg text-purple-200 mb-10">
          Need help with PokoPal? We're here for you. Reach out through any of the methods below.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300 border-b border-purple-500/50 pb-2">
            📧 Contact Us
          </h2>
          <div className="space-y-4">
            <a
              href="mailto:beck@bek-tech.com"
              className="block bg-purple-800/50 p-4 rounded-lg border border-purple-500/30 hover:border-pink-500/50 transition"
            >
              <h3 className="font-semibold text-pink-400">Email Support</h3>
              <p className="text-purple-300 mt-1">beck@bek-tech.com</p>
              <p className="text-sm text-purple-400 mt-1">We typically respond within 24 hours</p>
            </a>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300 border-b border-purple-500/50 pb-2">
            ❓ Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="bg-purple-800/30 p-4 rounded-lg">
              <h3 className="font-semibold text-pink-400">How do I use PokoPal?</h3>
              <p className="text-purple-200 mt-2">
                PokoPal is a companion app for Pokémon Pokopia on Nintendo Switch. Browse the Pokédex to find all 159 Pokémon,
                check the Habitat Dex for habitat requirements, use the Map to explore locations, and chat with Dexter AI
                for gameplay help.
              </p>
            </div>
            <div className="bg-purple-800/30 p-4 rounded-lg">
              <h3 className="font-semibold text-pink-400">Is my data synced across devices?</h3>
              <p className="text-purple-200 mt-2">
                Yes! Create an account to sync your friends list, discovered habitats, completed quests, and visited
                locations across all your devices.
              </p>
            </div>
            <div className="bg-purple-800/30 p-4 rounded-lg">
              <h3 className="font-semibold text-pink-400">How do I remove ads?</h3>
              <p className="text-purple-200 mt-2">
                You can remove ads by upgrading to PokoPal Premium via a monthly or yearly subscription, or through a
                one-time purchase. Tap the "Remove Ads" button in the app to see available options.
              </p>
            </div>
            <div className="bg-purple-800/30 p-4 rounded-lg">
              <h3 className="font-semibold text-pink-400">What is Dexter AI?</h3>
              <p className="text-purple-200 mt-2">
                Dexter is our AI assistant that answers questions about Pokémon Pokopia gameplay. Ask things like
                "How do I find Charizard?" or "What habitats attract water Pokémon?" and get instant answers.
              </p>
            </div>
            <div className="bg-purple-800/30 p-4 rounded-lg">
              <h3 className="font-semibold text-pink-400">I found a bug. How do I report it?</h3>
              <p className="text-purple-200 mt-2">
                Email us at beck@bek-tech.com with a description of the issue and what device you're using.
                Screenshots help a lot!
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300 border-b border-purple-500/50 pb-2">
            🔒 Privacy & Data
          </h2>
          <p className="text-purple-200">
            Your privacy matters to us. Read our{" "}
            <a href="/privacy" className="text-pink-400 hover:underline">Privacy Policy</a>{" "}
            for details on how we handle your data.
          </p>
        </section>
      </main>

      <footer className="bg-black/30 border-t border-purple-500/30 p-6 text-center text-purple-400 text-sm">
        <p>PokoPal – Your Pokémon Pokopia Companion | <a href="https://pokopal.com" className="text-pink-400 hover:underline">pokopal.com</a></p>
      </footer>
    </div>
  );
}
