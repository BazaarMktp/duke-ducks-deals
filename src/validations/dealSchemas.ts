import { z } from 'zod';

/**
 * Shared validation schemas for Devil's Deals
 */

// Helper to normalize URLs - adds https:// if missing
const normalizeUrl = (url: string): string => {
  if (!url) return url;
  const trimmed = url.trim();
  if (trimmed && !trimmed.match(/^https?:\/\//i)) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

export const dealSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  business_name: z.string().min(1, 'Business name is required'),
  discount_percentage: z.number().min(0).max(100).optional(),
  original_price: z.number().min(0).optional(),
  discounted_price: z.number().min(0).optional(),
  business_website: z.string().optional().or(z.literal('')).transform(normalizeUrl).pipe(z.string().url().optional().or(z.literal(''))),
  business_phone: z.string().optional(),
  business_email: z.string().email().optional().or(z.literal('')),
  image_url: z.string().optional().or(z.literal('')).transform(normalizeUrl).pipe(z.string().url().optional().or(z.literal(''))),
  terms_and_conditions: z.string().optional(),
  valid_until: z.string().optional(),
});

export const businessAdSchema = z.object({
  business_name: z.string().min(2, 'Business name is required'),
  business_email: z.string().email('Valid email is required'),
  business_phone: z.string().optional(),
  business_website: z.string().optional().or(z.literal('')).transform(normalizeUrl).pipe(z.string().url('Must be a valid URL').optional().or(z.literal(''))),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  ad_type: z.enum(['banner', 'sidebar', 'featured']),
  image_url: z.string().min(1, 'Image is required').transform(normalizeUrl).pipe(z.string().url('Must be a valid image URL')),
  link_url: z.string().transform(normalizeUrl).pipe(z.string().url('Must be a valid URL')),
  starts_at: z.string().optional(),
  ends_at: z.string().optional(),
});

export type DealSchemaType = z.infer<typeof dealSchema>;
export type BusinessAdSchemaType = z.infer<typeof businessAdSchema>;