import type { TodoCreateInput, TodoUpdateInput, TodoStatusInput } from "./todo.schema.js";
export declare const createTodo: (input: TodoCreateInput, orgId: string, userId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    orgId: string;
    title: string;
    description: string | null;
    status: import("../../../generated/prisma/index.js").$Enums.TaskStatus;
    priority: import("../../../generated/prisma/index.js").$Enums.Priority;
    dueDate: Date | null;
    createdById: string;
    assignedToId: string | null;
}>;
export declare const listAllTodo: (userId: string, orgId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    orgId: string;
    title: string;
    description: string | null;
    status: import("../../../generated/prisma/index.js").$Enums.TaskStatus;
    priority: import("../../../generated/prisma/index.js").$Enums.Priority;
    dueDate: Date | null;
    createdById: string;
    assignedToId: string | null;
}[]>;
export declare const updateTodo: (input: TodoUpdateInput, userId: string, taskId: string, orgId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    orgId: string;
    title: string;
    description: string | null;
    status: import("../../../generated/prisma/index.js").$Enums.TaskStatus;
    priority: import("../../../generated/prisma/index.js").$Enums.Priority;
    dueDate: Date | null;
    createdById: string;
    assignedToId: string | null;
}>;
export declare const statusUpdateTodo: (input: TodoStatusInput, userId: string, taskId: string, orgId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    orgId: string;
    title: string;
    description: string | null;
    status: import("../../../generated/prisma/index.js").$Enums.TaskStatus;
    priority: import("../../../generated/prisma/index.js").$Enums.Priority;
    dueDate: Date | null;
    createdById: string;
    assignedToId: string | null;
}>;
export declare const deleteTodo: (userId: string, taskId: string, orgId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    orgId: string;
    title: string;
    description: string | null;
    status: import("../../../generated/prisma/index.js").$Enums.TaskStatus;
    priority: import("../../../generated/prisma/index.js").$Enums.Priority;
    dueDate: Date | null;
    createdById: string;
    assignedToId: string | null;
}>;
//# sourceMappingURL=todo.service.d.ts.map