import { Request, Response } from "express";
import { 
  fetchAvailableProducts, 
  fetchProductById, 
  processPurchase 
} from "../services/products.service";


 // GET /api/v1/products (Reseller)
//  GET /api/v1/customer/products (Customer)

export async function getAvailableProducts(req: Request, res: Response) {
  try {
    const products = await fetchAvailableProducts();
    res.json(products);
  } catch (err) {
    console.error("Error in getAvailableProducts:", err);
    res.status(500).json({ 
      error_code: "INTERNAL_ERROR", 
      message: "Something went wrong" 
    });
  }
}


 // GET /api/v1/products/:productId
 // GET /api/v1/customer/products/:productId
 
export async function getProductByIdController(req: Request, res: Response) {
  try {
    const productId = Array.isArray(req.params.productId) 
      ? req.params.productId[0] 
      : req.params.productId;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const product = await fetchProductById(productId);
    
    if (!product) {
      return res.status(404).json({ 
        error_code: "PRODUCT_NOT_FOUND", 
        message: "Product not found" 
      });
    }

    res.json(product);
  } catch (err) {
    console.error("Error in getProductByIdController:", err);
    res.status(500).json({ 
      error_code: "INTERNAL_ERROR", 
      message: "Something went wrong" 
    });
  }
}


 // POST /api/v1/products/:productId/purchase
 // POST /api/v1/customer/products/:productId/purchase
 
export async function purchaseProductController(req: Request, res: Response) {
  try {
    const productId = Array.isArray(req.params.productId) 
      ? req.params.productId[0] 
      : req.params.productId;

    const { reseller_price } = req.body;

    if (reseller_price === undefined || typeof reseller_price !== "number") {
      return res.status(400).json({ 
        error_code: "MISSING_FIELDS", 
        message: "reseller_price is required and must be a number" 
      });
    }

    const result = await processPurchase(productId, reseller_price);
    
    res.json(result);

  } catch (err: any) {
    console.error("Error in purchaseProductController:", err);
    
    res.status(err.status || 500).json({
      error_code: err.error_code || "INTERNAL_ERROR",
      message: err.message || "Something went wrong",
    });
  }
}