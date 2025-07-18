import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
      console.error('Error moderating content:', error);
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

  const generateDescription = async (title: string, category: string, images?: string[]) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('generate-description', {
        body: { title, category, images }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating description:', error);
      toast({
        title: "Generation Error",
        description: "Failed to generate description.",
        variant: "destructive",
      });
      return null;
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
      console.error('Error suggesting category:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const enhancedSearch = async (query: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('enhanced-search', {
        body: { query }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in enhanced search:', error);
      return { keywords: query, category: null, priceRange: null, condition: null, urgency: null };
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
      console.error('Error tracking AI interaction:', error);
    }
  };

  return {
    loading,
    moderateContent,
    generateDescription,
    suggestCategory,
    enhancedSearch,
    trackAIInteraction
  };
};