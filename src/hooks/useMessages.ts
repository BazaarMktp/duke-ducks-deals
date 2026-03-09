
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Message, MessageAttachment } from "@/components/chat/types";

export const useMessages = (selectedConversation: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sendingMessage, setSendingMessage] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  // Cache profile data to avoid refetching for every incoming message
  const profileCacheRef = useRef<Record<string, { profile_name: string; avatar_url?: string }>>({});

  const markMessagesAsRead = useCallback(async (conversationId: string) => {
    if (!user) return;
    try {
      const { data: updatedMessages, error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false)
        .select('id');
      
      if (error) throw error;
      
      if (updatedMessages && updatedMessages.length > 0) {
        setMessages(prev => prev.map(msg => 
          msg.sender_id !== user.id ? { ...msg, is_read: true } : msg
        ));
        
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('unread-messages-updated'));
        }, 100);
      }
      
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [user]);

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
      
      const transformedMessages = (data || []).map(msg => {
        // Cache profile data for each sender
        if (msg.profiles) {
          profileCacheRef.current[msg.sender_id] = msg.profiles as any;
        }
        return {
          ...msg,
          likes: Array.isArray(msg.likes) ? msg.likes.filter((like): like is string => typeof like === 'string') : [],
          attachments: (Array.isArray(msg.attachments) ? msg.attachments : []) as unknown as MessageAttachment[]
        };
      });
      
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

  // Fetch a sender's profile and cache it
  const resolveProfile = useCallback(async (senderId: string) => {
    if (profileCacheRef.current[senderId]) {
      return profileCacheRef.current[senderId];
    }
    try {
      const { data } = await supabase
        .from('profiles')
        .select('profile_name, avatar_url')
        .eq('id', senderId)
        .single();
      if (data) {
        profileCacheRef.current[senderId] = data;
        return data;
      }
    } catch {
      // ignore
    }
    return { profile_name: 'User' };
  }, []);

  const sendMessage = async (newMessage: string, attachments?: any[]) => {
    if ((!newMessage.trim() && !attachments?.length) || !selectedConversation || !user || sendingMessage) return;

    setSendingMessage(true);
    
    const messageText = newMessage.trim() || (attachments?.length ? '📷 Image' : '');
    
    const tempId = `temp_${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      message: messageText,
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

    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation,
          sender_id: user.id,
          message: messageText,
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
           async (payload) => {
             if (payload.new) {
               const newMsg = payload.new as any;
               
               // Skip if this is from the current user (already added optimistically)
               if (newMsg.sender_id === user?.id) {
                 // Ensure the optimistic message is replaced with the real one
                 setMessages(prev => {
                   const hasReal = prev.some(m => m.id === newMsg.id);
                   if (hasReal) return prev;
                   // Already handled by optimistic update
                   return prev;
                 });
                 return;
               }

               // Resolve profile before adding message to avoid empty profile flash
               const profile = await resolveProfile(newMsg.sender_id);

               setMessages(prev => {
                 if (prev.some(m => m.id === newMsg.id)) return prev;
                 return [...prev, {
                   id: newMsg.id,
                   message: newMsg.message,
                   sender_id: newMsg.sender_id,
                   created_at: newMsg.created_at,
                   is_read: newMsg.is_read,
                   likes: [],
                   attachments: (Array.isArray(newMsg.attachments) ? newMsg.attachments : []) as MessageAttachment[],
                   profiles: profile
                 } as Message];
               });
               
               // Mark as read since user is viewing this conversation
               markMessagesAsRead(selectedConversation);
             }
           }
         )
         .on('postgres_changes',
           { event: 'UPDATE', schema: 'public', table: 'messages', filter: `conversation_id=eq.${selectedConversation}` },
           (payload) => {
             if (payload.new) {
               setMessages(prev => prev.map(msg => 
                 msg.id === payload.new.id 
                   ? { ...msg, is_read: payload.new.is_read, likes: Array.isArray(payload.new.likes) ? payload.new.likes : [] }
                   : msg
               ));
               window.dispatchEvent(new CustomEvent('unread-messages-updated'));
             }
           }
         )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [selectedConversation, fetchMessages, markMessagesAsRead, user?.id, resolveProfile]);

  return {
    messages,
    sendingMessage,
    sendMessage,
    updateMessageLikes
  };
};
