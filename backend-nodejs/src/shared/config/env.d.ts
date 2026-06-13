import { z } from "zod";
export declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<{
        development: "development";
        production: "production";
        test: "test";
    }>>;
    PORT: z.ZodDefault<z.ZodString>;
    JWT_SECRET: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    DATABASE_URL: z.ZodString;
}, z.core.$strip>;
export declare const env: {
    NODE_ENV: "development" | "production" | "test";
    PORT: string;
    JWT_SECRET: string;
    DATABASE_URL: string;
};
//# sourceMappingURL=env.d.ts.map