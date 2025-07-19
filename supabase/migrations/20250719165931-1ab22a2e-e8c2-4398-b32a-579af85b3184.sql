-- Add RLS policy to allow users to update conversations they're part of
-- This is needed for archiving and deleting conversations
CREATE POLICY "Users can update conversations they're part of" 
ON public.conversations 
FOR UPDATE 
USING ((auth.uid() = buyer_id) OR (auth.uid() = seller_id));