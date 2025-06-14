
-- Add an is_read flag to messages to track read status
ALTER TABLE public.messages
ADD COLUMN is_read BOOLEAN NOT NULL DEFAULT false;

-- Create a function to efficiently count unread messages for a user.
-- This avoids heavy client-side processing.
CREATE OR REPLACE FUNCTION public.get_unread_message_count(_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer
  FROM public.messages
  WHERE
    conversation_id IN (SELECT id FROM public.conversations WHERE buyer_id = _user_id OR seller_id = _user_id)
    AND sender_id != _user_id
    AND is_read = false;
$$;

-- Create an index on is_read for faster querying of unread messages.
CREATE INDEX idx_messages_is_read ON public.messages(is_read);
