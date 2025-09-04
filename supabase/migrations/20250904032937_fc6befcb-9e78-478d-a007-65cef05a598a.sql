-- Strengthen donations table security by simplifying and tightening RLS policies
-- First, drop existing policies to replace with more secure ones
DROP POLICY IF EXISTS "Admins can delete donations" ON public.donations;
DROP POLICY IF EXISTS "Admins can update donations" ON public.donations;
DROP POLICY IF EXISTS "Admins can view all donations" ON public.donations;
DROP POLICY IF EXISTS "Authenticated users can create their own donations" ON public.donations;
DROP POLICY IF EXISTS "Deny all access to anonymous users" ON public.donations;
DROP POLICY IF EXISTS "Deny all access to public role" ON public.donations;
DROP POLICY IF EXISTS "Users can view their own donations" ON public.donations;

-- Create comprehensive, secure policies that eliminate any potential data exposure
-- 1. Block all anonymous and public access completely
CREATE POLICY "Block anonymous access" ON public.donations
  FOR ALL TO anon
  USING (false);

CREATE POLICY "Block public access" ON public.donations
  FOR ALL TO public
  USING (false);

-- 2. Allow authenticated users to only insert their own donations
CREATE POLICY "Users can insert own donations only" ON public.donations
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id 
    AND auth.uid() IS NOT NULL
    AND user_id IS NOT NULL
  );

-- 3. Allow users to view only their own donations
CREATE POLICY "Users can view own donations only" ON public.donations
  FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id 
    AND auth.uid() IS NOT NULL
    AND user_id IS NOT NULL
  );

-- 4. Only admins can update donations
CREATE POLICY "Admins only can update donations" ON public.donations
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 5. Only admins can delete donations
CREATE POLICY "Admins only can delete donations" ON public.donations
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 6. Only admins can view all donations
CREATE POLICY "Admins can view all donations" ON public.donations
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Ensure the user_id column cannot be null to prevent security bypasses
ALTER TABLE public.donations ALTER COLUMN user_id SET NOT NULL;

-- Add a trigger to validate user_id matches authenticated user on insert/update
CREATE OR REPLACE FUNCTION public.validate_donation_ownership()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure user_id matches authenticated user for non-admin operations
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    IF NEW.user_id != auth.uid() OR NEW.user_id IS NULL OR auth.uid() IS NULL THEN
      RAISE EXCEPTION 'Access denied: Cannot create/modify donation for another user';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public;

-- Apply trigger to INSERT and UPDATE operations
DROP TRIGGER IF EXISTS enforce_donation_ownership ON public.donations;
CREATE TRIGGER enforce_donation_ownership
  BEFORE INSERT OR UPDATE ON public.donations
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_donation_ownership();