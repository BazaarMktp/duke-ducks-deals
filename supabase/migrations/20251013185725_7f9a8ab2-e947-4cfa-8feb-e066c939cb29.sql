-- Fix infinite recursion in business_profiles RLS policies
-- The issue is that the SELECT policy queries business_ads which might query back to business_profiles

-- Drop the problematic policy
DROP POLICY IF EXISTS "Anyone can view business profiles with ads" ON public.business_profiles;

-- Create a security definer function to check if business has approved ads
CREATE OR REPLACE FUNCTION public.business_has_approved_ads(business_id_param uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.business_ads
    WHERE business_id = business_id_param
      AND approval_status = 'approved'
  );
$$;

-- Recreate the policy using the security definer function
CREATE POLICY "Anyone can view business profiles with approved ads"
ON public.business_profiles
FOR SELECT
USING (
  business_has_approved_ads(id) 
  OR user_id = auth.uid() 
  OR has_role(auth.uid(), 'admin'::app_role)
);