import { z } from 'zod';

const createCouponSchema = z.object({
  shop_id: z.number(),
  merchant_id: z.string(),
  transaction_id: z.number(),
  coupon_limit: z.number(),
  percentage: z.number(),
  coupon_code: z.string(),
  expiry_date: z.date(),
});
const updateCouponSchema = z.object({
  shop_id: z.number().optional(),
  merchant_id: z.string().optional(),
  transaction_id: z.number().optional(),
  coupon_limit: z.number().optional(),
  percentage: z.number().optional(),
  coupon_code: z.string().optional(),
  expiry_date: z.date().optional(),
});

export { createCouponSchema, updateCouponSchema };
