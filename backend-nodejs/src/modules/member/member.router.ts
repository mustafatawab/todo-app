import { requireOrgAdmin } from "../../shared/middleware/requireOrgAdmin.middleware.js";
import { createMemberHandler, deleteMemberHandler, getMembersHandlers, updateMembersHandler } from "./member.controller.js";
import { Router } from "express";

const router = Router({ mergeParams: true });

/**
 * @openapi
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         orgId:
 *           type: string
 *         role:
 *           type: string
 *           enum: [ADMIN, MEMBER]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             username:
 *               type: string
 *     CreateMemberInput:
 *       type: object
 *       required:
 *         - name
 *         - username
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *         username:
 *           type: string
 *           minLength: 2
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 2
 *     UpdateMemberInput:
 *       type: object
 *       required:
 *         - role
 *       properties:
 *         role:
 *           type: string
 *           enum: [ADMIN, MEMBER]
 *
 * @openapi
 * tags:
 *   - name: Member
 *     description: Organization member management endpoints
 */

/**
 * @openapi
 * /api/org/{slug}/members:
 *   post:
 *     tags:
 *       - Member
 *     summary: Add a member to organization
 *     description: Creates a new user and adds them to the organization. Admin only.
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Member'
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
router.post("", requireOrgAdmin, createMemberHandler);

/**
 * @openapi
 * /api/org/{slug}/members:
 *   get:
 *     tags:
 *       - Member
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Member'
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
router.get("", requireOrgAdmin, getMembersHandlers);

/**
 * @openapi
 * /api/org/{slug}/members/{userId}:
 *   patch:
 *     tags:
 *       - Member
 *     summary: Update member role
 *     description: Updates a member's role in the organization. Admin only.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization slug
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID of the member to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMemberInput'
 *     responses:
 *       '200':
 *         description: Member role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Member'
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
 *         description: Not Found - Member not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:userId/role", requireOrgAdmin, updateMembersHandler);

/**
 * @openapi
 * /api/org/{slug}/members/{userId}:
 *   delete:
 *     tags:
 *       - Member
 *     summary: Remove a member
 *     description: Removes a member from the organization. Admin only.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization slug
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID of the member to remove
 *     responses:
 *       '200':
 *         description: Member removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Member removed successfully
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
 *         description: Not Found - Member not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:userId", requireOrgAdmin, deleteMemberHandler);

export { router as memberRouter };
