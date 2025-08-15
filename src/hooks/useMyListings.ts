
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  housing_type: string;
  location: string;
  images: string[];
  status: "active" | "sold" | "inactive";
  created_at: string;
  user_id: string;
}

export const useMyListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchListings();
    }
  }, [user]);

  const fetchListings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error("Failed to load listings.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setListings(prev => prev.filter(listing => listing.id !== listingId));
      toast.success("Listing deleted successfully!");
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error("Failed to delete listing.");
    }
  };

  const handleStatusToggle = async (listingId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      const { error } = await supabase
        .from('listings')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', listingId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setListings(prev => 
        prev.map(listing => 
          listing.id === listingId 
            ? { ...listing, status: newStatus as "active" | "sold" | "inactive" }
            : listing
        )
      );

      toast.success(`Listing ${newStatus === 'active' ? 'activated' : 'paused'} successfully!`);
    } catch (error) {
      console.error('Error updating listing status:', error);
      toast.error("Failed to update listing status.");
    }
  };

  const handleMarkAsSold = async (listingId: string, soldOnBazaar: boolean, soldElsewhereLocation?: string) => {
    try {
      const updateData = {
        status: 'sold' as const,
        sold_on_bazaar: soldOnBazaar,
        sold_elsewhere_location: soldElsewhereLocation || null,
        sold_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('listings')
        .update(updateData)
        .eq('id', listingId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setListings(prev => 
        prev.map(listing => 
          listing.id === listingId 
            ? { ...listing, status: 'sold' as "active" | "sold" | "inactive" }
            : listing
        )
      );

      const location = soldOnBazaar ? 'Bazaar' : soldElsewhereLocation;
      toast.success(`Listing marked as sold on ${location}!`);
    } catch (error) {
      console.error('Error marking listing as sold:', error);
      toast.error("Failed to mark listing as sold.");
    }
  };

  return {
    listings,
    loading,
    user,
    handleDelete,
    handleStatusToggle,
    handleMarkAsSold
  };
};

export type { Listing };
