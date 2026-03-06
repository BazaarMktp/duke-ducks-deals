import { useEffect, useCallback } from 'react';
import { isNativePlatform } from './useCapacitor';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

/**
 * Registers for push notifications on native platforms
 * and stores the device token in Supabase for targeting.
 */
export function usePushNotifications() {
  const { user } = useAuth();

  const register = useCallback(async () => {
    if (!isNativePlatform() || !user) return;

    try {
      const { PushNotifications } = await import('@capacitor/push-notifications');

      // Request permission
      const permResult = await PushNotifications.requestPermissions();
      if (permResult.receive !== 'granted') return;

      // Register with APNs / FCM
      await PushNotifications.register();

      // Listen for token
      PushNotifications.addListener('registration', async (token) => {
        console.log('Push token:', token.value);
        // Store token in user metadata or a device_tokens table
        // For now we store it in profile metadata
        await supabase
          .from('profiles')
          .update({
            // Store as JSON in an available field or create a separate table
            compatibility_score_cache: {
              push_token: token.value,
              platform: (await import('@capacitor/core')).Capacitor.getPlatform(),
              updated_at: new Date().toISOString()
            }
          })
          .eq('id', user.id);
      });

      // Handle incoming notifications
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push received:', notification);
      });

      // Handle notification tap
      PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        const data = action.notification.data;
        if (data?.link) {
          window.location.hash = data.link;
        }
      });
    } catch (e) {
      console.log('Push notification setup skipped:', e);
    }
  }, [user]);

  useEffect(() => {
    register();
  }, [register]);
}
