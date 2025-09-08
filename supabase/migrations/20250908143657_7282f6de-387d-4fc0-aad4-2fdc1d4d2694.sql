-- Let's create a more straightforward RLS policy approach
-- First, disable RLS temporarily to test
ALTER TABLE listings DISABLE ROW LEVEL SECURITY;

-- Re-enable with simpler policies
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can create their own listings" ON listings;
DROP POLICY IF EXISTS "Users can insert their own listings" ON listings;
DROP POLICY IF EXISTS "Users can update their own listings" ON listings;
DROP POLICY IF EXISTS "Users can delete their own listings" ON listings;
DROP POLICY IF EXISTS "Public can view active listings" ON listings;
DROP POLICY IF EXISTS "Admins can view all listings" ON listings;
DROP POLICY IF EXISTS "Admins can update any listing" ON listings;
DROP POLICY IF EXISTS "Admins can delete any listing" ON listings;

-- Create simple, explicit policies
CREATE POLICY "Anyone can view active listings" 
ON listings FOR SELECT 
USING (status = 'active'::listing_status);

CREATE POLICY "Users can view their own listings" 
ON listings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all listings" 
ON listings FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert their own listings" 
ON listings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings" 
ON listings FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings" 
ON listings FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any listing" 
ON listings FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete any listing" 
ON listings FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));