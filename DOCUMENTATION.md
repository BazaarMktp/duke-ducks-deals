# Bazaar - Campus Marketplace Platform

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Frontend Documentation](#frontend-documentation)
4. [Backend Documentation](#backend-documentation)
5. [Database Schema](#database-schema)
6. [API Reference](#api-reference)
7. [Security](#security)
8. [Deployment](#deployment)

---

## Overview

Bazaar is a comprehensive campus marketplace platform designed for college students to buy, sell, and exchange goods and services within their campus community. The platform includes features for marketplace listings, housing, services, deals, roommate matching, and more.

### Key Features
- **Marketplace**: Buy and sell items within campus
- **Housing**: Find and list housing options
- **Services**: Offer or request services
- **Devil's Deals**: Exclusive deals and promotions for students
- **Business Portal**: Businesses can create deals and upload promotional ads
- **Roommate Finder**: AI-powered roommate matching
- **Campus Life**: Campus events and activities
- **Messaging**: Real-time chat between users
- **Gamification**: Points, levels, achievements, and leaderboards
- **AI Features**: Smart recommendations, listing optimization, chatbot

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL, Edge Functions)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **AI**: Lovable AI (Google Gemini, OpenAI GPT)
- **Mobile**: Capacitor (for native features)

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Pages     │  │  Components  │  │  Hooks & Utils   │   │
│  │  - Home     │  │  - UI        │  │  - Custom Hooks  │   │
│  │  - Market   │  │  - Auth      │  │  - Utilities     │   │
│  │  - Housing  │  │  - Admin     │  │  - Contexts      │   │
│  │  - Deals    │  │  - Deals     │  │                  │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Supabase Backend Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  PostgreSQL  │  │ Edge Functions│  │  Storage         │  │
│  │  Database    │  │  - AI         │  │  - Images        │  │
│  │  - RLS       │  │  - Chatbot    │  │  - Attachments   │  │
│  │  - Triggers  │  │  - Analytics  │  │                  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │ Realtime     │  │  Auth        │                         │
│  │ Subscriptions│  │  - Email     │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  External Services                           │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │  Lovable AI  │  │  Capacitor   │                         │
│  │  - Gemini    │  │  - Camera    │                         │
│  │  - GPT       │  │  - Storage   │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Interaction** → React Components
2. **State Management** → React Query + Contexts
3. **API Calls** → Supabase Client
4. **Authentication** → Supabase Auth with RLS
5. **Business Logic** → Edge Functions
6. **Data Storage** → PostgreSQL + Storage
7. **Real-time Updates** → Supabase Realtime

---

## Frontend Documentation

### Project Structure

```
src/
├── assets/              # Static assets (images, etc.)
├── components/          # Reusable React components
│   ├── ui/             # shadcn/ui components
│   ├── admin/          # Admin-specific components
│   ├── auth/           # Authentication components
│   ├── deals/          # Devil's Deals components
│   ├── business/       # Business portal components
│   ├── chat/           # Messaging components
│   ├── listings/       # Listing-related components
│   ├── marketplace/    # Marketplace components
│   ├── services/       # Services components
│   ├── housing/        # Housing components
│   ├── ai/             # AI-powered components
│   └── ...
├── contexts/           # React Context providers
│   ├── AuthContext.tsx
│   └── AdminContext.tsx
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   ├── useMarketplace.ts
│   ├── useChat.ts
│   └── ...
├── pages/              # Page components (routes)
│   ├── Home.tsx
│   ├── Marketplace.tsx
│   ├── DevilsDeals.tsx
│   ├── BusinessOnboarding.tsx
│   ├── BusinessDashboard.tsx
│   └── ...
├── utils/              # Utility functions
│   ├── imageUtils.ts
│   ├── timeUtils.ts
│   └── ...
├── integrations/       # Third-party integrations
│   └── supabase/
│       ├── client.ts
│       └── types.ts
├── App.tsx            # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

### Key Components

#### Authentication
- **AuthContext**: Manages user authentication state globally
- **LoginForm**: Email/password login
- **SignupForm**: User registration with email verification
- **CollegeSelector**: College domain-based registration
- **ProtectedRoute**: Route wrapper requiring authentication

#### Marketplace
- **MarketplaceGrid**: Displays listings in a grid layout
- **MarketplaceItemCard**: Individual listing card
- **MarketplaceFilters**: Search and filter controls
- **ProductActions**: Buy, favorite, contact seller
- **ProductImageGallery**: Image carousel for listings

#### Devil's Deals
- **DealCard**: Individual deal display
- **DealCreateDialog**: Admin form to create deals
- **DealEditDialog**: Admin form to edit deals
- **PromoAdsDisplay**: Business promotional ads
- **EmptyDealsState**: Placeholder when no deals exist

#### Business Portal
- **BusinessOnboarding**: Business registration form
- **BusinessDashboard**: Business analytics and management
- **BusinessAdUpload**: Ad creation form
- **BusinessAdsList**: List of submitted ads
- **BusinessDealsList**: List of business deals

#### Messaging
- **MessagePanel**: Chat interface
- **ConversationList**: List of conversations
- **MessageBubble**: Individual message display
- **MessageInput**: Message composition

#### AI Components
- **AIRecommendations**: Personalized listing recommendations
- **CampusChatbot**: Campus assistant chatbot
- **ListingOptimizer**: AI-powered listing improvements
- **PriceSuggestion**: Smart pricing recommendations

### State Management

#### React Query
Used for server state management (API calls, caching):
```typescript
const { data: listings, isLoading } = useQuery({
  queryKey: ['listings'],
  queryFn: async () => {
    const { data } = await supabase.from('listings').select('*');
    return data;
  }
});
```

#### Context API
Used for global app state:
- **AuthContext**: Current user, authentication status
- **AdminContext**: Admin role checking

### Routing

Routes defined in `App.tsx`:
- `/` - Home/Index page
- `/marketplace` - Marketplace listings
- `/housing` - Housing listings
- `/services` - Services listings
- `/devils-deals` - Deals page
- `/business-onboarding` - Business registration
- `/business-dashboard` - Business management
- `/messages` - Chat (protected)
- `/profile` - User profile (protected)
- `/admin` - Admin dashboard (protected, admin only)
- And more...

### Styling System

#### Tailwind CSS + Design Tokens
All colors use HSL design tokens defined in `index.css`:
```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... more tokens */
}
```

#### Component Variants
shadcn/ui components use `class-variance-authority`:
```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border border-input",
        // ...
      }
    }
  }
);
```

---

## Backend Documentation

### Database Architecture

#### Supabase PostgreSQL Schema

**Core Tables:**
- `profiles` - User profiles (extends auth.users)
- `colleges` - College/university information
- `user_roles` - User role assignments (user, admin, business)
- `listings` - Marketplace/housing/service listings
- `conversations` - Message conversations
- `messages` - Chat messages
- `deals` - Devil's Deals
- `business_profiles` - Business account information
- `business_ads` - Business promotional ads
- `favorites` - User favorites
- `reports` - Content reports

**Gamification Tables:**
- `user_levels` - User XP and levels
- `achievements` - Available achievements
- `user_achievements` - Earned achievements
- `challenges` - Active challenges
- `leaderboard_entries` - Leaderboard data

**Additional Tables:**
- `donations` - Donation requests
- `support_tickets` - User support
- `roommate_preferences` - Roommate finder
- `campus_events` - Campus activities
- `ai_interactions` - AI usage tracking
- And more...

### Row Level Security (RLS)

All tables have RLS enabled with specific policies:

**Example: listings table**
```sql
-- Users can view active listings
CREATE POLICY "Anyone can view active listings"
ON listings FOR SELECT
USING (status = 'active');

