import crypto from "crypto";
import type { Response, Request, NextFunction } from "express";
import { AppError } from "../error/AppError";

export const generateCsrfToken = () => {
  return crypto.randomBytes(24).toString("hex");
};

export const setCsrfTokenCookie = (res: Response, csrfToken: string) => {
  res.cookie("csrfToken", csrfToken, {
    httpOnly: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
  });
};

const CSRF_SAFE_PATH = [
  "/api/auth/register",
  "/api/auth/login",
  "/api/auth/refresh-token",
  "/api/auth/reset-token",
  "/api/forgot-password",
];

const isCsrfExempt = (path: string) => {
  return CSRF_SAFE_PATH.some(
    (exemptPath) => exemptPath == path || path.startsWith(exemptPath),
  );
};

export const csrfMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const csrfTokenFromCookie = req.cookies["csrfToken"];
  const csrfTokenFromHeader = req.headers["x-csrf-token"] as string;

  if (
    req.method === "GET" ||
    req.method === "HEAD" ||
    req.method === "OPTIONS"
  ) {
    return next();
  }

  const fullPaths = req.originalUrl.split("?")[0] as string;

  if (isCsrfExempt(fullPaths)) {
    return next();
  }

  if (!csrfTokenFromCookie || !csrfTokenFromHeader) {
    return res.status(403).json({
      message: "CSRF Tokens are missing",
    });
  }

  if (
    !crypto.timingSafeEqual(
      Buffer.from(csrfTokenFromCookie),
      Buffer.from(csrfTokenFromHeader),
    )
  ) {
    return res.status(403).json({
      message: "Invalid CSRF Token",
    });
  }

  next();
};
