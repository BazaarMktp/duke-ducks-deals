
export interface Listing {
  id: string;
  title: string;
  category: string;
  listing_type: string;
  price: number;
  location: string;
  status: string;
  created_at: string;
  profiles: {
    profile_name: string;
    email: string;
  };
}