-- Users can manage their own listings
CREATE POLICY "Users can insert their own listings"
ON listings FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

**Role-Based Access:**
```sql
-- Admin access
CREATE POLICY "Admins can view all"
ON table_name FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));
```

### Edge Functions

Located in `supabase/functions/`:

#### AI Functions
- **analyze-listing-content**: Content moderation
- **campus-chatbot**: Campus assistant
- **generate-description**: AI listing descriptions
- **listing-assistant**: Listing optimization
- **personalized-recommendations**: User recommendations
- **price-intelligence**: Smart pricing
- **smart-messaging**: Message suggestions
- **visual-search**: Image-based search

#### Utility Functions
- **auto-feature-listings**: Automatic listing promotion
- **calculate-compatibility**: Roommate matching
- **enhanced-search**: Advanced search
- **moderate-content**: Content moderation
- **send-achievement-notification**: Achievement emails
- **send-message-notification**: Message notifications

#### Example Edge Function Structure
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { param } = await req.json();
    
    // Business logic here
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### Database Functions

Key PostgreSQL functions:

- `has_role(user_id, role)` - Check user role
- `get_current_user_college_id()` - Get user's college
- `add_user_xp(user_id, xp, points)` - Award XP/points
- `auto_feature_desirable_listings()` - Auto-promote listings
- `update_listing_engagement(listing_id)` - Track engagement
- `calculate_engagement_score()` - Engagement metrics

