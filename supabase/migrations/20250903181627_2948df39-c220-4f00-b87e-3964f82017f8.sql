-- Ensure donations table is completely secure by explicitly denying public access
-- and strengthening existing policies

-- First, revoke any potential public access
REVOKE ALL ON public.donations FROM anon;
REVOKE ALL ON public.donations FROM public;

-- Create explicit deny policies for anon and public roles
CREATE POLICY "Deny all access to anonymous users" 
ON public.donations 
FOR ALL 
TO anon
USING (false);

CREATE POLICY "Deny all access to public role" 
ON public.donations 
FOR ALL 
TO public
USING (false);

-- Ensure user_id cannot be null (for data integrity and security)
ALTER TABLE public.donations 
ALTER COLUMN user_id SET NOT NULL;

-- Add a check to ensure user_id matches the authenticated user on insert
-- This prevents privilege escalation where someone could insert with another user's ID
CREATE OR REPLACE FUNCTION public.validate_donation_user_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Only allow if the user_id matches the authenticated user
  IF NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Access denied: Cannot create donation for another user';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to validate user_id on insert/update
DROP TRIGGER IF EXISTS validate_donation_user_trigger ON public.donations;
CREATE TRIGGER validate_donation_user_trigger
  BEFORE INSERT OR UPDATE ON public.donations
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_donation_user_id();

-- Add comment explaining the security measures
COMMENT ON TABLE public.donations IS 'Contains sensitive personal information. Access restricted to donation owner and admins only via RLS policies and triggers.';