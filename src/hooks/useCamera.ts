import { useState } from 'react';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { useToast } from './use-toast';

export const useCamera = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const checkPermissions = async () => {
    try {
      const permissions = await Camera.checkPermissions();
      console.log('Camera permissions:', permissions);
      
      if (permissions.camera !== 'granted') {
        const requestResult = await Camera.requestPermissions();
        return requestResult.camera === 'granted';
      }
      return true;
    } catch (error) {
      console.error('Error checking camera permissions:', error);
      return false;
    }
  };

  const takePicture = async (): Promise<string | null> => {
    try {
      setIsLoading(true);
      
      // Check permissions first
      const hasPermission = await checkPermissions();
      if (!hasPermission) {
        toast({
          title: "Camera Permission Required",
          description: "Please grant camera permission to take photos.",
          variant: "destructive",
        });
        return null;
      }

      const photo: Photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      return photo.webPath || null;
    } catch (error) {
      console.error('Error taking picture:', error);
      toast({
        title: "Camera Error",
        description: "Failed to take picture. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const selectFromGallery = async (): Promise<string | null> => {
    try {
      setIsLoading(true);
      
      const photo: Photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });

      return photo.webPath || null;
    } catch (error) {
      console.error('Error selecting from gallery:', error);
      toast({
        title: "Gallery Error",
        description: "Failed to select image from gallery.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const savePhotoToDevice = async (photoUri: string, fileName: string): Promise<boolean> => {
    try {
      if (!Capacitor.isNativePlatform()) {
        toast({
          title: "Not Available",
          description: "Photo saving is only available on mobile devices.",
          variant: "destructive",
        });
        return false;
      }

      const response = await fetch(photoUri);
      const blob = await response.blob();
      const base64Data = await convertBlobToBase64(blob);

      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents,
      });

      toast({
        title: "Photo Saved",
        description: "Photo has been saved to your device.",
      });
      return true;
    } catch (error) {
      console.error('Error saving photo:', error);
      toast({
        title: "Save Error",
        description: "Failed to save photo to device.",
        variant: "destructive",
      });
      return false;
    }
  };

  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return {
    takePicture,
    selectFromGallery,
    savePhotoToDevice,
    isLoading,
    checkPermissions,
  };
};