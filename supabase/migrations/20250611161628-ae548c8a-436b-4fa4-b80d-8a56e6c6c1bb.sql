
-- Add listing_type enum to distinguish between offers and wanted posts
CREATE TYPE listing_type AS ENUM ('offer', 'wanted');

-- Add listing_type column to existing listings table
ALTER TABLE listings ADD COLUMN listing_type listing_type NOT NULL DEFAULT 'offer';

-- Add expiration date for wanted posts (optional but useful)
ALTER TABLE listings ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE;

-- Create index for better performance when filtering by listing_type
CREATE INDEX idx_listings_type_status ON listings(listing_type, status);

-- Create index for expiration queries
CREATE INDEX idx_listings_expires_at ON listings(expires_at) WHERE expires_at IS NOT NULL;
