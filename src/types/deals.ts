/**
 * Shared type definitions for Devil's Deals
 */

export interface Deal {
  id: string;
  title: string;
  description: string;
  discount_percentage?: number;
  original_price?: number;
  discounted_price?: number;
  business_name: string;
  image_url?: string;
  valid_until?: string;
  created_at: string;
  is_active: boolean;
  business_website?: string;
  business_phone?: string;
  business_email?: string;
  terms_and_conditions?: string;
}

export interface DealFormData {
  title: string;
  description: string;
  business_name: string;
  discount_percentage?: number;
  original_price?: number;
  discounted_price?: number;
  business_website?: string;
  business_phone?: string;
  business_email?: string;
  image_url?: string;
  terms_and_conditions?: string;
  valid_until?: string;
}

export interface BusinessAd {
  id: string;
  business_id: string;
  title: string;
  description: string;
  ad_type: 'banner' | 'sidebar' | 'popup' | 'featured';
  image_url?: string;
  video_url?: string;
  link_url?: string;
  display_priority: number;
  is_active: boolean;
  approval_status: 'pending' | 'approved' | 'rejected';
  impressions: number;
  clicks: number;
  starts_at: string;
  ends_at?: string;
  created_at: string;
}
