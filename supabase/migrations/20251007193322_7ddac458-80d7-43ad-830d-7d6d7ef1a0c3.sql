-- Fix search_path security issue for calculate_level_from_xp function
CREATE OR REPLACE FUNCTION public.calculate_level_from_xp(xp integer)
RETURNS integer
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  -- Each level requires 100 * level XP (so level 2 needs 200 total XP, level 3 needs 300, etc.)
  SELECT GREATEST(1, FLOOR(xp / 100) + 1)::integer;
$$;