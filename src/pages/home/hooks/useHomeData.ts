import { useEffect, useMemo, useState, useCallback } from "react";
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

    return {
      activeListings: listingsCount || 0,
      totalUsers: usersCount || 0,
      totalDonations: donationsCount || 0,
      totalColleges: 0,
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
  const [stats, setStats] = useState<Stats>({ activeListings: 0, totalUsers: 0, totalDonations: 0, totalColleges: 0 });
  const [rawFeaturedListings, setRawFeaturedListings] = useState<Listing[]>([]);
  const [rawFeaturedRequests, setRawFeaturedRequests] = useState<Listing[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const statsData = await fetchStats();
      setStats(statsData);

      if (user) {
        const [listingsData, requestsData] = await Promise.all([
          fetchFeaturedListings(),
          fetchFeaturedRequests(),
        ]);
        setRawFeaturedListings(listingsData);
        setRawFeaturedRequests(requestsData);

        const userIds = [...new Set([
          ...listingsData.map(item => item.user_id),
          ...requestsData.map(item => item.user_id),
        ])];
        
        if (userIds.length > 0) {
          const profilesData = await fetchProfiles(userIds);
          setProfiles(profilesData);
        } else {
          setProfiles({});
        }
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchData]);

  return {
    featuredListings,
    featuredRequests,
    isLoading,
    stats,
  };
};
