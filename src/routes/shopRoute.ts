import { Router } from 'express';

const router = Router();

import shopController from '../controllers/shopController';

router
  .route('/')
  .get(shopController.getAllShop)
  .post(shopController.addShop);

router
  .route('/:id')
  .get(shopController.deleteShop)
  .patch(shopController.updateShop)
  .delete(shopController.getSingleShop);

export default router;
