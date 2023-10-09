import { Router } from 'express';

const router = Router();

import couponController from '../controllers/couponController';
router
  .route('/')
  .get(couponController.getAllCoupons)
  .post(couponController.addCoupons);

router
  .route('/:id')
  .get(couponController.getSingleCoupon)
  .patch(couponController.updateCoupon)
  .delete(couponController.deleteCoupon);

export default router;
