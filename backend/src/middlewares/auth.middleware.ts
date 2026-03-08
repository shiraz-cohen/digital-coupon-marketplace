import { Request, Response, NextFunction } from "express";

const RESELLER_TOKEN = "secret-token";

export function resellerAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Bearer ${RESELLER_TOKEN}`) {
    return res.status(401).json({
      error_code: "UNAUTHORIZED",
      message: "Invalid or missing token",
    });
  }

  next();
}