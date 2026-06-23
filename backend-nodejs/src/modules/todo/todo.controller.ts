import {
  todoCreateSchema,
  todoStatusSchema,
  todoUpdateSchema,
} from "./todo.schema";
import type { Request, Response, NextFunction } from "express";
import {
  createTodo,
  updateTodo,
  statusUpdateTodo,
  deleteTodo,
  listAllTodo,
} from "./todo.service";
import { AppError } from "../../shared/error/AppError";

// =============== List All Todo Handler
export const listAllTodoHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const orgId = req.org!.id;

    

    const result = await listAllTodo(userId, orgId);

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

//  =================== Create Todo Handler
export const createTodoHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = todoCreateSchema.parse(req.body);
    const userId = req.user!.userId;
    const orgId = req.org!.id;
    
 
    const result = await createTodo(validatedData, orgId, userId);

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

// ========================== Update Todo Handler
export const updateTodoHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = todoUpdateSchema.parse(req.body);
    const userId = req.user!.userId;
    const orgId = req.org!.id;
    const id = req.params.id as string;

    if (!id) {
      throw new AppError("Task ID Required", 403);
    }

    const result = await updateTodo(validatedData, userId, id, orgId);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

// ========================== Status Change Todo Handler
export const statusChangeTodoHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;
    const orgId = req.org!.id;

    const validatedData = todoStatusSchema.parse(req.body);

    const result = await statusUpdateTodo(validatedData, userId, id, orgId);

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

// ================= Delete Todo

export const deleteTodoHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const taskId = req.params.id as string;
    const orgId = req.org!.id;
    const result = await deleteTodo(userId, taskId, orgId);

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
