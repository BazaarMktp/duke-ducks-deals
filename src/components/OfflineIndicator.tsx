import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff } from 'lucide-react';

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowAlert(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowAlert(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show alert if already offline
    if (!navigator.onLine) {
      setShowAlert(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showAlert) {
    return null;
  }

  return (
    <Alert className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 bg-warning/10 border-warning">
      <WifiOff className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>You're offline. Some features may be limited.</span>
        {isOnline && (
          <Wifi className="h-4 w-4 text-success ml-2" />
        )}
      </AlertDescription>
    </Alert>
  );
};