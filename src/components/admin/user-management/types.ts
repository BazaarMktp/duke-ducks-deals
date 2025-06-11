
export interface User {
  id: string;
  email: string;
  profile_name: string;
  full_name: string;
  created_at: string;
  is_banned?: boolean;
  ban_reason?: string;
  banned_at?: string;
}
