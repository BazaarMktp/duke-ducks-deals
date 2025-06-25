
-- Drop the existing problematic RLS policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create a new optimized policy that uses a subquery to avoid re-evaluation
CREATE POLICY "Users can insert their own profile" ON public.profiles 
FOR INSERT 
WITH CHECK (id = (SELECT auth.uid()));

-- Also check and optimize other auth function calls in RLS policies for profiles
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles 
FOR UPDATE 
USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view profiles from their own college" ON public.profiles;
CREATE POLICY "Users can view profiles from their own college" ON public.profiles 
FOR SELECT 
USING (college_id = (SELECT public.get_current_user_college_id()) OR id = (SELECT auth.uid()));
