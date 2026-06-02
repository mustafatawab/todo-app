import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("9000"),
  JWT_SECRET: z.string().optional().default("your_jwt_secret"),
  DATABASE_URL: z.string(),
});

const data = envSchema.safeParse(process.env);

if (!data.success) {
  const errorMessage = "Invalid environment variables: " + JSON.stringify(data.error.format());
  console.error(errorMessage);
  throw new Error(errorMessage);
}

export const env = data.data;
