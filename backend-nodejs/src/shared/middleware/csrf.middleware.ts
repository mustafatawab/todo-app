import crypto from "crypto";
import type { Response } from "express";

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
