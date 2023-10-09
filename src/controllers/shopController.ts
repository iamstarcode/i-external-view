import { RequestHandler } from 'express';
import catchAsync from '../utils/catchAsync';
import prisma from '../models/db';
import AppError from '../utils/appError';

import { createShopSchema, updateShopSchema } from '../validations/shop';

class ShopController {
  /**
   * @swagger
   * tags:
   *   name: shops
   *   description: API endpoints for managing shops
   */

  /**
   * @swagger
   * definitions:
   *   Shop:
   *     type: object
   *     properties:
   *       id:
   *         type: string
   *       merchant_id:
   *         type: string
   *       name:
   *         type: string
   *       policy_confirmation:
   *         type: boolean
   *       restricted:
   *         type: string
   *         enum: [NO, TEMPORARY, PERMANENT]
   *       admin_status:
   *         type: string
   *         enum: [PENDING, REVIEW, APPROVED, BLACKLIST]
   *       reviewed:
   *         type: boolean
   *       rating:
   *         type: number
   *     required:
   *       - merchant_id
   *       - name
   *       - policy_confirmation
   *       - restricted
   *       - admin_status
   *       - reviewed
   *       - rating
   */

  /**
   * @swagger
   * /shop:
   *   get:
   *     summary: Get all shops
   *     tags: [shops]
   *     responses:
   *       200:
   *         description: Successfully retrieved all shops
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Shop'
   *       404:
   *         description: No shops found
   */
  getAllShop: RequestHandler = catchAsync(async (req, res, next) => {
    const shops = await prisma.shop.findMany();

    if (!shops || shops.length < 1) {
      return next(new AppError('No shop found', 404));
    }
    res.status(200).json({ status: 'success', shops });
  });

  /**
   * @swagger
   * /shop/{id}:
   *   get:
   *     summary: Get a single shop by ID
   *     tags: [shops]
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID of the shop to retrieve
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: Successfully retrieved the shop
   *         schema:
   *           $ref: '#/definitions/Shop'
   *       404:
   *         description: Shop not found
   */
  getSingleShop: RequestHandler = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const shop = await prisma.shop.findUnique({
      where: { id },
    });

    if (!shop) {
      return next(new AppError('No shop found with that ID', 404));
    }

    res.status(200).json({ status: 'success', shop });
  });
  /**
   * @swagger
   * /shop:
   *   post:
   *     summary: Add a new shop
   *     tags: [shops]
   *     requestBody:
   *       description: Shop object to add
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/Shop'
   *     responses:
   *       201:
   *         description: Shop added successfully
   *         schema:
   *           $ref: '#/definitions/Shop'
   *       400:
   *         description: Bad request
   */
  addShop: RequestHandler = catchAsync(async (req, res, next) => {
    const { body } = req;
    await createShopSchema.parseAsync(body);

    const shop = await prisma.shop.create({ data: body });

    if (!shop) {
      return next(new AppError('Shop not created', 400));
    }

    res.status(201).json({ status: 'success', shop });
  });
  /**
   * @swagger
   * /shop/{id}:
   *   patch:
   *     summary: Update a shop by ID
   *     tags: [shops]
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID of the shop to update
   *         required: true
   *         type: string
   *     requestBody:
   *       description: Updated shop object
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/Shop'
   *     responses:
   *       200:
   *         description: Shop updated successfully
   *         schema:
   *           $ref: '#/definitions/Shop'
   *       400:
   *         description: Bad request
   *       404:
   *         description: Shop not found
   */
  updateShop: RequestHandler = catchAsync(async (req, res, next) => {
    const { body } = req;
    const { id } = req.params;

    try {
      await updateShopSchema.safeParseAsync(body);

      // Find shop by ID
      const existingShop = await prisma.shop.findUnique({ where: { id } });

      if (!existingShop) {
        res.status(404).json({ message: 'Shop not found' });
      } else {
        const updatedCoupon = await prisma.shop.update({
          where: { id },
          data: {
            ...body,
          },
        });

        res
          .status(200)
          .json({ message: 'Shop updated successfully', updatedCoupon });
      }
    } catch (error) {}
  });

  /**
   * @swagger
   * /shop/{id}:
   *   delete:
   *     summary: Delete a shop by ID
   *     tags: [shops]
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID of the shop to delete
   *         required: true
   *         type: string
   *     responses:
   *       204:
   *         description: Shop deleted successfully
   *       404:
   *         description: Shop not found
   */

  /**
   * Deletes a specific shop by its unique identifier (ID).
   *
   * @function
   * @async
   * @name deleteShop
   * @memberof ShopController
   * @param {import('express').Request} req - The Express Request object.
   * @param {import('express').Response} res - The Express Response object.
   * @param {import('express').NextFunction} next - The Express NextFunction middleware.
   * @throws {Error} If there is an issue with the delete operation.
   * @returns {Promise<void>} A JSON response with the deleted shop's information or an error message.
   *
   * @example
   * // Example usage in an Express route:
   * router.delete('/shops/:id', shopController.deleteShop);
   */
  deleteShop: RequestHandler = catchAsync(async (req, res, next) => {
    try {
      const { id } = req.params;

      // Use Prisma to find and delete the shop by ID
      const deletedShop = await prisma.shop.delete({
        where: { id },
      });

      if (!deletedShop) {
        res.status(404).json({ message: 'Shop not found' });
      } else {
        res.status(200).json(deletedShop); // Send the deleted shop's information
      }
    } catch (error) {
      next(error); // Pass the error to the global error handler
    }
  });
}

const shopController = new ShopController();
export default shopController;
