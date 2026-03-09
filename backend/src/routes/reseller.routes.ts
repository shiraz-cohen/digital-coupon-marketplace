import { Router } from "express";
import { getAvailableProducts, getProductByIdController, purchaseProductController } from "../controllers/products.controller";
import { authenticateReseller } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticateReseller, getAvailableProducts);
router.get("/:productId", authenticateReseller, getProductByIdController);
router.post("/:productId/purchase", authenticateReseller, purchaseProductController);

export default router;