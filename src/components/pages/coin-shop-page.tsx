'use client'

import { useAppStore } from "@/lib/store";
import { ArrowLeft, Coins, Check, Sparkles, Zap, Crown, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const coinPackages = [
  { 
    id: 1, 
    coins: 50, 
    price: "$0.99", 
    bonus: 0,
    icon: Coins,
    color: "from-blue-400 to-blue-500",
    popular: false 
  },
  { 
    id: 2, 
    coins: 150, 
    price: "$2.99", 
    bonus: 20,
    icon: Zap,
    color: "from-yellow-400 to-orange-500",
    popular: true 
  },
  { 
    id: 3, 
    coins: 500, 
    price: "$9.99", 
    bonus: 100,
    icon: Sparkles,
    color: "from-purple-400 to-pink-500",
    popular: false 
  },
  { 
    id: 4, 
    coins: 1200, 
    price: "$19.99", 
    bonus: 300,
    icon: Crown,
    color: "from-amber-400 to-yellow-500",
    popular: false 
  },
];

const dailyRewards = [
  { day: 1, coins: 10, claimed: false },
  { day: 2, coins: 15, claimed: false },
  { day: 3, coins: 20, claimed: false },
  { day: 4, coins: 25, claimed: false },
  { day: 5, coins: 30, claimed: false },
  { day: 6, coins: 40, claimed: false },
  { day: 7, coins: 50, claimed: false },
];

export function CoinShopPage() {
  const { setCurrentPage, coins, addCoins } = useAppStore();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePurchase = (pkg: typeof coinPackages[0]) => {
    setSelectedPackage(pkg.id);
    setTimeout(() => {
      addCoins(pkg.coins + pkg.bonus);
      setSelectedPackage(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-amber-500 to-yellow-600">
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
              className="bg-white rounded-2xl p-6 text-center mx-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-3"
              >
                <Check className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-lg font-bold text-gray-800">Purchase Complete!</h2>
              <p className="text-sm text-gray-500 mt-1">Coins added to your balance</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="pt-12 pb-4 px-4">
        <div className="flex items-center justify-between mb-4">
          <motion.button
            onClick={() => setCurrentPage("home")}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
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
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-hidden">
        <div className="h-full overflow-y-auto">
          {/* Coin Packages */}
          <div className="p-3">
            <h2 className="text-sm font-bold text-gray-700 mb-2">Purchase Coins</h2>
            <p className="text-[10px] text-gray-500 mb-3">
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
                          <span className="font-bold text-lg">{pkg.coins}</span>
                          {pkg.bonus > 0 && (
                            <span className="text-xs text-white/80">+{pkg.bonus} bonus</span>
                          )}
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
          <div className="p-3 border-t border-gray-100">
            <h2 className="text-sm font-bold text-gray-700 mb-2">Daily Login Rewards</h2>
            <div className="grid grid-cols-7 gap-1">
              {dailyRewards.map((reward) => (
                <motion.div
                  key={reward.day}
                  className="text-center p-1.5 rounded-lg bg-amber-50"
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="text-[10px] text-gray-500">Day {reward.day}</p>
                  <Coins className="w-4 h-4 mx-auto text-yellow-500" />
                  <p className="text-[10px] font-bold text-amber-600">+{reward.coins}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="p-3">
            <div className="bg-amber-50 rounded-xl p-3">
              <h3 className="text-xs font-bold text-amber-800 mb-1">What are Coins?</h3>
              <p className="text-xs text-amber-700">
                Coins let you chat with your Pokopia assistant. Each message costs 1 coin. 
                You started with 100 coins for free!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
