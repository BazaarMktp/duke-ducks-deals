-- Tighten donations RLS and ensure safe public aggregate
-- 1) Ensure RLS is enabled
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- 2) Remove any broad/public SELECT policies if they exist
DROP POLICY IF EXISTS "Anyone can view donations" ON public.donations;
DROP POLICY IF EXISTS "Anyone can view all donations" ON public.donations;
DROP POLICY IF EXISTS "All users can view donations" ON public.donations;
DROP POLICY IF EXISTS "Public can view donations" ON public.donations;

-- 3) Recreate owner- and admin-scoped SELECT policies
DROP POLICY IF EXISTS "Users can view their own donations" ON public.donations;
CREATE POLICY "Users can view their own donations"
ON public.donations
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all donations" ON public.donations;
CREATE POLICY "Admins can view all donations"
ON public.donations
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- (Optional) keep existing INSERT/UPDATE policies as-is; no public SELECTs remain

-- 4) Ensure public-safe aggregate function exists and is executable
CREATE OR REPLACE FUNCTION public.get_donations_count()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer FROM public.donations;
$$;

GRANT EXECUTE ON FUNCTION public.get_donations_count() TO anon, authenticated;