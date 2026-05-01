// RevenueCat Purchases — direct import (alias removed from next.config)

let _Purchases: any = null;

async function getPurchases(): Promise<any> {
  if (_Purchases) return _Purchases;
  try {
    // Direct import — works at runtime in Capacitor
    const mod = await import('@revenuecat/purchases-capacitor');
    _Purchases = mod.Purchases;
    return _Purchases;
  } catch (e) {
    console.error('[Purchases] Failed to import:', e);
    return null;
  }
}

export async function isNativePlatform(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    return !!(window as any).Capacitor?.isNativePlatform?.();
  } catch {
    return false;
  }
}

export async function configurePurchases() {
  const Purchases = await getPurchases();
  if (!Purchases) {
    console.warn('[Purchases] SDK not available');
    return;
  }

  const apiKey = process.env.NEXT_PUBLIC_REVENUECAT_API_KEY;
  if (!apiKey) {
    console.warn('[Purchases] No API key');
    return;
  }

  try {
    await Purchases.configure({ apiKey });
    console.log('[Purchases] ✅ Configured successfully');
  } catch (e) {
    console.error('[Purchases] Configure error:', e);
  }
}

export async function purchaseRemoveAds(): Promise<{ success: boolean; error?: string }> {
  const Purchases = await getPurchases();
  if (!Purchases) return { success: false, error: 'Purchases not available' };

  try {
    console.log('[Purchases] Fetching offerings...');
    const offerings = await Purchases.getOfferings();
    console.log('[Purchases] Offerings:', JSON.stringify(offerings));

    const offering = offerings.current;
    if (!offering) return { success: false, error: 'No offerings available' };

    console.log('[Purchases] Packages:', offering.availablePackages?.length);
    const pkg = offering.availablePackages.find(
      (p: any) => p.product.identifier === 'Remove_Ads'
    ) || offering.availablePackages[0];

    if (!pkg) return { success: false, error: 'No package found' };

    console.log('[Purchases] Purchasing:', pkg.product.identifier);
    const result = await Purchases.purchasePackage(pkg);
    console.log('[Purchases] Purchase result:', JSON.stringify(result));

    const hasPro = result.customerInfo?.entitlements?.active?.['pro'];
    const hasRemoveAds = (result.customerInfo?.nonSubscriptions?.['Remove_Ads']?.length ?? 0) > 0;

    if (hasPro || hasRemoveAds) return { success: true };
    return { success: false, error: 'Purchase not completed' };
  } catch (e: any) {
    console.error('[Purchases] Purchase error:', e);
    if (e.userCancelled) return { success: false, error: 'Cancelled' };
    return { success: false, error: e.message || 'Purchase failed' };
  }
}

export async function purchaseCoins(productId: string): Promise<{ success: boolean; error?: string }> {
  const Purchases = await getPurchases();
  if (!Purchases) return { success: false, error: 'Purchases not available' };

  try {
    const offerings = await Purchases.getOfferings();
    const offering = offerings.current;
    if (!offering) return { success: false, error: 'No offerings available' };

    const pkg = offering.availablePackages.find((p: any) => p.product.identifier === productId);
    if (!pkg) return { success: false, error: 'Package not found' };

    await Purchases.purchasePackage(pkg);
    return { success: true };
  } catch (e: any) {
    if (e.userCancelled) return { success: false, error: 'Cancelled' };
    return { success: false, error: e.message || 'Purchase failed' };
  }
}

export async function restorePurchases(): Promise<{ success: boolean; adsRemoved?: boolean; error?: string }> {
  const Purchases = await getPurchases();
  if (!Purchases) return { success: false, error: 'Purchases not available' };

  try {
    const { customerInfo } = await Purchases.restorePurchases();
    const hasPro = !!customerInfo?.entitlements?.active?.['pro'];
    const hasRemoveAds = (customerInfo?.nonSubscriptions?.['Remove_Ads']?.length ?? 0) > 0;
    return { success: true, adsRemoved: hasPro || hasRemoveAds };
  } catch (e: any) {
    return { success: false, error: e.message || 'Restore failed' };
  }
}
