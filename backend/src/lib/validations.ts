import { z } from 'zod'

export const seasonSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
})

export const badgeSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  color_hex: z.string().optional(),
  is_active: z.boolean().default(true),
})

export const regionSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  is_active: z.boolean().default(true),
})

export const productVariantSchema = z.object({
  variant_name: z.string().min(1),
  color_hex: z.string().optional(),
  image: z.string().optional(),
  sort_order: z.number().int().default(0),
})

export const productSchema = z.object({
  category_id: z.string().uuid(),
  season_id: z.string().uuid().optional(),
  name: z.string().min(1),
  product_code: z.string().min(1),
  description: z.string().optional(),
  materials: z.string().optional(),
  images: z.array(z.string()).min(1).max(4),
  is_active: z.boolean().default(true),
  badge_ids: z.array(z.string().uuid()).default([]),
  variants: z.array(productVariantSchema).default([]),
})

export const offerSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
  discount_percentage: z.number().min(0).max(100).optional(),
  original_price_note: z.string().optional(),
  valid_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  valid_until: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  is_active: z.boolean().default(true),
  region_ids: z.array(z.string().uuid()).default([]),
}).refine(data => new Date(data.valid_until) >= new Date(data.valid_from), {
  message: "valid_until must be greater than or equal to valid_from",
  path: ["valid_until"],
})

export const inquiryItemSchema = z.object({
  product_id: z.string().uuid(),
  product_name: z.string(),
  product_code: z.string(),
  quantity: z.number().int().min(1).default(1),
  notes: z.string().optional(),
})

export const inquirySchema = z.object({
  customer_name: z.string().min(1),
  company_name: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  country: z.string().optional(),
  message: z.string().optional(),
  items: z.array(inquiryItemSchema).default([]),
})
