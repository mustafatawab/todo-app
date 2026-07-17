import { generateAccessToken, generateRefreshToken } from "./jwt";
export const generateAuthTokens = (payload) => {
    const refreshTokenExpiry = "7d";
    const accessTokenExpiry = "15m";
    const refreshToken = generateRefreshToken(payload, refreshTokenExpiry);
    const accessToken = generateAccessToken(payload, accessTokenExpiry);
    return { accessToken, refreshToken };
};
//# sourceMappingURL=generateAuthTokens.js.map