
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/marketplace";

export const useConversation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const startConversation = useCallback(async (product: Product) => {
    if (!user || !product) return;

    try {
      // Check if conversation already exists
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('seller_id', product.user_id)
        .eq('listing_id', product.id)
        .single();

      let conversationId = existingConv?.id;

      // Only create conversation if it doesn't exist
      if (!conversationId) {
        const { data: newConv, error: convError } = await supabase
          .from('conversations')
          .insert({
            buyer_id: user.id,
            seller_id: product.user_id,
            listing_id: product.id
          })
          .select('id')
          .single();

        if (convError) throw convError;
        conversationId = newConv.id;

        // Only send initial message when creating NEW conversation
        const defaultMessage = product.listing_type === 'wanted' 
          ? "Hi, I have what you're looking for and would like to help!"
          : "Hi, I am interested in this item";

        await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            message: defaultMessage
          });

        toast({
          title: "Message sent!",
          description: "Redirecting to chat...",
        });
      } else {
        // Conversation exists, just redirect without sending message
        toast({
          title: "Opening conversation",
          description: "Redirecting to chat...",
        });
      }

      // Navigate to messages with the specific conversation
      navigate('/messages');

    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation.",
        variant: "destructive",
      });
    }
  }, [user, navigate, toast]);

  return {
    startConversation
  };
};
