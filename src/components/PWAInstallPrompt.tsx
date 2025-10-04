import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

const isSafari = () => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isSafariDevice, setIsSafariDevice] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      
      // Show prompt after a delay to avoid being intrusive
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setShowPrompt(false);
      setDeferredPrompt(null);
      toast({
        title: "App Installed!",
        description: "Bazaar has been added to your home screen.",
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    
    if (isStandalone || isIOSStandalone) {
      setIsInstallable(false);
    } else if ((isIOS() || isSafari()) && !deferredPrompt) {
      // Show Safari-specific prompt
      setIsSafariDevice(true);
      setIsInstallable(true);
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [toast]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      toast({
        title: "Installing...",
        description: "Bazaar is being added to your home screen.",
      });
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already dismissed this session
  if (sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  if (!showPrompt || !isInstallable) {
    return null;
  }

  // Safari-specific instructions
  if (isSafariDevice && !deferredPrompt) {
    return (
      <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 p-4 shadow-lg z-50 bg-card border-primary/20">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Share className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-sm">Install Bazaar</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          Get the full app experience! Install Bazaar for faster access and offline features.
        </p>
        
        <div className="text-xs text-muted-foreground space-y-2 mb-4 p-3 bg-muted/50 rounded-md">
          {isIOS() ? (
            <>
              <p className="font-semibold">To install on iOS:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Tap the <Share className="inline h-3 w-3" /> Share button below</li>
                <li>Scroll and tap "Add to Home Screen"</li>
                <li>Tap "Add" to confirm</li>
              </ol>
            </>
          ) : (
            <>
              <p className="font-semibold">To install on Safari:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Click the Share button in the toolbar</li>
                <li>Select "Add to Dock"</li>
              </ol>
            </>
          )}
        </div>
        
        <Button
          variant="outline"
          onClick={handleDismiss}
          size="sm"
          className="w-full"
        >
          Got it
        </Button>
      </Card>
    );
  }

  // Chrome/Edge standard prompt
  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 p-4 shadow-lg z-50 bg-card border-primary/20">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-sm">Install Bazaar</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Get the full app experience! Install Bazaar for faster access and offline features.
      </p>
      
      <div className="flex gap-2">
        <Button
          onClick={handleInstallClick}
          className="flex-1"
          size="sm"
        >
          <Download className="h-4 w-4 mr-1" />
          Install App
        </Button>
        <Button
          variant="outline"
          onClick={handleDismiss}
          size="sm"
        >
          Later
        </Button>
      </div>
    </Card>
  );
};