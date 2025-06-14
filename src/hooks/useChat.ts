
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Conversation, Message } from "@/components/chat/types";

export const useChat = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [showArchived, setShowArchived] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();

    const markMessagesAsRead = useCallback(async (conversationId: string) => {
        if (!user) return;
        try {
            await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('conversation_id', conversationId)
                .neq('sender_id', user.id);
        } catch (error) {
            console.error('Error marking messages as read:', error);
            toast({
                title: "Error",
                description: "Failed to mark messages as read.",
                variant: "destructive",
            });
        }
    }, [user, toast]);

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
                  listings(title),
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

    useEffect(() => {
        if (user) {
            fetchConversations(showArchived);
        }
    }, [user, showArchived, fetchConversations]);
    
    const fetchMessages = useCallback(async (conversationId: string) => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            id,
            message,
            sender_id,
            created_at,
            is_read,
            profiles!messages_sender_id_fkey(profile_name)
          `)
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation);
            markMessagesAsRead(selectedConversation);
            const subscription = supabase
                .channel(`messages:conversation_id=eq.${selectedConversation}`)
                .on('postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${selectedConversation}` },
                    (payload) => {
                        fetchMessages(selectedConversation);
                        markMessagesAsRead(selectedConversation);
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(subscription);
            };
        }
    }, [selectedConversation, fetchMessages, markMessagesAsRead]);

    const sendMessage = async (newMessage: string) => {
        if (!newMessage.trim() || !selectedConversation || !user) return;

        try {
            const { error } = await supabase
                .from('messages')
                .insert({
                    conversation_id: selectedConversation,
                    sender_id: user.id,
                    message: newMessage.trim()
                });

            if (error) throw error;
        } catch (error) {
            console.error('Error sending message:', error);
            toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
        }
    };

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
            if (selectedConversation === conversationId) setSelectedConversation(null);
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
            if (selectedConversation === conversationId) setSelectedConversation(null);
        } catch (error) {
            console.error('Error deleting conversation:', error);
            toast({ title: "Error", description: "Failed to delete conversation.", variant: "destructive" });
        }
    };

    const contactSupport = async () => {
        if (!user) return;
        toast({
            title: "Support",
            description: "Contact support feature coming soon! Please email admin@bazaar.com for assistance.",
        });
    };

    const handleSelectConversation = (convId: string) => {
        setSelectedConversation(convId);
    }

    const toggleShowArchived = () => {
        setShowArchived(prev => !prev);
        setSelectedConversation(null);
    }

    return {
        user,
        loading,
        conversations,
        selectedConversation,
        messages,
        showArchived,
        handleSelectConversation,
        sendMessage,
        archiveConversation,
        deleteConversation,
        contactSupport,
        toggleShowArchived,
    };
};
