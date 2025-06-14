
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MarketplaceListing } from "@/components/marketplace/types";

export const useMarketplace = (user: any, searchQuery: string, sortBy: string, activeListingType: 'offer' | 'wanted') => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('listings')
        .select('*, profiles(profile_name)')
        .eq('category', 'marketplace')
        .eq('status', 'active')
        .eq('listing_type', activeListingType);

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const getOrderOptions = () => {
        switch (sortBy) {
          case 'price_low':
            return { column: 'price', ascending: true };
          case 'price_high':
            return { column: 'price', ascending: false };
          case 'oldest':
            return { column: 'created_at', ascending: true };
          case 'newest':
          default:
            return { column: 'created_at', ascending: false };
        }
      };

      const { column: orderColumn, ascending } = getOrderOptions();

      const { data, error } = await query
        .order('featured', { ascending: false })
        .order(orderColumn, { ascending });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error("Failed to load marketplace items");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, sortBy, activeListingType]);

  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(data?.map(fav => fav.listing_id) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);
  
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    fetchFavorites();

    const channel = supabase
      .channel('marketplace-favorites-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchFavorites();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchFavorites]);

  const toggleFavorite = async (listingId: string) => {
    if (!user) {
      toast.error("Please log in to save favorites");
      return;
    }

    try {
      const isFavorited = favorites.includes(listingId);
      
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listingId);
        
        setFavorites(prev => prev.filter(id => id !== listingId));
        toast.success("Removed from favorites");
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, listing_id: listingId });
        
        setFavorites(prev => [...prev, listingId]);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error("Failed to update favorites");
    }
  };

  return { listings, loading, favorites, toggleFavorite };
};
