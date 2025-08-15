
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserVerification = (userId: string | undefined) => {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVerification = async () => {
      if (!userId) {
        setIsVerified(false);
        setLoading(false);
        return;
      }

      try {
        // Check for verified badge AND profile picture
        const [badgeResult, profileResult] = await Promise.all([
          supabase
            .from('user_badges')
            .select('badge_type')
            .eq('user_id', userId)
            .eq('badge_type', 'VERIFIED_BLUE_DEVIL')
            .single(),
          supabase
            .from('profiles')
            .select('avatar_url')
            .eq('id', userId)
            .single()
        ]);

        const hasBadge = !!badgeResult.data;
        const hasProfilePicture = !!(profileResult.data?.avatar_url);

        // User is verified only if they have both the badge AND a profile picture
        setIsVerified(hasBadge && hasProfilePicture);

        if (badgeResult.error && badgeResult.error.code !== 'PGRST116') {
          console.error('Error checking verification badge:', badgeResult.error);
        }
        if (profileResult.error) {
          console.error('Error checking profile picture:', profileResult.error);
        }
      } catch (error) {
        console.error('Error checking verification:', error);
        setIsVerified(false);
      } finally {
        setLoading(false);
      }
    };

    checkVerification();
  }, [userId]);

  return { isVerified, loading };
};
