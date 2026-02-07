import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alstrader.app',
  appName: 'ALS Trader',
  webDir: 'out',
  server: {
    url: 'https://trade-pi-khaki.vercel.app',
    cleartext: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      autoHide: false,
    },
  },
};

export default config;
