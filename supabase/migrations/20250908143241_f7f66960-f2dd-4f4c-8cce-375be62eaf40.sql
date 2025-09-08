-- Let's completely recreate the UPDATE policy with explicit permissions
DROP POLICY IF EXISTS "Users can update their own listings" ON listings;
DROP POLICY IF EXISTS "Admins can update any listing" ON listings;

-- Create a more permissive update policy for users
CREATE POLICY "Users can update their own listings" 
ON listings 
FOR UPDATE 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Ensure admins can also update
CREATE POLICY "Admins can update any listing" 
ON listings 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Let's also check if there's an issue with the college_id constraint
-- Update the insert policy to be more flexible
DROP POLICY IF EXISTS "Users can insert their own listings" ON listings;

CREATE POLICY "Users can insert their own listings" 
ON listings 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Add debug logging by creating a function to test auth
CREATE OR REPLACE FUNCTION debug_auth_info()
RETURNS TABLE(current_user_id uuid, current_role text, has_admin_role boolean)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    auth.uid() as current_user_id,
    COALESCE((SELECT role::text FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1), 'none') as current_role,
    has_role(auth.uid(), 'admin'::app_role) as has_admin_role;
$$;