import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useGeminiAI = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getPriceSuggestion = async (title: string, category: string, condition: string, description: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('price-intelligence', {
        body: { title, category, condition, description }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Price intelligence error:', error);
      toast({
        title: "Error",
        description: "Failed to get price suggestion",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getSmartReplies = async (lastMessage: string, listingTitle: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('smart-messaging', {
        body: { type: 'suggest_reply', context: { lastMessage, listingTitle } }
      });

      if (error) throw error;
      return JSON.parse(data.result);
    } catch (error) {
      console.error('Smart replies error:', error);
      return [];
    }
  };

  const chatWithBot = async (messages: any[], userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('campus-chatbot', {
        body: { messages, userId }
      });

      if (error) throw error;
      return data.message;
    } catch (error) {
      console.error('Chatbot error:', error);
      return "Sorry, I'm having trouble responding right now. Please try again.";
    }
  };

  const getListingAssistance = async (type: string, data: any) => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase.functions.invoke('listing-assistant', {
        body: { type, data }
      });

      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Listing assistant error:', error);
      toast({
        title: "Error",
        description: "Failed to get AI assistance",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getPriceSuggestion,
    getSmartReplies,
    chatWithBot,
    getListingAssistance
  };
};
