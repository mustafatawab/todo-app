import type {
  TodoCreateInput,
  TodoUpdateInput,
  TodoStatusInput,
} from "./todo.schema";
import { prisma } from "../../shared/lib/prisma";
import { AppError } from "../../shared/error/AppError";
import { getUserRole } from "../../shared/utils/getRole";

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

  const { role } = await getUserRole(userId, orgId);

  if (role === "MEMBER" && assignedToId && assignedToId !== userId) {
    throw new AppError(
      "Members can only create and assign tasks to themselves",
      403,
    );
  }

  let finalAssignedId: string | null = null;

  if (assignedToId && assignedToId.trim() !== "") {
    const assignedUser = await prisma.user.findUnique({
      where: { id: assignedToId },
    });

    if (!assignedUser) {
      throw new AppError("Assigned User ID not found", 404);
    }
    finalAssignedId = assignedUser.id;
  } else if (role === "MEMBER") {
    // If a member leaves it blank, default assign it to themselves
    finalAssignedId = userId;
  }

  const task = await prisma.task.create({
    data: {
      orgId: org.id,
      createdById: userId,
      title,
      description: description || null,
      priority: priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      assignedToId: finalAssignedId, // Explicitly safe mapped ID
    },
  });
  // const user = await prisma.user.findUnique({ where: { id: userId } });

  // if (!user) {
  //   throw new AppError("User not found while creating the task", 404);
  // }

  // if (assignedToId) {
  //   const assignedId = await prisma.user.findFirst({
  //     where: { id: assignedToId! },
  //   });

  //   if (!assignedId) {
  //     throw new AppError("Assigned To ID Does not found ", 404);
  //   }
  // }

  // const task = await prisma.task.create({
  //   data: {
  //     orgId: org.id,
  //     createdById: user!.id,
  //     title,
  //     description: description || null,
  //     priority: priority,
  //     dueDate: dueDate ? new Date(dueDate) : null,
  //     assignedToId: assignedToId!,
  //   },
  // });

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
    include: {
      orgMemberships: {
        where: { orgId: orgId },
      },
    },
  });

  if (!user) {
    throw new AppError("User not found while createing the todo  ", 404);
  }

  const { role } = await getUserRole(userId, orgId);

  let tasks;

  if (role == "ADMIN") {
    tasks = await prisma.task.findMany({
      where: { orgId: orgId },
      orderBy: { createdAt: "desc" },
    });
  } else {
    tasks = await prisma.task.findMany({
      where: {
        orgId: orgId,
        assignedToId: userId,
      },
    });
  }

  return tasks;
};

// ================= Update Todo Service
export const updateTodo = async (
  input: TodoUpdateInput,
  userId: string,
  taskId: string,
  orgId: string,
) => {
  // const org = await prisma.organization.findUnique({ where: { id: orgId } });

  // if (!org) {
  //   throw new AppError(
  //     "Organization not found while listing the ALL todos ",
  //     404,
  //   );
  // }

  // const user = await prisma.user.findUnique({ where: { id: userId } });

  // if (!user) {
  //   throw new AppError("User not found while updating the todo  ", 404);
  // }

  const { role } = await getUserRole(userId, orgId);

  if (role === "MEMBER") {
    throw new AppError("Only administrators can edit core task details", 403);
  }

  const existing = await prisma.task.findFirst({
    where: {
      id: taskId,
      orgId,
      OR: [{ createdById: userId }, { assignedToId: userId }],
    },
  });

  if (!existing) throw new AppError("Task not found", 404);

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
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

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      OR: [{ createdById: userId }, { assignedToId: userId }],
    },
  });

  if (!task) {
    throw new AppError(`Task not found for the ${user.name} `, 404);
  }

  const updatedTask = await prisma.task.update({
    where: { id: task.id },
    data: {
      status: (input.status as any) ?? task.status,
    },
  });

  return updatedTask;
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

  const { role } = await getUserRole(userId, orgId);

  // RULE: Hard data deletion is restricted to Admins only
  if (role === "MEMBER") {
    throw new AppError(
      "Unauthorized. Only administrators can delete tasks",
      403,
    );
  }

  const task = await prisma.task.findFirst({ where: { id: taskId, orgId } });

  // const task = await prisma.task.findFirst({
  //   where: {
  //     id: taskId,
  //     orgId,
  //     OR: [{ createdById: userId }, { assignedToId: userId }],
  //   },
  // });

  if (!task) throw new AppError("Task not found", 404);

  const deletedTask = await prisma.task.delete({
    where: { id: taskId },
  });

  return deletedTask;
};
