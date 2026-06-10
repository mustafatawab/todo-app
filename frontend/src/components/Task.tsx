"use client";
import React from "react";
import { FaTrash } from "react-icons/fa";
import { TaskType } from "@/types";
import { Button } from "./ui/button";
import { DeleteDialog } from "./deleteDialog";
import UpdateTask from "./updateTask";
import { RoleGate } from "./RoleGate";
import { useCompleteTask } from "@/hooks/useTasks";
import toast from "react-hot-toast";
import { Loader2Icon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const priorityConfig: Record<string, { label: string; dot: string; bg: string }> = {
  LOW: { label: "Low", dot: "bg-blue-400", bg: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  MEDIUM: { label: "Med", dot: "bg-yellow-400", bg: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300" },
  HIGH: { label: "High", dot: "bg-orange-400", bg: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300" },
  URGENT: { label: "Urg", dot: "bg-red-400", bg: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300" },
};

const statusConfig: Record<string, { label: string; bg: string }> = {
  TODO: { label: "To Do", bg: "bg-secondary text-secondary-foreground" },
  IN_PROGRESS: { label: "In Progress", bg: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  DONE: { label: "Done", bg: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" },
};

const Task = ({ data }: { data: TaskType }) => {
  const queryClient = useQueryClient();
  const { mutate: updateTask, isPending } = useCompleteTask();

  const formattedDate = new Date(data.createdAt ?? Date.now()).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const dueDate = data.dueDate ? new Date(data.dueDate) : null;
  const isOverdue = dueDate && data.status !== "DONE" && dueDate < new Date();
  const priority = priorityConfig[data.priority] || priorityConfig.MEDIUM;
  const status = statusConfig[data.status] || statusConfig.TODO;

  const formattedDueDate = dueDate
    ? dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  const handleStatusChange = (newStatus: "TODO" | "IN_PROGRESS" | "DONE") => {
    updateTask(
      { id: data.id, status: newStatus },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
          toast.success(newStatus === "DONE" ? "Task completed" : newStatus === "IN_PROGRESS" ? "Task in progress" : "Task reopened");
        },
        onError: () => toast.error("Failed to update task"),
      },
    );
  };

  return (
    <div
      className={`group rounded-xl border bg-card p-5 transition-all duration-200 ${
        data.status === "DONE"
          ? "border-green-200/60 dark:border-green-900/40"
          : isOverdue
            ? "border-red-200/60 dark:border-red-900/40"
            : "border-border/60 hover:border-primary/20 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start gap-4">
        <RoleGate role="MEMBER">
          {data.status === "DONE" ? (
            <button
              onClick={() => handleStatusChange("TODO")}
              className="mt-0.5 flex-shrink-0 group/btn"
            >
              <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center group-hover/btn:ring-2 group-hover/btn:ring-green-200 transition-all">
                {isPending ? <Loader2Icon className="h-3 w-3 text-white animate-spin" /> : null}
              </div>
            </button>
          ) : (
            <button
              onClick={() => handleStatusChange("DONE")}
              className="mt-0.5 flex-shrink-0 group/btn"
            >
              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 group-hover/btn:border-green-400 group-hover/btn:bg-green-50 transition-all" />
            </button>
          )}
        </RoleGate>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${status.bg}`}>
              {status.label}
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium ${priority.bg}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
              {priority.label}
            </span>
            {isOverdue && (
              <span className="rounded-md bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-600 dark:bg-red-950 dark:text-red-400">
                Overdue
              </span>
            )}
            <span className="text-[11px] text-muted-foreground/50 ml-auto">{formattedDate}</span>
          </div>

          <h3
            className={`text-sm font-medium leading-snug transition-all ${
              data.status === "DONE" ? "text-muted-foreground/50 line-through" : "text-foreground"
            }`}
          >
            {data.title}
          </h3>

          {data.description && (
            <p
              className={`mt-1 text-xs leading-relaxed ${
                data.status === "DONE" ? "text-muted-foreground/40 line-through" : "text-muted-foreground/70"
              }`}
            >
              {data.description}
            </p>
          )}

          <div className="mt-3 flex items-center gap-3 flex-wrap">
            {data.assignee && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-muted-foreground/50">Assigned to</span>
                <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium">
                  {data.assignee.name}
                </span>
              </div>
            )}
            {formattedDueDate && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-muted-foreground/50">Due</span>
                <span
                  className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                    isOverdue
                      ? "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
                      : data.status === "DONE"
                        ? "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
                        : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {formattedDueDate}
                </span>
              </div>
            )}
          </div>

          <RoleGate role="MEMBER">
            {(data.status === "TODO" || data.status === "IN_PROGRESS") && (
              <div className="mt-3 flex gap-2">
                {data.status === "TODO" && (
                  <button
                    onClick={() => handleStatusChange("IN_PROGRESS")}
                    className="inline-flex h-7 items-center rounded-md bg-secondary px-2.5 text-[11px] font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    Start
                  </button>
                )}
                {data.status === "IN_PROGRESS" && (
                  <button
                    onClick={() => handleStatusChange("TODO")}
                    className="inline-flex h-7 items-center rounded-md bg-secondary px-2.5 text-[11px] font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    Reopen
                  </button>
                )}
              </div>
            )}
          </RoleGate>
        </div>

        <RoleGate role="ADMIN">
          <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex-shrink-0">
            <UpdateTask data={data} />
            <DeleteDialog id={data.id}>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5">
                <FaTrash className="h-3.5 w-3.5" />
              </Button>
            </DeleteDialog>
          </div>
        </RoleGate>
      </div>
    </div>
  );
};

export default Task;
