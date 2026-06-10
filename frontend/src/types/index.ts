export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type Role = "ADMIN" | "MEMBER";

export type User = {
  id: string;
  name: string;
  email: string;
  username?: string;
  createdAt?: string;
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  role: Role;
  createdAt?: string;
};

export type Member = {
  id: string;
  userId: string;
  name: string;
  email: string;
  username?: string;
  role: Role;
  joinedAt?: string;
};

export type TaskType = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string | null;
  createdAt?: string;
  assignee?: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdBy?: {
    id: string;
    name: string;
  } | null;
};
