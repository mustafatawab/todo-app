import { Router } from "express";
import {
  refreshAccessTokenHandler,
  userLoginHandler,
  userLogoutHandler,
  userRegisterationHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
} from "./auth.controller";
import { authMiddleware } from "../../shared/middleware/auth.middleware";

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication and Authorization endpoints
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name
 *               email:
 *                 type: string
 *                 description: The user's email
 *               password:
 *                 type: string
 *                 description: The user's password
 *     responses:
 *       '201':
 *         description: User created successfully
 *       '400':
 *         description: Bad Request
 */
router.post("/register", userRegisterationHandler);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Logged in successfully
 *       '401':
 *         description: Invalid credentials
 */
router.post("/login", userLoginHandler);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout the current user
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Logged out successfully
 */
router.post("/logout", authMiddleware, userLogoutHandler);

/**
 * @openapi
 * /auth/refresh-token:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh the access token
 *     responses:
 *       '200':
 *         description: Access token refreshed successfully
 */
router.post("/refresh-token", refreshAccessTokenHandler);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Request a password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Password reset email sent successfully
 *       '400':
 *         description: Bad Request
 */
router.post("/forgot-password", forgotPasswordHandler);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset user password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Password reset successfully
 *       '400':
 *         description: Bad Request
 */
router.post("/reset-password", resetPasswordHandler);

export { router as authRouter };
