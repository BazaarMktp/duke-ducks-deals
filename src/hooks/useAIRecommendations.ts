import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  user_id: string;
  created_at: string;
  ai_features: any;
  similarity: number;
  recommendation_reason?: any;
}

export const useAIRecommendations = (listingId: string | undefined) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (listingId) {
      fetchRecommendations();
    }
  }, [listingId]);

  const fetchRecommendations = async () => {
    if (!listingId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('find-similar-listings', {
        body: { listingId, limit: 5 }
      });

      if (error) throw error;
      
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to load recommendations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const trackRecommendationClick = async (recommendedListingId: string) => {
    try {
      const { error } = await supabase
        .from('listing_recommendations')
        .update({ 
          clicked: true, 
          clicked_at: new Date().toISOString() 
        })
        .eq('listing_id', listingId)
        .eq('recommended_listing_id', recommendedListingId);

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking recommendation click:', error);
    }
  };

  return {
    recommendations,
    loading,
    trackRecommendationClick,
    refetch: fetchRecommendations
  };
};