import type { TokenPayload } from "./jwt.js";
import { generateAccessToken, generateRefreshToken } from "./jwt.js";

export const generateAuthTokens = (payload: TokenPayload) => {
  const refreshTokenExpiry = "7d";
  const accessTokenExpiry = "15m";

  const refreshToken = generateRefreshToken(payload, refreshTokenExpiry);
  const accessToken = generateAccessToken(payload, accessTokenExpiry);
  return { accessToken, refreshToken };
};
