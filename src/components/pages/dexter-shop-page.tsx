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
  { day: 1, coins: 10 },
  { day: 2, coins: 15 },
  { day: 3, coins: 20 },
  { day: 4, coins: 25 },
  { day: 5, coins: 30 },
  { day: 6, coins: 40 },
  { day: 7, coins: 50 },
];

export function DexterShopPage() {
  const { setCurrentPage, dexterCoins, addDexterCoins, dexterStamps, dexterLastStampDate, claimDexterStamp } = useAppStore();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePurchase = (pkg: typeof coinPackages[0]) => {
    setSelectedPackage(pkg.id);
    setTimeout(() => {
      addDexterCoins(pkg.coins + pkg.bonus);
      setSelectedPackage(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-violet-600 to-purple-700">
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
              className="bg-white rounded-2xl p-6 text-center"
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
            onClick={() => setCurrentPage("dexter-chat")}
            className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </motion.button>
          <h1 className="text-lg font-bold text-white">Dexter Shop</h1>
          <div className="w-9" />
        </div>

        {/* Current Balance */}
        <motion.div 
          className="bg-white/20 rounded-xl p-3 text-center"
          animate={{ scale: showSuccess ? [1, 1.05, 1] : 1 }}
        >
          <p className="text-xs text-white/70 mb-1">Your Balance</p>
          <div className="flex items-center justify-center gap-2">
            <Coins className="w-6 h-6 text-yellow-400" />
            <span className="text-3xl font-bold text-white">{dexterCoins}</span>
          </div>
          <p className="text-xs text-white/50 mt-1">Dexter Coins</p>
        </motion.div>
      </div>

      {/* Content Card */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-hidden">
        <div className="h-full overflow-y-auto">
          {/* Coin Packages */}
          <div className="p-3">
            <h2 className="text-sm font-bold text-gray-700 mb-2">Purchase Coins</h2>
            <p className="text-[10px] text-gray-500 mb-2">
              Use Dexter Coins to chat with Dexter and get help with your Pokopia journey!
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

          {/* Daily Stamp Rewards */}
          <div className="p-3 border-t border-gray-100">
            <h2 className="text-sm font-bold text-gray-700 mb-2">Daily Stamp Rewards</h2>
            <div className="flex justify-center gap-2">
              {dailyRewards.map((reward) => {
                const isClaimed = dexterStamps.includes(reward.day);
                const nextDay = dexterStamps.length + 1;
                const isCurrent = reward.day === nextDay;
                const isLocked = reward.day > nextDay;
                const alreadyToday = dexterLastStampDate === new Date().toDateString();

                return (
                  <motion.button
                    key={reward.day}
                    className={`relative flex flex-col items-center ${isLocked ? 'opacity-40 cursor-not-allowed' : isCurrent && !alreadyToday ? 'cursor-pointer' : isClaimed ? 'cursor-default' : 'cursor-default'}`}
                    whileHover={!isLocked && isCurrent && !alreadyToday ? { scale: 1.08 } : {}}
                    whileTap={!isLocked && isCurrent && !alreadyToday ? { scale: 0.92 } : {}}
                    onClick={() => {
                      const result = claimDexterStamp(7, dailyRewards.map(r => r.coins));
                      if (result && addDexterCoins) addDexterCoins(result.coins);
                    }}
                    disabled={isLocked || isClaimed || alreadyToday}
                  >
                    <div
                      className={`w-11 h-11 rounded-full border-2 flex items-center justify-center overflow-hidden transition-all ${
                        isClaimed
                          ? 'border-green-400 bg-green-50'
                          : isCurrent && !alreadyToday
                          ? 'border-purple-400 bg-purple-50 animate-pulse'
                          : 'border-gray-300 bg-gray-100'
                      }`}
                    >
                      {isClaimed ? (
                        <span className="text-lg">⭐</span>
                      ) : (
                        <span className="text-xl font-bold text-gray-400">?</span>
                      )}
                      {isClaimed && (
                        <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-[9px]">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-[9px] text-gray-500 mt-1">D{reward.day}</p>
                    <p className="text-[9px] font-bold text-purple-600">+{reward.coins}</p>
                  </motion.button>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              Tap once per day! • 190 coins total
            </p>
          </div>

          {/* Info */}
          <div className="p-3">
            <div className="bg-blue-50 rounded-xl p-3">
              <h3 className="text-xs font-bold text-blue-800 mb-1">What are Dexter Coins?</h3>
              <p className="text-xs text-blue-600">
                Dexter Coins let you chat with Dexter, your Pokopia assistant. Each message costs 1 coin. 
                You started with 100 coins for free!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
