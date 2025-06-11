
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Listing, Profile, Stats } from "../types";

export const useHomeData = (user: any) => {
  const [featuredListings, setFeaturedListings] = useState<(Listing & { seller?: string })[]>([]);
  const [featuredRequests, setFeaturedRequests] = useState<(Listing & { requester?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [stats, setStats] = useState<Stats>({
    activeListings: 0,
    totalUsers: 0,
    totalDonations: 0
  });

  const fetchStats = async () => {
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

      setStats({
        activeListings: listingsCount || 0,
        totalUsers: usersCount || 0,
        totalDonations: donationsCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchFeaturedListings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .eq('listing_type', 'offer')
        .eq('category', 'marketplace')
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;
      setFeaturedListings(data || []);
    } catch (error) {
      console.error('Error fetching featured listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeaturedRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .eq('listing_type', 'wanted')
        .in('category', ['marketplace', 'housing', 'services'])
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;
      setFeaturedRequests(data || []);
    } catch (error) {
      console.error('Error fetching featured requests:', error);
    }
  };

  const fetchSellerProfiles = async () => {
    try {
      const userIds = [...new Set([
        ...featuredListings.map(item => item.user_id),
        ...featuredRequests.map(item => item.user_id)
      ])];
      
      if (userIds.length === 0) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('id, profile_name, full_name')
        .in('id', userIds);

      if (error) throw error;

      const profileMap: Record<string, Profile> = {};
      data?.forEach(profile => {
        profileMap[profile.id] = profile;
      });

      setProfiles(profileMap);
      
      setFeaturedListings(prev => 
        prev.map(listing => {
          const profile = profileMap[listing.user_id];
          const sellerName = profile?.profile_name || profile?.full_name || 'Unknown seller';
          return { ...listing, seller: sellerName };
        })
      );

      setFeaturedRequests(prev => 
        prev.map(request => {
          const profile = profileMap[request.user_id];
          const requesterName = profile?.profile_name || profile?.full_name || 'Unknown requester';
          return { ...request, requester: requesterName };
        })
      );
    } catch (error) {
      console.error('Error fetching seller profiles:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFeaturedListings();
      fetchFeaturedRequests();
    }
    fetchStats();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('listings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'listings'
        },
        (payload) => {
          console.log('Listings changed:', payload);
          fetchFeaturedListings();
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    if (featuredListings.length > 0 || featuredRequests.length > 0) {
      fetchSellerProfiles();
    }
  }, [featuredListings, featuredRequests]);

  return {
    featuredListings,
    featuredRequests,
    isLoading,
    stats
  };
};
