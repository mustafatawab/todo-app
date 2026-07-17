import type { TodoCreateInput, TodoUpdateInput, TodoStatusInput } from "./todo.schema";
export declare const createTodo: (input: TodoCreateInput, orgId: string, userId: string) => Promise<any>;
export declare const listAllTodo: (userId: string, orgId: string) => Promise<any>;
export declare const updateTodo: (input: TodoUpdateInput, userId: string, taskId: string, orgId: string) => Promise<any>;
export declare const statusUpdateTodo: (input: TodoStatusInput, userId: string, taskId: string, orgId: string) => Promise<any>;
export declare const deleteTodo: (userId: string, taskId: string, orgId: string) => Promise<any>;
//# sourceMappingURL=todo.service.d.ts.map