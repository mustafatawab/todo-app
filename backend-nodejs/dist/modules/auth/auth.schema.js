import { z } from "zod";
export const loginSchema = z.object({
    emailOrUsername: z.string(),
    password: z.string().min(6),
});
export const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    username: z.string().min(3),
});
export const forgotPasswordSchema = z.object({
    email: z.string().email(),
});
export const resetPasswordSchema = z.object({
    token: z.string(),
    newPassword: z.string().min(6),
});
export const verifyOtpSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    email: z.string().email(),
    otp: z.string().length(6),
});
//# sourceMappingURL=auth.schema.js.map