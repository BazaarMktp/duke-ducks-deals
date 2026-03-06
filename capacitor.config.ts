import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c1cf69b62b91410488bb70fcfb51b5b3',
  appName: 'bazaar-marketplace',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'https://c1cf69b6-2b91-4104-88bb-70fcfb51b5b3.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: '#003087',
      showSpinner: true,
      spinnerColor: '#FFFFFF',
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#003087'
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#003087',
    preferredContentMode: 'mobile'
  },
  android: {
    backgroundColor: '#003087',
    allowMixedContent: true
  }
};

export default config;
