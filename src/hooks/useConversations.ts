
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Conversation } from "@/components/chat/types";

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchConversations = useCallback(async (isArchivedView: boolean) => {
    if (!user) return;
    setLoading(true);
    try {
      let query = supabase
        .from('conversations')
        .select(`
          id,
          buyer_id,
          seller_id,
          listing_id,
          archived_by_buyer,
          archived_by_seller,
          deleted_by_buyer,
          deleted_by_seller,
          listings!left(title),
          buyer_profile:profiles!conversations_buyer_id_fkey(profile_name),
          seller_profile:profiles!conversations_seller_id_fkey(profile_name)
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);

      if (isArchivedView) {
        query = query.or(`and(buyer_id.eq.${user.id},archived_by_buyer.eq.true),and(seller_id.eq.${user.id},archived_by_seller.eq.true)`);
      } else {
        query = query.or(`and(buyer_id.eq.${user.id},archived_by_buyer.eq.false,deleted_by_buyer.eq.false),and(seller_id.eq.${user.id},archived_by_seller.eq.false,deleted_by_seller.eq.false)`);
      }

      const { data, error } = await query.order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({ title: "Error", description: "Could not fetch conversations.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const archiveConversation = async (conversationId: string) => {
    if (!user) return;
    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;
      const updateData = conversation.buyer_id === user.id
        ? { archived_by_buyer: true }
        : { archived_by_seller: true };
      const { error } = await supabase.from('conversations').update(updateData).eq('id', conversationId);
      if (error) throw error;
      toast({ title: "Success", description: "Conversation archived successfully." });
      setConversations(prev => prev.filter(c => c.id !== conversationId));
    } catch (error) {
      console.error('Error archiving conversation:', error);
      toast({ title: "Error", description: "Failed to archive conversation.", variant: "destructive" });
    }
  };

  const deleteConversation = async (conversationId: string) => {
    if (!user) return;
    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;
      const updateData = conversation.buyer_id === user.id
        ? { deleted_by_buyer: true }
        : { deleted_by_seller: true };
      const { error } = await supabase.from('conversations').update(updateData).eq('id', conversationId);
      if (error) throw error;
      toast({ title: "Success", description: "Conversation deleted successfully." });
      setConversations(prev => prev.filter(c => c.id !== conversationId));
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({ title: "Error", description: "Failed to delete conversation.", variant: "destructive" });
    }
  };

  const toggleShowArchived = () => {
    setShowArchived(prev => !prev);
  };

  return {
    conversations,
    loading,
    showArchived,
    fetchConversations,
    archiveConversation,
    deleteConversation,
    toggleShowArchived,
    setConversations
  };
};
