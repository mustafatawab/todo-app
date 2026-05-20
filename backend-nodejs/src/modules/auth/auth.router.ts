import { Router } from "express";
import {
  refreshAccessTokenHandler,
  userLoginHandler,
  userLogoutHandler,
  userRegisterationHandler,
} from "./auth.controller";
import { authMiddleware } from "../../shared/middleware/auth.middleware";

const router = Router();

/*
 *  @openapi
 *  tags:
 *    name: Auth
 *    description: Authentication and Authorization endpoints
 */

/**

*  @openapi
*  /auth/register:
*    post:
*      summary: Register a new user
*      tags: [ Auth ]
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              required:
*                - name
*                - email
*                - password
*              properties: 
*                name:
*                  type: string
*                  description: The user's name
*                email:
*                  type: string
*                  description: The user's email
*                password:
*                  type: string
*                  description: The user's password
*          
*      responses:
*         201:
*           description: User created Successfully
*         400:
*           description: Bad Request        
*              
*              
*              
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
 *       200:
 *         description: Logged in successfully
 *       401:
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
 *       200:
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
 *       200:
 *         description: Access token refreshed successfully
 */

router.post("/refresh-token", refreshAccessTokenHandler);

export { router as authRouter };
