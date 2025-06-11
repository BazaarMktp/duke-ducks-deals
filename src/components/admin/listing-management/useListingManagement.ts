
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Listing } from "./types";

export const useListingManagement = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          id,
          title,
          category,
          listing_type,
          price,
          location,
          status,
          created_at,
          profiles!listings_user_id_fkey(profile_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const deleteListing = async (listingId: string) => {
    try {
      // First delete related records that might reference this listing
      await supabase.from('favorites').delete().eq('listing_id', listingId);
      await supabase.from('cart_items').delete().eq('listing_id', listingId);
      await supabase.from('conversations').delete().eq('listing_id', listingId);
      
      // Then delete the listing itself
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);

      if (error) throw error;

      toast.success('Listing deleted successfully');
      fetchListings();
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing');
    }
  };

  const toggleListingStatus = async (listingId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status: newStatus })
        .eq('id', listingId);

      if (error) throw error;

      toast.success(`Listing ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      fetchListings();
    } catch (error) {
      console.error('Error updating listing status:', error);
      toast.error('Failed to update listing status');
    }
  };

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.listing_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.profiles?.profile_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchListings();
  }, []);

  return {
    listings: filteredListings,
    loading,
    searchTerm,
    setSearchTerm,
    deleteListing,
    toggleListingStatus,
  };
};
