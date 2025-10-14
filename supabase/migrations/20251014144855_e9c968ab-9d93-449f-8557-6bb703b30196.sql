-- Create a function to get the total user count that's accessible to everyone
-- This is safe because it only exposes the count, not any user data
CREATE OR REPLACE FUNCTION public.get_total_users_count()
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT COUNT(*)::integer FROM public.profiles;
$$;