-- First, drop all existing policies on donations table
DROP POLICY IF EXISTS "Anyone can create donations" ON public.donations;
DROP POLICY IF EXISTS "Authenticated users can insert donations" ON public.donations;  
DROP POLICY IF EXISTS "Authenticated users can create donations" ON public.donations;
DROP POLICY IF EXISTS "Admins can view all donations" ON public.donations;
DROP POLICY IF EXISTS "Users can view their own donations" ON public.donations;
DROP POLICY IF EXISTS "Admins can update donations" ON public.donations;

-- Ensure RLS is enabled
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Create secure INSERT policy - only authenticated users can create donations
CREATE POLICY "Authenticated users can create donations"
ON public.donations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Create secure SELECT policies
CREATE POLICY "Admins can view all donations"
ON public.donations
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own donations"
ON public.donations
FOR SELECT  
TO authenticated
USING (user_id IS NOT NULL AND auth.uid() = user_id);

-- Create secure UPDATE policy for admins only
CREATE POLICY "Admins can update donations"
ON public.donations
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));