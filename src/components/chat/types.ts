
export interface Message {
  id: string;
  message: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
  profiles: {
    profile_name: string;
    user_roles: Array<{
      role: string;
    }>;
  };
}

export interface Conversation {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string;
  archived_by_buyer: boolean;
  archived_by_seller: boolean;
  deleted_by_buyer: boolean;
  deleted_by_seller: boolean;
  listings: {
    title: string;
  };
  buyer_profile: {
    profile_name: string;
  };
  seller_profile: {
    profile_name: string;
  };
}
