import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { secureLog } from '@/utils/secureLogger';

export const useAIAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const moderateContent = async (title: string, description: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('moderate-content', {
        body: { title, description }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      secureLog.error('Content moderation failed', error);
      toast({
        title: "Moderation Error",
        description: "Failed to moderate content. Proceeding with manual review.",
        variant: "destructive",
      });
      return { status: 'pending', flagged: false, flags: [] };
    } finally {
      setLoading(false);
    }
  };


  const suggestCategory = async (title: string, description?: string, images?: string[]) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('suggest-category', {
        body: { title, description, images }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      secureLog.error('Category suggestion failed', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const trackAIInteraction = async (
    listingId: string | null,
    interactionType: string,
    aiSuggestion: any,
    userAction?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('ai_interactions')
        .insert({
          user_id: user.id,
          listing_id: listingId,
          interaction_type: interactionType,
          ai_suggestion: aiSuggestion,
          user_action: userAction
        });

      if (error) throw error;
    } catch (error) {
      secureLog.error('AI interaction tracking failed', error);
    }
  };

  return {
    loading,
    moderateContent,
    suggestCategory,
    trackAIInteraction
  };
};