-- Add allow_drop_off column to listings table
ALTER TABLE public.listings 
ADD COLUMN allow_drop_off BOOLEAN DEFAULT false;