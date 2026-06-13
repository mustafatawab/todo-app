import type { Response, Request, NextFunction } from "express";
export declare const generateCsrfToken: () => string;
export declare const setCsrfTokenCookie: (res: Response, csrfToken: string) => void;
export declare const clearCsrfTokenCookie: (res: Response) => void;
export declare const csrfMiddleware: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=csrf.middleware.d.ts.map