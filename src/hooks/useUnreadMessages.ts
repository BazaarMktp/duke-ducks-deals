
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { RealtimeChannel } from '@supabase/supabase-js';

export const useUnreadMessages = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.rpc('get_unread_message_count', {
        _user_id: user.id,
      });

      if (error) {
        throw error;
      }
      setUnreadCount(data);
    } catch (error) {
      console.error('Error fetching unread message count:', error);
      toast({
        title: "Error",
        description: "Could not fetch unread message count.",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [user, fetchUnreadCount]);

  useEffect(() => {
    if (!user) return;

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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchUnreadCount]);

  return { unreadCount, fetchUnreadCount };
};
