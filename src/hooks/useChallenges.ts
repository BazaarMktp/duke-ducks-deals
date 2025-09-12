import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Challenge {
  id: string;
  title: string;
  description: string;
  challenge_type: 'daily' | 'weekly' | 'monthly' | 'special';
  requirements: any;
  xp_reward: number;
  points_reward: number;
  starts_at: string;
  ends_at: string | null;
  is_active: boolean;
}

interface UserChallengeProgress {
  challenge_id: string;
  progress: any;
  status: 'active' | 'completed' | 'expired';
  completed_at: string | null;
  challenge: Challenge;
}

export const useChallenges = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userProgress, setUserProgress] = useState<UserChallengeProgress[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActiveChallenges();
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  const fetchActiveChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true)
        .or('ends_at.is.null,ends_at.gt.now()')
        .order('challenge_type', { ascending: true });

      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  const fetchUserProgress = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_challenge_progress')
        .select(`
          challenge_id,
          progress,
          status,
          completed_at,
          challenge:challenges(*)
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      setUserProgress(data || []);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateChallengeProgress = async (challengeId: string, progressUpdate: any) => {
    if (!user) return;

    try {
      const existingProgress = userProgress.find(up => up.challenge_id === challengeId);
      const newProgress = { ...existingProgress?.progress, ...progressUpdate };

      const { error } = await supabase
        .from('user_challenge_progress')
        .upsert({
          user_id: user.id,
          challenge_id: challengeId,
          progress: newProgress
        });

      if (error) throw error;
      await fetchUserProgress();
    } catch (error) {
      console.error('Error updating challenge progress:', error);
    }
  };

  const getChallengeProgress = (challengeId: string) => {
    return userProgress.find(up => up.challenge_id === challengeId);
  };

  const getActiveChallenges = () => {
    return challenges.filter(challenge => {
      if (!challenge.ends_at) return true;
      return new Date(challenge.ends_at) > new Date();
    });
  };

  const getCompletedChallenges = () => {
    return userProgress.filter(up => up.status === 'completed');
  };

  const getDailyChallenges = () => {
    return getActiveChallenges().filter(c => c.challenge_type === 'daily');
  };

  const getWeeklyChallenges = () => {
    return getActiveChallenges().filter(c => c.challenge_type === 'weekly');
  };

  const getMonthlyChallenges = () => {
    return getActiveChallenges().filter(c => c.challenge_type === 'monthly');
  };

  const checkChallengeCompletion = (challenge: Challenge, progress: any) => {
    const requirements = challenge.requirements;
    
    for (const [key, required] of Object.entries(requirements)) {
      const current = (progress[key] as number) || 0;
      if (current < (required as number)) {
        return false;
      }
    }
    return true;
  };

  const getChallengeProgressPercentage = (challenge: Challenge, progress: any) => {
    const requirements = challenge.requirements;
    let totalProgress = 0;
    let maxProgress = 0;

    for (const [key, required] of Object.entries(requirements)) {
      const current = Math.min((progress[key] as number) || 0, required as number);
      totalProgress += current;
      maxProgress += (required as number);
    }

    return maxProgress > 0 ? (totalProgress / maxProgress) * 100 : 0;
  };

  return {
    challenges,
    userProgress,
    loading,
    updateChallengeProgress,
    getChallengeProgress,
    getActiveChallenges,
    getCompletedChallenges,
    getDailyChallenges,
    getWeeklyChallenges,
    getMonthlyChallenges,
    checkChallengeCompletion,
    getChallengeProgressPercentage,
    refreshChallenges: fetchActiveChallenges,
    refreshProgress: fetchUserProgress
  };
};