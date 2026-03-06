import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isNativePlatform } from './useCapacitor';

/**
 * Handles Android hardware back button via Capacitor App plugin
 */
export function useBackButton() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isNativePlatform()) return;

    let cleanup: (() => void) | undefined;

    const setup = async () => {
      try {
        const { App } = await import('@capacitor/app');
        const listener = await App.addListener('backButton', ({ canGoBack }) => {
          if (canGoBack) {
            navigate(-1);
          } else {
            App.minimizeApp();
          }
        });
        cleanup = () => listener.remove();
      } catch { /* web fallback */ }
    };

    setup();
    return () => cleanup?.();
  }, [navigate]);
}
