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

/*

*  @openapi
*  /auth/register:
*    post:
*      summary: Register a new user
*      tags: [Auth]
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
*/
router.post("/register", userRegisterationHandler);

router.post("/login", userLoginHandler);
router.post("/logout", authMiddleware, userLogoutHandler);
router.post("/refresh-token", refreshAccessTokenHandler);

export { router as authRouter };
