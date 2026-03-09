import { prisma } from "../utils/prisma";
import { calculateMinimumSellPrice } from "./pricing.service";

export async function createCouponProduct(data: {
  name: string;
  description: string;
  imageUrl: string;
  costPrice: number;
  marginPercentage: number;
  valueType: "STRING" | "IMAGE";
  value: string;
}) {
  const minimumSellPrice = calculateMinimumSellPrice(
    data.costPrice,
    data.marginPercentage
  );

  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      type: "COUPON",
      imageUrl: data.imageUrl,
      coupon: {
        create: {
          costPrice: data.costPrice,
          marginPercentage: data.marginPercentage,
          minimumSellPrice,
          valueType: data.valueType,
          value: data.value,
        },
      },
    },
    include: {
      coupon: true,
    },
  });
}

export async function updateCouponProduct(
  productId: string,
  data: {
    name: string;
    description: string;
    imageUrl: string;
    costPrice: number;
    marginPercentage: number;
    valueType: "STRING" | "IMAGE";
    value: string;
  }
) {

  const minimumSellPrice = calculateMinimumSellPrice(
    data.costPrice,
    data.marginPercentage
  );

  return prisma.product.update({
    where: { id: productId },
    data: {
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      coupon: {
        update: {
          costPrice: data.costPrice,
          marginPercentage: data.marginPercentage,
          minimumSellPrice,
          valueType: data.valueType,
          value: data.value,
        },
      },
    },
    include: {
      coupon: true,
    },
  });
}