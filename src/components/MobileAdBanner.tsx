'use client';

import { useState, useEffect } from 'react';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Purchases } from '@revenuecat/purchases-capacitor';
import { ADMOB_CONFIG, REVENUECAT_CONFIG } from '@/lib/purchases';

interface MobileAdBannerProps {
  onRemoveAds?: () => void;
}

export function MobileAdBanner({ onRemoveAds }: MobileAdBannerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [adsRemoved, setAdsRemoved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRemoveOption, setShowRemoveOption] = useState(false);

  useEffect(() => {
    // Check if running in Capacitor
    const checkMobile = async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        const isNative = Capacitor.isNativePlatform();
        setIsMobile(isNative);

        if (isNative) {
          // Initialize RevenueCat if API key is available
          if (REVENUECAT_CONFIG.apiKey) {
            try {
              await Purchases.configure({
                apiKey: REVENUECAT_CONFIG.apiKey,
              });

              // Check if user has active entitlement
              const { customerInfo } = await Purchases.getCustomerInfo();
              const hasPro = customerInfo.activeSubscriptions.includes(
                REVENUECAT_CONFIG.entitlements.pro
              );

              if (hasPro) {
                setAdsRemoved(true);
                localStorage.setItem('adsRemoved', 'true');
              }
            } catch (e) {
              console.log('RevenueCat not configured or purchase check failed');
            }
          }

          // Check localStorage fallback
          const removed = localStorage.getItem('adsRemoved') === 'true';
          setAdsRemoved(removed);

          // Initialize AdMob
          await AdMob.initialize({
            requestTrackingAuthorization: true,
            testingMode: process.env.NODE_ENV === 'development',
          });

          if (!removed) {
            await showBannerAd();
          }
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
            setAdsRemoved(true);
            localStorage.setItem('adsRemoved', 'true');
            await hideBannerAd();
            onRemoveAds?.();
          }
        }
      } else {
        // Fallback: simulate purchase for development
        localStorage.setItem('adsRemoved', 'true');
        setAdsRemoved(true);
        await hideBannerAd();
        onRemoveAds?.();
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

  // Don't render anything on web
  if (!isMobile) return null;

  // Don't render if ads are removed
  if (adsRemoved) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-gray-200 px-3 py-2 flex items-center justify-between safe-area-bottom"
      onClick={() => setShowRemoveOption(!showRemoveOption)}
    >
      <div className="flex-1 h-[50px] flex items-center justify-center text-gray-400 text-xs">
        <span>Advertisement</span>
      </div>
      {showRemoveOption && (
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
