'use client'

import { useState, useMemo } from "react";
import { ArrowLeft, Plus, Check, Search, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import itemsData from "@/data/scraped/items.json";

type ItemCategory = typeof itemsData[0];
type Item = typeof itemsData[0]["items"][0];

const CATEGORY_ICONS: Record<string, string> = {
  materials: "⛏️",
  food: "🍞",
  furniture: "🪑",
  misc: "📦",
  outdoor: "🌳",
  utilities: "⚡",
  nature: "🌿",
  buildings: "🏠",
  blocks: "🧱",
  kits: "🎁",
  "key items": "🔑",
  other: "❓",
  "lost relics (l)": "🏺",
  "lost relics (s)": "🦴",
  fossils: "🦕",
};

export function ItemsPage() {
  const { setCurrentPage, ownedItems, toggleOwnedItem } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Flatten all items with category info
  const allItems = useMemo(() => {
    return itemsData.flatMap(cat => 
      cat.items.map(item => ({ ...item, category: cat.name, categorySlug: cat.slug }))
    );
  }, []);

  // Filter items by category and search
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      const matchesCategory = !selectedCategory || item.categorySlug === selectedCategory;
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allItems, selectedCategory, searchQuery]);

  // Group filtered items by category for display
  const groupedItems = useMemo(() => {
    const groups: Record<string, Item[]> = {};
    filteredItems.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  const totalOwned = ownedItems.length;
  const totalItems = allItems.length;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-orange-500 to-orange-600 overflow-hidden">
      {/* Header */}
      <div className="pt-6 pb-3 px-4 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setCurrentPage("home")}
            className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">Items</h1>
          <div className="bg-white/20 px-3 py-1 rounded-full">
            <span className="text-white text-xs font-bold">{totalOwned}/{totalItems}</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCategory === null
                ? "bg-white text-orange-600"
                : "bg-white/20 text-white"
            }`}
          >
            All ({totalItems})
          </button>
          {itemsData.map(cat => {
            const icon = CATEGORY_ICONS[cat.slug] || "📦";
            const count = cat.items.length;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat.slug
                    ? "bg-white text-orange-600"
                    : "bg-white/20 text-white"
                }`}
              >
                {icon} {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-y-auto">
        <div className="p-4">
          {/* Results count */}
          <p className="text-xs text-gray-400 mb-3">
            {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>

          {/* Grouped items */}
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="mb-4">
              {!selectedCategory && (
                <h2 className="text-sm font-bold text-gray-500 mb-2 flex items-center gap-2">
                  <span>{CATEGORY_ICONS[items[0]?.categorySlug] || "📦"}</span>
                  {category}
                  <span className="text-gray-400 font-normal">({items.length})</span>
                </h2>
              )}
              
              <div className="grid grid-cols-2 gap-2">
                {items.map(item => {
                  const owned = ownedItems.includes(item.slug);
                  return (
                    <button
                      key={item.slug}
                      onClick={() => setSelectedItem(item)}
                      className={`relative flex flex-col items-center p-3 rounded-xl border transition-all active:scale-[0.98] ${
                        owned
                          ? "bg-orange-50 border-orange-200"
                          : "bg-gray-50 border-gray-100"
                      }`}
                    >
                      {/* Item image */}
                      <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-2 ${!owned ? "opacity-60" : ""}`}>
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/items/clefairydoll.png";
                          }}
                        />
                      </div>

                      {/* Name */}
                      <span className={`text-xs font-bold text-center line-clamp-2 ${owned ? "text-gray-800" : "text-gray-500"}`}>
                        {item.name}
                      </span>

                      {/* Owned badge */}
                      {owned && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}

                      {/* + button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleOwnedItem(item.slug);
                        }}
                        className={`absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                          owned
                            ? "bg-gray-200 text-gray-400"
                            : "bg-orange-500 text-white"
                        }`}
                      >
                        {owned ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">🔍</p>
              <p>No items found</p>
            </div>
          )}
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-50" onClick={() => setSelectedItem(null)}>
          <div 
            className="w-full bg-white rounded-t-[2rem] p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.name} 
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/items/clefairydoll.png";
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{selectedItem.name}</h3>
                <p className="text-xs text-gray-400">{selectedItem.category}</p>
                {selectedItem.tag && (
                  <span className="inline-block mt-1 text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {selectedItem.tag}
                  </span>
                )}
              </div>
              <button
                onClick={() => toggleOwnedItem(selectedItem.slug)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  ownedItems.includes(selectedItem.slug)
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {ownedItems.includes(selectedItem.slug) ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">{selectedItem.description}</p>

            {/* Locations */}
            {selectedItem.locations.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-500 mb-2">📍 Locations</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedItem.locations.map((loc, i) => (
                    <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                      {loc.name} {loc.method && `(${loc.method})`}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Methods */}
            {selectedItem.methods.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-500 mb-2">💡 How to Get</h4>
                <div className="space-y-1">
                  {selectedItem.methods.map((method, i) => (
                    <p key={i} className="text-xs text-gray-600">• {method}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Note */}
            {selectedItem.note && (
              <div className="bg-yellow-50 rounded-lg p-3">
                <p className="text-xs text-yellow-800">💡 {selectedItem.note}</p>
              </div>
            )}

            <button
              onClick={() => setSelectedItem(null)}
              className="w-full mt-4 py-3 bg-gray-100 rounded-xl text-gray-600 font-bold text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
