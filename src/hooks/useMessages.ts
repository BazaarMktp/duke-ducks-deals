
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/components/chat/types";

export const useMessages = (selectedConversation: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sendingMessage, setSendingMessage] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const markMessagesAsRead = useCallback(async (conversationId: string) => {
    if (!user) return;
    try {
      console.log('Marking messages as read for conversation:', conversationId, 'user:', user.id);
      
      // First check if there are any unread messages from others
      const { data: unreadMessages, error: checkError } = await supabase
        .from('messages')
        .select('id, sender_id, is_read')
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false);
      
      if (checkError) throw checkError;
      console.log('Unread messages found:', unreadMessages?.length || 0);
      
      if (unreadMessages && unreadMessages.length > 0) {
        const { error } = await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('conversation_id', conversationId)
          .neq('sender_id', user.id)
          .eq('is_read', false);
        
        if (error) throw error;
        console.log('Successfully marked messages as read');
        
        // Trigger immediate refresh of unread count
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('unread-messages-updated'));
        }, 100);
      }
      
    } catch (error) {
      console.error('Error marking messages as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark messages as read.",
        variant: "destructive",
      });
    }
  }, [user, toast]);

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

  const sendMessage = async (newMessage: string) => {
    if (!newMessage.trim() || !selectedConversation || !user || sendingMessage) return;

    setSendingMessage(true);
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
    } finally {
      setSendingMessage(false);
    }
  };

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
      markMessagesAsRead(selectedConversation);
      
      const subscription = supabase
        .channel(`messages:conversation_id=eq.${selectedConversation}`)
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${selectedConversation}` },
           (payload) => {
             console.log('New message received from:', payload.new?.sender_id, 'current user:', user?.id);
             fetchMessages(selectedConversation);
             // Only mark as read if the message is not from the current user
             if (payload.new && payload.new.sender_id !== user?.id) {
               setTimeout(() => markMessagesAsRead(selectedConversation), 100);
             }
           }
         )
         .on('postgres_changes',
           { event: 'UPDATE', schema: 'public', table: 'messages', filter: `conversation_id=eq.${selectedConversation}` },
           (payload) => {
             console.log('Message updated:', payload);
             // Refresh messages and trigger unread count refresh when messages are updated (marked as read)
             fetchMessages(selectedConversation);
             setTimeout(() => {
               window.dispatchEvent(new CustomEvent('unread-messages-updated'));
             }, 100);
           }
         )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [selectedConversation, fetchMessages, markMessagesAsRead, user?.id]);

  return {
    messages,
    sendingMessage,
    sendMessage
  };
};
