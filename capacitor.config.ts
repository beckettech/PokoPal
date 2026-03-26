import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bektech.pokopiaguide',
  appName: 'Pokopia Guide',
  webDir: 'out',
  plugins: {
    AdMob: {
      // Test devices for development
      testDeviceIds: [],
      // Initialize with test ads in development
      initializeForTesting: true,
    },
  },
  ios: {
    contentInset: 'automatic',
  },
};

export default config;
