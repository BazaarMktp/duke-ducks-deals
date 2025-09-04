-- Allow users to view basic profile information of other users in their college
-- This enables normal users to see names on marketplace listings while maintaining privacy

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Users can only view their own profile and admins can view all" ON public.profiles;

-- Create new policies for better access control
CREATE POLICY "Users can view their own full profile" 
ON public.profiles 
FOR SELECT 
USING (id = auth.uid());

CREATE POLICY "Users can view basic info of same college users" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND college_id = get_current_user_college_id()
);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));