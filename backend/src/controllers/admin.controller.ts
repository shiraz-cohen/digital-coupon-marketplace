import { Request, Response } from "express";
import { createCouponProduct } from "../services/admin.service";

// POST /api/v1/admin/products
export async function createProduct(req: Request, res: Response) {
  try {
    const { name, description, imageUrl, costPrice, marginPercentage, valueType, value } = req.body;

    // Basic validation
    if (!name || !description || !imageUrl || costPrice == null || marginPercentage == null || !valueType || !value) {
      return res.status(400).json({
        error_code: "MISSING_FIELDS",
        message: "All fields are required: name, description, imageUrl, costPrice, marginPercentage, valueType, value",
      });
    }

    // Prevent negative prices/margins
    if (costPrice < 0 || marginPercentage < 0) {
      return res.status(400).json({
        error_code: "INVALID_VALUES",
        message: "costPrice and marginPercentage must be >= 0",
      });
    }

    // Create the product using your service
    const product = await createCouponProduct({
      name,
      description,
      imageUrl,
      costPrice,
      marginPercentage,
      valueType,
      value,
    });

    // Don't return the actual coupon value for Admin creation if you want, or you can include it
    if (!product.coupon) {
  return res.status(500).json({
    error_code: "INTERNAL_ERROR",
    message: "Coupon was not created for the product",
  });
}

res.status(201).json({
  id: product.id,
  name: product.name,
  description: product.description,
  image_url: product.imageUrl,
  cost_price: product.coupon.costPrice,
  margin_percentage: product.coupon.marginPercentage,
  minimum_sell_price: product.coupon.minimumSellPrice,
  value_type: product.coupon.valueType,
});
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error_code: "INTERNAL_ERROR",
      message: "Something went wrong while creating the product",
    });
  }
}