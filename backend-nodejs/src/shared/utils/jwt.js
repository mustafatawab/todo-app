import jwt from "jsonwebtoken";
import { env } from "../config/env";
export const generateAccessToken = (payload, options = "15m") => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: options });
};
export const verifyAccessToken = (token) => {
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        return decoded;
    }
    catch (error) {
        // return null;
        throw new Error("Invalid token");
    }
};
export const generateRefreshToken = (payload, options = "7d") => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: options });
};
export const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        return decoded;
    }
    catch (error) {
        // return null;
        throw new Error("Invalid token");
    }
};
//# sourceMappingURL=jwt.js.map