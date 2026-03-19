'use client'

import { useAppStore } from "@/lib/store";
import { cloudIslandsPosts } from "@/lib/pokemon-data";
import { ArrowLeft, Heart, Star, Sparkles, Crown, ExternalLink, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// Dream Island doll previews
const DOLL_PREVIEWS = [
  { id: 1, name: "Pikachu", image: "https://www.serebii.net/pokemonpokopia/dreamislands/pikachu.png" },
  { id: 2, name: "Eevee", image: "https://www.serebii.net/pokemonpokopia/dreamislands/eevee.png" },
  { id: 3, name: "Snorlax", image: "https://www.serebii.net/pokemonpokopia/dreamislands/snorlax.png" },
  { id: 4, name: "Charizard", image: "https://www.serebii.net/pokemonpokopia/dreamislands/charizard.png" },
  { id: 5, name: "Gengar", image: "https://www.serebii.net/pokemonpokopia/dreamislands/gengar.png" },
  { id: 6, name: "Dragonite", image: "https://www.serebii.net/pokemonpokopia/dreamislands/dragonite.png" },
  { id: 7, name: "Lucario", image: "https://www.serebii.net/pokemonpokopia/dreamislands/lucario.png" },
  { id: 8, name: "Mew", image: "https://www.serebii.net/pokemonpokopia/dreamislands/mew.png" },
];

// Focus items
const FOCUS_ITEMS = [
  { id: 1, name: "Moon Ball", image: "https://www.serebii.net/pokemonpokopia/focus/moonball.png", description: "Increases rare Pokemon spawns" },
  { id: 2, name: "Lure Module", image: "https://www.serebii.net/pokemonpokopia/focus/lure.png", description: "Attracts more Pokemon to the area" },
  { id: 3, name: "Lucky Egg", image: "https://www.serebii.net/pokemonpokopia/focus/luckyegg.png", description: "Boosts experience gained" },
  { id: 4, name: "Star Piece", image: "https://www.serebii.net/pokemonpokopia/focus/starpiece.png", description: "Increases coin rewards" },
  { id: 5, name: "Incense", image: "https://www.serebii.net/pokemonpokopia/focus/incense.png", description: "Spawns additional wild Pokemon" },
  { id: 6, name: "Mystery Box", image: "https://www.serebii.net/pokemonpokopia/focus/mysterybox.png", description: "Contains random rare items" },
];

export function DreamIslandsPage() {
  const { setCurrentPage } = useAppStore();
  const [selectedTab, setSelectedTab] = useState<'featured' | 'dolls' | 'focus'>('featured');
  const [selectedDoll, setSelectedDoll] = useState<typeof DOLL_PREVIEWS[0] | null>(null);

  const dreamPosts = cloudIslandsPosts.filter(p => p.isDream);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-purple-600 via-pink-500 to-orange-400">
      {/* Header */}
      <div className="pt-6 pb-2 px-4">
        <div className="flex items-center justify-between mb-2">
          <motion.button
            onClick={() => setCurrentPage("home")}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Dream Islands
          </h1>
          <div className="w-9" />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mt-2">
          {[
            { id: 'featured', label: 'Featured' },
            { id: 'dolls', label: 'Dolls' },
            { id: 'focus', label: 'Focus Items' },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-colors ${
                selectedTab === tab.id
                  ? 'bg-white text-purple-600'
                  : 'bg-white/20 text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content Card */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-3 space-y-4">
            {/* Featured Islands Tab */}
            {selectedTab === 'featured' && (
              <>
                {dreamPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    className={`relative overflow-hidden rounded-2xl ${
                      post.isFeatured 
                        ? 'bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500' 
                        : 'bg-gradient-to-br from-purple-100 to-pink-100'
                    }`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {post.isFeatured && (
                      <div className="absolute top-2 right-2 z-10">
                        <Crown className="w-6 h-6 text-yellow-300 drop-shadow-lg" />
                      </div>
                    )}

                    {/* Screenshots with Dream Island Images */}
                    <div className="grid grid-cols-2 gap-1 p-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div 
                          key={i} 
                          className={`aspect-video rounded-lg overflow-hidden ${
                            post.isFeatured ? 'bg-white/30' : 'bg-white/50'
                          } flex items-center justify-center`}
                        >
                          <img 
                            src={`https://www.serebii.net/pokemonpokopia/dreamislands/island${post.id}-${i}.png`}
                            alt={`Screenshot ${i}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              const parent = (e.target as HTMLImageElement).parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="text-center text-white/60"><svg class="w-8 h-8 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg><p class="text-xs mt-1">Preview</p></div>';
                              }
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Content */}
                    <div className={`p-3 ${post.isFeatured ? 'text-white' : 'text-gray-800'}`}>
                      <h3 className="font-bold text-lg">{post.title}</h3>
                      <p className="text-sm mt-1 opacity-80">{post.description}</p>

                      <div className="flex items-center justify-between mt-3">
                        <div className={`text-xs font-mono px-2 py-1 rounded-lg ${
                          post.isFeatured ? 'bg-white/20' : 'bg-white/60'
                        }`}>
                          {post.islandCode}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs opacity-70">by {post.author}</span>
                          <div className="flex items-center gap-1">
                            <Heart className={`w-4 h-4 ${post.isFeatured ? 'fill-white' : 'fill-red-400 text-red-400'}`} />
                            <span className="text-sm font-bold">{post.likes.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Call to Action */}
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-center text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Sparkles className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-bold">Create Your Dream Island</h3>
                  <p className="text-xs text-white/80 mt-1">
                    Share your island and get featured!
                  </p>
                </motion.div>
              </>
            )}

            {/* Dolls Tab */}
            {selectedTab === 'dolls' && (
              <>
                <div className="mb-3">
                  <h3 className="font-bold text-gray-800 text-sm">Plush Doll Previews</h3>
                  <p className="text-xs text-gray-500">Collectible dolls you can place in your island</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {DOLL_PREVIEWS.map((doll, index) => (
                    <motion.div
                      key={doll.id}
                      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 cursor-pointer border border-purple-100"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedDoll(doll)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-full aspect-square bg-white rounded-lg flex items-center justify-center overflow-hidden mb-2">
                        <img 
                          src={doll.image}
                          alt={doll.name}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <h4 className="font-bold text-gray-800 text-sm text-center">{doll.name}</h4>
                    </motion.div>
                  ))}
                </div>

                {/* More dolls coming */}
                <motion.div
                  className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <ImageIcon className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                  <p className="text-xs text-purple-600">More doll previews coming soon!</p>
                </motion.div>
              </>
            )}

            {/* Focus Items Tab */}
            {selectedTab === 'focus' && (
              <>
                <div className="mb-3">
                  <h3 className="font-bold text-gray-800 text-sm">Focus Items</h3>
                  <p className="text-xs text-gray-500">Special items that enhance your Dream Island experience</p>
                </div>

                <div className="space-y-3">
                  {FOCUS_ITEMS.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 flex items-center gap-3 border border-amber-100"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-amber-200">
                        <img 
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  ))}
                </div>

                {/* Tips */}
                <motion.div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Star className="w-6 h-6 mx-auto mb-2" />
                  <h3 className="font-bold text-center">Pro Tip</h3>
                  <p className="text-xs text-white/90 mt-1 text-center">
                    Combine Focus Items with the right habitat setup for maximum efficiency!
                  </p>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Doll Detail Modal */}
      <AnimatePresence>
        {selectedDoll && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl overflow-hidden z-20"
          >
            <div className="p-4">
              {/* Handle */}
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
              
              {/* Doll Image */}
              <div className="w-full aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                <img 
                  src={selectedDoll.image}
                  alt={selectedDoll.name}
                  className="w-3/4 h-3/4 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>

              <h2 className="text-xl font-bold text-gray-800 text-center mb-2">{selectedDoll.name} Doll</h2>
              <p className="text-sm text-gray-500 text-center mb-4">
                A cute plush doll of {selectedDoll.name} to decorate your Dream Island!
              </p>

              {/* Close Button */}
              <motion.button
                onClick={() => setSelectedDoll(null)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
