import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../error/AppError";
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      throw new AppError("Unauthorized: No access token provided", 401);
    }

    const decodedData = verifyAccessToken(accessToken);

    if (!decodedData) {
      throw new AppError("Unauthorized: Invalid access token", 401);
    }

    req.user = decodedData; // Attach user data to request object
    next();
  } catch (error) {
    next(error);
  }
};
