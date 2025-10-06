-- Update business_profiles to support public ad submissions without authentication

-- Allow user_id to be null for public submissions
ALTER TABLE public.business_profiles 
ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policy to allow anyone to insert business profiles
DROP POLICY IF EXISTS "Business users can insert their own profile" ON public.business_profiles;

CREATE POLICY "Anyone can create business profile"
ON public.business_profiles
FOR INSERT
WITH CHECK (true);

-- Update RLS policy to allow viewing business profiles associated with ads
CREATE POLICY "Anyone can view business profiles with ads"
ON public.business_profiles
FOR SELECT
USING (
  id IN (
    SELECT DISTINCT business_id 
    FROM public.business_ads 
    WHERE approval_status = 'approved'
  )
  OR user_id = auth.uid()
  OR has_role(auth.uid(), 'admin'::app_role)
);