
-- Add missing columns to the listings table for marketplace transaction methods
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS allow_pickup boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS allow_meet_on_campus boolean DEFAULT false;
