import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
  console.log("Verifying JWT...");
  console.log("Headers:", req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing token" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (err) {
    console.error("Invalid token:", err);
    res.status(403).json({ message: "Invalid or expired token" });
    return;
  }
}
