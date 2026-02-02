
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MarketplaceListing } from "@/components/marketplace/types";

const PAGE_SIZE = 20;

interface UseMarketplaceOptions {
  searchQuery: string;
  sortBy: string;
  activeListingType: 'offer' | 'wanted';
  categoryFilter: string | null;
  priceRange: { min: number | null; max: number | null };
}

export const useMarketplace = (
  user: any, 
  searchQuery: string, 
  sortBy: string, 
  activeListingType: 'offer' | 'wanted',
  categoryFilter: string | null = null,
  priceRange: { min: number | null; max: number | null } = { min: null, max: null }
) => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const pageRef = useRef(0);

  const fetchListings = useCallback(async (reset: boolean = true) => {
    try {
      if (reset) {
        setLoading(true);
        pageRef.current = 0;
      } else {
        setLoadingMore(true);
      }
      
      const from = reset ? 0 : pageRef.current * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      
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

      // Apply category filter based on item_tag or title
      if (categoryFilter) {
        if (categoryFilter === 'free') {
          activeQuery = activeQuery.or('price.eq.0,price.is.null');
        } else {
          activeQuery = activeQuery.or(`item_tag.ilike.%${categoryFilter}%,title.ilike.%${categoryFilter}%`);
        }
      }

      // Apply price range filter
      if (priceRange.min !== null) {
        activeQuery = activeQuery.gte('price', priceRange.min);
      }
      if (priceRange.max !== null) {
        activeQuery = activeQuery.lte('price', priceRange.max);
      }

      // Fetch recent sold listings only on first page
      let soldQuery = reset ? supabase
        .from('listings')
        .select(`
          *,
          profiles!user_id(profile_name, full_name, avatar_url, college_id, is_verified)
        `)
        .eq('category', 'marketplace')
        .eq('status', 'sold')
        .eq('listing_type', activeListingType)
        .gte('sold_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .limit(10) : null;

      if (searchQuery) {
        // Check if search query matches a tag keyword - if so, use item_tag for accurate filtering
        const tagKeywords = ["microwave", "fridge", "furniture", "textbook", "laptop", "chair", "desk", "bed", "couch", "table", "lamp", "tv", "monitor", "keyboard", "mouse"];
        const isTagSearch = tagKeywords.some(tag => searchQuery.toLowerCase().includes(tag));
        
        if (isTagSearch) {
          // For tag searches, prioritize item_tag but also search title as fallback
          activeQuery = activeQuery.or(`item_tag.ilike.%${searchQuery}%,title.ilike.%${searchQuery}%`);
          if (soldQuery) soldQuery = soldQuery.or(`item_tag.ilike.%${searchQuery}%,title.ilike.%${searchQuery}%`);
        } else {
          // For general searches, search title and description
          activeQuery = activeQuery.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
          if (soldQuery) soldQuery = soldQuery.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }
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

      // Execute queries
      // Execute queries in parallel
      const [activeResult, soldResult] = await Promise.all([
        activeQuery
          .order('featured', { ascending: false })
          .order(orderColumn, { ascending })
          .range(from, to),
        soldQuery 
          ? soldQuery.order('sold_at', { ascending: false })
          : Promise.resolve({ data: [], error: null })
      ]);

      if (activeResult.error) throw activeResult.error;

      const activeListings = activeResult.data || [];
      const soldListings = (reset && soldResult?.data) || [];

      // Check if there are more items
      setHasMore(activeListings.length === PAGE_SIZE);
      
      // Combine listings
      let allListings = [...activeListings];
      if (reset) {
        allListings = [...allListings, ...soldListings];
      }
      
      // Sort: featured first, then new (< 5 days), then apply user sort
      const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
      
      const sortedListings = allListings.sort((a, b) => {
        // 1. Featured items always first
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        
        // 2. Within same featured status, prioritize new items
        const aIsNew = new Date(a.created_at) > fiveDaysAgo;
        const bIsNew = new Date(b.created_at) > fiveDaysAgo;
        
        if (aIsNew && !bIsNew) return -1;
        if (!aIsNew && bIsNew) return 1;
        
        // 3. Within same featured and new status, apply user's sort choice
        switch (sortBy) {
          case 'price_low':
            return (a.price || 0) - (b.price || 0);
          case 'price_high':
            return (b.price || 0) - (a.price || 0);
          case 'oldest':
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          case 'newest':
          default:
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });

      if (reset) {
        setListings(sortedListings);
      } else {
        setListings(prev => [...prev, ...sortedListings]);
      }
      
      pageRef.current += 1;
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error("Failed to load marketplace items");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchQuery, sortBy, activeListingType, categoryFilter, priceRange.min, priceRange.max]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchListings(false);
    }
  }, [fetchListings, loadingMore, hasMore]);

  const refresh = useCallback(() => {
    fetchListings(true);
  }, [fetchListings]);

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
    fetchListings(true);

    // Subscribe to real-time changes in listings table
    const channel = supabase
      .channel('marketplace-listings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'listings',
          filter: `category=eq.marketplace`,
        },
        () => {
          fetchListings(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

  return { 
    listings, 
    loading, 
    loadingMore,
    hasMore,
    favorites, 
    toggleFavorite,
    loadMore,
    refresh
  };
};
