
export interface ServiceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  user_id: string;
  listing_type: 'offer' | 'wanted';
  featured?: boolean;
  profiles: {
    profile_name: string;
    full_name?: string;
  };
}
