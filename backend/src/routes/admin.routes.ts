import { Router } from "express";
import { createProduct , updateProduct } from "../controllers/admin.controller";

const router = Router();


router.post("/products", createProduct);
router.put("/products/:productId", updateProduct);


export default router;