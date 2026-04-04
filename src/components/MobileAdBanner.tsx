'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';

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

        const { AdMob, BannerAdSize, BannerAdPosition } = await import('@capacitor-community/admob');

        await AdMob.initialize();
        setAdReady(true);

        const { AdSize, Position } = await import('@capacitor-community/admob');
      } catch (e) {
        console.error('AdMob init failed:', e);
        setAdFailed(true);
      }
    };
    if (shouldShow) init();
  }, [shouldShow]);

  useEffect(() => {
    if (!isNative || !adReady) return;

    const showAd = async () => {
      try {
        const { AdMob } = await import('@capacitor-community/admob');

        await AdMob.showBanner({
          adId: 'ca-app-pub-8733903111878090/UNKNOWN', // Replace with real ad unit ID
          adSize: 'ADAPTIVE_BANNER',
          position: 'BOTTOM_CENTER',
        });
      } catch (e) {
        console.error('Banner show failed:', e);
        setAdFailed(true);
      }
    };
    showAd();
  }, [isNative, adReady]);

  useEffect(() => {
    return () => {
      if (isNative) {
        import('@capacitor-community/admob').then(({ AdMob }) => {
          AdMob.removeBanner().catch(() => {});
        });
      }
    };
  }, [isNative]);

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
