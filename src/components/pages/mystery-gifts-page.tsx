'use client'

import { useAppStore } from "@/lib/store";
import { mysteryGifts } from "@/lib/pokemon-data";
import { ArrowLeft, Gift, Clock, CheckCircle, Coins, Package, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const typeIcons: Record<string, typeof Gift> = {
  item: Package,
  pokemon: Sparkles,
  currency: Coins,
  special: Gift,
};

const typeColors: Record<string, string> = {
  item: "from-blue-400 to-blue-500",
  pokemon: "from-purple-400 to-purple-500",
  currency: "from-yellow-400 to-yellow-500",
  special: "from-pink-400 to-pink-500",
};

export function MysteryGiftsPage() {
  const { setCurrentPage } = useAppStore();
  const [gifts, setGifts] = useState(mysteryGifts);

  const handleClaim = (id: number) => {
    setGifts(prev => prev.map(g => 
      g.id === id ? { ...g, claimed: true } : g
    ));
  };

  const unclaimedCount = gifts.filter(g => !g.claimed).length;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-pink-500 to-purple-600">
      {/* Header */}
      <div className="pt-12 pb-4 px-4">
        <div className="flex items-center justify-between mb-2">
          <motion.button
            onClick={() => setCurrentPage("home")}
            className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </motion.button>
          <h1 className="text-lg font-bold text-white">Mystery Gifts</h1>
          <div className="w-9" />
        </div>

        {/* Gift Animation */}
        <motion.div 
          className="flex justify-center"
          animate={{ 
            y: [0, -10, 0],
            rotate: [-5, 5, -5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Gift className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        {unclaimedCount > 0 && (
          <p className="text-center text-white/80 text-xs mt-2">
            🎁 {unclaimedCount} gift{unclaimedCount > 1 ? 's' : ''} waiting for you!
          </p>
        )}
      </div>

      {/* Content Card */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-3 space-y-3">
            {gifts.map((gift, index) => {
              const Icon = typeIcons[gift.type] || Gift;
              const colorClass = typeColors[gift.type] || "from-gray-400 to-gray-500";

              return (
                <motion.div
                  key={gift.id}
                  className={`rounded-xl p-3 relative overflow-hidden ${
                    gift.claimed ? 'bg-gray-100' : 'bg-white shadow-lg border border-gray-100'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {gift.claimed && (
                    <div className="absolute inset-0 bg-gray-100/50 flex items-center justify-center">
                      <div className="bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Claimed
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{gift.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{gift.description}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Expires: {gift.expiresAt}</span>
                        </div>

                        {!gift.claimed && (
                          <motion.button
                            onClick={() => handleClaim(gift.id)}
                            className="px-4 py-1.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-medium rounded-full"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Claim
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Event Banner */}
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-bold">Spring Celebration Event!</h3>
              <p className="text-xs text-white/80 mt-1">
                Check back daily for new mystery gifts
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
