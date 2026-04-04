'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';

export function MobileAdBanner() {
  const user = useAppStore((s) => s.user);
  const adminForceAds = useAppStore((s) => s.adminForceAds);
  const isAdmin = useAppStore((s) => s.isAdmin);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [adReady, setAdReady] = useState(false);

  const shouldShow = !(
    (isAdmin && adminForceAds === "hide") ||
    (user.adsRemoved && !(isAdmin && adminForceAds === "show"))
  );

  useEffect(() => {
    const init = async () => {
      try {
        const { Capacitor, registerPlugin } = await import('@capacitor/core');

        if (!Capacitor.isNativePlatform()) return;
        setShowPlaceholder(true);

        // Register AdMob plugin via Capacitor bridge (no npm import needed)
        const AdMob = registerPlugin<any>('AdMob');

        await AdMob.initialize();
        setAdReady(true);

        await AdMob.showBanner({
          adId: 'ca-app-pub-8733903111878090/2737711764',
          adSize: 'ADAPTIVE_BANNER',
          position: 'BOTTOM_CENTER',
        });
      } catch (e) {
        console.error('AdMob init failed:', e);
      }
    };
    if (shouldShow) init();
  }, [shouldShow]);

  useEffect(() => {
    return () => {
      if (adReady) {
        import('@capacitor/core').then(({ registerPlugin }) => {
          const AdMob = registerPlugin<any>('AdMob');
          AdMob.removeBanner().catch(() => {});
        });
      }
    };
  }, [adReady]);

  if (!shouldShow || !showPlaceholder) return null;

  // Show placeholder while ad loads
  if (!adReady) {
    return (
      <div className="w-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center"
        style={{ height: '50px' }}>
        <span className="text-white/40 text-[10px] font-medium">Ad</span>
      </div>
    );
  }

  // AdMob banner is rendered natively, minimal spacer
  return <div style={{ height: '50px' }} />;
}
