// RevenueCat Configuration
export const REVENUECAT_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_REVENUECAT_API_KEY || '',

  // Product IDs (create these in App Store Connect)
  products: {
    removeAds: 'com.bektech.pokopiaguide.remove_ads',
    coins_1000: 'com.bektech.pokopiaguide.coins_1000',
    coins_3500: 'com.bektech.pokopiaguide.coins_3500',
    coins_7500: 'com.bektech.pokopiaguide.coins_7500',
    coins_20000: 'com.bektech.pokopiaguide.coins_20000',
  },

  // Entitlement IDs
  entitlements: {
    pro: 'pro',
  },
};

// AdMob Configuration
export const ADMOB_CONFIG = {
  test: {
    banner: 'ca-app-pub-3940256099942544/2934735716',
    interstitial: 'ca-app-pub-3940256099942544/4411468910',
    rewarded: 'ca-app-pub-3940256099942544/1712485313',
  },
  production: {
    banner: 'ca-app-pub-8733903111878090/2737711764',
    interstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    rewarded: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  },
};

// Stripe Payment Links (web only)
const STRIPE_LINKS: Record<string, string> = {
  coins_1000: process.env.NEXT_PUBLIC_STRIPE_LINK_1000 || '#',
  coins_3500: process.env.NEXT_PUBLIC_STRIPE_LINK_3500 || '#',
  coins_7500: process.env.NEXT_PUBLIC_STRIPE_LINK_7500 || '#',
  coins_20000: process.env.NEXT_PUBLIC_STRIPE_LINK_20000 || '#',
  remove_ads: process.env.NEXT_PUBLIC_STRIPE_LINK_NOADS || '#',
};

// Coin package → RevenueCat product ID mapping
const COIN_PRODUCT_MAP: Record<number, string> = {
  1000: 'com.bektech.pokopiaguide.coins_1000',
  3500: 'com.bektech.pokopiaguide.coins_3500',
  7500: 'com.bektech.pokopiaguide.coins_7500',
  20000: 'com.bektech.pokopiaguide.coins_20000',
};

// Coin package → Stripe link key mapping
const COIN_STRIPE_MAP: Record<number, string> = {
  1000: 'coins_1000',
  3500: 'coins_3500',
  7500: 'coins_7500',
  20000: 'coins_20000',
};

export type PurchaseResult = {
  success: boolean;
  error?: string;
};

/**
 * Check if running on native iOS/Android
 */
export async function isNativePlatform(): Promise<boolean> {
  try {
    const { Capacitor } = await import('@capacitor/core');
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

/**
 * Purchase coins via the appropriate platform
 * - iOS/Android: RevenueCat IAP
 * - Web: Stripe checkout
 */
export async function purchaseCoins(
  coinAmount: number,
  onSuccess?: () => void,
  onError?: (error: string) => void
): Promise<PurchaseResult> {
  const native = await isNativePlatform();

  if (native) {
    return purchaseCoinsNative(coinAmount, onSuccess, onError);
  } else {
    return purchaseCoinsWeb(coinAmount);
  }
}

/**
 * Purchase "Remove Ads" via appropriate platform
 */
export async function purchaseRemoveAds(
  onSuccess?: () => void,
  onError?: (error: string) => void
): Promise<PurchaseResult> {
  const native = await isNativePlatform();

  if (native) {
    return purchaseRemoveAdsNative(onSuccess, onError);
  } else {
    return purchaseRemoveAdsWeb();
  }
}

/**
 * Restore previous purchases (iOS only, but safe to call anywhere)
 */
export async function restorePurchases(): Promise<{
  adsRemoved: boolean;
  error?: string;
}> {
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (!Capacitor.isNativePlatform()) {
      return { adsRemoved: false, error: 'Restore is only available on iOS' };
    }

    const { Purchases } = await import('@revenuecat/purchases-capacitor');
    await Purchases.configure({ apiKey: REVENUECAT_CONFIG.apiKey });

    const { customerInfo } = await Purchases.getCustomerInfo();
    const hasPro = customerInfo.entitlements?.active?.[REVENUECAT_CONFIG.entitlements.pro];

    return { adsRemoved: !!hasPro };
  } catch (error) {
    console.error('Restore failed:', error);
    return { adsRemoved: false, error: 'Restore failed' };
  }
}

// --- Web (Stripe) ---

function purchaseCoinsWeb(coinAmount: number): PurchaseResult {
  const linkKey = COIN_STRIPE_MAP[coinAmount];
  const link = linkKey ? STRIPE_LINKS[linkKey] : null;

  if (link && link !== '#') {
    window.open(link, '_blank');
    return { success: true };
  }

  return { success: false, error: 'Payment link not configured' };
}

function purchaseRemoveAdsWeb(): PurchaseResult {
  const link = STRIPE_LINKS.remove_ads;
  if (link && link !== '#') {
    window.open(link, '_blank');
    return { success: true };
  }
  return { success: false, error: 'Payment link not configured' };
}

// --- Native (RevenueCat) ---

async function purchaseCoinsNative(
  coinAmount: number,
  onSuccess?: () => void,
  onError?: (error: string) => void
): Promise<PurchaseResult> {
  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor');
    const productId = COIN_PRODUCT_MAP[coinAmount];

    if (!productId) {
      return { success: false, error: `No product for ${coinAmount} coins` };
    }

    if (!REVENUECAT_CONFIG.apiKey) {
      return { success: false, error: 'In-app purchases not configured yet' };
    }

    await Purchases.configure({ apiKey: REVENUECAT_CONFIG.apiKey });
    const { customerInfo } = await Purchases.purchaseProduct({ productIdentifier: productId });

    // Check if purchase was successful
    if (customerInfo.entitlements?.active?.[REVENUECAT_CONFIG.entitlements.pro]) {
      // Got pro entitlement (this would be remove ads, not coins)
      onSuccess?.();
      return { success: true };
    }

    // For consumable products (coins), just having a successful purchase is enough
    onSuccess?.();
    return { success: true };
  } catch (error: any) {
    const msg = error?.message || 'Purchase failed';
    onError?.(msg);
    return { success: false, error: msg };
  }
}

async function purchaseRemoveAdsNative(
  onSuccess?: () => void,
  onError?: (error: string) => void
): Promise<PurchaseResult> {
  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor');

    if (!REVENUECAT_CONFIG.apiKey) {
      return { success: false, error: 'In-app purchases not configured yet' };
    }

    await Purchases.configure({ apiKey: REVENUECAT_CONFIG.apiKey });
    const { customerInfo } = await Purchases.purchaseProduct({
      productIdentifier: REVENUECAT_CONFIG.products.removeAds,
    });

    const hasPro = customerInfo.entitlements?.active?.[REVENUECAT_CONFIG.entitlements.pro];
    if (hasPro) {
      onSuccess?.();
      return { success: true };
    }

    return { success: false, error: 'Purchase did not complete' };
  } catch (error: any) {
    const msg = error?.message || 'Purchase failed';
    onError?.(msg);
    return { success: false, error: msg };
  }
}
