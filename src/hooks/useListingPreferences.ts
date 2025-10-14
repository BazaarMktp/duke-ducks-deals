import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ListingPreferences {
  default_allow_pickup: boolean;
  default_allow_meet_on_campus: boolean;
  default_allow_drop_off: boolean;
  default_open_to_negotiation: boolean;
  default_location: string;
}

const DEFAULT_PREFERENCES: ListingPreferences = {
  default_allow_pickup: true,
  default_allow_meet_on_campus: true,
  default_allow_drop_off: false,
  default_open_to_negotiation: true,
  default_location: ''
};

export const useListingPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<ListingPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('listing_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences({
          default_allow_pickup: data.default_allow_pickup,
          default_allow_meet_on_campus: data.default_allow_meet_on_campus,
          default_allow_drop_off: data.default_allow_drop_off,
          default_open_to_negotiation: data.default_open_to_negotiation,
          default_location: data.default_location || ''
        });
      }
    } catch (error) {
      console.error('Error fetching listing preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (newPreferences: Partial<ListingPreferences>) => {
    if (!user) {
      toast.error('Please sign in to save preferences');
      return;
    }

    try {
      setSaving(true);
      const updatedPreferences = { ...preferences, ...newPreferences };

      const { error } = await supabase
        .from('listing_preferences')
        .upsert({
          user_id: user.id,
          ...updatedPreferences
        });

      if (error) throw error;

      setPreferences(updatedPreferences);
      toast.success('Preferences saved! These will be your defaults for future listings.', {
        duration: 3000
      });
    } catch (error) {
      console.error('Error saving listing preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  return {
    preferences,
    loading,
    saving,
    savePreferences,
    hasPreferences: loading === false && preferences !== DEFAULT_PREFERENCES
  };
};
