
export interface MessageAttachment {
  url: string;
  type: 'image';
  name: string;
  size: number;
}

export interface Message {
  id: string;
  message: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
  likes?: string[]; // Array of user IDs who liked the message
  attachments?: MessageAttachment[];
  status?: 'pending' | 'sent' | 'failed'; // For optimistic updates
  profiles: {
    profile_name: string;
    avatar_url?: string;
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
  unread_count?: number;
  last_message_preview?: string;
  last_message_at?: string;
  listings: {
    title: string;
  } | null;
  buyer_profile: {
    profile_name: string;
    avatar_url?: string;
  };
  seller_profile: {
    profile_name: string;
    avatar_url?: string;
  };
}
