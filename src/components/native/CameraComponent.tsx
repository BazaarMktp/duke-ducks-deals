import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Image, Download, Loader2 } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { Capacitor } from '@capacitor/core';

const CameraComponent = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { takePicture, selectFromGallery, savePhotoToDevice, isLoading } = useCamera();

  const handleTakePicture = async () => {
    const photoUri = await takePicture();
    if (photoUri) {
      setCapturedImage(photoUri);
    }
  };

  const handleSelectFromGallery = async () => {
    const photoUri = await selectFromGallery();
    if (photoUri) {
      setCapturedImage(photoUri);
    }
  };

  const handleSavePhoto = async () => {
    if (!capturedImage) return;
    
    const fileName = `bazaar_photo_${Date.now()}.jpg`;
    await savePhotoToDevice(capturedImage, fileName);
  };

  if (!Capacitor.isNativePlatform()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Camera Access
          </CardTitle>
          <CardDescription>
            Camera features are only available on mobile devices.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Camera Access
        </CardTitle>
        <CardDescription>
          Take photos or select from your gallery for listings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={handleTakePicture} 
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Camera className="h-4 w-4 mr-2" />
            )}
            Take Photo
          </Button>
          
          <Button 
            onClick={handleSelectFromGallery} 
            disabled={isLoading}
            variant="outline"
            className="flex-1"
          >
            <Image className="h-4 w-4 mr-2" />
            Gallery
          </Button>
        </div>

        {capturedImage && (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border">
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="w-full h-48 object-cover"
              />
            </div>
            
            <Button 
              onClick={handleSavePhoto}
              variant="secondary"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Save to Device
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CameraComponent;