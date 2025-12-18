import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ConversationItemReference } from "@/components/chat/types";

export const useConversationItems = () => {
  const [itemReferences, setItemReferences] = useState<ConversationItemReference[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItemReferences = useCallback(async (conversationId: string) => {
    if (!conversationId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversation_item_references')
        .select(`
          id,
          conversation_id,
          listing_id,
          referenced_at,
          is_primary,
          listing:listings(id, title, price, images, status)
        `)
        .eq('conversation_id', conversationId)
        .order('is_primary', { ascending: false })
        .order('referenced_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our interface
      const references: ConversationItemReference[] = (data || []).map((ref: any) => ({
        id: ref.id,
        conversation_id: ref.conversation_id,
        listing_id: ref.listing_id,
        referenced_at: ref.referenced_at,
        is_primary: ref.is_primary,
        listing: ref.listing
      }));

      setItemReferences(references);
    } catch (error) {
      console.error('Error fetching item references:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addItemReference = useCallback(async (conversationId: string, listingId: string, isPrimary: boolean = false) => {
    try {
      const { error } = await supabase
        .from('conversation_item_references')
        .insert({
          conversation_id: conversationId,
          listing_id: listingId,
          is_primary: isPrimary
        });

      if (error) {
        // If duplicate, that's okay
        if (error.code !== '23505') {
          throw error;
        }
      }

      // Refresh the references
      await fetchItemReferences(conversationId);
      return true;
    } catch (error) {
      console.error('Error adding item reference:', error);
      return false;
    }
  }, [fetchItemReferences]);

  return {
    itemReferences,
    loading,
    fetchItemReferences,
    addItemReference
  };
};
