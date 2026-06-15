import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../error/AppError";

export interface TokenPayload {
  userId: string;
  email: string;
  username: string;
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
    throw new AppError("Invalid token" , 401);
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
    throw new AppError("Invalid token" , 401);
  }
};
