import { z } from "zod";

export const priorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export const statusEnum = z.enum(["TODO", "INPROGRESS", "DONE"]);

export const todoCreateSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  
  priority: priorityEnum.default("MEDIUM"),
  dueDate: z.string().datetime().optional().nullable(),
});

export const todoUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  priority: priorityEnum.optional(),
  
  dueDate: z.string().datetime().optional().nullable(),
});

export const todoStatusSchema = z.object({
  status : statusEnum.default("TODO")
});

export type TodoCreateInput = z.infer<typeof todoCreateSchema>;
export type TodoUpdateInput = z.infer<typeof todoUpdateSchema>;
export type TodoStatusInput = z.infer<typeof todoStatusSchema>;
