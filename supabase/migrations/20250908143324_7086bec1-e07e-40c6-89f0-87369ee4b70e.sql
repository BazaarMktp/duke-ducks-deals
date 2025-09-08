-- Fix the update policies for listings
DROP POLICY IF EXISTS "Users can update their own listings" ON listings;
DROP POLICY IF EXISTS "Admins can update any listing" ON listings;

-- Recreate the update policy with proper permissions
CREATE POLICY "Users can update their own listings" 
ON listings 
FOR UPDATE 
TO public
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Recreate admin policy 
CREATE POLICY "Admins can update any listing" 
ON listings 
FOR UPDATE 
TO public
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Also fix the insert policy to remove college constraint
DROP POLICY IF EXISTS "Users can insert their own listings" ON listings;

CREATE POLICY "Users can insert their own listings" 
ON listings 
FOR INSERT 
TO public
WITH CHECK (user_id = auth.uid());