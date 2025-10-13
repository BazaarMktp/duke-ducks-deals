-- Drop existing restrictive policies and allow public submissions
DROP POLICY IF EXISTS "Business users can create deals" ON public.deals;

-- Allow public submissions to deals for review (not active)
CREATE POLICY "Public can submit deals for review"
ON public.deals
FOR INSERT
TO public
WITH CHECK (is_active = false);