-- Create listing_preferences table to store user's default listing settings
CREATE TABLE listing_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Transaction method defaults (marketplace)
  default_allow_pickup BOOLEAN NOT NULL DEFAULT true,
  default_allow_meet_on_campus BOOLEAN NOT NULL DEFAULT true,
  default_allow_drop_off BOOLEAN NOT NULL DEFAULT false,
  
  -- General defaults
  default_open_to_negotiation BOOLEAN NOT NULL DEFAULT true,
  default_location TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Ensure one preference record per user
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE listing_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage their own listing preferences
CREATE POLICY "Users can manage own listing preferences"
ON listing_preferences FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_listing_preferences_user_id ON listing_preferences(user_id);

-- Add updated_at trigger
CREATE TRIGGER update_listing_preferences_updated_at
BEFORE UPDATE ON listing_preferences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();