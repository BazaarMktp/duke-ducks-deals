import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EmailPreferences {
  message_notifications: boolean;
  deal_notifications: boolean;
  achievement_notifications: boolean;
  weekly_digest: boolean;
  marketing_emails: boolean;
  frequency: 'instant' | 'daily' | 'weekly' | 'never';
}

export const useEmailPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<EmailPreferences>({
    message_notifications: true,
    deal_notifications: true,
    achievement_notifications: true,
    weekly_digest: true,
    marketing_emails: false,
    frequency: 'instant'
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('email_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences({
          message_notifications: data.message_notifications,
          deal_notifications: data.deal_notifications,
          achievement_notifications: data.achievement_notifications,
          weekly_digest: data.weekly_digest,
          marketing_emails: data.marketing_emails,
          frequency: data.frequency
        });
      }
    } catch (error) {
      console.error('Error fetching email preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: Partial<EmailPreferences>) => {
    if (!user) return;

    try {
      setSaving(true);
      const updatedPreferences = { ...preferences, ...newPreferences };

      const { error } = await supabase
        .from('email_preferences')
        .upsert({
          user_id: user.id,
          ...updatedPreferences
        });

      if (error) throw error;

      setPreferences(updatedPreferences);
      toast.success('Email preferences updated successfully');
    } catch (error) {
      console.error('Error updating email preferences:', error);
      toast.error('Failed to update email preferences');
    } finally {
      setSaving(false);
    }
  };

  const updateSinglePreference = async (key: keyof EmailPreferences, value: boolean | string) => {
    await updatePreferences({ [key]: value });
  };

  return {
    preferences,
    loading,
    saving,
    updatePreferences,
    updateSinglePreference,
    refreshPreferences: fetchPreferences
  };
};