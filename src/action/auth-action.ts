"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "@/generated/prisma";
export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const prisma = new PrismaClient();
  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });

  if (existingUser) {
    return {
      status: 401,
      message: "user already exists ",
    };
  }

  let response = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      callbackURL: "/",
    },
  });

  return {
    status: 200,
    message: "User Registerd successfully",
    response,
  };
};

export const login = async (email: string, password: string) => {
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return {
        status: 401,
        message: "User not found. Register First",
      };
    }

    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
        callbackURL: "/",
      },
    });
    
    return {
      status: 200,
      message: "You are logged in.....",
      response,
    };
  } catch (error: any) {
    if (error?.statusCode === 401 || error?.status === "UNAUTHORIZED") {
      return {
        status: 401,
        message: "Invalid email or password.",
      };
    }

    // Fallback for unexpected errors
    return {
      status: 500,
      message: error?.message || "Something went wrong during login.",
    };
  }
};

export const signOut = async () => {
  const response = await auth.api.signOut({ headers: await headers() });
  return response;
};

export const socialLogin = async (provider: "github" | "google") => {
  const { url } = await auth.api.signInSocial({
    body: {
      provider,
      callbackURL: "/",
    },
  });

  if (url) {
    redirect(url);
  }
};
