
import { string, z } from 'zod';


export const createShopSchema = z.object({
  merchant_id: z.string(),
  name: z.string(),
  policy_confirmation: z.boolean(),
  restricted: z.string(),
  admin_status: z.string(),
  reviewed: z.boolean(),
  rating: z.number().positive(),
});

export const updateShopSchema = z.object({
  merchant_id: z.string().optional(),
  name: z.string().optional(),
  policy_confirmation: z.boolean().optional(),
  restricted: z.enum(['NO', 'TEMPORARY', 'PERMANENT']).optional(),
  admin_status: z.enum(['PENDING', 'REVIEW', 'APPROVED', 'BLACKLIST']).optional(),
  reviewed: z.boolean().optional(),
  rating: z.number().positive().optional(),
});

