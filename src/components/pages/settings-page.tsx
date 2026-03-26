'use client';

import { useAppStore } from "@/lib/store";
import { ArrowLeft, User, Crown, RefreshCw, Shield, Trash2, Info, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function SettingsPage() {
  const { setCurrentPage, user, setPremium, restorePurchases } = useAppStore();
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    try {
      // In a real app, this would call RevenueCat to restore purchases
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 1500));
      restorePurchases();
      
      // Check RevenueCat for existing purchases
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

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.removeItem('pokopia-storage');
      window.location.reload();
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
            <h1 className="text-xl font-bold text-white">Settings</h1>
            <p className="text-xs text-white/70">Account & preferences</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-y-auto">
        <div className="p-4 space-y-4">
          
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
                      // This would trigger the purchase flow
                      // For now, simulate it
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

          {/* Privacy & Legal */}
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Privacy & Legal
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              <a
                href="https://bek-tech.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 active:bg-gray-100"
              >
                <span className="text-sm text-gray-700">Privacy Policy</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
              <a
                href="https://bek-tech.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 active:bg-gray-100"
              >
                <span className="text-sm text-gray-700">Terms of Service</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
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

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-xl overflow-hidden border border-red-200">
            <div className="px-4 py-3 border-b border-red-100">
              <h2 className="font-bold text-red-900">Danger Zone</h2>
            </div>
            <div className="p-4">
              <button
                onClick={handleClearData}
                className="w-full py-2 bg-white border border-red-200 text-red-600 text-sm font-medium rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </button>
              <p className="text-xs text-red-600/60 text-center mt-2">
                This will reset all your progress
              </p>
            </div>
          </div>

          {/* Bottom padding */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}
