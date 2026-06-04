import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "./auth.schema";
import { prisma } from "../../shared/lib/prisma";
import { AppError } from "../../shared/error/AppError";
import { hashPassword, comparePassword } from "../../shared/utils/hash";
import { verifyRefreshToken } from "../../shared/utils/jwt";
import { generateAuthTokens } from "../../shared/utils/generateAuthTokens";
import crypto from "crypto";

// User Registration Service
export const userRegisteration = async (input: RegisterInput) => {
  const { name, email, password } = input;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new AppError("User with this email already exists", 400);
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return user;
};

// User Login Service

export const userLogin = async (
  input: LoginInput,
  ipAddress: string,
  device: string,
) => {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!user) {
    throw new AppError("Invalid email", 400);
  }

  const isPasswordValid = await comparePassword(input.password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid  password", 400);
  }

  const payload = {
    userId: user.id,
    email: user.email,
  };

  const { accessToken, refreshToken } = generateAuthTokens(payload);

  await prisma.session.create({
    data: {
      token: refreshToken,
      userId: payload.userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      ipAddress,
      device,
    },
  });

  const { password, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, accessToken, refreshToken };
};

// Refresh Access Token Service
export const refreshAccessToken = async (
  token: string,
  ipAddress: string,
  device: string,
) => {
  const payload = verifyRefreshToken(token);

  if (!payload) {
    throw new AppError("Refresh token does not match", 401);
  }

  const checkTokenInDb = await prisma.session.findUnique({
    where: { token , userId: payload.userId },
  });

  if (!checkTokenInDb) {
    await prisma.session.delete({
      where: { token , userId: payload.userId },
    });
    throw new AppError("Refresh token does not found in the database", 401);
  }

  const { accessToken, refreshToken } = generateAuthTokens({
    userId: payload.userId,
    email: payload.email,
  });

  await prisma.session.update({
    where: { token , userId: payload.userId },
    data: {
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      ipAddress,
      device,
    },
  });

  return { accessToken, refreshToken };
};

// User Logout Service
export const userLogout = async (userId: string) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    throw new AppError("User not found", 404);
  }

  await prisma.session.deleteMany({
    where: {
      userId,
    },
  });

  return { message: "Logged out successfully" };
};

// Forgot Password Service
export const forgotPassword = async (input: ForgotPasswordInput) => {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!user) {
    throw new AppError("User with this email does not exist", 404);
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  console.log(`Password reset token for ${input.email}: ${token}`);

  await prisma.passwordReset.create({
    data: {
      token,
      expiresAt,
      userId: user.id,
    },
  });

  return { message: "Password reset token generated and sent to email" };
};

// Reset Password Service
export const resetPassword = async (input: ResetPasswordInput) => {
  const { token, newPassword } = input;

  const passwordReset = await prisma.passwordReset.findUnique({
    where: {
      token,
    },
    include: {
      user: true,
    },
  });

  if (!passwordReset) {
    throw new AppError("Invalid or expired password reset token", 400);
  }

  if (passwordReset.expiresAt < new Date()) {
    await prisma.passwordReset.delete({
      where: {
        token,
      },
    });
    throw new AppError("Password reset token has expired", 400);
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: {
      id: passwordReset.userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.passwordReset.delete({
    where: {
      token,
    },
  });

  return { message: "Password has been reset successfully" };
};

export const getMe = async (userId: string) => {
  const user = prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }
  


  return user;
};
