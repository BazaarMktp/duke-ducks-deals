import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Attachment {
  url: string;
  type: 'image';
  name: string;
  size: number;
}

export const useMessageAttachments = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const { user } = useAuth();
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only JPG, PNG, and WebP images are allowed.",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Images must be under 5MB.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const uploadAttachments = async (files: File[]): Promise<Attachment[]> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upload images.",
        variant: "destructive",
      });
      return [];
    }

    if (files.length > 3) {
      toast({
        title: "Too many files",
        description: "You can upload up to 3 images per message.",
        variant: "destructive",
      });
      return [];
    }

    setUploading(true);
    const attachments: Attachment[] = [];

    try {
      for (const file of files) {
        if (!validateFile(file)) continue;

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        const { data, error } = await supabase.storage
          .from('message-attachments')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Upload error:', error);
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name}`,
            variant: "destructive",
          });
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('message-attachments')
          .getPublicUrl(fileName);

        attachments.push({
          url: publicUrl,
          type: 'image',
          name: file.name,
          size: file.size
        });

        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
      }

      setUploadProgress({});
      return attachments;
    } catch (error) {
      console.error('Error uploading attachments:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadProgress,
    uploadAttachments
  };
};
