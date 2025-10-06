# Backend API Documentation - Bazaar Platform

## Table of Contents
1. [Database Schema](#database-schema)
2. [Edge Functions](#edge-functions)
3. [Database Functions](#database-functions)
4. [Storage Buckets](#storage-buckets)
5. [Authentication](#authentication)
6. [Row Level Security](#row-level-security)
7. [API Examples](#api-examples)

---

## Database Schema

### Enums

```sql
CREATE TYPE app_role AS ENUM ('user', 'admin', 'business');
CREATE TYPE listing_category AS ENUM ('marketplace', 'housing', 'services');
CREATE TYPE listing_type AS ENUM ('offer', 'wanted');
CREATE TYPE listing_status AS ENUM ('active', 'sold', 'inactive');
CREATE TYPE housing_type AS ENUM ('apartment', 'house', 'room', 'studio', 'dorm');
CREATE TYPE email_frequency AS ENUM ('instant', 'daily', 'weekly');
CREATE TYPE challenge_status AS ENUM ('active', 'completed', 'expired');
CREATE TYPE achievement_category AS ENUM ('social', 'trading', 'community', 'milestone');
CREATE TYPE achievement_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');
CREATE TYPE badge_type AS ENUM ('verified', 'top_seller', 'helpful', 'early_adopter');
```

### Core Tables

#### profiles
User profile information extending auth.users
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  profile_name text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone_number text,
  college_id uuid REFERENCES colleges(id) NOT NULL,
  is_verified boolean DEFAULT false,
  points integer DEFAULT 0,
  avatar_url text,
  housing_preferences jsonb DEFAULT '{}',
  lifestyle_preferences jsonb DEFAULT '{}',
  compatibility_score_cache jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### colleges
College/university information
```sql
CREATE TABLE colleges (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  domain text NOT NULL UNIQUE,
  image_url text,
  created_at timestamptz DEFAULT now()
);
```

#### user_roles
Role-based access control
```sql
CREATE TABLE user_roles (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);
```

#### listings
Main marketplace/housing/services listings
```sql
CREATE TABLE listings (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  college_id uuid REFERENCES colleges(id) NOT NULL,
  title text NOT NULL,
  description text,
  price numeric,
  category listing_category NOT NULL,
  listing_type listing_type DEFAULT 'offer',
  housing_type housing_type,
  images text[],
  location text,
  latitude numeric,
  longitude numeric,
  status listing_status DEFAULT 'active',
  featured boolean DEFAULT false,
  allow_pickup boolean DEFAULT false,
  allow_meet_on_campus boolean DEFAULT false,
  allow_drop_off boolean DEFAULT false,
  open_to_negotiation boolean DEFAULT false,
  sold_on_bazaar boolean,
  sold_elsewhere_location text,
  sold_at timestamptz,
  ai_generated_description text,
  ai_suggested_category text,
  ai_confidence_score numeric DEFAULT 0,
  ai_features jsonb,
  moderation_status text DEFAULT 'pending',
  moderation_flags jsonb DEFAULT '[]',
  similarity_score numeric DEFAULT 0,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### deals
Devil's Deals
```sql
CREATE TABLE deals (
  id uuid PRIMARY KEY,
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  business_name text NOT NULL,
  discount_percentage integer,
  original_price numeric,
  discounted_price numeric,
  image_url text,
  business_website text,
  business_phone text,
  business_email text,
  terms_and_conditions text,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### business_profiles
Business account information
```sql
CREATE TABLE business_profiles (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  business_name text NOT NULL,
  business_description text,
  business_website text,
  business_email text,
  business_phone text,
  business_logo_url text,
  business_address text,
  is_verified boolean DEFAULT false,
  verification_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### business_ads
Business promotional advertisements
```sql
CREATE TABLE business_ads (
  id uuid PRIMARY KEY,
  business_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  ad_type text DEFAULT 'banner',
  image_url text,
  video_url text,
  link_url text,
  display_priority integer DEFAULT 0,
  is_active boolean DEFAULT false,
  approval_status text DEFAULT 'pending',
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamptz,
  starts_at timestamptz DEFAULT now(),
  ends_at timestamptz,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### conversations
Message conversations between users
```sql
CREATE TABLE conversations (
  id uuid PRIMARY KEY,
  buyer_id uuid REFERENCES auth.users(id) NOT NULL,
  seller_id uuid REFERENCES auth.users(id) NOT NULL,
  listing_id uuid REFERENCES listings(id),
  last_message_preview text,
  last_message_at timestamptz DEFAULT now(),
  archived_by_buyer boolean DEFAULT false,
  archived_by_seller boolean DEFAULT false,
  deleted_by_buyer boolean DEFAULT false,
  deleted_by_seller boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### messages
Chat messages
```sql
CREATE TABLE messages (
  id uuid PRIMARY KEY,
  conversation_id uuid REFERENCES conversations(id) NOT NULL,
  sender_id uuid REFERENCES auth.users(id) NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  likes jsonb DEFAULT '[]',
  attachments jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);
```

### Gamification Tables

#### user_levels
User XP and level tracking
```sql
CREATE TABLE user_levels (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) UNIQUE NOT NULL,
  current_level integer DEFAULT 1,
  current_xp integer DEFAULT 0,
  total_xp integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### achievements
Available achievements
```sql
CREATE TABLE achievements (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  category achievement_category NOT NULL,
  rarity achievement_rarity DEFAULT 'common',
  icon_name text,
  requirements jsonb DEFAULT '{}',
  points_reward integer DEFAULT 0,
  xp_reward integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
```

#### user_achievements
Earned achievements
```sql
CREATE TABLE user_achievements (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  achievement_id uuid REFERENCES achievements(id) NOT NULL,
  progress jsonb DEFAULT '{}',
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);
```

---

## Edge Functions

### AI Functions

#### analyze-listing-content
**Purpose**: AI content moderation for listings
**Input**:
```json
{
  "title": "string",
  "description": "string",
  "category": "marketplace | housing | services"
}
```
**Output**:
```json
{
  "is_appropriate": boolean,
  "confidence": number,
  "flags": string[],
  "suggested_category": string
}
```

#### campus-chatbot
**Purpose**: Campus assistant chatbot
**Input**:
```json
{
  "messages": [
    { "role": "user", "content": "string" }
  ]
}
```
**Output**: SSE stream
```
data: {"choices":[{"delta":{"content":"token"}}]}
```

#### generate-description
**Purpose**: Generate AI listing descriptions
**Input**:
```json
{
  "title": "string",
  "category": "string",
  "price": number,
  "features": string[]
}
```
**Output**:
```json
{
  "description": "string",
  "confidence": number
}
```

#### personalized-recommendations
**Purpose**: Get personalized listing recommendations
**Input**:
```json
{
  "user_id": "uuid",
  "category": "marketplace | housing | services",
  "limit": number
}
```
**Output**:
```json
{
  "recommendations": [
    {
      "listing_id": "uuid",
      "similarity_score": number,
      "reason": "string"
    }
  ]
}
```

#### price-intelligence
**Purpose**: Smart pricing suggestions
**Input**:
```json
{
  "title": "string",
  "description": "string",
  "category": "string",
  "condition": "string"
}
```
**Output**:
```json
{
  "suggested_price": number,
  "price_range": {
    "min": number,
    "max": number
  },
  "confidence": number
}
```

### Utility Functions

#### auto-feature-listings
**Purpose**: Automatically feature desirable listings
**Input**: None
**Output**:
```json
{
  "featured_count": number,
  "listings": uuid[]
}
```

#### calculate-compatibility
**Purpose**: Roommate compatibility calculation
**Input**:
```json
{
  "user1_id": "uuid",
  "user2_id": "uuid"
}
```
**Output**:
```json
{
  "compatibility_score": number,
  "match_explanation": {
    "strengths": string[],
    "potential_concerns": string[]
  }
}
```

#### send-message-notification
**Purpose**: Send email notification for new messages
**Input**:
```json
{
  "recipient_id": "uuid",
  "sender_name": "string",
  "message_preview": "string"
}
```
**Output**:
```json
{
  "success": boolean,
  "message_id": "string"
}
```

---

## Database Functions

### Role Management

#### has_role(user_id, role)
Check if user has specific role
```sql
SELECT has_role(auth.uid(), 'admin'::app_role);
-- Returns: boolean
```

#### get_current_user_college_id()
Get authenticated user's college
```sql
SELECT get_current_user_college_id();
-- Returns: uuid
```

### Gamification

#### add_user_xp(user_id, xp_amount, points_amount)
Award XP and points to user
```sql
SELECT add_user_xp(
  'user-uuid'::uuid,
  50, -- xp
  10  -- points
);
```

#### calculate_level_from_xp(xp)
Calculate level from XP amount
```sql
SELECT calculate_level_from_xp(500);
-- Returns: integer (level)
```

#### get_user_xp_rank(user_id)
Get user's rank on leaderboard
```sql
SELECT get_user_xp_rank('user-uuid'::uuid);
-- Returns: integer (rank)
```

### Engagement

#### update_listing_engagement(listing_id)
Update engagement metrics for listing
```sql
SELECT update_listing_engagement('listing-uuid'::uuid);
```

#### calculate_engagement_score(views, favorites, messages, clicks)
Calculate engagement score
```sql
SELECT calculate_engagement_score(
  100, -- views
  15,  -- favorites
  8,   -- messages
  25   -- clicks
);
-- Returns: numeric (score)
```

#### auto_feature_desirable_listings()
Auto-promote high-performing listings
```sql
SELECT auto_feature_desirable_listings();
-- Returns: integer (count of featured listings)
```

### Analytics

#### get_platform_stats()
Get platform-wide statistics (admin only)
```sql
SELECT get_platform_stats();
-- Returns: json
```

#### get_deal_analytics(deal_id)
Get analytics for specific deal
```sql
SELECT get_deal_analytics('deal-uuid'::uuid);
-- Returns: table (deal_id, total_page_visits, total_deal_clicks, etc.)
```

---

## Storage Buckets

### listing-images
**Purpose**: Product and listing images
**Public**: Yes
**Max File Size**: 10MB
**Allowed Types**: image/jpeg, image/png, image/webp

**Upload Example**:
```typescript
const { data, error } = await supabase.storage
  .from('listing-images')
  .upload(`${userId}/${filename}`, file, {
    cacheControl: '3600',
    upsert: false
  });
```

**Get Public URL**:
```typescript
const { data } = supabase.storage
  .from('listing-images')
  .getPublicUrl(filePath);
const url = data.publicUrl;
```

### profile-pictures
**Purpose**: User avatars
**Public**: Yes
**Max File Size**: 5MB
**Allowed Types**: image/jpeg, image/png

### message-attachments
**Purpose**: Chat attachments
**Public**: Yes
**Max File Size**: 20MB
**Allowed Types**: All file types

**RLS Policy Example**:
```sql
CREATE POLICY "Users can upload own attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'message-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## Authentication

### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@college.edu',
  password: 'secure_password',
  options: {
    data: {
      full_name: 'John Doe',
      profile_name: 'johndoe'
    },
    emailRedirectTo: `${window.location.origin}/auth/callback`
  }
});
```

### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@college.edu',
  password: 'password'
});
```

### Sign Out
```typescript
const { error } = await supabase.auth.signOut();
```

### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

### Reset Password
```typescript
const { error } = await supabase.auth.resetPasswordForEmail(
  'user@college.edu',
  { redirectTo: `${window.location.origin}/reset-password` }
);
```

---

## Row Level Security

### Common RLS Patterns

#### Owner-Only Access
```sql
CREATE POLICY "Users can view own records"
ON table_name FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own records"
ON table_name FOR UPDATE
USING (auth.uid() = user_id);
```

#### College-Based Access
```sql
CREATE POLICY "Users can view same college records"
ON table_name FOR SELECT
USING (college_id = get_current_user_college_id());
```

#### Admin Access
```sql
CREATE POLICY "Admins can view all"
ON table_name FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));
```

#### Public Read, Authenticated Write
```sql
CREATE POLICY "Anyone can view active items"
ON listings FOR SELECT
USING (status = 'active');

CREATE POLICY "Authenticated users can create"
ON listings FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
```

### RLS Policy Examples by Table

#### listings
```sql
-- Anyone can view active listings
CREATE POLICY "Anyone can view active listings"
ON listings FOR SELECT
USING (status = 'active');

-- Users can manage their own listings
CREATE POLICY "Users can insert own listings"
ON listings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own listings"
ON listings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own listings"
ON listings FOR DELETE
USING (auth.uid() = user_id);

-- Admins can view/update all
CREATE POLICY "Admins can view all listings"
ON listings FOR SELECT
USING (has_role(auth.uid(), 'admin'));
```

#### deals
```sql
-- Anyone can view active, non-expired deals
CREATE POLICY "Anyone can view active deals"
ON deals FOR SELECT
USING (
  is_active = true AND
  (valid_until IS NULL OR valid_until > now())
);

-- Admins can manage all deals
CREATE POLICY "Admins can manage deals"
ON deals FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Business users can manage their own deals
CREATE POLICY "Business users can create deals"
ON deals FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'business') AND
  auth.uid() = created_by
);
```

#### business_ads
```sql
-- Anyone can view approved, active ads
CREATE POLICY "Anyone can view approved ads"
ON business_ads FOR SELECT
USING (
  approval_status = 'approved' AND
  is_active = true AND
  (ends_at IS NULL OR ends_at > now())
);

-- Business users can view/manage own ads
CREATE POLICY "Business users can view own ads"
ON business_ads FOR SELECT
USING (
  business_id IN (
    SELECT id FROM business_profiles WHERE user_id = auth.uid()
  )
);

-- Admins can manage all ads
CREATE POLICY "Admins can manage all ads"
ON business_ads FOR ALL
USING (has_role(auth.uid(), 'admin'));
```

---

## API Examples

### Complete CRUD Operations

#### Create Listing
```typescript
const { data: listing, error } = await supabase
  .from('listings')
  .insert({
    user_id: user.id,
    college_id: user.college_id,
    title: 'MacBook Pro 2021',
    description: 'Excellent condition, barely used',
    price: 1200,
    category: 'marketplace',
    listing_type: 'offer',
    images: [imageUrl1, imageUrl2],
    location: 'West Campus',
    allow_meet_on_campus: true
  })
  .select()
  .single();
```

#### Read Listings
```typescript
// Get all active marketplace listings
const { data: listings, error } = await supabase
  .from('listings')
  .select(`
    *,
    profiles!inner(profile_name, avatar_url),
    listing_engagement(engagement_score, favorites_count)
  `)
  .eq('category', 'marketplace')
  .eq('status', 'active')
  .order('created_at', { ascending: false })
  .limit(20);
```

#### Update Listing
```typescript
const { error } = await supabase
  .from('listings')
  .update({
    price: 1100,
    description: 'Price reduced! Excellent condition'
  })
  .eq('id', listingId)
  .eq('user_id', user.id); // Ensure ownership
```

#### Delete Listing
```typescript
const { error } = await supabase
  .from('listings')
  .delete()
  .eq('id', listingId)
  .eq('user_id', user.id); // Ensure ownership
```

### Complex Queries

#### Search with Filters
```typescript
let query = supabase
  .from('listings')
  .select('*')
  .eq('status', 'active')
  .eq('college_id', collegeId);

// Add price filter
if (maxPrice) {
  query = query.lte('price', maxPrice);
}

// Add category filter
if (category) {
  query = query.eq('category', category);
}

// Add text search
if (searchTerm) {
  query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
}

// Sort
query = query.order('created_at', { ascending: false });

const { data, error } = await query;
```

#### Pagination
```typescript
const pageSize = 20;
const page = 1;

const { data, error, count } = await supabase
  .from('listings')
  .select('*', { count: 'exact' })
  .eq('status', 'active')
  .range(page * pageSize, (page + 1) * pageSize - 1);

const totalPages = Math.ceil(count / pageSize);
```

#### Realtime Subscription
```typescript
const channel = supabase
  .channel('new-listings')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'listings',
    filter: `college_id=eq.${collegeId}`
  }, (payload) => {
    console.log('New listing:', payload.new);
    // Update UI
  })
  .subscribe();

// Cleanup
return () => supabase.removeChannel(channel);
```

### Calling Edge Functions

#### With Streaming
```typescript
const response = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/campus-chatbot`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages: [...] })
  }
);

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const text = decoder.decode(value);
  // Process SSE data
}
```

#### Without Streaming
```typescript
const { data, error } = await supabase.functions.invoke('generate-description', {
  body: {
    title: 'MacBook Pro',
    category: 'marketplace',
    price: 1200
  }
});

if (error) {
  console.error('Error:', error.message);
} else {
  console.log('Generated:', data.description);
}
```

---

## Error Handling

### Common Error Codes

- `23505`: Unique constraint violation
- `23503`: Foreign key violation
- `23502`: Not null violation
- `42501`: Insufficient privileges
- `PGRST116`: No rows returned

### Error Handling Pattern
```typescript
try {
  const { data, error } = await supabase.from('table').select();
  
  if (error) {
    if (error.code === '23505') {
      throw new Error('Record already exists');
    }
    throw error;
  }
  
  return data;
} catch (error) {
  console.error('Database error:', error);
  // Show user-friendly message
}
```

---

**Last Updated**: 2025-06-10
**API Version**: 1.0.0
