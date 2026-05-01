// RevenueCat Purchases — uses window.Capacitor.Plugins at runtime (no import needed)

export async function isNativePlatform(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    return !!(window as any).Capacitor?.isNativePlatform?.();
  } catch {
    return false;
  }
}

function getRCPlugin(): any {
  if (typeof window === 'undefined') return null;
  const cap = (window as any).Capacitor;
  if (!cap) return null;

  // RevenueCat registers as 'Purchases' in Capacitor's plugin registry
  const Purchases = cap.Plugins?.Purchases;
  if (!Purchases) {
    console.error('[RC] Purchases plugin not found. Available:', Object.keys(cap.Plugins || {}));
  }
  return Purchases;
}

export async function configurePurchases() {
  const Purchases = getRCPlugin();
  if (!Purchases) {
    console.warn('[RC] Plugin not available');
    return;
  }

  const apiKey = process.env.NEXT_PUBLIC_REVENUECAT_API_KEY;
  if (!apiKey) {
    console.warn('[RC] No API key');
    return;
  }

  try {
    await Purchases.configure({ apiKey });
    console.log('[RC] ✅ Configured');
  } catch (e) {
    console.error('[RC] Configure error:', e);
  }
}

export async function purchaseRemoveAds(): Promise<{ success: boolean; error?: string }> {
  const Purchases = getRCPlugin();
  if (!Purchases) return { success: false, error: 'Purchases not available' };

  try {
    console.log('[RC] getOfferings...');
    const offerings = await Purchases.getOfferings();
    console.log('[RC] offerings:', JSON.stringify(offerings));

    const offering = offerings.current;
    if (!offering) return { success: false, error: 'No current offering' };

    const pkg = offering.availablePackages?.find(
      (p: any) => p.product?.identifier === 'Remove_Ads'
    ) || offering.availablePackages?.[0];

    if (!pkg) return { success: false, error: 'No package found' };

    console.log('[RC] purchasing:', pkg.product?.identifier);
    const { customerInfo } = await Purchases.purchasePackage(pkg);

    const hasPro = customerInfo?.entitlements?.active?.['pro'];
    const hasIAP = (customerInfo?.nonSubscriptions?.['Remove_Ads']?.length ?? 0) > 0;

    return (hasPro || hasIAP) ? { success: true } : { success: false, error: 'Not completed' };
  } catch (e: any) {
    console.error('[RC] purchase error:', e);
    if (e.userCancelled) return { success: false, error: 'Cancelled' };
    return { success: false, error: e.message || 'Purchase failed' };
  }
}

export async function purchaseCoins(productId: string): Promise<{ success: boolean; error?: string }> {
  const Purchases = getRCPlugin();
  if (!Purchases) return { success: false, error: 'Purchases not available' };

  try {
    const offerings = await Purchases.getOfferings();
    const offering = offerings.current;
    if (!offering) return { success: false, error: 'No offerings' };

    const pkg = offering.availablePackages?.find((p: any) => p.product?.identifier === productId);
    if (!pkg) return { success: false, error: 'Package not found' };

    await Purchases.purchasePackage(pkg);
    return { success: true };
  } catch (e: any) {
    if (e.userCancelled) return { success: false, error: 'Cancelled' };
    return { success: false, error: e.message || 'Failed' };
  }
}

export async function restorePurchases(): Promise<{ success: boolean; adsRemoved?: boolean; error?: string }> {
  const Purchases = getRCPlugin();
  if (!Purchases) return { success: false, error: 'Purchases not available' };

  try {
    const { customerInfo } = await Purchases.restorePurchases();
    const hasPro = !!customerInfo?.entitlements?.active?.['pro'];
    const hasIAP = (customerInfo?.nonSubscriptions?.['Remove_Ads']?.length ?? 0) > 0;
    return { success: true, adsRemoved: hasPro || hasIAP };
  } catch (e: any) {
    return { success: false, error: e.message || 'Restore failed' };
  }
}
