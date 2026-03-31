'use client';

import { useState, useEffect } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { ADMOB_CONFIG } from '@/lib/purchases';
import { useAppStore } from '@/lib/store';

export function MobileAdBanner() {
  const { user, isAdmin, adminForceAds } = useAppStore();
  const [isNative, setIsNative] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

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

        // Only show AdMob on native platforms
        if (!native) return;

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

        setTimeout(() => setAdLoaded(true), 3000);
      } catch (error) {
        console.log('AdMob init failed:', error);
      }
    };

    init();

    return () => {
      AdMob.hideBanner().catch(() => {});
    };
  }, [shouldShow]);

  if (!shouldShow || !isNative) return null;

  // AdMob creates its own fixed element at the bottom
  return null;
}
