'use client';

import { useAppStore } from "@/lib/store";
import { ArrowLeft, User, Crown, RefreshCw, Info, Moon, Sun } from "lucide-react";
import { useState } from "react";

export function AccountPage() {
  const { setCurrentPage, user, setPremium, restorePurchases, darkMode, toggleDarkMode } = useAppStore();
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      restorePurchases();
      
      try {
        const { Purchases } = await import('@revenuecat/purchases-capacitor');
        const { customerInfo } = await Purchases.getCustomerInfo();
        const hasPro = customerInfo.activeSubscriptions.includes('pro');
        if (hasPro) {
          setPremium(true);
        }
      } catch (e) {
        console.log('RevenueCat not available');
      }
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-600 to-slate-800">
      {/* Header */}
      <div className="pt-6 pb-3 px-4 shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setCurrentPage("home")}
            className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Account</h1>
            <p className="text-xs text-white/70">Premium & purchases</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-y-auto">
        <div className="p-4 space-y-4">
          
          {/* Dark Mode Toggle */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                <span className="font-medium text-gray-900 dark:text-white text-sm">Dark Mode</span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`w-12 h-7 rounded-full transition-colors duration-200 ${darkMode ? 'bg-indigo-500' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {/* Account Section */}
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <User className="w-4 h-4" />
                Account
              </h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">User ID</span>
                <span className="text-xs font-mono text-gray-400">{user.userId?.slice(0, 8) || '---'}...</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Premium Status</span>
                {user.isPremium ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                    <Crown className="w-3 h-3" />
                    Active
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Free</span>
                )}
              </div>
              {user.premiumPurchaseDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Purchased</span>
                  <span className="text-xs text-gray-400">
                    {new Date(user.premiumPurchaseDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Premium Section */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl overflow-hidden border border-amber-200">
            <div className="px-4 py-3 border-b border-amber-100">
              <h2 className="font-bold text-amber-900 flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Premium
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {user.isPremium ? (
                <div className="text-center py-4">
                  <Crown className="w-12 h-12 text-amber-500 mx-auto mb-2" />
                  <p className="font-bold text-amber-900">Premium Active</p>
                  <p className="text-xs text-amber-700 mt-1">Thank you for your support!</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-amber-800">
                    Remove all ads and support development!
                  </p>
                  <ul className="text-xs text-amber-700 space-y-1">
                    <li>✓ No banner ads</li>
                    <li>✓ No interstitial ads</li>
                    <li>✓ Support future updates</li>
                  </ul>
                  <button
                    onClick={() => {
                      setPremium(true);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold rounded-xl active:scale-95 transition-transform"
                  >
                    Remove Ads - $2.99
                  </button>
                </>
              )}
              
              <button
                onClick={handleRestorePurchases}
                disabled={isRestoring}
                className="w-full py-2 bg-white border border-amber-200 text-amber-800 text-sm font-medium rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRestoring ? 'animate-spin' : ''}`} />
                {isRestoring ? 'Restoring...' : 'Restore Purchases'}
              </button>
            </div>
          </div>

          {/* About */}
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Info className="w-4 h-4" />
                About
              </h2>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Version</span>
                <span className="text-xs text-gray-400">1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Developer</span>
                <span className="text-xs text-gray-400">BEK Tech</span>
              </div>
            </div>
          </div>

          {/* Bottom padding */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}
