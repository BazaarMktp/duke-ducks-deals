-- Fix RLS performance issue on public.listings table
-- Replace auth.uid() with (SELECT auth.uid()) to prevent re-evaluation for each row

DROP POLICY IF EXISTS "Users can insert their own listings" ON public.listings;

CREATE POLICY "Users can insert their own listings" 
ON public.listings 
FOR INSERT 
WITH CHECK ((user_id = (SELECT auth.uid())) AND (college_id = get_current_user_college_id()));