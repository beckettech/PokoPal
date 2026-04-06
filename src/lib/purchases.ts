// Ad/Purchases stubs — placeholder until AdMob is re-added for Capacitor 8

export const ADMOB_CONFIG = {
  production: {
    banner: process.env.NEXT_PUBLIC_ADMOB_BANNER_ID || 'ca-app-pub-3940256099942544/2934735716',
    rewarded: process.env.NEXT_PUBLIC_ADMOB_REWARDED_ID || 'ca-app-pub-3940256099942544/5224354917',
  },
  test: {
    banner: 'ca-app-pub-3940256099942544/2934735716',
    rewarded: 'ca-app-pub-3940256099942544/5224354917',
  },
};

export const REVENUECAT_CONFIG = {
  apiKey: '',
  products: {
    removeAds: '',
    coins_1000: '',
    coins_3500: '',
    coins_7500: '',
    coins_20000: '',
  },
  entitlements: { pro: '' },
};

export async function purchaseCoins() {
  return { success: false, error: 'Purchases not configured yet' };
}

export async function purchaseRemoveAds() {
  return { success: false, error: 'Purchases not configured yet' };
}

export async function restorePurchases() {
  return { success: false, error: 'Purchases not configured yet' };
}

export function isNativePlatform(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  try {
    // Dynamic check - won't crash on web
    return Promise.resolve(
      typeof navigator !== 'undefined' && (
        /capacitor/i.test(navigator.userAgent) ||
        location.protocol === 'capacitor:' ||
        (window as any).Capacitor?.isNativePlatform?.() === true
      )
    );
  } catch {
    return Promise.resolve(false);
  }
}
