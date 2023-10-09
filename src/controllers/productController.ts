import { RequestHandler } from 'express';
import catchAsync from '../utils/catchAsync';
import {
  createProductSchema,
  updateProductSchema,
} from '../validations/product';
import prisma from '../models/db';
import AppError from '../utils/appError';

class ProductController {

  /**
  * @swagger
  * tags:
  *   name: products
  *   description: API endpoints for managing products
  */

  /**
 * @swagger
 * definitions:
 *   Product:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       user_id:
 *         type: string
 *       shop_id:
 *         type: string
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       quantity:
 *         type: integer
 *       category:
 *         type: integer
 *       image_id:
 *         type: integer
 *       price:
 *         type: number
 *       discount_price:
 *         type: number
 *       tax:
 *         type: number
 *       admin_status:
 *         type: string
 *       rating_id:
 *         type: integer
 *       currency:
 *         type: string
 *     required:
 *       - user_id
 *       - shop_id
 *       - name
 *       - description
 *       - quantity
 *       - category
 *       - image_id
 *       - price
 *       - discount_price
 *       - tax
 *       - admin_status
 *       - rating_id
 *       - currency
 */

  /**
   * @swagger
   * /products:
   *   get:
   *     summary: Get all products
   *     tags: [products]
   *     responses:
   *       200:
   *         description: Successfully retrieved all products
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Product'
   *       404:
   *         description: No products found
   */
  getAllProducts: RequestHandler = catchAsync(async (req, res, next) => {
    const products = await prisma.product.findMany();

    if (!products) {
      return next(new AppError('No Products not found', 404));
    }

    res.status(200).json({ status: 'success', products });
  });

  /**
  * @swagger
  * /products/{id}:
  *   get:
  *     summary: Get a single product by ID
  *     tags: [products]
  *     parameters:
  *       - name: id
  *         in: path
  *         description: ID of the product to retrieve
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: Successfully retrieved the product
  *         schema:
  *           $ref: '#/definitions/Product'
  *       404:
  *         description: Product not found
  */
  getSingleProduct: RequestHandler = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({ status: 'success', product });
  });

  /**
  * @swagger
  * /products:
  *   post:
  *     summary: Add a new product
  *     tags: [products]
  *     parameters:
  *       - name: product
  *         in: body
  *         description: New product object to add
  *         required: true
  *         schema:
  *           $ref: '#/definitions/Product'
  *     responses:
  *       201:
  *         description: Product added successfully
  *         schema:
  *           $ref: '#/definitions/Product'
  *       400:
  *         description: Failed to add product
  */
  addProducts: RequestHandler = catchAsync(async (req, res, next) => {
    const { body } = req;

    await createProductSchema.parseAsync(body);

    const product = await prisma.product.create({ data: body });

    if (!product) {
      return next(new AppError('Product not created', 400));
    }
    res.status(201).json({ status: 'success', product });
  });

  /**
   * @swagger
   * /products/{id}:
   *   patch:
   *     summary: Update a product by ID
   *     tags: [products]
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID of the product to update
   *         required: true
   *         type: string
   *       - name: product
   *         in: body
   *         description: Updated product object
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Product'
   *     responses:
   *       200:
   *         description: Product updated successfully
   *         schema:
   *           $ref: '#/definitions/Product'
   *       400:
   *         description: Failed to update product
   *       404:
   *         description: Product not found
   */
  updateProduct: RequestHandler = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await updateProductSchema.parseAsync(req.body);

    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data: req.body,
    });

    if (!product) {
      return next(new AppError('This product was not found', 404));
    }

    res.status(201).json({ status: 'success', product });
  });
  /**
    * @swagger
    * /products/{id}:
    *   delete:
    *     summary: Delete a product by ID
    *     tags: [products]
    *     parameters:
    *       - name: id
    *         in: path
    *         description: ID of the product to delete
    *         required: true
    *         type: string
    *     responses:
    *       204:
    *         description: Product deleted successfully
    *       404:
    *         description: Product not found
    */
  deleteProduct: RequestHandler = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await prisma.product.delete({
      where: {
        id,
      },
    });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(204).json({ status: 'success' });
  });
}

const productController = new ProductController();
export default productController;
