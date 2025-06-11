
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "./types";

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          profile_name,
          full_name,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Check which users are banned
      const userIds = profiles?.map(p => p.id) || [];
      const { data: bannedUsers } = await supabase
        .from('banned_users')
        .select('user_id')
        .in('user_id', userIds)
        .eq('is_active', true);

      const bannedUserIds = new Set(bannedUsers?.map(b => b.user_id) || []);

      const usersWithBanStatus = profiles?.map(user => ({
        ...user,
        is_banned: bannedUserIds.has(user.id)
      })) || [];

      setUsers(usersWithBanStatus);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const banUser = async (userId: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('banned_users')
        .insert({
          user_id: userId,
          banned_by: (await supabase.auth.getUser()).data.user?.id,
          reason,
          is_active: true
        });

      if (error) throw error;

      toast.success('User banned successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error banning user:', error);
      toast.error('Failed to ban user');
    }
  };

  const unbanUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('banned_users')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) throw error;

      toast.success('User unbanned successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error unbanning user:', error);
      toast.error('Failed to unban user');
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Use Supabase admin API to delete user from auth.users
      // This will cascade delete from all related tables including profiles
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) throw error;

      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user. Make sure you have admin privileges.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    banUser,
    unbanUser,
    deleteUser,
    fetchUsers
  };
};
