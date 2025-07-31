-- Fix RLS performance issue on public.colleges table
-- Replace auth.uid() with (SELECT auth.uid()) to prevent re-evaluation for each row

DROP POLICY IF EXISTS "Admins can manage colleges" ON public.colleges;

CREATE POLICY "Admins can manage colleges" 
ON public.colleges 
FOR ALL 
USING (has_role((SELECT auth.uid()), 'admin'::app_role));