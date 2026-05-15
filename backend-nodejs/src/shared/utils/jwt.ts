import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export interface TokenPayload {
  userId: number;
  email: string;
}

export const generateAccessToken = (
  payload: TokenPayload,
  options: SignOptions["expiresIn"] = "15m",
) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: options });
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    // return null;
    throw new Error("Invalid token");
  }
};

export const generateRefreshToken = (
  payload: TokenPayload,
  options: SignOptions["expiresIn"] = "7d",
) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: options });
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    // return null;
    throw new Error("Invalid token");
  }
};
