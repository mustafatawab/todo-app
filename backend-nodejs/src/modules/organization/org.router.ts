import { Router } from "express";
import {
  createOrgHandler,
  listUserOrghandler,
  joinOrganizationHandler,
  getInviteCodeHandler,
  resetInviteCodeHandler,
} from "./org.controller.js";
import { memberRouter } from "../member/member.router.js";
import { authMiddleware } from "../../shared/middleware/auth.middleware.js";
import { requireOrgAdmin } from "../../shared/middleware/requireOrgAdmin.middleware.js";

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Organization:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         inviteCode:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     OrganizationMembership:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         role:
 *           type: string
 *           enum: [ADMIN, MEMBER]
 *         createdAt:
 *           type: string
 *           format: date-time
 *     CreateOrganizationInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           description: Organization name
 *     JoinOrganizationInput:
 *       type: object
 *       required:
 *         - code
 *       properties:
 *         code:
 *           type: string
 *           minLength: 3
 *           description: Organization invite code
 *     InviteCodeResponse:
 *       type: object
 *       properties:
 *         inviteCode:
 *           type: string
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *
 * @openapi
 * tags:
 *   - name: Organization
 *     description: Organization management endpoints
 */

/**
 * @openapi
 * /api/org/:
 *   post:
 *     tags:
 *       - Organization
 *     summary: Create a new organization
 *     description: Creates a new organization and adds the creator as ADMIN.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrganizationInput'
 *     responses:
 *       '201':
 *         description: Organization created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       '400':
 *         description: Bad Request - Organization name already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", authMiddleware, createOrgHandler);

/**
 * @openapi
 * /api/org/:
 *   get:
 *     tags:
 *       - Organization
 *     summary: List user's organizations
 *     description: Returns all organizations the authenticated user is a member of.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: List of organizations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrganizationMembership'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", authMiddleware, listUserOrghandler);

/**
 * @openapi
 * /api/org/join:
 *   post:
 *     tags:
 *       - Organization
 *     summary: Join an organization
 *     description: Joins an organization using an invite code.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JoinOrganizationInput'
 *     responses:
 *       '200':
 *         description: Joined successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Joined Successfully
 *                 slug:
 *                   type: string
 *       '400':
 *         description: Bad Request - Already a member
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Invalid invite code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/join", authMiddleware, joinOrganizationHandler);

/**
 * @openapi
 * /api/org/{slug}/invite-code:
 *   get:
 *     tags:
 *       - Organization
 *     summary: Get organization invite code
 *     description: Returns the invite code for the specified organization. Admin only.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization slug
 *     responses:
 *       '200':
 *         description: Invite code retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InviteCodeResponse'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden - Not an admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Organization not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:slug/invite-code", authMiddleware, requireOrgAdmin, getInviteCodeHandler);

/**
 * @openapi
 * /api/org/{slug}/invite-code/reset:
 *   post:
 *     tags:
 *       - Organization
 *     summary: Reset organization invite code
 *     description: Generates a new invite code for the organization. Admin only.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization slug
 *     responses:
 *       '200':
 *         description: Invite code reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InviteCodeResponse'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden - Not an admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/:slug/invite-code/reset", authMiddleware, requireOrgAdmin, resetInviteCodeHandler);

/**
 * @openapi
 * /api/org/{slug}/members:
 *   post:
 *     tags:
 *       - Organization
 *     summary: Add a member to organization
 *     description: Adds a new member to the organization. Admin only.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization slug
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMemberInput'
 *     responses:
 *       '200':
 *         description: Member added successfully
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden - Not an admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     tags:
 *       - Organization
 *     summary: List organization members
 *     description: Returns all members of the organization. Admin only.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization slug
 *     responses:
 *       '200':
 *         description: List of members
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden - Not an admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.use("/:slug/members", authMiddleware, requireOrgAdmin, memberRouter);

export { router as orgRouter };
