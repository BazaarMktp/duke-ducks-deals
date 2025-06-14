
import { Database } from "@/integrations/supabase/types";

export type Badge = Pick<Database['public']['Tables']['user_badges']['Row'], 'badge_type' | 'created_at'>;
