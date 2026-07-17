import { z } from "zod";
export declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<{
        production: "production";
        development: "development";
        test: "test";
    }>>;
    PORT: z.ZodDefault<z.ZodString>;
    JWT_SECRET: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    DATABASE_URL: z.ZodString;
}, z.core.$strip>;
export declare const env: {
    NODE_ENV: "production" | "development" | "test";
    PORT: string;
    JWT_SECRET: string;
    DATABASE_URL: string;
};
//# sourceMappingURL=env.d.ts.map