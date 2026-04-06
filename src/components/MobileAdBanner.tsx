'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';

// Ad banner for native iOS — shows placeholder until AdMob plugin is ready
export function MobileAdBanner() {
  const user = useAppStore((s) => s.user);
  const adminForceAds = useAppStore((s) => s.adminForceAds);
  const isAdmin = useAppStore((s) => s.isAdmin);
  const [isNative, setIsNative] = useState(false);

  const shouldShow = !(
    (isAdmin && adminForceAds === "hide") ||
    (user.adsRemoved && !(isAdmin && adminForceAds === "show"))
  );

  useEffect(() => {
    const init = async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        setIsNative(Capacitor.isNativePlatform());
      } catch {}
    };
    init();
  }, []);

  if (!shouldShow || !isNative) return null;

  // Placeholder for AdMob banner (standard banner: 50px tall + safe area bottom)
  return (
    <div className="w-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center"
      style={{ height: '50px' }}>
      <span className="text-white/40 text-[10px] font-medium">Ad</span>
    </div>
  );
}
