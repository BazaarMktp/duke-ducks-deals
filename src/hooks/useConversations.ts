
import { useState, useCallback, useEffect, useRef } from "react";
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

  const fetchConversations = useCallback(async (isArchivedView: boolean, isInitial = false) => {
    if (!user) return;
    if (isInitial || conversations.length === 0) {
      setLoading(true);
    }
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
          last_message_preview,
          last_message_at,
          listings!left(title, price, images),
          buyer_profile:profiles!conversations_buyer_id_fkey(profile_name, avatar_url),
          seller_profile:profiles!conversations_seller_id_fkey(profile_name, avatar_url)
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);

      if (isArchivedView) {
        query = query.or(`and(buyer_id.eq.${user.id},archived_by_buyer.eq.true),and(seller_id.eq.${user.id},archived_by_seller.eq.true)`);
      } else {
        query = query.or(`and(buyer_id.eq.${user.id},archived_by_buyer.eq.false,deleted_by_buyer.eq.false),and(seller_id.eq.${user.id},archived_by_seller.eq.false,deleted_by_seller.eq.false)`);
      }

      const { data, error } = await query.order('last_message_at', { ascending: false, nullsFirst: false }).order('updated_at', { ascending: false });

      if (error) throw error;
      
      // Fetch unread counts and item counts for each conversation
      const conversationsWithCounts = await Promise.all((data || []).map(async (conv) => {
        const [unreadResult, itemCountResult] = await Promise.all([
          supabase
            .from('messages')
            .select('id')
            .eq('conversation_id', conv.id)
            .neq('sender_id', user.id)
            .eq('is_read', false),
          supabase
            .from('conversation_item_references')
            .select('id', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
        ]);
        
        return {
          ...conv,
          unread_count: unreadResult.data?.length || 0,
          item_count: itemCountResult.count || 0
        };
      }));
      
      setConversations(conversationsWithCounts);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({ title: "Error", description: "Could not fetch conversations.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Move conversation to top when it receives activity
  const moveConversationToTop = useCallback((conversationId: string, lastMessagePreview?: string) => {
    setConversations(prev => {
      const index = prev.findIndex(c => c.id === conversationId);
      if (index === -1) return prev;
      
      const conversation = prev[index];
      const updated = {
        ...conversation,
        last_message_at: new Date().toISOString(),
        ...(lastMessagePreview && { last_message_preview: lastMessagePreview })
      };
      
      return [updated, ...prev.filter(c => c.id !== conversationId)];
    });
  }, []);

  // Clear unread count for a specific conversation (called when user opens it)
  const clearUnreadCount = useCallback((conversationId: string) => {
    setConversations(prev =>
      prev.map(c => c.id === conversationId ? { ...c, unread_count: 0 } : c)
    );
  }, []);

  // Subscribe to real-time updates for conversations and messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('conversations-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `buyer_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            // New conversation created where user is buyer — refetch to get full joined data
            fetchConversations(showArchived, false);
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            moveConversationToTop(payload.new.id as string, payload.new.last_message_preview as string);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `seller_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            // New conversation created where user is seller — refetch to get full joined data
            fetchConversations(showArchived, false);
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            moveConversationToTop(payload.new.id as string, payload.new.last_message_preview as string);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          if (!payload.new) return;
          const msg = payload.new as any;
          // Only increment unread for messages from others
          if (msg.sender_id === user.id) return;
          
          // Update unread count for the relevant conversation
          setConversations(prev => {
            const idx = prev.findIndex(c => c.id === msg.conversation_id);
            if (idx === -1) {
              // Conversation not in list yet (e.g. brand new) — refetch
              fetchConversations(showArchived, false);
              return prev;
            }
            const conv = prev[idx];
            const updated = {
              ...conv,
              unread_count: (conv.unread_count || 0) + 1,
              last_message_preview: msg.message?.slice(0, 50),
              last_message_at: msg.created_at,
            };
            return [updated, ...prev.filter(c => c.id !== msg.conversation_id)];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, moveConversationToTop, showArchived, fetchConversations]);

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
    setConversations,
    moveConversationToTop,
    clearUnreadCount
  };
};
