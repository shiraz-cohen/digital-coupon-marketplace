import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { ProductResponse } from "../types/product.types";

// GET /api/v1/products
export async function getAvailableProducts(req: Request, res: Response) {
  try {
    const products = await prisma.product.findMany({
      where: {
        coupon: {
          isSold: false,
        },
      },
      include: {
        coupon: true,
      },
    });

    const response: ProductResponse[] = products.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      image_url: p.imageUrl,
      price: p.coupon?.minimumSellPrice ?? null,
    }));

    res.json(response);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error_code: "INTERNAL_ERROR",
      message: "Something went wrong",
    });
  }
}

// GET /api/v1/products/:productId
export async function getProductById(req: Request, res: Response) {
  try {
    const { productId } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { coupon: true },
    });

    if (!product) {
      return res.status(404).json({
        error_code: "PRODUCT_NOT_FOUND",
        message: `Product with id ${productId} not found`,
      });
    }

    const response: ProductResponse = {
      id: product.id,
      name: product.name,
      description: product.description,
      image_url: product.imageUrl,
      price: product.coupon?.minimumSellPrice ?? null,
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error_code: "INTERNAL_ERROR",
      message: "Something went wrong",
    });
  }
}