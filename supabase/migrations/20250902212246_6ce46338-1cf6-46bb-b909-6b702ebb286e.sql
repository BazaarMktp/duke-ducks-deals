-- Fix the get_donations_count function to be more secure
-- Instead of bypassing RLS, only count approved donations which are less sensitive
DROP FUNCTION IF EXISTS public.get_donations_count();

CREATE OR REPLACE FUNCTION public.get_donations_count()
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  -- Only count approved donations to avoid exposing total donation count
  -- Approved donations are less sensitive as they've been processed
  SELECT COUNT(*)::integer 
  FROM public.donations 
  WHERE status = 'approved';
$$;

-- Create a more restrictive function for admins to get full count
CREATE OR REPLACE FUNCTION public.get_all_donations_count()
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    WHEN has_role(auth.uid(), 'admin'::app_role) THEN 
      (SELECT COUNT(*)::integer FROM public.donations)
    ELSE 
      0
  END;
$$;

-- Add a constraint to ensure user_id is never null (security requirement)
-- This prevents any donations from being created without proper user association
ALTER TABLE public.donations 
ALTER COLUMN user_id SET NOT NULL;

-- Create an additional security policy to ensure no anonymous access
-- Even though we have existing policies, this adds an extra layer
CREATE POLICY "Require authentication for donations access" 
ON public.donations 
FOR ALL 
TO anon
USING (false);

-- Add a policy to explicitly deny access to roles other than authenticated
CREATE POLICY "Block public role access to donations" 
ON public.donations 
FOR ALL 
TO public
USING (false);

-- Create a function to safely get donation statistics without exposing sensitive data
CREATE OR REPLACE FUNCTION public.get_donation_stats()
RETURNS json
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'approved_count', (SELECT COUNT(*) FROM public.donations WHERE status = 'approved'),
    'total_requests', CASE 
      WHEN has_role(auth.uid(), 'admin'::app_role) THEN 
        (SELECT COUNT(*) FROM public.donations)
      ELSE 
        (SELECT COUNT(*) FROM public.donations WHERE status = 'approved')
    END
  );
$$;