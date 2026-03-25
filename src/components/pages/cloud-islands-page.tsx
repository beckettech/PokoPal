'use client'

import { useAppStore } from "@/lib/store";
import { cloudIslandsPosts, CloudIslandPost } from "@/lib/pokemon-data";
import { ArrowLeft, Copy, Check, Bookmark, Plus, X, Upload, Image, Key, BadgeCheck, TrendingUp, Clock, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";

export function CloudIslandsPage() {
  const { setCurrentPage, savedIslands = [], toggleSavedIsland } = useAppStore() as any;
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"popular" | "recent">("popular");
  const [filterBy, setFilterBy] = useState<"all" | "saved">("all");
  const [showPostModal, setShowPostModal] = useState(false);
  const [postForm, setPostForm] = useState({ title: "", description: "", islandCode: "" });
  const [postImages, setPostImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: string[] = [];
    Array.from(files).slice(0, 3 - postImages.length).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          newImages.push(ev.target.result as string);
          if (newImages.length === Math.min(files.length, 3 - postImages.length)) {
            setPostImages(prev => [...prev, ...newImages].slice(0, 3));
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmitPost = async () => {
    if (!postForm.title || !postForm.islandCode || postImages.length === 0) return;
    setSubmitting(true);
    
    // Send to API for email review
    try {
      await fetch("/api/submit-island", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: postForm.title,
          description: postForm.description,
          islandCode: postForm.islandCode.toUpperCase(),
          images: postImages,
        }),
      });
      setSubmitted(true);
      setTimeout(() => {
        setShowPostModal(false);
        setSubmitted(false);
        setPostForm({ title: "", description: "", islandCode: "" });
        setPostImages([]);
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter: all or saved only
  const filteredIslands = filterBy === "saved" 
    ? cloudIslandsPosts.filter(i => savedIslands.includes(i.islandCode))
    : cloudIslandsPosts;

  // Sort: popular (saves) or recent (createdAt)
  const sortedIslands = [...filteredIslands].sort((a, b) => {
    if (sortBy === "popular") return b.likes - a.likes;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-cyan-500 to-blue-600">
      {/* Header */}
      <div className="pt-6 pb-2 px-4 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setCurrentPage("home")}
            className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">Cloud Islands</h1>
          <button
            onClick={() => setShowPostModal(true)}
            className="w-11 h-11 rounded-full bg-white flex items-center justify-center active:scale-90 transition-transform shadow-lg"
          >
            <Plus className="w-6 h-6 text-cyan-600" />
          </button>
        </div>

        {/* Sort Toggle */}
        <div className="flex gap-2 bg-white/20 rounded-xl p-1">
          <button
            onClick={() => setSortBy("popular")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
              sortBy === "popular" ? "bg-white text-cyan-600" : "text-white"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Popular
          </button>
          <button
            onClick={() => setSortBy("recent")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
              sortBy === "recent" ? "bg-white text-cyan-600" : "text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Recent
          </button>
        </div>

        {/* Saved Filter */}
        <div className="flex gap-1.5 mt-2">
          <button
            onClick={() => setFilterBy("all")}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
              filterBy === "all" ? "bg-white text-cyan-600" : "bg-white/20 text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterBy("saved")}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
              filterBy === "saved" ? "bg-yellow-400 text-yellow-900" : "bg-white/20 text-white"
            }`}
          >
            <Bookmark className="w-3 h-3" />
            Saved ({savedIslands.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-y-auto">
        <div className="p-3 space-y-3">
          {sortedIslands.map((island, index) => (
            <IslandCard
              key={island.id}
              island={island}
              index={index}
              isSaved={savedIslands.includes(island.islandCode)}
              copiedCode={copiedCode}
              onCopy={handleCopy}
              onToggleSave={() => toggleSavedIsland(island.islandCode)}
            />
          ))}

          {/* How to visit */}
          <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-4 h-4 text-cyan-600" />
              <h3 className="font-bold text-cyan-900 text-sm">How to Visit Islands</h3>
            </div>
            <ol className="space-y-1.5 text-xs text-cyan-800">
              <li>1. Buy <strong>Mysterious Goggles</strong> from PC Shop (Env Level 3)</li>
              <li>2. Use Goggles to browse other players' islands</li>
              <li>3. Enter island code • Requires Nintendo Switch Online</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Post Modal */}
      <AnimatePresence>
        {showPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-end z-50"
            onClick={() => setShowPostModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full bg-white rounded-t-[2rem] p-5 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">Share Your Island</h2>
                <button onClick={() => setShowPostModal(false)}>
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <Check className="w-7 h-7 text-green-500" />
                  </div>
                  <p className="font-bold text-gray-800">Submitted for Review!</p>
                  <p className="text-xs text-gray-500 mt-1">We'll email you once it's approved</p>
                </div>
              ) : (
                <>
                  {/* Title */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
                    <input
                      type="text"
                      value={postForm.title}
                      onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                      placeholder="My Awesome Island"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Short Description *</label>
                    <textarea
                      value={postForm.description}
                      onChange={(e) => setPostForm({ ...postForm, description: e.target.value })}
                      placeholder="What makes your island special?"
                      rows={2}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                    />
                  </div>

                  {/* Island Code */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Island Code *</label>
                    <input
                      type="text"
                      value={postForm.islandCode}
                      onChange={(e) => setPostForm({ ...postForm, islandCode: e.target.value.toUpperCase() })}
                      placeholder="XXXX-0000"
                      maxLength={9}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 uppercase"
                    />
                  </div>

                  {/* Images */}
                  <div className="mb-5">
                    <label className="block text-xs font-medium text-gray-600 mb-2">Screenshots * (1-3)</label>
                    <div className="flex gap-2">
                      {postImages.map((img, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                          <img src={img} className="w-full h-full object-cover" />
                          <button
                            onClick={() => setPostImages(postImages.filter((_, idx) => idx !== i))}
                            className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                      {postImages.length < 3 && (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400"
                        >
                          <Image className="w-5 h-5" />
                          <span className="text-[10px] mt-1">{postImages.length === 0 ? "Required" : "Add"}</span>
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

                  <p className="text-[10px] text-gray-400 mb-3 text-center">
                    Your post will be reviewed before appearing publicly
                  </p>

                  {/* Submit */}
                  <button
                    onClick={handleSubmitPost}
                    disabled={!postForm.title || !postForm.islandCode || postImages.length === 0 || submitting}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                      postForm.title && postForm.islandCode && postImages.length > 0 && !submitting
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {submitting ? "Submitting..." : "Submit for Review"}
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

// Island Card Component
function IslandCard({
  island,
  index,
  isSaved,
  copiedCode,
  onCopy,
  onToggleSave,
}: {
  island: CloudIslandPost;
  index: number;
  isSaved: boolean;
  copiedCode: string | null;
  onCopy: (code: string) => void;
  onToggleSave: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-2xl border overflow-hidden ${
        island.isOfficial ? "bg-purple-50/50 border-purple-100" :
        isSaved ? "bg-yellow-50/50 border-yellow-200" : "bg-white border-gray-100"
      }`}
    >
      {/* Official badge */}
      {island.isOfficial && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold bg-purple-100 text-purple-700">
          <BadgeCheck className="w-3 h-3" />
          OFFICIAL
        </div>
      )}

      <div className="p-3">
        {/* Main row */}
        <div className="flex items-start gap-3">
          {/* Image */}
          <div className="w-16 h-16 rounded-xl bg-gray-200 shrink-0 overflow-hidden">
            {island.screenshots[0] ? (
              <img src={island.screenshots[0]} alt={island.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Image className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-gray-800 leading-tight">{island.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{island.description}</p>

            {/* Code + stats */}
            <div className="flex items-center gap-2 mt-2">
              <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-700">
                {island.islandCode}
              </code>
              <button
                onClick={() => onCopy(island.islandCode)}
                className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center"
              >
                {copiedCode === island.islandCode ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3 text-gray-500" />
                )}
              </button>
              <span className="text-[10px] text-gray-400 ml-auto">by {island.author}</span>
            </div>
          </div>
        </div>

        {/* Bottom action row */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Bookmark className="w-3.5 h-3.5" />
            <span className="font-medium">{island.likes.toLocaleString()} saves</span>
          </div>

          <button
            onClick={onToggleSave}
            className={`w-11 h-11 rounded-full flex items-center justify-center active:scale-90 transition-all ${
              isSaved ? "bg-yellow-400 text-yellow-900" : "bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300"
            }`}
          >
            {isSaved ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
