'use client'

import { useAppStore } from "@/lib/store";
import { cloudIslandsPosts } from "@/lib/pokemon-data";
import { ArrowLeft, Heart, Share2, ChevronRight, TrendingUp, Clock, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function CloudIslandsPage() {
  const { setCurrentPage } = useAppStore();
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");

  const sortedPosts = [...cloudIslandsPosts].sort((a, b) => {
    if (sortBy === "popular") return b.likes - a.likes;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const featuredPost = sortedPosts.find(p => p.isFeatured);
  const regularPosts = sortedPosts.filter(p => !p.isFeatured);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-cyan-500 to-cyan-600">
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
          <h1 className="text-lg font-bold text-white">Cloud Islands</h1>
          <motion.button
            onClick={() => setCurrentPage("dream-islands")}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Star className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        {/* Sort Toggle */}
        <div className="flex gap-2 bg-white/20 rounded-xl p-1">
          <button
            onClick={() => setSortBy("recent")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
              sortBy === "recent" ? "bg-white text-cyan-600" : "text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Recent
          </button>
          <button
            onClick={() => setSortBy("popular")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
              sortBy === "popular" ? "bg-white text-cyan-600" : "text-white"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Popular
          </button>
        </div>
      </div>

      {/* Content Card */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-hidden">
        <div className="h-full overflow-y-auto">
          {/* Featured Post */}
          {featuredPost && (
            <motion.div
              className="p-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-3 text-white">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">Featured</span>
                </div>
                <h3 className="font-bold text-lg">{featuredPost.title}</h3>
                <p className="text-xs text-white/80 mt-1">{featuredPost.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-lg font-mono">
                      {featuredPost.islandCode}
                    </span>
                    <span className="text-xs">by {featuredPost.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-red-400 text-red-400" />
                    <span className="text-xs">{featuredPost.likes.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Regular Posts */}
          <div className="p-3 space-y-3">
            {regularPosts.map((post, index) => (
              <motion.div
                key={post.id}
                className="bg-gray-50 rounded-xl p-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Screenshots Grid */}
                <div className="grid grid-cols-4 gap-1 mb-2">
                  {post.screenshots.length > 0 ? (
                    post.screenshots.slice(0, 4).map((_, i) => (
                      <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
                    ))
                  ) : (
                    [1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-400">{i}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Content */}
                <h3 className="font-bold text-gray-800 text-sm">{post.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{post.description}</p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-mono bg-gray-200 px-2 py-0.5 rounded text-gray-600">
                    {post.islandCode}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{post.author}</span>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500">{post.likes}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
