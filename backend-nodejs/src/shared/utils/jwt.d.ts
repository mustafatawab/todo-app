import type { SignOptions } from "jsonwebtoken";
export interface TokenPayload {
    userId: string;
    email: string;
    username: string;
}
export declare const generateAccessToken: (payload: TokenPayload, options?: SignOptions["expiresIn"]) => string;
export declare const verifyAccessToken: (token: string) => TokenPayload | null;
export declare const generateRefreshToken: (payload: TokenPayload, options?: SignOptions["expiresIn"]) => string;
export declare const verifyRefreshToken: (token: string) => TokenPayload | null;
//# sourceMappingURL=jwt.d.ts.map