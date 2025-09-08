
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
    console.log('handleDelete called with:', { listingId, userId: user?.id });
    
    if (!user) {
      console.log('No user found, showing login error');
      toast.error("Please log in to delete listings.");
      return;
    }

    try {
      console.log('Attempting to delete listing:', listingId);
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      console.log('Delete successful, updating local state');
      setListings(prev => prev.filter(listing => listing.id !== listingId));
      toast.success("Listing deleted successfully!");
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error(`Failed to delete listing: ${error.message || 'Unknown error'}`);
    }
  };

  const handleStatusToggle = async (listingId: string, currentStatus: string) => {
    console.log('handleStatusToggle called with:', { listingId, currentStatus, userId: user?.id });
    
    if (!user) {
      console.log('No user found, showing login error');
      toast.error("Please log in to update listings.");
      return;
    }

    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    console.log('Toggling status from', currentStatus, 'to', newStatus);
    
    try {
      console.log('Attempting to update listing status:', listingId);
      const { error } = await supabase
        .from('listings')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', listingId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Status toggle error:', error);
        throw error;
      }

      console.log('Status toggle successful, updating local state');
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
      toast.error(`Failed to update listing status: ${error.message || 'Unknown error'}`);
    }
  };

  const handleMarkAsSold = async (listingId: string, soldOnBazaar: boolean, soldElsewhereLocation?: string) => {
    console.log('handleMarkAsSold called with:', { listingId, soldOnBazaar, soldElsewhereLocation, userId: user?.id });
    
    if (!user) {
      console.log('No user found, showing login error');
      toast.error("Please log in to update listings.");
      return;
    }

    try {
      const updateData = {
        status: 'sold' as const,
        sold_on_bazaar: soldOnBazaar,
        sold_elsewhere_location: soldElsewhereLocation || null,
        sold_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Attempting to mark listing as sold:', listingId, updateData);
      const { error } = await supabase
        .from('listings')
        .update(updateData)
        .eq('id', listingId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Mark as sold error:', error);
        throw error;
      }

      console.log('Mark as sold successful, updating local state');
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
      toast.error(`Failed to mark listing as sold: ${error.message || 'Unknown error'}`);
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
