'use client';

import { useState, useEffect } from 'react';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Purchases } from '@revenuecat/purchases-capacitor';
import { ADMOB_CONFIG, REVENUECAT_CONFIG } from '@/lib/purchases';
import { useAppStore } from '@/lib/store';

export function MobileAdBanner() {
  const { user, setPremium, setAdsRemoved, isAdmin, adminForceAds } = useAppStore();
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRemoveOption, setShowRemoveOption] = useState(false);

  useEffect(() => {
    // Check if running in Capacitor
    const checkMobile = async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        const isNative = Capacitor.isNativePlatform();
        setIsMobile(isNative);

        // Initialize AdMob on both native and web
        if (REVENUECAT_CONFIG.apiKey && isNative) {
          try {
            await Purchases.configure({
              apiKey: REVENUECAT_CONFIG.apiKey,
            });

            const { customerInfo } = await Purchases.getCustomerInfo();
            const hasPro = customerInfo.activeSubscriptions.includes(
              REVENUECAT_CONFIG.entitlements.pro
            );

            if (hasPro && !user.isPremium) {
              setPremium(true);
            }
          } catch (e) {
            console.log('RevenueCat not configured or purchase check failed');
          }
        }

        // Initialize AdMob (works on both native and web)
        await AdMob.initialize({
          requestTrackingAuthorization: true,
          testingMode: process.env.NODE_ENV === 'development',
        });

        if (!user.adsRemoved) {
          await showBannerAd();
        }
      } catch (error) {
        console.log('Not running in Capacitor or AdMob not available');
      }
    };

    checkMobile();
  }, []);

  const showBannerAd = async () => {
    try {
      // Use test ads in development, production ads otherwise
      const adId = process.env.NODE_ENV === 'development'
        ? ADMOB_CONFIG.test.banner
        : ADMOB_CONFIG.production.banner;

      const options: BannerAdOptions = {
        adId,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
      };

      await AdMob.showBanner(options);
    } catch (error) {
      console.error('Failed to show banner ad:', error);
    }
  };

  const hideBannerAd = async () => {
    try {
      await AdMob.hideBanner();
    } catch (error) {
      console.error('Failed to hide banner ad:', error);
    }
  };

  const handleRemoveAds = async () => {
    setIsLoading(true);
    try {
      if (REVENUECAT_CONFIG.apiKey) {
        // Real RevenueCat purchase flow
        const offerings = await Purchases.getOfferings();
        const package_ = offerings.all?.[REVENUECAT_CONFIG.products.removeAds];

        if (package_) {
          const { customerInfo } = await Purchases.purchasePackage({
            packageIdentifier: package_.identifier,
          });

          const hasPro = customerInfo.activeSubscriptions.includes(
            REVENUECAT_CONFIG.entitlements.pro
          );

          if (hasPro) {
            setPremium(true);
            await hideBannerAd();
          }
        }
      } else {
        // Fallback: simulate purchase for development/testing
        setPremium(true);
        await hideBannerAd();
      }
    } catch (error: any) {
      // User cancelled
      if (error.code === 'PURCHASE_CANCELLED') {
        console.log('Purchase cancelled');
      } else {
        console.error('Purchase failed:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Admin ad override
  if (isAdmin && adminForceAds === "hide") return null;

  // Don't render if ads are removed (unless admin forces show)
  if (user.adsRemoved && !(isAdmin && adminForceAds === "show")) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-gray-200 dark:border-gray-700 px-3 py-2 flex items-center justify-between safe-area-bottom"
      onClick={() => isMobile && setShowRemoveOption(!showRemoveOption)}
    >
      <div className="flex-1 h-[50px] flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs">
        <span>Advertisement</span>
      </div>
      {showRemoveOption && isMobile && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveAds();
          }}
          disabled={isLoading}
          className="ml-2 px-3 py-1.5 bg-cyan-500 text-white text-xs rounded-full font-medium whitespace-nowrap shadow-sm active:scale-95 transition-transform"
        >
          {isLoading ? 'Processing...' : 'Remove Ads $2.99'}
        </button>
      )}
    </div>
  );
}
