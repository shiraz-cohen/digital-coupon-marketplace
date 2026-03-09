import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email?: string };
}
// Middleware to authenticate JWT tokens for both customers and resellers
export async function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error_code: "UNAUTHORIZED", message: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch {
    return res.status(401).json({ error_code: "UNAUTHORIZED", message: "Invalid token" });
  }
}

// Middleware to authenticate resellers using API tokens
export async function authenticateReseller(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error_code: "UNAUTHORIZED", message: "Missing Bearer token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const reseller = await prisma.user.findFirst({
      where: { role: "RESELLER", apiToken: token },
    });

    if (!reseller) return res.status(401).json({ error_code: "UNAUTHORIZED", message: "Invalid API token" });

    req.user = { id: reseller.id, role: reseller.role, email: reseller.email };
    next();
  } catch (err) {
    res.status(500).json({ error_code: "INTERNAL_ERROR", message: "Server error" });
  }
}

export function authorizeCustomer(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== "CUSTOMER") return res.status(403).json({ message: "Customers only" });
  next();
}

export function authorizeAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== "ADMIN") return res.status(403).json({ message: "Admins only" });
  next();
}