import { Router } from "express";
import { createTodoHandler, updateTodoHandler, statusChangeTodoHandler, deleteTodoHandler, listAllTodoHandler, } from "./todo.controller.js";
import { authMiddleware } from "../../shared/middleware/auth.middleware.js";
import { requireOrgAdmin } from "../../shared/middleware/requireOrgAdmin.middleware.js";
import { resolveOrg } from "../../shared/middleware/resolveOrg.middleware.js";
const router = Router({ mergeParams: true });
/**
 * @openapi
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [TODO, INPROGRESS, DONE]
 *         priority:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, URGENT]
 *         dueDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         orgId:
 *           type: string
 *         createdById:
 *           type: string
 *         assignedToId:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateTodoInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         assignedToId:
 *           type: string
 *           description: User ID to assign task to (members can only assign to themselves)
 *         priority:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, URGENT]
 *           default: MEDIUM
 *         dueDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     UpdateTodoInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         priority:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, URGENT]
 *         dueDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     UpdateTodoStatusInput:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [TODO, INPROGRESS, DONE]
 *           default: TODO
 *
 * @openapi
 * tags:
 *   - name: Todo
 *     description: Task management endpoints
 */
/**
 * @openapi
 * /api/org/{slug}/todos/:
 *   get:
 *     tags:
 *       - Todo
 *     summary: List all todos
 *     description: Returns todos for the organization. Admins see all todos, members see only assigned todos.
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
 *         description: List of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden - Not a member
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Organization or user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", authMiddleware, resolveOrg, listAllTodoHandler);
/**
 * @openapi
 * /api/org/{slug}/todos/:
 *   post:
 *     tags:
 *       - Todo
 *     summary: Create a new todo
 *     description: Creates a new task. Admins can assign to anyone, members can only assign to themselves.
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
 *             $ref: '#/components/schemas/CreateTodoInput'
 *     responses:
 *       '200':
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden - Only admins can create tasks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Organization or assigned user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", authMiddleware, requireOrgAdmin, createTodoHandler);
/**
 * @openapi
 * /api/org/{slug}/todos/{id}:
 *   put:
 *     tags:
 *       - Todo
 *     summary: Update a todo
 *     description: Updates task details. Only admins can edit core task details.
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
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTodoInput'
 *     responses:
 *       '200':
 *         description: Todo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden - Only admins can edit tasks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:id", authMiddleware, requireOrgAdmin, updateTodoHandler);
/**
 * @openapi
 * /api/org/{slug}/todos/{id}/status:
 *   patch:
 *     tags:
 *       - Todo
 *     summary: Update todo status
 *     description: Updates the status of a task. Available to users who created or are assigned to the task.
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
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTodoStatusInput'
 *     responses:
 *       '200':
 *         description: Todo status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden - Not a member
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:id/status", authMiddleware, resolveOrg, statusChangeTodoHandler);
/**
 * @openapi
 * /api/org/{slug}/todos/{id}:
 *   delete:
 *     tags:
 *       - Todo
 *     summary: Delete a todo
 *     description: Permanently deletes a task. Only admins can delete tasks.
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
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       '200':
 *         description: Todo deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden - Only admins can delete tasks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not Found - Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", authMiddleware, requireOrgAdmin, deleteTodoHandler);
export { router as todoRouter };
//# sourceMappingURL=todo.router.js.map