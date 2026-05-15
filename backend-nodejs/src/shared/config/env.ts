import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("9000"),
  JWT_SECRET: z.string().optional(),
});


const data = envSchema.safeParse(process.env);

if (!data.success) {
  console.error("Invalid environment variables:", data.error.format());
  process.exit(1);
}

export const env = data.data;
