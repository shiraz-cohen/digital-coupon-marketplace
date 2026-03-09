import { Router } from "express";
import { createProduct , updateProduct, deleteProduct } from "../controllers/admin.controller";

const router = Router();


router.post("/products", createProduct);
router.put("/products/:productId", updateProduct);
router.delete("/products/:productId", deleteProduct);



export default router;