
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Listing } from './types';

export const useListingManagement = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles!listings_user_id_fkey(profile_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setListings(data || []);
    } catch (error) {
      // Secure error logging - don't expose sensitive details
      toast.error('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleToggleStatus = async (listingId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('listings')
        .update({ status: newStatus })
        .eq('id', listingId);

      if (error) throw error;

      // Update local state
      setListings(prev => 
        prev.map(listing => 
          listing.id === listingId 
            ? { ...listing, status: newStatus }
            : listing
        )
      );

      // Audit log the action
      await logAdminAction('UPDATE_LISTING_STATUS', 'listings', listingId, {
        old_status: currentStatus,
        new_status: newStatus
      });

      toast.success(`Listing ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Failed to update listing status');
    }
  };

  const handleDelete = async (listingId: string) => {
    try {
      // Start a transaction-like approach by deleting in proper order
      // Database CASCADE constraints will handle related data
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);

      if (error) throw error;

      // Update local state
      setListings(prev => prev.filter(listing => listing.id !== listingId));

      // Audit log the action
      await logAdminAction('DELETE_LISTING', 'listings', listingId);

      toast.success('Listing deleted successfully');
    } catch (error) {
      toast.error('Failed to delete listing');
    }
  };

  // Helper function to log admin actions
  const logAdminAction = async (
    action: string, 
    targetTable: string, 
    targetId: string, 
    values?: Record<string, any>
  ) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      await supabase
        .from('admin_audit_log')
        .insert({
          admin_user_id: user.user.id,
          action,
          target_table: targetTable,
          target_id: targetId,
          new_values: values || null,
          ip_address: null, // Would need additional setup to capture
          user_agent: navigator.userAgent
        });
    } catch (error) {
      // Silent fail for audit logging to not interrupt main operations
    }
  };

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.profiles.profile_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.profiles.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    listings: filteredListings,
    searchTerm,
    setSearchTerm,
    loading,
    handleToggleStatus,
    handleDelete,
    refetch: fetchListings
  };
};
