
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProfilePictureUploadProps {
  currentAvatarUrl?: string;
  profileName?: string;
  onAvatarUpdate: (avatarUrl: string) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentAvatarUrl,
  profileName,
  onAvatarUpdate
}) => {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      setUploading(true);
      const file = event.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        // Update the profile in the database
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: data.publicUrl })
          .eq('id', user?.id);

        if (updateError) {
          console.error('Profile update error:', updateError);
          throw updateError;
        }

        // Update user metadata
        const { error: metadataError } = await supabase.auth.updateUser({
          data: { avatar_url: data.publicUrl }
        });

        if (metadataError) {
          console.error('Metadata update error:', metadataError);
        }

        onAvatarUpdate(data.publicUrl);
        toast.success('Profile picture updated successfully!');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={currentAvatarUrl} />
          <AvatarFallback className="text-lg">
            {profileName ? profileName.slice(0, 2).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
        <div className="absolute bottom-0 right-0">
          <Label 
            htmlFor="avatar-upload" 
            className="cursor-pointer bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </Label>
          <Input 
            id="avatar-upload" 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </div>
      </div>
      <p className="text-sm text-gray-500 text-center">
        Click the camera icon to upload a new profile picture
      </p>
    </div>
  );
};

export default ProfilePictureUpload;
