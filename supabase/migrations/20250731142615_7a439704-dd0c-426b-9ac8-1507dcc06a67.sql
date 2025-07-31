-- Fix performance issue: Remove duplicate permissive policy on user_roles table
-- The "Admins can manage user roles" policy already covers SELECT operations
-- so we can remove the redundant "Admins can view all user roles" policy

DROP POLICY IF EXISTS "Admins can view all user roles" ON public.user_roles;