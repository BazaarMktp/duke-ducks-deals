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
      // Check if ANY conversation exists between this buyer and seller (user-to-user)
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('seller_id', product.user_id)
        .limit(1)
        .maybeSingle();

      let conversationId = existingConv?.id;
      let isNewConversation = false;

      if (!conversationId) {
        // Create new conversation (without listing_id - user-to-user)
        const { data: newConv, error: convError } = await supabase
          .from('conversations')
          .insert({
            buyer_id: user.id,
            seller_id: product.user_id,
            listing_id: null // User-to-user, items tracked separately
          })
          .select('id')
          .single();

        if (convError) throw convError;
        conversationId = newConv.id;
        isNewConversation = true;
      }

      // Add item reference to the conversation
      const { error: refError } = await supabase
        .from('conversation_item_references')
        .insert({
          conversation_id: conversationId,
          listing_id: product.id,
          is_primary: isNewConversation // Mark as primary if it's a new conversation
        });

      // Ignore duplicate errors (item already referenced)
      if (refError && refError.code !== '23505') {
        console.error('Error adding item reference:', refError);
      }

      toast({
        title: isNewConversation ? "Chat created!" : "Opening conversation",
        description: isNewConversation ? "Opening conversation..." : "Redirecting to chat...",
      });

      // Navigate to messages with the specific conversation and pre-populate message
      const defaultMessage = product.listing_type === 'wanted' 
        ? "Hi, I have what you're looking for and would like to help!"
        : `Hi, is "${product.title}" still available?`;
      
      navigate('/messages', { 
        state: { 
          conversationId, 
          initialMessage: defaultMessage 
        }
      });

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
