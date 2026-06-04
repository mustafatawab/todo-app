export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TaskType = {
  id: string;
  title: string;
  completed: boolean;
  description: string;
  priority: Priority;
  dueDate?: string | null;
  createdAt?: string;
};
