import type { RegisterInput, LoginInput, ForgotPasswordInput, ResetPasswordInput } from "./auth.schema.js";
export declare const userRegisteration: (input: RegisterInput) => Promise<{
    password: string;
    name: string;
    email: string;
    username: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const userLogin: (input: LoginInput, ipAddress: string, device: string) => Promise<{
    user: {
        name: string;
        email: string;
        username: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    };
    accessToken: string;
    refreshToken: string;
}>;
export declare const refreshAccessToken: (token: string, ipAddress: string, device: string) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare const userLogout: (userId: string) => Promise<{
    message: string;
}>;
export declare const forgotPassword: (input: ForgotPasswordInput) => Promise<{
    message: string;
}>;
export declare const resetPassword: (input: ResetPasswordInput) => Promise<{
    message: string;
}>;
export declare const getMe: (userId: string) => Promise<{
    name: string;
    email: string;
    username: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
}>;
//# sourceMappingURL=auth.service.d.ts.map