
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
      
      // Fetch active listings
      let activeQuery = supabase
        .from('listings')
        .select(`
          *,
          profiles!user_id(profile_name, full_name, avatar_url, college_id, is_verified)
        `)
        .eq('category', 'marketplace')
        .eq('status', 'active')
        .eq('listing_type', activeListingType);

      // Fetch recent sold listings (last 30 days) to show social proof
      let soldQuery = supabase
        .from('listings')
        .select(`
          *,
          profiles!user_id(profile_name, full_name, avatar_url, college_id, is_verified)
        `)
        .eq('category', 'marketplace')
        .eq('status', 'sold')
        .eq('listing_type', activeListingType)
        .gte('sold_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .limit(20); // Limit sold items to avoid overwhelming

      if (searchQuery) {
        activeQuery = activeQuery.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        soldQuery = soldQuery.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
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

      // Execute both queries
      const [activeResult, soldResult] = await Promise.all([
        activeQuery
          .order('featured', { ascending: false })
          .order(orderColumn, { ascending }),
        soldQuery.order('sold_at', { ascending: false })
      ]);

      if (activeResult.error) throw activeResult.error;
      if (soldResult.error) throw soldResult.error;

      const activeListings = activeResult.data || [];
      const soldListings = soldResult.data || [];

      // Combine and randomize the listings
      const allListings = [...activeListings, ...soldListings];
      
      // Fisher-Yates shuffle algorithm to randomize
      for (let i = allListings.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allListings[i], allListings[j]] = [allListings[j], allListings[i]];
      }

      // Keep featured items at the top
      const featuredItems = allListings.filter(item => item.featured);
      const nonFeaturedItems = allListings.filter(item => !item.featured);
      
      const finalListings = [...featuredItems, ...nonFeaturedItems];

      console.log('Marketplace listings data:', { active: activeListings.length, sold: soldListings.length, total: finalListings.length });
      setListings(finalListings);
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
