import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useMessageLikes = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const toggleLike = async (messageId: string, currentLikes: string[] = []) => {
    if (!user) {
      toast.error('You must be logged in to like messages');
      return;
    }

    const userId = user.id;
    const isLiked = currentLikes.includes(userId);
    
    setLoading(prev => ({ ...prev, [messageId]: true }));

    try {
      let newLikes: string[];
      
      if (isLiked) {
        // Remove like
        newLikes = currentLikes.filter(id => id !== userId);
      } else {
        // Add like
        newLikes = [...currentLikes, userId];
      }

      const { error } = await supabase
        .from('messages')
        .update({ likes: newLikes })
        .eq('id', messageId);

      if (error) throw error;

      return newLikes;
    } catch (error) {
      console.error('Error toggling message like:', error);
      toast.error('Failed to update message like');
      return currentLikes;
    } finally {
      setLoading(prev => ({ ...prev, [messageId]: false }));
    }
  };

  const isLoading = (messageId: string) => loading[messageId] || false;

  return {
    toggleLike,
    isLoading,
  };
};