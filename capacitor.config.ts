import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alstrader.app',
  appName: 'ALS Trader',
  webDir: 'out',
  server: {
    url: 'https://trade-portal-uiub.vercel.app',
    cleartext: false
  }
};

export default config;
