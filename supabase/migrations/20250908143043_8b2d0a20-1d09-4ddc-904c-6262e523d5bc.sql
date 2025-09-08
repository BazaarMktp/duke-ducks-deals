-- Fix foreign key constraint that prevents listing deletion
ALTER TABLE ai_interactions 
DROP CONSTRAINT IF EXISTS ai_interactions_listing_id_fkey;

ALTER TABLE ai_interactions 
ADD CONSTRAINT ai_interactions_listing_id_fkey 
FOREIGN KEY (listing_id) 
REFERENCES listings(id) 
ON DELETE CASCADE;

-- Fix RLS policies to ensure users can properly update their own listings
-- Drop and recreate the user update policy to be more explicit
DROP POLICY IF EXISTS "Users can update their own listings" ON listings;

CREATE POLICY "Users can update their own listings" 
ON listings 
FOR UPDATE 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Ensure the delete policy is properly set
DROP POLICY IF EXISTS "Users can delete their own listings" ON listings;

CREATE POLICY "Users can delete their own listings" 
ON listings 
FOR DELETE 
USING (user_id = auth.uid());