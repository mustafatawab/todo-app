import { z } from "zod";

export const priorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const todoCreateSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  completed: z.boolean().default(false),
  priority: priorityEnum.default("MEDIUM"),
  dueDate: z.string().datetime().optional().nullable(),
});

export const todoUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  priority: priorityEnum.optional(),
  dueDate: z.string().datetime().optional().nullable(),
});

export const todoCompleteSchema = z.object({
  completed: z.boolean(),
});

export type TodoCreateInput = z.infer<typeof todoCreateSchema>;
export type TodoUpdateInput = z.infer<typeof todoUpdateSchema>;
export type TodoCompleteInput = z.infer<typeof todoCompleteSchema>;
