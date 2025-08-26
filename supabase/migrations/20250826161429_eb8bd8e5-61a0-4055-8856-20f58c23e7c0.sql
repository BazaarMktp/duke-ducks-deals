-- Drop the problematic security definer view
DROP VIEW IF EXISTS public.public_profiles;

-- Drop the overly restrictive policy that might break functionality
DROP POLICY IF EXISTS "Users can only view their own profile and admins can view all" ON public.profiles;
DROP POLICY IF EXISTS "Restricted profile access" ON public.profiles;

-- Create a balanced policy that allows viewing basic profile info from college users
-- but restricts sensitive data through application-level controls
CREATE POLICY "College users can view profiles with restrictions" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can view their own profile fully
  id = auth.uid() 
  -- Admins can view all profiles fully
  OR has_role(auth.uid(), 'admin'::app_role)
  -- College users can view basic profile info (app must filter sensitive fields)
  OR (college_id = get_current_user_college_id() AND auth.uid() IS NOT NULL)
);

-- Create a security definer function to get safe public profile data
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_id uuid)
RETURNS TABLE (
  id uuid,
  profile_name text,
  avatar_url text,
  college_id uuid,
  is_verified boolean,
  points integer,
  created_at timestamp with time zone
)
LANGUAGE SQL
SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.profile_name,
    p.avatar_url,
    p.college_id,
    p.is_verified,
    p.points,
    p.created_at
  FROM public.profiles p
  WHERE p.id = profile_id
    AND (
      -- User requesting their own data gets full access through main table
      p.id = auth.uid()
      -- Admin gets full access
      OR has_role(auth.uid(), 'admin'::app_role)
      -- College users can only get basic info
      OR (p.college_id = get_current_user_college_id() AND auth.uid() IS NOT NULL)
    );
$$;