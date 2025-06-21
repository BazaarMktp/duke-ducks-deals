
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useFavorites = (listingId: string | undefined) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();

  const checkFavoriteStatus = useCallback(async () => {
    if (!user || !listingId) return;
    
    try {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('listing_id', listingId)
        .single();
      
      setIsFavorite(!!data);
    } catch (error) {
      // Not a favorite
    }
  }, [user, listingId]);

  const toggleFavorite = useCallback(async () => {
    if (!user || !listingId) return;

    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listingId);
        setIsFavorite(false);
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, listing_id: listingId });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, [user, listingId, isFavorite]);

  return {
    isFavorite,
    checkFavoriteStatus,
    toggleFavorite
  };
};
