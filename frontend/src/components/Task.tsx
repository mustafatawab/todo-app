"use client";
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { TaskType } from "@/types/Task";
import { Button } from "./ui/button";
import { DeleteDialog } from "./deleteDialog";
import UpdateTask from "./updateTask";
import { useCompleteTask } from "@/hooks/useTasks";
import toast from "react-hot-toast";
import { CheckCircle2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const priorityConfig: Record<string, { label: string; color: string; border: string }> = {
  LOW: { label: "LOW", color: "text-blue-400 border-blue-400/30 bg-blue-400/5", border: "border-l-blue-400/40" },
  MEDIUM: { label: "MED", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5", border: "border-l-yellow-400/40" },
  HIGH: { label: "HIGH", color: "text-orange-400 border-orange-400/30 bg-orange-400/5", border: "border-l-orange-400/40" },
  URGENT: { label: "URG", color: "text-red-400 border-red-400/30 bg-red-400/5", border: "border-l-red-400/50" },
};

const Task = ({ data }: { data: TaskType }) => {
  const queryClient = useQueryClient();
  const { mutate: completeTask } = useCompleteTask();
  const [isCompleted, setIsCompleted] = useState(data.completed ?? false);

  const formattedDate = new Date(
    data.createdAt ?? Date.now(),
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
          toast.success(newCompleted ? "Task completed!" : "Task marked incomplete");
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
          setIsCompleted(!newCompleted); // Optimistically update UI
        },
        onError: () => {
          setIsCompleted(!newCompleted);
          toast.error("Failed to update task");
        },
      },
    );
  };

  return (
    <div className={`group relative bg-card backdrop-blur-md border transition-all duration-300 overflow-hidden ${
      isCompleted
        ? "border-green-500/40 hover:border-green-500/60"
        : isOverdue
          ? "border-red-400/30 hover:border-red-400/50"
          : "border-primary/10 hover:border-primary/30"
    }`}>
      <div className={`absolute top-0 left-0 right-0 h-[2px] transition-colors duration-300 ${
        isCompleted ? "bg-green-500/40 group-hover:bg-green-500" : isOverdue ? "bg-red-400/40 group-hover:bg-red-400" : "bg-primary/20 group-hover:bg-primary"
      }`} />

      <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute top-2 right-2 w-2 h-px bg-primary" />
        <div className="absolute top-2 right-2 w-px h-2 bg-primary" />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-[0.2em]">
                Task ID
              </span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">
                # T-{data.id.slice(-3)}
              </span>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider border px-1.5 py-0.5 ${priority.color}`}>
                {priority.label}
              </span>
              {isOverdue && (
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400 border border-red-400/30 bg-red-400/5 px-1.5 py-0.5 animate-pulse">
                  OVERDUE
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={handleCompleteToggle}
                className="flex-shrink-0 flex items-center justify-center w-6 h-6 border-2 border-primary/40 hover:border-primary transition-all duration-200 group/checkbox"
                aria-label="Toggle task completion"
              >
                {isCompleted && (
                  <CheckCircle2 className="w-4 h-4 text-primary animate-in zoom-in-50 duration-200" />
                )}
              </button>
              <h3
                className={`text-xl font-bold tracking-tight transition-all duration-300 ${
                  isCompleted
                    ? "text-foreground/50 line-through opacity-60"
                    : "text-foreground/90 group-hover:text-primary"
                }`}
              >
                {data.title}
              </h3>
            </div>
          </div>
          <div className="text-right shrink-0 ml-4">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">
              Timestamp
            </span>
            <time className="text-[10px] font-mono font-medium text-foreground/70 bg-secondary/50 px-2 py-0.5 border border-border/40">
              {formattedDate}
            </time>
          </div>
        </div>

        <p className={`text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3 font-medium transition-all duration-300 ${isCompleted ? "opacity-50 line-through" : "opacity-80"}`}>
          {data.description}
        </p>

        {formattedDueDate && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
              Deadline
            </span>
            <span className={`text-[10px] font-mono font-medium border px-1.5 py-0.5 ${
              isOverdue
                ? "text-red-400 border-red-400/30 bg-red-400/5"
                : isCompleted
                  ? "text-green-400 border-green-400/30 bg-green-400/5"
                  : "text-foreground/70 border-border/40 bg-secondary/50"
            }`}>
              {formattedDueDate}
            </span>
          </div>
        )}

        <div className="flex justify-end items-center gap-1 pt-4 border-t border-border/20">
          <UpdateTask data={data} />
          <div className="w-px h-4 bg-border/40 mx-1" />
          <DeleteDialog id={data.id}>
            <div className="p-2 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 transition-all duration-200 cursor-pointer">
              <FaTrash className="w-3.5 h-3.5" />
            </div>
          </DeleteDialog>
        </div>
      </div>
    </div>
  );
};

export default Task;
