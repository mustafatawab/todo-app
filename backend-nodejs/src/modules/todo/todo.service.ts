import type {
  TodoCreateInput,
  TodoUpdateInput,
  TodoStatusInput,
} from "./todo.schema";
import { prisma } from "../../shared/lib/prisma";
import { AppError } from "../../shared/error/AppError";

// ============== Create Todo service
export const createTodo = async (
  input: TodoCreateInput,
  orgId: string,
  userId: string,
) => {
  const { title, description, priority, dueDate, assignedToId } = input;

  const org = await prisma.organization.findUnique({ where: { id: orgId } });

  if (!org) {
    throw new AppError(
      "Organization not found while createing the todo  ",
      404,
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("User not found while creating the task", 404);
  }

  if (assignedToId) {
    const assignedId = await prisma.user.findFirst({
      where: { id: assignedToId! },
    });

    if (!assignedId) {
      throw new AppError("Assigned To ID Does not found ", 404);
    }
  }

  const task = await prisma.task.create({
    data: {
      orgId: org.id,
      createdById: user!.id,
      title,
      description: description || null,
      priority: priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      assignedToId: assignedToId!,
    },
  });

  return task;
};

// =================== list all todo service
export const listAllTodo = async (userId: string, orgId: string) => {
  const org = await prisma.organization.findUnique({ where: { id: orgId } });

  if (!org) {
    throw new AppError(
      "Organization not found while listing the ALL todos ",
      404,
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { orgMemberships: true },
  });

  if (!user) {
    throw new AppError("User not found while createing the todo  ", 404);
  }

  let tasks;

  tasks = await prisma.task.findMany({
    where: { createdById: userId, orgId: orgId },
  });

  // const membership = user.orgMemberships.find(m => m.orgId === orgId)

  return tasks;
};

// ================= Update Todo Service
export const updateTodo = async (
  input: TodoUpdateInput,
  userId: string,
  taskId: string,
  orgId: string,
) => {
  const org = await prisma.organization.findUnique({ where: { id: orgId } });

  if (!org) {
    throw new AppError(
      "Organization not found while listing the ALL todos ",
      404,
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("User not found while updating the todo  ", 404);
  }

  const existing = await prisma.task.findUnique({
    where: { id: taskId, userId, orgId },
  });

  if (!existing) {
    throw new AppError(`Task not found for the ${user.name} `, 404);
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId, userId, orgId },
    data: {
      title: input.title ?? existing.title,
      description:
        input.description !== undefined
          ? input.description
          : existing.description,
      priority: (input.priority as any) ?? (existing as any).priority,
      dueDate:
        input.dueDate !== undefined
          ? input.dueDate
            ? new Date(input.dueDate)
            : null
          : (existing as any).dueDate,
      status: existing.status,
    },
  });

  return updatedTask;
};

//  =============== Status Todo Service
export const statusUpdateTodo = async (
  input: TodoStatusInput,
  userId: string,
  taskId: string,
  orgId: string,
) => {
  const org = await prisma.organization.findUnique({ where: { id: orgId } });

  if (!org) {
    throw new AppError(
      "Organization not found while Updating Status the  todo ",
      404,
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError(
      "User not found while completting or incompleting the task",
      404,
    );
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId, userId, orgId },
  });

  if (!task) {
    throw new AppError(`Task not found for the ${user.name} `, 404);
  }

  const statusTask = await prisma.task.update({
    where: { id: task.id, userId, orgId },
    data: {
      status: (input.status as any) ?? task.status,
    },
  });
};

// ============== Delete Todo
export const deleteTodo = async (
  userId: string,
  taskId: string,
  orgId: string,
) => {
  const org = await prisma.organization.findUnique({ where: { id: orgId } });

  if (!org) {
    throw new AppError("Organization not found while deleting the  todo ", 404);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError(
      "User not found while completting or incompleting the task",
      404,
    );
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId, userId, orgId },
  });

  if (!task) {
    throw new AppError(`Task not found for the ${user.name} `, 404);
  }

  const deletedTask = await prisma.task.delete({
    where: { id: taskId, userId, orgId },
  });

  return deletedTask;
};
