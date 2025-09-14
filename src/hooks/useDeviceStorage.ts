import { useState, useCallback } from 'react';
import { Preferences } from '@capacitor/preferences';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { useToast } from './use-toast';

export const useDeviceStorage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Preferences (key-value storage)
  const setPreference = useCallback(async (key: string, value: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      await Preferences.set({ key, value });
      return true;
    } catch (error) {
      console.error('Error setting preference:', error);
      toast({
        title: "Storage Error",
        description: "Failed to save preference to device.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getPreference = useCallback(async (key: string): Promise<string | null> => {
    try {
      const result = await Preferences.get({ key });
      return result.value;
    } catch (error) {
      console.error('Error getting preference:', error);
      return null;
    }
  }, []);

  const removePreference = useCallback(async (key: string): Promise<boolean> => {
    try {
      await Preferences.remove({ key });
      return true;
    } catch (error) {
      console.error('Error removing preference:', error);
      return false;
    }
  }, []);

  const clearAllPreferences = useCallback(async (): Promise<boolean> => {
    try {
      await Preferences.clear();
      toast({
        title: "Storage Cleared",
        description: "All preferences have been cleared.",
      });
      return true;
    } catch (error) {
      console.error('Error clearing preferences:', error);
      toast({
        title: "Storage Error",
        description: "Failed to clear preferences.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // File storage
  const saveFile = useCallback(async (
    fileName: string, 
    content: string, 
    directory: Directory = Directory.Documents
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      await Filesystem.writeFile({
        path: fileName,
        data: content,
        directory,
        encoding: Encoding.UTF8,
      });
      
      toast({
        title: "File Saved",
        description: `${fileName} has been saved to device.`,
      });
      return true;
    } catch (error) {
      console.error('Error saving file:', error);
      toast({
        title: "File Error",
        description: "Failed to save file to device.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const readFile = useCallback(async (
    fileName: string, 
    directory: Directory = Directory.Documents
  ): Promise<string | null> => {
    try {
      const result = await Filesystem.readFile({
        path: fileName,
        directory,
        encoding: Encoding.UTF8,
      });
      return result.data as string;
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  }, []);

  const deleteFile = useCallback(async (
    fileName: string, 
    directory: Directory = Directory.Documents
  ): Promise<boolean> => {
    try {
      await Filesystem.deleteFile({
        path: fileName,
        directory,
      });
      
      toast({
        title: "File Deleted",
        description: `${fileName} has been deleted.`,
      });
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "File Error",
        description: "Failed to delete file.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  const listFiles = useCallback(async (directory: Directory = Directory.Documents): Promise<string[]> => {
    try {
      const result = await Filesystem.readdir({
        path: '',
        directory,
      });
      return result.files.map(file => file.name);
    } catch (error) {
      console.error('Error listing files:', error);
      return [];
    }
  }, []);

  // Cache management for app data
  const cacheData = useCallback(async (key: string, data: any): Promise<boolean> => {
    return await setPreference(`cache_${key}`, JSON.stringify(data));
  }, [setPreference]);

  const getCachedData = useCallback(async (key: string): Promise<any> => {
    try {
      const cached = await getPreference(`cache_${key}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Error parsing cached data:', error);
      return null;
    }
  }, [getPreference]);

  const clearCache = useCallback(async (): Promise<boolean> => {
    try {
      const keys = await Preferences.keys();
      const cacheKeys = keys.keys.filter(key => key.startsWith('cache_'));
      
      for (const key of cacheKeys) {
        await Preferences.remove({ key });
      }
      
      toast({
        title: "Cache Cleared",
        description: "All cached data has been cleared.",
      });
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }, [toast]);

  return {
    // Preferences
    setPreference,
    getPreference,
    removePreference,
    clearAllPreferences,
    
    // Files
    saveFile,
    readFile,
    deleteFile,
    listFiles,
    
    // Cache
    cacheData,
    getCachedData,
    clearCache,
    
    // State
    isLoading,
  };
};