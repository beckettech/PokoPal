'use client'

import { useAppStore } from "@/lib/store";
import { ArrowLeft, Coins, Check, Sparkles, Zap, Crown, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const coinPackages = [
  { 
    id: 1, 
    coins: 1000, 
    price: "$0.99", 
    bonus: 0,
    icon: Coins,
    color: "from-blue-400 to-blue-500",
    popular: false 
  },
  { 
    id: 2, 
    coins: 3500, 
    price: "$2.99", 
    bonus: 0,
    icon: Zap,
    color: "from-yellow-400 to-orange-500",
    popular: true 
  },
  { 
    id: 3, 
    coins: 7500, 
    price: "$4.99", 
    bonus: 0,
    icon: Sparkles,
    color: "from-purple-400 to-pink-500",
    popular: false 
  },
  { 
    id: 4, 
    coins: 20000, 
    price: "$9.99", 
    bonus: 0,
    icon: Crown,
    color: "from-amber-400 to-yellow-500",
    popular: false 
  },
];

// Random Pokémon sprites for daily stamp collection
const STAMP_POKEMON = [1, 4, 7, 25, 39, 54, 63, 92, 129, 133, 143, 147, 150, 151, 155, 196, 248, 384, 448, 658];

const dailyRewards = [
  { day: 1, coins: 50, claimed: false },
  { day: 2, coins: 100, claimed: false },
  { day: 3, coins: 150, claimed: false },
  { day: 4, coins: 200, claimed: false },
  { day: 5, coins: 250, claimed: false },
];

export function CoinShopPage() {
  const { setCurrentPage, coins, addCoins } = useAppStore();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePurchase = (pkg: typeof coinPackages[0]) => {
    setSelectedPackage(pkg.id);
    setTimeout(() => {
      addCoins(pkg.coins);
      setSelectedPackage(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 1500);  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-amber-500 to-yellow-600 dark:from-amber-900 dark:to-yellow-950">
      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center mx-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-3"
              >
                <Check className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Purchase Complete!</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Coins added to your balance</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="pt-12 pb-4 px-4">
        <div className="flex items-center justify-between mb-4">
          <motion.button
            onClick={() => setCurrentPage("home")}
            className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </motion.button>
          <h1 className="text-lg font-bold text-white">Coin Shop</h1>
          <div className="w-9" />
        </div>

        {/* Current Balance */}
        <motion.div 
          className="bg-white/20 rounded-xl p-3 text-center"
          animate={{ scale: showSuccess ? [1, 1.05, 1] : 1 }}
        >
          <p className="text-xs text-white/70 mb-1">Your Balance</p>
          <div className="flex items-center justify-center gap-2">
            <Coins className="w-6 h-6 text-yellow-300" />
            <span className="text-3xl font-bold text-white">{coins}</span>
          </div>
          <p className="text-xs text-white/50 mt-1">Coins</p>
        </motion.div>
      </div>

      {/* Content Card */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-t-[2rem] overflow-hidden">
        <div className="h-full overflow-y-auto">
          {/* Coin Packages */}
          <div className="p-3">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Purchase Coins</h2>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2">
              Use coins to chat with your Pokopia assistant!
            </p>

            <div className="grid grid-cols-2 gap-2">
              {coinPackages.map((pkg) => {
                const Icon = pkg.icon;
                const isLoading = selectedPackage === pkg.id;

                return (
                  <motion.button
                    key={pkg.id}
                    onClick={() => handlePurchase(pkg)}
                    disabled={selectedPackage !== null}
                    className={`relative p-3 rounded-xl text-white overflow-hidden bg-gradient-to-br ${pkg.color} ${
                      pkg.popular ? 'col-span-2' : ''
                    }`}
                    whileHover={{ scale: selectedPackage ? 1 : 1.02 }}
                    whileTap={{ scale: selectedPackage ? 1 : 0.98 }}
                  >
                    {pkg.popular && (
                      <div className="absolute top-1 right-1">
                        <span className="text-[8px] px-1.5 py-0.5 bg-white/30 rounded-full font-bold">
                          BEST VALUE
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Icon className="w-5 h-5" />
                          </motion.div>
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-lg">{pkg.coins.toLocaleString()}</span>
                        </div>
                        <span className="text-xs opacity-80">{pkg.price}</span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Daily Rewards */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-700">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Daily Login Rewards</h2>
            <div className="grid grid-cols-5 gap-2">
              {dailyRewards.map((reward) => {
                const stampPokemon = STAMP_POKEMON[(reward.day - 1) % STAMP_POKEMON.length];
                return (
                  <motion.button
                    key={reward.day}
                    className="text-center p-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { addCoins(reward.coins); }}
                  >
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">Day {reward.day}</p>
                    <img
                      src={`/pokemon/${String(stampPokemon).padStart(3, '0')}.png`}
                      alt="Stamp"
                      className="w-10 h-10 mx-auto object-contain drop-shadow-sm"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-1">+{reward.coins}</p>
                  </motion.button>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-2">
              Tap to claim! Resets daily • 800 coins total
            </p>
          </div>

          {/* Info */}
          <div className="p-3">
            <div className="bg-amber-50 rounded-xl p-3">
              <h3 className="text-xs font-bold text-amber-800 mb-1">What are Coins?</h3>
              <p className="text-xs text-amber-700">
                Coins let you chat with Dexter, your Pokopia assistant. Each question costs 150 coins. 
                You started with 250 coins for free!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
