-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Anyone can create business profile" ON public.business_profiles;

-- Create a more permissive INSERT policy that allows unauthenticated users
-- This is needed for public business ad submissions where user_id can be null
CREATE POLICY "Allow public business profile creation"
ON public.business_profiles
FOR INSERT
WITH CHECK (
  -- Allow if user_id is null (public submission)
  user_id IS NULL
  OR
  -- Allow if user is authenticated and setting their own user_id
  (auth.uid() = user_id)
  OR
  -- Allow if admin
  has_role(auth.uid(), 'admin'::app_role)
);