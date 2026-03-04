import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  search_query: string | null;
  category: string | null;
  min_price: number | null;
  max_price: number | null;
  listing_type: string;
  notify_enabled: boolean;
  last_notified_at: string | null;
  created_at: string;
}

export const useSavedSearches = () => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSavedSearches = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setSavedSearches((data || []) as unknown as SavedSearch[]);
    } catch (error) {
      console.error('Error fetching saved searches:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSavedSearches();
  }, [fetchSavedSearches]);

  const saveSearch = async (params: {
    name: string;
    search_query?: string;
    category?: string;
    min_price?: number | null;
    max_price?: number | null;
    listing_type?: string;
  }) => {
    if (!user) return false;
    try {
      const { error } = await supabase.from('saved_searches').insert({
        user_id: user.id,
        name: params.name,
        search_query: params.search_query || null,
        category: params.category || null,
        min_price: params.min_price ?? null,
        max_price: params.max_price ?? null,
        listing_type: params.listing_type || 'offer',
      });
      if (error) throw error;
      toast({ title: "Search saved!", description: "You'll be notified when matching items appear." });
      fetchSavedSearches();
      return true;
    } catch (error) {
      console.error('Error saving search:', error);
      toast({ title: "Error", description: "Failed to save search.", variant: "destructive" });
      return false;
    }
  };

  const deleteSearch = async (id: string) => {
    try {
      const { error } = await supabase.from('saved_searches').delete().eq('id', id);
      if (error) throw error;
      setSavedSearches(prev => prev.filter(s => s.id !== id));
      toast({ title: "Deleted", description: "Saved search removed." });
    } catch (error) {
      console.error('Error deleting saved search:', error);
    }
  };

  const toggleNotify = async (id: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .update({ notify_enabled: enabled })
        .eq('id', id);
      if (error) throw error;
      setSavedSearches(prev => prev.map(s => s.id === id ? { ...s, notify_enabled: enabled } : s));
    } catch (error) {
      console.error('Error toggling notifications:', error);
    }
  };

  return { savedSearches, loading, saveSearch, deleteSearch, toggleNotify };
};
