'use client'

import { useAppStore } from "@/lib/store";
import { cloudIslandsPosts } from "@/lib/pokemon-data";
import { ArrowLeft, Heart, Share2, ChevronRight, TrendingUp, Clock, Star, X, Upload, Check, BadgeCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";

export function CloudIslandsPage() {
  const { setCurrentPage } = useAppStore();
  const [sortBy, setSortBy] = useState<"recent" | "popular">("popular"); // Default to popular
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareForm, setShareForm] = useState({ title: "", description: "", islandCode: "" });
  const [shareImages, setShareImages] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sortedPosts = [...cloudIslandsPosts].sort((a, b) => {
    if (sortBy === "popular") return b.likes - a.likes;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const featuredPosts = sortedPosts.filter(p => p.isFeatured);
  const regularPosts = sortedPosts.filter(p => !p.isFeatured);

  const handleShareSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setShowShareModal(false);
      setSubmitted(false);
      setShareForm({ title: "", description: "", islandCode: "" });
      setShareImages([]);
    }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).slice(0, 3 - shareImages.length).forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            newImages.push(ev.target.result as string);
            if (newImages.length === Math.min(files.length, 3 - shareImages.length)) {
              setShareImages(prev => [...prev, ...newImages].slice(0, 3));
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-cyan-500 to-cyan-600">
      {/* Header */}
      <div className="pt-6 pb-2 px-4">
        <div className="flex items-center justify-between mb-2">
          <motion.button
            onClick={() => setCurrentPage("home")}
            className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </motion.button>
          <h1 className="text-lg font-bold text-white">Cloud Islands</h1>
          <motion.button
            onClick={() => setCurrentPage("dream-islands")}
            className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Star className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        {/* Sort Toggle - Recent on left, Popular on right (default) */}
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
          {/* Featured Posts */}
          {featuredPosts.map((post) => (
            <motion.div
              key={post.id}
              className="p-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={`rounded-xl p-3 text-white ${post.isOfficial ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
                <div className="flex items-center gap-1 mb-2">
                  {post.isOfficial ? (
                    <BadgeCheck className="w-4 h-4 text-white" />
                  ) : (
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  )}
                  <span className="text-xs font-medium">{post.isOfficial ? 'Official' : 'Featured'}</span>
                </div>
                <h3 className="font-bold text-lg">{post.title}</h3>
                <p className="text-xs text-white/80 mt-1">{post.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-lg font-mono">
                      {post.islandCode}
                    </span>
                    <span className="text-xs">by {post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-red-400 text-red-400" />
                    <span className="text-xs">{post.likes.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

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

      {/* Share Button */}
      <button
        onClick={() => setShowShareModal(true)}
        className="absolute bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full shadow-lg flex items-center justify-center"
      >
        <Share2 className="w-6 h-6 text-white" />
      </button>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-end z-50"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full bg-white rounded-t-[2rem] p-6 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">Share Your Island</h2>
                <button onClick={() => setShowShareModal(false)}>
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="text-lg font-bold text-gray-800">Submitted!</p>
                  <p className="text-sm text-gray-500">Your island will be reviewed shortly</p>
                </div>
              ) : (
                <>
                  {/* Title */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                    <input
                      type="text"
                      value={shareForm.title}
                      onChange={(e) => setShareForm({ ...shareForm, title: e.target.value })}
                      placeholder="My Awesome Island"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                    <textarea
                      value={shareForm.description}
                      onChange={(e) => setShareForm({ ...shareForm, description: e.target.value })}
                      placeholder="Describe your island..."
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                    />
                  </div>

                  {/* Island Code */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Island Code</label>
                    <input
                      type="text"
                      value={shareForm.islandCode}
                      onChange={(e) => setShareForm({ ...shareForm, islandCode: e.target.value.toUpperCase() })}
                      placeholder="XXXX-0000"
                      maxLength={9}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 uppercase"
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="mb-6">
                    <label className="block text-xs font-medium text-gray-600 mb-2">Screenshots (up to 3)</label>
                    <div className="flex gap-2">
                      {shareImages.map((img, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                          <img src={img} className="w-full h-full object-cover" />
                          <button
                            onClick={() => setShareImages(shareImages.filter((_, idx) => idx !== i))}
                            className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                      {shareImages.length < 3 && (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400"
                        >
                          <Upload className="w-5 h-5" />
                          <span className="text-[10px] mt-1">Upload</span>
                        </button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleShareSubmit}
                    disabled={!shareForm.title || !shareForm.islandCode}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                      shareForm.title && shareForm.islandCode
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    Submit Island
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
