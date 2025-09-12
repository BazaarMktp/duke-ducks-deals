-- Create function for user rank calculation
CREATE OR REPLACE FUNCTION public.get_user_xp_rank(user_id_param uuid)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*) + 1
  FROM public.user_levels
  WHERE total_xp > (
    SELECT COALESCE(total_xp, 0)
    FROM public.user_levels
    WHERE user_id = user_id_param
  );
$$;