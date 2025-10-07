-- Clean up and strengthen RLS policies for donations table
-- Remove redundant blocking policies and create clear, explicit policies

-- First, drop existing policies
DROP POLICY IF EXISTS "Block anonymous access" ON public.donations;
DROP POLICY IF EXISTS "Block public access" ON public.donations;
DROP POLICY IF EXISTS "Users can view own donations only" ON public.donations;
DROP POLICY IF EXISTS "Users can insert own donations only" ON public.donations;
DROP POLICY IF EXISTS "Admins only can update donations" ON public.donations;
DROP POLICY IF EXISTS "Admins only can delete donations" ON public.donations;
DROP POLICY IF EXISTS "Admins can view all donations" ON public.donations;

-- Explicit policy: Block all unauthenticated access
CREATE POLICY "Require authentication for donations"
ON public.donations
AS RESTRICTIVE
FOR ALL
TO public
USING (auth.uid() IS NOT NULL);

-- SELECT policies: Users can only view their own donations
CREATE POLICY "Users can view their own donations"
ON public.donations
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  AND user_id IS NOT NULL
);

-- SELECT policy: Admins can view all donations
CREATE POLICY "Admins can view all donations"
ON public.donations
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- INSERT policy: Users can only create donations for themselves
CREATE POLICY "Users can create their own donations"
ON public.donations
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND user_id IS NOT NULL
  AND auth.uid() IS NOT NULL
);

-- UPDATE policy: Only admins can update donations (for status changes)
CREATE POLICY "Only admins can update donations"
ON public.donations
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- DELETE policy: Only admins can delete donations
CREATE POLICY "Only admins can delete donations"
ON public.donations
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add comment for documentation
COMMENT ON TABLE public.donations IS 'Stores donor personal information (PII). RLS policies ensure users can only access their own donations, and only admins can modify donation records.';