### Storage Buckets

- **listing-images**: Product images (public)
- **profile-pictures**: User avatars (public)
- **message-attachments**: Chat attachments (public)

Storage policies control access based on user_id.

---

## Database Schema

### Core Entities

#### Users & Authentication
```sql
-- Extends auth.users
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  profile_name text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  college_id uuid REFERENCES colleges NOT NULL,
  is_verified boolean DEFAULT false,
  points integer DEFAULT 0,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE user_roles (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  role app_role NOT NULL, -- enum: 'user', 'admin', 'business'
  UNIQUE(user_id, role)
);
```

#### Listings
```sql
CREATE TABLE listings (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  college_id uuid REFERENCES colleges NOT NULL,
  title text NOT NULL,
  description text,
  price numeric,
  category listing_category NOT NULL, -- marketplace, housing, services
  listing_type listing_type DEFAULT 'offer', -- offer, wanted
  images text[],
  location text,
  status listing_status DEFAULT 'active',
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### Business System
```sql
CREATE TABLE business_profiles (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users UNIQUE NOT NULL,
  business_name text NOT NULL,
  business_description text,
  business_website text,
  business_email text,
  business_phone text,
  business_logo_url text,
  is_verified boolean DEFAULT false,
  verification_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE business_ads (
  id uuid PRIMARY KEY,
  business_id uuid REFERENCES business_profiles NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  ad_type text DEFAULT 'banner',
  image_url text,
  link_url text,
  approval_status text DEFAULT 'pending',
  is_active boolean DEFAULT false,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  starts_at timestamptz DEFAULT now(),
  ends_at timestamptz,
  created_at timestamptz DEFAULT now()
);
```

#### Deals
```sql
CREATE TABLE deals (
  id uuid PRIMARY KEY,
  created_by uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  business_name text NOT NULL,
  discount_percentage integer,
  original_price numeric,
  discounted_price numeric,
  image_url text,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
```

### Relationships

```
colleges (1) ─────── (many) profiles
profiles (1) ─────── (many) listings
profiles (1) ─────── (many) conversations
conversations (1) ── (many) messages
profiles (1) ─────── (many) business_profiles
business_profiles (1) ─ (many) business_ads
business_profiles (1) ─ (many) deals (via created_by)
```

---

## API Reference

### Supabase Client Usage

#### Query Data
```typescript
const { data, error } = await supabase
  .from('listings')
  .select('*, profiles(profile_name, avatar_url)')
  .eq('status', 'active')
  .order('created_at', { ascending: false });
```

#### Insert Data
```typescript
const { data, error } = await supabase
  .from('listings')
  .insert({
    user_id: user.id,
    title: 'Item Title',
    description: 'Item description',
    price: 50,
    category: 'marketplace'
  })
  .select()
  .single();
```

#### Update Data
```typescript
const { error } = await supabase
  .from('listings')
  .update({ status: 'sold' })
  .eq('id', listingId);
```

#### Upload File
```typescript
const { data, error } = await supabase.storage
  .from('listing-images')
  .upload(`${userId}/${filename}`, file);

const publicUrl = supabase.storage
  .from('listing-images')
  .getPublicUrl(data.path).data.publicUrl;
```

#### Call Edge Function
```typescript
const { data, error } = await supabase.functions.invoke('function-name', {
  body: { param: 'value' }
});
```

#### Realtime Subscriptions
```typescript
const channel = supabase
  .channel('messages')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `conversation_id=eq.${conversationId}`
  }, (payload) => {
    console.log('New message:', payload.new);
  })
  .subscribe();

