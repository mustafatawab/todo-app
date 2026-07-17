import type { TokenPayload } from "../shared/utils/jwt.js";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      org?: {
        id: string;
        slug: string;
        role: string;
      };
    }
  }
}
