import { prisma } from "../utils/prisma";

export async function resellerPurchase(
  productId: string,
  resellerPrice: number
) {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: productId },
      include: { coupon: true },
    });

    if (!product || !product.coupon) {
      throw {
        status: 404,
        error_code: "PRODUCT_NOT_FOUND",
        message: "Product not found",
      };
    }

    if (product.coupon.isSold) {
      throw {
        status: 409,
        error_code: "PRODUCT_ALREADY_SOLD",
        message: "Product already sold",
      };
    }

    if (resellerPrice < Number(product.coupon.minimumSellPrice)) {
      throw {
        status: 400,
        error_code: "RESELLER_PRICE_TOO_LOW",
        message: "Reseller price below minimum",
      };
    }

    await tx.coupon.update({
      where: { productId },
      data: { isSold: true },
    });

    return {
      product_id: product.id,
      final_price: resellerPrice,
      value_type: product.coupon.valueType,
      value: product.coupon.value,
    };
  });
}