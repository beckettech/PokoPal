'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';

export function MobileAdBanner() {
  const user = useAppStore((s) => s.user);
  const adminForceAds = useAppStore((s) => s.adminForceAds);
  const isAdmin = useAppStore((s) => s.isAdmin);
  const initialized = useRef(false);
  const adShown = useRef(false);

  const shouldShow = !(
    (isAdmin && adminForceAds === "hide") ||
    (user.adsRemoved && !(isAdmin && adminForceAds === "show")) ||
    (user.isPremium && !(isAdmin && adminForceAds === "show"))
  );

  // Show/hide banner based on ad state
  useEffect(() => {
    const updateBanner = async () => {
      try {
        const { Capacitor, registerPlugin } = await import('@capacitor/core');
        if (!Capacitor.isNativePlatform()) return;

        const AdMob = registerPlugin<any>('AdMob');

        if (!initialized.current) {
          initialized.current = true;
          await AdMob.initialize();
        }

        if (shouldShow && !adShown.current) {
          await AdMob.showBanner({
            adId: 'ca-app-pub-8733903111878090/2737711764',
            adSize: 'ADAPTIVE_BANNER',
            position: 'BOTTOM_CENTER',
          });
          adShown.current = true;
        } else if (!shouldShow && adShown.current) {
          await AdMob.hideBanner();
          adShown.current = false;
        }
      } catch (e) {
        console.error('AdMob:', e);
      }
    };
    updateBanner();
  }, [shouldShow]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (initialized.current) {
        import('@capacitor/core').then(({ registerPlugin }) => {
          registerPlugin<any>('AdMob').removeBanner().catch(() => {});
        });
      }
    };
  }, []);

  // This component renders nothing — AdMob handles banner natively
  return null;
}
