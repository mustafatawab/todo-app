import type { RegisterInput, LoginInput, ForgotPasswordInput, ResetPasswordInput } from "./auth.schema";
export declare const userRegisteration: (input: RegisterInput) => Promise<any>;
export declare const userLogin: (input: LoginInput, ipAddress: string, device: string) => Promise<{
    user: any;
    accessToken: any;
    refreshToken: any;
}>;
export declare const refreshAccessToken: (token: string, ipAddress: string, device: string) => Promise<{
    accessToken: any;
    refreshToken: any;
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
export declare const getMe: (userId: string) => Promise<any>;
//# sourceMappingURL=auth.service.d.ts.map