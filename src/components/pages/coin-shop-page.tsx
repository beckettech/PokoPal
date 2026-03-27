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

// All packages except the popular one should be full width (col-span-2) to match the popular button
const fullSpanIds = [1, 3, 4];

// Random Pokémon sprites for daily stamp collection
const STAMP_POKEMON = [1, 4, 7, 25, 39, 54, 63, 92, 129, 133, 143, 147, 150, 151, 155, 196, 248, 384, 448, 658];

const dailyRewards = [
  { day: 1, coins: 50 },
  { day: 2, coins: 100 },
  { day: 3, coins: 150 },
  { day: 4, coins: 200 },
  { day: 5, coins: 250 },
];

export function CoinShopPage() {
  const { setCurrentPage, coins, addCoins, coinStamps, coinLastStampDate, claimCoinStamp } = useAppStore();
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
    <div className="h-full flex flex-col bg-gradient-to-b from-amber-500 to-yellow-600 dark:from-amber-500 dark:to-yellow-600">
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
      <div className="pt-8 pb-1 px-4">
        <div className="flex items-center justify-between mb-2">
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
          className="bg-white/20 rounded-xl px-3 py-2 text-center"
          animate={{ scale: showSuccess ? [1, 1.05, 1] : 1 }}
        >
          <div className="flex items-center justify-center gap-2">
            <Coins className="w-5 h-5 text-yellow-300" />
            <span className="text-2xl font-bold text-white">{coins}</span>
          </div>
        </motion.div>
      </div>

      {/* Content Card */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-t-[2rem] overflow-hidden">
        <div className="h-full overflow-y-auto">
          {/* Daily Stamp Rewards */}
          <div className="p-3">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Daily Stamp Rewards</h2>
            <div className="flex justify-center gap-3">
              {dailyRewards.map((reward) => {
                const stampPokemon = STAMP_POKEMON[(reward.day - 1) % STAMP_POKEMON.length];
                const isClaimed = coinStamps.includes(reward.day);
                const nextDay = coinStamps.length + 1;
                const isCurrent = reward.day === nextDay;
                const isLocked = reward.day > nextDay;
                const alreadyToday = coinLastStampDate === new Date().toDateString();

                return (
                  <motion.button
                    key={reward.day}
                    className={`relative flex flex-col items-center ${isLocked ? 'opacity-40 cursor-not-allowed' : isCurrent && !alreadyToday ? 'cursor-pointer' : isClaimed ? 'cursor-default' : 'cursor-default'}`}
                    whileHover={!isLocked && isCurrent && !alreadyToday ? { scale: 1.08 } : {}}
                    whileTap={!isLocked && isCurrent && !alreadyToday ? { scale: 0.92 } : {}}
                    onClick={() => { claimCoinStamp(5, dailyRewards.map(r => r.coins)); }}
                    disabled={isLocked || isClaimed || alreadyToday}
                  >
                    <div
                      className={`w-14 h-14 rounded-full border-3 flex items-center justify-center overflow-hidden transition-all ${
                        isClaimed
                          ? 'border-green-400 bg-green-50 dark:bg-green-900/30'
                          : isCurrent && !alreadyToday
                          ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 animate-pulse'
                          : 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800'
                      }`}
                    >
                      {isClaimed ? (
                        <img
                          src={`/pokemon/${String(stampPokemon).padStart(3, '0')}.png`}
                          alt="Stamp"
                          className="w-10 h-10 object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">?</span>
                      )}
                      {isClaimed && (
                        <div className="absolute top-0 right-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Day {reward.day}</p>
                    <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400">+{reward.coins}</p>
                  </motion.button>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-2">
              Tap once per day! • 800 coins total
            </p>
          </div>

          {/* Info */}
          <div className="px-3 pb-3">
            <div className="bg-amber-50 rounded-xl p-3">
              <h3 className="text-xs font-bold text-amber-800 mb-1">What are Coins?</h3>
              <p className="text-xs text-amber-700">
                Coins let you chat with Dexter, your Pokopia assistant. Each question costs 150 coins. 
                You started with 250 coins for free!
              </p>
            </div>
          </div>

          {/* Coin Packages */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-700">
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
                      pkg.popular || fullSpanIds.includes(pkg.id) ? 'col-span-2' : ''
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
        </div>
      </div>
    </div>
  );
}
