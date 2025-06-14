
import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Listing, Profile, Stats } from "../types";

const fetchStats = async (): Promise<Stats> => {
  try {
    const { count: listingsCount } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: usersCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: donationsCount } = await supabase
      .from('donations')
      .select('*', { count: 'exact', head: true });

    const { count: collegesCount } = await supabase
      .from('colleges')
      .select('*', { count: 'exact', head: true });

    return {
      activeListings: listingsCount || 0,
      totalUsers: usersCount || 0,
      totalDonations: donationsCount || 0,
      totalColleges: collegesCount || 0,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

const fetchFeaturedListings = async (): Promise<Listing[]> => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .eq('listing_type', 'offer')
      .eq('category', 'marketplace')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(4);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching featured listings:', error);
    throw error;
  }
};

const fetchFeaturedRequests = async (): Promise<Listing[]> => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .eq('listing_type', 'wanted')
      .in('category', ['marketplace', 'housing', 'services'])
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(4);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching featured requests:', error);
    throw error;
  }
};

const fetchProfiles = async (userIds: string[]): Promise<Record<string, Profile>> => {
  if (userIds.length === 0) return {};
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, profile_name, full_name')
      .in('id', userIds);

    if (error) throw error;

    const profileMap: Record<string, Profile> = {};
    data?.forEach(profile => {
      profileMap[profile.id] = profile;
    });
    return profileMap;
  } catch (error) {
    console.error('Error fetching profiles:', error);
    throw error;
  }
};

export const useHomeData = (user: any) => {
  const queryClient = useQueryClient();

  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
  });

  const { data: rawFeaturedListings, isLoading: isListingsLoading } = useQuery({
    queryKey: ['featuredListings'],
    queryFn: fetchFeaturedListings,
    enabled: !!user,
  });

  const { data: rawFeaturedRequests, isLoading: isRequestsLoading } = useQuery({
    queryKey: ['featuredRequests'],
    queryFn: fetchFeaturedRequests,
    enabled: !!user,
  });

  const userIds = useMemo(() => {
    const allUserIds = [
      ...(rawFeaturedListings || []).map(item => item.user_id),
      ...(rawFeaturedRequests || []).map(item => item.user_id),
    ];
    return [...new Set(allUserIds)];
  }, [rawFeaturedListings, rawFeaturedRequests]);

  const { data: profiles } = useQuery({
    queryKey: ['profiles', userIds],
    queryFn: () => fetchProfiles(userIds),
    enabled: userIds.length > 0,
  });

  const featuredListings = useMemo(() => {
    if (!rawFeaturedListings || !profiles) return [];
    return rawFeaturedListings.map(listing => {
      const profile = profiles[listing.user_id];
      const sellerName = profile?.profile_name || profile?.full_name || 'Unknown seller';
      return { ...listing, seller: sellerName };
    });
  }, [rawFeaturedListings, profiles]);

  const featuredRequests = useMemo(() => {
    if (!rawFeaturedRequests || !profiles) return [];
    return rawFeaturedRequests.map(request => {
      const profile = profiles[request.user_id];
      const requesterName = profile?.profile_name || profile?.full_name || 'Unknown requester';
      return { ...request, requester: requesterName };
    });
  }, [rawFeaturedRequests, profiles]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('listings-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'listings' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['featuredListings'] });
          queryClient.invalidateQueries({ queryKey: ['stats'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return {
    featuredListings,
    featuredRequests,
    isLoading: isStatsLoading || (!!user && (isListingsLoading || isRequestsLoading)),
    stats: stats || { activeListings: 0, totalUsers: 0, totalDonations: 0, totalColleges: 0 },
  };
};
