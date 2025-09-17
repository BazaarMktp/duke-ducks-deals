import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRoommateMatching = () => {
  const [preferences, setPreferences] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('roommate_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setPreferences(data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const savePreferences = async (prefs: any) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('roommate_preferences')
        .upsert({
          user_id: user.id,
          ...prefs
        })
        .select()
        .single();

      if (error) throw error;
      
      setPreferences(data);
      toast({
        title: "Preferences Saved",
        description: "Your roommate preferences have been updated!",
      });

      return data;
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const findMatches = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get potential matches
      const { data: potentialMatches, error: matchError } = await supabase
        .from('roommate_preferences')
        .select(`
          *,
          profiles (
            profile_name,
            avatar_url,
            college_id
          )
        `)
        .neq('user_id', user.id);

      if (matchError) throw matchError;

      // Calculate compatibility for each potential match
      const compatibilityPromises = potentialMatches.map(async (match) => {
        try {
          const { data, error } = await supabase.functions.invoke('calculate-compatibility', {
            body: { 
              user1_id: user.id, 
              user2_id: match.user_id 
            }
          });

          if (error) throw error;

          return {
            ...match,
            compatibility_score: data.compatibility_score,
            explanation: data.explanation
          };
        } catch (error) {
          console.error(`Error calculating compatibility with ${match.user_id}:`, error);
          return null;
        }
      });

      const results = await Promise.all(compatibilityPromises);
      const validMatches = results
        .filter(match => match !== null)
        .sort((a, b) => b.compatibility_score - a.compatibility_score);

      setMatches(validMatches);
      
      toast({
        title: "Matches Found",
        description: `Found ${validMatches.length} potential roommates!`,
      });
    } catch (error) {
      console.error('Error finding matches:', error);
      toast({
        title: "Error",
        description: "Failed to find matches",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('roommate_matches')
        .select(`
          *,
          user1:profiles!roommate_matches_user1_id_fkey (
            profile_name,
            avatar_url
          ),
          user2:profiles!roommate_matches_user2_id_fkey (
            profile_name,
            avatar_url
          )
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('compatibility_score', { ascending: false });

      if (error) throw error;
      setMatches(data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const updateMatchStatus = async (matchId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('roommate_matches')
        .update({ status })
        .eq('id', matchId);

      if (error) throw error;

      // Update local state
      setMatches(matches.map(match => 
        match.id === matchId ? { ...match, status } : match
      ));

      toast({
        title: "Match Updated",
        description: `Match status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating match status:', error);
      toast({
        title: "Error",
        description: "Failed to update match status",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPreferences();
    fetchMatches();
  }, []);

  return {
    preferences,
    matches,
    loading,
    savePreferences,
    findMatches,
    updateMatchStatus,
    fetchPreferences,
    fetchMatches
  };
};