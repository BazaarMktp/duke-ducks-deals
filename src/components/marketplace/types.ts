
export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  listing_type: 'offer' | 'wanted';
  featured: boolean;
  profiles: {
    profile_name: string;
    full_name?: string;
    avatar_url?: string;
    college_id?: string;
    is_verified?: boolean;
  } | null;
  created_at: string;
  user_id: string;
  status: string;
  category: string;
  allow_pickup?: boolean;
  allow_meet_on_campus?: boolean;
  sold_at?: string;
  sold_on_bazaar?: boolean;
}
