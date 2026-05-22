import {
  todoCreateSchema,
  todoCompleteSchema,
  todoUpdateSchema,
} from "./todo.schema";
import type { Request, Response, NextFunction } from "express";
import {
  createTodo,
  updateTodo,
  completeTodo,
  deleteTodo,
  listAllTodo
} from "./todo.service";
import { AppError } from "../../shared/error/AppError";

export const listAllTodoHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
    try {
        const userId = req.user!.userId;

        const result = await listAllTodo(userId)

        return res.status(200).json(result)
        
    } catch (error) {
        
    }

};

export const createTodoHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = todoCreateSchema.parse(req.body);
    const userId = req.user!.userId;

    const result = await createTodo(validatedData, userId);

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export const updateTodoHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = todoUpdateSchema.parse(req.body);
    const userId = req.user!.userId;
    const { id } = req.params;

    if (!id) {
      throw new AppError("Task ID Required", 403);
    }

    const result = await updateTodo(validatedData, userId, id as string);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export const completeTodoHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const validatedData = todoCompleteSchema.parse(req.body);

    const result = await completeTodo(validatedData, req.user!.userId, id);

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

// Delete Todo

export const deleteTodoHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const taskId = req.params.id as string;

    const result = await deleteTodo(userId, taskId);

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
