
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
      
      // Update all unread messages from others in this conversation
      const { data: updatedMessages, error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false)
        .select('id');
      
      if (error) throw error;
      
      if (updatedMessages && updatedMessages.length > 0) {
        console.log('Successfully marked', updatedMessages.length, 'messages as read');
        
        // Update the local messages state to reflect read status
        setMessages(prev => prev.map(msg => 
          msg.sender_id !== user.id ? { ...msg, is_read: true } : msg
        ));
        
        // Trigger immediate refresh of unread count with a small delay to ensure DB consistency
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
          profiles!messages_sender_id_fkey(
            profile_name,
            id
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch user roles for each profile
      const messagesWithRoles = await Promise.all(
        (data || []).map(async (message) => {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', message.profiles.id);
          
          return {
            ...message,
            profiles: {
              ...message.profiles,
              user_roles: roleData || []
            }
          };
        })
      );

      setMessages(messagesWithRoles);
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
