
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from './types';

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles(role),
          banned_users(is_active, reason, banned_at)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setUsers(data || []);
    } catch (error) {
      // Secure error logging - don't expose sensitive details
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBanUser = async (userId: string, reason: string) => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('Not authenticated');

      // Check if user is already banned
      const { data: existingBan } = await supabase
        .from('banned_users')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (existingBan) {
        toast.error('User is already banned');
        return;
      }

      // Insert ban record
      const { error } = await supabase
        .from('banned_users')
        .insert({
          user_id: userId,
          banned_by: currentUser.user.id,
          reason,
          is_active: true
        });

      if (error) throw error;

      // TODO: Add audit logging once database types are updated
      // await logAdminAction('BAN_USER', 'banned_users', userId, {
      //   reason,
      //   banned_by: currentUser.user.id
      // });

      toast.success('User banned successfully');
      await fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error('Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('banned_users')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) throw error;

      // TODO: Add audit logging once database types are updated
      // await logAdminAction('UNBAN_USER', 'banned_users', userId);

      toast.success('User unbanned successfully');
      await fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error('Failed to unban user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Instead of hard deletion, we'll deactivate the user
      // by updating their profile and banning them permanently
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('Not authenticated');

      // Mark user as deleted by updating their profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          email: `deleted_${userId}@deleted.local`,
          profile_name: 'Deleted User',
          full_name: 'Deleted User'
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Add a permanent ban record
      await supabase
        .from('banned_users')
        .upsert({
          user_id: userId,
          banned_by: currentUser.user.id,
          reason: 'Account deleted by admin',
          is_active: true
        });

      // TODO: Add audit logging once database types are updated
      // await logAdminAction('DELETE_USER', 'profiles', userId, {
      //   action: 'soft_delete'
      // });

      toast.success('User account deactivated successfully');
      await fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error('Failed to delete user account');
    }
  };

  const filteredUsers = users.filter(user =>
    user.profile_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    users: filteredUsers,
    searchTerm,
    setSearchTerm,
    loading,
    handleBanUser,
    handleUnbanUser,
    handleDeleteUser,
    refetch: fetchUsers
  };
};
