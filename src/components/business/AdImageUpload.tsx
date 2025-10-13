import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { compressImage } from '@/utils/imageUtils';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AdImageUploadProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
}

export const AdImageUpload: React.FC<AdImageUploadProps> = ({
  imageUrl,
  onImageChange,
}) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    try {
      // Compress image before uploading
      const compressedBlob = await compressImage(file, 0.85, 1920, 1080);
      
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `business-ads/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('listing-images')
        .upload(fileName, compressedBlob, {
          contentType: file.type || 'image/jpeg',
          cacheControl: '31536000',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw new Error(error.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Image processing error:', error);
      throw error;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Maximum file size is 10MB.',
        variant: 'destructive',
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    toast({
      title: 'Processing',
      description: 'Compressing and uploading your image...',
    });

    try {
      const url = await uploadImage(file);
      onImageChange(url);
      toast({
        title: 'Success',
        description: 'Image uploaded successfully!',
      });
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    }

    setUploading(false);
    event.target.value = '';
  };

  const handleRemoveImage = () => {
    onImageChange('');
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload File</TabsTrigger>
          <TabsTrigger value="url">Enter URL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload Image *</Label>
            <Input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Recommended: 1200x400px for banner ads. Max 10MB.
            </p>
          </div>
          
          {uploading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Upload className="animate-spin h-4 w-4" />
              Uploading...
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="url" className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="url-input">Image URL *</Label>
            <Input
              id="url-input"
              type="url"
              placeholder="https://example.com/your-ad-image.jpg"
              value={imageUrl}
              onChange={(e) => onImageChange(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter the URL of your hosted image
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Image Preview */}
      {imageUrl && (
        <div className="space-y-2">
          <Label>Image Preview</Label>
          <div className="relative border rounded-lg overflow-hidden bg-muted">
            <img
              src={imageUrl}
              alt="Ad preview"
              className="w-full h-auto max-h-64 object-contain"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect width="400" height="200" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%23666"%3EImage failed to load%3C/text%3E%3C/svg%3E';
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};