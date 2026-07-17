import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../error/AppError.js";
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
        throw new AppError("Invalid token", 401);
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
        throw new AppError("Invalid token", 401);
    }
};
//# sourceMappingURL=jwt.js.map