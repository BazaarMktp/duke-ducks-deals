
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Upload, Edit, Camera, Sun, RotateCcw, CheckCircle2, AlertTriangle, XCircle, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ImageEditor from './ImageEditor';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { compressImage } from '@/utils/imageUtils';
import { analyzeImageQuality, type ImageQualityResult, type QualityLevel } from '@/utils/imageQuality';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const QUALITY_CONFIG: Record<QualityLevel, { label: string; color: string; icon: React.ReactNode }> = {
  low: { label: 'Low', color: 'text-destructive', icon: <XCircle className="h-3.5 w-3.5" /> },
  medium: { label: 'Medium', color: 'text-warning', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  great: { label: 'Great', color: 'text-success', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
};

const PHOTO_TIPS = [
  { icon: <Sun className="h-4 w-4 shrink-0" />, text: 'Use natural lighting' },
  { icon: <RotateCcw className="h-4 w-4 shrink-0" />, text: 'Take photos from multiple angles' },
  { icon: <Camera className="h-4 w-4 shrink-0" />, text: 'Show the actual item clearly' },
  { icon: <ImageIcon className="h-4 w-4 shrink-0" />, text: 'Avoid blurry images' },
];

const ImageUpload: React.FC<ImageUploadProps> = ({ images, onImagesChange, maxImages = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [qualityResults, setQualityResults] = useState<Record<number, ImageQualityResult>>({});
  const [showTips, setShowTips] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    if (!user) return null;
    try {
      const compressedBlob = await compressImage(file, 0.82, 1200, 1200);
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;

      const { data, error } = await supabase.storage
        .from('listing-images')
        .upload(fileName, compressedBlob, {
          contentType: 'image/jpeg',
          cacheControl: '31536000',
          upsert: false,
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

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (images.length + files.length > maxImages) {
      toast({
        title: 'Too many images',
        description: `You can only upload up to ${maxImages} images.`,
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    setShowTips(false);
    const newImages: string[] = [];
    const newQuality: Record<number, ImageQualityResult> = { ...qualityResults };
    let processedCount = 0;

    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `${file.name} is too large. Maximum size is 10MB.`,
          variant: 'destructive',
        });
        continue;
      }

      processedCount++;
      toast({
        title: 'Processing images',
        description: `Compressing image ${processedCount} of ${files.length}...`,
      });

      // Run quality analysis in parallel with upload
      const [url, quality] = await Promise.all([
        uploadImage(file),
        analyzeImageQuality(file),
      ]);

      if (url) {
        const idx = images.length + newImages.length;
        newImages.push(url);
        newQuality[idx] = quality;

        if (quality.level === 'low') {
          toast({
            title: 'Low quality photo detected',
            description: quality.issues[0] || 'Consider retaking this photo for better results.',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Upload failed',
          description: `Failed to upload ${file.name}`,
          variant: 'destructive',
        });
      }
    }

    if (newImages.length > 0) {
      toast({
        title: 'Success',
        description: `Uploaded ${newImages.length} image${newImages.length > 1 ? 's' : ''} successfully!`,
      });
    }

    setQualityResults(newQuality);
    onImagesChange([...images, ...newImages]);
    setUploading(false);
    event.target.value = '';
  }, [images, maxImages, qualityResults, toast, uploadImage, onImagesChange]);

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
      // Clear quality result for edited image – it's been modified
      const updated = { ...qualityResults };
      delete updated[editingIndex];
      setQualityResults(updated);
      toast({ title: 'Image updated', description: 'Your edited image has been saved.' });
    }
    setUploading(false);
    setEditingImage(null);
    setEditingIndex(null);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // Re-index quality results
    const updated: Record<number, ImageQualityResult> = {};
    Object.entries(qualityResults).forEach(([k, v]) => {
      const num = Number(k);
      if (num < index) updated[num] = v;
      else if (num > index) updated[num - 1] = v;
    });
    setQualityResults(updated);
    onImagesChange(newImages);
    if (newImages.length === 0) setShowTips(true);
  };

  // Compute overall quality
  const overallQuality: QualityLevel | null = images.length > 0
    ? Object.values(qualityResults).length > 0
      ? Object.values(qualityResults).some(r => r.level === 'low')
        ? 'low'
        : Object.values(qualityResults).some(r => r.level === 'medium')
          ? 'medium'
          : 'great'
      : null
    : null;

  return (
    <div className="space-y-4">
      {/* Motivational prompt */}
      <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/10 px-3 py-2.5">
        <Camera className="h-4 w-4 text-primary shrink-0" />
        <p className="text-sm text-foreground/80">
          <span className="font-medium">Listings with clear photos sell 3× faster.</span>
        </p>
      </div>

      {/* Photo tips – shown when no images uploaded yet */}
      {showTips && images.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-2.5">
          <p className="text-sm font-medium text-foreground">Tips for better listings:</p>
          <ul className="space-y-1.5">
            {PHOTO_TIPS.map((tip, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                {tip.icon}
                <span>{tip.text}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground pt-1">Clean background preferred</p>
        </div>
      )}

      {/* Upload input */}
      <div>
        <label htmlFor="image-upload" className="block text-sm font-medium mb-1.5">
          Photos ({images.length}/{maxImages})
        </label>
        <div className="relative">
          <Input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading || images.length >= maxImages}
            className="mb-1"
          />
        </div>
        {uploading && (
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <Upload className="animate-spin mr-2" size={16} />
            Processing images...
          </div>
        )}
      </div>

      {/* Overall quality indicator */}
      {overallQuality && (
        <div className={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium',
          overallQuality === 'great' && 'bg-success/10 text-success',
          overallQuality === 'medium' && 'bg-warning/10 text-warning',
          overallQuality === 'low' && 'bg-destructive/10 text-destructive',
        )}>
          {QUALITY_CONFIG[overallQuality].icon}
          <span>Photo quality: {QUALITY_CONFIG[overallQuality].label}</span>
          {overallQuality === 'low' && (
            <span className="text-xs font-normal ml-1">– consider retaking photos</span>
          )}
        </div>
      )}

      {/* Image previews grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((image, index) => {
            const quality = qualityResults[index];
            return (
              <div key={index} className="relative group rounded-lg overflow-hidden border border-border">
                <OptimizedImage
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-contain bg-muted/30"
                  aspectRatio="video"
                  priority={index === 0}
                />
                {/* Per-image quality badge */}
                {quality && (
                  <div className={cn(
                    'absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium backdrop-blur-sm',
                    quality.level === 'great' && 'bg-success/80 text-success-foreground',
                    quality.level === 'medium' && 'bg-warning/80 text-warning-foreground',
                    quality.level === 'low' && 'bg-destructive/80 text-destructive-foreground',
                  )}>
                    {QUALITY_CONFIG[quality.level].icon}
                    {QUALITY_CONFIG[quality.level].label}
                  </div>
                )}
                {/* Action buttons */}
                <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0 bg-background/90"
                    onClick={() => handleEditImage(image, index)}
                  >
                    <Edit size={12} />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => removeImage(index)}
                  >
                    <X size={12} />
                  </Button>
                </div>
                {/* First photo label */}
                {index === 0 && (
                  <span className="absolute top-1.5 left-1.5 bg-primary/80 text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-sm">
                    Cover
                  </span>
                )}
              </div>
            );
          })}

          {/* Add more slot */}
          {images.length < maxImages && (
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center h-32 rounded-lg border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
            >
              <Upload className="h-5 w-5 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">Add photo</span>
            </label>
          )}
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
