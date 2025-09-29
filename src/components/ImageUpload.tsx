
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Upload, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ImageEditor from './ImageEditor';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { compressImage } from '@/utils/imageUtils';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, onImagesChange, maxImages = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    if (!user) return null;

    try {
      // Compress image before uploading
      const compressedBlob = await compressImage(file, 0.85, 1920, 1920);
      
      const fileExt = 'jpg'; // Always save as JPG after compression
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('listing-images')
        .upload(fileName, compressedBlob, {
          contentType: 'image/jpeg',
          cacheControl: '31536000', // Cache for 1 year
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Image processing error:', error);
      return null;
    }
  };

  const uploadDataURL = async (dataURL: string) => {
    if (!user) return null;

    // Convert data URL to blob
    const response = await fetch(dataURL);
    const blob = await response.blob();
    
    const fileName = `${user.id}/${Math.random()}.jpg`;

    const { data, error } = await supabase.storage
      .from('listing-images')
      .upload(fileName, blob);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('listing-images')
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can only upload up to ${maxImages} images.`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const newImages: string[] = [];
    let processedCount = 0;

    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit before compression
        toast({
          title: "File too large",
          description: `${file.name} is too large. Maximum size is 10MB.`,
          variant: "destructive",
        });
        continue;
      }

      processedCount++;
      toast({
        title: "Processing images",
        description: `Compressing image ${processedCount} of ${files.length}...`,
      });

      const url = await uploadImage(file);
      if (url) {
        newImages.push(url);
      } else {
        toast({
          title: "Upload failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        });
      }
    }

    if (newImages.length > 0) {
      toast({
        title: "Success",
        description: `Uploaded ${newImages.length} image${newImages.length > 1 ? 's' : ''} successfully!`,
      });
    }

    onImagesChange([...images, ...newImages]);
    setUploading(false);
    event.target.value = '';
  };

  const handleEditImage = (imageUrl: string, index: number) => {
    setEditingImage(imageUrl);
    setEditingIndex(index);
  };

  const handleSaveEditedImage = async (editedImageUrl: string) => {
    if (editingIndex === null) return;

    setUploading(true);
    const uploadedUrl = await uploadDataURL(editedImageUrl);
    
    if (uploadedUrl) {
      const newImages = [...images];
      newImages[editingIndex] = uploadedUrl;
      onImagesChange(newImages);
      
      toast({
        title: "Image updated",
        description: "Your edited image has been saved.",
      });
    }
    
    setUploading(false);
    setEditingImage(null);
    setEditingIndex(null);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="image-upload" className="block text-sm font-medium mb-2">
          Images ({images.length}/{maxImages})
        </label>
        <Input
          id="image-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading || images.length >= maxImages}
          className="mb-2"
        />
        {uploading && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Upload className="animate-spin mr-2" size={16} />
            Processing images...
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <OptimizedImage
                src={image}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-contain bg-gray-50 rounded-lg border"
                aspectRatio="video"
                priority={index === 0}
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="bg-white/90"
                  onClick={() => handleEditImage(image, index)}
                >
                  <Edit size={12} />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeImage(index)}
                >
                  <X size={12} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingImage && (
        <ImageEditor
          imageUrl={editingImage}
          isOpen={!!editingImage}
          onClose={() => {
            setEditingImage(null);
            setEditingIndex(null);
          }}
          onSave={handleSaveEditedImage}
        />
      )}
    </div>
  );
};

export default ImageUpload;
