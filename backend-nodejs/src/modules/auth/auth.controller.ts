import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.schema";
import type { Request, Response, NextFunction } from "express";
import {
  userRegisteration,
  userLogin,
  refreshAccessToken,
  userLogout,
  forgotPassword,
  resetPassword,
  getMe,
} from "./auth.service";
import { AppError } from "../../shared/error/AppError";
import crypto from "crypto";
import { generateCsrfToken } from "../../shared/middleware/csrf.middleware";
import { setCsrfTokenCookie } from "../../shared/middleware/csrf.middleware";

// User Registration Controller
export const userRegisterationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = registerSchema.parse(req.body);

    const user = await userRegisteration(data);
    return res
      .status(201)
      .json({ message: "User registered successfully", user });
  } catch (error) {
    return next(error);
  }
};

// User Login Controller
export const userLoginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = loginSchema.parse(req.body);
    // const { email , password } = data;
    const ipAdress = req.ip;
    const device = req.headers["user-agent"] || "Unknown device";

    const { user, accessToken, refreshToken } = await userLogin(
      data,
      ipAdress as string,
      device,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // const csrfToken = crypto.randomBytes(24).toString("hex");

    // res.cookie("csrfToken", csrfToken, {
    //   httpOnly: false,
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    //   sameSite: "strict",
    // });

    const csfToken = generateCsrfToken();
    setCsrfTokenCookie(res, csfToken);

    return res.status(200).json({
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    return next(error);
  }
};

// User Logout Controller
export const userLogoutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await userLogout(req.user!.userId);
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.clearCookie("csrfToken");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return next(error);
  }
};

// Refresh Access Token Controller
export const refreshAccessTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const ipAddress = req.ip;
    const device = req.headers["user-agent"] || "Unknown device";

    if (!refreshToken) {
      throw new AppError("No refresh token provided", 400);
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await refreshAccessToken(refreshToken, ipAddress as string, device);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    const csrfToken = generateCsrfToken();
    setCsrfTokenCookie(res, csrfToken);

    res.cookie("csrfToken", csrfToken, {
      httpOnly: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    return res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    return next(error);
  }
};

export const forgotPasswordHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = forgotPasswordSchema.parse(req.body);

    const result = await forgotPassword(validatedData);

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export const resetPasswordHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);

    const result = await resetPassword(validatedData);

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export const getMeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    if (!userId) {
      throw new AppError("Unauthorized - no user in request", 401);
    }
    const user = await getMe(userId);

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};
