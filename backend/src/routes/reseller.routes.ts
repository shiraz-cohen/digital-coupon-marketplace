// src/routes/reseller.routes.ts
import { Router } from "express";
import { authenticateReseller } from "../middlewares/auth.middleware";
const router = Router();

router.use(authenticateReseller);
//router.get("/products", /* controller */);
//router.get("/products/:id", /* controller */);
//router.post("/products/:id/purchase", /* controller */);

export default router;