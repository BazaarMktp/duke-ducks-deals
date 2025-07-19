
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { RealtimeChannel } from '@supabase/supabase-js';

export const useUnreadMessages = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();
  const channelRef = useRef<RealtimeChannel | null>(null);

  const fetchUnreadCount = useCallback(async () => {
    if (!user?.id) {
      setUnreadCount(0);
      return;
    }
    try {
      const { data, error } = await supabase.rpc('get_unread_message_count', {
        _user_id: user.id,
      });

      if (error) {
        throw error;
      }
      console.log('Fetched unread count:', data);
      const count = data || 0;
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread message count:', error);
      setUnreadCount(0); // Reset to 0 on error
      toast({
        title: "Error",
        description: "Could not fetch unread message count.",
        variant: "destructive",
      });
    }
  }, [user?.id, toast]);

  useEffect(() => {
    if (user?.id) {
      fetchUnreadCount();
    } else {
      setUnreadCount(0);
    }
  }, [user?.id, fetchUnreadCount]); // Need fetchUnreadCount for proper dependency

  // Listen for custom event to refresh unread count
  useEffect(() => {
    const handleUnreadUpdate = async () => {
      console.log('Unread messages update event received');
      if (!user?.id) {
        setUnreadCount(0);
        return;
      }
      try {
        const { data, error } = await supabase.rpc('get_unread_message_count', {
          _user_id: user.id,
        });

        if (error) {
          throw error;
        }
        console.log('Fetched unread count via custom event:', data);
        const count = data || 0;
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching unread message count via custom event:', error);
        setUnreadCount(0);
      }
    };

    window.addEventListener('unread-messages-updated', handleUnreadUpdate);
    
    return () => {
      window.removeEventListener('unread-messages-updated', handleUnreadUpdate);
    };
  }, [user?.id]); // Simplified dependency

  useEffect(() => {
    // Always clean up existing channel first
    if (channelRef.current) {
      try {
        supabase.removeChannel(channelRef.current);
      } catch (error) {
        console.error('Error removing channel:', error);
      }
      channelRef.current = null;
    }

    if (!user?.id) return;

    const fetchCount = async () => {
      try {
        const { data, error } = await supabase.rpc('get_unread_message_count', {
          _user_id: user.id,
        });

        if (error) {
          throw error;
        }
        console.log('Fetched unread count via realtime:', data);
        const count = data || 0;
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching unread message count via realtime:', error);
        setUnreadCount(0);
      }
    };

    try {
      const channel = supabase
        .channel(`unread-messages-count-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
          },
          (payload: any) => {
            console.log('Message change detected:', payload.eventType, 'payload:', payload);
            
            // Handle different event types
            if (payload.eventType === 'INSERT') {
              // New message - refresh if it's not from the current user
              const senderId = payload.new?.sender_id;
              if (senderId !== user.id) {
                setTimeout(() => {
                  fetchCount();
                }, 200);
              }
            } else if (payload.eventType === 'UPDATE') {
              // Message update (likely read status change) - always refresh
              // This handles cases where messages are marked as read
              const oldIsRead = payload.old?.is_read;
              const newIsRead = payload.new?.is_read;
              
              // If a message was marked as read, refresh count
              if (oldIsRead === false && newIsRead === true) {
                setTimeout(() => {
                  fetchCount();
                }, 100);
              }
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'conversations',
          },
          (payload: any) => {
            // Also listen to conversation changes that might affect message counts
            console.log('Conversation change detected:', payload.eventType);
            const buyerId = payload.new?.buyer_id || payload.old?.buyer_id;
            const sellerId = payload.new?.seller_id || payload.old?.seller_id;
            
            // If this user is part of the conversation, refresh count
            if (buyerId === user.id || sellerId === user.id) {
              setTimeout(() => {
                fetchCount();
              }, 200);
            }
          }
        )
        .subscribe();

      channelRef.current = channel;
    } catch (error) {
      console.error('Error setting up realtime channel:', error);
    }

    return () => {
      if (channelRef.current) {
        try {
          supabase.removeChannel(channelRef.current);
        } catch (error) {
          console.error('Error removing channel on cleanup:', error);
        }
        channelRef.current = null;
      }
    };
  }, [user?.id]); // Only depend on user.id

  return { unreadCount, fetchUnreadCount };
};
