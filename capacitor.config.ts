import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bektech.pokopiaguide',
  appName: 'PokoPal',
  webDir: 'out',
  plugins: {
    AdMob: {
      testDeviceIds: [],
      initializeForTesting: true,
    },
  },
  ios: {
    contentInset: 'never',
  },
  android: {
    // Not targeting Android yet
  },
  keyboard: {
    resize: 'none',
    resizeOnFullScreen: true,
  },
};

export default config;
