'use client';

import { useEffect, useState, useRef } from 'react';
import { useAppStore } from '@/lib/store';

export function MobileAdBanner() {
  const user = useAppStore((s) => s.user);
  const adminForceAds = useAppStore((s) => s.adminForceAds);
  const isAdmin = useAppStore((s) => s.isAdmin);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [adReady, setAdReady] = useState(false);
  const initialized = useRef(false);

  const shouldShow = !(
    (isAdmin && adminForceAds === "hide") ||
    (user.adsRemoved && !(isAdmin && adminForceAds === "show"))
  );

  useEffect(() => {
    if (initialized.current || !shouldShow) return;
    initialized.current = true;

    let cleanup = false;
    const init = async () => {
      try {
        const { Capacitor, registerPlugin } = await import('@capacitor/core');
        if (!Capacitor.isNativePlatform() || cleanup) return;

        setShowPlaceholder(true);
        const AdMob = registerPlugin<any>('AdMob');

        await AdMob.initialize();
        if (cleanup) return;

        await AdMob.showBanner({
          adId: 'ca-app-pub-8733903111878090/2737711764',
          adSize: 'ADAPTIVE_BANNER',
          position: 'TOP_CENTER',
        });
        if (!cleanup) setAdReady(true);
      } catch (e) {
        console.error('AdMob failed:', e);
      }
    };
    init();

    return () => { cleanup = true; };
  }, [shouldShow]);

  useEffect(() => {
    return () => {
      if (adReady) {
        import('@capacitor/core').then(({ registerPlugin }) => {
          registerPlugin<any>('AdMob').removeBanner().catch(() => {});
        });
      }
    };
  }, [adReady]);

  if (!shouldShow || !showPlaceholder) return null;

  if (!adReady) {
    return (
      <div className="w-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center"
        style={{ height: '50px' }}>
        <span className="text-white/40 text-[10px] font-medium">Ad</span>
      </div>
    );
  }

  return <div style={{ height: '50px' }} />;
}
