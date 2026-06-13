import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../error/AppError";
export const authMiddleware = (req, res, next) => {
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
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=auth.middleware.js.map