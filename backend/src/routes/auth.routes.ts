// src/routes/auth.routes.ts
import { Router } from "express";
import { registerCustomer, login } from "../controllers/auth.controller";

const router = Router();

router.post("/register", registerCustomer); // Customer בלבד
router.post("/login", login); // Admin + Customer

export default router;