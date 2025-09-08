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

-- Update the insert policy to be more flexible
DROP POLICY IF EXISTS "Users can insert their own listings" ON listings;

CREATE POLICY "Users can insert their own listings" 
ON listings 
FOR INSERT 
WITH CHECK (user_id = auth.uid());