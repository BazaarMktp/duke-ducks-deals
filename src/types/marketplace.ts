
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  user_id: string;
  created_at: string;
  location?: string;
  allow_pickup?: boolean;
  allow_meet_on_campus?: boolean;
  listing_type?: string;
  profiles: {
    profile_name: string;
    email: string;
    phone_number?: string;
    avatar_url?: string;
    full_name?: string;
    created_at: string;
  };
}
