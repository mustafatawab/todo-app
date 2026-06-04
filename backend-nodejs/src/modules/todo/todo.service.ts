import type {
  TodoCreateInput,
  TodoUpdateInput,
  TodoCompleteInput,
} from "./todo.schema";
import { prisma } from "../../shared/lib/prisma";
import { AppError } from "../../shared/error/AppError";

// Create Todo service
export const createTodo = async (input: TodoCreateInput, userId: string) => {
  const { title, description, priority, dueDate } = input;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("User not found while createing the todo  ", 404);
  }

  const task = await prisma.task.create({
    data: {
      user: { connect: { id: userId } },
      title,
      description: description || null,
      priority: priority || "MEDIUM",
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  return task;
};

// list all todo service
export const listAllTodo = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("User not found while createing the todo  ", 404);
  }

  const tasks = await prisma.task.findMany({
    where: { userId },
  });

  return tasks;
};

// Update Todo Service
export const updateTodo = async (
  input: TodoUpdateInput,
  userId: string,
  taskId: string,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("User not found while createing the todo  ", 404);
  }

  const existing = await prisma.task.findUnique({ where: { id: taskId, userId } });

  if (!existing) {
    throw new AppError(`Task not found for the ${user.name} `, 404);
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId, userId },
    data: {
      title: input.title ?? existing.title,
      description: input.description !== undefined ? input.description : existing.description,
      priority: (input.priority as any) ?? (existing as any).priority,
      dueDate: input.dueDate !== undefined ? (input.dueDate ? new Date(input.dueDate) : null) : (existing as any).dueDate,
      completed: existing.completed,
    },
  });

  return updatedTask;
};

//  Complete Todo Service
export const completeTodo = async (
  input: TodoCompleteInput,
  userId: string,
  taskId: string,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError(
      "User not found while completting or incompleting the task",
      404,
    );
  }

  const task = await prisma.task.findUnique({ where: { id: taskId, userId } });

  if (!task) {
    throw new AppError(`Task not found for the ${user.name} `, 404);
  }

  const completedTask = await prisma.task.update({
    where: { id: taskId, userId },
    data: { completed: input.completed },
  });

  return completedTask;
};

export const deleteTodo = async (userId: string, taskId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError(
      "User not found while completting or incompleting the task",
      404,
    );
  }

  const task = await prisma.task.findUnique({ where: { id: taskId, userId } });

  if (!task) {
    throw new AppError(`Task not found for the ${user.name} `, 404);
  }

  const deletedTask = await prisma.task.delete({
    where: { id: taskId, userId },
  });

  return deletedTask;
};
