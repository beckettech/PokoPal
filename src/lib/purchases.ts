// RevenueCat Purchases — real implementation for iOS

let PurchasesSDK: any = null;

async function getPurchases() {
  if (PurchasesSDK) return PurchasesSDK;
  try {
    const mod = await import(/* webpackIgnore: true */ '@revenuecat/purchases-capacitor');
    PurchasesSDK = mod.Purchases;
    return PurchasesSDK;
  } catch {
    return null;
  }
}

export async function isNativePlatform(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    return (
      typeof navigator !== 'undefined' && (
        /capacitor/i.test(navigator.userAgent) ||
        location.protocol === 'capacitor:' ||
        (window as any).Capacitor?.isNativePlatform?.() === true
      )
    );
  } catch {
    return false;
  }
}

export async function configurePurchases() {
  const Purchases = await getPurchases();
  if (!Purchases) return;

  const apiKey = process.env.NEXT_PUBLIC_REVENUECAT_API_KEY;
  if (!apiKey) {
    console.warn('[Purchases] No RevenueCat API key configured');
    return;
  }

  try {
    await Purchases.configure({ apiKey });
    console.log('[Purchases] Configured');
  } catch (e) {
    console.error('[Purchases] Configure failed:', e);
  }
}

export async function purchaseRemoveAds(): Promise<{ success: boolean; error?: string }> {
  const Purchases = await getPurchases();
  if (!Purchases) return { success: false, error: 'Purchases not available' };

  try {
    const offerings = await Purchases.getOfferings();
    const offering = offerings.current;

    if (!offering) return { success: false, error: 'No offerings available' };

    // Try to find the "Remove Ads" package
    const pkg = offering.availablePackages.find(
      (p: any) => p.product.identifier === 'Remove_Ads' || p.product.identifier.includes('remove')
    ) || offering.availablePackages[0];

    if (!pkg) return { success: false, error: 'No package found' };

    const { customerInfo } = await Purchases.purchasePackage(pkg);

    // Check if the purchase was successful
    if (customerInfo.entitlements.active['pro'] || customerInfo.nonSubscriptions['Remove_Ads']) {
      return { success: true };
    }

    return { success: false, error: 'Purchase not completed' };
  } catch (e: any) {
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

    const pkg = offering.availablePackages.find(
      (p: any) => p.product.identifier === productId
    );
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

    const hasPro = !!customerInfo.entitlements.active['pro'];
    const hasRemoveAds = !!customerInfo.nonSubscriptions['Remove_Ads']?.length;

    return { success: true, adsRemoved: hasPro || hasRemoveAds };
  } catch (e: any) {
    return { success: false, error: e.message || 'Restore failed' };
  }
}
