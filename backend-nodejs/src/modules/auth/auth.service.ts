import type { RegisterInput, LoginInput } from "./auth.schema";
import { prisma } from "../../shared/lib/prisma";
import { AppError } from "../../shared/error/AppError";
import { hashPassword, comparePassword } from "../../shared/utils/hash";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../../shared/utils/jwt";

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

// User Login Function

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
  const accessToken = generateAccessToken(payload);

  const refreshToken = generateRefreshToken(payload);

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
    where: { token },
  });

  if (!checkTokenInDb) {
    await prisma.session.delete({
      where: { token },
    });
    throw new AppError("Refresh token does not found in the database", 401);
  }

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  await prisma.session.update({
    where: { token },
    data: {
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      ipAddress,
      device,
    },
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
