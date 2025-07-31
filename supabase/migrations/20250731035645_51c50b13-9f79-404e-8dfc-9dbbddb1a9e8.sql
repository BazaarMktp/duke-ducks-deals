-- Fix RLS performance issue on donations table
-- Replace auth.uid() with (select auth.uid()) to prevent re-evaluation for each row

DROP POLICY IF EXISTS "Users can view their own donations" ON public.donations;

CREATE POLICY "Users can view their own donations" 
ON public.donations 
FOR SELECT 
USING (((SELECT auth.uid()) = user_id) OR (user_id IS NULL));