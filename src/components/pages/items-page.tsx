'use client'

import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, Plus, Check, Search, X, Filter } from "lucide-react";
import { useAppStore } from "@/lib/store";

type Item = {
  slug: string;
  name: string;
  description: string;
  tag: string | null;
  note: string | null;
  image: string;
  locations: Array<{ slug: string; name: string; method: string | null }>;
  methods: string[];
  category?: string;
  categorySlug?: string;
};

type ItemCategory = {
  name: string;
  slug: string;
  items: Item[];
};

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
  const [itemsData, setItemsData] = useState<ItemCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [ownedFilter, setOwnedFilter] = useState<"all" | "owned" | "unowned">("all");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Fetch items at runtime
  useEffect(() => {
    fetch("/items.json")
      .then(res => res.json())
      .then((data: ItemCategory[]) => {
        // Sort: Lost Relics (L), Lost Relics (S), Fossils first, then alphabetically
        const priorityCategories = ['lost-relics-l', 'lost-relics-s', 'fossils'];
        const sorted = data.sort((a, b) => {
          const aPriority = priorityCategories.indexOf(a.slug);
          const bPriority = priorityCategories.indexOf(b.slug);
          if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority;
          if (aPriority !== -1) return -1;
          if (bPriority !== -1) return 1;
          return 0; // keep original order for others
        });
        setItemsData(sorted);
        // Default to first category
        if (sorted.length > 0 && !selectedCategory) {
          setSelectedCategory(sorted[0].slug);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load items:", err);
        setLoading(false);
      });
  }, []);

  // Flatten all items with category info
  const allItems = useMemo(() => {
    return itemsData.flatMap(cat => 
      cat.items.map(item => ({ ...item, category: cat.name, categorySlug: cat.slug }))
    );
  }, [itemsData]);

  // Filter items by category, search, and owned status
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      const matchesCategory = selectedCategory === item.categorySlug;
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const isOwned = ownedItems.includes(item.slug);
      const matchesOwned = ownedFilter === "all" || 
        (ownedFilter === "owned" && isOwned) ||
        (ownedFilter === "unowned" && !isOwned);
      return matchesCategory && matchesSearch && matchesOwned;
    });
  }, [allItems, selectedCategory, searchQuery, ownedFilter, ownedItems]);

  const totalOwned = ownedItems.length;
  const totalItems = allItems.length;

  // Get current category info
  const currentCategory = itemsData.find(c => c.slug === selectedCategory);

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-orange-500 to-orange-600 overflow-hidden">
        <div className="pt-6 pb-3 px-4 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setCurrentPage("home")}
              className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-lg font-bold text-white">Items</h1>
            <div className="bg-white/20 px-3 py-1 rounded-full">
              <span className="text-white text-xs font-bold">...</span>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-t-[2rem] flex items-center justify-center">
          <p className="text-gray-400">Loading items...</p>
        </div>
      </div>
    );
  }

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
                {icon} {cat.name}
              </button>
            );
          })}
        </div>

        {/* Owned/Unowned Filter */}
        <div className="flex gap-1.5 mt-2">
          <button
            onClick={() => setOwnedFilter("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              ownedFilter === "all"
                ? "bg-white text-orange-600"
                : "bg-white/20 text-white"
            }`}
          >
            All ({currentCategory?.items.length || 0})
          </button>
          <button
            onClick={() => setOwnedFilter("owned")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              ownedFilter === "owned"
                ? "bg-green-500 text-white"
                : "bg-white/20 text-white"
            }`}
          >
            ✓ Owned ({currentCategory?.items.filter(i => ownedItems.includes(i.slug)).length || 0})
          </button>
          <button
            onClick={() => setOwnedFilter("unowned")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              ownedFilter === "unowned"
                ? "bg-gray-600 text-white"
                : "bg-white/20 text-white"
            }`}
          >
            ? Unowned ({currentCategory?.items.filter(i => !ownedItems.includes(i.slug)).length || 0})
          </button>
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

          {/* Items Grid */}
          <div className="grid grid-cols-3 gap-2">
            {filteredItems.map(item => {
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
                  {/* + button - top right */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOwnedItem(item.slug);
                    }}
                    className={`absolute top-1 right-1 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      owned
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {owned ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>

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
                </button>
              );
            })}
          </div>

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
