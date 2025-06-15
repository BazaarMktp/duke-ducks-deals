
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
        const { data, error } = await supabase
          .from('user_badges')
          .select('badge_type')
          .eq('user_id', userId)
          .eq('badge_type', 'VERIFIED_BLUE_DEVIL')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking verification:', error);
        }

        setIsVerified(!!data);
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
