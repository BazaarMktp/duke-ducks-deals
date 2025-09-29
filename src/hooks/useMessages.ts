
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Message, MessageAttachment } from "@/components/chat/types";

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
          likes,
          attachments,
          profiles!messages_sender_id_fkey(profile_name, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Transform the data to ensure likes and attachments are properly typed
      const transformedMessages = (data || []).map(msg => ({
        ...msg,
        likes: Array.isArray(msg.likes) ? msg.likes.filter((like): like is string => typeof like === 'string') : [],
        attachments: (Array.isArray(msg.attachments) ? msg.attachments : []) as unknown as MessageAttachment[]
      }));
      
      setMessages(transformedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, []);

  const updateMessageLikes = useCallback((messageId: string, newLikes: string[]) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, likes: newLikes } : msg
    ));
  }, []);

  const sendMessage = async (newMessage: string, attachments?: any[]) => {
    if ((!newMessage.trim() && !attachments?.length) || !selectedConversation || !user || sendingMessage) return;

    setSendingMessage(true);
    
    // Create optimistic message
    const tempId = `temp_${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      message: newMessage.trim(),
      sender_id: user.id,
      created_at: new Date().toISOString(),
      is_read: true,
      likes: [],
      attachments: attachments || [],
      status: 'pending',
      profiles: { 
        profile_name: 'You',
        avatar_url: undefined
      }
    };

    // Add optimistic message to UI immediately
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation,
          sender_id: user.id,
          message: newMessage.trim(),
          attachments: attachments || []
        })
        .select(`
          id,
          message,
          sender_id,
          created_at,
          is_read,
          likes,
          attachments,
          profiles!messages_sender_id_fkey(profile_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      // Replace optimistic message with real one
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempId 
            ? { 
                ...data, 
                status: 'sent' as const,
                likes: Array.isArray(data.likes) ? data.likes.filter((like): like is string => typeof like === 'string') : [],
                attachments: (Array.isArray(data.attachments) ? data.attachments : []) as unknown as MessageAttachment[]
              } 
            : msg
        )
      );

      // Send email notification (non-blocking)
      try {
        await supabase.functions.invoke('send-message-notification', {
          body: {
            conversationId: selectedConversation,
            senderId: user.id,
            message: newMessage.trim()
          }
        });
      } catch (emailError) {
        console.error('Email notification failed (non-critical):', emailError);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Mark optimistic message as failed
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempId 
            ? { ...msg, status: 'failed' } 
            : msg
        )
      );
      
      toast({ 
        title: "Error", 
        description: "Failed to send message. Tap to retry.", 
        variant: "destructive" 
      });
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
             // Immediately add the new message to the local state for instant display
             if (payload.new) {
               const newMessage: any = {
                 id: payload.new.id,
                 message: payload.new.message,
                 sender_id: payload.new.sender_id,
                 created_at: payload.new.created_at,
                 is_read: payload.new.is_read,
                 profiles: { profile_name: 'Loading...' }
               };
               setMessages(prev => [...prev, newMessage]);
               
               // Fetch complete message details after adding it
               setTimeout(() => fetchMessages(selectedConversation), 50);
               
               // Only mark as read if the message is not from the current user
               if (payload.new.sender_id !== user?.id) {
                 setTimeout(() => markMessagesAsRead(selectedConversation), 100);
               }
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
    sendMessage,
    updateMessageLikes
  };
};
