-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('COUPON');

-- CreateEnum
CREATE TYPE "ValueType" AS ENUM ('STRING', 'IMAGE');

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "ProductType" NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "costPrice" DECIMAL(65,30) NOT NULL,
    "marginPercentage" DECIMAL(65,30) NOT NULL,
    "minimumSellPrice" DECIMAL(65,30) NOT NULL,
    "isSold" BOOLEAN NOT NULL DEFAULT false,
    "valueType" "ValueType" NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coupons_productId_key" ON "coupons"("productId");

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
