-- Tighten donations RLS (idempotent) and add safe count RPC
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Remove overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view donations" ON public.donations;

-- Recreate users-only SELECT policy with correct condition
DROP POLICY IF EXISTS "Users can view their own donations" ON public.donations;
CREATE POLICY "Users can view their own donations"
ON public.donations
FOR SELECT
USING (auth.uid() = user_id);

-- Ensure admin SELECT policy exists (create only if missing)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'donations'
      AND policyname = 'Admins can view all donations'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can view all donations" ON public.donations FOR SELECT USING (has_role(auth.uid(), ''admin''::app_role))';
  END IF;
END $$;

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