-- Tighten donations RLS and add safe count RPC
-- Ensure RLS is enabled
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Drop overly permissive or flawed SELECT policies
DROP POLICY IF EXISTS "Anyone can view donations" ON public.donations;
DROP POLICY IF EXISTS "Users can view their own donations" ON public.donations;

-- Create secure SELECT policies
CREATE POLICY "Admins can view all donations"
ON public.donations
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own donations"
ON public.donations
FOR SELECT
USING (auth.uid() = user_id);

-- Public-safe aggregate: donations count via SECURITY DEFINER function
CREATE OR REPLACE FUNCTION public.get_donations_count()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer FROM public.donations;
$$;

-- Allow execution for both anonymous and authenticated clients
GRANT EXECUTE ON FUNCTION public.get_donations_count() TO anon, authenticated;