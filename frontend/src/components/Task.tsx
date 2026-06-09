"use client";
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { TaskType } from "@/types/Task";
import { Button } from "./ui/button";
import { DeleteDialog } from "./deleteDialog";
import UpdateTask from "./updateTask";
import { useCompleteTask } from "@/hooks/useTasks";
import toast from "react-hot-toast";
import { CheckCircle2, Circle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const priorityConfig: Record<string, { label: string; dot: string; bg: string }> = {
  LOW: { label: "Low", dot: "bg-blue-400", bg: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  MEDIUM: { label: "Med", dot: "bg-yellow-400", bg: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300" },
  HIGH: { label: "High", dot: "bg-orange-400", bg: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300" },
  URGENT: { label: "Urg", dot: "bg-red-400", bg: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300" },
};

const Task = ({ data }: { data: TaskType }) => {
  const queryClient = useQueryClient();
  const { mutate: completeTask } = useCompleteTask();
  const [isCompleted, setIsCompleted] = useState(data.completed ?? false);

  const formattedDate = new Date(data.createdAt ?? Date.now()).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const dueDate = data.dueDate ? new Date(data.dueDate) : null;
  const isOverdue = dueDate && !isCompleted && dueDate < new Date();
  const priority = priorityConfig[data.priority] || priorityConfig.MEDIUM;

  const formattedDueDate = dueDate
    ? dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  const handleCompleteToggle = () => {
    const newCompleted = !isCompleted;
    completeTask(
      { id: data.id, completed: newCompleted },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
          setIsCompleted(newCompleted);
          toast.success(newCompleted ? "Task completed" : "Task reopened");
        },
        onError: () => {
          setIsCompleted(!newCompleted);
          toast.error("Failed to update task");
        },
      },
    );
  };

  return (
    <div
      className={`group rounded-xl border bg-card p-5 transition-all duration-200 ${
        isCompleted
          ? "border-green-200/60 dark:border-green-900/40"
          : isOverdue
            ? "border-red-200/60 dark:border-red-900/40"
            : "border-border/60 hover:border-primary/20 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={handleCompleteToggle}
          className="mt-0.5 flex-shrink-0 transition-all duration-200"
          aria-label="Toggle completion"
        >
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground/40 transition-colors group-hover:text-primary/60" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium ${priority.bg}`}
            >
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
              isCompleted ? "text-muted-foreground/50 line-through" : "text-foreground"
            }`}
          >
            {data.title}
          </h3>

          {data.description && (
            <p
              className={`mt-1 text-xs leading-relaxed ${
                isCompleted ? "text-muted-foreground/40 line-through" : "text-muted-foreground/70"
              }`}
            >
              {data.description}
            </p>
          )}

          {formattedDueDate && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground/50">Due</span>
              <span
                className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                  isOverdue
                    ? "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
                    : isCompleted
                      ? "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
                      : "bg-secondary text-secondary-foreground"
                }`}
              >
                {formattedDueDate}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <UpdateTask data={data} />
          <DeleteDialog id={data.id}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5"
            >
              <FaTrash className="h-3.5 w-3.5" />
            </Button>
          </DeleteDialog>
        </div>
      </div>
    </div>
  );
};

export default Task;
