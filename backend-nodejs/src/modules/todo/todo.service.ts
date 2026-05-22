import type { TodoCreateInput } from "./todo.schema";
import { prisma } from "../../shared/lib/prisma";
import { AppError } from "../../shared/error/AppError";

export const createTodo = async (input: TodoCreateInput, userId: string) => {
  const { title, description } = input;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("User not found while createing the todo  ", 404);
  }

  const task = await prisma.task.create({
    data: {
      userId: userId,
      title,
      description,
    },
  });

  return task;
};

export const listAllTodo = async (userId: string) => {
     const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("User not found while createing the todo  ", 404);
  }


  const tasks = await prisma.task.findMany({
    where : {userId}
  })

  return tasks
};

export const updateTodo = async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("User not found while createing the todo  ", 404);
  }


  
};

export const completeTodo = async () => {};
