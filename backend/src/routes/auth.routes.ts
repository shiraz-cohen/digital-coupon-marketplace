import { Router } from "express";
import { registerCustomer, login, logout} from "../controllers/auth.controller";

const router = Router();

router.post("/register", registerCustomer);  
router.post("/login", login);    
router.post("/logout", logout);

export default router;