-- Fix messages RLS to allow marking messages as read
-- Add UPDATE policy for messages table to allow users to mark messages as read
CREATE POLICY "Users can mark messages as read in their conversations" 
ON public.messages 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (conversations.buyer_id = auth.uid() OR conversations.seller_id = auth.uid())
  )
) 
WITH CHECK (
  -- Only allow updating is_read field
  EXISTS (
    SELECT 1 
    FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (conversations.buyer_id = auth.uid() OR conversations.seller_id = auth.uid())
  )
);