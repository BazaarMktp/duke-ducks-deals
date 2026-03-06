import { useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';

/**
 * Detects if running inside a native Capacitor shell
 */
export const isNativePlatform = () => Capacitor.isNativePlatform();
export const getPlatform = () => Capacitor.getPlatform(); // 'ios' | 'android' | 'web'

/**
 * Initialize native plugins when running inside Capacitor
 */
export function useCapacitorInit() {
  useEffect(() => {
    if (!isNativePlatform()) return;

    const initNative = async () => {
      try {
        // Status Bar
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#003087' });

        // Splash Screen
        const { SplashScreen } = await import('@capacitor/splash-screen');
        await SplashScreen.hide();

        // Keyboard
        const { Keyboard } = await import('@capacitor/keyboard');
        Keyboard.addListener('keyboardWillShow', () => {
          document.body.classList.add('keyboard-open');
        });
        Keyboard.addListener('keyboardWillHide', () => {
          document.body.classList.remove('keyboard-open');
        });
      } catch (e) {
        // Plugins not available on web
        console.log('Capacitor plugin init skipped:', e);
      }
    };

    initNative();
  }, []);
}

/**
 * Haptic feedback helper — gracefully no-ops on web
 */
export function useHaptics() {
  const impact = useCallback(async (style: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!isNativePlatform()) return;
    try {
      const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
      const map = { light: ImpactStyle.Light, medium: ImpactStyle.Medium, heavy: ImpactStyle.Heavy };
      await Haptics.impact({ style: map[style] });
    } catch { /* noop */ }
  }, []);

  const notification = useCallback(async (type: 'success' | 'warning' | 'error' = 'success') => {
    if (!isNativePlatform()) return;
    try {
      const { Haptics, NotificationType } = await import('@capacitor/haptics');
      const map = { success: NotificationType.Success, warning: NotificationType.Warning, error: NotificationType.Error };
      await Haptics.notification({ type: map[type] });
    } catch { /* noop */ }
  }, []);

  return { impact, notification };
}
