import { prisma } from "../utils/prisma";
import { ProductResponse } from "../types/product.types";

// GET /api/v1/products (Reseller)
// GET /api/v1/customer/products (Customer)
export async function fetchAvailableProducts(): Promise<ProductResponse[]> {
  const products = await prisma.product.findMany({
    where: { coupon: { isSold: false } },
    include: { coupon: true },
  });

  return products.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    image_url: p.imageUrl,
    price: p.coupon?.minimumSellPrice ? Number(p.coupon.minimumSellPrice) : null,
  }));
}

// GET /api/v1/products/:productId
// GET /api/v1/customer/products/:productId
export async function fetchProductById(productId: string): Promise<ProductResponse | null> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { coupon: true },
  });

  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    image_url: product.imageUrl,
    price: product.coupon?.minimumSellPrice ? Number(product.coupon.minimumSellPrice) : null,
  };
}

// POST /api/v1/products/:productId/purchase
// POST /api/v1/customer/products/:productId/purchase
export async function processPurchase(productId: string, price: number) {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: productId },
      include: { coupon: true },
    });

    if (!product || !product.coupon) throw { status: 404, error_code: "PRODUCT_NOT_FOUND", message: "Not found" };
    if (product.coupon.isSold) throw { status: 409, error_code: "PRODUCT_ALREADY_SOLD", message: "Sold" };

    if (price < Number(product.coupon.minimumSellPrice)) {
      throw { status: 400, error_code: "RESELLER_PRICE_TOO_LOW", message: "Price too low" };
    }

    await tx.coupon.update({ where: { productId }, data: { isSold: true } });

    return {
      product_id: product.id,
      final_price: price,
      value_type: product.coupon.valueType,
      value: product.coupon.value,
    };
  });
}