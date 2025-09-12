import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserLevel {
  current_level: number;
  current_xp: number;
  total_xp: number;
}

interface EngagementEvent {
  event_type: string;
  event_data: any;
  xp_earned: number;
  points_earned: number;
}

export const useGamification = () => {
  const { user } = useAuth();
  const [userLevel, setUserLevel] = useState<UserLevel>({
    current_level: 1,
    current_xp: 0,
    total_xp: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserLevel();
    }
  }, [user]);

  const fetchUserLevel = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_levels')
        .select('current_level, current_xp, total_xp')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setUserLevel(data);
      }
    } catch (error) {
      console.error('Error fetching user level:', error);
    } finally {
      setLoading(false);
    }
  };

  const addXP = async (amount: number, pointsAmount: number = 0, eventType: string = 'manual') => {
    if (!user) return;

    try {
      // Call the database function to add XP
      const { error } = await supabase.rpc('add_user_xp', {
        user_id_param: user.id,
        xp_amount: amount,
        points_amount: pointsAmount
      });

      if (error) throw error;

      // Refresh the user level
      await fetchUserLevel();

      // Show success message if significant XP earned
      if (amount >= 25) {
        toast.success(`+${amount} XP earned!`, {
          description: eventType !== 'manual' ? `From: ${eventType}` : undefined
        });
      }
    } catch (error) {
      console.error('Error adding XP:', error);
      toast.error('Failed to update XP');
    }
  };

  const trackEngagement = async (eventType: string, eventData: any = {}) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_engagement_events')
        .insert({
          user_id: user.id,
          event_type: eventType,
          event_data: eventData,
          xp_earned: 0, // XP is calculated based on event type
          points_earned: 0
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking engagement:', error);
    }
  };

  const getXPForNextLevel = () => {
    return (userLevel.current_level + 1) * 100 - userLevel.total_xp;
  };

  const getProgressToNextLevel = () => {
    const currentLevelXP = userLevel.current_level * 100;
    const previousLevelXP = (userLevel.current_level - 1) * 100;
    const progress = (userLevel.total_xp - previousLevelXP) / (currentLevelXP - previousLevelXP);
    return Math.min(Math.max(progress, 0), 1);
  };

  return {
    userLevel,
    loading,
    addXP,
    trackEngagement,
    getXPForNextLevel,
    getProgressToNextLevel,
    refreshLevel: fetchUserLevel
  };
};