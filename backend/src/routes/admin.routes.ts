import { Router } from "express";
import { createProduct , updateProduct, deleteProduct, fetchAllProducts, fetchProduct } from "../controllers/admin.controller";

const router = Router();


router.post("/products", createProduct);
router.get("/products", fetchAllProducts);
router.get("/products/:productId", fetchProduct);
router.put("/products/:productId", updateProduct);
router.delete("/products/:productId", deleteProduct);



export default router;