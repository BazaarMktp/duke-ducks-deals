import { useState, useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { useToast } from './use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const usePushNotifications = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (Capacitor.isNativePlatform() && user) {
      initializePushNotifications();
    }
  }, [user]);

  const initializePushNotifications = async () => {
    try {
      // Request permission
      const permission = await PushNotifications.requestPermissions();
      
      if (permission.receive === 'granted') {
        // Register for push notifications
        await PushNotifications.register();
        
        // Listeners
        PushNotifications.addListener('registration', (token) => {
          console.log('Push registration success, token: ' + token.value);
          setPushToken(token.value);
          setIsRegistered(true);
          
          // TODO: Send token to your backend to store it
          // You can call a Supabase edge function here to store the token
          saveTokenToBackend(token.value);
        });

        PushNotifications.addListener('registrationError', (error) => {
          console.error('Push registration error:', error);
          toast({
            title: "Push Notification Error",
            description: "Failed to register for push notifications.",
            variant: "destructive",
          });
        });

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push notification received:', notification);
          toast({
            title: notification.title || "New Notification",
            description: notification.body || "You have a new message.",
          });
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
          console.log('Push notification action performed:', notification);
          // Handle notification tap/action
          handleNotificationAction(notification);
        });

      } else {
        toast({
          title: "Permission Denied",
          description: "Push notifications permission was denied.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  };

  const saveTokenToBackend = async (token: string) => {
    try {
      // TODO: Implement edge function to save push token
      // This would typically save the token associated with the user ID
      console.log('Saving push token to backend:', token);
      
      // Example implementation:
      // await supabase.functions.invoke('save-push-token', {
      //   body: { token, userId: user?.id }
      // });
    } catch (error) {
      console.error('Error saving push token:', error);
    }
  };

  const handleNotificationAction = (notification: any) => {
    // Handle different notification actions
    const { data } = notification.notification;
    
    if (data?.type === 'message') {
      // Navigate to messages
      window.location.href = '/messages';
    } else if (data?.type === 'listing') {
      // Navigate to specific listing
      window.location.href = `/listing/${data.listingId}`;
    }
  };

  const sendTestNotification = async () => {
    if (!pushToken) {
      toast({
        title: "No Push Token",
        description: "Push notifications are not registered yet.",
        variant: "destructive",
      });
      return;
    }

    try {
      // TODO: Call your backend to send a test notification
      toast({
        title: "Test Notification",
        description: "Test notification request sent!",
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast({
        title: "Error",
        description: "Failed to send test notification.",
        variant: "destructive",
      });
    }
  };

  const toggleNotifications = async (enabled: boolean) => {
    try {
      if (enabled) {
        await initializePushNotifications();
      } else {
        // Disable notifications
        PushNotifications.removeAllListeners();
        setIsRegistered(false);
        setPushToken(null);
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
    }
  };

  return {
    isRegistered,
    pushToken,
    initializePushNotifications,
    sendTestNotification,
    toggleNotifications,
    isNativePlatform: Capacitor.isNativePlatform(),
  };
};