
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from './types';

interface College {
  id: string;
  name: string;
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [colleges, setColleges] = useState<College[]>([]);
  const [collegeFilter, setCollegeFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      setLoading(true);
      
      // First fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*, college_id')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log('Profiles fetched:', profiles?.length);

      // Then fetch banned users separately
      const { data: bannedUsers, error: bannedError } = await supabase
        .from('banned_users')
        .select('user_id, is_active, reason, banned_at')
        .eq('is_active', true);

      if (bannedError) {
        console.error('Error fetching banned users:', bannedError);
        // Don't throw here, just log the error and continue without banned data
      }

      console.log('Banned users fetched:', bannedUsers?.length);

      // Combine the data
      const usersWithBanStatus = profiles?.map(profile => {
        const banInfo = bannedUsers?.find(ban => ban.user_id === profile.id);
        return {
          ...profile,
          is_banned: !!banInfo?.is_active,
          ban_reason: banInfo?.reason,
          banned_at: banInfo?.banned_at
        };
      }) || [];

      console.log('Users with ban status:', usersWithBanStatus.length);
      setUsers(usersWithBanStatus);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to fetch users. Please check your permissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    const fetchColleges = async () => {
      const { data, error } = await supabase.from('colleges').select('id, name');
      if (error) {
        toast.error('Failed to fetch colleges');
      } else if (data) {
        setColleges(data);
      }
    };
    fetchColleges();
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

      toast.success('User banned successfully');
      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error banning user:', error);
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

      toast.success('User unbanned successfully');
      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error unbanning user:', error);
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

      toast.success('User account deactivated successfully');
      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user account');
    }
  };

  const filteredUsers = users.filter(user =>
    (user.profile_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (collegeFilter === 'all' || (user as any).college_id === collegeFilter)
  );

  return {
    users: filteredUsers,
    searchTerm,
    setSearchTerm,
    loading,
    handleBanUser,
    handleUnbanUser,
    handleDeleteUser,
    refetch: fetchUsers,
    colleges,
    collegeFilter,
    setCollegeFilter,
  };
};
