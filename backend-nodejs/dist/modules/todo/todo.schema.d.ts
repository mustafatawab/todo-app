import { z } from "zod";
export declare const priorityEnum: z.ZodEnum<{
    LOW: "LOW";
    MEDIUM: "MEDIUM";
    HIGH: "HIGH";
    URGENT: "URGENT";
}>;
export declare const statusEnum: z.ZodEnum<{
    TODO: "TODO";
    INPROGRESS: "INPROGRESS";
    DONE: "DONE";
}>;
export declare const todoCreateSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    assignedToId: z.ZodOptional<z.ZodString>;
    priority: z.ZodDefault<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        URGENT: "URGENT";
    }>>;
    dueDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const todoUpdateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        URGENT: "URGENT";
    }>>;
    dueDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const todoStatusSchema: z.ZodObject<{
    status: z.ZodDefault<z.ZodEnum<{
        TODO: "TODO";
        INPROGRESS: "INPROGRESS";
        DONE: "DONE";
    }>>;
}, z.core.$strip>;
export type TodoCreateInput = z.infer<typeof todoCreateSchema>;
export type TodoUpdateInput = z.infer<typeof todoUpdateSchema>;
export type TodoStatusInput = z.infer<typeof todoStatusSchema>;
//# sourceMappingURL=todo.schema.d.ts.map