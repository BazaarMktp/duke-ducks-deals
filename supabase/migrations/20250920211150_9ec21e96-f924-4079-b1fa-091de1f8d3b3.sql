-- Add likes functionality to messages table
ALTER TABLE public.messages ADD COLUMN likes jsonb DEFAULT '[]';

-- Create an index for better performance on likes queries
CREATE INDEX idx_messages_likes ON public.messages USING GIN(likes);

-- Add last_message and last_message_at to conversations for better sorting
ALTER TABLE public.conversations 
ADD COLUMN last_message_preview text,
ADD COLUMN last_message_at timestamp with time zone DEFAULT now();

-- Create function to update conversation last message
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations 
  SET 
    last_message_preview = LEFT(NEW.message, 50),
    last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update last message info
CREATE TRIGGER update_conversation_last_message_trigger
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();