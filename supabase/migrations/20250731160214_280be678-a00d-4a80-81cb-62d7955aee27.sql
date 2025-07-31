-- Add negotiation field to listings table
ALTER TABLE public.listings 
ADD COLUMN open_to_negotiation boolean DEFAULT false;