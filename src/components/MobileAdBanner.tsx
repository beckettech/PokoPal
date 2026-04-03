'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';

// AdMob placeholder — waiting for Capacitor 8 compatible plugin
export function MobileAdBanner() {
  const { user, isAdmin, adminForceAds } = useAppStore();
  const [isNative, setIsNative] = useState(false);

  const shouldShow = !(
    (isAdmin && adminForceAds === "hide") ||
    (user.adsRemoved && !(isAdmin && adminForceAds === "show"))
  );

  useEffect(() => {
    if (!shouldShow) return;
    const init = async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        setIsNative(Capacitor.isNativePlatform());
      } catch {}
    };
    init();
  }, [shouldShow]);

  if (!shouldShow || !isNative) return null;
  return null;
}
