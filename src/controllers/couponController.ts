import { RequestHandler } from 'express';
import catchAsync from '../utils/catchAsync';
import prisma from '../models/db';
import { createCouponSchema, updateCouponSchema } from '../validations/coupon';
import AppError from '../utils/appError';

class CouponController {
    /**
    * @swagger
    * tags:
    *   name: coupons
    *   description: API endpoints for managing coupons
   */
    /**
 * @swagger
 * definitions:
 *   Coupon:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       shop_id:
 *         type: string
 *       merchant_id:
 *         type: string
 *       transaction_id:
 *         type: integer
 *       coupon_limit:
 *         type: integer
 *       percentage:
 *         type: number
 *       coupon_code:
 *         type: string
 *       expiry_date:
 *         type: string
 *         format: date-time
 *     required:
 *       - shop_id
 *       - merchant_id
 *       - transaction_id
 *       - coupon_limit
 *       - percentage
 *       - coupon_code
 *       - expiry_date
 * 
 */
    /**
   * @swagger
   * definitions:
   *   Create-Coupon:
   *     type: object
   *     properties:
   *       shop_id:
   *         type: string
   *       merchant_id:
   *         type: string
   *       transaction_id:
   *         type: integer
   *       coupon_limit:
   *         type: integer
   *       percentage:
   *         type: number
   *       coupon_code:
   *         type: string
   *       expiry_date:
   *         type: string
   *         format: date-time
   *     required:
   *       - shop_id
   *       - merchant_id
   *       - transaction_id
   *       - coupon_limit
   *       - percentage
   *       - coupon_code
   *       - expiry_date
   * 
   */




    /**
   * @swagger
   * /coupon:
   *   get:
   *     summary: Get all coupons
   *     tags: [coupons]
   *     responses:
   *       200:
   *         description: Successfully retrieved all coupons
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Coupon'
   *       404:
   *         description: No coupons found
   */
    getAllCoupons: RequestHandler = catchAsync(async (req, res, next) => {
        const currentDate = new Date();

        // Fetch valid coupons from the database where expiry_date is greater than or equal to the current date
        const validCoupons = await prisma.coupon.findMany({
            where: {
                expiry_date: {
                    gte: currentDate, // Filter coupons with expiry date greater than or equal to the current date
                },
            },
        });

        // Check if any valid coupons were found
        if (!validCoupons || validCoupons.length === 0) {
            return next(new AppError('No valid coupons found', 404));
        }

        res.status(200).json({ status: 'success', coupons: validCoupons });
    });
    /**
       * @swagger
       * /coupon/{id}:
       *   get:
       *     summary: Get a single coupon by ID
       *     tags: [coupons]
       *     parameters:
       *       - name: id
       *         in: path
       *         description: ID of the coupon to retrieve
       *         required: true
       *         type: integer
       *     responses:
       *       200:
       *         description: Successfully retrieved the coupon
       *         schema:
       *           $ref: '#/definitions/Coupon'
       *       404:
       *         description: Coupon not found
       */
    getSingleCoupon: RequestHandler = catchAsync(async (req, res, next): Promise<void> => {
        const { id } = req.params;
        const coupon = await prisma.coupon.findUnique({
            where: {
                id: parseInt(id, 10)
            }
        });

        if (!coupon) {
            return next(new AppError('Coupon not found', 404));

        }
        res.status(200).json({ coupon });
    });
    /**
     * @swagger
     * /coupon:
     *   post:
     *     summary: Add a new coupon
     *     tags: [coupons]
     *     requestBody:
     *       description: Coupon object to add
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/definitions/Coupon'
     *     responses:
     *       201:
     *         description: Coupon added successfully
     *         schema:
     *           $ref: '#/definitions/Coupon'
     *       400:
     *         description: Bad request
     */
    addCoupons: RequestHandler = catchAsync(async (req, res, next) => {
        const { body } = req;



        await createCouponSchema.parseAsync(body);

        try {
            const coupon = await prisma.coupon.create({ data: body });


            res.status(201).json({ message: 'coupon added successfully!!!', coupon });
        } catch (error) {
            res.status(404).json({ message: 'no shops found' });
        }
    });
    /**
* @swagger
* /coupon/{id}:
*   patch:
*     summary: Update a coupon by ID
*     tags: [coupons]
*     parameters:
*       - name: id
*         in: path
*         description: ID of the coupon to update
*         required: true
*         type: integer
*       - name: coupon
*         in: body
*         description: Updated coupon object
*         required: true
*         schema:
*           $ref: '#/definitions/Coupon'
*     responses:
*       200:
*         description: Coupon updated successfully
*         schema:
*           $ref: '#/definitions/Coupon'
*       400:
*         description: Failed to update coupon
*       404:
*         description: Coupon not found
*/
    updateCoupon: RequestHandler = catchAsync(async (req, res, next) => {
        try {

            const id = parseInt(req.params.id);
            const { body } = req;
            await updateCouponSchema.parseAsync(body);

            // Find coupon by ID
            const existingCoupon = await prisma.coupon.findUnique({ where: { id } });

            if (!existingCoupon) {
                res.status(404).json({ message: 'Coupon not found' });
            }
            else {



                const updatedCoupon = await prisma.coupon.update({
                    where: { id },
                    data: {
                        ...existingCoupon,
                        ...body,
                    },
                });

                res.status(200).json({ message: 'Coupon updated successfully', updatedCoupon });
            }
        } catch (error) {
            res.status(400).json({ error: 'Failed to update coupon' });
        }
    });

    /**
       * @swagger
       * /coupon/{id}:
       *   delete:
       *     summary: Delete a coupon by ID
       *     tags: [coupons]
       *     parameters:
       *       - name: id
       *         in: path
       *         description: ID of the coupon to delete
       *         required: true
       *         type: integer
       *     responses:
       *       204:
       *         description: Coupon deleted successfully
       *       404:
       *         description: Coupon not found
       */

    /**
 * Deletes a specific coupon by its unique identifier (ID).
 *
 * @function
 * @async
 * @name deleteCoupon
 * @memberof CouponController
 * @param {import('express').Request} req - The Express Request object.
 * @param {import('express').Response} res - The Express Response object.
 * @param {import('express').NextFunction} next - The Express NextFunction middleware.
 * @throws {Error} If there is an issue with the delete operation.
 * @returns {Promise<void>} A JSON response indicating the result of the delete operation.
 *
 * @example
 * // Example usage in an Express route:
 * router.delete('/coupons/:id', couponController.deleteCoupon);
 */
    deleteCoupon: RequestHandler = catchAsync(async (req, res, next) => {
        try {
            const { id } = req.params;

            // Use Prisma to delete the coupon by ID
            const deletedCoupon = await prisma.coupon.delete({
                where: {
                    id: parseInt(id, 10), // Parse the ID to an integer
                },
            });

            if (!deletedCoupon) {
                return next(new AppError('Coupon not found', 404));
            }

            res.status(204).json(); // Send a 204 No Content response for successful deletion
        } catch (error) {
            next(error); // Pass the error to the global error handler
        }
    });


}

const couponController = new CouponController();
export default couponController;
