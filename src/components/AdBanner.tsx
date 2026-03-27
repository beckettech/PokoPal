'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAppStore } from "@/lib/store";

export function AdBanner() {
  const [mounted, setMounted] = useState(false);
  const user = useAppStore((s) => s.user);
  const adminForceAds = useAppStore((s) => s.adminForceAds);

  useEffect(() => { setMounted(true); }, []);

  const shouldHide = useMemo(() =>
    !mounted ||
    adminForceAds === 'hide' ||
    (adminForceAds === 'default' && (user.isPremium || user.adsRemoved)),
    [mounted, adminForceAds, user.isPremium, user.adsRemoved]
  );

  useEffect(() => {
    if (shouldHide || !mounted) return;
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || []
      (window as any).adsbygoogle.push({})
    } catch {}
  }, [shouldHide, mounted])

  if (shouldHide) return null;

  return (
    <div className="w-full flex justify-center py-1 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '50px' }}
        data-ad-client="ca-pub-8733903111878090"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
