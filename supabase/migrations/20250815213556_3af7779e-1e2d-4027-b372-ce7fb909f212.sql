-- Allow public read access to active listings for basic marketplace viewing
-- This enables non-authenticated users to see listing titles, descriptions, and images
-- while keeping sensitive data protected through component-level logic

DROP POLICY IF EXISTS "Authenticated users can view listings from their college" ON public.listings;

CREATE POLICY "Public can view active listings" 
ON public.listings 
FOR SELECT 
USING (status = 'active'::listing_status);

-- Keep existing admin and user policies for full access
-- Admins can still view all listings
-- Users can still create, update, and delete their own listings