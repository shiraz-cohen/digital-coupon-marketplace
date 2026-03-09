import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined in .env");

export interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

// JWT authentication middleware
export async function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as { userId: string; role: string };
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Admin authorization middleware
export function authorizeAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }

  next();
}

// General role-based authorization middleware
export function authorizeRole(role: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== role) return res.status(403).json({ message: "Forbidden" });
    next();
  };
}

// RESELLER token middleware
export async function authenticateReseller(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"]?.toString().replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token" });

  const reseller = await prisma.user.findFirst({ where: { role: "RESELLER", apiToken: token } });
  if (!reseller) return res.status(401).json({ message: "Invalid token" });

  next();
}

