
-- Add a points column to the profiles table to store user scores
ALTER TABLE public.profiles
ADD COLUMN points INTEGER NOT NULL DEFAULT 0;

-- Create a new ENUM type to define the different kinds of badges available
CREATE TYPE public.badge_type AS ENUM (
    'FIRST_POST',
    'TOP_TRADER',
    'COMMUNITY_HELPER',
    'ECO_WARRIOR',
    'VERIFIED_BLUE_DEVIL'
);

-- Create a table to track the badges each user has earned
CREATE TABLE public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_type public.badge_type NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, badge_type)
);

-- Enable Row-Level Security on the new user_badges table
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Create a policy to make earned badges publicly visible on user profiles
CREATE POLICY "Badges are publicly viewable"
ON public.user_badges
FOR SELECT
USING (true);
