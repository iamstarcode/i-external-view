-- CreateEnum
CREATE TYPE "ADMIN_STATUS" AS ENUM ('PENDING', 'REVIEW', 'APPROVED', 'BLACKLIST');

-- CreateEnum
CREATE TYPE "RESTRICTED" AS ENUM ('NO', 'TEMPORARY', 'PERMANENT');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "shop_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" BIGINT NOT NULL,
    "category" INTEGER NOT NULL,
    "image_id" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discount_price" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,
    "admin_status" "ADMIN_STATUS" NOT NULL,
    "rating_id" INTEGER NOT NULL,
    "is_published" BOOLEAN NOT NULL,
    "currency" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shop" (
    "id" TEXT NOT NULL,
    "merchant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "policy_confirmation" BOOLEAN NOT NULL,
    "restricted" "RESTRICTED" NOT NULL,
    "admin_status" "ADMIN_STATUS" NOT NULL,
    "reviewed" BOOLEAN NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" SERIAL NOT NULL,
    "shop_id" TEXT NOT NULL,
    "merchant_id" TEXT NOT NULL,
    "transaction_id" INTEGER NOT NULL,
    "coupon_limit" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "coupon_code" TEXT NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
