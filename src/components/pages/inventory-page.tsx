'use client'

import { useAppStore } from "@/lib/store";
import { items } from "@/lib/pokemon-data";
import { ArrowLeft, Package, Plus, Minus, Pill, CircleDot, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const categoryIcons: Record<string, typeof Package> = {
  Medicine: Pill,
  "Poké Balls": CircleDot,
  Items: Sparkles,
};

const categoryColors: Record<string, string> = {
  Medicine: "bg-gradient-to-br from-pink-400 to-pink-500",
  "Poké Balls": "bg-gradient-to-br from-red-400 to-red-500",
  Items: "bg-gradient-to-br from-yellow-400 to-yellow-500",
};

export function InventoryPage() {
  const { setCurrentPage } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [itemQuantities, setItemQuantities] = useState<Record<number, number>>(
    Object.fromEntries(items.map(item => [item.id, item.quantity]))
  );

  const categories = [...new Set(items.map(item => item.category))];
  
  const filteredItems = selectedCategory
    ? items.filter(item => item.category === selectedCategory)
    : items;

  const totalItems = Object.values(itemQuantities).reduce((a, b) => a + b, 0);

  const updateQuantity = (id: number, delta: number) => {
    setItemQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-orange-500 to-orange-600">
      {/* Header */}
      <div className="pt-12 pb-4 px-4">
        <div className="flex items-center gap-4 mb-4">
          <motion.button
            onClick={() => setCurrentPage("home")}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <div>
            <h1 className="text-xl font-bold text-white">Inventory</h1>
            <p className="text-sm text-white/70">{totalItems} items total</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <motion.button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              !selectedCategory 
                ? "bg-white text-orange-600" 
                : "bg-white/20 text-white"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All
          </motion.button>
          {categories.map(category => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === category 
                  ? "bg-white text-orange-600" 
                  : "bg-white/20 text-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content Card */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-hidden">
        <div className="h-full overflow-y-auto p-4">
          {/* Items Grid */}
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map((item, index) => {
              const Icon = categoryIcons[item.category] || Package;
              const quantity = itemQuantities[item.id];
              
              return (
                <motion.div
                  key={item.id}
                  className="bg-gray-50 rounded-2xl p-4 relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Item Image */}
                  <div className="flex justify-center mb-2">
                    <motion.img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-contain"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    />
                  </div>

                  {/* Item Name */}
                  <h3 className="font-bold text-gray-800 text-center text-sm">{item.name}</h3>
                  
                  {/* Category Badge */}
                  <div className="flex justify-center mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs text-white ${categoryColors[item.category]}`}>
                      {item.category}
                    </span>
                  </div>

                  {/* Effect */}
                  <p className="text-xs text-gray-500 text-center mt-2">{item.effect}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-center gap-3 mt-3">
                    <motion.button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>
                    <span className="font-bold text-lg text-gray-800 w-8 text-center">
                      {quantity}
                    </span>
                    <motion.button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Summary */}
          <motion.div 
            className="mt-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-bold text-gray-800 mb-2">Inventory Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-orange-600">{itemQuantities[3] || 0}</p>
                <p className="text-xs text-gray-500">Poké Balls</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-pink-600">
                  {(itemQuantities[1] || 0) + (itemQuantities[2] || 0)}
                </p>
                <p className="text-xs text-gray-500">Potions</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{totalItems}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
