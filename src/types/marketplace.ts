
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
  open_to_negotiation?: boolean;
  profiles: {
    profile_name: string;
    avatar_url?: string;
    created_at: string;
    // Sensitive fields - only available for own profile or admin access
    email?: string;
    phone_number?: string;
    full_name?: string;
  };
}
