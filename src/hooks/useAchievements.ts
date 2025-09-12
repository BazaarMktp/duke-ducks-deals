import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'social' | 'trading' | 'community' | 'milestone' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  xp_reward: number;
  points_reward: number;
  icon_name: string | null;
  requirements: any;
}

interface UserAchievement {
  achievement_id: string;
  earned_at: string;
  progress: any;
  achievement: Achievement;
}

export const useAchievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAchievements();
    if (user) {
      fetchUserAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('rarity', { ascending: true });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const fetchUserAchievements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          achievement_id,
          earned_at,
          progress,
          achievement:achievements(*)
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      setUserAchievements(data || []);
    } catch (error) {
      console.error('Error fetching user achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAchievement = async (achievementId: string) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('id')
        .eq('user_id', user.id)
        .eq('achievement_id', achievementId)
        .single();

      return !error && !!data;
    } catch (error) {
      return false;
    }
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    const colors = {
      common: 'text-gray-600',
      uncommon: 'text-green-600',
      rare: 'text-blue-600',
      epic: 'text-purple-600',
      legendary: 'text-yellow-600'
    };
    return colors[rarity];
  };

  const getRarityBadgeColor = (rarity: Achievement['rarity']) => {
    const colors = {
      common: 'bg-gray-100 text-gray-800 border-gray-300',
      uncommon: 'bg-green-100 text-green-800 border-green-300',
      rare: 'bg-blue-100 text-blue-800 border-blue-300',
      epic: 'bg-purple-100 text-purple-800 border-purple-300',
      legendary: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    return colors[rarity];
  };

  const getEarnedAchievements = () => {
    return userAchievements.filter(ua => ua.achievement);
  };

  const getUnlockedAchievements = () => {
    const earnedIds = userAchievements.map(ua => ua.achievement_id);
    return achievements.filter(achievement => !earnedIds.includes(achievement.id));
  };

  return {
    achievements,
    userAchievements,
    loading,
    checkAchievement,
    getRarityColor,
    getRarityBadgeColor,
    getEarnedAchievements,
    getUnlockedAchievements,
    refreshAchievements: fetchUserAchievements
  };
};