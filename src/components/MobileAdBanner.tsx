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

  // Initialize AdMob after a delay so it doesn't block launch
  useEffect(() => {
    if (!shouldShow) return;

    const timer = setTimeout(async () => {
      try {
        const { Capacitor, registerPlugin } = await import('@capacitor/core');
        if (!Capacitor.isNativePlatform()) return;

        const AdMob = registerPlugin<any>('AdMob');
        initialized.current = true;
        await AdMob.initialize();

        await AdMob.showBanner({
          adId: 'ca-app-pub-8733903111878090/2737711764',
          adSize: 'ADAPTIVE_BANNER',
          position: 'BOTTOM_CENTER',
        });
        adShown.current = true;
      } catch (e) {
        console.error('AdMob:', e);
      }
    }, 3000); // Wait 3 seconds after launch

    return () => clearTimeout(timer);
  }, [shouldShow]);

  // Hide/show based on premium status
  useEffect(() => {
    if (!initialized.current) return;

    const update = async () => {
      try {
        const { registerPlugin } = await import('@capacitor/core');
        const AdMob = registerPlugin<any>('AdMob');

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
      } catch {}
    };
    update();
  }, [shouldShow]);

  useEffect(() => {
    return () => {
      if (initialized.current) {
        import('@capacitor/core').then(({ registerPlugin }) => {
          registerPlugin<any>('AdMob').removeBanner().catch(() => {});
        });
      }
    };
  }, []);

  return null;
}
