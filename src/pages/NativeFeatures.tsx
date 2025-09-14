import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Zap } from 'lucide-react';
import CameraComponent from '@/components/native/CameraComponent';
import PushNotificationSettings from '@/components/native/PushNotificationSettings';
import DeviceStorageManager from '@/components/native/DeviceStorageManager';
import { Capacitor } from '@capacitor/core';

const NativeFeatures = () => {
  const isNative = Capacitor.isNativePlatform();

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Native Features | Bazaar Mobile App</title>
        <meta name="description" content="Access native mobile features like camera, push notifications, and device storage in the Bazaar app." />
      </Helmet>

      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Smartphone className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Native Features</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the full power of the Bazaar app with native mobile features including camera access, 
            push notifications, and local storage capabilities.
          </p>
          
          {!isNative && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <Zap className="h-5 w-5" />
                  Web Preview Mode
                </CardTitle>
                <CardDescription className="text-amber-700">
                  You're currently viewing the web version. Download the mobile app to access all native features!
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-1">
          <CameraComponent />
          <PushNotificationSettings />
          <DeviceStorageManager />
        </div>

        {isNative && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <Zap className="h-8 w-8 mx-auto text-green-600" />
                <h3 className="font-semibold text-green-800">Native App Active</h3>
                <p className="text-sm text-green-700">
                  All native features are now available! You can use the camera, receive push notifications, 
                  and access device storage.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NativeFeatures;