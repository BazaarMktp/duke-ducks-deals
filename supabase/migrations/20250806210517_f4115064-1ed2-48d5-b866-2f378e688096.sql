-- Make listing_id nullable in conversations table to allow admin messages
ALTER TABLE public.conversations 
ALTER COLUMN listing_id DROP NOT NULL;