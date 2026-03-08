/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     summary: Get all available products
 *     responses:
 *       200:
 *         description: List of products
 */

import { Router } from "express";
import { getAvailableProducts, getProductById } from "../controllers/products.controller";

const router = Router();


router.get("/", getAvailableProducts);
router.get("/:productId", getProductById);


export default router;