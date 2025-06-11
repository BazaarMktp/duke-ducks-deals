
export type Listing = {
  id: string;
  title: string;
  description?: string;
  price?: number;
  category: 'marketplace' | 'housing' | 'services';
  images?: string[];
  user_id: string;
  created_at: string;
  featured: boolean;
  listing_type: 'offer' | 'wanted';
};

export type Profile = {
  id: string;
  profile_name?: string;
  full_name?: string;
};

export type Stats = {
  activeListings: number;
  totalUsers: number;
  totalDonations: number;
};

export type Category = {
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
};
