
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
    if (!user?.id) return;
    try {
      const { data, error } = await supabase.rpc('get_unread_message_count', {
        _user_id: user.id,
      });

      if (error) {
        throw error;
      }
      setUnreadCount(data || 0);
    } catch (error) {
      console.error('Error fetching unread message count:', error);
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
  }, [user?.id, fetchUnreadCount]);

  // Listen for custom event to refresh unread count
  useEffect(() => {
    const handleUnreadUpdate = () => {
      fetchUnreadCount();
    };

    window.addEventListener('unread-messages-updated', handleUnreadUpdate);
    
    return () => {
      window.removeEventListener('unread-messages-updated', handleUnreadUpdate);
    };
  }, [fetchUnreadCount]);

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
          () => {
            fetchUnreadCount();
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
  }, [user?.id, fetchUnreadCount]);

  return { unreadCount, fetchUnreadCount };
};
