/*
  Warnings:

  - You are about to drop the column `product_id` on the `Shop` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "is_published" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Shop" DROP COLUMN "product_id";
