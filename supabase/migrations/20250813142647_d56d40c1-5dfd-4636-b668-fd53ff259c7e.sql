-- Remove the overly permissive "Anyone can create donations" policy
DROP POLICY IF EXISTS "Anyone can create donations" ON public.donations;

-- Keep only the authenticated users insert policy and ensure it requires authentication
DROP POLICY IF EXISTS "Authenticated users can insert donations" ON public.donations;

-- Create a new, secure policy for authenticated users to create donations
CREATE POLICY "Authenticated users can create donations" 
ON public.donations 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Ensure the SELECT policies are properly restrictive (should already be in place)
-- Verify admin policy exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'donations' 
        AND policyname = 'Admins can view all donations'
    ) THEN
        EXECUTE 'CREATE POLICY "Admins can view all donations" 
                ON public.donations 
                FOR SELECT 
                TO authenticated
                USING (has_role(auth.uid(), ''admin''::app_role))';
    END IF;
END $$;

-- Verify user policy exists  
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'donations' 
        AND policyname = 'Users can view their own donations'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can view their own donations" 
                ON public.donations 
                FOR SELECT 
                TO authenticated
                USING (auth.uid() = user_id)';
    END IF;
END $$;