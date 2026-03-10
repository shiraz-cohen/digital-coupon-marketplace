import { Request, Response } from "express";
import { createCouponProduct, updateCouponProduct, deleteCouponProduct ,getAllProducts ,getProductById } from "../services/admin.service";

// POST /api/v1/admin/products
export async function createProduct(req: Request, res: Response) {
  try {
    const { name, description, imageUrl, costPrice, marginPercentage, valueType, value } = req.body;

    if (!name || !description || !imageUrl || costPrice == null || marginPercentage == null || !valueType || !value) {
      return res.status(400).json({
        error_code: "MISSING_FIELDS",
        message: "All fields are required: name, description, imageUrl, costPrice, marginPercentage, valueType, value",
      });
    }

    if (costPrice < 0 || marginPercentage < 0) {
      return res.status(400).json({
        error_code: "INVALID_VALUES",
        message: "costPrice and marginPercentage must be >= 0",
      });
    }

    const product = await createCouponProduct({
      name,
      description,
      imageUrl,
      costPrice,
      marginPercentage,
      valueType,
      value,
    });

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

// GET /api/v1/admin/products
export async function fetchAllProducts(req: Request, res: Response) {
  try {
    const products = await getAllProducts();

    const formatted = products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      image_url: p.imageUrl,
      cost_price: p.coupon?.costPrice,
      margin_percentage: p.coupon?.marginPercentage,
      minimum_sell_price: p.coupon?.minimumSellPrice,
      value_type: p.coupon?.valueType,
      value: p.coupon?.value,
      is_sold: p.coupon?.isSold
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error_code: "INTERNAL_ERROR",
      message: "Something went wrong while fetching products",
    });
  }
}

// GET /api/v1/admin/products/:productId
export async function fetchProduct(req: Request, res: Response) {
  try {
    const productId = req.params.productId as string;

    const product = await getProductById(productId);

    if (!product) {
      return res.status(404).json({
        error_code: "PRODUCT_NOT_FOUND",
        message: "Product not found",
      });
    }

    const formatted = {
      id: product.id,
      name: product.name,
      description: product.description,
      image_url: product.imageUrl,
      cost_price: product.coupon?.costPrice,
      margin_percentage: product.coupon?.marginPercentage,
      minimum_sell_price: product.coupon?.minimumSellPrice,
      value_type: product.coupon?.valueType,
      value: product.coupon?.value,
      is_sold: product.coupon?.isSold
    };

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error_code: "INTERNAL_ERROR",
      message: "Something went wrong while fetching the product",
    });
  }
}

// PUT /api/v1/admin/products/:productId
export async function updateProduct(req: Request, res: Response) {
  try {
    const productId = req.params.productId as string;

    const { name, description, imageUrl, costPrice, marginPercentage, valueType, value } = req.body;

    if (!name || !description || !imageUrl || costPrice == null || marginPercentage == null || !valueType || !value) {
      return res.status(400).json({
        error_code: "MISSING_FIELDS",
        message: "All fields are required: name, description, imageUrl, costPrice, marginPercentage, valueType, value",
      });
    }

    if (costPrice < 0 || marginPercentage < 0) {
      return res.status(400).json({
        error_code: "INVALID_VALUES",
        message: "costPrice and marginPercentage must be >= 0",
      });
    }

    const product = await updateCouponProduct(productId, {
      name,
      description,
      imageUrl,
      costPrice,
      marginPercentage,
      valueType,
      value,
    });

    if (!product) {
      return res.status(404).json({
        error_code: "PRODUCT_NOT_FOUND",
        message: "Product not found",
      });
    }

    if (!product.coupon) {
      return res.status(500).json({
        error_code: "INTERNAL_ERROR",
        message: "Coupon missing",
      });
    }

    res.json({
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
      message: "Something went wrong while updating the product",
    });
  }
}

// DELETE /api/v1/admin/products/:productId
export async function deleteProduct(req: Request, res: Response) {
  try {
    const productId = req.params.productId as string;

    if (!productId) {
      return res.status(400).json({
        error_code: "MISSING_ID",
        message: "Product ID is required",
      });
    }

    try {
      await deleteCouponProduct(productId);
    } catch (err: any) {
      if (err.code === "P2025") { 
        return res.status(404).json({
          error_code: "PRODUCT_NOT_FOUND",
          message: "Product not found",
        });
      }
      throw err;
    }

    res.json({ message: "Product deleted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error_code: "INTERNAL_ERROR",
      message: "Something went wrong while deleting the product",
    });
  }
}