-- Fix location privacy vulnerability in listings table
-- Issue: Public access to listings exposes user home addresses to potential stalkers

-- Remove the dangerous public access policy
DROP POLICY IF EXISTS "Anyone can view active listings" ON public.listings;

-- Ensure only authenticated users from the same college can view listings
-- This policy already exists but let's make sure it's properly configured
DROP POLICY IF EXISTS "Users can view listings from their own college" ON public.listings;

-- Create secure policy for authenticated college users
CREATE POLICY "Authenticated users can view listings from their college" 
ON public.listings 
FOR SELECT 
TO authenticated
USING (
  college_id = get_current_user_college_id() 
  AND status = 'active'::listing_status
);

-- Keep admin access intact
-- The "Admins can view all listings" policy should remain