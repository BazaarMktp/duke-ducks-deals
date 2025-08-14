-- Fix security vulnerability in donations table
-- Issue: Donations with NULL user_id could be publicly readable

-- First, let's update any existing NULL user_id records to a system admin
-- This ensures no orphaned records remain accessible
UPDATE public.donations 
SET user_id = (
  SELECT ur.user_id 
  FROM public.user_roles ur 
  WHERE ur.role = 'admin'::app_role 
  LIMIT 1
)
WHERE user_id IS NULL;

-- Make user_id NOT NULL to prevent future NULL values
ALTER TABLE public.donations 
ALTER COLUMN user_id SET NOT NULL;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can view their own donations" ON public.donations;
DROP POLICY IF EXISTS "Admins can view all donations" ON public.donations;
DROP POLICY IF EXISTS "Authenticated users can create donations" ON public.donations;
DROP POLICY IF EXISTS "Admins can update donations" ON public.donations;

-- Create secure RLS policies
-- Only allow authenticated users to create donations with their own user_id
CREATE POLICY "Authenticated users can create their own donations" 
ON public.donations 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can only view their own donations
CREATE POLICY "Users can view their own donations" 
ON public.donations 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all donations
CREATE POLICY "Admins can view all donations" 
ON public.donations 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update all donations
CREATE POLICY "Admins can update donations" 
ON public.donations 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete donations if needed
CREATE POLICY "Admins can delete donations" 
ON public.donations 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));