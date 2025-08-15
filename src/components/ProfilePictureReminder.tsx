import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProfilePictureReminderProps {
  currentAvatarUrl?: string;
  onUploadClick: () => void;
}

const ProfilePictureReminder: React.FC<ProfilePictureReminderProps> = ({
  currentAvatarUrl,
  onUploadClick
}) => {
  const [showReminder, setShowReminder] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkReminderNeeded = async () => {
      if (!user || currentAvatarUrl) {
        setLoading(false);
        return;
      }

      try {
        // Get the last reminder date from localStorage
        const lastReminderKey = `profile_picture_reminder_${user.id}`;
        const lastReminder = localStorage.getItem(lastReminderKey);
        const now = new Date();
        
        if (lastReminder) {
          const lastReminderDate = new Date(lastReminder);
          const daysSinceReminder = Math.floor((now.getTime() - lastReminderDate.getTime()) / (1000 * 60 * 60 * 24));
          
          // Show reminder if 2 or more days have passed
          if (daysSinceReminder >= 2) {
            setShowReminder(true);
          }
        } else {
          // First time - check if user has been registered for more than a day
          const { data: profile } = await supabase
            .from('profiles')
            .select('created_at')
            .eq('id', user.id)
            .single();

          if (profile) {
            const createdDate = new Date(profile.created_at);
            const daysSinceCreated = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysSinceCreated >= 1) {
              setShowReminder(true);
            }
          }
        }
      } catch (error) {
        console.error('Error checking reminder status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkReminderNeeded();
  }, [user, currentAvatarUrl]);

  const handleDismiss = () => {
    if (user) {
      const lastReminderKey = `profile_picture_reminder_${user.id}`;
      localStorage.setItem(lastReminderKey, new Date().toISOString());
    }
    setShowReminder(false);
  };

  const handleUploadClick = () => {
    handleDismiss();
    onUploadClick();
  };

  if (loading || !showReminder || currentAvatarUrl) {
    return null;
  }

  return (
    <Alert className="mb-4 bg-blue-50 border-blue-200">
      <Camera className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <strong>Complete your profile!</strong> Adding a profile picture helps build trust with other users and makes you eligible for verification.
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleUploadClick}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add Photo
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
            className="p-1 h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ProfilePictureReminder;