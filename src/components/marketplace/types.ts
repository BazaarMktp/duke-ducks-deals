
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
  } | null;
  created_at: string;
  user_id: string;
  status: string;
  category: string;
  allow_pickup?: boolean;
  allow_meet_on_campus?: boolean;
}
