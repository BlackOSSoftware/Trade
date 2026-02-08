import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alstrades.portal',
  appName: 'ALS Trade',
  webDir: 'build', // not used when server.url present
  server: {
    url: 'https://trade-portal-uiub.vercel.app',
    cleartext: false
  }
};

export default config;
// update