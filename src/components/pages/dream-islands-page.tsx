'use client'

import { useAppStore } from "@/lib/store";
import { cloudIslandsPosts } from "@/lib/pokemon-data";
import { ArrowLeft, Heart, Star, Sparkles, Crown } from "lucide-react";
import { motion } from "framer-motion";

export function DreamIslandsPage() {
  const { setCurrentPage } = useAppStore();

  const dreamPosts = cloudIslandsPosts.filter(p => p.isDream);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-purple-600 via-pink-500 to-orange-400">
      {/* Header */}
      <div className="pt-12 pb-3 px-4">
        <div className="flex items-center justify-between mb-3">
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

        <p className="text-center text-white/80 text-xs">
          ✨ Showcasing the most creative and inspiring islands ✨
        </p>
      </div>

      {/* Content Card */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-3 space-y-4">
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
                  <div className="absolute top-2 right-2">
                    <Crown className="w-6 h-6 text-yellow-300 drop-shadow-lg" />
                  </div>
                )}

                {/* Screenshots */}
                <div className="grid grid-cols-2 gap-1 p-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className={`aspect-video rounded-lg ${
                        post.isFeatured ? 'bg-white/30' : 'bg-white/50'
                      } flex items-center justify-center`}
                    >
                      <Sparkles className={`w-8 h-8 ${post.isFeatured ? 'text-white/60' : 'text-purple-300'}`} />
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
          </div>
        </div>
      </div>
    </div>
  );
}
