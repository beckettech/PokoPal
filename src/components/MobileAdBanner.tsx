'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';

// AdMob stub — ads will be re-added when Capacitor 8 compatible plugin is available

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

  // Placeholder — AdMob banner will be added here when plugin is compatible with Capacitor 8
  return null;
}
