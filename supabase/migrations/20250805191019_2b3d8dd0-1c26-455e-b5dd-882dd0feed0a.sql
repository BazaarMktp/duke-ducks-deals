-- Add columns to track where items were sold
ALTER TABLE public.listings 
ADD COLUMN sold_on_bazaar boolean DEFAULT NULL,
ADD COLUMN sold_elsewhere_location text DEFAULT NULL,
ADD COLUMN sold_at timestamp with time zone DEFAULT NULL;