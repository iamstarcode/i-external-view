import { string, z } from 'zod';

export const createProductSchema = z.object({
  shop_id: string(),
  name: z.string(),
  description: z.string().min(3),
  quantity: z.number(),
  category_id: z.number(),
  price: z.number().positive(),
  discount_price: z.number().positive(),
  tax: z.number().positive(),
  admin_status: z.string(),
  is_deleted: z.string(),
  rating_id: z.number().positive(),
  is_published: z.boolean(),
  currency: z.string(),
});

export const updateProductSchema = z.object({
  user_id: z.string().optional(),
  shop_id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().min(3).optional(),
  quantity: z.number().optional(),
  category: z.number().optional(),
  image_id: z.number().optional(),
  price: z.number().positive().optional(),
  discount_price: z.number().positive().optional(),
  tax: z.number().positive().optional(),
  admin_status: z.string().optional(),
  rating_id: z.number().positive().optional(),
  currency: z.string().optional(),
});
