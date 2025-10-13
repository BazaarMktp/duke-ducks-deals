-- Drop the existing INSERT policy that may be too restrictive
DROP POLICY IF EXISTS "Anyone can create ads for approval" ON public.business_ads;

-- Create a new INSERT policy that explicitly allows public/anonymous users
CREATE POLICY "Public can submit ads for approval"
ON public.business_ads
FOR INSERT
TO public
WITH CHECK (
  -- Allow anyone (including unauthenticated) to submit ads
  -- They will be set to pending approval and inactive by default
  approval_status = 'pending' AND is_active = false
);