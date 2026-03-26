'use client';

import { useState, useEffect } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { ADMOB_CONFIG, REVENUECAT_CONFIG } from '@/lib/purchases';
import { useAppStore } from '@/lib/store';

export function MobileAdBanner() {
  const { user, isAdmin, adminForceAds } = useAppStore();
  const [isNative, setIsNative] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [showRemoveOption, setShowRemoveOption] = useState(false);

  // Admin ad override
  const shouldShow = !(
    (isAdmin && adminForceAds === "hide") ||
    (user.adsRemoved && !(isAdmin && adminForceAds === "show"))
  );

  useEffect(() => {
    if (!shouldShow) return;

    const init = async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        const native = Capacitor.isNativePlatform();
        setIsNative(native);

        // RevenueCat only on native
        if (native && REVENUECAT_CONFIG.apiKey) {
          try {
            const { Purchases } = await import('@revenuecat/purchases-capacitor');
            await Purchases.configure({ apiKey: REVENUECAT_CONFIG.apiKey });
            const { customerInfo } = await Purchases.getCustomerInfo();
            // Entitlement check handled by store
          } catch {}
        }

        // Try to show AdMob banner
        const adId = ADMOB_CONFIG.production.banner;
        await AdMob.initialize({
          requestTrackingAuthorization: true,
          testingMode: false,
        });

        await AdMob.showBanner({
          adId,
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
        });

        // AdMob creates its own fixed element at the bottom
        // Give it a moment to load
        setTimeout(() => setAdLoaded(true), 3000);
      } catch (error) {
        console.log('AdMob init failed:', error);
      }
    };

    init();

    return () => {
      // Cleanup: hide banner on unmount
      AdMob.hideBanner().catch(() => {});
    };
  }, [shouldShow]);

  if (!shouldShow) return null;

  return (
    <>
      {isNative && (
        <div className="fixed bottom-[52px] right-2 z-[60]">
          {showRemoveOption ? (
            <button
              onClick={() => setShowRemoveOption(false)}
              className="px-3 py-1.5 bg-cyan-500 text-white text-xs rounded-full font-medium shadow-lg active:scale-95 transition-transform"
            >
              Remove Ads $2.99
            </button>
          ) : (
            <button
              onClick={() => setShowRemoveOption(true)}
              className="px-2 py-1 bg-white/80 dark:bg-gray-800/80 text-[10px] text-gray-500 rounded-full shadow-sm backdrop-blur"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </>
  );
}