// Cleanup
return () => supabase.removeChannel(channel);
```

---

## Security

### Authentication Flow

1. User signs up with email
2. Email verification sent
3. User confirms email
4. Profile created with college_id based on email domain
5. Role assigned (default: 'user')

### Row Level Security (RLS)

**Key Principles:**
- All tables have RLS enabled
- Policies check `auth.uid()` for user identification
- Admin access via `has_role(auth.uid(), 'admin')`
- College-based isolation via `college_id` checks

**Example Policies:**
```sql
-- Users can only see profiles from their college
CREATE POLICY "Users can view same college profiles"
ON profiles FOR SELECT
USING (college_id = get_current_user_college_id());

-- Users can only edit their own listings
CREATE POLICY "Users can update own listings"
ON listings FOR UPDATE
USING (auth.uid() = user_id);
```

### Content Security
- Input sanitization via Zod schemas
- XSS prevention through React's built-in escaping
- SQL injection prevented by parameterized queries
- File upload validation (size, type)
- AI-powered content moderation

---

## Deployment

### Environment Variables

**Frontend (.env):**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

**Backend (Supabase Secrets):**
- `LOVABLE_API_KEY` - AI gateway access
- `OPENAI_API_KEY` - OpenAI (if used)
- `RESEND_API_KEY` - Email notifications
- `SUPABASE_SERVICE_ROLE_KEY` - Backend operations
- `SUPABASE_URL` - Supabase project URL

### Build & Deploy

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Supabase Deployment

Edge functions deploy automatically when migrations are run. Database changes are applied via:
```sql
-- Run migration
-- Changes are tracked in supabase_migrations.schema_migrations
```

### Mobile App (Capacitor)

```bash
# Build web assets
npm run build

# Sync with native platforms
npx cap sync

# Open in IDE
npx cap open ios
npx cap open android
```

---

## Performance Optimization

### Frontend
- Code splitting via React.lazy()
- Image optimization with OptimizedImage component
- Lazy loading for images
- React Query caching (5-minute default)
- Debounced search inputs
- Virtual scrolling for long lists

### Backend
- Database indexes on frequently queried columns
- Materialized views for complex queries
- Edge function response caching
- Connection pooling
- Efficient RLS policies

### Monitoring
- Performance metrics tracked via `performance_metrics` table
- Image load times via `image_performance_metrics`
- User engagement via `user_engagement_events`

---

## Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint + Prettier for formatting
- Component naming: PascalCase
- File naming: kebab-case or PascalCase
- Hooks naming: use + PascalCase

### Component Structure
```typescript
// 1. Imports
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Types
interface Props {
  // ...
}

// 3. Component
export const Component: React.FC<Props> = ({ prop }) => {
  // 4. Hooks
  const { data } = useQuery(...);
  
  // 5. Event handlers
  const handleClick = () => {};
  
  // 6. Render
  return <div>...</div>;
};
```

### Git Workflow
- Feature branches from main
- PR reviews required
- Semantic commit messages
- Automated testing before merge

---

## Troubleshooting

### Common Issues

**Build Errors:**
- Clear node_modules and reinstall
- Check TypeScript errors in IDE
- Verify import paths

**Database Issues:**
- Check RLS policies
- Verify user authentication
- Review Supabase logs

**Performance:**
- Check React Query devtools
- Monitor network requests
- Review console for warnings

**AI Features:**
- Verify LOVABLE_API_KEY is set
- Check rate limits (429 errors)
- Monitor AI usage in Supabase dashboard

---

## Support & Resources

- **Documentation**: https://docs.lovable.dev
- **Supabase Docs**: https://supabase.com/docs
- **React Query Docs**: https://tanstack.com/query
- **Tailwind CSS**: https://tailwindcss.com
- **shadcn/ui**: https://ui.shadcn.com

---

**Last Updated**: 2025-06-10
**Version**: 1.0.0
