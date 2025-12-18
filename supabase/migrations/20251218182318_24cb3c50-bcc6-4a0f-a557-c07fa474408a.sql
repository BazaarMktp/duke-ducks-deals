-- Create table to track which items are discussed in each conversation
CREATE TABLE public.conversation_item_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  referenced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_primary BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(conversation_id, listing_id)
);

-- Enable RLS
ALTER TABLE public.conversation_item_references ENABLE ROW LEVEL SECURITY;

-- Users can view item references for conversations they're part of
CREATE POLICY "Users can view item references for their conversations"
ON public.conversation_item_references
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_item_references.conversation_id
    AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
  )
);

-- Users can insert item references for conversations they're part of
CREATE POLICY "Users can add item references to their conversations"
ON public.conversation_item_references
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_item_references.conversation_id
    AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
  )
);

-- Create index for faster lookups
CREATE INDEX idx_conversation_item_refs_conversation ON public.conversation_item_references(conversation_id);
CREATE INDEX idx_conversation_item_refs_listing ON public.conversation_item_references(listing_id);

-- Migrate existing conversations: populate item references from existing listing_id
INSERT INTO public.conversation_item_references (conversation_id, listing_id, is_primary, referenced_at)
SELECT id, listing_id, true, created_at
FROM public.conversations
WHERE listing_id IS NOT NULL
ON CONFLICT DO NOTHING;