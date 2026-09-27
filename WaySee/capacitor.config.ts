import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter', 
  appName: 'WaySee',
  webDir: 'www',
  server: {
    androidScheme: 'http', // <-- Esta é a linha mágica que resolve o problema
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    }
  }
};

export default config;