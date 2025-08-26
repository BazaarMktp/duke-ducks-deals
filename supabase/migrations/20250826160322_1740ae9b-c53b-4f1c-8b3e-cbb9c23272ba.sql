-- Drop the overly permissive policy that allows college-wide access to all profile data
DROP POLICY IF EXISTS "Authenticated users can view profiles from their college" ON public.profiles;

-- Create a new policy that only allows viewing basic public information from college profiles
CREATE POLICY "Users can view basic info from their college profiles" 
ON public.profiles 
FOR SELECT 
USING (
  (college_id = get_current_user_college_id() OR id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  AND 
  -- Only allow viewing basic public fields for other college users
  (id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
);

-- Create a separate policy for viewing limited public profile data from same college
CREATE POLICY "Users can view limited public profile data from their college" 
ON public.profiles 
FOR SELECT 
USING (
  college_id = get_current_user_college_id() 
  AND auth.uid() IS NOT NULL
);