import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, BellOff, TestTube, Smartphone } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Badge } from '@/components/ui/badge';

const PushNotificationSettings = () => {
  const { 
    isRegistered, 
    pushToken, 
    sendTestNotification, 
    toggleNotifications, 
    isNativePlatform 
  } = usePushNotifications();

  if (!isNativePlatform) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Push notifications are only available on mobile devices.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Get notified about new messages, deals, and listings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="push-notifications">Enable Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive push notifications on this device
            </p>
          </div>
          <Switch
            id="push-notifications"
            checked={isRegistered}
            onCheckedChange={toggleNotifications}
          />
        </div>

        {isRegistered && (
          <>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Bell className="h-3 w-3" />
                  Registered
                </Badge>
                {pushToken && (
                  <Badge variant="outline">
                    Token: {pushToken.substring(0, 10)}...
                  </Badge>
                )}
              </div>
            </div>

            <Button 
              onClick={sendTestNotification}
              variant="outline"
              className="w-full"
            >
              <TestTube className="h-4 w-4 mr-2" />
              Send Test Notification
            </Button>
          </>
        )}

        {!isRegistered && (
          <div className="text-center space-y-2">
            <BellOff className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Push notifications are currently disabled. Enable them to receive updates about your listings and messages.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PushNotificationSettings;