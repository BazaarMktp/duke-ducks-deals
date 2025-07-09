
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

  useEffect(() => {
    // Clean up existing channel first
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    if (!user?.id) return;

    const channel: RealtimeChannel = supabase
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

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id, fetchUnreadCount]);

  return { unreadCount, fetchUnreadCount };
};
