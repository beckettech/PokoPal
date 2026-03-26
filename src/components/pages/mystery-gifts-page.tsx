'use client'

import { useAppStore } from "@/lib/store";
import { ArrowLeft, Gift, Check, Plus, Clock, Wifi, Hash } from "lucide-react";

const GIFTS = [
  {
    id: "commemorative-gift-set",
    name: "Pokopia Release Commemorative Gift Set",
    method: "Serial Code",
    methodType: "code" as const,
    items: ["2× Leppa Berry", "2× Fresh Carrot", "2× Beans"],
    itemImages: ["/items/leppaberry.png", "/items/freshcarrot.png", "/items/beans.png"],
    codeNote: "Code from Japanese Pokémon Info account on X (available until March 5, 2026)",
    availability: "Feb 27, 2026 – Feb 28, 2027",
    active: true,
  },
  {
    id: "ditto-rug",
    name: "Ditto Rug",
    method: "Internet",
    methodType: "internet" as const,
    items: ["Ditto Rug (decorative item)"],
    itemImages: ["/items/dittorug.png"],
    codeNote: "Early purchase bonus — also obtainable through normal gameplay",
    availability: "Mar 5, 2026 – Jan 31, 2027",
    active: true,
  },
];

export function MysteryGiftsPage() {
  const { setCurrentPage, claimedGifts = [], toggleClaimedGift } = useAppStore() as any;

  const claimedCount = GIFTS.filter(g => claimedGifts.includes(g.id)).length;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-pink-500 to-purple-600 dark:from-pink-900 dark:to-purple-950">
      {/* Header */}
      <div className="pt-6 pb-3 px-4 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setCurrentPage("home")}
            className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">Mystery Gifts</h1>
          <div className="w-11" />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{claimedCount}</p>
            <p className="text-[10px] text-white/70">Claimed</p>
          </div>
          <div className="w-px h-8 bg-white/30" />
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{GIFTS.length - claimedCount}</p>
            <p className="text-[10px] text-white/70">Unclaimed</p>
          </div>
        </div>

        {/* How to claim note */}
        <p className="text-center text-white/60 text-[10px] mt-2">
          Claim at the PC outside any Pokémon Center → Get Items
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-t-[2rem] overflow-y-auto">
        <div className="p-4 space-y-3">
          {GIFTS.map((gift) => {
            const isClaimed = claimedGifts.includes(gift.id);
            return (
              <div
                key={gift.id}
                className={`rounded-2xl border p-4 transition-all ${
                  isClaimed ? "bg-green-50 border-green-200" : "bg-white dark:bg-gray-800 border-gray-100 shadow-sm"
                }`}
              >
                {/* Top row */}
                <div className="flex items-start gap-3">
                  {/* Gift icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isClaimed ? "bg-green-100" : "bg-gradient-to-br from-pink-400 to-purple-500"
                  }`}>
                    <Gift className={`w-6 h-6 ${isClaimed ? "text-green-500" : "text-white"}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-sm leading-tight ${isClaimed ? "text-gray-500 dark:text-gray-400 dark:text-gray-500" : "text-gray-800"}`}>
                      {gift.name}
                    </h3>

                    {/* Method badge */}
                    <div className="flex items-center gap-1.5 mt-1">
                      {gift.methodType === "code"
                        ? <Hash className="w-3 h-3 text-blue-500" />
                        : <Wifi className="w-3 h-3 text-purple-500" />
                      }
                      <span className={`text-[11px] font-medium ${
                        gift.methodType === "code" ? "text-blue-600" : "text-purple-600"
                      }`}>
                        {gift.method}
                      </span>
                    </div>
                  </div>

                  {/* Claimed button */}
                  <button
                    onClick={() => toggleClaimedGift(gift.id)}
                    className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-all ${
                      isClaimed
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                    }`}
                  >
                    {isClaimed ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </button>
                </div>

                {/* Items */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {gift.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 rounded-xl px-2.5 py-1.5">
                      {gift.itemImages[i] && (
                        <img
                          src={gift.itemImages[i]}
                          alt={item}
                          className="w-6 h-6 object-contain"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      )}
                      <span className="text-xs text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Details */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-start gap-1.5 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-400 dark:text-gray-500" />
                    <span>{gift.availability}</span>
                  </div>
                  <p className="text-xs text-gray-400 pl-5">{gift.codeNote}</p>
                </div>
              </div>
            );
          })}

          {/* Info card */}
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
            <p className="text-xs font-bold text-purple-800 mb-2">📋 How to Redeem</p>
            <ul className="space-y-1 text-xs text-purple-700">
              <li>1. Play for ~30 min to unlock Pokémon Center access</li>
              <li>2. Go to the PC outside any Pokémon Center</li>
              <li>3. Select <strong>Get Items</strong></li>
              <li>4. Choose <strong>Via Internet</strong> or <strong>Via Serial Code</strong></li>
              <li>5. Nintendo account required (no Online subscription needed)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
