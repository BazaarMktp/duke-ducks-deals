-- Remove the conflicting policies I added that are causing issues
DROP POLICY IF EXISTS "Require authentication for donations access" ON public.donations;
DROP POLICY IF EXISTS "Block public role access to donations" ON public.donations;

-- The existing policies are sufficient:
-- 1. "Users can view their own donations" - SELECT - (auth.uid() = user_id)
-- 2. "Admins can view all donations" - SELECT - has_role(auth.uid(), 'admin'::app_role)
-- 3. "Authenticated users can create their own donations" - INSERT - (auth.uid() = user_id)
-- 4. "Admins can update donations" - UPDATE - has_role(auth.uid(), 'admin'::app_role)
-- 5. "Admins can delete donations" - DELETE - has_role(auth.uid(), 'admin'::app_role)

-- Let's also fix the profiles table security issue mentioned in the scan
-- The issue is that college users can view other students' profiles
-- Let's make it more restrictive - only own profile and admins

-- First, let's see the current profile policies and update them
DROP POLICY IF EXISTS "College users can view profiles with restrictions" ON public.profiles;

-- Create a more restrictive policy for profile viewing
CREATE POLICY "Users can only view their own profile and admins can view all" 
ON public.profiles 
FOR SELECT 
USING (
  (id = auth.uid()) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- However, for marketplace functionality, we might need users to see seller profiles
-- Let's create a function to get public profile info safely
CREATE OR REPLACE FUNCTION public.get_public_seller_info(profile_id uuid)
RETURNS TABLE(
  profile_name text,
  avatar_url text,
  is_verified boolean,
  points integer
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.profile_name,
    p.avatar_url,
    p.is_verified,
    p.points
  FROM public.profiles p
  WHERE p.id = profile_id
    AND (
      -- Allow if same college (for marketplace interactions)
      p.college_id = get_current_user_college_id()
      OR has_role(auth.uid(), 'admin'::app_role)
    );
$$;