import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAIAnalysis = () => {
  const { toast } = useToast();

  const analyzeListingContent = async (
    listingId: string,
    title: string,
    description: string,
    images: string[],
    category: string,
    price: number
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-listing-content', {
        body: {
          listingId,
          title,
          description,
          images,
          category,
          price
        }
      });

      if (error) throw error;

      console.log('AI Analysis completed:', data);
      return data;
    } catch (error) {
      console.error('Error analyzing listing content:', error);
      toast({
        title: "AI Analysis Failed",
        description: "Failed to analyze listing content with AI",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    analyzeListingContent
  };
};