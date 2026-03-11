import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c1cf69b62b91410488bb70fcfb51b5b3',
  appName: "Devil's Marketplace",
  webDir: 'dist',
  server: {
    // Comment out the URL below for production builds so the app loads from the local bundle.
    // Uncomment for live-reload during development.
    // url: 'https://c1cf69b6-2b91-4104-88bb-70fcfb51b5b3.lovableproject.com?forceHideBadge=true',
    // cleartext: true,
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false, // We hide manually after init
      launchShowDuration: 0,
      backgroundColor: '#0A2A66',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#0A2A66',
      overlaysWebView: false,
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#0A2A66',
    preferredContentMode: 'mobile',
    scheme: 'DevilsMarketplace',
    allowsLinkPreview: true,
  },
  android: {
    backgroundColor: '#0A2A66',
    allowMixedContent: false,
  },
};

export default config;
