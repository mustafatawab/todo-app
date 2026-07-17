import { todoCreateSchema, todoStatusSchema, todoUpdateSchema, } from "./todo.schema.js";
import { createTodo, updateTodo, statusUpdateTodo, deleteTodo, listAllTodo, } from "./todo.service.js";
import { AppError } from "../../shared/error/AppError.js";
// =============== List All Todo Handler
export const listAllTodoHandler = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const orgId = req.org.id;
        const result = await listAllTodo(userId, orgId);
        return res.status(200).json(result);
    }
    catch (error) {
        return next(error);
    }
};
//  =================== Create Todo Handler
export const createTodoHandler = async (req, res, next) => {
    try {
        const validatedData = todoCreateSchema.parse(req.body);
        const userId = req.user.userId;
        const orgId = req.org.id;
        const result = await createTodo(validatedData, orgId, userId);
        return res.status(200).json(result);
    }
    catch (error) {
        return next(error);
    }
};
// ========================== Update Todo Handler
export const updateTodoHandler = async (req, res, next) => {
    try {
        const validatedData = todoUpdateSchema.parse(req.body);
        const userId = req.user.userId;
        const orgId = req.org.id;
        const id = req.params.id;
        if (!id) {
            throw new AppError("Task ID Required", 403);
        }
        const result = await updateTodo(validatedData, userId, id, orgId);
        return res.status(200).json(result);
    }
    catch (error) {
        return next(error);
    }
};
// ========================== Status Change Todo Handler
export const statusChangeTodoHandler = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user.userId;
        const orgId = req.org.id;
        const validatedData = todoStatusSchema.parse(req.body);
        const result = await statusUpdateTodo(validatedData, userId, id, orgId);
        return res.status(200).json(result);
    }
    catch (error) {
        return next(error);
    }
};
// ================= Delete Todo
export const deleteTodoHandler = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const taskId = req.params.id;
        const orgId = req.org.id;
        const result = await deleteTodo(userId, taskId, orgId);
        return res.status(200).json(result);
    }
    catch (error) {
        return next(error);
    }
};
//# sourceMappingURL=todo.controller.js.map