import { Router } from 'express';

const router = Router();

import productController from '../controllers/productController';

router
  .route('/')
  .get(productController.getAllProducts)
  .post(productController.addProducts);

router
  .route('/:id')
  .get(productController.getSingleProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

export default router;
