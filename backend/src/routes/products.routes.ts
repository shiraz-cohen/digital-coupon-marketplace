import { Router } from "express";
import { getAvailableProducts, getProductByIdController, purchaseProductController } from "../controllers/products.controller";
import { authenticateJWT, authorizeCustomer } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticateJWT, authorizeCustomer, getAvailableProducts);
router.get("/:productId", authenticateJWT, authorizeCustomer, getProductByIdController);
router.post("/:productId/purchase", authenticateJWT, authorizeCustomer, purchaseProductController);

export default router;