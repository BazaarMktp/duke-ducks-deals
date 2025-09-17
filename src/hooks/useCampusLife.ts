import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCampusLife = () => {
  const [events, setEvents] = useState([]);
  const [digest, setDigest] = useState(null);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('campus_events')
        .select('*')
        .eq('is_active', true)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(20);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch campus events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateDigest = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('generate-digest', {
        body: { user_id: user.id }
      });

      if (error) throw error;
      setDigest(data.digest);
      
      toast({
        title: "Digest Generated",
        description: "Your personalized campus digest is ready!",
      });
    } catch (error) {
      console.error('Error generating digest:', error);
      toast({
        title: "Error",
        description: "Failed to generate digest",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInterests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_interests')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setInterests(data || []);
    } catch (error) {
      console.error('Error fetching interests:', error);
    }
  };

  const updateInterests = async (newInterests: any[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Delete existing interests
      await supabase
        .from('user_interests')
        .delete()
        .eq('user_id', user.id);

      // Insert new interests
      if (newInterests.length > 0) {
        const { error } = await supabase
          .from('user_interests')
          .insert(
            newInterests.map(interest => ({
              user_id: user.id,
              interest_type: interest.type,
              interest_value: interest.value,
              priority: interest.priority || 5
            }))
          );

        if (error) throw error;
      }

      setInterests(newInterests);
      toast({
        title: "Interests Updated",
        description: "Your preferences have been saved!",
      });
    } catch (error) {
      console.error('Error updating interests:', error);
      toast({
        title: "Error",
        description: "Failed to update interests",
        variant: "destructive",
      });
    }
  };

  const trackEventInteraction = async (eventId: string, interactionType: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('user_event_interactions')
        .insert({
          user_id: user.id,
          event_id: eventId,
          interaction_type: interactionType
        });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  const processCampusData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('process-campus-data', {
        body: {}
      });

      if (error) throw error;
      
      toast({
        title: "Data Updated",
        description: `Processed ${data.processed} new events`,
      });
      
      // Refresh events
      await fetchEvents();
    } catch (error) {
      console.error('Error processing campus data:', error);
      toast({
        title: "Error",
        description: "Failed to update campus data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchUserInterests();
  }, []);

  return {
    events,
    digest,
    interests,
    loading,
    fetchEvents,
    generateDigest,
    updateInterests,
    trackEventInteraction,
    processCampusData
  };
};