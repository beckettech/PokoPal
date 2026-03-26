// RevenueCat Configuration
// You'll need to create a RevenueCat account and get your API key

export const REVENUECAT_CONFIG = {
  // Get this from RevenueCat dashboard > Project Settings > API Keys
  // Use the "App Store Connect" key for iOS
  apiKey: process.env.NEXT_PUBLIC_REVENUECAT_API_KEY || '',

  // Product IDs (create these in App Store Connect)
  products: {
    removeAds: 'com.bektech.pokopiaguide.remove_ads',
    // Add more products as needed
    // coinPack100: 'com.bektech.pokopiaguide.coins_100',
    // coinPack500: 'com.bektech.pokopiaguide.coins_500',
  },

  // Entitlement IDs (configured in RevenueCat dashboard)
  entitlements: {
    pro: 'pro', // Remove ads + premium features
  },
};

// AdMob Configuration
// You'll need to create an AdMob account and get your ad unit IDs

export const ADMOB_CONFIG = {
  // Test ad unit IDs (use these during development)
  test: {
    banner: 'ca-app-pub-3940256099942544/2934735716',
    interstitial: 'ca-app-pub-3940256099942544/4411468910',
    rewarded: 'ca-app-pub-3940256099942544/1712485313',
  },

  // Production ad unit IDs (from AdMob dashboard)
  production: {
    banner: 'ca-app-pub-8733903111878090/2737711764',
    interstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    rewarded: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  },
};
