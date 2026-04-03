// Ad/Purchases stubs — placeholder until AdMob is re-added for Capacitor 8

export const ADMOB_CONFIG = {
  production: { banner: '', rewarded: '' },
  test: { banner: '', rewarded: '' },
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

export function isNativePlatform() {
  return false;
}
