import { Router } from "express";
import { createProduct , updateProduct, deleteProduct, fetchAllProducts, fetchProduct } from "../controllers/admin.controller";
import { authenticateJWT, authorizeAdmin } from "../middlewares/auth.middleware";

const router = Router();


router.post("/products", authenticateJWT, authorizeAdmin, createProduct);
router.get("/products", authenticateJWT, authorizeAdmin, fetchAllProducts);
router.get("/products/:productId", authenticateJWT, authorizeAdmin, fetchProduct);
router.put("/products/:productId", authenticateJWT, authorizeAdmin, updateProduct);
router.delete("/products/:productId", authenticateJWT, authorizeAdmin, deleteProduct);



export default router;