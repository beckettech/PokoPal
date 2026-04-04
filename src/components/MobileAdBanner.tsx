'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';

// Dynamic import with template literal to prevent Turbopack/webpack from resolving at build time
const admobModule = '@capacitor-community/admob';

export function MobileAdBanner() {
  const user = useAppStore((s) => s.user);
  const adminForceAds = useAppStore((s) => s.adminForceAds);
  const isAdmin = useAppStore((s) => s.isAdmin);
  const [isNative, setIsNative] = useState(false);
  const [adReady, setAdReady] = useState(false);
  const [adFailed, setAdFailed] = useState(false);

  const shouldShow = !(
    (isAdmin && adminForceAds === "hide") ||
    (user.adsRemoved && !(isAdmin && adminForceAds === "show"))
  );

  useEffect(() => {
    const init = async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        if (!Capacitor.isNativePlatform()) return;
        setIsNative(true);

        const { AdMob } = await import(/* webpackIgnore: true */ admobModule);
        await AdMob.initialize();
        setAdReady(true);
      } catch (e) {
        console.error('AdMob init failed:', e);
        setAdFailed(true);
      }
    };
    if (shouldShow) init();
  }, [shouldShow]);

  useEffect(() => {
    if (!isNative || !adReady) return;

    let cleanup = false;
    const showAd = async () => {
      try {
        const { AdMob } = await import(/* webpackIgnore: true */ admobModule);
        await AdMob.showBanner({
          adId: 'ca-app-pub-8733903111878090/2737711764',
          adSize: 'ADAPTIVE_BANNER',
          position: 'BOTTOM_CENTER',
        });
      } catch (e) {
        console.error('Banner show failed:', e);
        if (!cleanup) setAdFailed(true);
      }
    };
    showAd();

    return () => {
      cleanup = true;
      import(/* webpackIgnore: true */ admobModule).then(({ AdMob }) => {
        AdMob.removeBanner().catch(() => {});
      });
    };
  }, [isNative, adReady]);

  if (!shouldShow || !isNative) return null;

  // Show placeholder while ad loads or if it fails
  if (!adReady || adFailed) {
    return (
      <div className="w-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center"
        style={{ height: '50px' }}>
        <span className="text-white/40 text-[10px] font-medium">Ad</span>
      </div>
    );
  }

  // AdMob manages the banner natively, return minimal spacer
  return <div style={{ height: '50px' }} />;
}
